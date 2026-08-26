import { Building2, BadgeCheck, Clock, Pencil } from "lucide-react";
import { formatPrice } from "../../../../utils/format";

export default function CompanyTableCard({ companies, onEdit, onToggleTop }) {
    return (
        <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                Perusahaan Terverifikasi
            </h2>
            <div className="flex flex-col gap-3.5">
                {companies.length === 0 ? (
                    <div className="bg-white rounded-[20px] border-l-4 border-emerald-500 py-12 px-6 text-center">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2.5">
                            <Building2 size={20} className="text-emerald-500" />
                        </div>
                        <div className="text-[13px] text-slate-400">
                            Belum ada perusahaan B2B terverifikasi
                        </div>
                    </div>
                ) : (
                    companies.map((c) => {
                        const creditUsedPercent =
                            c.credit_limit > 0
                                ? Math.round(
                                      ((c.credit_limit - c.remaining_credit) /
                                          c.credit_limit) *
                                          100
                                  )
                                : 0;

                        return (
                            <div
                                key={c.id}
                                className="bg-white rounded-[20px] border-l-4 border-emerald-500 overflow-hidden"
                            >
                                {/* Header row */}
                                <div className="px-6 pt-5 pb-4 flex items-start justify-between">
                                    <div className="flex gap-3.5 items-center">
                                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                                            <Building2
                                                size={22}
                                                className="text-emerald-600"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-medium text-slate-800">
                                                    {c.company_name || c.name}
                                                </span>
                                                <span className="bg-emerald-50 text-emerald-700 text-[10.5px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <BadgeCheck size={11} />
                                                    Verified
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                {c.name} &middot; NPWP{" "}
                                                {c.company_npwp || "-"} &middot;
                                                sejak {c.b2b_approved_at || "-"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(c)}
                                            className="bg-slate-800 text-white rounded-[9px] px-4 py-2 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-700 transition"
                                        >
                                            <Pencil size={13} />
                                            Kredit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onToggleTop(c)}
                                            className={`rounded-[9px] px-4 py-2 text-xs font-medium transition ${
                                                c.top_disabled
                                                    ? "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                                                    : "bg-white text-red-500 border border-red-200 hover:bg-red-50"
                                            }`}
                                        >
                                            {c.top_disabled
                                                ? "Aktifkan ToP"
                                                : "Bekukan ToP"}
                                        </button>
                                    </div>
                                </div>

                                {/* Stat strip */}
                                <div className="mx-6 mb-5 bg-slate-50 rounded-2xl px-5 py-4 grid grid-cols-[1.3fr_1fr_1fr] gap-5">
                                    <div>
                                        <div className="text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">
                                            Limit kredit
                                        </div>
                                        <div className="text-[17px] font-medium text-slate-800 mb-1.5">
                                            {formatPrice(c.credit_limit)}
                                        </div>
                                        <div className="w-full h-[5px] bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{
                                                    width: `${creditUsedPercent}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="text-[11px] text-emerald-600 mt-1">
                                            Sisa{" "}
                                            {formatPrice(c.remaining_credit)}
                                        </div>
                                    </div>

                                    <div className="border-l border-slate-200 pl-5">
                                        <div className="text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">
                                            Tempo ToP
                                        </div>
                                        <div className="text-sm font-medium text-slate-800 mb-1.5 flex items-center gap-1">
                                            <Clock
                                                size={13}
                                                className="text-slate-400"
                                            />
                                            Net {c.top_tenure_days} hari
                                        </div>
                                        <span
                                            className={
                                                c.top_disabled
                                                    ? "bg-slate-100 text-slate-500 text-[10.5px] font-medium px-2.5 py-1 rounded-full"
                                                    : "bg-emerald-50 text-emerald-700 text-[10.5px] font-medium px-2.5 py-1 rounded-full"
                                            }
                                        >
                                            {c.top_disabled
                                                ? "Nonaktif"
                                                : "Aktif"}
                                        </span>
                                    </div>

                                    <div className="border-l border-slate-200 pl-5">
                                        <div className="text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">
                                            Status verifikasi
                                        </div>
                                        <div className="text-sm font-medium text-slate-800 mb-1.5">
                                            Terverifikasi
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                            {c.b2b_approved_at || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
