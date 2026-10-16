import { BaseBackground } from "./background";
import Swal from "sweetalert2";
import { mountFileCached, useMountedUrl } from "../mediaLoad";
import { compressibleKind, createThumbnail, mountedImageUrl, optimizeImage } from "../imageCache";
import { readImageSettings } from "../imageSettings";

/**
 * Placeholder layer plus the real image. The placeholder is a ≤48px blurred data
 * url stored in the background config, so it paints immediately from
 * localStorage while the full image is still decoding - the progressive
 * "trickles in from the top" look is hidden behind an already-complete image.
 */
function BackgroundImage({ imageUrl, original, thumbnail }: { imageUrl: string, original: string, thumbnail: string }) {
    const [failed, setFailed] = React.useState(false);
    const full = useMountedUrl(failed ? original : imageUrl);
    const placeholder = useMountedUrl(thumbnail);
    const [loaded, setLoaded] = React.useState(false);
    if (!full && !placeholder) return null;
    return (
        <>
            {thumbnail && !(loaded && placeholder) && (
                <img
                    aria-hidden="true"
                    src={placeholder}
                    style={{
                        filter: "blur(24px)",
                        transform: "scale(1.15)",
                        transformOrigin: "center",
                        opacity: !placeholder ? 0 : loaded ? 0 : 1,
                    }}
                />
            )}
            {full && (
                <img
                    src={full}
                    onLoad={() => setLoaded(true)}
                    onError={() => { if (!failed) { setFailed(true); setLoaded(false); } else setLoaded(true); }}
                    style={{ opacity: loaded ? 1 : 0 }}
                />
            )}
        </>
    );
}

export class ImageBackground extends BaseBackground {
    static backgroundTypeName = "图片";
    constructor(ImageUrl: string) {
        super();
        this.ImageUrl = ImageUrl;
    }
    ImageUrl: string;
    /** Optional downscaled copy in the plugin cache; "" means "use ImageUrl". */
    cachePath: string = "";
    /** Optional ≤48px data url used as the blurred placeholder. */
    thumbnail: string = "";

    private async getMountedImageUrl() {
        const { maxEdge, options } = readImageSettings();
        return mountedImageUrl(this.ImageUrl, maxEdge, plugin.pluginPath, options)
            .catch(() => mountFileCached(this.ImageUrl));
    }

    /** Lets the plugin preload this background before React renders it. */
    async resolveImageUrl(): Promise<string> {
        return await this.getMountedImageUrl();
    }

    /**
     * Refreshes the optional display copy for current settings and creates a
     * placeholder when absent. Originals remain available during preparation.
     */
    async prepare(): Promise<boolean> {
        let changed = false;
        if (compressibleKind(this.ImageUrl) === "compress") {
            const { maxEdge, options } = readImageSettings();
            const result = await optimizeImage(this.ImageUrl, maxEdge, plugin.pluginPath, options);
            // Ignore work completed after the user changed compression settings.
            if (JSON.stringify(readImageSettings()) !== JSON.stringify({ maxEdge, options })) return false;
            if (this.cachePath !== result.path) {
                this.cachePath = result.path;
                changed = true;
            }
        }
        if (!this.thumbnail) {
            const thumbnail = await createThumbnail(this.ImageUrl);
            if (thumbnail) {
                this.thumbnail = thumbnail;
                changed = true;
            }
        }
        return changed;
    }

    async backgroundElement() {
        const url = await this.getMountedImageUrl();
        return <BackgroundImage key={url} imageUrl={url} original={this.ImageUrl} thumbnail={this.thumbnail} />;
    }
    async previewBackground(): Promise<React.FC> {
        const url = await this.getMountedImageUrl();
        return () => <div style={{ background: `url(${url}) 0% 0% / cover` }} />;
    }

    static default(): ImageBackground {
        return new ImageBackground("");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const path = await betterncm.app.openFileDialog(".webp .png .jpg .jpeg .bmp .gif\0", "./");
        if (!path) return null;
        let exists = false;
        try {
            exists = betterncm_native.fs.exists(path);
        } catch {
            // Report inaccessible paths through the same failure UI.
        }
        if (!exists) {
            Swal.fire('添加背景失败',
                `原因可能为：
1. 你选中的路径内有特殊字符（中文，制表符等）
2. 你选中的路径不存在`, 'error')
            return null;
        }
        const background = new ImageBackground(path);
        return background;
    }
}

