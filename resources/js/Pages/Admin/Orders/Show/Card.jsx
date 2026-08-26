export function Card({ children, className = '', accentColor = '', padding = 'px-7 py-7' }) {
    return (
        <div className={`bg-white rounded-[20px] border border-slate-200 border-l-4 ${accentColor} ${padding} shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ icon: Icon, title, iconBg = 'bg-slate-100', iconColor = 'text-slate-500' }) {
    return (
        <div className="flex items-center gap-2.5 mb-4">
            <div className={`w-8 h-8 rounded-[10px] ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className={iconColor} />
            </div>
            <div className="text-sm font-semibold text-slate-800">{title}</div>
        </div>
    );
}
