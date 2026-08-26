import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import PublicLayout from "../../Layouts/PublicLayout";
import ProductImage from "../../Components/ui/ProductImage";
import { formatPrice } from "../../utils/format";

function SectionTitle({ children }) {
    return (
        <h2 className="text-[15px] font-black uppercase tracking-widest text-slate-400 mb-3">
            {children}
        </h2>
    );
}

function formatTextWithBullet(text) {
    if (!text) return [];
    return text
        .split("\n")
        .map((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("*")) {
                return "• " + trimmed.substring(1).trim();
            }
            return trimmed;
        })
        .filter((line) => line !== "");
}

export default function Show({ product, relatedProducts = [] }) {
    const [quantity, setQuantity] = useState(1);
    const isCustom = product.is_customizable;
    const isReadyStock = !isCustom;
    const stock = product.stock ?? 0;
    const hasStock = isReadyStock && stock > 0;

    const descriptionLines = formatTextWithBullet(product.description || "");
    const usageLines = formatTextWithBullet(product.usage_instructions || "");
    const warrantyLines = formatTextWithBullet(product.warranty || "");

    const handleAddToCart = () => {
        router.post("/cart", { product_id: product.id, quantity }, { preserveScroll: true });
    };

    const handleQuantityChange = (newQty) => {
        const maxStock = stock;
        if (newQty >= 1 && newQty <= maxStock) {
            setQuantity(newQty);
        } else if (newQty < 1) {
            setQuantity(1);
        } else if (newQty > maxStock) {
            setQuantity(maxStock);
        }
    };

    return (
        <PublicLayout
            chatbotContext="product_detail"
            chatbotPayload={{ product }}
            hideChatbot={false}
        >
            <Head title={product.name} />

            <main className="bg-[#F8F9FA] min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                        <Link
                            href="/"
                            className="hover:text-[#F59E0B] transition"
                        >
                            Home
                        </Link>
                        <span>›</span>
                        <Link
                            href="/catalog"
                            className="hover:text-[#F59E0B] transition"
                        >
                            Product
                        </Link>
                        <span>›</span>
                        <span className="text-[#1E293B]">{product.name}</span>
                    </div>

                    <div className="grid lg:grid-cols-[420px_minmax(0,1fr)] gap-6">
                        {/* ── Kiri: Gambar Product (Sticky) ────────────────────────────── */}
                        <div className="lg:sticky lg:top-20 lg:h-fit">
                            <div className="h-[300px] md:h-[420px] w-full lg:w-[420px] bg-slate-50 overflow-hidden flex items-start justify-start">
                                <ProductImage
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-contain object-top rounded-2xl"
                                />
                            </div>
                        </div>

                        {/* ── Kanan: Deskripsi Product ─────────────────────────── */}
                        <div className="bg-white rounded-[2rem] border border-[#1E293B]/10 shadow-sm overflow-hidden p-6">
                            {/* Status */}
                            <span
                                className={`inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 ${
                                    isCustom
                                        ? "bg-[#1E293B] text-[#F59E0B]"
                                        : "bg-[#F59E0B] text-[#1E293B]"
                                }`}
                            >
                                {isCustom ? "Custom Build" : "Ready Stock"}
                            </span>

                            {/* Kategori */}
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-2">
                                {product.category}
                            </p>

                            {/* Nama Produk */}
                            <h1 className="text-xl lg:text-2xl font-black italic uppercase tracking-tighter text-[#1E293B] leading-none mb-6">
                                {product.name}
                            </h1>

                            {/* Harga */}
                            <div className="mb-6 pb-6 border-b border-slate-100">
                                <SectionTitle>Harga</SectionTitle>
                                <p className="text-xl font-black text-[#1E293B]">
                                    {isCustom
                                        ? "Hubungi Kami"
                                        : `Rp ${formatPrice(product.price)}`}
                                </p>
                                {!isCustom && (
                                    <p className="text-sm text-slate-400 mt-1">
                                        Harga sudah termasuk PPN, belum
                                        termasuk ongkos kirim
                                    </p>
                                )}
                                {isReadyStock && (
                                    <p
                                        className={`text-xs mt-2 ${hasStock ? "text-green-600" : "text-red-500"}`}
                                    >
                                        {hasStock
                                            ? `Stok tersedia: ${stock} unit`
                                            : "Stok Habis"}
                                    </p>
                                )}
                            </div>

                            {/* Deskripsi Produk */}
                            <div className="mb-6">
                                <SectionTitle>Deskripsi Produk</SectionTitle>
                                <div className="text-slate-600 text-sm leading-relaxed space-y-2">
                                    {descriptionLines.map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Spesifikasi */}
                            <div className="mb-6">
                                <SectionTitle>Spesifikasi</SectionTitle>
                                <div className="bg-[#F8F9FA] rounded-xl p-5">
                                    <p className="text-sm text-[#1E293B] whitespace-pre-line">
                                        {product.specifications || "-"}
                                    </p>
                                </div>
                                {product.weight > 0 && (
                                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                                            <path d="M10 2C7.79 2 6 3.79 6 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 5c-3.31 0-6 1.57-6 3.5v.5h12v-.5c0-1.93-2.69-3.5-6-3.5z"/>
                                        </svg>
                                        <span className="font-semibold">Berat:</span> {product.weight} kg
                                    </div>
                                )}
                            </div>

                            {/* Cara Penggunaan */}
                            <div className="mb-6">
                                <SectionTitle>Cara Penggunaan</SectionTitle>
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                    <div className="text-slate-600 text-sm leading-relaxed space-y-1">
                                        {usageLines.length > 0 ? (
                                            usageLines.map((line, i) => (
                                                <p key={`usage-${i}`}>{line}</p>
                                            ))
                                        ) : (
                                            <p>
                                                Hubungi kami untuk informasi
                                                Cara Penggunaan.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Garansi */}
                            <div className="mb-6">
                                <SectionTitle>Garansi</SectionTitle>
                                <div className="text-slate-600 text-sm leading-relaxed space-y-1">
                                    {warrantyLines.length > 0 ? (
                                        warrantyLines.map((line, i) => (
                                            <p key={`warranty-${i}`}>{line}</p>
                                        ))
                                    ) : (
                                        <p>
                                            Hubungi kami untuk informasi
                                            Garansi.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Jumlah (Ready Stock saja) */}
                            {isReadyStock && hasStock && (
                                <div className="mb-6">
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                        Jumlah
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    quantity - 1,
                                                )
                                            }
                                            className="w-10 h-10 rounded-xl bg-[#F8F9FA] text-[#1E293B] font-black text-lg hover:bg-[#F59E0B]/20 transition"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    parseInt(e.target.value) ||
                                                        1,
                                                )
                                            }
                                            min={1}
                                            max={stock}
                                            className="w-20 h-10 text-center rounded-xl border border-slate-200 font-black text-sm focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    quantity + 1,
                                                )
                                            }
                                            className="w-10 h-10 rounded-xl bg-[#F8F9FA] text-[#1E293B] font-black text-lg hover:bg-[#F59E0B]/20 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="mt-auto space-y-3">
                                {isCustom ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Link
                                    href={`/custom-order/create?product_id=${product.id}`}
                                    className="px-6 py-4 rounded-xl font-black uppercase tracking-wider text-sm text-center bg-[#F59E0B] text-[#1E293B] shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition"
                                >
                                    Pesan Custom
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => router.visit(`/cart/checkout?product_id=${product.id}&quantity=${quantity}`)}
                                    className="px-6 py-4 rounded-xl font-black uppercase tracking-wider text-sm text-center bg-[#1E293B] text-white shadow-lg shadow-[#1E293B]/20 hover:bg-[#1E293B]/90 transition"
                                >
                                    Beli Ready Stock
                                </button>
                                    </div>
                                ) : hasStock ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            className="px-6 py-4 rounded-xl font-black uppercase tracking-wider text-sm text-center bg-[#1E293B] text-white shadow-lg shadow-[#1E293B]/20 hover:bg-[#1E293B]/90 transition"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path d="M3.75 3.75a.75.75 0 000 1.5h1.2l.92 4.14a2.25 2.25 0 002.18 1.86h5.52a2.25 2.25 0 002.07-1.37l1.53-3.65a.75.75 0 00-.68-1.06H7.16l-.32-1.45a.75.75 0 00-.73-.59H3.75zM8.5 15.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                                </svg>
                                                Keranjang
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.visit(`/cart/checkout?product_id=${product.id}&quantity=${quantity}`)}
                                            className="px-6 py-4 rounded-xl font-black uppercase tracking-wider text-sm text-center bg-[#F59E0B] text-[#1E293B] shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition"
                                        >
                                            Beli
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full px-6 py-4 rounded-xl font-black uppercase tracking-wider text-sm text-center bg-slate-200 text-slate-400 cursor-not-allowed">
                                        Stok Habis
                                    </div>
                                )}
                                <Link
                                    href="/catalog"
                                    className="block w-full px-6 py-4 rounded-xl font-black uppercase tracking-wider text-sm text-center border-2 border-slate-200 text-[#1E293B] hover:border-[#1E293B] hover:bg-slate-50 transition"
                                >
                                    ← Kembali ke Katalog
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
