import { useState } from "react";
import { CheckCircle2, CircleX, XCircle, ChevronDown } from "lucide-react";
import { Card } from "./Card";

export default function OrderStatusCard({ statusLabel, steps, cancelled, accentColor }) {
    const [expanded, setExpanded] = useState(false);
    const completedCount = steps.filter((s) => s.state === 'complete').length;
    const allComplete = completedCount === steps.length;
    const progressPct = allComplete ? 100 : Math.round((completedCount / (steps.length - 1)) * 100);
    const currentIdx = steps.findIndex((s) => s.state === 'active');
    const activeIdx = currentIdx >= 0 ? currentIdx : Math.min(completedCount, steps.length - 1);
    const activeStep = steps[activeIdx];

    if (cancelled) {
        return (
            <Card accentColor={accentColor} className="mb-5">
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                    <CircleX size={13} />
                    {statusLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                    {steps.map((step) => (
                        <span key={step.key} className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium px-3 py-1.5 rounded-full">
                            <XCircle size={13} />
                            {step.label}
                        </span>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card accentColor={accentColor} className="mb-5">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                {statusLabel}
            </span>

            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between text-left"
                aria-expanded={expanded}
            >
                <div>
                    <h2 className="text-slate-800 text-[15px] font-semibold">Status Pesanan</h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                        Tahap {activeIdx + 1} dari {steps.length} &middot; {activeStep?.label || '-'}
                    </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
                    <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <div className="bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                        width: `${progressPct}%`,
                        background: allComplete ? '#10B981' : 'linear-gradient(90deg, #10B981, #F59E0B)',
                    }}
                />
            </div>

            {expanded && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                    {steps.map((step, i) => {
                        const isDone = step.state === 'complete';
                        const isActive = step.state === 'active';

                        return (
                            <div key={step.key} className="flex items-start gap-3 py-2.5">
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] flex-shrink-0 mt-px
                                        ${isDone ? 'bg-emerald-500 text-white' : ''}
                                        ${isActive ? 'border-2 border-blue-500 text-blue-500' : ''}
                                        ${!isDone && !isActive ? 'border-2 border-slate-200 text-slate-400' : ''}
                                    `}
                                >
                                    {isDone ? <CheckCircle2 size={12} /> : i + 1}
                                </div>
                                <div>
                                    <div className={`text-[13px] ${!isDone && !isActive ? 'text-slate-400' : 'text-slate-800 font-medium'}`}>
                                        {step.label}
                                    </div>
                                    {isDone && step.ts && (
                                        <div className="text-slate-400 text-[11px] mt-0.5">{step.ts}</div>
                                    )}
                                    {isActive && step.activeLabel && (
                                        <div className="text-blue-600 text-[11px] mt-0.5">{step.activeLabel}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
