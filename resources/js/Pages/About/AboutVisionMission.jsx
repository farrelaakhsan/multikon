const VISION = "Menjadi perusahaan kitchen equipment dan custom stainless steel terpercaya di Indonesia.";

const MISSIONS = [
    "Menyediakan produk berkualitas untuk kebutuhan kitchen komersial.",
    "Memberikan layanan custom sesuai kebutuhan customer.",
    "Menjaga kualitas pengerjaan dan ketepatan waktu.",
    "Mengutamakan kepuasan dan kepercayaan customer.",
];

export default function AboutVisionMission() {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                            Tujuan
                        </p>
                        <h2 className="text-3xl font-black text-[#1E293B]">
                            Visi & Misi
                        </h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-[#F8F9FA] rounded-3xl p-8 md:p-10 shadow-lg border-2 border-[#F59E0B]/20 relative overflow-hidden">
                        <p className="absolute top-6 right-8 text-7xl font-black text-[#F59E0B]/10 select-none leading-none">
                            V
                        </p>
                        <div className="w-10 h-1 bg-[#F59E0B] rounded-full mb-6" />
                        <h3 className="text-xl font-black text-[#1E293B] mb-4">
                            Visi
                        </h3>
                        <p className="text-slate-600 text-base leading-relaxed">
                            {VISION}
                        </p>
                    </div>

                    <div className="bg-[#1E293B] rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
                        <p className="absolute top-6 right-8 text-7xl font-black text-white/5 select-none leading-none">
                            M
                        </p>
                        <div className="w-10 h-1 bg-[#F59E0B] rounded-full mb-6" />
                        <h3 className="text-xl font-black text-white mb-4">
                            Misi
                        </h3>
                        <ul className="space-y-4">
                            {MISSIONS.map((mission, index) => (
                                <li key={index} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                                    <span className="text-[#F59E0B] text-lg">✓</span>
                                    {mission}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
