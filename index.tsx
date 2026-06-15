import { definePlugin } from "vencord/plugins";
import { React } from "vencord/webpack/common";
import { after } from "vencord/patcher";
import { findByName } from "vencord/webpack";

// ده الكومبوننت اللي هيترسم في الشاشة (الـ Widget)
function HardwareWidget() {
    const [memory, setMemory] = React.useState("0 MB");

    React.useEffect(() => {
        const updateMem = () => {
            try {
                // ديسكورد مبني على Chromium، فبنقدر نقرأ استهلاك الرام المباشر
                const perfMemory = (window.performance as any).memory;
                if (perfMemory) {
                    const usedMB = (perfMemory.usedJSHeapSize / 1024 / 1024).toFixed(1);
                    setMemory(`RAM: ${usedMB} MB`);
                }
            } catch (e) {
                setMemory("RAM: N/A");
            }
        };

        // تحديث القراءة كل ثانيتين
        updateMem();
        const interval = setInterval(updateMem, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
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
        }}>
            🖥️ {memory}
        </div>
    );
}

export default definePlugin({
    name: "Hardware Monitor",
    description: "مراقب أداء الجهاز (يعرض استهلاك الرامات المباشر)",
    authors: [{ name: "YourName", id: "000000000000" }], // تقدر تحط الـ ID بتاعك هنا
    
    start() {
        // بنبحث عن لوحة حساب المستخدم اللي تحت عشان نحقن الكود فيها
        const Account = findByName("Account");
        if (Account) {
            after("default", Account, (args, res) => {
                // بنحط الـ Widget بتاعنا بأمان تام من غير ما نكسر كود ديسكورد
                if (res?.props?.children && Array.isArray(res.props.children)) {
                    res.props.children.unshift(React.createElement(HardwareWidget));
                }
            });
        }
    },

    stop() {
        // Vencord بيلغي التعديلات أوتوماتيك لما تقفل البلاجن
    }
});
