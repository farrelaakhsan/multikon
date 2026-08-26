import { Check, Timer } from "lucide-react";
import { formatPrice } from "../../utils/format";

export default function TerminBillsCard({ terminBills, paidBills }) {
    if (!terminBills || terminBills.length === 0) return null;

    return (
        <div className="relative bg-white border border-slate-200 rounded-[20px] overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <div className="px-7 py-[26px] pl-8">
                <p className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Timer className="w-[18px] h-[18px] text-slate-400" />
                    Skema Pembayaran Termin
                </p>

                <div className="flex flex-col gap-2.5">
                    {terminBills.map((bill) => {
                        const isPaid = (paidBills || []).includes(bill.key);
                        const isActive = !isPaid && bill.key === terminBills.find((b) => !(paidBills || []).includes(b.key))?.key;

                        return (
                            <div
                                key={bill.key}
                                className={`flex justify-between items-center px-4 py-3.5 rounded-[14px] ${
                                    isPaid
                                        ? 'bg-emerald-50 border border-emerald-200'
                                        : isActive
                                        ? 'bg-amber-50 border-[1.5px] border-amber-500'
                                        : 'bg-[#F8F9FA] border border-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                        isPaid ? 'bg-emerald-500' : isActive ? 'bg-amber-500' : 'bg-slate-100 border-[1.5px] border-slate-200'
                                    }`}>
                                        {isPaid && <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />}
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div>
                                        <p className={`text-[13.5px] font-bold ${isPaid ? 'text-emerald-700' : isActive ? 'text-amber-700' : 'text-slate-400'}`}>{bill.label}</p>
                                        <p className={`text-[11px] mt-0.5 ${isPaid ? 'text-emerald-600' : isActive ? 'text-amber-700' : 'text-slate-400'}`}>{bill.percent}%</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[14px] font-extrabold ${isPaid ? 'text-emerald-700' : isActive ? 'text-amber-700' : 'text-slate-400'}`}>Rp{formatPrice(bill.amount)}</p>
                                    <p className={`text-[10.5px] font-semibold mt-0.5 ${isPaid ? 'text-emerald-600' : isActive ? 'text-amber-700' : 'text-slate-400'}`}>
                                        {isPaid ? '✓ Lunas' : isActive ? 'Tagihan Aktif' : 'Menunggu'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
