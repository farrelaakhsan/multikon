import { Link } from "@inertiajs/react";

const ADVANTAGES = [
    { icon: "🏨", label: "Berpengalaman di industri Horeka", sub: "Hotel, Restoran, Kafe" },
    { icon: "⚙️", label: "Material Stainless Berkualitas", sub: "Grade 304 & 316" },
    { icon: "✂️", label: "Menerima Product Custom", sub: "Sesuai kebutuhan & denah" },
    { icon: "✅", label: "Kualitas & Kerapihan Terjamin", sub: "Standar komersial internasional" },
];

export default function AboutSection() {
    return (
        <section className="bg-[#F8F9FA] py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-5 gap-10 items-start">
                    <div className="lg:col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-4">
                            Tentang Kami
                        </p>
                        <h2 className="text-3xl font-black text-[#1E293B] leading-tight">
                            Solusi Lengkap Dapur Komersial
                        </h2>
                        <div className="w-10 h-1 bg-[#F59E0B] rounded-full mt-4 mb-6" />
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#1E293B] border-b border-[#F59E0B] pb-1 hover:text-[#F59E0B] transition"
                        >
                            Pelajari Lebih Lanjut →
                        </Link>
                    </div>

                    <div className="lg:col-span-3 space-y-5">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            CV. Multikon Erindotama merupakan perusahaan yang bergerak di bidang kitchen equipment komersial dan custom stainless steel fabrication.
                        </p>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Perusahaan berkembang dari CV. Erindo Tama dan fokus pada kebutuhan dapur profesional untuk hotel, restoran, cafe, dan bakery.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                            {ADVANTAGES.map((adv) => (
                                <div
                                    key={adv.label}
                                    className="bg-[#1E293B] rounded-2xl p-5 group hover:ring-1 hover:ring-[#F59E0B]/50 transition-all"
                                >
                                    <div className="text-xl mb-3">{adv.icon}</div>
                                    <p className="text-white text-xs font-bold leading-snug mb-1">{adv.label}</p>
                                    <p className="text-slate-500 text-[10px]">{adv.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
