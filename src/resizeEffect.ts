/**
 * One blur pulse per resize burst, driven by the configurable duration.
 *
 * The pulse is the *extra* blur strength on top of the configured background
 * blur, so `strength` is in px and `duration` in ms. No layout reads and no
 * React render happen inside the handler itself: it only toggles one state bit.
 */
export function watchBlurPulse(
    host: Window,
    strength: number,
    duration: number,
    setActive: (active: boolean) => void,
) {
    // Either value at zero means the user turned the pulse off.
    if (!(strength > 0) || !(duration > 0)) return () => {};
    if (host.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};
    let timer: number | undefined;
    let active = false;
    const onResize = () => {
        if (!active) {
            active = true;
            setActive(true);
        }
        host.clearTimeout(timer);
        timer = host.setTimeout(() => {
            active = false;
            setActive(false);
        }, duration);
    };
    host.addEventListener("resize", onResize, { passive: true });
    return () => {
        host.removeEventListener("resize", onResize);
        host.clearTimeout(timer);
        if (active) setActive(false);
    };
}
