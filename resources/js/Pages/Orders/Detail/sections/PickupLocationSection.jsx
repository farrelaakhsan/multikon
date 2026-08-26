import { Store, MapPin, Phone, Clock } from 'lucide-react';
import { WORKSHOP } from '../constants';

export default function PickupLocationSection({ order }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[20px] p-7">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <Store className="w-[17px] h-[17px] text-slate-400" />
          Lokasi Pengambilan
        </p>
        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1.5">
          <Store className="w-[13px] h-[13px]" />
          Pickup
        </span>
      </div>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(WORKSHOP.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-3.5 relative group"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.230897228423!2d106.90063873836928!3d-6.202650131936295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4b04e5aa847%3A0xa3abcbcc267c91ca!2sCV.Multikon%20Erindotama!5e0!3m2!1sid!2sid!4v1778768755722!5m2!1sid!2sid"
          className="w-full h-[180px] rounded-[14px] border border-slate-200 pointer-events-none"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi Workshop Multikon Erindotama"
        />
        <span className="absolute bottom-2.5 right-2.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-800 flex items-center gap-1.5 group-hover:bg-slate-50 transition-colors shadow-sm">
          <MapPin className="w-[13px] h-[13px] text-slate-600" />
          Buka di Google Maps
        </span>
      </a>

      <div className="bg-[#F8F9FA] border border-slate-200 rounded-[14px] p-4 flex gap-3.5 items-start">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-amber-50 flex items-center justify-center shrink-0">
          <MapPin className="w-[19px] h-[19px] text-amber-500" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-slate-800 mb-1">{WORKSHOP.name}</p>
          <p className="text-[13px] text-slate-600 leading-relaxed">{WORKSHOP.address}</p>
        </div>
      </div>

      <div className="flex gap-5 mt-4">
        <div className="flex items-center gap-2">
          <Phone className="w-[15px] h-[15px] text-slate-400" />
          <p className="text-[13px] text-slate-600">{WORKSHOP.phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-[15px] h-[15px] text-slate-400" />
          <p className="text-[13px] text-slate-600">{WORKSHOP.hours}</p>
        </div>
      </div>

      {order.notes && (
        <div className="border-t border-slate-200 mt-4 pt-3.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
            Catatan Pesanan
          </p>
          <p className="text-[13px] text-slate-600">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
