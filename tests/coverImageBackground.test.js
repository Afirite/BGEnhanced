const test = require("node:test");
const assert = require("node:assert/strict");
const { build } = require("esbuild");
const Module = require("node:module");
const path = require("node:path");

let CoverImageBackground;
test.before(async () => {
    const result = await build({
        entryPoints: [path.join(__dirname, "../src/background/coverImageBackground.tsx")],
        bundle: true, platform: "node", format: "cjs", write: false,
        jsxFactory: "h", jsxFragment: "f",
        plugins: [{ name: "cover-host-stubs", setup(build) {
            build.onResolve({ filter: /^[.][/]background$/ }, () => ({ path: "base", namespace: "stub" }));
            build.onResolve({ filter: /^[.][.][/]mediaLoad$/ }, () => ({ path: "media", namespace: "stub" }));
            build.onLoad({ filter: /.*/, namespace: "stub" }, args => ({
                contents: args.path === "base" ? "export class BaseBackground {}"
                    : "export const preloadBackground = url => global.__coverPreload(url);",
                loader: "js"
            }));
        } }]
    });
    const compiled = new Module(__filename);
    compiled._compile(result.outputFiles[0].text, __filename);
    ({ CoverImageBackground } = compiled.exports);
});

function element(classes = "", children = [], src = "") {
    return {
        nodeType: 1, classes: new Set(classes.split(" ")), children, src,
        matches(selector) {
            assert.equal(selector, ".normal.j-cover, .cmd-image");
            return this.classes.has("cmd-image") || (this.classes.has("normal") && this.classes.has("j-cover"));
        },
        querySelector(selector) {
            for (const child of this.children) {
                if (child.nodeType !== 1) continue;
                if (child.matches(selector)) return child;
                const nested = child.querySelector(selector);
                if (nested) return nested;
            }
            return null;
        }
    };
}
const srcChange = target => ({ type: "attributes", attributeName: "src", target });
const childrenChange = (addedNodes = [], removedNodes = []) => ({ type: "childList", addedNodes, removedNodes });

async function mount(cover = element("normal j-cover", [], "https://cover.test/a.jpg"), preview = false) {
    const root = element("", cover ? [cover] : []);
    const frames = new Map(), images = [], preloads = [], states = [], cancelled = [];
    let observer, queries = 0, frameId = 0, cleanup;
    global.document = {
        body: root, baseURI: "https://host.test/",
        querySelector(selector) { queries++; return root.querySelector(selector); }
    };
    global.MutationObserver = class {
        constructor(callback) { this.callback = callback; observer = this; }
        observe(target, options) { this.target = target; this.options = options; }
        disconnect() { this.disconnected = true; }
    };
    global.requestAnimationFrame = callback => { frames.set(frameId, callback); return frameId++; };
    global.cancelAnimationFrame = id => { cancelled.push(id); frames.delete(id); };
    global.Image = class { constructor() { images.push(this); } };
    global.__coverPreload = url => preloads.push(url);
    global.h = (type, props, ...children) => ({ type, props: props || {}, children });
    global.React = {
        useState: initial => [initial, value => states.push(value)],
        useRef: initial => ({ current: initial }),
        useEffect: effect => { cleanup = effect(); }
    };
    const background = new CoverImageBackground();
    const vnode = preview ? (await background.previewBackground())() : await background.backgroundElement();
    vnode.type(vnode.props);
    return {
        root, cover, images, preloads, states, frames, cancelled, observer,
        get queries() { return queries; },
        emit(...records) { observer.callback(records); },
        flush() { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback()); },
        unmount() { cleanup(); }
    };
}

test("initial mount queries and starts loading immediately, including preview", async () => {
    for (const preview of [false, true]) {
        const env = await mount(undefined, preview);
        assert.equal(env.queries, 1);
        assert.deepEqual(env.preloads, ["https://cover.test/a.jpg"]);
        assert.equal(env.frames.size, 0);
        assert.equal(env.observer.target, env.root);
        assert.deepEqual(env.observer.options, {
            subtree: true, childList: true, attributes: true, attributeFilter: ["src"]
        });
        env.images[0].onload();
        assert.deepEqual(env.states, ["https://cover.test/a.jpg"]);
        env.unmount();
    }
});

