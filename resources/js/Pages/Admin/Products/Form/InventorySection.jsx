export default function InventorySection({ data, set, isCustomSelected, onToggleCustom }) {
    return (
        <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Inventory</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="product_type"
                            checked={!isCustomSelected}
                            onChange={() => {
                                onToggleCustom(false);
                            }}
                            className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B]/20"
                        />
                        <div>
                            <span className="text-sm font-medium text-slate-700">Ready Stock</span>
                            <p className="text-xs text-slate-400">Produk tersedia di gudang</p>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="product_type"
                            checked={isCustomSelected}
                            onChange={() => {
                                onToggleCustom(true);
                            }}
                            className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B]/20"
                        />
                        <div>
                            <span className="text-sm font-medium text-slate-700">Custom</span>
                            <p className="text-xs text-slate-400">Produk dibuat sesuai kebutuhan</p>
                        </div>
                    </label>
                </div>

                {!isCustomSelected && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Stok</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={data.stock}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                set("stock", parseInt(val) || 0);
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all"
                            placeholder="Jumlah stok tersedia"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Berat (kg)</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={data.weight}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, "");
                            set("weight", val);
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all"
                        placeholder="Contoh: 15.5"
                    />
                    <p className="text-xs text-slate-400 mt-1">Digunakan untuk kalkulasi ongkos kirim</p>
                </div>
            </div>
        </div>
    );
}
