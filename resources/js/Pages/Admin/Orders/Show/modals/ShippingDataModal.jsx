import { AlertTriangle } from "lucide-react";
import Modal from "../../../../../Components/Order/Modal";

export default function ShippingDataModal({ open, onClose, shippingForm, setShippingForm, onSubmit, isCargo }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isCargo ? 'Info Pengiriman' : 'Konfirmasi Pengambilan'}
            footer={
                <>
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-pill border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition">
                        Batal
                    </button>
                    <button type="button" onClick={onSubmit} className="px-4 py-2 rounded-pill bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
                        Simpan
                    </button>
                </>
            }
        >
            {isCargo ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Nama Ekspedisi</label>
                        <input
                            type="text"
                            value={shippingForm.courier_name}
                            onChange={(e) => setShippingForm({ ...shippingForm, courier_name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-card border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/40"
                            placeholder="Contoh: JNE, J&T, dst"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Nomor Resi / Surat Jalan</label>
                        <input
                            type="text"
                            required
                            value={shippingForm.tracking_number}
                            onChange={(e) => setShippingForm({ ...shippingForm, tracking_number: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-card border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/40"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Kontak Driver/Kurir</label>
                        <input
                            type="text"
                            required
                            value={shippingForm.driver_contact}
                            onChange={(e) => setShippingForm({ ...shippingForm, driver_contact: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-card border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/40"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Bukti Pengiriman (opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setShippingForm({ ...shippingForm, proof: e.target.files?.[0] })}
                            className="w-full text-sm text-slate-500 file:mr-3 file:px-3 file:py-1.5 file:rounded-pill file:border-0 file:bg-surface-muted file:text-slate-600 file:text-xs file:font-medium"
                        />
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                        Pesanan ini menggunakan metode <strong className="text-slate-800">pickup di workshop</strong>. Klik <strong className="text-slate-800">simpan</strong> untuk menandai pesanan <strong className="text-slate-800">siap diambil</strong> oleh pelanggan.
                    </p>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-amber-700">Pastikan barang sudah siap dan lengkap sebelum konfirmasi.</span>
                    </div>
                </>
            )}
        </Modal>
    );
}
