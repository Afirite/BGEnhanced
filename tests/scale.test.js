const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const Module = require('node:module');
const path = require('node:path');
const compiled = new Module(__filename);
compiled._compile(buildSync({ entryPoints: [path.join(__dirname, '../src/scale.ts')], bundle: true, platform: 'node', format: 'cjs', write: false }).outputFiles[0].text, __filename);
const { clampScale, scaleFromPointer } = compiled.exports;

test('continuous scale clamps invalid and out-of-range values', () => {
  assert.equal(clampScale(0.25), 0.25);
  assert.equal(clampScale(1.337), 1.337);
  assert.equal(clampScale(-10), 0.25);
  assert.equal(clampScale(10), 3);
  assert.equal(clampScale(Number.NaN), 1);
});

test('pointer scale maps continuously across the slider', () => {
  assert.equal(scaleFromPointer(0, 0, 100), 0.25);
  assert.equal(scaleFromPointer(50, 0, 100), 1.625);
  assert.equal(scaleFromPointer(100, 0, 100), 3);
});
