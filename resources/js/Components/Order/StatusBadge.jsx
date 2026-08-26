import { Check, Clock, Loader2, Truck, XCircle, HelpCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending_payment: { label: 'Menunggu Pembayaran', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', icon: Clock, pulse: true },
  waiting_payment: { label: 'Menunggu Pembayaran', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', icon: Clock, pulse: true },
  waiting_review: { label: 'Menunggu Peninjauan', bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500', icon: HelpCircle, pulse: true },
  waiting_confirmation: { label: 'Verifikasi Pembayaran', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', icon: Loader2, pulse: true },
  processing: { label: 'Diproses', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', icon: Loader2, pulse: false },
  in_production: { label: 'Produksi', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', icon: Loader2, pulse: false },
  shipped: { label: 'Dikirim', bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', icon: Truck, pulse: false },
  completed: { label: 'Selesai', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: Check, pulse: false },
  done: { label: 'Selesai', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: Check, pulse: false },
  rejected: { label: 'Ditolak', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', icon: XCircle, pulse: false },
  cancelled: { label: 'Dibatalkan', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', icon: XCircle, pulse: false },
};

export default function StatusBadge({ status, labelOverride, size = 'md', withDot = true }) {
  const config = STATUS_CONFIG[status] || {
    label: status, bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', icon: HelpCircle, pulse: false,
  };
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-3 py-1 gap-1.5';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${config.bg} ${config.text}`}>
      {withDot && <span className={`${dotSize} rounded-full ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`} />}
      {labelOverride || config.label}
    </span>
  );
}
