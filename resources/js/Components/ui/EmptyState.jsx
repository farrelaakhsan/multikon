export default function EmptyState({ icon: Icon, color = "slate", message, className = "" }) {
    const colorMap = {
        amber: { bg: "bg-amber-50", text: "text-amber-500", border: "border-amber-500" },
        blue: { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-500" },
        emerald: { bg: "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-500" },
        red: { bg: "bg-red-50", text: "text-red-500", border: "border-red-500" },
        slate: { bg: "bg-slate-50", text: "text-slate-400", border: "border-slate-300" },
    };

    const c = colorMap[color] ?? colorMap.slate;

    return (
        <div className={`bg-white rounded-[20px] border-l-4 ${c.border} py-9 px-6 text-center ${className}`}>
            <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mx-auto mb-2.5`}>
                <Icon size={20} className={c.text} />
            </div>
            <div className="text-[13px] text-slate-400">
                {message}
            </div>
        </div>
    );
}
