import ProductImage from "../ui/ProductImage";
import { formatPrice } from "../../utils/format";

export default function OrderSummarySidebar({ items, total, shippingCost, shippingType, courierName, courierService, totalShipping, grandTotal, processing, paymentMethod, poFile, onSubmit, children }) {
    const itemCount = items?.length || 0;

    return (
        <div className="bg-white rounded-[2rem] border border-[#1E293B]/10 shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-black italic uppercase tracking-tighter text-[#1E293B]">Ringkasan Pesanan</h2>
                {itemCount > 0 && <p className="text-[10px] text-slate-400 mt-1">{itemCount} produk</p>}
            </div>

            {items && items.length > 0 && (
                <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 md:p-5 flex gap-3">
                            <ProductImage src={item.product_image} alt={item.product_name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-0.5">{item.category}</p>
                                <p className="text-xs font-bold text-[#1E293B] line-clamp-2">{item.product_name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400">{item.quantity}x</span>
                                    <span className="text-xs font-black text-[#1E293B]">Rp {formatPrice(item.subtotal)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {children}

            <div className="p-6 bg-[#F8F9FA]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subtotal</span>
                    <span className="text-sm font-black text-slate-600">Rp {formatPrice(total)}</span>
                </div>
                {shippingType === "cargo" && courierName && (
                    <div className="pt-3 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kurir</span>
                            <span className="text-xs font-bold text-slate-700">{courierName.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Layanan</span>
                            <span className="text-xs font-bold text-slate-700">{courierService}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ongkos Kirim</span>
                            <span className="text-sm font-black text-slate-600">Rp {formatPrice(totalShipping || 0)}</span>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total</span>
                    <span className="text-xl font-black text-[#1E293B]">Rp {formatPrice(grandTotal || total)}</span>
                </div>
            </div>

            <div className="p-6 pt-0">
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={processing || (paymentMethod === "top" && !poFile)}
                    className="w-full bg-[#F59E0B] text-[#1E293B] py-4 rounded-xl font-black uppercase tracking-wider text-sm shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 disabled:opacity-60"
                >
                    {processing
                        ? "Memproses..."
                        : paymentMethod === "top"
                          ? "Buat Pesanan (ToP)"
                          : itemCount > 0
                            ? `Buat ${itemCount} Pesanan`
                            : "Buat Pesanan"}
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-4">Dengan mengklik tombol di atas, Anda menyetujui syarat dan ketentuan pemesanan Multikon.</p>
            </div>
        </div>
    );
}
