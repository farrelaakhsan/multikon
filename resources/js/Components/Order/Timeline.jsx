import { useState } from 'react';
import { Check, ChevronDown, XCircle, X } from 'lucide-react';

/**
 * Timeline — progress bar ringkas (collapsed) + expandable detail list.
 * Cancelled state pakai tema merah.
 */
export default function Timeline({ steps, cancelled = false }) {
  const [expanded, setExpanded] = useState(false);

  if (cancelled) {
    return <CancelledTimeline steps={steps} />;
  }

  const activeIndex = steps.findIndex((s) => s.state === 'active');
  const completeCount = steps.filter((s) => s.state === 'complete').length;
  const allComplete = completeCount === steps.length;
  const currentStepNumber = activeIndex >= 0 ? activeIndex + 1 : steps.length;
  const progressPercent = allComplete
    ? 100
    : (completeCount / (steps.length - 1)) * 100;
  const activeStep = steps.find((s) => s.state === 'active');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-[15px] font-bold text-slate-800">Status Pesanan</p>
        <p className="text-[12px] text-slate-400">
          Tahap {currentStepNumber} dari {steps.length}
        </p>
      </div>

      <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-3.5">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progressPercent}%`,
            background: allComplete
              ? '#10B981'
              : 'linear-gradient(90deg, #10B981, #F59E0B)',
          }}
        />
      </div>

      {activeStep && (
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <p className="text-[13.5px] font-semibold text-amber-700">{activeStep.label}</p>
        </div>
      )}

      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-[12.5px] font-semibold text-slate-800 bg-[#F8F9FA] border border-slate-200 rounded-[9px] px-4 py-2 flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
        >
          Lihat Semua Tahapan
          <ChevronDown className="w-3 h-3" />
        </button>
      )}

      {expanded && (
        <div>
          <div className="flex flex-col">
            {steps.map((step) => (
              <div
                key={step.key}
                title={step.ts ? `Selesai ${step.ts}` : undefined}
                className={`flex gap-3 items-start py-[9px] ${
                  step.state === 'active' ? 'bg-amber-50 rounded-[10px] -mx-2.5 px-2.5' : ''
                }`}
              >
                <div
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 mt-px ${
                    step.state === 'complete' ? 'bg-emerald-500' :
                    step.state === 'active' ? 'bg-amber-500' :
                    'bg-slate-100 border-[1.5px] border-slate-200'
                  }`}
                >
                  {step.state === 'complete' && (
                    <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
                  )}
                  {step.state === 'active' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <p
                  className={`text-[13px] ${
                    step.state === 'complete' ? 'font-semibold text-slate-800' :
                    step.state === 'active' ? 'font-bold text-amber-700' :
                    'font-medium text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-[12.5px] font-semibold text-slate-500 hover:text-slate-700 bg-transparent border-none px-0 pt-4 flex items-center gap-1.5 transition-colors"
          >
            Sembunyikan
            <ChevronDown className="w-3 h-3 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}

function CancelledTimeline({ steps }) {
  return (
    <div>
      <p className="text-[13px] font-bold text-red-700 mb-4 flex items-center gap-1.5">
        <XCircle className="w-[15px] h-[15px]" />
        Pesanan Dibatalkan
      </p>
      <div className="flex flex-wrap gap-2.5">
        {steps.map((step, index) => (
          <span
            key={step.key}
            className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium px-3.5 py-1.5 rounded-full"
          >
            {index === 0 ? (
              <Check className="w-[13px] h-[13px]" strokeWidth={3} />
            ) : (
              <X className="w-[13px] h-[13px]" strokeWidth={3} />
            )}
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}
