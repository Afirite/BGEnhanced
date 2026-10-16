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
const prepared = new Map<string, Promise<ImageOptimizationResult>>();

export interface ImageOptimizationOptions {
    format: "webp" | "jpeg";
    quality: number;
}
export interface ImageInfo extends ImageSize { bytes: number; }
export interface ImageOptimizationResult {
    path: string;
    source: ImageInfo;
    output: ImageInfo;
    status: "optimized" | "cached" | "unchanged" | "skipped" | "failed";
}
function normalizedOptions(options?: ImageOptimizationOptions): ImageOptimizationOptions {
    return {
        format: options?.format === "jpeg" ? "jpeg" : "webp",
        quality: Number.isFinite(options?.quality) ? Math.min(1, Math.max(0.1, options!.quality)) : 0.86,
    };
}

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

/** Legacy names remain stable; explicit options use a versioned encoder identity. */
export function cacheFileName(filePath: string, maxEdge: number, options?: ImageOptimizationOptions): string {
    if (!options) return `${hashPath(filePath)}-${maxEdge}w.webp`;
    const { format, quality } = normalizedOptions(options);
    return `${hashPath(filePath)}-v2-${maxEdge}w-${quality}.${format}`;
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

function canvasToBlob(canvas: HTMLCanvasElement, quality: number, format: "webp" | "jpeg" = "webp", strictMime = false): Promise<Blob | null> {
    return new Promise(resolve => {
        try {
            // Requesting pixels is what throws on a canvas tainted by a
            // cross-origin source, so toBlob is the right place to fail.
            const mime = `image/${format}`;
            canvas.toBlob(blob => resolve(blob && blob.size > 0 && (!strictMime || blob.type.toLowerCase() === mime) ? blob : null), mime, quality);
        } catch {
            resolve(null);
        }
    });
}

async function drawToBlob(blob: Blob, maxEdge: number, quality: number, format: "webp" | "jpeg" = "webp", strictMime = false): Promise<{ output: Blob, source: ImageSize, target: ImageSize } | null> {
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
        // JPEG has no alpha channel: explicitly composite transparent pixels on white.
        if (format === "jpeg") {
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, target.width, target.height);
        }
        context.drawImage(bitmap as unknown as CanvasImageSource, 0, 0, target.width, target.height);
        const output = await canvasToBlob(canvas, quality, format, strictMime);
        return output === null ? null : { output, source, target };
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

/** Decode dimensions and always release the bitmap. Read/decode failures reject. */
async function inspectBlob(blob: Blob): Promise<ImageInfo> {
    const bitmap = await createImageBitmap(blob);
    try { return { width: bitmap.width, height: bitmap.height, bytes: blob.size }; }
    finally { bitmap.close?.(); }
}
export async function inspectImage(filePath: string): Promise<ImageInfo> {
    return inspectBlob(await betterncm.fs.readFile(filePath));
}

async function fingerprint(blob: Blob): Promise<string> {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let hash = 0x811c9dc5;
    for (const byte of bytes) { hash ^= byte; hash = Math.imul(hash, 0x01000193); }
    return (hash >>> 0).toString(36) + "-" + bytes.length;
}

/** Walk real container chunks, avoiding false positives inside compressed pixels. */
async function isAnimated(blob: Blob): Promise<boolean> {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const view = new DataView(bytes.buffer);
    const tag = (offset: number) => String.fromCharCode(...bytes.subarray(offset, offset + 4));
    if (bytes.length >= 8 && bytes[0] === 137 && tag(1) === "PNG\r") {
        for (let offset = 8; offset + 12 <= bytes.length;) {
            const length = view.getUint32(offset);
            if (tag(offset + 4) === "acTL") return true;
            offset += 12 + length;
        }
    }
    if (bytes.length >= 12 && tag(0) === "RIFF" && tag(8) === "WEBP") {
        for (let offset = 12; offset + 8 <= bytes.length;) {
            const length = view.getUint32(offset + 4, true);
            if (tag(offset) === "ANIM" || tag(offset) === "ANMF" ||
                (tag(offset) === "VP8X" && length > 0 && (bytes[offset + 8] & 2) !== 0)) return true;
            offset += 8 + length + (length % 2);
        }
    }
    return bytes.length >= 6 && String.fromCharCode(...bytes.subarray(0, 6)).startsWith("GIF8");
}

async function targetPath(filePath: string, maxEdge: number, pluginPath: string, options?: ImageOptimizationOptions, source?: Blob): Promise<string> {
    const directory = await ensureCacheDir(pluginPath);
    const identity = options ? filePath + "|" + await fingerprint(source ?? await betterncm.fs.readFile(filePath)) : filePath;
    return directory + "/" + cacheFileName(identity, maxEdge, options);
}

/** Best effort encoding; failures are evicted so the next request can retry. */
export async function optimizeImage(filePath: string, maxEdge: number, pluginPath: string, options?: ImageOptimizationOptions): Promise<ImageOptimizationResult> {
    let source: ImageInfo = { width: 0, height: 0, bytes: 0 };
    const result = (status: ImageOptimizationResult["status"]): ImageOptimizationResult => ({ path: "", source, output: source, status });
    if (!filePath || !Number.isFinite(maxEdge) || maxEdge < 0 || (!options && maxEdge === 0)) return result("skipped");
    try {
        const blob = await betterncm.fs.readFile(filePath);
        source = { ...source, bytes: blob.size };
        source = await inspectBlob(blob);
        if (compressibleKind(filePath) !== "compress" || await isAnimated(blob)) return result("skipped");
        const target = await targetPath(filePath, maxEdge, pluginPath, options, blob);
        const key = target + "|" + await fingerprint(blob);
        const existing = prepared.get(key);
        if (existing) {
            const previous = await existing;
            if (previous.status !== "optimized" && previous.status !== "cached" || await betterncm.fs.exists(previous.path)) return previous;
            prepared.delete(key);
        }
        const pending = (async (): Promise<ImageOptimizationResult> => {
            if (await betterncm.fs.exists(target)) {
                const output = await inspectImage(target);
                return { path: target, source, output, status: "cached" };
            }
            const normalized = normalizedOptions(options);
            const scaled = await drawToBlob(blob, maxEdge || Math.max(source.width, source.height), normalized.quality, normalized.format, true);
            if (!scaled) return result("failed");
            if (scaled.output.size >= source.bytes) return result("unchanged");
            if (!await betterncm.fs.writeFile(target, scaled.output)) return result("failed");
            return { path: target, source, output: { ...scaled.target, bytes: scaled.output.size }, status: "optimized" };
        })().catch(() => result("failed"));
        prepared.set(key, pending);
        const outcome = await pending;
        if (outcome.status === "failed") prepared.delete(key);
        return outcome;
    } catch { return result("failed"); }
}

export async function prepareImage(filePath: string, maxEdge: number, pluginPath: string, options?: ImageOptimizationOptions): Promise<string> {
    return (await optimizeImage(filePath, maxEdge, pluginPath, options)).path;
}

/** Only report an existing copy; options include the source content in its identity. */
export async function cachedImagePath(filePath: string, maxEdge: number, pluginPath: string, options?: ImageOptimizationOptions): Promise<string> {
    if (!filePath || !Number.isFinite(maxEdge) || maxEdge < 0 || (!options && maxEdge === 0) || compressibleKind(filePath) !== "compress") return "";
    try {
        const target = await targetPath(filePath, maxEdge, pluginPath, options);
        return await betterncm.fs.exists(target) ? target : "";
    } catch { return ""; }
}

export async function resolvedImagePath(filePath: string, maxEdge: number, pluginPath: string, options?: ImageOptimizationOptions): Promise<string> {
    return await cachedImagePath(filePath, maxEdge, pluginPath, options) || filePath;
}

export async function mountedImageUrl(filePath: string, maxEdge: number, pluginPath: string, options?: ImageOptimizationOptions): Promise<string> {
    if (!filePath) return "";
    return await mountFileCached(await resolvedImagePath(filePath, maxEdge, pluginPath, options));
}
