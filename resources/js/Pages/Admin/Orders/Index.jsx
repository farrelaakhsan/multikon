import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search, Package, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ProductImage from '../../../Components/Order/ProductImage';
import EmptyState from '../../../Components/Order/EmptyState';
import Pagination from '../../../Components/Order/Pagination';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'ready_stock', label: 'Ready Stock' },
  { key: 'custom', label: 'Product Custom' },
];

const ACCENT_BY_STATUS = {
  pending_payment: 'bg-amber-400',
  waiting_payment: 'bg-amber-400',
  waiting_review: 'bg-amber-400',
  waiting_confirmation: 'bg-amber-400',
  processing: 'bg-amber-400',
  in_production: 'bg-amber-400',
  shipped: 'bg-amber-400',
  completed: 'bg-emerald-400',
  done: 'bg-emerald-400',
  rejected: 'bg-amber-400',
  cancelled: 'bg-red-400',
  waiting_settlement: 'bg-sky-400',
};

export default function OrdersIndex({ orders, activeFilter = 'all', search: initialSearch = '', stats }) {
  const [search, setSearch] = useState(initialSearch);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.get('/admin/orders', { ...(activeFilter !== 'all' && { filter: activeFilter }), ...(search && { search }) }, {
        preserveState: true, preserveScroll: true, replace: true,
      });
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleFilter = (key) => {
    router.get('/admin/orders', { ...(key !== 'all' && { filter: key }), ...(search && { search }) }, {
      preserveState: true, preserveScroll: true, replace: true,
    });
  };

  const emptyMessage = search ? 'Pesanan Tidak Ditemukan'
    : activeFilter === 'custom' ? 'Belum Ada Pesanan Custom'
    : activeFilter === 'ready_stock' ? 'Belum Ada Pesanan Ready Stock'
    : 'Belum Ada Pesanan';

  return (
    <AdminLayout>
      <Head title="Pesanan" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold text-slate-900 mb-6">Pesanan</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Package} label="Total Pesanan" value={stats?.total ?? 0} tint="bg-slate-100 text-slate-500" />
          <StatCard icon={Clock} label="Menunggu" value={stats?.waiting ?? 0} tint="bg-amber-100 text-amber-600" />
          <StatCard icon={Loader2} label="Diproses" value={stats?.active ?? 0} tint="bg-blue-100 text-blue-600" />
          <StatCard icon={CheckCircle2} label="Selesai" value={stats?.done ?? 0} tint="bg-emerald-100 text-emerald-600" />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode pesanan, nama pelanggan, atau produk..."
              className="w-full pl-10 pr-4 py-2.5 rounded-card border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/40 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => handleFilter(f.key)}
                className={`px-4 py-2 rounded-pill text-sm font-medium transition ${
                  activeFilter === f.key ? 'bg-brand-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {orders?.data?.length > 0 ? (
          <div className="space-y-3">
            {orders.data.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Package} title={emptyMessage} description="Coba ubah filter atau kata kunci pencarian." />
        )}

        <Pagination links={orders?.links} />
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="relative bg-white rounded-card border border-slate-200 shadow-card p-4">
      <div className={`absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center ${tint}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function OrderCard({ order }) {
  const accent = ACCENT_BY_STATUS[order.status] || 'bg-slate-300';
  const isPaid = order.payment_status === 'paid';
  const steps = order.progress_steps || [];
  const activeStep = steps.find(s => s.state === 'active');
  const cancelled = order.status === 'cancelled' || order.status === 'rejected';

  return (
    <Link
      href={`/admin/orders/${order.id}`}
      className="relative block bg-white rounded-card border border-slate-200 shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />
      {order.has_unread_for_admin && (
        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white z-10" />
      )}

      <div className="pl-8 pr-7 py-7 flex gap-6 items-center">
        <ProductImage src={order.product_image} alt={order.product_name} className="w-20 h-20 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] text-slate-400 font-mono">{order.order_code}</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isPaid ? 'Lunas' : 'Belum Bayar'}
            </span>
          </div>
          <p className="text-[15px] font-semibold text-slate-900 truncate">{order.customer_name}</p>
          <p className="text-[14px] text-slate-500 truncate mt-0.5">{order.product_name} &middot; {order.created_at}</p>
          {order.item_count > 1 && (
            <p className="text-[13px] text-slate-400 mt-0.5">+{order.item_count - 1} produk lainnya</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-[13px] font-semibold px-3 py-1 rounded-pill ${order.is_custom ? 'bg-brand-900 text-brand-amber' : 'bg-amber-100 text-amber-800'}`}>
            {order.is_custom ? 'Custom' : 'Ready'}
          </span>
          {cancelled ? (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium px-3 py-1 rounded-pill bg-red-100 text-red-600">
              Dibatalkan
            </span>
          ) : activeStep ? (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium px-3 py-1 rounded-pill bg-amber-100 text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {activeStep.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium px-3 py-1 rounded-pill bg-emerald-100 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Selesai
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
