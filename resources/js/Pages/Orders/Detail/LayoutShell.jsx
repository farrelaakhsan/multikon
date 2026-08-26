import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PublicLayout from '../../../Layouts/PublicLayout';

export default function LayoutShell({ orderCode, children }) {
  return (
    <PublicLayout>
      <Head title={`Rincian Pesanan - ${orderCode}`} />
      <div className="max-w-content mx-auto px-6 py-6 md:py-8">
        <div className="mb-5">
          <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Rincian Pesanan</h1>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </PublicLayout>
  );
}
