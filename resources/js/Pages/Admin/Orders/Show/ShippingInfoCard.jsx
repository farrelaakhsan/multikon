import { Truck, Store, Pencil } from "lucide-react";
import { Card } from "./Card";
import FileThumbnail from "../../../../Components/Order/FileThumbnail";

export default function ShippingInfoCard({ shipping, onEdit, onPreviewProof, accentColor }) {
    const isPickup = shipping.method === 'pickup';

    return (
        <Card accentColor={accentColor}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[10px] bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Truck size={16} className="text-slate-500" />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">Info Pengiriman</div>
                </div>
                <button type="button" onClick={onEdit} className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1">
                    <Pencil size={12} />
                    Edit
                </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 mb-3.5">
                <div className={`w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0 ${isPickup ? 'bg-blue-50' : 'bg-amber-50'}`}>
                    {isPickup ? (
                        <Store size={19} className="text-blue-700" />
                    ) : (
                        <Truck size={19} className="text-amber-700" />
                    )}
                </div>
                <div>
                    <div className="text-[13.5px] font-bold text-slate-800">
                        {isPickup ? 'Pickup di workshop' : 'Dikirim via kurir'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                        {isPickup
                            ? 'Pelanggan mengambil pesanan sendiri, tanpa pengiriman kurir'
                            : `Paket dikirim ke alamat pelanggan${shipping.courierName ? ` via ${shipping.courierName}` : ''}`}
                    </div>
                </div>
            </div>

            {isPickup ? (
                <>
                    <div className="text-[11px] text-slate-400 mb-0.5">Lokasi Pengambilan</div>
                    <div className="text-[13px] text-slate-700 leading-relaxed">
                        {shipping.workshopName} &middot; PIC: {shipping.pickupPIC ?? '-'}
                    </div>
                </>
            ) : (
                <>
                    <div className="text-[11px] text-slate-400 mb-0.5">Alamat Pengiriman</div>
                    <div className="text-[13px] text-slate-700 leading-relaxed mb-3">{shipping.address}</div>
                    {shipping.trackingNumber && (
                        <div className="flex gap-7">
                            <div>
                                <div className="text-[11px] text-slate-400 mb-0.5">No. Resi</div>
                                <div className="text-[13px] text-slate-800 font-semibold">{shipping.trackingNumber}</div>
                            </div>
                            <div>
                                <div className="text-[11px] text-slate-400 mb-0.5">Kontak Driver</div>
                                <div className="text-[13px] text-slate-800 font-semibold">{shipping.driverContact ?? '-'}</div>
                            </div>
                        </div>
                    )}
                    {shipping.proofUrl && (
                        <div className="mt-3">
                            <div className="text-[11px] text-slate-400 mb-1">Bukti Pengiriman</div>
                            <FileThumbnail url={shipping.proofUrl} label="Bukti Pengiriman" size="w-20 h-20" onPreview={() => onPreviewProof?.(shipping.proofUrl, 'Bukti Pengiriman')} />
                        </div>
                    )}
                </>
            )}
        </Card>
    );
}
