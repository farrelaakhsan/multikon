import { FileText, Check, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/format';

const TERMIN_CTA_LABEL = {
  dp: 'Bayar DP / Pembayaran Awal',
  progress: 'Bayar',
  final: 'Bayar Pelunasan',
};

export default function TerminBillsSection({ order, onPayStage }) {
  const termin = order.termin;
  if (!termin) return null;

  const { stages, totalAmount, overallStatus } = termin;
  const isLunas = overallStatus === 'lunas';
  const lunasStages = stages.filter((s) => s.status === 'lunas');
  const activeStage = stages.find((s) => s.status !== 'lunas');
  const activeIndex = activeStage ? stages.indexOf(activeStage) : -1;

  const cardBorderClass = isLunas
    ? 'border-l-emerald-400'
    : activeIndex === 0
      ? 'border-l-amber-400'
      : 'border-l-blue-400';

  return (
    <section className={`relative bg-white rounded-card border border-slate-200 border-l-4 ${cardBorderClass} shadow-card`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-[10px] ${isLunas ? 'bg-emerald-50' : 'bg-amber-50'} flex items-center justify-center`}>
              <FileText className={`w-4 h-4 ${isLunas ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
            <h3 className="text-slate-900 text-[15px] font-semibold">Pembayaran Termin</h3>
          </div>

          {isLunas ? (
            <span className="bg-emerald-50 text-emerald-700 text-[11.5px] font-semibold px-3 py-1.5 rounded-full">
              Lunas
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2.5 py-1 rounded-md">
              Tahap {activeIndex + 1} dari {stages.length}
            </span>
          )}
        </div>

        {/* Riwayat termin lunas - baris ringkas */}
        {lunasStages.map((stage) => (
          <TerminRowLunas key={stage.key} stage={stage} />
        ))}

        {/* Termin aktif - salah satu dari 2 state */}
        {activeStage && activeStage.status === 'belum_bayar' && (
          <TerminCardBelumBayar stage={activeStage} onPay={() => onPayStage(activeStage.key)} />
        )}
        {activeStage && activeStage.status === 'menunggu_verifikasi' && (
          <TerminCardMenungguVerifikasi stage={activeStage} onChangeProof={() => onPayStage(activeStage.key, { mode: 'ubah' })} />
        )}

        {/* Termin yang belum waktunya (belum_bayar tapi bukan aktif) */}
        {stages.filter((s) => s.status === 'belum_bayar' && s !== activeStage).length > 0 && (
          <div className="mt-2.5">
            {stages.filter((s) => s.status === 'belum_bayar' && s !== activeStage).map((stage) => (
              <div key={stage.key} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-2 last:mb-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-400">
                    {stages.indexOf(stage) + 1}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-600">{stage.label}</p>
                    <p className="text-[11px] text-slate-400">{stage.percentage}% · Menunggu tahap sebelumnya</p>
                  </div>
                </div>
                <p className="text-[13px] font-bold text-slate-400">{formatCurrency(stage.amount)}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA - mengikuti tahap aktif, atau pesan penutup jika sudah lunas */}
        {isLunas ? (
          <div className="mt-4 bg-slate-50 rounded-xl py-3.5 text-center text-slate-600 text-[13px]">
            Seluruh pembayaran telah lunas — tidak ada tindakan lebih lanjut
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TerminRowLunas({ stage }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 flex justify-between items-center mb-2 last:mb-0">
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="text-[13px] font-medium text-emerald-800">
          {stage.label} — {stage.percentage}% — {formatCurrency(stage.amount)}
        </p>
      </div>
      {stage.proof_url && (
        <a
          href={stage.proof_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11.5px] font-medium text-blue-600 hover:underline whitespace-nowrap ml-2"
        >
          Lihat bukti
        </a>
      )}
    </div>
  );
}

function TerminCardBelumBayar({ stage, onPay }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mt-2.5">
      <p className="text-[13.5px] font-semibold text-slate-900 mb-0.5">
        {stage.label} — {stage.percentage}%
      </p>
      <p className="text-[12px] text-slate-500 mb-3">
        {formatCurrency(stage.amount)}
      </p>
      <button
        type="button"
        onClick={onPay}
        className="w-full bg-amber-500 text-white text-[13.5px] font-semibold py-2.5 rounded-[10px] hover:bg-amber-600 transition"
      >
        {TERMIN_CTA_LABEL[stage.key]}
      </button>
    </div>
  );
}

function TerminCardMenungguVerifikasi({ stage, onChangeProof }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 mt-2.5">
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <p className="text-[13.5px] font-semibold text-slate-900">
            {stage.label} — {stage.percentage}%
          </p>
          <p className="text-[12.5px] text-blue-600 font-medium mt-0.5">
            Menunggu verifikasi admin
          </p>
        </div>
        <Clock className="w-[18px] h-[18px] text-blue-500 shrink-0" />
      </div>
      <p className="text-[11.5px] text-slate-500 mb-3">
        {formatCurrency(stage.amount)} — Bukti dikirim {formatDate(stage.submitted_at)}
      </p>
      <div className="flex gap-2.5">
        <button
          disabled
          className="flex-1 bg-gray-200 text-gray-400 text-[13px] font-medium py-2.5 rounded-[10px] cursor-not-allowed"
        >
          Menunggu verifikasi
        </button>
        <button
          type="button"
          onClick={onChangeProof}
          className="text-blue-600 text-[13px] font-medium px-3 hover:underline"
        >
          Ubah bukti transfer
        </button>
      </div>
    </div>
  );
}
