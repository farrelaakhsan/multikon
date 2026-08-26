import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
  if (!links || links.length <= 3) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5 flex-wrap mt-6">
      {links.map((link, idx) => {
        const label = link.label.replace('&laquo;', '←').replace('&raquo;', '→');
        if (!link.url) {
          return (
            <span key={idx} className="px-3.5 py-2 text-sm rounded-pill text-slate-300 cursor-not-allowed" dangerouslySetInnerHTML={{ __html: label }} />
          );
        }
        return (
          <Link
            key={idx}
            href={link.url}
            preserveScroll
            className={`px-3.5 py-2 text-sm rounded-pill font-medium transition ${
              link.active ? 'bg-brand-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        );
      })}
    </nav>
  );
}
