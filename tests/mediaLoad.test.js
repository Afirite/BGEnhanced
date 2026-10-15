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

function installDom() {
  const links = [];
  const created = [];
  globalThis.document = {
    head: { appendChild: link => links.push(link) },
    querySelector: selector => {
      const match = /data-bge-preload="(.*)"\]/.exec(selector);
      if (!match) return null;
      return links.find(link => link.attrs['data-bge-preload'] === match[1]) ?? null;
    },
    querySelectorAll: () => links,
    createElement: () => {
      const link = { attrs: {}, setAttribute: (name, value) => { link.attrs[name] = String(value); } };
      created.push(link);
      return link;
    },
  };
  globalThis.CSS = { escape: value => String(value) };
  const images = [];
  globalThis.Image = class {
    constructor() { images.push(this); }
    set src(value) {
      this._src = value;
      // Resolve asynchronously, like a real decode would.
      Promise.resolve().then(() => this.onload && this.onload());
    }
  };
  return { links, images };
}

installDom();
const { mountFileCached, preloadBackground, preloadBackgrounds, preloadLinkCount } = compile('src/mediaLoad.ts');

test('the same file is mounted once and the result is reused', async () => {
  globalThis.betterncm = { fs: { mountFile: async file => { globalThis.mountCalls.push(file); return `mounted:${file}`; } } };
  globalThis.mountCalls = [];
  const first = await mountFileCached('C:/bg/a.png');
  const second = await mountFileCached('C:/bg/a.png');
  assert.equal(first, 'mounted:C:/bg/a.png');
  assert.equal(second, first);
  assert.deepEqual(globalThis.mountCalls, ['C:/bg/a.png']);
  assert.equal(await mountFileCached(''), '', 'an empty path must not reach the host');
  assert.deepEqual(globalThis.mountCalls, ['C:/bg/a.png']);
});

test('preloading the same url twice requests it once', async () => {
  const { links, images } = installDom();
  const first = await preloadBackground({ resolveImageUrl: async () => 'http://localhost:1/local/b.png' });
  const second = await preloadBackground({ resolveImageUrl: async () => 'http://localhost:1/local/b.png' });
  assert.equal(first, 'http://localhost:1/local/b.png');
  assert.equal(second, first, 'the shared request still yields the url to both callers');
  assert.equal(preloadLinkCount(), 1);
  assert.equal(links.length, 1);
  assert.equal(links[0].rel, 'preload');
  assert.equal(links[0].as, 'image');
  assert.equal(links[0].href, 'http://localhost:1/local/b.png');
  assert.equal(images.length, 1, 'one decode is shared, not repeated');
});

test('preload accepts a background, a bare url and nothing at all', async () => {
  const { links } = installDom();
  let mounted = '';
  globalThis.betterncm = { fs: { mountFile: async file => { mounted = file; return 'mounted:c.png'; } } };
  const background = { resolveImageUrl: async () => mountFileCached('c.png') };

  assert.equal(await preloadBackground(background), 'mounted:c.png');
  assert.equal(mounted, 'c.png');
  assert.equal(await preloadBackground('https://example.invalid/d.png'), 'https://example.invalid/d.png');
  assert.equal(await preloadBackground(null), '');
  assert.equal(await preloadBackground(undefined), '');
  assert.equal(await preloadBackground({}), '');
  assert.equal(links.length, 2);
});

test('a failing mount stays retryable and never rejects the caller', async () => {
  let attempts = 0;
  globalThis.betterncm = {
    fs: {
      mountFile: async () => {
        attempts++;
        if (attempts === 1) throw new Error('host unavailable');
        return 'mounted:retry.png';
      },
    },
  };
  const failing = { resolveImageUrl: async () => mountFileCached('retry.png') };
  assert.equal(await preloadBackground(failing), '', 'a broken mount must resolve to empty');
  assert.equal(await preloadBackground(failing), 'mounted:retry.png');
  assert.equal(attempts, 2, 'the failed mount must not be cached');
});

test('preloadBackgrounds tolerates a non-array argument', () => {
  assert.doesNotThrow(() => preloadBackgrounds(undefined));
});
