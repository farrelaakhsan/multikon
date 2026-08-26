const VARIANTS = {
  info: { bg: 'bg-blue-50', border: 'border-blue-500', title: 'text-blue-900', desc: 'text-blue-700' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-500', title: 'text-amber-900', desc: 'text-amber-700' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-500', title: 'text-emerald-900', desc: 'text-emerald-700' },
  purple: { bg: 'bg-violet-50', border: 'border-violet-500', title: 'text-violet-900', desc: 'text-violet-700' },
  danger: { bg: 'bg-red-50', border: 'border-red-500', title: 'text-red-900', desc: 'text-red-700' },
};

export default function Banner({ variant = 'info', icon: Icon, title, description, action }) {
  const v = VARIANTS[variant];
  return (
    <div className={`rounded-card border-l-4 ${v.border} ${v.bg} p-4 flex items-start gap-3`}>
      {Icon && <div className="shrink-0 mt-0.5"><Icon className={`w-5 h-5 ${v.title}`} /></div>}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${v.title}`}>{title}</p>
        {description && <p className={`text-xs mt-0.5 ${v.desc}`}>{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
