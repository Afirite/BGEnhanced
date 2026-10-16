import { STORE_BGIMAGEFORMAT, STORE_BGIMAGEQUALITY, STORE_BGMAXEDGE } from "./keys";
import { ImageOptimizationOptions } from "./imageCache";

export function readImageSettings(): { maxEdge: number; options: ImageOptimizationOptions } {
    try {
        const storage = window.localStorage;
        const edge = Number(storage.getItem(STORE_BGMAXEDGE) ?? 0);
        const raw = storage.getItem(STORE_BGIMAGEFORMAT) ?? '"webp"';
        let format: string;
        try { format = JSON.parse(raw); } catch { format = raw; }
        const quality = Number(storage.getItem(STORE_BGIMAGEQUALITY) ?? 86);
        return {
            maxEdge: Number.isFinite(edge) ? Math.min(15360, Math.max(0, edge)) : 0,
            options: {
                format: format === "jpeg" ? "jpeg" : "webp",
                quality: Number.isFinite(quality) ? Math.min(100, Math.max(10, quality)) / 100 : .86,
            },
        };
    } catch {
        return { maxEdge: 0, options: { format: "webp", quality: .86 } };
    }
}
