export default function ModalShell({ open, onClose, title, subtitle, width = "w-[400px]", children }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-[20px] p-6 ${width} shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h3 className="text-base font-medium text-slate-800 mb-1">
                        {title}
                    </h3>
                )}
                {subtitle && (
                    <p className="text-sm text-slate-500 mb-5">
                        {subtitle}
                    </p>
                )}
                {children}
            </div>
        </div>
    );
}
