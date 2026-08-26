import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Clock, Copy, Download, AlarmClock } from "lucide-react";
import ImageLightboxModal from "../Order/ImageLightboxModal";
import { formatPrice } from "../../utils/format";

function getTimeLeft(deadline) {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
}

function PaymentCountdownInline({ deadline }) {
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(deadline));

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
        return () => clearInterval(timer);
    }, [deadline]);

    if (!timeLeft) {
        return <span className="text-[15px] font-extrabold text-red-600 tabular-nums">Kadaluarsa</span>;
    }

    return (
        <p className="text-[15px] font-extrabold text-amber-700 tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </p>
    );
}

export default function PaymentCard({ order, bankData, qrisImageUrl, onOpenUploadModal, activeBill }) {
    const [qrisZoom, setQrisZoom] = useState(false);
    const isBank = order.payment_method?.startsWith('bank_');
    const isQris = order.payment_method === 'qris';

    const isTerminPayment = Boolean(activeBill);

    const billingLabel = isTerminPayment
        ? `Tagihan ${activeBill.label} (${activeBill.percent}%)`
        : 'Total Belanja';

    const billingAmount = isTerminPayment
        ? activeBill.amount
        : order.total_price;

    const copyRekening = () => {
        if (bankData?.account) {
            navigator.clipboard.writeText(bankData.account.replace(/\s/g, ''));
        }
    };

    return (
        <div className="relative bg-white border border-slate-200 rounded-[20px] overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />

            <div className="px-[30px] pt-[30px] pb-[30px] pl-[34px]">
                <div className="text-center mb-6">
                    <div className="w-[52px] h-[52px] rounded-full border-[2.5px] border-amber-500 flex items-center justify-center mx-auto mb-3.5">
                        <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="text-[18px] font-extrabold text-slate-800 mb-1.5">Menunggu Pembayaran</p>
                    <p className="text-[13px] text-slate-600 leading-relaxed max-w-[380px] mx-auto">
                        Terima kasih, pesanan Anda berhasil dibuat. Selesaikan pembayaran agar segera diproses.
                    </p>
                </div>

                <div className="bg-[#F8F9FA] border border-slate-200 rounded-[14px] px-5 py-[18px] mb-3.5">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Nomor Pesanan</p>
                            <p className="text-[14.5px] font-bold text-slate-800">{order.order_code}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{billingLabel}</p>
                            <p className="text-[20px] font-extrabold text-amber-500">Rp{formatPrice(billingAmount)}</p>
                        </div>
                    </div>
                </div>

                {isBank && bankData && (
                    <div className="border border-slate-200 rounded-[14px] px-5 py-[18px] mb-3.5">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Transfer Bank Manual</p>
                            <span className="text-[12px] font-bold text-slate-800 bg-[#F8F9FA] border border-slate-200 rounded-md px-2 py-0.5">{bankData.bank}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[21px] font-bold text-slate-800 tracking-wide tabular-nums">{bankData.account}</p>
                            <button type="button" onClick={copyRekening} className="text-[12px] font-semibold text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-amber-100 transition">
                                <Copy className="w-[13px] h-[13px]" /> Salin
                            </button>
                        </div>
                        <p className="text-[12.5px] text-slate-600 mt-2">a.n. {bankData.name}</p>
                    </div>
                )}

                {isQris && (
                    <div className="border border-slate-200 rounded-[14px] px-5 py-[18px] mb-3.5 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3">QRIS</p>
                        {qrisImageUrl ? (
                            <img src={qrisImageUrl} alt="QRIS" onClick={() => setQrisZoom(true)} className="w-48 h-48 object-contain rounded-xl border border-slate-100 mx-auto cursor-pointer hover:opacity-80 transition" />
                        ) : (
                            <div className="w-48 h-48 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-sm mx-auto">QRIS tidak tersedia</div>
                        )}
                        <p className="text-[12px] text-slate-500 mt-3">Scan QR Code untuk membayar</p>
                        {qrisImageUrl && (
                            <a href={qrisImageUrl} download className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 hover:text-amber-700 mt-2 transition">
                                <Download className="w-3.5 h-3.5" /> Unduh QRIS
                            </a>
                        )}
                    </div>
                )}

                {order.payment_deadline && order.payment_status === 'pending' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-[18px] py-3 mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlarmClock className="w-4 h-4 text-amber-700" />
                            <p className="text-[12.5px] font-semibold text-amber-700">Sisa waktu pembayaran</p>
                        </div>
                        <PaymentCountdownInline deadline={order.payment_deadline} />
                    </div>
                )}

                <button type="button" onClick={onOpenUploadModal} className="w-full text-[14.5px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl py-[14px] mb-2.5 transition-colors">
                    Kirim Bukti Pembayaran
                </button>
                <Link href={`/order/${order.order_code}/tracking`} className="block w-full text-center text-[13px] font-semibold text-slate-500 hover:text-slate-700 bg-transparent py-1.5 transition-colors">
                    Lihat Detail Pesanan
                </Link>
            </div>

            {qrisZoom && (
                <ImageLightboxModal src={qrisImageUrl} title="QRIS" onClose={() => setQrisZoom(false)} />
            )}
        </div>
    );
}
