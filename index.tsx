// هذا الكود لا يحتاج إلى أي Imports خارجية ويتعامل مع ديسكورد مباشرة
const { definePlugin } = Vencord.Plugins;
const { React } = Vencord.Webpack.Common;
const { after } = Vencord.Patcher;
const { findByName } = Vencord.Webpack;

function HardwareWidget() {
    const [memory, setMemory] = React.useState("0 MB");

    React.useEffect(() => {
        const updateMem = () => {
            try {
                // الوصول المباشر لذاكرة الجهاز
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
    description: "مراقب أداء الجهاز (استهلاك الرامات)",
    authors: [{ name: "DemonBo0x", id: "000000000000" }],
    
    start() {
        const Account = findByName("Account");
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
