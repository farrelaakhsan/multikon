import { Head, Link, router } from "@inertiajs/react";
import PublicLayout from "../Layouts/PublicLayout";
import ProductImage from "../Components/ui/ProductImage";
import Pagination from "../Components/ui/Pagination";
import { formatPrice } from "../utils/format";

export default function Catalog({ products, activeFilter = "all", activeSort = "default", search = "" }) {
    const items = products?.data || [];
    const links = products?.links || [];

    const filters = [
        { key: "all", label: "Semua" },
        { key: "ready", label: "Ready Stock" },
        { key: "custom", label: "Product Custom" },
    ];

    const sortOptions = [
        { key: "default", label: "Default" },
        { key: "latest", label: "Terbaru" },
    ];

    const isActive = (key) => activeFilter === key;

    const handleSortChange = (e) => {
        const params = new URLSearchParams(window.location.search);
        const value = e.target.value;
        if (value === "default") {
            params.delete("sort");
        } else {
            params.set("sort", value);
        }
        const qs = params.toString();
        window.location.href = qs ? `/catalog?${qs}` : "/catalog";
    };

    const filterHref = (key) => {
        const params = new URLSearchParams();
        if (key !== "all") params.set("type", key);
        if (activeSort !== "default") params.set("sort", activeSort);
        if (search) params.set("search", search);
        const qs = params.toString();
        return qs ? `/catalog?${qs}` : "/catalog";
    };

    const clearSearchHref = () => {
        const params = new URLSearchParams();
        if (activeFilter !== "all") params.set("type", activeFilter);
        if (activeSort !== "default") params.set("sort", activeSort);
        const qs = params.toString();
        return qs ? `/catalog?${qs}` : "/catalog";
    };

    return (
        <PublicLayout chatbotContext="catalog" chatbotPayload={{}} hideChatbot={false}>
            <Head title="Product" />

            {/* ── Filter Bar ────────────────────────────────────── */}
            <div className="bg-[#F8F9FA] border-b border-slate-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {products?.total ?? items.length} Produk
                        </p>
                        {search && (
                            <span className="text-[10px] text-slate-400">
                                hasil pencarian "<span className="text-[#1E293B] font-bold">{search}</span>"
                                <Link href={clearSearchHref()} className="ml-1.5 text-slate-400 hover:text-red-500 transition">
                                    ✕
                                </Link>
                            </span>
                        )}
                        <select
                            value={activeSort}
                            onChange={handleSortChange}
                            className="text-[10px] font-black uppercase tracking-[0.15em] bg-white border border-slate-200 rounded-full px-3 py-1.5 text-slate-500 outline-none cursor-pointer hover:border-[#1E293B] hover:text-[#1E293B] transition"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.key} value={opt.key}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        {filters.map((f) => (
                            <Link
                                key={f.key}
                                href={filterHref(f.key)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition border ${
                                    isActive(f.key)
                                        ? "bg-[#1E293B] text-white border-[#1E293B]"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-[#1E293B] hover:text-[#1E293B]"
                                }`}
                            >
                                {f.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Product Grid ──────────────────────────────────── */}
            <main className="bg-[#F8F9FA] min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {items.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-4xl mb-4">📦</p>
                            <h2 className="text-lg font-black uppercase tracking-tight text-slate-400 mb-2">
                                Produk Tidak Ditemukan
                            </h2>
                            <p className="text-slate-400 text-xs mb-6">
                                {search ? `Pencarian "${search}" tidak ditemukan.` : "Coba filter yang berbeda."}
                            </p>
                            <Link
                                href={search ? clearSearchHref() : "/catalog"}
                                className="inline-block text-[10px] font-black uppercase tracking-widest text-[#F59E0B] hover:underline transition"
                            >
                                {search ? "Tampilkan Semua →" : "Tampilkan Semua →"}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {items.map((product) => {
                                const isOutOfStock = !product.is_customizable && (product.stock ?? 0) <= 0;
                                return (
                                <div key={product.id} className="relative">
                                <article
                                    className={`h-full bg-white rounded-2xl overflow-hidden border border-[#1E293B]/20 shadow-sm hover:border-[#F59E0B]/40 hover:shadow-lg transition-all group flex flex-col ${isOutOfStock ? 'opacity-60' : ''}`}
                                >
                                    {/* Image */}
                                    <div className="relative overflow-hidden">
                                        <Link href={`/catalog/${product.id}`}>
                                            <ProductImage
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-44 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>
                                        {/* Badge */}
                                        <span
                                            className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                product.is_customizable
                                                    ? "bg-[#1E293B] text-[#F59E0B]"
                                                    : "bg-[#F59E0B] text-[#1E293B]"
                                            }`}
                                        >
                                            {product.is_customizable
                                                ? "Custom"
                                                : "Ready"}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-1">
                                            {product.category}
                                        </p>
                                        <Link href={`/catalog/${product.id}`}>
                                            <h3 className="font-bold text-[#1E293B] text-sm leading-snug mb-2 group-hover:text-[#F59E0B] transition line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        {/* Price + CTA */}
                                        <div className="mt-auto">
                                            {!product.is_customizable && (
                                                <p className="text-[#1E293B] font-black text-base tracking-tight mb-2">
                                                    Rp {formatPrice(product.price)}
                                                </p>
                                            )}

                                            <div className="flex gap-2">
                                                {product.is_customizable ? (
                                                    <>
                                                        <Link
                                                            href={`/custom-order/create?product_id=${product.id}`}
                                                            className="flex-1 text-center bg-[#F59E0B] text-[#1E293B] text-[10px] py-3 rounded-lg font-black uppercase tracking-wider hover:brightness-105 transition"
                                                        >
                                                            Pesan
                                                        </Link>
                                                        <Link
                                                            href={`/catalog/${product.id}`}
                                                            className="flex-1 text-center border border-slate-200 text-slate-500 text-[10px] py-3 rounded-lg font-black uppercase tracking-wider hover:border-[#1E293B] hover:text-[#1E293B] transition"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                <button
                                                    type="button"
                                                    disabled={isOutOfStock}
                                                    onClick={() => router.visit(`/cart/checkout?product_id=${product.id}&quantity=1`)}
                                                    className={`flex-1 text-center text-[10px] py-3 rounded-lg font-black uppercase tracking-wider transition ${
                                                        isOutOfStock
                                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                            : 'bg-[#F59E0B] text-[#1E293B] hover:brightness-105'
                                                    }`}
                                                >
                                                    Beli
                                                </button>
                                                        <Link
                                                            href={`/catalog/${product.id}`}
                                                            className="flex-1 text-center border border-slate-200 text-slate-500 text-[10px] py-3 rounded-lg font-black uppercase tracking-wider hover:border-[#1E293B] hover:text-[#1E293B] transition"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                                {isOutOfStock && (
                                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500 text-white z-10">
                                        Stok Habis
                                    </span>
                                )}
                                </div>
                                );
                            })}
                        </div>
                    )}

                    {links.length > 0 && (
                        <div className="mt-8">
                            <Pagination links={links} />
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}
