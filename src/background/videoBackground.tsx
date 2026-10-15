import { ReactElement } from "react";
import { BaseBackground } from "./background";
import Swal from "sweetalert2";
import { mountFileCached, useMountedUrl } from "../mediaLoad";

/** Mounts first, then plays: no empty `<video>` element and one mount per file. */
function BackgroundVideo({ videoUrl }: { videoUrl: string }) {
    const url = useMountedUrl(videoUrl);
    if (!url) return null;
    return <video autoPlay={true} loop={true} muted={true} preload="auto" src={url} />;
}

export class VideoBackground extends BaseBackground {
    static backgroundTypeName = "视频";
    constructor(videoUrl: string) {
        super();
        this.videoUrl = videoUrl;
    }
    videoUrl: string;

    #mountedVideoUrl?: Promise<string>;
    private async getMountedVideoUrl() {
        if (this.#mountedVideoUrl === undefined) this.#mountedVideoUrl = mountFileCached(this.videoUrl);
        return await this.#mountedVideoUrl;
    }

    /** Lets the plugin preload this background before React renders it. */
    async resolveImageUrl(): Promise<string> {
        return await this.getMountedVideoUrl();
    }

    async backgroundElement() {
        return <BackgroundVideo videoUrl={this.videoUrl} />;
    }
    async previewBackground(): Promise<React.FC> {
        const url = await this.getMountedVideoUrl();
        return () => <video preload="metadata" src={url} />;
    }

    static default(): VideoBackground {
        return new VideoBackground("");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const path = await betterncm.app.openFileDialog(".mp4, .webm\0", "./");
        if(!betterncm_native.fs.exists(path)) {
            Swal.fire('添加背景失败',
`原因可能为：
1. 你选中的路径内有特殊字符（中文，制表符等）
2. 你选中的路径不存在`,'error')
            return null;
        }
        if (path) return new VideoBackground(path);
        return null;
    }
}
