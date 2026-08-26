const ADDRESS = "Jl. Jatinegara Kaum No.17A, RT.6/RW.3, Jatinegara Kaum, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13250";
const PHONE_1 = "6281399096871";
const PHONE_2 = "6285885739462";

export default function AboutContact() {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                            Lokasi
                        </p>
                        <h2 className="text-3xl font-black text-[#1E293B]">
                            Kunjungi Kami
                        </h2>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-[#1E293B] rounded-3xl overflow-hidden shadow-xl min-h-[300px]">
                            <img
                                src="/images/about/office.png"
                                alt="Kantor Multikon"
                                className="w-full h-full min-h-[300px] object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.classList.add(
                                        "flex",
                                        "items-center",
                                        "justify-center",
                                        "p-8"
                                    );
                                    e.target.parentElement.innerHTML = `
                                        <div class="text-center">
                                            <span class="text-5xl">🏢</span>
                                            <p class="text-slate-400 text-sm mt-4">Foto perusahaan belum tersedia</p>
                                        </div>
                                    `;
                                }}
                            />
                        </div>

                        <div className="bg-[#F8F9FA] rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-full min-h-[300px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.230897228423!2d106.90063873836928!3d-6.202650131936295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4b04e5aa847%3A0xa3abcbcc267c91ca!2sCV.Multikon%20Erindotama!5e0!3m2!1sid!2sid!4v1778768755722!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Multikon"
                                className="w-full h-full min-h-[300px]"
                            />
                        </div>
                    </div>

                    <div className="bg-[#1E293B] rounded-3xl p-8 md:p-10 shadow-xl">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[#F59E0B]">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#F59E0B] mb-1.5">
                                        Alamat Kantor
                                    </p>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {ADDRESS}
                                    </p>
                                </div>
                            </div>
                            <div className="h-px bg-white/10" />
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[#F59E0B]">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#F59E0B] mb-1.5">
                                        WhatsApp
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        <a
                                            href={`https://wa.me/${PHONE_1}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white font-bold text-sm hover:text-[#F59E0B] transition w-fit"
                                        >
                                            0813-9909-6871
                                        </a>
                                        <a
                                            href={`https://wa.me/${PHONE_2}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white font-bold text-sm hover:text-[#F59E0B] transition w-fit"
                                        >
                                            0858-8573-9462
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
