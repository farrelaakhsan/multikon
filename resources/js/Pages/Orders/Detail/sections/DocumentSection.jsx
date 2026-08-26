import { FileText, Download, Info } from 'lucide-react';
import SectionCard from '../../../../Components/Order/SectionCard';
import { DOC_META } from '../constants';

export default function DocumentSection({ order, authUser }) {
  if (!order.can_download || !order.documents?.length) return null;

  return (
    <SectionCard title="Dokumen Pesanan" icon={FileText}>
      <div className="space-y-2">
        {order.documents.map((doc) => {
          const meta = DOC_META[doc.type];
          return (
            <div
              key={`${doc.type}-${doc.document_number}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-card border border-slate-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`p-2 rounded-lg ${meta.color}`}>
                  <FileText className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{meta.label}</p>
                  <p className="text-[11px] text-slate-400">{doc.document_number} · {doc.issued_at}</p>
                </div>
              </div>
              <a
                href={`/orders/${order.id}/documents/${doc.type}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-pill border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh
              </a>
            </div>
          );
        })}
      </div>

      {!authUser?.is_b2b_verified && order.documents.some((d) => d.type === 'faktur_pajak') && (
        <div className="mt-3 flex items-start gap-2.5 rounded-card bg-indigo-50 border border-indigo-100 px-4 py-3">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-indigo-700">
            Faktur Pajak (PPN 11%) diterbitkan khusus untuk akun Pembeli B2B
            Terverifikasi yang memiliki NPWP.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
