const test = require("node:test");
const assert = require("node:assert/strict");
const { build } = require("esbuild");
const Module = require("node:module");
const path = require("node:path");

global.h = (type, props, ...children) => ({ type, props: props || {}, children });
global.f = Symbol.for("test.fragment");

let parseBackgroundList, stringifyBackgroundList, CSSBackground, BackgroundTypes;
global.__bgeTestPlugin = { backgroundList: [] };
test.before(async () => {
const bundled = (await build({
  stdin: {
    contents: 'export * from "./backgroundList"; export * from "./background/cssBackground";',
    resolveDir: path.join(__dirname, "../src"), loader: "ts"
  }, bundle: true, platform: "node", format: "cjs", write: false,
  jsxFactory: "h", jsxFragment: "f",
  plugins: [{
    name: "host-stubs",
    setup(build) {
      build.onResolve({ filter: /^\.\.$/ }, args => ({ path: args.path, namespace: "host" }));
      build.onLoad({ filter: /.*/, namespace: "host" }, () => ({
        contents: "export const selfPlugin = global.__bgeTestPlugin; export const BackgroundPreviewList = () => null;",
        loader: "js"
      }));
      build.onResolve({ filter: /^sweetalert2$/ }, () => ({ path: "sweetalert2", namespace: "stub" }));
      build.onLoad({ filter: /^sweetalert2$/, namespace: "stub" }, () => ({ contents: "export default { fire: (...args) => global.__bgeTestFire(...args) };", loader: "js" }));
      build.onResolve({ filter: /^react-icons\/md$/ }, () => ({ path: "icons", namespace: "stub" }));
      build.onLoad({ filter: /^icons$/, namespace: "stub" }, () => ({ contents: "export const MdSelectAll = () => null;", loader: "js" }));
    }
  }]
})).outputFiles[0].text;
const compiled = new Module(__filename);
compiled.filename = __filename;
compiled.paths = Module._nodeModulePaths(__dirname);
compiled._compile(bundled, __filename);
({ parseBackgroundList, stringifyBackgroundList, CSSBackground, BackgroundTypes } = compiled.exports);
});

test("parses legacy class-name records and emits stable type identifiers", () => {
  const [background] = parseBackgroundList(JSON.stringify([{ type: "CSSBackground", id: "legacy", current: true, css: "red" }]));
  assert.ok(background instanceof CSSBackground);
  assert.equal(background.css, "red");
  assert.equal(background.current, true);
  assert.equal(JSON.parse(stringifyBackgroundList([background])).backgrounds[0].type, "css");
  assert.deepEqual(parseBackgroundList(stringifyBackgroundList([background])).map(bg => bg.css), ["red"]);
});

test("ignores invalid records and fields and regenerates duplicate ids", () => {
  const [first, second] = parseBackgroundList(JSON.stringify([
    null, 42, { type: "unknown", id: "ignored" },
    { type: "css", id: "same", css: "blue", current: "yes", arbitrary: "ignored" },
    { type: "css", id: "same", css: "green" },
    { type: "css", id: "bad-number", css: "red", current: false }
  ]));
  assert.equal(first.id, "same");
  assert.notEqual(second.id, "same");
  assert.equal(first.css, "blue");
  assert.equal(first.current, false);
  assert.equal("arbitrary" in first, false);
});

test("config restores only correctly typed fields and preserves background methods", () => {
  const [background] = parseBackgroundList(JSON.stringify([
    { type: "css", css: 12, backgroundElement: "overwritten" }
  ]));
  assert.equal(background.css, "gray");
  assert.equal(typeof background.backgroundElement, "function");
});

test("only the five retained background types are registered", () => {
  assert.deepEqual(BackgroundTypes.map(type => type.backgroundTypeName), [
    "视频", "CSS", "图片", "当前封面", "在线图片"
  ]);
});

test("removed background records are skipped without affecting retained backgrounds", () => {
  const removed = ["anime", "bing", "masked", "random",
    "RemoteRandImageBackgroundLoli", "RemoteRandImageBackgroundScenery",
    "MaskedBackground", "RandomBackground"];
  const records = [...removed.map(type => ({ type })), { type: "css", css: "blue", id: "keep" }];
  for (const stored of [records, { version: 1, backgrounds: records }]) {
    const backgrounds = parseBackgroundList(JSON.stringify(stored));
    assert.equal(backgrounds.length, 1);
    assert.equal(backgrounds[0].id, "keep");
    assert.equal(backgrounds[0].css, "blue");
  }
});

test("cancelled image and video dialogs never inspect the filesystem or show errors", async () => {
  for (const name of ["图片", "视频"]) {
    const type = BackgroundTypes.find(type => type.backgroundTypeName === name);
    for (const cancelled of ["", null, undefined]) {
      global.betterncm = { app: { openFileDialog: async () => cancelled } };
      global.betterncm_native = { fs: { exists: () => { assert.fail("cancel must not check a path"); } } };
      global.__bgeTestFire = () => { assert.fail("cancel must not show an error"); };
      assert.equal(await type.askAndCreate(), null);
    }
  }
});

test("missing or inaccessible image and video paths report failure instead of rejecting", async () => {
  for (const name of ["图片", "视频"]) {
    const type = BackgroundTypes.find(type => type.backgroundTypeName === name);
    for (const throws of [false, true]) {
      let errors = 0;
      global.betterncm = { app: { openFileDialog: async () => "C:/missing-file" } };
      global.betterncm_native = { fs: { exists: () => {
        if (throws) throw new Error("access denied");
        return false;
      } } };
      global.__bgeTestFire = () => { errors++; return Promise.resolve({}); };
      assert.equal(await type.askAndCreate(), null);
      assert.equal(errors, 1);
    }
  }
});

test("versioned config rejects unknown schema versions", () => {
  assert.throws(() => parseBackgroundList('{"version":2,"backgrounds":[]}'), /版本/);
});
