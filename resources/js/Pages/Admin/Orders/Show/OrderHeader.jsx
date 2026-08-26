import { Link } from "@inertiajs/react";
import { ArrowLeft, Copy } from "lucide-react";

export default function OrderHeader({ orderCode, onCopyCode }) {
    return (
        <>
            <Link href="/admin/orders" className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                <ArrowLeft size={15} /> Kembali
            </Link>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-[21px] font-semibold text-slate-800 tracking-tight">Detail Pesanan</h1>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[13px] text-slate-400 tabular-nums">{orderCode}</span>
                        <button onClick={onCopyCode} aria-label="Salin kode pesanan">
                            <Copy size={14} className="text-slate-300" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
