export default function UsageSection({ data, set }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Cara Penggunaan</h2>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Petunjuk Penggunaan</label>
                <textarea
                    rows="5"
                    value={data.usage_instructions}
                    onChange={(e) => set("usage_instructions", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all min-h-[160px] resize-y"
                    placeholder="Jelaskan cara penggunaan produk"
                />
                <p className="text-xs text-slate-400 mt-1">Setiap baris mewakili 1 langkah penggunaan</p>
            </div>
        </div>
    );
}
