import { Package } from "lucide-react";
import { Card, CardHeader } from "./Card";
import ProductImage from "../../../../Components/ui/ProductImage";
import { formatCurrency } from "../../../../utils/format";

export default function ProductTableCard({ items, subtotal, shippingCost, total, isCustom, accentColor }) {

    return (
        <Card accentColor={accentColor} className="mb-5">
            <CardHeader icon={Package} title="Rincian Produk" />

            <div className="grid grid-cols-[56px_1fr_140px_70px_140px] gap-3 pb-3 border-b border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide">FOTO</span>
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide">PRODUK</span>
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide text-right">HARGA</span>
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide text-center">QTY</span>
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide text-right">TOTAL</span>
            </div>

            {items.map((item, idx) => (
                <div
                    key={item.id || idx}
                    className="grid grid-cols-[56px_1fr_140px_70px_140px] gap-3 items-center py-4 border-b border-slate-50 last:border-b-0"
                >
                    <ProductImage src={item.product_image} alt={item.product_name} className="w-11 h-11 rounded-xl" />
                    <div>
                        <div className="text-[13px] text-slate-800 font-semibold">{item.product_name}</div>
                        <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10.5px] font-semibold px-2 py-0.5 rounded-full">
                            {isCustom ? 'Custom' : 'Ready Stock'}
                        </span>
                    </div>
                    <div className="text-[13px] text-slate-600 text-right tabular-nums">{formatCurrency(item.unit_price)}</div>
                    <div className="text-[13px] text-slate-600 text-center">{item.quantity}</div>
                    <div className="text-[13px] text-slate-800 font-bold text-right tabular-nums">{formatCurrency(item.unit_price * item.quantity)}</div>
                </div>
            ))}

            <div className="flex justify-between text-[13px] text-slate-500 pt-4">
                <span>Subtotal Produk ({items.length} Barang)</span>
                <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>

            {shippingCost !== null && shippingCost !== undefined && (
                <div className="flex justify-between text-[13px] text-slate-500 mt-1.5">
                    <span>Ongkos Kirim</span>
                    <span className="tabular-nums">{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}</span>
                </div>
            )}

            <div className="border-t border-dashed border-slate-200 mt-4 pt-4 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-slate-800">Total Belanja</span>
                <span className="text-xl font-bold text-amber-500 tabular-nums">{formatCurrency(total)}</span>
            </div>
        </Card>
    );
}
