import { FileText, Eye } from 'lucide-react';

const IMAGE_REGEX = /\.(jpg|jpeg|png|webp)(\?|$)/i;

export default function FileThumbnail({ url, label = 'File', onPreview, size = 'w-20 h-20' }) {
  if (!url) return null;
  const isImage = IMAGE_REGEX.test(url);

  if (!isImage) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-card border border-slate-200 bg-surface-alt hover:bg-slate-100 transition text-sm font-medium text-slate-700"
      >
        <FileText className="w-4 h-4 text-slate-500" />
        Lihat File
      </a>
    );
  }

  return (
    <button type="button" onClick={onPreview} className={`relative ${size} rounded-card overflow-hidden border border-slate-200 group cursor-pointer shrink-0`}>
      <img src={url} alt={label} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white text-xs font-medium">
          <Eye className="w-3.5 h-3.5" />
          Lihat
        </span>
      </div>
    </button>
  );
}
