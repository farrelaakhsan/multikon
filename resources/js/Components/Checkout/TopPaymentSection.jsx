import { formatPrice } from "../../utils/format";

export default function TopPaymentSection({ creditLimit, remainingCredit, grandTotal, poFile, onPoFileChange, errors }) {
    return (
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
            {errors.credit_limit && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                    <p className="text-xs text-red-700 leading-relaxed">{errors.credit_limit}</p>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#1E293B] text-white p-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Batas Kredit Anda</p>
                    <p className="text-lg font-black text-[#F59E0B]">Rp {formatPrice(creditLimit)}</p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-1">Sisa Limit Kredit</p>
                    <p className="text-lg font-black text-amber-700">Rp {formatPrice(remainingCredit)}</p>
                </div>
            </div>

            {remainingCredit > 0 && grandTotal > remainingCredit && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                    <p className="text-xs text-red-700 leading-relaxed">
                        Sisa limit kredit tidak mencukupi. Total transaksi ini melebihi batas Credit Limit Anda. Silakan lunasi tagihan berjalan Anda terlebih dahulu atau gunakan metode pembayaran lain.
                    </p>
                </div>
            )}

            <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Dokumen Purchase Order (PO) <span className="text-[#F59E0B]">* Wajib</span>
                </label>
                <input
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            onPoFileChange(e.target.files[0]);
                        }
                    }}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#F59E0B] file:text-[#1E293B] hover:file:brightness-105 transition cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                    Format: PDF, JPG, JPEG, PNG — maks. 5MB
                    {poFile && <span className="text-emerald-600 font-bold ml-1">✓ {poFile.name}</span>}
                </p>
                {errors.po_document && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.po_document}</p>
                )}
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Syarat PO yang Sah</p>
                <ul className="text-xs text-slate-600 leading-relaxed space-y-1.5 list-disc list-inside">
                    <li>Dicetak di kop surat resmi PT/CV pembeli</li>
                    <li>Memuat nomor &amp; tanggal PO</li>
                    <li>Mencantumkan rincian barang yang dipesan</li>
                    <li>Ditandatangani &amp; distempel pejabat berwenang</li>
                </ul>
                <a
                    href="/po-template"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] hover:underline"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                    Download Contoh Template PO (PDF)
                </a>
            </div>
        </div>
    );
}
