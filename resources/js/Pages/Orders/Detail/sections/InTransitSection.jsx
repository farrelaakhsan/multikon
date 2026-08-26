import { Truck } from 'lucide-react';
import { WORKSHOP } from '../constants';

export default function InTransitSection({ order, onConfirmReceived }) {
  return (
    <div className="relative bg-white border border-slate-200 rounded-[20px] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
      <div className="px-7 py-6 pl-8">
        <div className="flex items-center gap-3.5 mb-[18px]">
          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Truck className="w-[21px] h-[21px] text-blue-500" />
          </div>
          <div>
            <p className="text-[16px] font-extrabold text-slate-800">Pesanan Sedang Dalam Pengiriman</p>
            <p className="text-[12.5px] text-slate-400 mt-0.5">
              Pesananmu sedang dalam perjalanan menuju alamat tujuan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onConfirmReceived}
            className="text-[13.5px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl px-[22px] py-3 transition-colors"
          >
            Pesanan Diterima
          </button>
          <a
            href={`https://wa.me/${WORKSHOP.wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] font-semibold text-slate-500 hover:text-slate-700 bg-transparent px-1 py-2.5 transition-colors"
          >
            Bantuan / Laporkan Kendala
          </a>
        </div>
      </div>
    </div>
  );
}
