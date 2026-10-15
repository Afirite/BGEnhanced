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

// mediaLoad touches document/CSS at module scope, so provide the minimum.
globalThis.document = { head: { appendChild() {} }, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ setAttribute() {} }) };
globalThis.CSS = { escape: value => String(value) };

const {
  fitWithin, hashPath, cacheFileName, compressibleKind, formatBytes,
  prepareImage, cachedImagePath, resolvedImagePath, mountedImageUrl,
  CACHE_FOLDER, THUMBNAIL_MAX_EDGE,
} = compile('src/imageCache.ts');

function installFs({ existing = [], failMkdir = false } = {}) {
  const writes = [];
  globalThis.betterncm = {
    fs: {
      mkdir: async () => { if (failMkdir) throw new Error('denied'); return true; },
      exists: async target => existing.includes(target),
      readFile: async () => new Blob([new Uint8Array(1024)]),
      writeFile: async (target, blob) => { writes.push([target, blob]); return true; },
      mountFile: async target => `mounted:${target}`,
    },
  };
  return writes;
}

test('fitWithin scales down to the box and never upscales', () => {
  assert.deepEqual(fitWithin({ width: 4000, height: 2000 }, 2000), { width: 2000, height: 1000 });
  assert.deepEqual(fitWithin({ width: 1000, height: 4000 }, 2000), { width: 500, height: 2000 });
  assert.deepEqual(fitWithin({ width: 800, height: 600 }, 2000), { width: 800, height: 600 });
  assert.deepEqual(fitWithin({ width: 0, height: 600 }, 2000), { width: 0, height: 0 });
  assert.deepEqual(fitWithin({ width: 800, height: 600 }, 0), { width: 0, height: 0 });
});

test('the cache file name is stable, per path and per size', () => {
  const first = cacheFileName('C:/bg/a.png', 2560);
  assert.equal(first, cacheFileName('C:/bg/a.png', 2560));
  assert.notEqual(first, cacheFileName('C:/bg/b.png', 2560));
  assert.notEqual(first, cacheFileName('C:/bg/a.png', 1920));
  assert.match(first, /^[0-9a-z]+-2560w\.webp$/);
  assert.equal(hashPath('C:/bg/a.png'), hashPath('C:/bg/a.png'));
  assert.notEqual(hashPath('a'), hashPath('b'));
});

test('animated and unsupported formats are never re-encoded', () => {
  for (const file of ['a.gif', 'a.GIF', 'a.apng', 'a.svg', 'a.bmp', 'a.ico']) {
    assert.equal(compressibleKind(file), 'skip', file);
  }
  for (const file of ['a.mp4', 'a.webm', 'a.mov', 'a.mkv', 'a.avi']) {
    assert.equal(compressibleKind(file), 'skip', file);
  }
  for (const file of ['a.jpg', 'a.JPEG', 'a.png', 'a.webp', 'a.avif']) {
    assert.equal(compressibleKind(file), 'compress', file);
  }
  assert.equal(compressibleKind('no-extension'), 'thumbnail');
  assert.equal(compressibleKind('a.psd'), 'thumbnail');
  assert.equal(compressibleKind('C:/x/a.png?x=1'), 'compress');
});

test('bytes are reported in a readable unit', () => {
  assert.equal(formatBytes(0), '0 KB');
  assert.equal(formatBytes(2048), '2 KB');
  assert.equal(formatBytes(5 * 1024 * 1024), '5.0 MB');
  assert.equal(formatBytes(Number.NaN), '0 KB');
});

test('prepareImage refuses work that cannot pay off', async () => {
  installFs();
  assert.equal(await prepareImage('a.gif', 2560, '/plugins/BGEnhanced'), '', 'animated');
  assert.equal(await prepareImage('a.mp4', 2560, '/plugins/BGEnhanced'), '', 'video');
  assert.equal(await prepareImage('a.png', 0, '/plugins/BGEnhanced'), '', 'disabled');
  assert.equal(await prepareImage('', 2560, '/plugins/BGEnhanced'), '', 'no path');
});

test('cachedImagePath reports only a copy that already exists', async () => {
  const target = `/plugins/BGEnhanced/${CACHE_FOLDER}/${cacheFileName('a.png', 2560)}`;
  installFs({ existing: [target] });
  assert.equal(await cachedImagePath('a.png', 2560, '/plugins/BGEnhanced'), target);
  assert.equal(await resolvedImagePath('a.png', 2560, '/plugins/BGEnhanced'), target);
  assert.equal(await mountedImageUrl('a.png', 2560, '/plugins/BGEnhanced'), `mounted:${target}`);

  installFs({ existing: [] });
  assert.equal(await cachedImagePath('a.png', 2560, '/plugins/BGEnhanced'), '');
  assert.equal(await resolvedImagePath('a.png', 2560, '/plugins/BGEnhanced'), 'a.png');
  assert.equal(await mountedImageUrl('a.png', 2560, '/plugins/BGEnhanced'), 'mounted:a.png');

  installFs({ failMkdir: true });
  assert.equal(await cachedImagePath('a.png', 2560, '/plugins/BGEnhanced'), '', 'a broken host must not throw');
  assert.equal(await resolvedImagePath('a.png', 2560, '/plugins/BGEnhanced'), 'a.png');
});

test('the plugin cache directory keeps the configured size in the name', () => {
  assert.equal(THUMBNAIL_MAX_EDGE, 48);
  assert.notEqual(cacheFileName('a.png', 2560), cacheFileName('a.png', 1280));
});
