import { FileCheck, FileText } from "lucide-react";

export default function TopStatusCard({ order }) {
    return (
        <div className="relative bg-white border border-slate-200 rounded-[20px] overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <div className="px-7 py-[26px] pl-8">
                <p className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileCheck className="w-[18px] h-[18px] text-slate-400" />
                    Dokumen Purchase Order
                </p>

                {order.po_document ? (
                    <>
                        <div className="flex items-center gap-3.5 px-[18px] py-4 rounded-[14px] bg-amber-50 border border-amber-200 mb-3">
                            <div className="w-[42px] h-[42px] rounded-[11px] bg-white border border-amber-200 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13.5px] font-bold text-amber-700 truncate">{order.po_document}</p>
                                <p className="text-[11.5px] text-amber-700 mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    {order.po_verification_status === 'verified' ? 'PO Diverifikasi' : 'Menunggu Verifikasi Admin'}
                                </p>
                            </div>
                        </div>

                        <p className="text-[12px] text-slate-600 leading-relaxed">
                            {order.po_verification_status === 'verified'
                                ? 'Dokumen PO Anda telah terverifikasi. Pesanan sedang diproses.'
                                : 'Tim kami akan memverifikasi dokumen PO Anda dalam 1x24 jam kerja. Anda akan mendapat notifikasi setelah proses verifikasi selesai.'}
                        </p>
                    </>
                ) : (
                    <p className="text-[13px] text-slate-500">
                        Pembayaran dilakukan dalam tempo setelah invoice diterbitkan. Tidak ada pembayaran di muka.
                    </p>
                )}
            </div>
        </div>
    );
}
