import { useState } from 'react';
import { Clock, CalendarClock, CheckCircle2 } from 'lucide-react';
import Banner from '../../../../Components/Order/Banner';

export default function TopSettlementSection({ order, showMethodPicker, setShowMethodPicker, selectedMethod, setSelectedMethod, onOpenSettlementModal }) {
  return (
    <section className="bg-white rounded-card border border-slate-200 border-l-4 border-l-amber-400 shadow-card">
      <div className="p-6">
        {order.settlement_status === 'verified' ? (
          <Banner
            variant="success"
            icon={CheckCircle2}
            title="Pelunasan Dikonfirmasi"
            description="Tagihan Anda telah dilunasi. Limit kredit otomatis dikembalikan."
          />
        ) : order.settlement_status === 'pending' ? (
          <Banner
            variant="info"
            icon={Clock}
            title="Bukti Pelunasan Sedang Diverifikasi"
            description="Admin akan memverifikasi bukti pembayaran Anda. Limit kredit dikembalikan setelah verifikasi."
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-[10px] bg-amber-50 flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-slate-900 text-[15px] font-semibold">Pelunasan (Jatuh Tempo ToP)</h3>
            </div>

            {/* Sub-card: status menunggu pelunasan */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 text-amber-500 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-900 text-[13.5px] font-semibold">Menunggu Pelunasan</div>
                <div className="text-slate-400 text-xs mt-0.5">
                  {order.settlement_due_at
                    ? `Batas pelunasan: ${order.settlement_due_at}`
                    : 'Segera lakukan pelunasan'}
                </div>
              </div>
            </div>

            {/* State awal: CTA tunggal */}
            {!showMethodPicker && (
              <button
                type="button"
                onClick={() => setShowMethodPicker(true)}
                className="w-full bg-slate-800 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-slate-700 transition"
              >
                Lunasi Sekarang
              </button>
            )}

            {/* State setelah CTA diklik: pilihan metode inline */}
            {showMethodPicker && (
              <>
                <div className="text-slate-900 text-[13px] font-semibold mb-2.5">Pilih Metode Pembayaran</div>
                <div className="flex flex-col gap-2.5 mb-4">
                  {[
                    { key: 'transfer_bank', icon: '🏦', iconBg: 'bg-blue-50', label: 'Transfer Bank Manual', desc: 'Upload bukti transfer di halaman pembayaran' },
                    { key: 'qris', icon: '📱', iconBg: 'bg-emerald-50', label: 'QRIS', desc: 'Scan & upload bukti pembayaran' },
                  ].map((method) => (
                    <label
                      key={method.key}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 cursor-pointer border-[1.5px] transition-colors ${
                        selectedMethod === method.key
                          ? 'border-amber-400 bg-amber-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pelunasan_method"
                        value={method.key}
                        checked={selectedMethod === method.key}
                        onChange={() => setSelectedMethod(method.key)}
                        className="sr-only"
                      />
                      <div className={`w-[34px] h-[34px] rounded-[9px] ${method.iconBg} flex items-center justify-center text-base shrink-0`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-900 text-[13.5px] font-medium">{method.label}</div>
                        <div className="text-slate-400 text-[11.5px]">{method.desc}</div>
                      </div>
                      <div className={`w-[18px] h-[18px] rounded-full border-2 shrink-0 ${
                        selectedMethod === method.key ? 'border-amber-400 border-[5px]' : 'border-slate-300'
                      }`} />
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedMethod) return;
                    onOpenSettlementModal();
                  }}
                  disabled={!selectedMethod}
                  className="w-full bg-amber-500 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Konfirmasi & Lanjutkan
                </button>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
