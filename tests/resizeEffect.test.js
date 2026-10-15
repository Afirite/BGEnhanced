const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const Module = require('node:module');
const path = require('node:path');

function compile(entry) {
  const compiled = new Module(__filename);
  compiled._compile(buildSync({ entryPoints: [path.join(__dirname, '..', entry)], bundle: true, platform: 'node', format: 'cjs', write: false }).outputFiles[0].text, __filename);
  return compiled.exports;
}

const { watchBlurPulse } = compile('src/resizeEffect.ts');

function fakeWindow(reduced = false) {
  const listeners = new Map();
  const timers = new Map();
  let nextId = 1;
  return {
    listeners, timers,
    matchMedia: () => ({ matches: reduced }),
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: name => listeners.delete(name),
    setTimeout: (callback, delay) => { const id = nextId++; timers.set(id, { callback, delay }); return id; },
    clearTimeout: id => timers.delete(id),
    resize: () => listeners.get('resize')?.(),
    finish: () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(({ callback }) => callback()); }
  };
}

test('resize burst uses one pulse and one settling timer of the configured length', () => {
  const host = fakeWindow();
  const changes = [];
  const cleanup = watchBlurPulse(host, 10, 400, active => changes.push(active));
  host.resize(); host.resize(); host.resize();
  assert.deepEqual(changes, [true]);
  assert.equal(host.timers.size, 1);
  assert.equal([...host.timers.values()][0].delay, 400);
  host.finish();
  assert.deepEqual(changes, [true, false]);
  cleanup();
  assert.equal(host.listeners.size, 0);
});

test('zero strength or zero duration disables the pulse without a listener', () => {
  for (const [strength, duration] of [[0, 400], [10, 0], [0, 0], [Number.NaN, 400]]) {
    const host = fakeWindow();
    const changes = [];
    const cleanup = watchBlurPulse(host, strength, duration, active => changes.push(active));
    host.resize();
    assert.deepEqual(changes, []);
    assert.equal(host.listeners.size, 0);
    cleanup();
  }
});

test('reduced-motion preference disables the pulse', () => {
  const host = fakeWindow(true);
  const changes = [];
  const cleanup = watchBlurPulse(host, 10, 400, active => changes.push(active));
  host.resize();
  assert.deepEqual(changes, []);
  assert.equal(host.listeners.size, 0);
  cleanup();
});

test('cleanup during an active pulse clears the timer and ends the pulse', () => {
  const host = fakeWindow();
  const changes = [];
  const cleanup = watchBlurPulse(host, 10, 400, active => changes.push(active));
  host.resize();
  cleanup();
  assert.equal(host.listeners.size, 0);
  assert.equal(host.timers.size, 0);
  assert.deepEqual(changes, [true, false]);
  host.finish();
  assert.deepEqual(changes, [true, false], 'a cleared settling timer must not fire again');
});
