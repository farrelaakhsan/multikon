import { FileText } from "lucide-react";
import { Card } from "./Card";
import { DOC_META, ADMIN_DOC_TYPES } from "./constants";

export default function DocumentsCard({ documents, orderId, onReissue, accentColor }) {
    return (
        <Card accentColor={accentColor}>
            <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-[10px] bg-slate-100 flex items-center justify-center">
                    <FileText size={16} className="text-slate-500" />
                </div>
                <div className="text-sm font-semibold text-slate-800">Dokumen PDF</div>
            </div>
            <div className="text-xs text-slate-400 mb-5 pl-[42px]">
                Terbit otomatis saat pembayaran dikonfirmasi
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ADMIN_DOC_TYPES.map((docType) => {
                    const issued = (documents || []).filter((d) => d.type === docType.type);
                    const latest = issued[0];
                    return (
                        <div key={docType.type} className="bg-slate-50 rounded-xl p-4">
                            <div className="text-[13px] text-slate-800 font-semibold mb-1">
                                {DOC_META[docType.type]?.label || docType.label}
                            </div>
                            {latest ? (
                                <div className="text-[11px] text-slate-400 mb-3">
                                    {latest.document_number}
                                    {issued.length > 1 ? ` (+${issued.length - 1} lainnya)` : ''}
                                </div>
                            ) : (
                                <div className="text-[11px] text-slate-400 mb-3">Belum diterbitkan</div>
                            )}
                            <div className="flex gap-2">
                                {latest && (
                                    <a
                                        href={`/admin/orders/${orderId}/documents/${docType.type}`}
                                        className="flex-1 text-center bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg py-1.5 hover:bg-slate-100 transition"
                                    >
                                        Unduh
                                    </a>
                                )}
                                <button
                                    onClick={() => onReissue(docType.type)}
                                    className="flex-1 text-center text-xs font-semibold rounded-lg py-1.5 transition bg-slate-800 text-white hover:bg-slate-700"
                                >
                                    {latest ? 'Terbitkan Lagi' : 'Terbitkan'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
