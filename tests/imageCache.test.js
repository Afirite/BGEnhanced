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
  prepareImage, cachedImagePath, resolvedImagePath, mountedImageUrl, inspectImage, optimizeImage,
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

function installCanvasFs({ width = 4000, height = 2000, outputBytes = 200, wrongMime = false, failWrite = false, sourceBytes } = {}) {
  const files = new Map([['source.png', sourceBytes ? new Blob([sourceBytes]) : new Blob([new Uint8Array(1024)])]]);
  const state = { draws: [], fills: [], encodes: [], closed: 0, writes: 0, failWrite };
  globalThis.createImageBitmap = async blob => ({ width: blob.width || width, height: blob.height || height, close: () => state.closed++ });
  globalThis.document.createElement = () => {
    const canvas = { width: 0, height: 0,
      getContext: () => ({ fillStyle: '', fillRect: (...args) => state.fills.push(args), drawImage: (...args) => state.draws.push(args.slice(1)) }),
      toBlob: (callback, mime, quality) => {
        state.encodes.push({ mime, quality });
        const blob = new Blob([new Uint8Array(outputBytes)], { type: wrongMime ? 'image/png' : mime });
        blob.width = canvas.width; blob.height = canvas.height;
        callback(blob);
      },
    };
    return canvas;
  };
  globalThis.betterncm = { fs: {
    mkdir: async () => true,
    readFile: async target => { if (!files.has(target)) throw new Error('missing'); return files.get(target); },
    exists: async target => files.has(target),
    writeFile: async (target, blob) => { if (state.failWrite) throw new Error('write failed'); files.set(target, blob); state.writes++; return true; },
    mountFile: async target => 'mounted:' + target,
  } };
  return { state, files };
}

test('inspectImage reports dimensions/bytes and closes the decoded bitmap', async () => {
  const { state } = installCanvasFs();
  assert.deepEqual(await inspectImage('source.png'), { width: 4000, height: 2000, bytes: 1024 });
  assert.equal(state.closed, 1);
});

test('JPEG encoding uses selected quality, white background and a cached smaller copy', async () => {
  const { state } = installCanvasFs();
  const options = { format: 'jpeg', quality: 0.7 };
  const result = await optimizeImage('source.png', 2000, '/jpeg-success', options);
  assert.equal(result.status, 'optimized');
  assert.match(result.path, /-v2-2000w-0.7.jpeg$/);
  assert.deepEqual(result.source, { width: 4000, height: 2000, bytes: 1024 });
  assert.deepEqual(result.output, { width: 2000, height: 1000, bytes: 200 });
  assert.deepEqual(state.encodes, [{ mime: 'image/jpeg', quality: 0.7 }]);
  assert.deepEqual(state.fills, [[0, 0, 2000, 1000]]);
  assert.equal(await prepareImage('source.png', 2000, '/jpeg-success', options), result.path);
  assert.equal(await cachedImagePath('source.png', 2000, '/jpeg-success', options), result.path);
  assert.equal(await resolvedImagePath('source.png', 2000, '/jpeg-success', options), result.path);
  assert.equal(await mountedImageUrl('source.png', 2000, '/jpeg-success', options), 'mounted:' + result.path);
  assert.equal(state.writes, 1);
  assert.equal(state.encodes.length, 1);
  // A new module instance models a restart and must read the persistent result.
  const restarted = compile('src/imageCache.ts');
  const cached = await restarted.optimizeImage('source.png', 2000, '/jpeg-success', options);
  assert.equal(cached.status, 'cached');
  assert.deepEqual(cached.output, result.output);
});

test('larger output keeps the source and memoizes the no-benefit result', async () => {
  const { state } = installCanvasFs({ outputBytes: 2048 });
  const options = { format: 'webp', quality: 0.86 };
  const result = await optimizeImage('source.png', 2000, '/unchanged', options);
  assert.equal(result.status, 'unchanged');
  assert.equal(result.path, '');
  assert.deepEqual(result.output, result.source);
  assert.equal(await prepareImage('source.png', 2000, '/unchanged', options), '');
  assert.equal(state.encodes.length, 1);
  assert.equal(state.writes, 0);
});

