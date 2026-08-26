import { Package, Download, Image, Eye } from "lucide-react";
import { router } from "@inertiajs/react";
import { Card } from "../Card";
import { formatPrice } from "../../../../../utils/format";

export default function TopPayment({ order, accentColor }) {
    const poVerified = order.po_verification_status === 'verified';

    return (
        <Card accentColor={accentColor} className="mb-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[10px] bg-indigo-50 flex items-center justify-center">
                        <Package size={16} className="text-indigo-700" />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">Purchase Order (ToP)</div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${poVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {poVerified ? 'PO Diverifikasi' : 'Menunggu Verifikasi PO'}
                </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="text-slate-400 text-[11.5px] mb-0.5">Skema Pembayaran</div>
                <div className="text-slate-800 text-[13.5px] font-medium">{order.payment_label}</div>
            </div>

            {order.po_document_url && (
                <div className="bg-slate-50 rounded-xl p-4 mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-[38px] h-[38px] rounded-[10px] bg-indigo-50 flex items-center justify-center">
                            <Package size={16} className="text-indigo-700" />
                        </div>
                        <div>
                            <div className="text-slate-800 text-[13.5px] font-medium">Dokumen PO</div>
                            <div className="text-slate-400 text-[11.5px] mt-0.5">Klik untuk melihat atau mengunduh</div>
                        </div>
                    </div>
                    <a
                        href={order.po_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-indigo-600 text-[13px] font-medium bg-indigo-50 px-3.5 py-2 rounded-[10px] whitespace-nowrap hover:bg-indigo-100 transition"
                    >
                        <Download size={14} />
                        Lihat / Unduh
                    </a>
                </div>
            )}

            {order.credit_used != null && (
                <div className="flex items-center justify-between mb-4 px-0.5">
                    <span className="text-slate-500 text-[13px]">Kredit terpakai</span>
                    <span className="text-slate-800 text-sm font-semibold">Rp {formatPrice(order.credit_used)}</span>
                </div>
            )}

            {order.settlement_status && (
                <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-slate-800">Bukti Pelunasan</div>
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                            order.settlement_status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                            {order.settlement_status === 'verified' ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                        </span>
                    </div>

                    {order.settlement_proof && (
                        <div className="bg-slate-50 rounded-xl p-4 mb-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-[38px] h-[38px] rounded-[10px] bg-blue-50 flex items-center justify-center">
                                    <Image size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-slate-800 text-[13.5px] font-medium">Bukti Transfer</div>
                                    <div className="text-slate-400 text-[11.5px] mt-0.5">
                                        {order.sender_bank_name}{order.transfer_date ? ` · ${order.transfer_date}` : ''}
                                    </div>
                                </div>
                            </div>
                            <a
                                href={order.settlement_proof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-blue-600 text-[13px] font-medium bg-blue-50 px-3.5 py-2 rounded-[10px] whitespace-nowrap hover:bg-blue-100 transition"
                            >
                                <Eye size={14} />
                                Lihat
                            </a>
                        </div>
                    )}

                    {order.settlement_due_at && (
                        <div className="flex items-center justify-between mb-3 px-0.5">
                            <span className="text-slate-500 text-[13px]">Batas pelunasan</span>
                            <span className="text-slate-800 text-sm font-semibold">{order.settlement_due_at}</span>
                        </div>
                    )}

                    {order.settlement_status === 'pending' && (
                        <button
                            type="button"
                            onClick={() => router.post(`/admin/orders/${order.id}/confirm-settlement`)}
                            className="w-full bg-emerald-600 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-emerald-700 transition"
                        >
                            Verifikasi Pelunasan
                        </button>
                    )}
                </div>
            )}

            {!poVerified && (
                <button
                    type="button"
                    onClick={() => router.post(`/admin/orders/${order.id}/verify-po`)}
                    className="w-full bg-indigo-600 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition"
                >
                    Verifikasi PO
                </button>
            )}
        </Card>
    );
}
