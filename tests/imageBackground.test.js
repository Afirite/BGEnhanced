const test = require("node:test");
const assert = require("node:assert/strict");
const { build } = require("esbuild");
const Module = require("node:module");
const path = require("node:path");

let ImageBackground, parseBackgroundList, stringifyBackgroundList, env;
const original = "C:/背景/original.png";
const stale = "C:/plugin/cache/old-settings.webp";
const pluginPath = "C:/plugin/BGEnhanced";
const settings = () => ({ maxEdge: 1920, options: { format: "webp", quality: .86 } });
const copy = value => JSON.parse(JSON.stringify(value));

// Bundle the shipped class and serializer, not a rewritten implementation. Only
// host/media dependencies and unrelated background types are replaced.
test.before(async () => {
    const stubs = {
        imageCache:
            "export const compressibleKind = (...args) => global.__imageBackgroundTest.kind(...args);" +
            "export const mountedImageUrl = (...args) => global.__imageBackgroundTest.mounted(...args);" +
            "export const optimizeImage = (...args) => global.__imageBackgroundTest.optimize(...args);" +
            "export const createThumbnail = (...args) => global.__imageBackgroundTest.thumbnail(...args);",
        mediaLoad:
            "export const mountFileCached = (...args) => global.__imageBackgroundTest.mountOriginal(...args);" +
            "export const useMountedUrl = url => url;",
        imageSettings: "export const readImageSettings = () => global.__imageBackgroundTest.readSettings();",
        hooks: "export const useLocalStorage = () => { throw new Error('unexpected hook'); };",
        sweetalert2: "export default { fire() { throw new Error('unexpected dialog'); } };"
    };
    const result = await build({
        stdin: {
            contents: 'export * from "./background/imageBackground"; export * from "./backgroundList";',
            resolveDir: path.join(__dirname, "../src"), loader: "ts"
        },
        bundle: true, platform: "node", format: "cjs", write: false,
        jsxFactory: "h", jsxFragment: "f",
        plugins: [{ name: "image-background-host-stubs", setup(build) {
            build.onResolve({ filter: /(?:^|[/])(imageCache|mediaLoad|imageSettings|hooks)$|^sweetalert2$/ }, args => ({
                path: args.path.split("/").pop(), namespace: "stub"
            }));
            build.onResolve({ filter: /[/](coverImageBackground|cssBackground|remoteImageBackground|videoBackground)$/ }, args => ({
                path: args.path.split("/").pop(), namespace: "other-background"
            }));
            build.onLoad({ filter: /.*/, namespace: "stub" }, args => ({ contents: stubs[args.path], loader: "js" }));
            build.onLoad({ filter: /.*/, namespace: "other-background" }, args => {
                const names = { coverImageBackground: "CoverImageBackground", cssBackground: "CSSBackground",
                    remoteImageBackground: "RemoteImageBackground", videoBackground: "VideoBackground" };
                return { contents: "export class " + names[args.path] + " { static default() { return new this(); } }", loader: "js" };
            });
        } }]
    });
    const compiled = new Module(__filename);
    compiled._compile(result.outputFiles[0].text, __filename);
    ({ ImageBackground, parseBackgroundList, stringifyBackgroundList } = compiled.exports);
});

const globals = ["__imageBackgroundTest", "plugin", "h", "f", "React"];
let previous;
test.beforeEach(() => {
    previous = globals.map(key => [key, Object.getOwnPropertyDescriptor(global, key)]);
    env = {
        settings: settings(), calls: [], mounts: [], optimizations: [], thumbnails: [],
        readSettings() { return copy(this.settings); },
        async mounted(...args) { this.calls.push(args); return "mounted:current-copy.webp"; },
        async mountOriginal(url) { this.mounts.push(url); return "mounted:original.png"; },
        kind: () => "compress",
        async optimize(...args) { this.optimizations.push(args); return { path: "" }; },
        async thumbnail(url) { this.thumbnails.push(url); return "data:image/webp;base64,thumbnail"; }
    };
    global.__imageBackgroundTest = env;
    global.plugin = { pluginPath };
    global.h = (type, props, ...children) => ({ type, props: props || {}, children });
    global.f = Symbol("fragment");
    global.React = { useState: initial => [initial, () => {}] };
});
test.afterEach(() => {
    for (const [key, descriptor] of previous) {
        if (descriptor) Object.defineProperty(global, key, descriptor);
        else delete global[key];
    }
});

function background() {
    const bg = new ImageBackground(original);
    bg.cachePath = stale;
    bg.thumbnail = "data:image/webp;base64,existing";
    return bg;
}
function renderedImage(vnode) {
    return vnode.type(vnode.props).children.find(child => child && child.type === "img" && !child.props["aria-hidden"]);
}

