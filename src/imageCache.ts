/**
 * Local media optimisation: a small blurred placeholder (LQIP) plus, optionally,
 * a downscaled copy of large local images.
 *
 * Why: the visible "background trickles in from the top" at startup is the
 * browser painting a huge image progressively. A placeholder that covers the
 * whole viewport hides that until the real image is decoded, and a smaller
 * cached copy shortens the wait itself.
 *
 * Everything here is best-effort: any failure (unsupported format, tainted
 * canvas, host write refusal) returns empty and callers fall back to the
 * original file. Originals are never modified or deleted.
 */
import { mountFileCached } from "./mediaLoad";

/** Longest edge of the generated placeholder, in pixels. */
export const THUMBNAIL_MAX_EDGE = 48;
export const THUMBNAIL_QUALITY = 0.55;

/** Cache directory next to the plugin, so it survives across restarts. */
export const CACHE_FOLDER = ".bge-cache";

const cacheDirReady = new Map<string, Promise<string>>();
const prepared = new Map<string, Promise<string>>();

export interface ImageSize {
    width: number;
    height: number;
}

/** Fits `width`x`height` into a `maxEdge` box, never upscaling. */
export function fitWithin({ width, height }: ImageSize, maxEdge: number): ImageSize {
    if (!(width > 0) || !(height > 0) || !(maxEdge > 0)) return { width: 0, height: 0 };
    if (width <= maxEdge && height <= maxEdge) return { width, height };
    const ratio = maxEdge / Math.max(width, height);
    return {
        width: Math.max(1, Math.round(width * ratio)),
        height: Math.max(1, Math.round(height * ratio)),
    };
}

/** FNV-1a over utf-16 code units: stable, short, no dependency. */
export function hashPath(value: string): string {
    let hash = 0x811c9dc5;
    for (let index = 0; index < value.length; index++) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(36);
}

/** Stable per source path, so re-encoding overwrites instead of piling up. */
export function cacheFileName(filePath: string, maxEdge: number): string {
    return `${hashPath(filePath)}-${maxEdge}w.webp`;
}

export type CompressibleKind = "compress" | "thumbnail" | "skip";

/**
 * Animated formats must be skipped: re-encoding them through a single canvas
 * frame would silently kill the animation. BMP/SVG are skipped because the host
 * does not render them reliably in the first place.
 */
export function compressibleKind(filePath: string): CompressibleKind {
    const extension = (filePath.split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i)?.[1] ?? "").toLowerCase();
    if (!extension) return "thumbnail";
    if (["mp4", "webm", "mov", "mkv", "avi"].includes(extension)) return "skip";
    if (["gif", "apng", "svg", "bmp", "ico"].includes(extension)) return "skip";
    if (["jpg", "jpeg", "png", "webp", "avif"].includes(extension)) return "compress";
    return "thumbnail";
}

export function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
    return new Promise(resolve => {
        try {
            // Requesting pixels is what throws on a canvas tainted by a
            // cross-origin source, so toBlob is the right place to fail.
            canvas.toBlob(blob => resolve(blob && blob.size > 0 ? blob : null), "image/webp", quality);
        } catch {
            resolve(null);
        }
    });
}

async function drawToBlob(blob: Blob, maxEdge: number, quality: number): Promise<{ output: Blob, source: ImageSize } | null> {
    const bitmap = await createImageBitmap(blob).catch(() => null);
    if (bitmap === null) return null;
    try {
        const source = { width: bitmap.width, height: bitmap.height };
        const target = fitWithin(source, maxEdge);
        if (target.width <= 0 || target.height <= 0) return null;
        const canvas = document.createElement("canvas");
        canvas.width = target.width;
        canvas.height = target.height;
        const context = canvas.getContext("2d");
        if (context === null) return null;
        context.drawImage(bitmap as unknown as CanvasImageSource, 0, 0, target.width, target.height);
        const output = await canvasToBlob(canvas, quality);
        return output === null ? null : { output, source };
    } finally {
        bitmap.close?.();
    }
}

async function ensureCacheDir(pluginPath: string): Promise<string> {
    const directory = `${pluginPath.replace(/[\\/]+$/, "")}/${CACHE_FOLDER}`;
    let ready = cacheDirReady.get(directory);
    if (ready === undefined) {
        ready = betterncm.fs.mkdir(directory).then(
            () => directory,
            () => {
                cacheDirReady.delete(directory);
                throw new Error("无法创建插件缓存目录");
            },
        );
        cacheDirReady.set(directory, ready);
    }
    return await ready;
}

/**
 * Blurred placeholder as a data url, kept in the background config itself so it
 * needs no file and no extra request. Returns "" when it cannot be produced.
 */
export async function createThumbnail(filePath: string): Promise<string> {
    const blob = await betterncm.fs.readFile(filePath);
    if (!blob || blob.size === 0) return "";
    const scaled = await drawToBlob(blob, THUMBNAIL_MAX_EDGE, THUMBNAIL_QUALITY).catch(() => null);
    if (scaled === null) return "";
    return await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => resolve("");
        reader.readAsDataURL(scaled.output);
    });
}

async function compressInner(filePath: string, maxEdge: number, pluginPath: string): Promise<string> {
    const directory = await ensureCacheDir(pluginPath);
    const target = `${directory}/${cacheFileName(filePath, maxEdge)}`;
    if (await betterncm.fs.exists(target)) return target;

    const source = await betterncm.fs.readFile(filePath);
    const scaled = await drawToBlob(source, maxEdge, 0.86);
    if (scaled === null) return "";
    // Do not grow a file that is already small enough to be cheap to load.
    if (scaled.output.size >= source.size) return "";
    const written = await betterncm.fs.writeFile(target, scaled.output);
    if (!written) return "";
    console.log(`BGEnhanced: ${filePath} ${formatBytes(source.size)} -> cached ${formatBytes(scaled.output.size)}`);
    return target;
}

/**
 * Downscales a local image into the plugin cache and returns the cached path
 * ("" when there is nothing to gain or the platform refused). Memoised per
 * source path + size, so preload and render share one pass.
 */
export function prepareImage(filePath: string, maxEdge: number, pluginPath: string): Promise<string> {
    if (!filePath || !(maxEdge > 0)) return Promise.resolve("");
    if (compressibleKind(filePath) !== "compress") return Promise.resolve("");
    const key = `${filePath}|${maxEdge}`;
    let pending = prepared.get(key);
    if (pending === undefined) {
        pending = compressInner(filePath, maxEdge, pluginPath).catch(() => "");
        prepared.set(key, pending);
    }
    return pending;
}

/** Path the cached copy would live at; used to skip redundant work. */
export async function cachedImagePath(filePath: string, maxEdge: number, pluginPath: string): Promise<string> {
    if (!filePath || !(maxEdge > 0) || compressibleKind(filePath) !== "compress") return "";
    try {
        const directory = await ensureCacheDir(pluginPath);
        const target = `${directory}/${cacheFileName(filePath, maxEdge)}`;
        return (await betterncm.fs.exists(target)) ? target : "";
    } catch {
        return "";
    }
}

/** Source used for display: the cached copy when present, else the original. */
export async function resolvedImagePath(filePath: string, maxEdge: number, pluginPath: string): Promise<string> {
    return await cachedImagePath(filePath, maxEdge, pluginPath) || filePath;
}

/** Display url for a local image, preferring the cached smaller copy. */
export async function mountedImageUrl(filePath: string, maxEdge: number, pluginPath: string): Promise<string> {
    if (!filePath) return "";
    const path = await resolvedImagePath(filePath, maxEdge, pluginPath);
    return await mountFileCached(path);
}
