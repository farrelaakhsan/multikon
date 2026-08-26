import { Clock, Image, Eye } from "lucide-react";

export default function ProofSentCard({ order, onViewProof, onReupload }) {
    return (
        <div className="relative bg-white border border-slate-200 rounded-[20px] overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
            <div className="px-[30px] py-7 pl-[34px]">
                <div className="text-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-[22px] h-[22px] text-blue-500" />
                    </div>
                    <p className="text-[17px] font-extrabold text-slate-800 mb-1">Bukti Pembayaran Terkirim</p>
                    <p className="text-[12.5px] text-slate-600">
                        Menunggu verifikasi dari tim kami, mohon tunggu 1x24 jam
                    </p>
                </div>

                <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] bg-[#F8F9FA] border border-slate-200 mb-3.5">
                    <div className="w-11 h-11 rounded-[10px] bg-blue-50 flex items-center justify-center shrink-0">
                        <Image className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 truncate">
                            {order.payment_proof?.split('/').pop() || 'Bukti Pembayaran'}
                        </p>
                        {order.sender_bank_name && (
                            <p className="text-[11.5px] text-slate-400 mt-0.5">
                                {order.sender_bank_name}{order.transfer_date ? ` - ${order.transfer_date}` : ''}
                            </p>
                        )}
                    </div>
                    <button onClick={onViewProof}>
                        <Eye className="w-[17px] h-[17px] text-slate-400" />
                    </button>
                </div>

                <button
                    onClick={onReupload}
                    className="w-full text-[13px] font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl py-3 hover:bg-slate-50 transition-colors"
                >
                    Kirim Ulang Bukti Pembayaran
                </button>
            </div>
        </div>
    );
}
