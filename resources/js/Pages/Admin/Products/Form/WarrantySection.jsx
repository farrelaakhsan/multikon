export default function WarrantySection({ data, set }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Informasi Garansi</h2>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Masa Garansi</label>
                <input
                    type="text"
                    value={data.warranty}
                    onChange={(e) => set("warranty", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all"
                    placeholder="Contoh: 1 Tahun"
                />
                <p className="text-xs text-slate-400 mt-1">Informasi garansi yang berlaku untuk produk ini</p>
            </div>
        </div>
    );
}
