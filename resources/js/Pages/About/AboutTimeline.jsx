export default function AboutTimeline() {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                        Perjalanan
                    </p>
                    <h2 className="text-3xl font-black text-[#1E293B]">
                        Sejarah Singkat
                    </h2>
                </div>

                <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#F59E0B]/20 hidden md:block" />

                    <div className="space-y-8 md:space-y-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8 relative">
                            <div className="md:text-right md:pr-12">
                                <div className="bg-[#F8F9FA] rounded-2xl p-6 shadow-lg border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] mb-2">
                                        Awal Mula
                                    </p>
                                    <h3 className="text-lg font-black text-[#1E293B] mb-2">
                                        Tahun 1990
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed text-justify">
                                        Perusahaan ini pertama kali didirikan pada tahun 1990 di wilayah Jakarta Timur. Pada awal masa berdirinya, perusahaan ini menggunakan nama CV Erindo Tama. Fokus bisnis utamanya saat itu adalah menyuplai kebutuhan hotel equipment (peralatan hotel), baik untuk hotel-hotel di area Jakarta maupun luar daerah.
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:block relative">
                                <div className="absolute left-[-8px] top-1/2 w-4 h-4 bg-[#F59E0B] rounded-full border-4 border-white shadow-lg transform -translate-y-1/2" />
                            </div>
                        </div>

                        <div className="md:grid md:grid-cols-2 md:gap-8 relative md:mt-8">
                            <div className="hidden md:block relative">
                                <div className="absolute right-[-8px] top-1/2 w-4 h-4 bg-[#F59E0B] rounded-full border-4 border-white shadow-lg transform -translate-y-1/2" />
                            </div>
                            <div className="md:pl-12">
                                <div className="bg-[#1E293B] rounded-2xl p-6 shadow-xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] mb-2">
                                        Transformasi
                                    </p>
                                    <h3 className="text-lg font-black text-white mb-2">
                                        Tahun 2000-an hingga kini
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed text-justify">
                                        Seiring dengan perkembangan bisnis serta meningkatnya keberagaman kebutuhan pelanggan, perusahaan melakukan langkah strategis untuk memperluas portofolio layanan. Kini, kami telah berekspansi menjadi Supplier untuk Kitchen Equipment, Glass Work, Metal Work, dan Stainless Steel Custom Fabrication guna memenuhi kebutuhan industri bakery, hotel, restoran, dan residensial (rumahan).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
