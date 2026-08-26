import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, footer, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-card overflow-hidden max-w-md w-full shadow-card-hover" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 bg-surface-alt flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
