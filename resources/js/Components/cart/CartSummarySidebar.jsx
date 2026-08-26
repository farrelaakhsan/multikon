import { Link } from "@inertiajs/react";
import { formatPrice } from "../../utils/format";

export default function CartSummarySidebar({ selectedIds, selectedTotal, items }) {
    return (
        <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-[#1E293B]/10 shadow-sm overflow-hidden sticky top-24">
                <div className="px-6 py-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#1E293B] flex items-center justify-center">
                            <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                                <path d="M10 3.75a2 2 0 012 2 .75.75 0 001.5 0 3.5 3.5 0 00-7 0 .75.75 0 001.5 0 2 2 0 012-2zM6.75 8.75a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5a.75.75 0 00-1.5 0v2.5h-2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-sm font-black italic uppercase tracking-tight text-[#1E293B]">
                            Ringkasan
                        </h2>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div className="border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Belanja</span>
                            <span className="text-2xl font-black text-[#1E293B] tabular-nums">Rp {formatPrice(selectedTotal)}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 text-right">Belum termasuk ongkos kirim</p>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <Link
                        href={selectedIds.length > 0 ? `/cart/checkout?items=${selectedIds.join(",")}` : "#"}
                        className={`w-full flex items-center justify-center py-4 rounded-xl font-black uppercase tracking-wider text-sm shadow-lg transition ${
                            selectedIds.length > 0
                                ? "bg-[#F59E0B] text-[#1E293B] shadow-[#F59E0B]/30 hover:brightness-105"
                                : "bg-slate-100 text-slate-400 shadow-none pointer-events-none"
                        }`}
                    >
                        {selectedIds.length > 0 ? `Checkout (${selectedIds.length})` : "Pilih Produk"}
                    </Link>
                    <p className="text-[9px] text-slate-400 text-center mt-3">
                        {selectedIds.length > 0
                            ? `${selectedIds.length} produk akan diproses bersamaan`
                            : "Centang produk yang ingin di-checkout"}
                    </p>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F59E0B] transition"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M7.712 4.819A1.5 1.5 0 0110 6.095v2.973c.104-.131.234-.248.389-.344l6.323-3.905A1.5 1.5 0 0119 6.095V12.97a1.5 1.5 0 01-2.288 1.277l-6.323-3.905a1.505 1.505 0 01-.389-.344v2.973a1.5 1.5 0 01-2.288 1.276l-6.323-3.905a1.5 1.5 0 010-2.553L7.712 4.82z" />
                    </svg>
                    Lanjut Belanja
                </Link>
            </div>
        </div>
    );
}