test("actual background and preview resolve a fresh settings copy, never the saved cachePath", async () => {
    const bg = background();
    const first = copy(env.settings);
    const vnode = await bg.backgroundElement();
    assert.equal(vnode.props.imageUrl, "mounted:current-copy.webp");
    assert.equal(vnode.props.original, original);
    assert.equal(renderedImage(vnode).props.src, "mounted:current-copy.webp");
    env.settings = { maxEdge: 2560, options: { format: "jpeg", quality: .7 } };
    env.mounted = async (...args) => { env.calls.push(args); return "mounted:new-settings.jpg"; };
    const preview = (await bg.previewBackground())();
    assert.equal(preview.props.style.background, "url(mounted:new-settings.jpg) 0% 0% / cover");
    assert.deepEqual(env.calls, [
        [original, first.maxEdge, pluginPath, first.options],
        [original, 2560, pluginPath, { format: "jpeg", quality: .7 }]
    ]);
    assert.notEqual(env.calls[1][3], env.settings.options, "settings are passed as a snapshot");
    assert.deepEqual(env.mounts, []);
    assert.equal(bg.cachePath, stale, "rendering must not mutate stored data");
});

test("preload resolver uses the same current-settings path", async () => {
    const bg = background();
    assert.equal(await bg.resolveImageUrl(), "mounted:current-copy.webp");
    assert.deepEqual(env.calls, [[original, 1920, pluginPath, { format: "webp", quality: .86 }]]);
    assert.deepEqual(env.mounts, []);
});

test("prepare clears an obsolete cachePath when optimization returns no display copy", async () => {
    const bg = background();
    assert.equal(await bg.prepare(), true);
    assert.equal(bg.cachePath, "");
    assert.equal(bg.thumbnail, "data:image/webp;base64,existing");
    assert.deepEqual(env.optimizations, [[original, 1920, pluginPath, { format: "webp", quality: .86 }]]);
    assert.deepEqual(env.thumbnails, [], "an existing thumbnail is retained");
    assert.equal(await bg.prepare(), false, "an unchanged result does not request another save");
});

test("prepare saves the new cache path and creates a missing thumbnail once", async () => {
    const bg = background();
    bg.thumbnail = "";
    env.optimize = async () => ({ path: "C:/plugin/cache/current.webp" });
    assert.equal(await bg.prepare(), true);
    assert.equal(bg.cachePath, "C:/plugin/cache/current.webp");
    assert.equal(bg.thumbnail, "data:image/webp;base64,thumbnail");
    assert.deepEqual(env.thumbnails, [original]);
    assert.equal(await bg.prepare(), false);
    assert.deepEqual(env.thumbnails, [original]);
});

test("prepare ignores in-flight results after any compression parameter changes", async () => {
    for (const change of [
        value => { value.maxEdge = 2560; },
        value => { value.options.format = "jpeg"; },
        value => { value.options.quality = .5; }
    ]) {
        env.settings = settings();
        const bg = background();
        bg.thumbnail = "";
        let finish;
        env.optimize = () => new Promise(resolve => { finish = resolve; });
        const pending = bg.prepare();
        assert.equal(typeof finish, "function", "optimization has started before changing settings");
        change(env.settings);
        finish({ path: "C:/plugin/cache/outdated.webp" });
        assert.equal(await pending, false);
        assert.equal(bg.cachePath, stale, "the stale async result must not overwrite configuration");
        assert.equal(bg.thumbnail, "");
    }
    assert.deepEqual(env.thumbnails, [], "abandoned work must not generate a thumbnail");
});

test("cache mounting rejection falls back to mounting the original on every entry point", async () => {
    const bg = background();
    env.mounted = async (...args) => { env.calls.push(args); throw new Error("cache mount failed"); };
    assert.equal(await bg.resolveImageUrl(), "mounted:original.png");
    assert.equal(renderedImage(await bg.backgroundElement()).props.src, "mounted:original.png");
    assert.equal((await bg.previewBackground())().props.style.background, "url(mounted:original.png) 0% 0% / cover");
    assert.deepEqual(env.mounts, [original, original, original]);
    assert.equal(env.calls.length, 3);
    assert.equal(bg.cachePath, stale);
});

test("the actual image component retries the original after a cached image load error", async () => {
    const vnode = await background().backgroundElement();
    const states = [];
    let index;
    global.React = { useState(initial) {
        const key = index++;
        if (!(key in states)) states[key] = initial;
        return [states[key], value => { states[key] = value; }];
    } };
    const render = () => { index = 0; return renderedImage(vnode); };
    const cached = render();
    assert.equal(cached.props.src, "mounted:current-copy.webp");
    cached.props.onError();
    const fallback = render();
    assert.equal(fallback.props.src, original);
    fallback.props.onLoad();
    assert.equal(render().props.style.opacity, 1);
});

test("real config parsing and serialization preserve legacy image data fields", () => {
    const record = { type: "ImageBackground", id: "legacy-image", current: true,
        ImageUrl: original, cachePath: stale, thumbnail: "data:image/webp;base64,old" };
    const [bg] = parseBackgroundList(JSON.stringify([record]));
    assert.ok(bg instanceof ImageBackground);
    const serialized = JSON.parse(stringifyBackgroundList([bg]));
    assert.deepEqual(serialized, { version: 1, backgrounds: [{ ...record, type: "image" }] });
    const [restored] = parseBackgroundList(JSON.stringify(serialized));
    assert.ok(restored instanceof ImageBackground);
    for (const key of ["id", "current", "ImageUrl", "cachePath", "thumbnail"]) {
        assert.equal(restored[key], record[key]);
    }
    assert.equal(typeof restored.backgroundElement, "function");
});
