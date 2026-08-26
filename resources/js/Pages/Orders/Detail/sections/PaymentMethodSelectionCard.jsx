import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Clock, Building2, Smartphone } from 'lucide-react';
import { formatPrice } from '../../../../utils/format';

export default function PaymentMethodSelectionCard({ order }) {
  const { props } = usePage();
  const paymentSettings = props.paymentSettings || {};
  const bankAccounts = paymentSettings.bank_accounts || [];

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSelect = () => {
    if (!selectedMethod) return;
    setSaving(true);
    router.patch(`/orders/${order.id}/payment-method`, {
      payment_method: selectedMethod,
    }, {
      preserveScroll: true,
      onFinish: () => setSaving(false),
    });
  };

  return (
    <div className="relative bg-white border border-slate-200 rounded-[20px] shadow-[0_1px_3px_rgba(30,41,59,0.06),0_4px_12px_rgba(30,41,59,0.04)] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />

      <div className="pt-7 pb-5 pl-9 pr-8 max-md:pt-5 max-md:pb-4 max-md:pl-6 max-md:pr-5 flex items-center gap-3">
        <div className="w-[38px] h-[38px] rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0">
          <Clock className="w-[19px] h-[19px] text-amber-500" />
        </div>
        <div>
          <p className="text-[17px] font-bold text-slate-800">Menunggu Pembayaran</p>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Pilih metode pembayaran untuk melanjutkan
          </p>
        </div>
      </div>

      <div className="mx-8 ml-9 max-md:mx-5 max-md:ml-6 border-t border-dashed border-slate-200" />

      <div className="pt-6 pb-6 pl-9 pr-8 max-md:pt-5 max-md:pb-5 max-md:pl-6 max-md:pr-5">
        <div className="mb-5">
          <p className="text-[12px] text-slate-400 mb-1">Nomor Pesanan</p>
          <p className="text-[16px] font-bold text-slate-800">{order.order_code}</p>
        </div>

        <div className="mb-5">
          <p className="text-[12px] text-slate-400 mb-1">Total Tagihan</p>
          <p className="text-[24px] font-extrabold text-amber-500">
            Rp{formatPrice(order.total_price)}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-[12px] text-slate-400 mb-2">Metode Pembayaran</p>
          <div className="flex flex-col gap-2.5">
            {bankAccounts.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedMethod('bank_0')}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left border-[1.5px] transition ${
                  selectedMethod === 'bank_0'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  selectedMethod === 'bank_0' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'bank_0' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className={selectedMethod === 'bank_0' ? 'text-amber-600' : 'text-slate-400'}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[13.5px] font-semibold ${selectedMethod === 'bank_0' ? 'text-amber-800' : 'text-slate-800'}`}>
                    Transfer Bank
                  </p>
                  <p className="text-[11.5px] text-slate-500">Transfer manual ke rekening perusahaan</p>
                </div>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedMethod('qris')}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left border-[1.5px] transition ${
                selectedMethod === 'qris'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                selectedMethod === 'qris' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
              }`}>
                {selectedMethod === 'qris' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className={selectedMethod === 'qris' ? 'text-amber-600' : 'text-slate-400'}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-[13.5px] font-semibold ${selectedMethod === 'qris' ? 'text-amber-800' : 'text-slate-800'}`}>
                  QRIS
                </p>
                <p className="text-[11.5px] text-slate-500">Scan untuk bayar via e-wallet/m-banking</p>
              </div>
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedMethod || saving}
          onClick={handleSelect}
          className="w-full text-[14.5px] font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl py-4 transition-colors"
        >
          {saving ? 'Menyimpan...' : 'Pilih Metode Pembayaran'}
        </button>
      </div>
    </div>
  );
}
