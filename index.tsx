import definePlugin from "@utils/types";

export default definePlugin({
    name: "hardwareMonitor",
    description: "Shows RAM usage near the Discord account panel",
    authors: [{ name: "DemonBo0x", id: 0n }],

    interval: null as ReturnType<typeof setInterval> | null,
    element: null as HTMLDivElement | null,

    start() {
        const el = document.createElement("div");
        el.id = "vc-hw-monitor";
        Object.assign(el.style, {
            position: "fixed",
            bottom: "8px",
            left: "72px",
            zIndex: "999",
            padding: "2px 8px",
            borderRadius: "4px",
            background: "var(--background-floating, #18191c)",
            color: "var(--text-normal, #dcddde)",
            fontSize: "11px",
            fontFamily: "monospace",
            fontWeight: "bold",
            pointerEvents: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.4)"
        });
        document.body.appendChild(el);
        this.element = el;

        const update = () => {
            try {
                const perf = (window.performance as any).memory;
                el.textContent = perf
                    ? `🖥️ RAM: ${(perf.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB`
                    : "🖥️ RAM: N/A";
            } catch {
                el.textContent = "🖥️ RAM: N/A";
            }
        };

        update();
        this.interval = setInterval(update, 2000);
    },

    stop() {
        if (this.interval) clearInterval(this.interval);
        this.element?.remove();
    }
});
