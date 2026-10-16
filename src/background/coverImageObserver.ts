export const coverImageSelector = ".normal.j-cover, .cmd-image";

function containsCover(node: Node): boolean {
    if (node.nodeType !== 1) return false;
    const element = node as Element;
    return element.matches(coverImageSelector) || !!element.querySelector(coverImageSelector);
}

function affectsCover(record: MutationRecord): boolean {
    if (record.type === "attributes") {
        return record.attributeName === "src" && record.target.nodeType === 1
            && (record.target as Element).matches(coverImageSelector);
    }
    if (record.type !== "childList") return false;
    return Array.from(record.addedNodes).some(containsCover)
        || Array.from(record.removedNodes).some(containsCover);
}

/** Observe cover changes without querying the document for unrelated host updates. */
export function observeCoverChanges(update: () => void): () => void {
    let disposed = false;
    let frame: number | undefined;
    const observer = new MutationObserver(records => {
        if (disposed || frame !== undefined || !records.some(affectsCover)) return;
        frame = requestAnimationFrame(() => {
            frame = undefined;
            if (!disposed) update();
        });
    });
    observer.observe(document.body, {
        subtree: true, childList: true, attributes: true, attributeFilter: ["src"]
    });
    update();
    return () => {
        disposed = true;
        observer.disconnect();
        if (frame !== undefined) cancelAnimationFrame(frame);
    };
}
