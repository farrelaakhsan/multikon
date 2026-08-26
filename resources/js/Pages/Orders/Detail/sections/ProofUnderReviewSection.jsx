import { Clock, Image } from 'lucide-react';

export default function ProofUnderReviewCard({ order }) {
  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
      <div className="px-[22px] py-4 pl-[26px]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-[42px] h-[42px] rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[14px] font-extrabold text-slate-800">Bukti Pembayaran Sedang Diverifikasi</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Tim kami akan segera memeriksa bukti pembayaranmu</p>
          </div>
        </div>

        <div className="flex justify-between items-center px-3.5 py-2.5 rounded-[10px] bg-[#F8F9FA] border border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Image className="w-[17px] h-[17px] text-blue-500" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-slate-800">
                {order.payment_proof_filename?.split('/').pop() || 'Bukti Pembayaran'}
              </p>
              {order.sender_bank_name && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {order.sender_bank_name}{order.transfer_date ? ` · ${order.transfer_date}` : ''}
                </p>
              )}
            </div>
          </div>
          {order.payment_proof && (
            <a
              href={order.payment_proof}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10.5px] font-semibold text-blue-500 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
            >
              Lihat
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
