import { CircleCheck } from 'lucide-react';
import { formatPrice } from '../../../../utils/format';

export default function PaymentSummarySection({ order }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-[22px] py-[18px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-emerald-50 flex items-center justify-center shrink-0">
            <CircleCheck className="w-[17px] h-[17px] text-emerald-500" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-800">Pembayaran</p>
            <p className="text-[11.5px] text-slate-400 mt-0.5">
              {order.payment_label} · Rp{formatPrice(order.total_price)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11.5px] font-bold text-emerald-600">Lunas</p>
          </div>
          {order.payment_proof && (
            <a
              href={order.payment_proof}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-blue-500 bg-blue-50 rounded-lg px-2.5 py-1.5 whitespace-nowrap"
            >
              Lihat Bukti
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
