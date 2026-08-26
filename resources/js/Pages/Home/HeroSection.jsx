import { Link } from "@inertiajs/react";

const STATS = [{ value: "10+", label: "Tahun Pengalaman" }];
const ADMIN_WA = "6281399096871";

export default function HeroSection() {
    return (
        <section className="bg-[#F8F9FA] py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-[#1E293B] rounded-3xl overflow-hidden relative">
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage: `radial-gradient(circle, #F59E0B 1px, transparent 1px)`,
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B] opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                    <div className="relative grid lg:grid-cols-2 gap-0 items-stretch">
                        <div className="p-10 md:p-14 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full w-fit mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                Kitchen Equipment Specialist
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-black text-white leading-[1.1] tracking-tight mb-5">
                                Penyedia Utama{" "}
                                <span className="relative inline-block">
                                    <span className="text-[#F59E0B]">Kitchen Equipment</span>
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#F59E0B]/40 rounded-full" />
                                </span>{" "}
                                Komersial & Stainless Steel
                            </h1>

                            <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-md">
                                Suplai peralatan dapur profesional untuk hotel, restoran, dan kafe dengan kualitas terbaik dan pengerjaan yang rapi.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/catalog"
                                    className="bg-[#F59E0B] text-[#1E293B] px-7 py-3.5 rounded-full text-[10px] font-black uppercase tracking-wider hover:brightness-110 transition shadow-lg shadow-amber-900/20"
                                >
                                    Lihat Produk →
                                </Link>
                                <a
                                    href={`https://wa.me/${ADMIN_WA}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-white/20 text-white px-7 py-3.5 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-white/10 transition"
                                >
                                    Hubungi Kami
                                </a>
                            </div>

                            <div className="flex gap-8 mt-10 pt-10 border-t border-white/10">
                                {STATS.map((s) => (
                                    <div key={s.label}>
                                        <p className="text-xl font-black text-[#F59E0B]">{s.value}</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:block relative min-h-[480px]">
                            <img
                                src="/images/hero/herosection.webp"
                                alt="Kitchen Equipment"
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ filter: "brightness(0.5) saturate(0.8)" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1E293B] via-[#1E293B]/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
