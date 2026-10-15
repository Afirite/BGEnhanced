export const BLUR_MIN = 0;
export const BLUR_MAX = 60;
export const BLUR_STEP = 0.1;

export const BLUR_PULSE_STRENGTH_MIN = 0;
export const BLUR_PULSE_STRENGTH_MAX = 60;
export const BLUR_PULSE_STRENGTH_STEP = 0.5;
export const BLUR_PULSE_STRENGTH_DEFAULT = 10;

export const BLUR_TRANSITION_MIN = 0;
export const BLUR_TRANSITION_MAX = 500;
export const BLUR_TRANSITION_STEP = 10;
/** Legacy pulse width in src/resizeEffect.ts, kept as the default. */
export const BLUR_TRANSITION_DEFAULT = 160;

export function clampBlur(value: number, fallback = BLUR_MIN): number {
    if (!Number.isFinite(value)) return fallback;
    return Math.min(BLUR_MAX, Math.max(BLUR_MIN, value));
}

/**
 * Legacy installs stored some of these settings as strings ("30"), which would
 * break a controlled range input. Coerce before clamping.
 */
export function toNumber(value: unknown, fallback: number): number {
    const parsed = typeof value === "number" ? value : parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * localStorage parser for the numeric settings. It must never return undefined
 * or NaN: a controlled `<input type="range">` would then render with no value
 * at all. Anything unusable (missing, corrupt, wrong type) becomes `fallback`,
 * and parsed values are clamped into range so a hand-edited value cannot
 * desynchronise the slider from its bounds.
 */
export function clampStoredNumber(
    raw: string | null,
    min: number,
    max: number,
    fallback: number,
): number {
    const parsed = toNumber(raw, Number.NaN);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
}

export function clampBlurValue(value: unknown): number {
    return clampBlur(toNumber(value, BLUR_MIN));
}

/** `useLocalStorage` parser for `STORE_BGBLUR`. */
export function parseBackgroundBlur(raw: string | null): number {
    return clampStoredNumber(raw, BLUR_MIN, BLUR_MAX, 0);
}

/** `useLocalStorage` parser for `STORE_BGBRIGHTNESS` (default 1, range 0–1). */
export function parseBackgroundBrightness(raw: string | null): number {
    return clampStoredNumber(raw, 0, 1, 1);
}

/** `useLocalStorage` parser for `STORE_BGSCALE` (default 1, range 0.25–3). */
export function parseBackgroundScale(raw: string | null): number {
    return clampStoredNumber(raw, 0.25, 3, 1);
}

export function clampBlurPulseStrength(value: number): number {
    if (!Number.isFinite(value)) return BLUR_PULSE_STRENGTH_DEFAULT;
    return Math.min(
        BLUR_PULSE_STRENGTH_MAX,
        Math.max(BLUR_PULSE_STRENGTH_MIN, value),
    );
}

export function clampBlurPulseStrengthValue(value: unknown): number {
    return clampBlurPulseStrength(toNumber(value, BLUR_PULSE_STRENGTH_DEFAULT));
}

/** `useLocalStorage` parser for `STORE_BGBLURPULSE`. */
export function parseBlurPulseStrength(raw: string | null): number {
    return clampStoredNumber(
        raw,
        BLUR_PULSE_STRENGTH_MIN,
        BLUR_PULSE_STRENGTH_MAX,
        BLUR_PULSE_STRENGTH_DEFAULT,
    );
}

/** Rounded so the stored milliseconds stay integral and comparable. */
export function clampBlurTransition(value: number): number {
    if (!Number.isFinite(value)) return BLUR_TRANSITION_DEFAULT;
    const clamped = Math.min(
        BLUR_TRANSITION_MAX,
        Math.max(BLUR_TRANSITION_MIN, value),
    );
    return Math.round(clamped);
}

export function clampBlurTransitionValue(value: unknown): number {
    return clampBlurTransition(toNumber(value, BLUR_TRANSITION_DEFAULT));
}

/** `useLocalStorage` parser for `STORE_BGBLURTRANSITION`. */
export function parseBlurTransition(raw: string | null): number {
    return clampStoredNumber(
        raw,
        BLUR_TRANSITION_MIN,
        BLUR_TRANSITION_MAX,
        BLUR_TRANSITION_DEFAULT,
    );
}

/**
 * `filter`/`transform` are both listed so a slider drag, a background switch and
 * an active resize pulse all interpolate instead of jumping. Blur is omitted at
 * 0 so `filter: blur(0px) brightness(1)` never creates a useless compositing layer.
 */
export function backgroundEffectStyle(blur: number, brightness: number, scale: number): React.CSSProperties {
    const blurValue = clampBlur(blur);
    const brightnessValue = Number.isFinite(brightness) ? brightness : 1;
    const filter = [
        blurValue > 0 ? `blur(${blurValue}px)` : "",
        brightnessValue !== 1 ? `brightness(${brightnessValue})` : "",
    ].filter(Boolean).join(" ");

    return {
        filter: filter || "none",
        transform: scale !== 1 ? `scale(${scale})` : "none",
    };
}

/** Empty string means "no transition declared", so the host theme keeps its own. */
export function blurTransitionCss(durationMs: number): string {
    const duration = clampBlurTransition(durationMs);
    if (duration <= 0) return "";
    return `filter ${duration}ms ease, transform ${duration}ms ease`;
}
