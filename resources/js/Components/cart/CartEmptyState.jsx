import { Link } from "@inertiajs/react";

export default function CartEmptyState() {
    return (
        <div className="bg-white rounded-3xl border border-[#1E293B]/10 shadow-sm p-16 md:p-24 text-center">
            <div className="w-28 h-28 rounded-full bg-[#F8F9FA] flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14 text-slate-300">
                    <path d="M3.75 4.5h16.5l-1.5 12H5.25l-1.5-12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-tight text-[#1E293B] mb-3">
                Keranjang Kosong
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Belum ada produk yang ditambahkan. Jelajahi katalog kami untuk menemukan stainless steel kitchen equipment yang Anda butuhkan.
            </p>
            <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#1E293B] px-8 py-4 rounded-xl font-black uppercase tracking-wider text-sm shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition"
            >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Lihat Katalog
            </Link>
        </div>
    );
}
