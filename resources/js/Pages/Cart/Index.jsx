import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import PublicLayout from "../../Layouts/PublicLayout";
import CartCheckbox from "../../Components/cart/CartCheckbox";
import CartItemCard from "../../Components/cart/CartItemCard";
import CartEmptyState from "../../Components/cart/CartEmptyState";
import CartSummarySidebar from "../../Components/cart/CartSummarySidebar";

export default function CartIndex({ items = [] }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [updating, setUpdating] = useState(null);

    const toggleItem = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((i) => i.id));
        }
    };

    const allSelected = items.length > 0 && selectedIds.length === items.length;

    const selectedItems = items.filter((i) => selectedIds.includes(i.id));
    const selectedTotal = selectedItems.reduce((sum, i) => sum + i.subtotal, 0);

    const handleUpdateQty = (itemId, qty, maxStock) => {
        if (qty < 1 || qty > maxStock) return;
        setUpdating(itemId);
        router.patch(
            `/cart/${itemId}`,
            { quantity: qty },
            { preserveScroll: true, onFinish: () => setUpdating(null) },
        );
    };

    const handleRemove = (itemId) => {
        const wasSelected = selectedIds.includes(itemId);
        router.delete(`/cart/${itemId}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (wasSelected) {
                    setSelectedIds((prev) => prev.filter((i) => i !== itemId));
                }
            },
        });
    };

    return (
        <PublicLayout>
            <Head title="Keranjang Belanja" />

            <main className="bg-[#F8F9FA] min-h-screen">
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                    <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
                        <Link href="/" className="hover:text-[#F59E0B] transition">Home</Link>
                        <span className="text-slate-300">›</span>
                        <span className="text-[#F59E0B]">Keranjang</span>
                    </div>

                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-[#1E293B] leading-none">
                                Keranjang
                            </h1>
                            <p className="text-sm text-slate-400 mt-3 font-medium">
                                {items.length > 0
                                    ? `${items.length} ${items.length === 1 ? "produk" : "produk"}`
                                    : "Belum ada produk"}
                            </p>
                        </div>
                        {items.length > 0 && (
                            <Link
                                href="/catalog"
                                className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F59E0B] transition"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                </svg>
                                Tambah Produk
                            </Link>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="bg-white rounded-2xl border border-[#1E293B]/10 shadow-sm px-5 py-3 mb-4 flex items-center gap-3">
                            <CartCheckbox checked={allSelected} onChange={toggleAll} />
                            <span className="text-[11px] font-bold text-[#1E293B]">
                                {allSelected ? "Batalkan Semua" : "Pilih Semua"}
                            </span>
                        </div>
                    )}

                    {items.length === 0 ? (
                        <CartEmptyState />
                    ) : (
                        <div className="grid lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-4">
                                {items.map((item) => (
                                    <CartItemCard
                                        key={item.id}
                                        item={item}
                                        selected={selectedIds.includes(item.id)}
                                        onToggle={toggleItem}
                                        onUpdateQty={handleUpdateQty}
                                        onRemove={handleRemove}
                                        updating={updating}
                                    />
                                ))}
                            </div>

                            <CartSummarySidebar
                                selectedIds={selectedIds}
                                selectedTotal={selectedTotal}
                                items={items}
                            />
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}
