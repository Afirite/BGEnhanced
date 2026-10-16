import { BaseBackground } from "./background";
import { preloadBackground } from "../mediaLoad";
import { coverImageSelector, observeCoverChanges } from "./coverImageObserver";

function getCoverUrl(): string {
    const image = document.querySelector<HTMLImageElement>(coverImageSelector);
    if (!image?.src) return "";
    const url = new URL(image.src, document.baseURI);
    // Some host versions wrap the real image URL in an image-proxy query.
    const query = url.search.slice(1);
    const nested = url.searchParams.get("url") || url.searchParams.get("src") || query;
    const direct = /^https?:\/\//.test(nested) ? nested : "";
    return direct || image.src;
}

function Cover({ preview = false }: { preview?: boolean }) {
    const [url, setUrl] = React.useState("");
    const previousUrl = React.useRef("");
    const displayedUrl = React.useRef("");
    React.useEffect(() => {
        let disposed = false;
        let latest = "";
        let pending: HTMLImageElement | undefined;
        const update = () => {
            const next = getCoverUrl();
            if (!next || next === latest) return;
            latest = next;
            // Warm the cover through the same preload path as the startup preload,
            // so the visible element hits the cache instead of starting a request.
            preloadBackground(next);
            if (pending) pending.onload = pending.onerror = null;
            const image = new Image();
            pending = image;
            image.onload = () => {
                if (!disposed && latest === next) {
                    previousUrl.current = displayedUrl.current;
                    displayedUrl.current = next;
                    setUrl(next);
                }
                image.onload = image.onerror = null;
            };
            image.onerror = () => {
                image.onload = image.onerror = null;
                if (latest === next) latest = "";
            };
            image.src = next;
        };
        const stopObserving = observeCoverChanges(update);
        return () => {
            disposed = true;
            stopObserving();
            if (pending) pending.onload = pending.onerror = null;
        };
    }, []);
    if (preview) return <div style={{ background: url ? `url(${JSON.stringify(url)}) center / cover` : "transparent" }} />;
    return <div className="BGE-coverImageBG">
        {previousUrl.current && <img className="BGE-coverImageBG-b" src={previousUrl.current} />}
        {url && <img key={url} className="BGE-coverImageBG-a BGE-coverImageBG-enter" src={url} />}
    </div>;
}

export class CoverImageBackground extends BaseBackground {
    static backgroundTypeName = "当前封面";
    constructor(public ImageUrl = "") { super(); }
    async backgroundElement() { return <Cover />; }
    async previewBackground() { return () => <Cover preview />; }
    static async askAndCreate(): Promise<BaseBackground> { return new CoverImageBackground(); }
    static default() { return new CoverImageBackground(); }
}
