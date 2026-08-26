import { Link } from "@inertiajs/react";
import { SelectableCard } from "../ui/SelectableCard";

export default function PaymentMethodSelector({ paymentMethod, onPaymentMethodChange, isB2bVerified, terminScheme, errors }) {
    return (
        <div className="space-y-3">
            <SelectableCard
                selected={paymentMethod === "instant"}
                onClick={() => onPaymentMethodChange("instant")}
                icon="🏦"
                label="Pembayaran Penuh (Lunas)"
                desc="Transfer / QRIS saat harga disepakati"
            />
            {!isB2bVerified ? (
                <SelectableCard
                    selected={false}
                    onClick={() => {}}
                    icon="📋"
                    label="Pembayaran Termin Bertahap"
                    desc="DP 40% - Produksi 40% - Pelunasan 20%"
                    locked={true}
                    lockReason="Metode ini hanya tersedia untuk akun bisnis (B2B) terverifikasi."
                />
            ) : (
                <SelectableCard
                    selected={paymentMethod === "termin"}
                    onClick={() => onPaymentMethodChange("termin")}
                    icon="📋"
                    label="Pembayaran Termin Bertahap"
                    desc="DP 40% - Produksi 40% - Pelunasan 20%"
                />
            )}

            {paymentMethod === "termin" && terminScheme.length > 0 && (
                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                    {terminScheme.map((phase) => (
                        <div key={phase.key} className="flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-600">{phase.label}</span>
                            <span className="text-xs font-black text-[#F59E0B]">{phase.percent}%</span>
                        </div>
                    ))}
                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        Tagihan awal DP {terminScheme.find((p) => p.key === "dp")?.percent || 40}% wajib dibayar saat harga disepakati admin.
                    </p>
                </div>
            )}

            {errors.payment_method && (
                <p className="text-xs text-red-500 mt-2">{errors.payment_method}</p>
            )}
        </div>
    );
}
