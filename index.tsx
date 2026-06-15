import { definePlugin } from "@utils/types";
import { React } from "@webpack/common";
import { after } from "@lib/patcher";
import { findByProps } from "@webpack";

function HardwareWidget() {
    const [memory, setMemory] = React.useState("0 MB");

    React.useEffect(() => {
        const updateMem = () => {
            try {
                const perfMemory = (window.performance as any).memory;
                if (perfMemory) {
                    const usedMB = (perfMemory.usedJSHeapSize / 1024 / 1024).toFixed(1);
                    setMemory(`RAM: ${usedMB} MB`);
                }
            } catch (e) {
                setMemory("RAM: N/A");
            }
        };
        updateMem();
        const interval = setInterval(updateMem, 2000);
        return () => clearInterval(interval);
    }, []);

    return React.createElement("div", {
        style: {
            display: "flex",
            alignItems: "center",
            padding: "2px 8px",
            margin: "0 8px",
            borderRadius: "4px",
            backgroundColor: "var(--background-modifier-accent)",
            color: "var(--text-normal)",
            fontSize: "12px",
            fontFamily: "monospace",
            fontWeight: "bold",
            cursor: "default"
        }
    }, "🖥️ " + memory);
}

export default definePlugin({
    name: "Hardware Monitor",
    description: "مراقب أداء الجهاز (يعرض استهلاك الرامات المباشر)",
    authors: [{ name: "DemonBo0x", id: "000000000000" }],
    
    start() {
        const Account = findByProps("Account");
        if (Account) {
            after("default", Account, (args, res) => {
                if (res?.props?.children && Array.isArray(res.props.children)) {
                    res.props.children.unshift(React.createElement(HardwareWidget));
                }
            });
        }
    },
    stop() {}
});
