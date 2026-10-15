import { ReactElement } from "react";
import { BaseBackground } from "./background";
import Swal from "sweetalert2";
import { mountFileCached, useMountedUrl } from "../mediaLoad";
import { compressibleKind, createThumbnail, formatBytes, mountedImageUrl, prepareImage, resolvedImagePath } from "../imageCache";
import { STORE_BGMAXEDGE } from "../keys";

/** Mirrors the panel setting; 0 means "use the original file as-is". */
function maxImageEdgeSetting(): number {
    try {
        const raw = window.localStorage.getItem(STORE_BGMAXEDGE);
        if (raw === null || raw.trim() === "") return 0;
        const value = Number(raw);
        return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch {
        return 0;
    }
}

/**
 * Placeholder layer plus the real image. The placeholder is a ≤48px blurred data
 * url stored in the background config, so it paints immediately from
 * localStorage while the full image is still decoding - the progressive
 * "trickles in from the top" look is hidden behind an already-complete image.
 */
function BackgroundImage({ imageUrl, thumbnail }: { imageUrl: string, thumbnail: string }) {
    const full = useMountedUrl(imageUrl);
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
                    onError={() => setLoaded(true)}
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

    #mountedImageUrl?: Promise<string>;
    #mountedFor = "";
    private async getMountedImageUrl() {
        // Re-resolve when the size setting changed, so the slider takes effect on
        // the next render instead of on the next restart.
        const key = `${this.cachePath}|${maxImageEdgeSetting()}`;
        if (this.#mountedImageUrl === undefined || this.#mountedFor !== key) {
            this.#mountedFor = key;
            this.#mountedImageUrl = (this.cachePath
                ? mountFileCached(this.cachePath)
                : mountedImageUrl(this.ImageUrl, maxImageEdgeSetting(), plugin.pluginPath)
            ).catch(() => mountFileCached(this.ImageUrl));
        }
        return await this.#mountedImageUrl;
    }

    /** Lets the plugin preload this background before React renders it. */
    async resolveImageUrl(): Promise<string> {
        return await this.getMountedImageUrl();
    }

    /**
     * Fills in `cachePath` and `thumbnail` once, if not generated yet. Runs in
     * the background so a large original is never required for the first paint.
     */
    async prepare(): Promise<boolean> {
        let changed = false;
        if (compressibleKind(this.ImageUrl) === "compress") {
            const generated = await prepareImage(this.ImageUrl, maxImageEdgeSetting(), plugin.pluginPath);
            const cachePath = generated
                || await resolvedImagePath(this.ImageUrl, maxImageEdgeSetting(), plugin.pluginPath);
            if (cachePath && cachePath !== this.ImageUrl && cachePath !== this.cachePath) {
                this.cachePath = cachePath;
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
        return <BackgroundImage imageUrl={this.ImageUrl} thumbnail={this.thumbnail} />;
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
        if (!betterncm_native.fs.exists(path)) {
            Swal.fire('添加背景失败',
                `原因可能为：
1. 你选中的路径内有特殊字符（中文，制表符等）
2. 你选中的路径不存在`, 'error')
            return null;
        }
        if (!path) return null;
        const background = new ImageBackground(path);
        // Compress and thumbnail in the background: adding a background must not
        // wait for a multi-megabyte re-encode.
        const maxEdge = maxImageEdgeSetting();
        void (async () => {
            try {
                const sourceSize = (await betterncm.fs.readFile(path))?.size ?? 0;
                await background.prepare();
                if (background.cachePath) {
                    const cachedSize = (await betterncm.fs.readFile(background.cachePath))?.size ?? 0;
                    if (maxEdge > 0 && cachedSize > 0 && sourceSize > 0) {
                        Swal.fire({
                            toast: true,
                            position: "bottom-end",
                            timer: 6000,
                            showConfirmButton: false,
                            icon: "success",
                            title: `已生成优化副本：${formatBytes(sourceSize)} → ${formatBytes(cachedSize)}`,
                            text: "原文件保持不变，仅用于显示。",
                        });
                    }
                }
            } catch {
                // Optimisation is optional; the original file is still used.
            }
        })();
        return background;
    }
}
