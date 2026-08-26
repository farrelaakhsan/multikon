export default function IdentitySection({ data, set, errors }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Identitas Produk</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => set("name", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all"
                        placeholder="Masukkan nama produk"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Kategori <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.category}
                        onChange={(e) => set("category", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all"
                        placeholder="Contoh: Sink, Table, Cabinet"
                    />
                    {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Harga (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={data.price}
                        onChange={(e) => set("price", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all"
                        placeholder="Masukkan harga produk"
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>
            </div>
        </div>
    );
}
