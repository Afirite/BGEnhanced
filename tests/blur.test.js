const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const Module = require('node:module');
const path = require('node:path');
const compiled = new Module(__filename);
compiled._compile(buildSync({ entryPoints: [path.join(__dirname, '../src/blur.ts')], bundle: true, platform: 'node', format: 'cjs', write: false }).outputFiles[0].text, __filename);
const {
  clampBlur, clampBlurPulseStrength, clampBlurTransition,
  clampBlurValue, clampBlurPulseStrengthValue, clampBlurTransitionValue, toNumber, clampStoredNumber,
  parseBackgroundBlur, parseBackgroundBrightness, parseBackgroundScale,
  parseBlurPulseStrength, parseBlurTransition,
  backgroundEffectStyle, blurTransitionCss,
  BLUR_PULSE_STRENGTH_DEFAULT, BLUR_TRANSITION_DEFAULT, BLUR_TRANSITION_MAX,
} = compiled.exports;

test('legacy string settings coerce before clamping', () => {
  assert.equal(toNumber('30', 0), 30);
  assert.equal(toNumber('abc', 7), 7);
  assert.equal(toNumber(undefined, 7), 7);
  assert.equal(clampBlurValue('30'), 30);
  assert.equal(clampBlurValue('-5'), 0);
  assert.equal(clampBlurValue(null), 0);
  assert.equal(clampBlurValue('999'), 60);
  assert.equal(clampBlurTransitionValue('500'), 500);
  assert.equal(clampBlurTransitionValue(''), BLUR_TRANSITION_DEFAULT);
  assert.equal(clampBlurPulseStrengthValue('12'), 12);
});

test('stored numbers never parse to undefined or NaN', () => {
  // A controlled range input renders blank for these, which is the bug this guards.
  for (const raw of [null, '', ' ', 'undefined', 'null', 'abc', '[]', '{}', 'NaN']) {
    assert.equal(clampStoredNumber(raw, 0, 60, 7), 7, `raw=${JSON.stringify(raw)}`);
  }
  assert.equal(clampStoredNumber('30', 0, 60, 7), 30);
  assert.equal(clampStoredNumber('999', 0, 60, 7), 60);
  assert.equal(clampStoredNumber('-4', 0, 60, 7), 0);
});

test('setting parsers fall back to defaults and clamp into range', () => {
  assert.equal(parseBackgroundBlur(null), 0);
  assert.equal(parseBackgroundBlur('24'), 24);
  assert.equal(parseBackgroundBlur('24.5'), 24.5);
  assert.equal(parseBackgroundBlur('1000'), 60);
  assert.equal(parseBackgroundBrightness(null), 1);
  assert.equal(parseBackgroundBrightness('0.5'), 0.5);
  assert.equal(parseBackgroundBrightness('9'), 1);
  assert.equal(parseBackgroundScale(null), 1);
  assert.equal(parseBackgroundScale('1.5'), 1.5);
  assert.equal(parseBackgroundScale('99'), 3);
  assert.equal(parseBackgroundScale('0.01'), 0.25);
  assert.equal(parseBlurPulseStrength(null), BLUR_PULSE_STRENGTH_DEFAULT);
  assert.equal(parseBlurPulseStrength('12'), 12);
  assert.equal(parseBlurTransition(null), BLUR_TRANSITION_DEFAULT);
  assert.equal(parseBlurTransition('250'), 250);
  assert.equal(parseBlurTransition('5000'), BLUR_TRANSITION_MAX);
});

test('blur strengths clamp into the slider range', () => {
  assert.equal(clampBlur(0), 0);
  assert.equal(clampBlur(24.5), 24.5);
  assert.equal(clampBlur(-3), 0);
  assert.equal(clampBlur(999), 60);
  assert.equal(clampBlur(Number.NaN), 0);
});

test('pulse strength and transition duration clamp and fall back to defaults', () => {
  assert.equal(clampBlurPulseStrength(-1), 0);
  assert.equal(clampBlurPulseStrength(12.5), 12.5);
  assert.equal(clampBlurPulseStrength(1e6), 60);
  assert.equal(clampBlurPulseStrength(Number.NaN), BLUR_PULSE_STRENGTH_DEFAULT);
  assert.equal(clampBlurTransition(0), 0);
  assert.equal(clampBlurTransition(160.4), 160);
  assert.equal(clampBlurTransition(1e6), BLUR_TRANSITION_MAX);
  assert.equal(clampBlurTransition(Number.NaN), BLUR_TRANSITION_DEFAULT);
});

test('effect style omits default-valued effects instead of emitting blur(0px)', () => {
  assert.deepEqual(backgroundEffectStyle(0, 1, 1), { filter: 'none', transform: 'none' });
  assert.deepEqual(backgroundEffectStyle(10, 1, 1), { filter: 'blur(10px)', transform: 'none' });
  assert.deepEqual(backgroundEffectStyle(0, 0.5, 1.25), { filter: 'brightness(0.5)', transform: 'scale(1.25)' });
  assert.deepEqual(backgroundEffectStyle(8, 1, 1), { filter: 'blur(8px)', transform: 'none' });
});

test('transition css degrades to no declaration when the duration is zero', () => {
  assert.equal(blurTransitionCss(0), '');
  assert.equal(blurTransitionCss(-5), '');
  assert.equal(blurTransitionCss(160), 'filter 160ms ease, transform 160ms ease');
  assert.equal(blurTransitionCss(99999), 'filter 500ms ease, transform 500ms ease');
});
