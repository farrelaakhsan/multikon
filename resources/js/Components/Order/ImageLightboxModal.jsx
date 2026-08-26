import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ImageLightboxModal({ src, title = 'Pratinjau', onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-card overflow-hidden max-w-2xl w-full shadow-card-hover" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-auto bg-surface-alt flex items-center justify-center p-4">
          <img src={src} alt={title} className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      </div>
    </div>
  );
}