test("unrelated src, text and subtree changes do not query or schedule frames", async () => {
    const env = await mount();
    const text = { nodeType: 3 };
    for (let i = 0; i < 100; i++) {
        env.emit(srcChange(element("avatar")), srcChange(element("BGE-coverImageBG-a")),
            childrenChange([element("", [element("unrelated"), text])], [text]),
            { type: "characterData", target: text });
    }
    assert.equal(env.frames.size, 0);
    assert.equal(env.queries, 1);
    assert.equal(env.images.length, 1);
    env.unmount();
});

test("cover src bursts across observer deliveries query once per frame using final URL", async () => {
    const env = await mount();
    for (let i = 0; i < 20; i++) {
        env.cover.src = "https://cover.test/" + i + ".jpg";
        env.emit(srcChange(env.cover));
    }
    assert.equal(env.queries, 1);
    assert.equal(env.frames.size, 1);
    env.flush();
    assert.equal(env.queries, 2);
    assert.deepEqual(env.preloads, ["https://cover.test/a.jpg", "https://cover.test/19.jpg"]);
    env.cover.src = "https://cover.test/next.jpg";
    env.emit(srcChange(env.cover));
    env.flush();
    assert.equal(env.queries, 3);
    assert.equal(env.images.at(-1).src, "https://cover.test/next.jpg");
    env.unmount();
});

test("late cover insertion and replacement via ancestors both update", async () => {
    const env = await mount(null);
    assert.equal(env.images.length, 0);
    const first = element("cmd-image", [], "https://cover.test/first.jpg");
    const ancestor = element("panel", [element("wrapper", [first])]);
    env.root.children = [ancestor];
    env.emit(childrenChange([ancestor]));
    env.flush();
    assert.equal(env.images.at(-1).src, first.src);
    const second = element("normal j-cover", [], "https://cover.test/second.jpg");
    env.root.children = [second];
    env.emit(childrenChange([second], [ancestor]));
    env.flush();
    assert.equal(env.images.at(-1).src, second.src);
    assert.equal(env.queries, 3);
    env.unmount();
});

test("removing a cover ancestor reselects the remaining cover", async () => {
    const env = await mount();
    const ancestor = element("", [env.cover]);
    const fallback = element("cmd-image", [], "https://cover.test/fallback.jpg");
    env.root.children = [ancestor, fallback];
    env.root.children = [fallback];
    env.emit(childrenChange([], [ancestor]));
    env.flush();
    assert.equal(env.images.at(-1).src, fallback.src);
    env.root.children = [];
    env.emit(childrenChange([], [fallback]));
    env.flush();
    assert.equal(env.queries, 3);
    assert.equal(env.images.length, 2);
    env.unmount();
});

test("unchanged URLs avoid duplicate loads and failed loads can retry", async () => {
    const env = await mount();
    env.emit(srcChange(env.cover));
    env.flush();
    assert.equal(env.images.length, 1);
    env.images[0].onerror();
    env.emit(srcChange(env.cover));
    env.flush();
    assert.equal(env.images.length, 2);
    env.images[1].onload();
    assert.deepEqual(env.states, [env.cover.src]);
    env.unmount();
});

test("superseded image completion cannot replace the current cover", async () => {
    const env = await mount();
    const staleLoad = env.images[0].onload;
    env.cover.src = "https://cover.test/new.jpg";
    env.emit(srcChange(env.cover));
    env.flush();
    assert.equal(env.images[0].onload, null);
    assert.equal(env.images[0].onerror, null);
    staleLoad();
    assert.deepEqual(env.states, []);
    env.images[1].onload();
    assert.deepEqual(env.states, [env.cover.src]);
    env.unmount();
});

test("unmount cancels frame zero, disconnects, clears image handlers and guards late callbacks", async () => {
    const env = await mount();
    const lateLoad = env.images[0].onload;
    env.emit(srcChange(env.cover));
    const lateFrame = [...env.frames.values()][0];
    env.unmount();
    assert.equal(env.observer.disconnected, true);
    assert.deepEqual(env.cancelled, [0]);
    assert.equal(env.frames.size, 0);
    assert.equal(env.images[0].onload, null);
    assert.equal(env.images[0].onerror, null);
    lateFrame();
    lateLoad();
    env.emit(srcChange(env.cover));
    assert.equal(env.frames.size, 0);
    assert.equal(env.queries, 1);
    assert.deepEqual(env.states, []);
});
