export default function DescriptionSection({ data, set, errors }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Deskripsi Produk</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows="6"
                        value={data.description}
                        onChange={(e) => set("description", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all min-h-[200px] resize-y"
                        placeholder="Jelaskan detail produk secara lengkap"
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Spesifikasi</label>
                    <textarea
                        rows="4"
                        value={data.specifications}
                        onChange={(e) => set("specifications", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all min-h-[120px] resize-y"
                        placeholder="Material, dimensi, kapasitas, dll"
                    />
                    <p className="text-xs text-slate-400 mt-1">Contoh: Stainless Steel 304, 120x60x85 cm</p>
                </div>
            </div>
        </div>
    );
}
