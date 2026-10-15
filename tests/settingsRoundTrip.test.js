// Pins the settings round-trip: the generic localStorage hook plus the real
// parsers must survive a remount with the configured value, because a slider
// that silently reverts to its default is exactly what "my setting reset after
// restart" looks like.
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const Module = require('node:module');
const path = require('node:path');

const blurSource = require('node:fs').readFileSync(path.join(__dirname, '../src/blur.ts'), 'utf8');

/**
 * Loads src/hooks.ts together with the real parsers and a fake window, so the
 * hook under test is the shipped one rather than a re-implementation.
 */
function loadHook() {
  const hooksSource = require('node:fs').readFileSync(path.join(__dirname, '../src/hooks.ts'), 'utf8');
  const combined = `
    ${hooksSource.replace(/export function/g, 'function')}
    ${blurSource.replace(/export (function|const)/g, '$1')}
    export { useLocalStorage, parseBackgroundBlur, parseBlurPulseStrength, parseBlurTransition, parseBackgroundBrightness, parseBackgroundScale };
  `;
  const compiled = new Module(__filename);
  compiled._compile(buildSync({ stdin: { contents: combined, resolveDir: path.join(__dirname, '..'), loader: 'ts' }, bundle: true, platform: 'node', format: 'cjs', write: false }).outputFiles[0].text, __filename);
  return compiled.exports;
}

/**
 * Minimal hook harness: useState/useRef semantics are enough for this hook, and
 * stubbing React keeps the test focused on storage behaviour.
 */
function renderHook(factory) {
  let hookIndex = 0;
  const states = [];
  const fakeReact = {
    useState(initial) {
      const index = hookIndex++;
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
      return [states[index], value => {
        states[index] = typeof value === 'function' ? value(states[index]) : value;
      }];
    },
    useEffect() {},
    useRef(initial) {
      const index = hookIndex++;
      if (!(index in states)) states[index] = { current: initial };
      return states[index];
    },
  };
  const previous = globalThis.React;
  globalThis.React = fakeReact;
  try {
    hookIndex = 0;
    return factory();
  } finally {
    globalThis.React = previous;
  }
}

function withStorage(initial, fn) {
  const storage = new Map(initial);
  const previous = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: key => (storage.has(key) ? storage.get(key) : null),
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: key => storage.delete(key),
    },
  };
  try {
    return fn(storage);
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
}

const {
  useLocalStorage, parseBackgroundBlur, parseBackgroundScale,
  parseBackgroundBrightness, parseBlurPulseStrength, parseBlurTransition,
} = loadHook();

const CASES = [
  ['cc.microblock.bgenhanced.backgrounblur', 0, parseBackgroundBlur, 33],
  ['cc.microblock.bgenhanced.backgroundscale', 1, parseBackgroundScale, 1.75],
  ['cc.microblock.bgenhanced.backgroundbrightness', 1, parseBackgroundBrightness, 0.4],
  ['cc.microblock.bgenhanced.blurpulsestrength', 10, parseBlurPulseStrength, 25],
  ['cc.microblock.bgenhanced.blurtransition', 160, parseBlurTransition, 300],
];

test('a slider change is written to storage and read back on the next mount', () => {
  const [key, fallback, parse, next] = CASES[0];
  withStorage([], storage => {
    const [value, setValue] = renderHook(() => useLocalStorage(key, fallback, parse));
    assert.equal(value, fallback, 'the default applies when nothing is stored');
    setValue(next);
    assert.equal(storage.get(key), String(next), 'the write must land in localStorage');
  });

  // Fresh mount against the same storage = a restart.
  withStorage([[key, String(next)]], () => {
    const [value] = renderHook(() => useLocalStorage(key, fallback, parse));
    assert.equal(value, next, 'the stored value must win over the default');
  });
});

test('every numeric setting survives the same round-trip', () => {
  for (const [key, fallback, parse, next] of CASES) {
    withStorage([], storage => {
      const [, setValue] = renderHook(() => useLocalStorage(key, fallback, parse));
      setValue(next);
      assert.equal(storage.get(key), String(next), `${key} must be written`);
    });
    withStorage([[key, String(next)]], () => {
      const [value] = renderHook(() => useLocalStorage(key, fallback, parse));
      assert.equal(value, next, `${key} must be restored`);
    });
  }
});

test('a corrupt stored value is repaired to the default instead of propagating', () => {
  const [key, fallback, parse] = CASES[0];
  withStorage([[key, 'undefined']], storage => {
    const [value] = renderHook(() => useLocalStorage(key, fallback, parse));
    assert.equal(value, fallback);
    assert.equal(storage.get(key), 'undefined', 'the hook must not rewrite on read');
  });
});
