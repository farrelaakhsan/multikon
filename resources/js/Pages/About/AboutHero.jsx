const PROFILE_TEXT = `CV Multikon Erindotama adalah perusahaan yang bergerak di bidang pengadaan dan penyediaan peralatan dapur profesional (Commercial Kitchen Equipment). Berawal dari komitmen untuk mendukung pertumbuhan industri kuliner dan hospitality, kami hadir sebagai mitra terpercaya bagi para pelaku usaha, mulai dari UMKM, restoran, hingga perhotelan.

Kami memahami bahwa dapur adalah jantung dari setiap bisnis kuliner. Oleh karena itu, kami menyediakan berbagai produkunggulan dengan standar kualitas tinggi yang dirancang untuk meningkatkan efisiensi, produktivitas, dan estetika operasional dapur Anda.`;

export default function AboutHero() {
    return (
        <section className="bg-[#F8F9FA] py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-[#1E293B] rounded-3xl overflow-hidden relative shadow-2xl">
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage: `radial-gradient(circle, #F59E0B 1px, transparent 1px)`,
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#F59E0B] opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F59E0B] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

                    <div className="relative p-6 md:p-8 lg:p-10">
                        <div className="inline-flex items-center gap-2 border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full w-fit mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                            Profil Perusahaan
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.1] tracking-tight mb-4 max-w-3xl">
                            Siapa{" "}
                            <span className="relative inline-block">
                                <span className="text-[#F59E0B]">Kami?</span>
                                <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#F59E0B]/40 rounded-full" />
                            </span>
                        </h1>

                        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl text-justify">
                            {PROFILE_TEXT}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
