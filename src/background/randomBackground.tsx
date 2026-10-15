import { ReactElement } from "react";
import { NotImplementedError } from "../errors";
import { BaseBackground } from "./background";
import { BackgroundPreviewList, selfPlugin } from "..";
import Swal from "sweetalert2";
import { MdSelectAll } from "react-icons/md";
import { RecursiveLockBackground } from "./RecursiveLockBackground";
import { chooseBackground, ResolutionPath } from "./resolution";

export class RandomBackground extends RecursiveLockBackground {
    async onConfig(): Promise<undefined> {
        const ConfigMenu = () => {
            const [excludes, setExcludes] = React.useState(this.excludeList);
            const currents = React.useMemo(() =>
                selfPlugin.backgroundList.map(bg => bg.id).filter(id => !excludes.includes(id)),
                [excludes]);

            React.useEffect(() => {
                this.excludeList = excludes;
            }, [excludes]);

            const checkBackground = (bg) => {
                if (excludes.includes(bg.id)) setExcludes(excludes.filter(id => id !== bg.id));
                else setExcludes([...excludes, bg.id]);
            }

            const filteredBGList = React.useMemo(() =>
                selfPlugin.backgroundList.filter(bg => bg !== this)
                , []);

            return <>
                <BackgroundPreviewList backgroundList={filteredBGList}
                    currentIDs={currents}
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

        const p = Swal.fire({ title: "随机背景设置", html: "<div id=RandBGConfigContainer class=BGEnhanced-Config style='font-size:.5em;' />" });

        const container = document.getElementById("RandBGConfigContainer")!;
        ReactDOM.render(<ConfigMenu />, container);

        try { await p; }
        finally { ReactDOM.unmountComponentAtNode(container); }
        this.#selected = undefined;

        return;
    }
    static backgroundTypeName: string = "随机抽选";
    static attributes = ["recursive"];

    excludeList: string[] = [];
    #selected?: BaseBackground;
    private randomBackground(): BaseBackground {
        const candidates = (selfPlugin.backgroundList as BaseBackground[])
            .filter(bg => bg !== this && !this.excludeList.includes(bg.id));
        if (!this.#selected || !candidates.includes(this.#selected)) {
            this.#selected = chooseBackground(candidates);
        }
        return this.#selected;
    }

    async previewBackground(path: ResolutionPath = []): Promise<React.FC> {
        return this.randomBackground().previewBackground(this.enter(path));
    }
    async backgroundElement(path: ResolutionPath = []): Promise<ReactElement> {
        return this.randomBackground().backgroundElement(this.enter(path));
    }
    static default(): BaseBackground {
        return new RandomBackground;
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const bg = new RandomBackground;
        bg.excludeList = [...selfPlugin.backgroundList
            .filter(background => (background.constructor as typeof BaseBackground).attributes.includes("recursive"))
            .map(bg => bg.id)]
        return bg;
    }

    hooks__onBeforeAddBackground(background: BaseBackground) {
        if ((background.constructor as typeof BaseBackground).attributes.includes("recursive")) this.excludeList.push(background.id);
    }

    hooks__onBeforeRemoveBackground(background: BaseBackground) {
        this.excludeList = this.excludeList.filter(id => background.id !== id);
    }
}