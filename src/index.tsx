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
import { STORE_BGBLUR, STORE_BGBLURPULSE, STORE_BGBLURTRANSITION, STORE_BGBRIGHTNESS, STORE_BGLIST, STORE_BGMAXEDGE, STORE_BGMODE, STORE_BGSCALE } from "./keys";
import { ReactElement } from "react";
import { BackgroundTypes, parseBackgroundList, saveBackgroundList, useLocalStorageBackgroundList } from "./backgroundList";
import Swal from "sweetalert2";
import { watchBlurPulse } from "./resizeEffect";
import { preloadBackground, preloadBackgrounds } from "./mediaLoad";

/** 0 表示不生成副本，直接使用原图。 */
export const MAX_IMAGE_EDGE = 15360;

export function parseMaxImageEdge(raw: string | null): number {
    if (raw === null || raw.trim() === "") return 0;
    return clampStoredNumber(raw, 0, MAX_IMAGE_EDGE, 0);
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
    backgroundList, buttons, currentIDs = null
}: {
    backgroundList: BaseBackground[], buttons: (base: BaseBackground) => ReactElement, currentIDs?: string[] | null
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
    }, [backgroundList]);

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

    // Warm every stored background once, so switching to another background in
    // the list does not start a cold download.
    React.useEffect(() => {
        preloadBackgrounds(backgroundList);
    }, []);

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
            if (changed) saveBackgroundList(STORE_BGLIST, backgroundList);
        })();
        return () => { disposed = true; };
    }, [backgroundList]);

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
        () => currentBackground.backgroundElement(), [backgroundList]);

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
                className={`btn ${backgroundMode === id &&
                    "enabled"
                    }`}
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
                        transform: effectiveScale !== 1 ? `scale(${effectiveScale})` : "none",
                        // Declared inline so the host theme's `transition: none !important`
                        // reset cannot suppress the configurable blur transition.
                        transition: blurTransitionCss(blurTransition) || "none",
                    }}
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
                                <div className="buttons">
                                    <span className="full expand-h u-ibtn5">
                                        <span className="ico">
                                            <MdAdd />
                                        </span>
                                        <span className="content">
                                            {BackgroundTypes.map((type) => (
                                                // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                                <span
                                                    key={type.name}
                                                    className="btn"
                                                    onClick={() =>
                                                        askAndAddBackground(type)
                                                    }
                                                >
                                                    {type.backgroundTypeName}
                                                </span>
                                            ))}
                                        </span>
                                    </span>
                                    <span className="extendable u-ibtn5">
                                        <span className="ico">
                                            <MdDesktopWindows />
                                        </span>
                                        <span className="content">
                                            <BackgroundModeElement name="覆盖" id="cover" />
                                            <BackgroundModeElement name="覆盖居中" id="cover-centered" />
                                            <BackgroundModeElement name="拉伸" id="stretch" />
                                        </span>
                                    </span>
                                </div>
                                <div className="universalOptions u-ibtn5" style={{
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
                                <div className="universalOptions u-ibtn5" style={{
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
                                    <div style={{ margin: ".5em", fontSize: ".85em", opacity: ".75" }}>
                                        过渡时间为 0 或脉冲强度为 0 时关闭对应效果；系统开启「减少动态效果」时同样停用脉冲。
                                    </div>
                                </div>
                                <div className="universalOptions u-ibtn5" style={{
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
                                    <div style={{ margin: ".5em", fontSize: ".85em", opacity: ".75" }}>
                                        0 表示不生成副本、直接用原图，越大越清晰；设为 0 以外的值时会在插件目录的 .bge-cache 下生成缩小副本，删除该目录即可全部重建。所有图片都会生成一张模糊占位图来掩盖加载过程。
                                    </div>
                                </div>
                                <div className="u-ibtn5" style={{
                                    width: '100%',
                                    height: 'max-content',
                                    borderRadius: '.8em',
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
                                    <BackgroundPreviewList backgroundList={backgroundList} buttons={(background) => (
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
