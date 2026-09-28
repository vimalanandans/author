// Streaming providers can deliver many tiny chunks in one event-loop turn.
// Rendering every chunk re-parses the whole growing Markdown response and can
// leave the UI behind the network. Coalesce foreground paints, but never wait
// for rAF/timers in an unfocused or hidden window because browsers throttle them.
export function createStreamUpdateBatcher(commit, { intervalMs = 24, isBackground } = {}) {
    let pending = null;
    let timer = null;
    const background = isBackground || (() => (
        typeof document !== 'undefined' && (document.hidden || !document.hasFocus())
    ));

    const flush = () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
        if (!pending) return;
        const update = pending;
        pending = null;
        commit(...update);
    };

    return {
        push(...update) {
            pending = update;
            if (background()) {
                flush();
            } else if (timer === null) {
                timer = setTimeout(flush, intervalMs);
            }
        },
        flush,
        cancel() {
            pending = null;
            if (timer !== null) clearTimeout(timer);
            timer = null;
        },
    };
}
