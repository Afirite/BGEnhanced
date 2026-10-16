/**
 * @fileoverview
 * 此处的脚本将会在插件管理器加载插件期间被加载
 * 一般情况下只需要从这个入口点进行开发即可满足绝大部分需求
 */
import {
    MdAdd,
    MdDelete,
    MdDesktopWindows,
    MdSelectAll,
    MdSettings,
} from "react-icons/md";
import { BaseBackground } from "./background/background";
import { CSSBackground } from "./background/cssBackground";

import { useLocalStorage, usePromise } from "./hooks";
import { clampScale } from "./scale";
import { backgroundEffectStyle, blurTransitionCss, clampBlurValue, clampBlurPulseStrengthValue, clampBlurTransitionValue, clampStoredNumber, parseBackgroundBlur, parseBackgroundBrightness, parseBackgroundScale, parseBlurPulseStrength, parseBlurTransition, BLUR_MAX, BLUR_PULSE_STRENGTH_DEFAULT, BLUR_PULSE_STRENGTH_MAX, BLUR_PULSE_STRENGTH_STEP, BLUR_STEP, BLUR_TRANSITION_DEFAULT, BLUR_TRANSITION_MAX, BLUR_TRANSITION_STEP } from "./blur";
import "./index.scss";
import { STORE_BGBLUR, STORE_BGBLURPULSE, STORE_BGBLURTRANSITION, STORE_BGBRIGHTNESS, STORE_BGLIST, STORE_BGIMAGEFORMAT, STORE_BGIMAGEQUALITY, STORE_BGMAXEDGE, STORE_BGMODE, STORE_BGSCALE } from "./keys";
import { ReactElement } from "react";
import { BackgroundTypes, parseBackgroundList, saveBackgroundList, useLocalStorageBackgroundList } from "./backgroundList";
import Swal from "sweetalert2";
import { watchBlurPulse } from "./resizeEffect";
import { ImageBackground } from "./background/imageBackground";
import { formatBytes, optimizeImage } from "./imageCache";
import { preloadBackground, preloadBackgrounds } from "./mediaLoad";

/** 0 表示保留原图分辨率，仅按所选格式和质量编码。 */
export const MAX_IMAGE_EDGE = 15360;

export function parseMaxImageEdge(raw: string | null): number {
    if (raw === null || raw.trim() === "") return 0;
    return clampStoredNumber(raw, 0, MAX_IMAGE_EDGE, 0);
}

export type LocalImageFormat = "webp" | "jpeg";
export function parseLocalImageFormat(raw: string): LocalImageFormat {
    try {
        const value = JSON.parse(raw);
        return value === "jpeg" ? "jpeg" : "webp";
    } catch {
        return raw === "jpeg" ? "jpeg" : "webp";
    }
}
export function parseLocalImageQuality(raw: string | null): number {
    if (raw === null || raw.trim() === "") return 86;
    return clampStoredNumber(raw, 10, 100, 86);
}

document.body.classList.add('BGEnhanced');

/**
 * Printed on every load so "is the host running my new package?" is answerable
 * from the console: the stamp changes with each build.
 */
console.log(`[BGEnhanced] ${__BGE_VERSION__} loaded, build ${__BGE_BUILD__}`);

let configElement = document.createElement("div");
const BGDom = document.createElement("div");
BGDom.classList.add("BGEnhanced-BackgoundDom");

/**
 * Starts the media request as early as possible: this runs while the plugin
 * script itself is being evaluated, before React mounts and long before the
 * host finishes its own startup work. Only the background the user is actually
 * showing is warmed, so nothing else competes for the connection.
 */
function preloadCurrentBackground() {
    try {
        const stored = window.localStorage.getItem(STORE_BGLIST);
        if (!stored) return;
        const backgroundList = parseBackgroundList(stored);
        const current = backgroundList.find(bg => bg.current) ?? backgroundList[0];
        if (current) preloadBackground(current);
    } catch {
        // A broken config must never stop the plugin from loading.
    }
}

preloadCurrentBackground();

export let selfPlugin;
plugin.onLoad((_selfPlugin) => {
    selfPlugin = _selfPlugin.mainPlugin;
    selfPlugin.backgroundList = []

    ReactDOM.render(<Main />, BGDom);
    document.body.appendChild(BGDom);
    window.addEventListener("pagehide", () => {
        ReactDOM.unmountComponentAtNode(BGDom);
        BGDom.remove();
        document.body.classList.remove("BGEnhanced", "prefab-transparency");
    }, { once: true });
});

