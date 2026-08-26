import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Clock, Download } from 'lucide-react';
import { formatPrice } from '../../../../utils/format';

function getTimeLeft(deadline) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, totalMs: diff };
}

export default function QrisPaymentCard({
  orderId,
  orderCode,
  totalFormatted,
  paymentDeadline,
  ctaHref,
}) {
  const { props } = usePage();
  const paymentSettings = props.paymentSettings || {};
  const qrisImageUrl = paymentSettings.qris_image_url;
  const [timeLeft, setTimeLeft] = useState(() => (paymentDeadline ? getTimeLeft(paymentDeadline) : null));

  useEffect(() => {
    if (!paymentDeadline) return;
    const timer = setInterval(() => setTimeLeft(getTimeLeft(paymentDeadline)), 1000);
    return () => clearInterval(timer);
  }, [paymentDeadline]);

  const isExpired = paymentDeadline && !timeLeft;
  const isUrgent = timeLeft && timeLeft.totalMs < 1 * 60 * 60 * 1000;
  const isWarning = timeLeft && timeLeft.totalMs < 12 * 60 * 60 * 1000;

  const handleResetMethod = () => {
    router.patch(`/orders/${orderId}/payment-method`, { payment_method: 'pending' }, { preserveScroll: true });
  };

  const countdownBg = isExpired || isUrgent
    ? 'bg-red-50 border-red-200'
    : 'bg-amber-50 border-amber-200';

  const countdownText = isExpired || isUrgent ? 'text-red-700' : 'text-amber-700';
  const countdownIcon = isExpired || isUrgent ? 'text-red-500' : 'text-amber-700';

  const digitBg = isExpired || isUrgent
    ? 'bg-red-100 text-red-700'
    : 'bg-amber-100 text-amber-700';

  return (
    <div className="relative bg-white border border-slate-200 rounded-[20px] shadow-[0_1px_3px_rgba(30,41,59,0.06),0_4px_12px_rgba(30,41,59,0.04)] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />

      <div className="pt-7 pb-5 pl-9 pr-8 max-md:pt-5 max-md:pb-4 max-md:pl-6 max-md:pr-5 flex items-center gap-3">
        <div className="w-[38px] h-[38px] rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0">
          <Clock className="w-[19px] h-[19px] text-amber-500" />
        </div>
        <div>
          <p className="text-[17px] font-bold text-slate-800">Menunggu Pembayaran</p>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Scan QRIS di bawah untuk menyelesaikan pembayaran
          </p>
        </div>
      </div>

      <div className="mx-8 ml-9 max-md:mx-5 max-md:ml-6 border-t border-dashed border-slate-200" />

      <div className="pt-6 pb-6 pl-9 pr-8 max-md:pt-5 max-md:pb-5 max-md:pl-6 max-md:pr-5 flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
        <div>
          <p className="text-[12px] text-slate-400 mb-1">Nomor Pesanan</p>
          <p className="text-[16px] font-bold text-slate-800 mb-5">{orderCode}</p>

          <p className="text-[12px] text-slate-400 mb-1">Jenis Pembayaran</p>
          <p className="text-[14px] font-semibold text-slate-800 mb-3.5">QRIS</p>

          <p className="text-[12px] text-slate-400 mb-1">Total Tagihan</p>
          <p className="text-[24px] font-extrabold text-amber-500">
            Rp{totalFormatted}
          </p>
        </div>

        <div className="bg-[#F8F9FA] border border-slate-200 rounded-2xl p-5 md:min-w-[250px] flex flex-col items-center">
          {qrisImageUrl ? (
            <>
              <img
                src={qrisImageUrl}
                alt="QRIS pembayaran"
                className="w-[180px] h-[180px] object-contain bg-white border border-slate-200 rounded-lg"
              />
              <a
                href={qrisImageUrl}
                download
                className="mt-3 text-blue-600 text-[12.5px] font-medium flex items-center gap-1 hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> Unduh QRIS
              </a>
            </>
          ) : (
            <div className="w-[180px] h-[180px] rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-[12px]">
              QRIS tidak tersedia
            </div>
          )}
        </div>
      </div>

      {paymentDeadline && (
        <div className={`mx-8 ml-9 mb-5 max-md:mx-5 max-md:ml-6 border rounded-xl px-4 py-3 flex items-center gap-2.5 ${countdownBg}`}>
          <Clock className={`w-[17px] h-[17px] shrink-0 ${countdownIcon} ${isUrgent ? 'animate-pulse' : ''}`} />
          {isExpired ? (
            <p className={`text-[13px] font-medium ${countdownText}`}>
              Telah Kadaluarsa — Pesanan akan dibatalkan otomatis.
            </p>
          ) : (
            <p className={`text-[13px] font-medium ${countdownText}`}>
              Sisa waktu pembayaran{' '}
              <span className="inline-flex items-center gap-1 font-bold tabular-nums">
                <span className={`inline-flex items-center justify-center min-w-[1.75rem] px-1 py-0.5 rounded-md text-[13px] font-bold tabular-nums ${digitBg}`}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className={countdownText}>:</span>
                <span className={`inline-flex items-center justify-center min-w-[1.75rem] px-1 py-0.5 rounded-md text-[13px] font-bold tabular-nums ${digitBg}`}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className={countdownText}>:</span>
                <span className={`inline-flex items-center justify-center min-w-[1.75rem] px-1 py-0.5 rounded-md text-[13px] font-bold tabular-nums ${digitBg}`}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </span>
            </p>
          )}
        </div>
      )}

      <div className="pb-7 pl-9 pr-8 max-md:pb-5 max-md:pl-6 max-md:pr-5 flex flex-col gap-2">
        <Link
          href={ctaHref}
          className="block w-full text-center text-[14.5px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl py-4 transition-colors"
        >
          Kirim Bukti Pembayaran
        </Link>
        <button
          type="button"
          onClick={handleResetMethod}
          className="text-[12.5px] text-slate-400 hover:text-slate-600 underline transition-colors cursor-pointer"
        >
          Ubah metode pembayaran
        </button>
      </div>
    </div>
  );
}
