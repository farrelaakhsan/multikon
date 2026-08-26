export default function SectionCard({ title, action, icon: Icon, accentClass, className = '', children }) {
  return (
    <section className={`relative bg-white rounded-card border border-slate-200 shadow-card ${className}`}>
      {accentClass && <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentClass}`} />}
      <div className="p-6">
        {title && (
          <header className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              {Icon && <Icon className="w-4 h-4 text-slate-400" />}
              {title}
            </h3>
            {action}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