// setInterval(
//     () =>
//     (document.querySelector(".BGEnhanced-styles")!.innerHTML =
//         betterncm_native.fs.readFileText(`${plugin.pluginPath}/index.css`)),
//     600,
// );

export function BackgroundPreviewList({
    backgroundList, buttons, currentIDs = null, revision = 0
}: {
    backgroundList: BaseBackground[], buttons: (base: BaseBackground) => ReactElement, currentIDs?: string[] | null, revision?: number
}) {
    function PreviewBackground(background: BaseBackground, preview: ReactElement | null) {
        return (
            <span className={`bg-block ${(currentIDs == null ? background.current : currentIDs.includes(background.id)) && "selected"}`}>
                {preview}

                <div className="info">
                    <div className="name">
                        {(background.constructor as any).backgroundTypeName}
                    </div>

                    <div className="buttons">
                        {buttons(background)}
                    </div>
                </div>
            </span>
        );
    }

    const [previews, setPreviews] = React.useState<Record<string, { component?: React.FC; error?: string }>>({});

    React.useEffect(() => {
        let canceled = false;
        setPreviews({});
        for (const background of backgroundList) {
            background.previewBackground().then(component => {
                if (!canceled) setPreviews(prev => ({ ...prev, [background.id]: { component } }));
            }, error => {
                if (!canceled) setPreviews(prev => ({ ...prev, [background.id]: { error: String(error) } }));
            });
        }
        return () => { canceled = true; };
    }, [backgroundList, revision]);

    return <>
        {backgroundList.map(background => {
            const preview = previews[background.id];
            return <React.Fragment key={background.id}>
                {PreviewBackground(background, preview?.component
                    ? React.createElement(preview.component)
                    : <div>{preview?.error ?? "加载中…"}</div>)}
            </React.Fragment>;
        })}
    </>
}

