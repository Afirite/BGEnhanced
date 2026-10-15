const test = require("node:test");
const assert = require("node:assert/strict");
const { build } = require("esbuild");
const Module = require("node:module");
const path = require("node:path");

global.h = (type, props, ...children) => ({ type, props: props || {}, children });
global.f = Symbol.for("test.fragment");

let parseBackgroundList, stringifyBackgroundList, CSSBackground, RandomBackground, MaskedBackground;
global.__bgeTestPlugin = { backgroundList: [] };
test.before(async () => {
const bundled = (await build({
  stdin: {
    contents: 'export * from "./backgroundList"; export * from "./background/cssBackground"; export * from "./background/randomBackground"; export * from "./background/maskedBackground";',
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
      build.onLoad({ filter: /^sweetalert2$/, namespace: "stub" }, () => ({ contents: "export default { fire: async () => ({}) };", loader: "js" }));
      build.onResolve({ filter: /^react-icons\/md$/ }, () => ({ path: "icons", namespace: "stub" }));
      build.onLoad({ filter: /^icons$/, namespace: "stub" }, () => ({ contents: "export const MdSelectAll = () => null;", loader: "js" }));
    }
  }]
})).outputFiles[0].text;
const compiled = new Module(__filename);
compiled.filename = __filename;
compiled.paths = Module._nodeModulePaths(__dirname);
compiled._compile(bundled, __filename);
({ parseBackgroundList, stringifyBackgroundList, CSSBackground, RandomBackground, MaskedBackground } = compiled.exports);
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
  const records = parseBackgroundList(JSON.stringify([
    { type: "masked", target: 12, maskColor: {}, maskBlur: "bad", backgroundElement: "overwritten" },
    { type: "random", excludeList: ["valid", 12] }
  ]));
  assert.equal(records[0].target, "");
  assert.equal(records[0].maskColor, "#ffffff22");
  assert.equal(records[0].maskBlur, 0);
  assert.equal(typeof records[0].backgroundElement, "function");
  assert.deepEqual(records[1].excludeList, []);
});

test("versioned config rejects unknown schema versions", () => {
  assert.throws(() => parseBackgroundList('{"version":2,"backgrounds":[]}'), /版本/);
});

test("random background invalidates its cached pick when excluded", async () => {
  const first = new CSSBackground("first");
  const second = new CSSBackground("second");
  const random = new RandomBackground();
  global.__bgeTestPlugin.backgroundList = [first, second, random];
  random.excludeList = [second.id];
  const firstElement = await random.backgroundElement();
  assert.equal(firstElement.props.style.background, "first");
  random.excludeList = [first.id];
  const secondElement = await random.backgroundElement();
  assert.equal(secondElement.props.style.background, "second");
});

test("masked background reports missing targets and real indirect cycles", async () => {
  const a = new MaskedBackground();
  const b = new MaskedBackground();
  a.id = "a"; b.id = "b";
  a.target = b.id; b.target = a.id;
  global.__bgeTestPlugin.backgroundList = [a, b];
  await assert.rejects(a.backgroundElement(), /背景循环引用：a → b → a/);
  a.target = "missing";
  await assert.rejects(a.backgroundElement(), /遮罩对象不存在/);
});
