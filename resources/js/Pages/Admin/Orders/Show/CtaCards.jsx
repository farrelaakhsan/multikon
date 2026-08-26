import { Truck, Package, CheckCircle2 } from "lucide-react";

const SHIPPING_CTA_CONFIG = {
    pickup: {
        icon: Package,
        title: 'Pesanan siap diambil pelanggan?',
        subtitle: 'Metode pengiriman: Pickup di workshop',
        buttonLabel: 'Tandai Siap Diambil',
    },
    cargo: {
        icon: Truck,
        title: 'Pesanan siap dikirim ke kurir?',
        subtitle: 'Metode pengiriman: Cargo',
        buttonLabel: 'Tandai Siap Dikirim',
    },
};

export function ReadyStatusCTACard({ shippingMethod, onConfirm }) {
    const config = SHIPPING_CTA_CONFIG[shippingMethod];
    if (!config) return null;
    const Icon = config.icon;

    return (
        <div className="bg-white rounded-[20px] border border-slate-200 border-l-4 border-l-blue-400 px-6 py-5 mb-5 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-blue-600" />
                </div>
                <div>
                    <div className="text-slate-800 text-sm font-semibold">{config.title}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{config.subtitle}</div>
                </div>
            </div>
            <button
                type="button"
                onClick={onConfirm}
                className="bg-slate-800 text-white text-[13px] font-semibold px-5 py-2.5 rounded-[10px] whitespace-nowrap hover:bg-slate-700 transition shrink-0"
            >
                {config.buttonLabel}
            </button>
        </div>
    );
}

export function CompleteOverrideCTACard({ onConfirm }) {
    return (
        <div className="bg-white rounded-[20px] border border-slate-200 border-l-4 border-l-emerald-400 px-6 py-5 mb-5 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                </div>
                <div>
                    <div className="text-slate-800 text-sm font-semibold">Pesanan sudah dikirim</div>
                    <div className="text-slate-400 text-xs mt-0.5">Selesaikan pesanan ini jika sudah diterima pelanggan</div>
                </div>
            </div>
            <button
                type="button"
                onClick={onConfirm}
                className="bg-emerald-600 text-white text-[13px] font-semibold px-5 py-2.5 rounded-[10px] whitespace-nowrap hover:bg-emerald-700 transition shrink-0"
            >
                Selesaikan Sekarang
            </button>
        </div>
    );
}
