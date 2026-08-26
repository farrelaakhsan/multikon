import { Link } from "@inertiajs/react";
import { FileText, Inbox } from "lucide-react";
import Timeline from "../../../../Components/Order/Timeline";
import EmptyState from "../../../../Components/ui/EmptyState";
import { formatPrice } from "../../../../utils/format";

const SETTLEMENT_STYLE = {
    none: "bg-slate-100 text-slate-600",
    pending: "bg-amber-100 text-amber-700",
    verified: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
};

export default function TopInvoiceCard({ topOrders }) {
    return (
        <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                Tagihan Tempo (ToP)
            </h2>
            {topOrders.length === 0 ? (
                <EmptyState
                    icon={Inbox}
                    color="amber"
                    message="Tidak ada pesanan ToP berjalan"
                />
            ) : (
                <div className="flex flex-col gap-3">
                    {topOrders.map((o) => (
                        <div
                            key={o.id}
                            className={`bg-white rounded-[20px] border-l-4 px-6 py-5 ${
                                o.overdue
                                    ? "border-red-500"
                                    : "border-blue-500"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs font-semibold text-amber-600">
                                            {o.order_code}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                                            {o.status_label}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                SETTLEMENT_STYLE[
                                                    o.settlement_status
                                                ] ?? SETTLEMENT_STYLE.none
                                            }`}
                                        >
                                            {o.settlement_label}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">
                                        {o.customer_name}
                                        {o.company_name
                                            ? ` · ${o.company_name}`
                                            : ""}
                                    </p>
                                    <p className="text-lg font-black text-slate-900 mt-1">
                                        {formatPrice(o.total_price)}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Jatuh Tempo
                                    </p>
                                    <p
                                        className={`text-sm font-bold mt-1 ${
                                            o.overdue
                                                ? "text-red-600"
                                                : "text-slate-800"
                                        }`}
                                    >
                                        {o.due_at ?? "-"}
                                    </p>
                                    {o.days_left !== null && !o.overdue && (
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {o.days_left} hari lagi
                                        </p>
                                    )}
                                    {o.overdue && (
                                        <p className="text-[10px] font-bold text-red-500 mt-0.5">
                                            Terlambat
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <Timeline
                                    steps={o.progress_steps}
                                    cancelled={false}
                                    variant="admin"
                                />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <Link
                                    href={`/admin/orders/${o.id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-slate-100 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition"
                                >
                                    <FileText className="w-3.5 h-3.5" /> Detail
                                    Pesanan
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
