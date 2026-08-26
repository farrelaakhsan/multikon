export default function FaqCtaSection() {
    return (
        <section className="bg-[#F8F9FA] py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-[#1E293B] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl text-center">
                    <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage: `radial-gradient(circle, #F59E0B 1px, transparent 1px)`,
                            backgroundSize: "20px 20px",
                        }}
                    />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#F59E0B] opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#F59E0B] opacity-10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                    <div className="relative">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                            Masih Ada Pertanyaan?
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8">
                            Tim Multikon siap membantu Anda. Hubungi kami melalui WhatsApp atau
                            kunjungi halaman Contact untuk informasi lebih lanjut.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="https://wa.me/6281399096871"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E293B] font-black text-sm uppercase tracking-[0.1em] px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Hubungi WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
