/**
 * Background media bootstrapping.
 *
 * Two problems this file solves, both visible as "the background appears slowly
 * at startup":
 *
 * 1. The download used to start only after React had rendered the `<img>`, i.e.
 *    after the host finished a whole chain of startup work. `preloadBackgrounds`
 *    is callable from the plugin script itself so the request starts earlier.
 * 2. Every render (and every unrelated config change) rebuilt the `<img>`, which
 *    re-requested the source and flashed. `mountFileCached` + `useMountedUrl`
 *    keep one request and one element alive.
 */
import { BaseBackground } from "./background/background";

/** In-flight/resolved mount results, keyed by host file path. */
const mountedUrls = new Map<string, Promise<string>>();
/** In-flight/resolved image requests, keyed by the final url. */
const preloadedUrls = new Map<string, Promise<string>>();

/**
 * `betterncm.fs.mountFile` can be called from several places for the same file
 * (preload, background element, preview). Share one call per path so the host
 * is not asked to mount the same file repeatedly.
 */
export function mountFileCached(path: string): Promise<string> {
    if (!path) return Promise.resolve("");
    let pending = mountedUrls.get(path);
    if (pending === undefined) {
        pending = betterncm.fs.mountFile(path);
        mountedUrls.set(path, pending);
        // Keep a rejected mount retryable instead of caching the failure.
        pending.catch(() => mountedUrls.delete(path));
    }
    return pending;
}

function addPreloadLink(url: string) {
    if (!url || document.querySelector(`link[data-bge-preload="${CSS.escape(url)}"]`)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    link.setAttribute("data-bge-preload", url);
    document.head.appendChild(link);
}

/** Anything that can point at a media url: a background, or a bare url. */
export type PreloadTarget = BaseBackground | { url?: string } | string | null | undefined;

/**
 * Resolves and requests the media behind a background. Resolves to the final url
 * (empty string when there is nothing to preload) and never rejects, so callers
 * can fire-and-forget.
 */
export async function preloadBackground(target: PreloadTarget): Promise<string> {
    try {
        const url = await resolveTargetUrl(target);
        if (!url) return "";
        addPreloadLink(url);
        let pending = preloadedUrls.get(url);
        if (pending === undefined) {
            // Decode through an Image() as well: some hosts ignore <link rel=preload>
            // for blob:/http://localhost urls, and decoding keeps the first paint cheap.
            pending = new Promise<string>(resolve => {
                const image = new Image();
                image.onload = () => resolve(url);
                image.onerror = () => resolve(url);
                image.src = url;
            });
            preloadedUrls.set(url, pending);
        }
        await pending;
        return url;
    } catch {
        return "";
    }
}

async function resolveTargetUrl(target: PreloadTarget): Promise<string> {
    if (typeof target === "string") return target;
    if (!target || typeof target !== "object") return "";
    const asImage = target as { resolveImageUrl?: () => Promise<string> };
    if (typeof asImage.resolveImageUrl === "function") {
        return await asImage.resolveImageUrl();
    }
    const asUrl = target as { url?: string };
    return typeof asUrl.url === "string" ? asUrl.url : "";
}

/** Fire-and-forget variant for module scope, where nothing can await. */
export function preloadBackgrounds(backgrounds: readonly PreloadTarget[]) {
    if (!Array.isArray(backgrounds)) return;
    for (const background of backgrounds) preloadBackground(background);
}

/**
 * Keeps the mounted url in state so the element renders once with its real
 * source instead of mounting empty and then re-rendering.
 */
export function useMountedUrl(imageUrl: string): string {
    const [url, setUrl] = React.useState("");
    React.useEffect(() => {
        if (!imageUrl) {
            setUrl("");
            return;
        }
        let disposed = false;
        setUrl("");
        mountFileCached(imageUrl).then(
            mounted => { if (!disposed) setUrl(mounted || ""); },
            () => { if (!disposed) setUrl(""); },
        );
        return () => { disposed = true; };
    }, [imageUrl]);
    return url;
}

/** Exposed for tests and diagnostics. */
export function preloadLinkCount(): number {
    return document.querySelectorAll("link[data-bge-preload]").length;
}
