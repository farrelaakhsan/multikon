import { CheckCircle2, Clock, Receipt, Image, Eye } from "lucide-react";
import { router } from "@inertiajs/react";
import { Card } from "../Card";
import { formatPrice, formatDate } from "../../../../../utils/format";

export default function TerminPayment({ order, accentColor }) {
    const termin = order.termin;
    if (!termin) return null;

    const { stages, overallStatus } = termin;
    const isLunas = overallStatus === 'lunas';
    const lunasStages = stages.filter((s) => s.status === 'lunas');
    const activeStage = stages.find((s) => s.status !== 'lunas');
    const activeIndex = activeStage ? stages.indexOf(activeStage) : -1;

    return (
        <Card accentColor={accentColor} className="mb-5">
            <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-indigo-50">
                        <Receipt size={16} className="text-indigo-700" />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">Tagihan Termin</div>
                </div>
                {!isLunas && (
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                        Tahap {activeIndex + 1} dari {stages.length}
                    </span>
                )}
            </div>

            {/* Riwayat termin lunas - baris ringkas */}
            {lunasStages.map((stage) => (
                <TerminRowLunas key={stage.key} stage={stage} />
            ))}

            {/* Termin aktif - 2 state */}
            {activeStage && activeStage.status === 'belum_bayar' && (
                <TerminCardAdminBelumBayar stage={activeStage} />
            )}
            {activeStage && activeStage.status === 'menunggu_verifikasi' && (
                <TerminCardAdminMenungguVerifikasi
                    stage={activeStage}
                    onVerify={() => router.post(`/admin/orders/${order.id}/confirm-payment`)}
                />
            )}

            {/* Semua lunas */}
            {isLunas && (
                <div className="border-t border-slate-200 pt-4 mt-3">
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <p className="text-[13px] font-semibold text-emerald-700">Semua tagihan sudah lunas</p>
                    </div>
                </div>
            )}
        </Card>
    );
}

function TerminRowLunas({ stage }) {
    return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 flex justify-between items-center mb-2 last:mb-0">
            <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <p className="text-[13px] font-medium text-emerald-800">
                    {stage.label} — {stage.percentage}% — Rp{formatPrice(stage.amount)}
                </p>
            </div>
            {stage.proof_url && (
                <a
                    href={stage.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11.5px] font-medium text-blue-600 hover:underline whitespace-nowrap ml-2"
                >
                    <Eye size={12} />
                    Lihat bukti
                </a>
            )}
        </div>
    );
}

function TerminCardAdminBelumBayar({ stage }) {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mt-2.5">
            <p className="text-[13.5px] font-semibold text-slate-900 mb-0.5">
                {stage.label} — {stage.percentage}%
            </p>
            <p className="text-[12px] text-amber-700 mb-3">
                Belum ada bukti transfer dikirim pelanggan
            </p>
            <button
                disabled
                className="w-full bg-gray-200 text-gray-400 text-[13px] font-medium py-2.5 rounded-[10px] cursor-not-allowed"
            >
                Verifikasi Pembayaran
            </button>
        </div>
    );
}

function TerminCardAdminMenungguVerifikasi({ stage, onVerify }) {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 mt-2.5">
            <div className="mb-2.5">
                <p className="text-[13.5px] font-semibold text-slate-900">
                    {stage.label} — {stage.percentage}%
                </p>
                <p className="text-[12px] text-slate-500 mt-0.5">
                    Rp{formatPrice(stage.amount)} — Bukti dikirim {formatDate(stage.submitted_at)}
                </p>
                {stage.metode && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                        Metode: {stage.metode === 'transfer_bank' ? 'Transfer Bank' : 'QRIS'}
                        {stage.sender_name && ` — ${stage.sender_name}`}
                    </p>
                )}
                {stage.proof_url && (
                    <a
                        href={stage.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:underline mt-1.5"
                    >
                        <Eye size={12} />
                        Lihat bukti transfer
                    </a>
                )}
            </div>
            <button
                type="button"
                onClick={onVerify}
                className="w-full bg-blue-600 text-white text-[13px] font-semibold py-2.5 rounded-[10px] hover:bg-blue-700 transition"
            >
                Verifikasi Pembayaran
            </button>
        </div>
    );
}
