import { Truck, FileText, Phone, Copy } from 'lucide-react';
import { formatPrice } from '../../../../utils/format';

export default function ShippingInfoSection({ order, onCopyTrackingNumber, onPreviewImage }) {
  if (!order.address) return null;

  const hasTrackingData = order.tracking_number || order.driver_contact || order.shipping_proof;

  return (
    <div className="bg-white border border-slate-200 rounded-[20px] p-7 md:p-[30px]">
      <div className="flex justify-between items-center mb-[22px]">
        <p className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-[17px] h-[17px] text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
          Informasi Pengiriman
        </p>
        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1.5">
          <Truck className="w-[13px] h-[13px]" />
          Cargo
        </span>
      </div>

      {/* Sub-section 1: Alamat Pengiriman */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wide mb-2.5">
          Alamat Pengiriman
        </p>
        <p className="text-[14px] font-bold text-slate-800 mb-1.5">{order.customer_name}</p>
        <p className="text-[13px] text-slate-600 leading-relaxed max-w-lg">{order.address}</p>
        {order.subdistrict_name && (
          <p className="text-[12px] text-slate-400 mt-0.5">{order.subdistrict_name}, {order.district_name}, {order.city_name}</p>
        )}
      </div>

      {/* Sub-section 2: Kurir & Ongkos Kirim */}
      {order.courier_name && (
        <div className="border-t border-slate-200 pt-[19px] mb-[19px]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-[13px]">
            Kurir & Ongkos Kirim
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[11px] bg-blue-50 flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-slate-800">
                  {order.courier_name}
                </p>
                <p className="text-[11.5px] text-slate-400 mt-0.5">
                  Estimasi tiba dihitung setelah dikirim
                </p>
              </div>
            </div>
            <p className="text-[17px] font-extrabold text-slate-800 whitespace-nowrap">
              Rp{formatPrice(order.shipping_cost)}
            </p>
          </div>
        </div>
      )}

      {/* Sub-section 3: Data Pengiriman (No Resi, Kontak Driver, Bukti) */}
      {hasTrackingData && (
        <div className="border-t border-slate-200 pt-[19px] mb-[19px]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-[13px]">
            Data Pengiriman
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-[13px]">
            {order.tracking_number && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[11px]">
                  <div className="w-9 h-9 rounded-[10px] bg-[#F8F9FA] border border-slate-200 flex items-center justify-center shrink-0">
                    <FileText className="w-[17px] h-[17px] text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">No. Resi</p>
                    <p className="text-[13px] font-bold text-slate-800 mt-0.5">{order.tracking_number}</p>
                  </div>
                </div>
                <button type="button" onClick={onCopyTrackingNumber} className="p-1">
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}

            {order.driver_contact && (
              <div className="flex items-center gap-[11px]">
                <div className="w-9 h-9 rounded-[10px] bg-[#F8F9FA] border border-slate-200 flex items-center justify-center shrink-0">
                  <Phone className="w-[17px] h-[17px] text-slate-600" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Kontak Driver</p>
                  <a href={`https://wa.me/${order.driver_contact}`} target="_blank" rel="noopener noreferrer" className="text-[13px] font-bold text-blue-500 mt-0.5 hover:underline">
                    {order.driver_contact}
                  </a>
                </div>
              </div>
            )}
          </div>

          {order.shipping_proof && (
            <div className="border-t border-slate-200 pt-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                Bukti Pengiriman
              </p>
              <button
                type="button"
                onClick={() => onPreviewImage?.({ src: order.shipping_proof, title: 'Bukti Pengiriman' })}
              >
                <img
                  src={order.shipping_proof}
                  alt="Bukti Pengiriman"
                  className="w-[76px] h-[76px] rounded-xl border border-slate-200 object-cover"
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sub-section 4: Catatan Pesanan — kondisional, paling akhir */}
      {order.notes && (
        <div className="border-t border-slate-200 pt-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
            Catatan Pesanan
          </p>
          <p className="text-[13px] text-slate-600">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
