import { Link } from '@inertiajs/react';
import { ShoppingCart, Info } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import ProductImage from './ProductImage';

const STATUS_MAP = {
  pending_payment: {
    label: 'Menunggu Pembayaran',
    accent: 'bg-amber-400',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  waiting_payment: {
    label: 'Menunggu Pembayaran',
    accent: 'bg-amber-400',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  waiting_review: {
    label: 'Menunggu Peninjauan',
    accent: 'bg-violet-400',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
  },
  waiting_confirmation: {
    label: 'Verifikasi Pembayaran',
    accent: 'bg-blue-400',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  po_verification: {
    label: 'Verifikasi PO',
    accent: 'bg-blue-400',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  processing: {
    label: 'Diproses',
    accent: 'bg-blue-400',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  in_production: {
    label: 'Produksi',
    accent: 'bg-blue-400',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  custom_consultation: {
    label: 'Konsultasi Custom',
    accent: 'bg-blue-400',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  confirmed: {
    label: 'Dikonfirmasi',
    accent: 'bg-blue-400',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  in_progress: {
    label: 'Diproses',
    accent: 'bg-blue-400',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  shipped: {
    label: 'Dikirim',
    accent: 'bg-indigo-400',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
  },
  waiting_settlement: {
    label: 'Menunggu Pelunasan',
    accent: 'bg-amber-400',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  completed: {
    label: 'Selesai',
    accent: 'bg-emerald-400',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  done: {
    label: 'Selesai',
    accent: 'bg-emerald-400',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  rejected: {
    label: 'Ditolak',
    accent: 'bg-red-400',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
  },
  cancelled: {
    label: 'Dibatalkan',
    accent: 'bg-red-400',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
  },
};

const DEFAULT_STATUS = {
  label: 'Tidak Diketahui',
  accent: 'bg-slate-300',
  badgeBg: 'bg-slate-100',
  badgeText: 'text-slate-600',
};

export default function OrderCard({ order }) {
  const status = STATUS_MAP[order.status] || DEFAULT_STATUS;
  const needsAction = order.status === 'pending_payment' || order.status === 'waiting_payment';
  const paymentLabel = order.payment_method?.startsWith('bank_')
    ? 'Transfer Bank Manual'
    : order.payment_method === 'qris'
    ? 'QRIS'
    : order.payment_label || 'Metode belum dipilih';

  const itemCount = order.items?.length ?? 1;
  const firstItem = order.items?.[0];
  const hasMoreItems = itemCount > 1;

  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-150 overflow-hidden w-full">
      {/* Accent bar kiri */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${status.accent}`} />

      {/* Unread indicator */}
      {order.has_unread_for_user && (
        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white z-10" />
      )}

      <div className="pl-7 pr-6 py-5 max-sm:pl-5 max-sm:pr-4 max-sm:py-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[15px] font-semibold text-slate-800">
              <ShoppingCart className="w-4 h-4 text-slate-400 shrink-0" />
              {order.order_code}
            </div>
            <p className="text-[13px] text-slate-400 mt-0.5">{order.created_at}</p>
          </div>
          <span
            className={`text-[12px] font-semibold px-3 py-1 rounded-full whitespace-nowrap shrink-0 max-sm:text-[11px] max-sm:px-2.5`}
            style={
              order.status === 'pending_payment' || order.status === 'waiting_payment'
                ? { backgroundColor: '#FEF3E2', color: '#B45309' }
                : order.status === 'waiting_review'
                ? { backgroundColor: '#EDE9FE', color: '#6D28D9' }
                : ['waiting_confirmation', 'processing', 'in_production', 'custom_consultation', 'confirmed', 'in_progress', 'po_verification'].includes(order.status)
                ? { backgroundColor: '#EFF6FF', color: '#1D4ED8' }
                : order.status === 'shipped'
                ? { backgroundColor: '#E0E7FF', color: '#4338CA' }
                : order.status === 'completed' || order.status === 'done'
                ? { backgroundColor: '#ECFDF5', color: '#047857' }
                : order.status === 'waiting_settlement'
                ? { backgroundColor: '#FEF3E2', color: '#B45309' }
                : ['rejected', 'cancelled'].includes(order.status)
                ? { backgroundColor: '#FEF2F2', color: '#B91C1C' }
                : { backgroundColor: '#F1F5F9', color: '#475569' }
            }
          >
            {status.label}
          </span>
        </div>

        <div className="border-t border-slate-200 my-4" />

        {/* Product row — full width, no total belanja here */}
        <div className="flex gap-3.5 items-start">
          <div className="relative shrink-0">
            <ProductImage src={firstItem?.product_image ?? order.product_image} alt={firstItem?.product_name ?? order.product_name} className="w-16 h-16 max-sm:w-14 max-sm:h-14 shrink-0" />
            {hasMoreItems && (
              <span className="absolute -bottom-1 -right-1 bg-slate-800 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-[2.5px] border-white leading-none px-1">
                {itemCount}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <span
              className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1.5 ${
                order.is_custom ? 'bg-slate-800 text-amber-300' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {order.is_custom ? 'Custom' : 'Ready Stock'}
            </span>
            <p className="text-[14px] font-semibold text-slate-800 line-clamp-2">
              {order.product_name}
              <span className="text-[12px] font-normal text-slate-500 ml-1.5">
                {firstItem?.quantity ?? order.quantity}x
              </span>
            </p>
            {hasMoreItems && (
              <Link
                href={`/order/${order.order_code}/tracking`}
                className="text-[12px] font-medium text-blue-600 hover:text-blue-700 hover:underline mt-1 inline-block"
              >
                +{itemCount - 1} produk lainnya
              </Link>
            )}
            <p className="text-[12px] text-slate-600 mt-1">
              {paymentLabel}
            </p>
          </div>
        </div>

        {/* Total belanja — separate row, right-aligned, no border/divider */}
        <div className="text-right mt-4">
          <p className="text-[12px] text-slate-600">
            Total Belanja{hasMoreItems ? ` (${itemCount} produk)` : ''}
          </p>
          <p className="text-[18px] font-bold text-slate-800 mt-1 whitespace-nowrap">
            Rp {formatPrice(order.total_price)}
          </p>
        </div>

        <div className="border-t border-slate-200 my-4" />

        {/* Footer row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/order/${order.order_code}/tracking`}
            className="text-[13px] font-semibold text-slate-800 border border-slate-200 rounded-[10px] px-5 py-2 hover:bg-slate-50 active:scale-[0.98] transition-all text-center sm:text-left sm:w-auto"
          >
            Detail Pesanan
          </Link>

          {needsAction && (
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-[10px] px-3.5 py-2 w-full sm:w-auto">
              <p className="text-[12.5px] font-medium text-amber-700 flex items-center gap-1.5 whitespace-nowrap flex-1 sm:flex-none">
                <Info className="w-[15px] h-[15px] shrink-0" />
                Perlu upload bukti pembayaran
              </p>
              <Link
                href={`/order/payment/${order.order_code}`}
                className="text-[12.5px] font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg px-3.5 py-1.5 active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
              >
                Bayar Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
