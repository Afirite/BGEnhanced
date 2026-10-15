const test = require("node:test");
const assert = require("node:assert/strict");
const { buildSync } = require("esbuild");
const Module = require("node:module");
const path = require("node:path");
const output = buildSync({ entryPoints: [path.join(__dirname, "../src/background/resolution.ts")], bundle: true, platform: "node", format: "cjs", write: false }).outputFiles[0].text;
const compiled = new Module(__filename);
compiled._compile(output, __filename);
const { enterBackground, chooseBackground } = compiled.exports;

test("resolution paths detect indirect cycles without accumulating across renders", () => {
  const initial = [];
  const a = enterBackground(initial, "a");
  const b = enterBackground(a, "b");
  assert.deepEqual(initial, []);
  assert.throws(() => enterBackground(b, "a"), /a → b → a/);
  for (let i = 0; i < 100; i++) assert.deepEqual(enterBackground(initial, "a"), ["a"]);
});

test("selection reaches both ends and reports an empty candidate list", () => {
  assert.equal(chooseBackground(["a", "b"], () => 0), "a");
  assert.equal(chooseBackground(["a", "b"], () => 0.99), "b");
  assert.throws(() => chooseBackground([]), /没有可供抽选/);
});
