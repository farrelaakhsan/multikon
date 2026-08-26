import { Link } from "@inertiajs/react";
import ProductImage from "../ui/ProductImage";
import { formatPrice } from "../../utils/format";
import CartCheckbox from "./CartCheckbox";

export default function CartItemCard({ item, selected, onToggle, onUpdateQty, onRemove, updating }) {
    return (
        <div className={`group bg-white rounded-3xl border-2 transition-all duration-300 p-5 md:p-6 ${
            selected ? "border-[#F59E0B] shadow-md" : "border-[#1E293B]/10 shadow-sm hover:shadow-md hover:border-[#1E293B]/20"
        }`}>
            <div className="flex gap-4 md:gap-5">
                <div className="flex items-start pt-2">
                    <CartCheckbox checked={selected} onChange={() => onToggle(item.id)} />
                </div>

                <div className="flex gap-5 md:gap-7 flex-1 min-w-0">
                    <div className="relative shrink-0">
                        <ProductImage
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover shadow-sm"
                        />
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1E293B] text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                            {item.quantity}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#F59E0B] mb-1.5">
                                    {item.category}
                                </p>
                                <Link
                                    href={`/catalog/${item.product_id}`}
                                    className="text-sm md:text-base font-bold text-[#1E293B] leading-snug line-clamp-2 hover:text-[#F59E0B] transition"
                                >
                                    {item.product_name}
                                </Link>
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(item.id)}
                                className="shrink-0 w-8 h-8 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Harga</p>
                                    <p className="text-base font-black text-[#1E293B]">Rp {formatPrice(item.price)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Subtotal</p>
                                    <p className="text-lg font-black text-[#1E293B]">Rp {formatPrice(item.subtotal)}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 gap-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        disabled={updating === item.id}
                                        onClick={() => onUpdateQty(item.id, item.quantity - 1, item.stock)}
                                        className="w-9 h-9 rounded-xl border-2 border-slate-200 text-[#1E293B] font-black text-base hover:border-[#F59E0B] hover:bg-[#F59E0B]/10 disabled:opacity-40 transition"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center text-sm font-black text-[#1E293B] tabular-nums">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={updating === item.id}
                                        onClick={() => onUpdateQty(item.id, item.quantity + 1, item.stock)}
                                        className="w-9 h-9 rounded-xl border-2 border-slate-200 text-[#1E293B] font-black text-base hover:border-[#F59E0B] hover:bg-[#F59E0B]/10 disabled:opacity-40 transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
