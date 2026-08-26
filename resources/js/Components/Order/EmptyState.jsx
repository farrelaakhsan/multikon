export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  );
}
