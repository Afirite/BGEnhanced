import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";
import { RemoteImageBackground } from "./remoteImageBackground";
import Swal from "sweetalert2";

export class RemoteRandImageBackgroundLoli extends RemoteImageBackground {
    static backgroundTypeName = "随机二次元";
    constructor(url:string) {
        super(url);
    }
    static default(): RemoteRandImageBackgroundLoli {
        return new RemoteRandImageBackgroundLoli("");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        Swal.fire({ title: "正在获取背景…", didOpen: () => Swal.showLoading() });
        try {
            const response = await fetch("https://www.loliapi.com/acg/pc/");
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return new RemoteRandImageBackgroundLoli(response.url);
        } finally {
            Swal.close();
        }
    }
}

