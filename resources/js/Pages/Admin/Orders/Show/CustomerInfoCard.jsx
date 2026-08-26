import { User } from "lucide-react";
import { Card, CardHeader } from "./Card";

export default function CustomerInfoCard({ customer, isCustom, accentColor }) {
    return (
        <Card accentColor={accentColor}>
            <CardHeader icon={User} title="Info Pelanggan" />
            <div className="flex gap-7 mb-3.5">
                <div>
                    <div className="text-[11px] text-slate-400 mb-0.5">Nama Pemesan</div>
                    <div className="text-[13px] text-slate-800 font-semibold">{customer.name}</div>
                </div>
                <div>
                    <div className="text-[11px] text-slate-400 mb-0.5">Kontak</div>
                    <a href={`https://wa.me/${customer.phone}`} className="text-[13px] text-blue-700 font-semibold">
                        {customer.phone}
                    </a>
                </div>
            </div>
            {customer.note && (
                <div className="border-t border-slate-100 pt-3">
                    <div className="text-[11px] text-slate-400 mb-0.5">Catatan Pesanan</div>
                    <div className="text-[13px] text-slate-700">{customer.note}</div>
                </div>
            )}
            {isCustom && customer.customDetails && (
                <div className="border-t border-slate-100 pt-3 mt-3 flex flex-col gap-2.5">
                    {customer.customDetails.requirements && (
                        <div>
                            <div className="text-[11px] text-slate-400 mb-0.5">Kebutuhan Custom</div>
                            <div className="text-[13px] text-slate-700">{customer.customDetails.requirements}</div>
                        </div>
                    )}
                    {customer.customDetails.specifications && (
                        <div>
                            <div className="text-[11px] text-slate-400 mb-0.5">Spesifikasi</div>
                            <div className="text-[13px] text-slate-700 whitespace-pre-line">{customer.customDetails.specifications}</div>
                        </div>
                    )}
                    {customer.customDetails.notes && (
                        <div>
                            <div className="text-[11px] text-slate-400 mb-0.5">Catatan Custom</div>
                            <div className="text-[13px] text-slate-700">{customer.customDetails.notes}</div>
                        </div>
                    )}
                    {customer.customDetails.referenceFileUrl && (
                        <div>
                            <div className="text-[11px] text-slate-400 mb-0.5">File Referensi</div>
                            <a href={customer.customDetails.referenceFileUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] text-blue-700 font-medium w-fit">
                                Lihat file referensi
                            </a>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
