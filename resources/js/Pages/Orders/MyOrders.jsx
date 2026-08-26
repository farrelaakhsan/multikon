import { Head, Link, router } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import OrderCard from '../../Components/Order/OrderCard';
import EmptyState from '../../Components/Order/EmptyState';
import Pagination from '../../Components/Order/Pagination';

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Belum Bayar' },
  { key: 'processed', label: 'Diproses' },
  { key: 'shipped', label: 'Dikirim' },
  { key: 'completed', label: 'Selesai' },
];

export default function MyOrders({ orders, activeFilter = 'all' }) {
  const handleFilter = (key) => {
    router.get('/orders', key === 'all' ? {} : { filter: key }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <PublicLayout>
      <Head title="Pesanan Saya" />

      <div className="max-w-content mx-auto px-6 py-6 md:py-8">
        <nav className="text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span className="mx-1.5">&#8250;</span>
          <span className="text-slate-600">Pesanan Saya</span>
        </nav>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pesanan Saya</h1>
            <p className="text-sm text-slate-500 mt-1">
              {orders?.total ?? orders?.data?.length ?? 0} pesanan ditemukan
            </p>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-brand-900 hover:underline shrink-0">
            Belanja Lagi
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => handleFilter(f.key)}
              className={`shrink-0 px-4 py-2 rounded-pill text-sm font-medium transition ${
                activeFilter === f.key ? 'bg-brand-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {orders?.data?.length > 0 ? (
          <div className="space-y-5">
            {orders.data.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title="Belum Ada Pesanan"
            description="Kamu belum memiliki pesanan pada kategori ini. Yuk mulai belanja produk favoritmu."
            action={
              <Link href="/catalog" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-pill bg-brand-900 text-white text-sm font-semibold hover:bg-slate-800 transition">
                Lihat Katalog
              </Link>
            }
          />
        )}

        <Pagination links={orders?.links} />
      </div>
    </PublicLayout>
  );
}