test('failed writes can retry; unsupported encoder MIME never gets a misleading extension', async () => {
  const { state } = installCanvasFs({ failWrite: true });
  const options = { format: 'webp', quality: 0.86 };
  assert.equal((await optimizeImage('source.png', 2000, '/retry', options)).status, 'failed');
  state.failWrite = false;
  assert.ok(await prepareImage('source.png', 2000, '/retry', options));
  assert.equal(state.encodes.length, 2);
  const wrong = installCanvasFs({ wrongMime: true });
  const failed = await optimizeImage('source.png', 2000, '/wrong-mime', options);
  assert.equal(failed.status, 'failed'); assert.equal(failed.path, '');
  assert.equal(wrong.state.writes, 0);
  assert.equal(wrong.state.closed, 2);
});

test('format/quality/plugin/content isolate caches and normalize quality', async () => {
  const { files, state } = installCanvasFs();
  const first = await optimizeImage('source.png', 2000, '/isolation', { format: 'webp', quality: 0.6 });
  const second = await optimizeImage('source.png', 2000, '/isolation', { format: 'jpeg', quality: 0.6 });
  const third = await optimizeImage('source.png', 2000, '/isolation', { format: 'webp', quality: 0.8 });
  const otherPlugin = await optimizeImage('source.png', 2000, '/another-plugin', { format: 'webp', quality: 0.6 });
  files.set('source.png', new Blob([new Uint8Array(1024).fill(1)]));
  assert.equal(await cachedImagePath('source.png', 2000, '/isolation', { format: 'webp', quality: 0.6 }), '');
  const changed = await optimizeImage('source.png', 2000, '/isolation', { format: 'webp', quality: 0.6 });
  assert.equal(new Set([first.path, second.path, third.path, otherPlugin.path, changed.path]).size, 5);
  await optimizeImage('source.png', 2000, '/low-quality', { format: 'webp', quality: -1 });
  await optimizeImage('source.png', 2000, '/high-quality', { format: 'webp', quality: 2 });
  await optimizeImage('source.png', 2000, '/default-quality', { format: 'webp', quality: NaN });
  assert.deepEqual(state.encodes.slice(-3).map(x => x.quality), [0.1, 1, 0.86]);
});

test('never upscales and explicit options allow maxEdge zero to preserve resolution', async () => {
  const { state } = installCanvasFs({ width: 800, height: 600 });
  const options = { format: 'webp', quality: 0.86 };
  assert.deepEqual((await optimizeImage('source.png', 2000, '/no-upscale', options)).output, { width: 800, height: 600, bytes: 200 });
  assert.deepEqual((await optimizeImage('source.png', 0, '/original-resolution', options)).output, { width: 800, height: 600, bytes: 200 });
  assert.equal(await prepareImage('source.png', 0, '/legacy-disabled'), '');
  assert.deepEqual(state.draws, [[0, 0, 800, 600], [0, 0, 800, 600]]);
});

test('PNG/WebP animation chunks and disguised GIFs are not compressed', async () => {
  const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), Buffer.from([0,0,0,8]), Buffer.from('acTL'), Buffer.alloc(12)]);
  const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBPANIM'), Buffer.alloc(4)]);
  for (const [index, sourceBytes] of [png, webp, Buffer.from('GIF89a')].entries()) {
    const { state } = installCanvasFs({ sourceBytes });
    const result = await optimizeImage('source.png', 2000, '/animated-' + index, { format: 'webp', quality: 0.86 });
    assert.equal(result.status, 'skipped');
    assert.equal(result.path, ''); assert.equal(state.encodes.length, 0);
  }
});

test('decode failure falls back and the same request can recover', async () => {
  const { state } = installCanvasFs();
  const decode = globalThis.createImageBitmap;
  globalThis.createImageBitmap = async () => { throw new Error('decode failed'); };
  const options = { format: 'webp', quality: 0.86 };
  await assert.rejects(inspectImage('source.png'), /decode failed/);
  const failed = await optimizeImage('source.png', 2000, '/decode-retry', options);
  assert.equal(failed.status, 'failed'); assert.equal(failed.path, '');
  assert.equal(failed.source.bytes, 1024);
  assert.equal(await prepareImage('missing.png', 2000, '/decode-retry', options), '');
  globalThis.createImageBitmap = decode;
  assert.ok(await prepareImage('source.png', 2000, '/decode-retry', options));
  assert.equal(state.closed, 2);
});

test('concurrent callers share one encoding pass', async () => {
  const { state } = installCanvasFs();
  const options = { format: 'webp', quality: 0.86 };
  const results = await Promise.all(Array.from({ length: 4 }, () => optimizeImage('source.png', 2000, '/concurrent', options)));
  assert.ok(results.every(result => result.path && result.path === results[0].path));
  assert.equal(state.encodes.length, 1);
  assert.equal(state.writes, 1);
});
