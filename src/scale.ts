export const MIN_BACKGROUND_SCALE = 0.25;
export const MAX_BACKGROUND_SCALE = 3;
export const BACKGROUND_SCALE_STEP = 0.01;

export function clampScale(value: number): number {
    if (!Number.isFinite(value)) return 1;
    return Math.min(MAX_BACKGROUND_SCALE, Math.max(MIN_BACKGROUND_SCALE, value));
}

export function scaleFromPointer(clientX: number, left: number, width: number): number {
    if (!Number.isFinite(width) || width <= 0) return 1;
    return clampScale(MIN_BACKGROUND_SCALE + ((clientX - left) / width) * (MAX_BACKGROUND_SCALE - MIN_BACKGROUND_SCALE));
}
