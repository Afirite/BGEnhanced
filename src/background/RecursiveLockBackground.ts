import { BaseBackground } from "./background";
import { enterBackground, ResolutionPath } from "./resolution";

export class RecursiveLockBackground extends BaseBackground {
    protected enter(path: ResolutionPath): ResolutionPath {
        return enterBackground(path, this.id);
    }
}