function Main() {
    const stylesheet = React.useMemo(
        () =>
            betterncm_native.fs.readFileText(`${plugin.pluginPath}/index.css`),
        [],
    );


    const [backgroundScale, setBackgroundScale] = useLocalStorage(
        STORE_BGSCALE,
        1,
        parseBackgroundScale,
    );

    const [backgroundBrightness, setBackgroundBrightness] = useLocalStorage(
        STORE_BGBRIGHTNESS,
        1,
        parseBackgroundBrightness,
    );

    // Legacy installs stored some of these settings as strings, and a corrupt
    // entry used to leave the controlled sliders with no value at all; the
    // parsers now always return an in-range number.
    const [backgroundBlur, setBackgroundBlur] = useLocalStorage(
        STORE_BGBLUR,
        0,
        parseBackgroundBlur,
    );

    const [blurTransition, setBlurTransition] = useLocalStorage(
        STORE_BGBLURTRANSITION,
        BLUR_TRANSITION_DEFAULT,
        parseBlurTransition,
    );

    const [blurPulseStrength, setBlurPulseStrength] = useLocalStorage(
        STORE_BGBLURPULSE,
        BLUR_PULSE_STRENGTH_DEFAULT,
        parseBlurPulseStrength,
    );

    // One pulse per resize burst; the hook owns the timer and cleans it up.
    const [pulseBlur, setPulseBlur] = React.useState(0);
    React.useEffect(() => {
        const strength = blurPulseStrength;
        const duration = blurTransition;
        return watchBlurPulse(window, strength, duration, active => setPulseBlur(active ? strength : 0));
    }, [blurPulseStrength, blurTransition]);

    const [backgroundMode, setBackgroundMode] = useLocalStorage(
        STORE_BGMODE,
        "cover-centered",
    );

    const [prefabTransparencyStatus, setPrefabTransparencyStatus] = useLocalStorage(
        "cc.microblock.prefab.transparency",
        false,
        (v) => v === "true",
    );

    React.useEffect(() => {
        if (prefabTransparencyStatus) {
            document.body.classList.add("prefab-transparency");
        } else {
            document.body.classList.remove("prefab-transparency");
        }
    }, [prefabTransparencyStatus]);

    const [backgroundList, setBackgroundList] = useLocalStorageBackgroundList(STORE_BGLIST);

    const [maxImageEdge, setMaxImageEdge] = useLocalStorage(
        STORE_BGMAXEDGE,
        0,
        parseMaxImageEdge,
    );
    const [imageFormat, setImageFormat] = useLocalStorage<LocalImageFormat>(
        STORE_BGIMAGEFORMAT,
        "webp",
        parseLocalImageFormat,
    );
    const [imageQuality, setImageQuality] = useLocalStorage(
        STORE_BGIMAGEQUALITY,
        86,
        parseLocalImageQuality,
    );

    // Warm every stored background once, so switching to another background in
    // the list does not start a cold download.
    React.useEffect(() => {
        preloadBackgrounds(backgroundList);
    }, []);

    const [imageRevision, setImageRevision] = React.useState(0);

    // Generate the missing cached copy / blurred placeholder in the background.
    // Neither is needed for the first paint, so this never blocks the UI; when
    // something is generated it is written straight to localStorage because the
    // user did not change anything.
    React.useEffect(() => {
        let disposed = false;
        void (async () => {
            let changed = false;
            for (const background of backgroundList) {
                const preparable = background as { prepare?: () => Promise<boolean> };
                if (typeof preparable.prepare !== "function") continue;
                try {
                    if (await preparable.prepare()) changed = true;
                } catch {
                    // Optimisation is optional.
                }
                if (disposed) return;
            }
            if (changed && !disposed) {
                saveBackgroundList(STORE_BGLIST, backgroundList);
                setImageRevision(value => value + 1);
            }
        })();
        return () => { disposed = true; };
    }, [backgroundList, maxImageEdge, imageFormat, imageQuality]);

    React.useEffect(() => {
        selfPlugin.backgroundList = backgroundList;
    }, [backgroundList]);



    const currentBackground = React.useMemo(() => {
        return (
            backgroundList.find((bg) => bg.current) ??
            backgroundList[0] ??
            new CSSBackground("linear-gradient(45deg, #0037ff, #005aff)")
        );
    }, [backgroundList]);

    // Stable per background id: unrelated re-renders (sliders, previews, adding
    // another background) keep the same element, so the browser reuses the
    // decoded image instead of fetching it again.
    const backgroundRenderKey = backgroundList.find(bg => bg.current)?.id
        ?? backgroundList[0]?.id
        ?? "no-background";

    const [currentConfigBackground, setCurrentConfigBackground] = React.useState<ReactElement | null>(null);

    const [currentBackgroundElement, backgroundError] = usePromise(
        () => currentBackground.backgroundElement(), [backgroundList, maxImageEdge, imageFormat, imageQuality, imageRevision]);

    // Window sizing is handled entirely by CSS. No resize-driven React render
    // or read/write layout loop is necessary for image/video backgrounds.

    async function askAndAddBackground(background) {
        try {
            const result = await background.askAndCreate();
            if (result != null) {
                for (const bg of backgroundList) bg.hooks__onBeforeAddBackground(result);
                setBackgroundList(prev => prev.concat(result));
            }
        } catch (error) {
            await Swal.fire("添加背景失败", String(error), "error");
        }
    }

    function removeBackground(background: BaseBackground) {
        for (const bg of backgroundList) bg.hooks__onBeforeRemoveBackground(background);
        setBackgroundList(backgroundList.filter((bg) => bg !== background));
    }

    function selectBackground(background: BaseBackground) {
        setBackgroundList(
            backgroundList.map((bg) => {
                if (bg === background) bg.current = true;
                else bg.current = false;
                return bg;
            }),
        );
    }

    function BackgroundModeElement({ name, id }: { name: string, id: string }) {
        return (
            <span
                className={backgroundMode === id ? "bge-option-button enabled" : "bge-option-button"}
                onClick={() =>
                    setBackgroundMode(id)
                }
            >
                {name}
            </span>
        )
    }


    const effectiveScale = clampScale(backgroundScale);
    // Base blur plus the active resize pulse; the transition duration smooths
    // both this filter change and the transform change below. Values are already
    // normalised by the localStorage parsers, so no extra clamping here.
    const effectiveBlur = backgroundBlur + pulseBlur;
    return (
        <>
            <div className="BGE-viewport">
                <div
                    style={{
                        ...backgroundEffectStyle(effectiveBlur, backgroundBrightness, effectiveScale),
                        "--bge-background-transition": blurTransitionCss(blurTransition) || "none",
                    } as React.CSSProperties}
                    className={`background mode-${backgroundMode}`}
                >
                    <div className="container" key={backgroundRenderKey}>
                        {backgroundError
                            ? <div className="BGEnhanced-error">{String(backgroundError)}</div>
                            : currentBackgroundElement}
                    </div>
                </div>
            </div>

            <style className="BGEnhanced-styles">{stylesheet}</style>

            {ReactDOM.createPortal(
                <>
                    <div className="BGEnhanced-Config">
                        {
                            currentConfigBackground ? currentConfigBackground : <>
                                <div className="bge-panels">
                                    <div className="bge-panel">
                                        <div className="bge-panel-head">
                                            <span className="ico">
                                                <MdAdd />
                                            </span>
                                            <span className="bge-panel-name">添加背景</span>
                                        </div>
                                        <div className="bge-panel-body">
                                            {BackgroundTypes.map((type) => (
                                                // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                                <span
                                                    key={type.name}
                                                    className="bge-option-button"
                                                    onClick={() =>
                                                        askAndAddBackground(type)
                                                    }
                                                >
                                                    {type.backgroundTypeName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bge-panel">
                                        <div className="bge-panel-head">
                                            <span className="ico">
                                                <MdDesktopWindows />
                                            </span>
                                            <span className="bge-panel-name">背景适配</span>
                                        </div>
                                        <div className="bge-panel-body">
                                            <BackgroundModeElement name="覆盖" id="cover" />
                                            <BackgroundModeElement name="覆盖居中" id="cover-centered" />
                                            <BackgroundModeElement name="拉伸" id="stretch" />
                                        </div>
                                    </div>
                                </div>
                                <div className="universalOptions bge-setting-group u-ibtn5" style={{
                                    width: '100%',
                                    height: 'max-content',
                                    borderRadius: '.5em',
                                    padding: '.5em .6ex',
                                    opacity: '0.9',
                                    marginBottom: "1em"
                                }}>
                                    <SliderRow label="缩放" value={backgroundScale} min={0.25} max={3} step={0.01}
                                        onChange={value => setBackgroundScale(clampScale(value))} />
                                    <SliderRow label="模糊" suffix="px" value={backgroundBlur} min={0} max={BLUR_MAX} step={BLUR_STEP}
                                        onChange={value => setBackgroundBlur(clampBlurValue(value))} />
                                    <SliderRow label="明度" value={backgroundBrightness} min={0} max={1} step={0.01}
                                        onChange={value => setBackgroundBrightness(value)} />
                                </div>
                                <div className="universalOptions bge-setting-group u-ibtn5" style={{
                                    width: '100%',
                                    height: 'max-content',
                                    borderRadius: '.5em',
                                    padding: '.5em .6ex',
                                    opacity: '0.9',
                                    marginBottom: "1em"
                                }}>
                                    <div style={{ margin: ".5em", opacity: ".75" }}>
                                        模糊过渡（作用于缩放/切换背景和调整模糊、明度、缩放时）
                                    </div>
                                    <SliderRow label="过渡时间" suffix="ms" value={blurTransition}
                                        min={0} max={BLUR_TRANSITION_MAX} step={BLUR_TRANSITION_STEP}
                                        onChange={value => setBlurTransition(clampBlurTransitionValue(value))} />
                                    <SliderRow label="缩放脉冲强度" suffix="px" value={blurPulseStrength}
                                        min={0} max={BLUR_PULSE_STRENGTH_MAX} step={BLUR_PULSE_STRENGTH_STEP}
                                        onChange={value => setBlurPulseStrength(clampBlurPulseStrengthValue(value))} />
                                    <div className="bge-setting-description" style={{ margin: ".5em", fontSize: "calc(.85em - .3px)", opacity: ".75" }}>
                                        过渡时间为 0 或脉冲强度为 0 时关闭对应效果；系统开启「减少动态效果」时同样停用脉冲。
                                    </div>
                                </div>
                                <div className="universalOptions bge-setting-group u-ibtn5" style={{
                                    width: '100%',
                                    height: 'max-content',
                                    borderRadius: '.5em',
                                    padding: '.5em .6ex',
                                    opacity: '0.9',
                                    marginBottom: "1em"
                                }}>
                                    <div style={{ margin: ".5em", opacity: ".75" }}>
                                        本地图片优化（仅对本地图片生效，原文件不会被修改）
                                    </div>
                                    <SliderRow label="副本最长边" value={maxImageEdge}
                                        min={0} max={MAX_IMAGE_EDGE} step={256}
                                        onChange={value => setMaxImageEdge(parseMaxImageEdge(String(value)))} />
                                    <label className="bge-image-format-row">
                                        <span>输出格式</span>
                                        <select value={imageFormat} onChange={event => setImageFormat(event.currentTarget.value as LocalImageFormat)}>
                                            <option value="webp">WebP</option>
                                            <option value="jpeg">JPEG</option>
                                        </select>
                                    </label>
                                    <SliderRow label="压缩质量" suffix="%" value={imageQuality} min={10} max={100} step={1}
                                        onChange={value => setImageQuality(parseLocalImageQuality(String(value)))} />
                                    <div className="bge-setting-description" style={{ margin: ".5em", fontSize: "calc(.85em - .3px)", opacity: ".75" }}>
                                        副本最长边为 0 时不缩小分辨率，仍可按格式和质量生成副本；绝不放大，且结果不小于原图时保留原图。输出副本保存在 .bge-cache，原文件不会修改。JPEG 会将透明背景铺为白色；要保留透明效果请选择 WebP。
                                    </div>
                                    <ImageOptimizationInfo background={currentBackground} maxEdge={maxImageEdge}
                                        format={imageFormat} quality={imageQuality} revision={imageRevision} />
                                </div>
                                <div className="bge-setting-group u-ibtn5" style={{
                                    width: '100%',
                                    height: 'max-content',
                                    borderRadius: '.5em',
                                    padding: '.5em .6ex',
                                    opacity: '0.9',
                                    marginBottom: "1em"
                                }}
                                    onClick={() =>
                                        setPrefabTransparencyStatus(!prefabTransparencyStatus)
                                    }>
                                    <span className="btn">
                                        [{prefabTransparencyStatus ? '√' : '×'}] 预制全透明
                                    </span>
                                </div>
                                <div className="backgrounds">
                                    <BackgroundPreviewList backgroundList={backgroundList} revision={imageRevision} buttons={(background) => (
                                        <>
                                            <span className="btn" onClick={async () => {
                                                try {
                                                    await background.onConfig();
                                                    setBackgroundList(prev => [...prev]);
                                                } catch (error) {
                                                    await Swal.fire("背景配置失败", String(error), "error");
                                                }
                                            }}>
                                                <MdSettings />
                                            </span>
                                            <span
                                                className="btn"
                                                onClick={() => removeBackground(background)}
                                            >
                                                <MdDelete />
                                            </span>
                                            <span
                                                className="btn"
                                                onClick={() => selectBackground(background)}
                                            >
                                                <MdSelectAll />
                                            </span>
                                        </>
                                    )} />
                                </div>

                            </>
                        }
                    </div>
                </>,
                configElement,
            )}
        </>
    );
}

function ImageOptimizationInfo({ background, maxEdge, format, quality, revision }: {
    background: BaseBackground; maxEdge: number; format: LocalImageFormat; quality: number; revision: number;
}) {
    const [result, error, state] = usePromise(
        () => background instanceof ImageBackground
            ? optimizeImage(background.ImageUrl, maxEdge, plugin.pluginPath, { format, quality: quality / 100 })
            : Promise.resolve(null),
        [background, maxEdge, format, quality, revision],
    );
    if (!(background instanceof ImageBackground)) return <div className="bge-setting-description" style={{ margin: ".5em" }}>选中本地图片后显示尺寸和文件大小。</div>;
    if (state === "pending") return <div style={{ margin: ".5em" }}>正在读取图片信息…</div>;
    if (error || !result) return <div style={{ margin: ".5em" }}>无法读取图片信息，继续使用原图。</div>;
    const describe = (info: { width: number; height: number; bytes: number }) =>
        info.width > 0 ? info.width + "×" + info.height + "，" + formatBytes(info.bytes) : "尺寸未知";
    return <div style={{ margin: ".5em" }} aria-live="polite">
        <div>原图：{describe(result.source)}</div>
        <div>显示：{describe(result.output)}</div>
        <div>{result.path ? "已使用优化副本" : result.status === "failed" ? "优化失败，使用原图" : "无优化收益或格式不支持，使用原图"}</div>
    </div>;
}

function NumberRow({ label, value }: { label: string, value: number | string }) {
    return (
        <span style={{ margin: ".5em" }}>
            {label}
            <span style={{ opacity: ".7", marginLeft: ".4em" }}>{value}</span>
        </span>
    );
}

/**
 * Controlled so the readout follows the pointer, clamped by the caller before
 * it reaches localStorage.
 */
function SliderRow({ label, value, min, max, step, suffix, onChange }: {
    label: string, value: number, min: number, max: number, step: number,
    suffix?: string, onChange: (value: number) => void,
}) {
    return (
        <div>
            <NumberRow label={label} value={suffix ? `${value}${suffix}` : value} />
            <input type="range"
                className="range"
                min={min} max={max} step={step}
                aria-label={label}
                style={{ width: "calc(100% - 3em)", padding: ".5em" }}
                value={value}
                onChange={(e) => onChange(parseFloat(e.currentTarget.value))} />
        </div>
    );
}

plugin.onConfig(() => {
    return configElement;
});
