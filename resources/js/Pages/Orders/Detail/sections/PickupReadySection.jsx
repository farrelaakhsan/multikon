import { Package, Check, Headset } from 'lucide-react';
import { WORKSHOP } from '../constants';

export default function PickupReadySection({ order, onConfirmReceived }) {
  return (
    <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
      <div className="flex">
        <div className="w-1 flex-shrink-0 bg-[#3B82F6]" />
        <div className="flex-1 p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-[10px] bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-base font-medium text-slate-900 mb-0.5">
                Pesanan siap diambil
              </p>
              <p className="text-sm text-slate-500">
                Silakan ambil pesananmu di workshop kami
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl px-3.5 py-3 mb-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Kode pesanan</p>
                <p className="text-sm font-medium text-slate-900 font-mono">
                  {order.order_code}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400 mb-0.5">PIC pengambilan</p>
                <p className="text-sm font-medium text-slate-900">
                  {WORKSHOP.pic}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={onConfirmReceived}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg px-5 py-2.5 transition-colors"
            >
              <Check size={16} />
              Barang sudah diambil
            </button>
            <a
              href={`https://wa.me/${WORKSHOP.wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Headset size={15} />
              Bantuan / laporkan kendala
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
