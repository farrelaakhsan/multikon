export default function HeroCard({ statusSlot, metaText, label, value, banner, action, children }) {
  return (
    <section className="bg-white rounded-card border border-slate-200 shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        {statusSlot}
        {metaText && <span className="font-mono text-xs text-slate-400">{metaText}</span>}
      </div>
      {label && <p className="text-xs text-slate-400 mb-1">{label}</p>}
      {value && <p className="text-3xl font-black text-slate-900">{value}</p>}
      {banner && <div className="mt-4">{banner}</div>}
      {action && <div className="mt-4">{action}</div>}
      {children && <div className={value || label ? 'mt-5 pt-5 border-t-2 border-slate-200' : ''}>{children}</div>}
    </section>
  );
}
