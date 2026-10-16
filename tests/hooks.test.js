const test = require("node:test");
const assert = require("node:assert/strict");
const { buildSync } = require("esbuild");
const Module = require("node:module");
const path = require("node:path");
const compiled = new Module(__filename);
compiled._compile(buildSync({ entryPoints: [path.join(__dirname, "../src/hooks.ts")], bundle: true, platform: "node", format: "cjs", write: false }).outputFiles[0].text, __filename);
const { usePromise, useInterval, useLocalStorage } = compiled.exports;

function hookHarness() {
  const effects = [];
  const actions = [];
  global.React = {
    useRef: value => ({ current: value }),
    useState: initial => [typeof initial === "function" ? initial() : initial, value => actions.push(value)],
    useReducer: (_reducer, initial) => [initial, action => actions.push(action)],
    useEffect: effect => effects.push(effect)
  };
  return { actions, mount: () => effects.map(effect => effect()).filter(Boolean) };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test("usePromise ignores stale fulfillment after cleanup", async () => {
  const harness = hookHarness();
  let resolve;
  const pending = new Promise(done => { resolve = done; });
  usePromise(() => pending, []);
  const [cleanup] = harness.mount();
  cleanup();
  resolve("stale");
  await flush();
  assert.deepEqual(harness.actions, [{ type: "pending" }]);
});

test("usePromise reports synchronous factory failures as rejected state", async () => {
  const harness = hookHarness();
  const failure = new Error("factory failure");
  usePromise(() => { throw failure; }, []);
  harness.mount();
  await flush();
  assert.equal(harness.actions.at(-1).type, "rejected");
  assert.equal(harness.actions.at(-1).payload, failure);
});

test("useInterval clears its timer on cleanup", () => {
  const originalSet = global.setInterval;
  const originalClear = global.clearInterval;
  const calls = [];
  try {
    global.setInterval = (callback, delay) => { calls.push(["set", delay]); callback(); return 123; };
    global.clearInterval = id => calls.push(["clear", id]);
    const harness = hookHarness();
    let ticks = 0;
    useInterval(() => ticks++, 100);
    const [cleanup] = harness.mount();
    cleanup();
    assert.equal(ticks, 1);
    assert.deepEqual(calls, [["set", 100], ["clear", 123]]);
  } finally {
    global.setInterval = originalSet;
    global.clearInterval = originalClear;
  }
});

test("local storage functional updates use the latest queued value", () => {
  const writes = [];
  global.window = { localStorage: { getItem: () => "0", setItem: (key, value) => writes.push([key, value]) } };
  const harness = hookHarness();
  const [, setValue] = useLocalStorage("count", 0);
  setValue(previous => previous + 1);
  setValue(previous => previous + 1);
  assert.deepEqual(harness.actions, [1, 2]);
  assert.deepEqual(writes, [["count", "1"], ["count", "2"]]);
});

test("failed persistence does not publish state or advance functional updates", () => {
  const harness = hookHarness();
  let fail = true;
  const writes = [];
  global.window = { localStorage: {
    getItem: () => "0",
    setItem: (key, value) => { if (fail) throw new Error("quota"); writes.push(value); }
  } };
  const [, setValue] = useLocalStorage("count", 0);
  setValue(value => value + 1);
  assert.deepEqual(harness.actions, []);
  fail = false;
  setValue(value => value + 1);
  assert.deepEqual(harness.actions, [1]);
  assert.deepEqual(writes, ["1"]);
});

test("invalid JSON is backed up before removal and existing backups are retained", () => {
  for (const backup of [undefined, "older-invalid-data"]) {
    const storage = new Map([["setting", "invalid-json"]]);
    if (backup !== undefined) storage.set("setting.invalid-backup", backup);
    global.window = { localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    } };
    hookHarness();
    assert.equal(useLocalStorage("setting", 42)[0], 42);
    assert.equal(storage.has("setting"), false);
    assert.equal(storage.get("setting.invalid-backup"), backup ?? "invalid-json");
  }
});

test("backup failure preserves the original invalid setting", () => {
  let removed = false;
  global.window = { localStorage: {
    getItem: key => key === "setting" ? "invalid-json" : null,
    setItem: () => { throw new Error("quota"); },
    removeItem: () => { removed = true; }
  } };
  hookHarness();
  assert.equal(useLocalStorage("setting", 42)[0], 42);
  assert.equal(removed, false);
});

test("serialization failure leaves state and stored data untouched", () => {
  const harness = hookHarness();
  let writes = 0;
  global.window = { localStorage: {
    getItem: () => "0",
    setItem: () => { writes++; }
  } };
  const [, setValue] = useLocalStorage("count", 0, JSON.parse, () => { throw new Error("serialize"); });
  setValue(1);
  assert.equal(writes, 0);
  assert.deepEqual(harness.actions, []);
});
