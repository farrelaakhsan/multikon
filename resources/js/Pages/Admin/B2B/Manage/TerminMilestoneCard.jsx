import { CheckCircle2, Circle } from "lucide-react";
import EmptyState from "../../../../Components/ui/EmptyState";
import { formatPrice } from "../../../../utils/format";

const MILESTONE_STEPS = [
    { key: "dp", label: "DP / pembayaran awal" },
    { key: "progress", label: "Produksi" },
    { key: "final", label: "Pelunasan" },
];

function TerminOrderCard({ order }) {
    const paid = order.paid_bills ?? [];

    const milestones = {
        dp: paid.includes("dp"),
        progress: paid.includes("progress"),
        final: paid.includes("final"),
    };

    return (
        <div className="bg-white rounded-[20px] border-l-4 border-blue-500 px-6 py-5">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-sm font-medium text-blue-600 mb-0.5">
                        {order.order_code}
                    </div>
                    <div className="text-[12.5px] text-slate-800">
                        {order.customer_name}
                    </div>
                    {order.company_name && (
                        <div className="text-[11.5px] text-slate-400">
                            {order.company_name}
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <div className="text-[15px] font-medium text-slate-800 mb-1.5">
                        {formatPrice(order.total_price)}
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                        {order.status_label}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                {MILESTONE_STEPS.map((step) => {
                    const done = milestones[step.key];
                    return (
                        <div
                            key={step.key}
                            className={
                                done
                                    ? "flex-1 flex items-center gap-1.5 bg-emerald-50 rounded-[10px] px-3 py-2.5"
                                    : "flex-1 flex items-center gap-1.5 bg-slate-50 rounded-[10px] px-3 py-2.5"
                            }
                        >
                            {done ? (
                                <CheckCircle2
                                    size={14}
                                    className="text-emerald-500"
                                />
                            ) : (
                                <Circle
                                    size={14}
                                    className="text-slate-300"
                                />
                            )}
                            <span
                                className={
                                    done
                                        ? "text-[11.5px] font-medium text-emerald-700"
                                        : "text-[11.5px] text-slate-400"
                                }
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function TerminMilestoneCard({ terminOrders }) {
    return (
        <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                Milestone Termin (Custom)
            </h2>
            {terminOrders.length === 0 ? (
                <EmptyState
                    icon={CheckCircle2}
                    color="blue"
                    message="Tidak ada pesanan termin berjalan"
                />
            ) : (
                <div className="flex flex-col gap-3.5">
                    {terminOrders.map((order) => (
                        <TerminOrderCard
                            key={order.id}
                            order={order}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
