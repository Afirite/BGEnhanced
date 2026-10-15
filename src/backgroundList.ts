import { BaseBackground } from "./background/background";
import { CoverImageBackground } from "./background/coverImageBackground";
import { CSSBackground } from "./background/cssBackground";
import { ImageBackground } from "./background/imageBackground";
import { MaskedBackground } from "./background/maskedBackground";
import { RandomBackground } from "./background/randomBackground";
import { RemoteImageBackground } from "./background/remoteImageBackground";
import { RemoteRandImageBackgroundLoli } from "./background/remoteRandImageBackgroundLoli";
import { RemoteRandImageBackgroundScenery } from "./background/remoteRandImageBackgroundScenery";
import { VideoBackground } from "./background/videoBackground";
import { useLocalStorage } from "./hooks";

const legacyTypes: Record<string, string> = {
    VideoBackground: "video", CSSBackground: "css", ImageBackground: "image",
    RemoteRandImageBackgroundLoli: "anime", RemoteRandImageBackgroundScenery: "bing",
    CoverImageBackground: "cover", RandomBackground: "random",
    RemoteImageBackground: "remote-image", MaskedBackground: "masked",
};
const registry = [
    { type: "video", ctor: VideoBackground },
    { type: "css", ctor: CSSBackground },
    { type: "image", ctor: ImageBackground },
    { type: "anime", ctor: RemoteRandImageBackgroundLoli },
    { type: "bing", ctor: RemoteRandImageBackgroundScenery },
    { type: "cover", ctor: CoverImageBackground },
    { type: "random", ctor: RandomBackground },
    { type: "remote-image", ctor: RemoteImageBackground },
    { type: "masked", ctor: MaskedBackground },
];
export const BackgroundTypes = registry.map(entry => entry.ctor);

export function parseBackgroundList(text: string): BaseBackground[] {
    const data = JSON.parse(text);
    // Existing installs store an unversioned array containing class names.
    const values = Array.isArray(data) ? data : data?.version === 1 ? data.backgrounds : null;
    if (!Array.isArray(values)) throw new Error("不支持的背景配置版本");
    const seen = new Set<string>();
    return values.flatMap(value => {
        if (!value || typeof value !== "object") return [];
        const normalizedType = legacyTypes[value.type] ?? value.type;
        const entry = registry.find(entry => entry.type === normalizedType);
        if (!entry) return [];
        const instance = entry.ctor.default();
        // Only restore known data fields, never methods or prototype properties.
        for (const key of Object.keys(instance)) {
            if (key === "id" || key === "current") continue;
            const candidate = value[key];
            const initial = instance[key];
            if (Array.isArray(initial)) {
                if (Array.isArray(candidate) && candidate.every(item => typeof item === "string")) instance[key] = candidate;
            } else if (typeof candidate === typeof initial && (typeof candidate !== "number" || Number.isFinite(candidate))) {
                instance[key] = candidate;
            }
        }
        if (typeof value.id === "string" && value.id && !seen.has(value.id)) instance.id = value.id;
        seen.add(instance.id);
        instance.current = value.current === true;
        return [instance];
    });
}

export function stringifyBackgroundList(backgrounds: BaseBackground[]): string {
    return JSON.stringify({ version: 1, backgrounds: backgrounds.map(bg => {
        const entry = registry.find(entry => bg.constructor === entry.ctor);
        if (!entry) throw new Error("未注册的背景类型");
        return { ...bg, type: entry.type };
    }) });
}

export function useLocalStorageBackgroundList(key: string) {
    return useLocalStorage<BaseBackground[]>(key, [], parseBackgroundList, stringifyBackgroundList);
}

/**
 * Writes the list straight to localStorage, bypassing React. Used when a
 * background picks up runtime-generated data (cached image path, thumbnail)
 * without any user action, where a state update would be a pointless rerender.
 */
export function saveBackgroundList(key: string, backgrounds: BaseBackground[]): void {
    try {
        window.localStorage.setItem(key, stringifyBackgroundList(backgrounds));
    } catch (error) {
        console.log(error);
    }
}
