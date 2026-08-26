import { Link } from "@inertiajs/react";
import ProductImage from "../../Components/ui/ProductImage";

export default function FeaturedProducts({ products = [] }) {
    return (
        <section className="bg-[#F8F9FA] py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                            Our Products
                        </p>
                        <h2 className="text-3xl font-black text-[#1E293B]">
                            Produk Unggulan
                        </h2>
                    </div>
                    <Link
                        href="/catalog"
                        className="shrink-0 bg-[#1E293B] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-[#F59E0B] hover:text-[#1E293B] transition w-fit"
                    >
                        Lihat Semua →
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="bg-[#1E293B] rounded-3xl py-20 text-center">
                        <p className="text-4xl mb-4">🍳</p>
                        <p className="text-sm font-bold text-slate-500">Produk segera hadir.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.slice(0, 3).map((product) => (
                            <Link
                                key={product.id}
                                href={`/catalog/${product.id}`}
                                className="group bg-[#1E293B] rounded-2xl overflow-hidden hover:ring-1 hover:ring-[#F59E0B]/50 transition-all"
                            >
                                <div className="overflow-hidden relative">
                                    <ProductImage
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                                    />
                                    <span className="absolute top-3 left-3 bg-[#F59E0B] text-[#1E293B] text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                        {product.is_customizable ? "Custom" : "Ready Stock"}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#F59E0B] mb-2">
                                        {product.category}
                                    </p>
                                    <h3 className="font-bold text-white text-sm leading-snug group-hover:text-[#F59E0B] transition">
                                        {product.name}
                                    </h3>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-600 mt-3 group-hover:text-[#F59E0B]/60 transition">
                                        Lihat Detail →
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
