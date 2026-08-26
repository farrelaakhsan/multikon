const SERVICES = [
    { num: "01", title: "Suplai Kitchen Equipment", desc: "Menyediakan lini perangkat memasak komersial standar internasional untuk kebutuhan dapur profesional." },
    { num: "02", title: "Fabrikasi Custom Stainless Steel", desc: "Pembuatan meja kerja, kabinet, sink, dan rak stainless steel yang disesuaikan dengan denah ruangan klien." },
];

export default function ServicesSection({ onChatOpen }) {
    return (
        <section className="bg-[#F8F9FA] py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                            Layanan
                        </p>
                        <h2 className="text-3xl font-black text-[#1E293B]">
                            Apa yang Kami Tawarkan
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onChatOpen}
                        className="shrink-0 bg-[#F59E0B] text-[#1E293B] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-wider hover:brightness-110 transition w-fit"
                    >
                        Konsultasi Product Custom
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    {SERVICES.map((s) => (
                        <div
                            key={s.num}
                            className="bg-[#1E293B] rounded-3xl p-8 md:p-10 group hover:ring-1 hover:ring-[#F59E0B]/40 transition-all relative overflow-hidden"
                        >
                            <p className="absolute top-6 right-8 text-7xl font-black text-white/5 select-none leading-none">
                                {s.num}
                            </p>
                            <div className="w-8 h-1 bg-[#F59E0B] rounded-full mb-6" />
                            <h3 className="text-lg font-black text-white mb-3">{s.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
