import { FileText, Info } from 'lucide-react';

const PO_STATUS_COLOR = {
  verified: { border: 'border-l-emerald-400', badge: 'bg-emerald-100 text-emerald-700', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
  pending:  { border: 'border-l-amber-400',   badge: 'bg-amber-100 text-amber-700',   iconBg: 'bg-amber-50',   iconText: 'text-amber-600' },
};

export default function TopPoSection({ order }) {
  const poColor = PO_STATUS_COLOR[order.po_verification_status] || PO_STATUS_COLOR.pending;

  return (
    <section className={`bg-white rounded-card border border-slate-200 border-l-4 ${poColor.border} shadow-card`}>
      <div className="p-6">
        {/* Header: icon + judul + badge status — semua ikut warna status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-[10px] ${poColor.iconBg} flex items-center justify-center`}>
              <FileText className={`w-4 h-4 ${poColor.iconText}`} />
            </div>
            <h3 className="text-slate-900 text-[15px] font-semibold">Purchase Order (ToP)</h3>
          </div>
          <span className={`${poColor.badge} text-xs font-medium px-3 py-1.5 rounded-full`}>
            {order.po_verification_label || 'Menunggu Verifikasi PO'}
          </span>
        </div>

        {/* Sub-card: skema pembayaran */}
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <div className="text-slate-400 text-[11.5px] mb-0.5">Skema Pembayaran</div>
          <div className="text-slate-900 text-[13.5px] font-medium">{order.payment_label}</div>
        </div>

        {/* Notice info — hanya muncul saat menunggu verifikasi */}
        {order.po_verification_status !== 'verified' && (
          <div className="bg-blue-50 rounded-xl px-4 py-3.5 flex items-start gap-2.5 mb-4">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700 text-xs leading-relaxed">Dokumen PO Anda sedang diperiksa admin sebelum pesanan diproses.</p>
          </div>
        )}

        {/* CTA: lihat dokumen PO */}
        {order.po_document_url && (
          <a
            href={order.po_document_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 text-[13.5px] font-medium py-3 rounded-xl hover:bg-slate-50 transition"
          >
            <FileText className="w-4 h-4" />
            Lihat Dokumen Purchase Order (PO)
          </a>
        )}
      </div>
    </section>
  );
}
