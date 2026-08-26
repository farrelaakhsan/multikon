import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, processing }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-6 z-50" onClick={onCancel}>
            <div className="w-full max-w-[380px] bg-white rounded-[20px] p-7 sm:p-8" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-12 rounded-[10px] bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={22} className="text-red-500" />
                </div>
                <p className="text-[17px] font-medium text-slate-900 text-center mb-2">{title}</p>
                <p className="text-[13px] text-slate-500 text-center mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-2.5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-transparent border border-slate-200 text-slate-600 rounded-full py-2.5 text-[13.5px] font-medium hover:bg-slate-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white rounded-full py-2.5 text-[13.5px] font-medium transition-colors"
                    >
                        {processing ? "Menghapus..." : "Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}
