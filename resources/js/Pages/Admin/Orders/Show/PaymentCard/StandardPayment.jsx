import { Receipt, Image } from "lucide-react";
import { Card, CardHeader } from "../Card";

export default function StandardPayment({ order, onConfirm, onReject, onPreviewProof, accentColor }) {
    const hasProof = !!order.payment_proof;
    const isPaid = order.payment_status === 'paid';

    if (!hasProof && !isPaid) {
        return (
            <Card accentColor={accentColor} className="mb-5">
                <CardHeader icon={Receipt} title="Pembayaran" />
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-6 text-center text-sm text-slate-400">
                    Belum ada pembayaran
                </div>
            </Card>
        );
    }

    const isConfirmed = isPaid;

    return (
        <Card accentColor={accentColor} className="mb-5">
            <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${isConfirmed ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                        <Receipt size={16} className={isConfirmed ? 'text-emerald-700' : 'text-amber-700'} />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">Pembayaran</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isConfirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {isConfirmed ? 'Terkonfirmasi' : 'Menunggu Verifikasi'}
                </span>
            </div>

            <div className="text-xs text-slate-400 font-medium mb-2.5">{order.payment_label}</div>

            <div className="flex gap-7 mb-3.5">
                {order.sender_bank_name && (
                    <div>
                        <div className="text-[11px] text-slate-400 mb-0.5">Bank Pengirim</div>
                        <div className="text-[13px] text-slate-800 font-semibold">{order.sender_bank_name}</div>
                    </div>
                )}
                {order.transfer_date && (
                    <div>
                        <div className="text-[11px] text-slate-400 mb-0.5">Tanggal Transfer</div>
                        <div className="text-[13px] text-slate-800 font-semibold">{order.transfer_date}</div>
                    </div>
                )}
            </div>

            {order.payment_proof && (
                <button
                    type="button"
                    onClick={() => onPreviewProof(order.payment_proof, 'Bukti Transfer')}
                    className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 w-fit"
                >
                    <div className="w-[38px] h-[38px] rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <Image size={17} className="text-slate-400" />
                    </div>
                    <span className="text-xs text-slate-600 font-medium">Lihat bukti transfer</span>
                </button>
            )}

            {!isConfirmed && hasProof && (
                <div className="flex gap-2 mt-4">
                    <button onClick={onConfirm} className="bg-slate-800 text-white text-[13px] font-semibold rounded-lg px-4 py-2">
                        Konfirmasi
                    </button>
                    <button onClick={onReject} className="text-[13px] font-medium text-slate-500 px-3 py-2">
                        Tolak
                    </button>
                </div>
            )}
        </Card>
    );
}
