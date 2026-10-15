export type ResolutionPath = readonly string[];

/** A path belongs to one render; repeated renders never accumulate visits. */
export function enterBackground(path: ResolutionPath, id: string): ResolutionPath {
    if (path.includes(id)) throw new Error(`背景循环引用：${[...path, id].join(" → ")}`);
    return [...path, id];
}

export function chooseBackground<T>(items: readonly T[], random = Math.random): T {
    if (!items.length) throw new Error("没有可供抽选的背景，请添加背景或调整排除列表。");
    return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
}
