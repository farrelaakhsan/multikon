import Modal from "../../../../../Components/Order/Modal";

export default function SetPriceModal({ open, onClose, priceForm, setPriceForm, onSubmit, isCargo }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Tetapkan Harga Pesanan"
            footer={
                <>
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-pill border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition">
                        Batal
                    </button>
                    <button type="button" onClick={onSubmit} className="px-4 py-2 rounded-pill bg-brand-amber text-brand-900 text-sm font-bold hover:brightness-95 transition">
                        Tetapkan Harga
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Harga per Unit (Rp)</label>
                    <input
                        type="number"
                        required
                        value={priceForm.custom_price}
                        onChange={(e) => setPriceForm({ ...priceForm, custom_price: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-card border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/40"
                        placeholder="Contoh: 150000"
                    />
                </div>
                {isCargo && (
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Estimasi Berat (kg)</label>
                        <input
                            type="number"
                            required
                            value={priceForm.estimated_weight}
                            onChange={(e) => setPriceForm({ ...priceForm, estimated_weight: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-card border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/40"
                            placeholder="Contoh: 2.5"
                        />
                    </div>
                )}
                <p className="text-xs text-slate-400">Buyer akan bisa melihat harga dan melanjutkan pembayaran setelah harga ditetapkan.</p>
            </div>
        </Modal>
    );
}
