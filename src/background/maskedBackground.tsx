import { ReactElement } from "react";
import { NotImplementedError } from "../errors";
import { BaseBackground } from "./background";
import { BackgroundPreviewList, selfPlugin } from "..";
import Swal from "sweetalert2";
import { MdSelectAll } from "react-icons/md";
import { RecursiveLockBackground } from "./RecursiveLockBackground";
import { ResolutionPath } from "./resolution";

export class MaskedBackground extends RecursiveLockBackground {
    async onConfig(): Promise<undefined> {
        const ConfigMenu = () => {
            const [target, setTarget] = React.useState(this.target);
            const [maskColorMain, setMaskColorMain] = React.useState<string>(this.maskColor.slice(0, 7));
            const [maskColorOpacity, setMaskColorOpacity] = React.useState<number>(parseInt(this.maskColor.slice(7, 9), 16));
            const [maskBlur, setMaskBlur] = React.useState<number>(this.maskBlur);

            // https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
            function pad(num, size) {
                var s = "000" + num;
                return s.substr(s.length - size);
            }

            React.useEffect(() => {
                this.target = target;
                this.maskColor = maskColorMain + pad(maskColorOpacity.toString(16), 2);
                console.log(pad(maskColorOpacity.toString(16), 2))
                this.maskBlur = maskBlur;
            }, [target, maskColorMain, maskColorOpacity, maskBlur]);

            const checkBackground = (bg) => {
                setTarget(bg.id);
            }

            const filteredBGList = React.useMemo(() =>
                selfPlugin.backgroundList.filter(bg => bg !== this)
                , []);

            return <>
                <div>
                    <span>
                        遮罩颜色：
                    </span>
                    <input type="color" value={maskColorMain} onChange={(e) => setMaskColorMain(e.target.value)} />
                    <br />
                    <span>
                        遮罩透明度：
                    </span>
                    <input type="range" value={maskColorOpacity} min={0} max={255} step={1} onChange={(e) => setMaskColorOpacity(parseFloat(e.target.value))} />
                    <br />
                    <span>
                        遮罩高斯模糊：
                    </span>
                    <input type="range" value={maskBlur} min={0} max={60} step={1} onChange={(e) => setMaskBlur(parseFloat(e.target.value))} />
                    <br />
                </div>
                <div>
                    遮罩对象：
                </div>
                <BackgroundPreviewList backgroundList={filteredBGList}
                    currentIDs={[target]}
                    buttons={bg => <>
                        <span
                            className="btn"
                            onClick={() => checkBackground(bg)}
                        >
                            <MdSelectAll color="white" />
                        </span>
                    </>} />
            </>
        }

        const p = Swal.fire({ title: "遮罩背景设置", html: "<div id=MaskedBackgroundConfigContainer class=BGEnhanced-Config style='font-size:.5em;' />" });

        const container = document.getElementById("MaskedBackgroundConfigContainer")!;
        ReactDOM.render(<ConfigMenu />, container);
        try { await p; }
        finally { ReactDOM.unmountComponentAtNode(container); }

        return;
    }
    static backgroundTypeName: string = "遮罩背景";
    static attributes = ["recursive"];

    target: string = "";
    maskColor = "#ffffff22";
    maskBlur = 0;

    private targetBackground(): BaseBackground {
        const target = (selfPlugin.backgroundList as BaseBackground[]).find(bg => bg.id === this.target);
        if (!target) throw new Error("遮罩对象不存在，请重新选择背景。");
        return target;
    }

    async previewBackground(path: ResolutionPath = []): Promise<React.FC> {
        const Preview = await this.targetBackground().previewBackground(this.enter(path));
        return () => <>
            <Preview />
            <div className={`bgMask-${this.id}`} />
            <style>
                {this.#getStyleSheet()}
            </style>
        </>;
    }

    #getStyleSheet() {
        return `
.bgMask-${this.id}{
    position:absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    background:${this.maskColor};
    backdrop-filter:blur(${this.maskBlur}px);
}
`;
    }

    async backgroundElement(path: ResolutionPath = []): Promise<ReactElement> {
        const element = await this.targetBackground().backgroundElement(this.enter(path));
        return <>
            {element}
            <div className={`bgMask-${this.id}`} />
            <style>
                {this.#getStyleSheet()}
            </style>
        </>

    }
    static default(): BaseBackground {
        return new MaskedBackground;
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const bg = new MaskedBackground;
        await bg.onConfig();
        return bg;
    }
}