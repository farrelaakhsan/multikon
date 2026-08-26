const CLIENTS = [
    { name: "Client 1", image: "/images/clients/client-1.jpg" },
    { name: "Client 2", image: "/images/clients/client-2.webp" },
    { name: "Client 3", image: "/images/clients/client-3.png" },
    { name: "Client 4", image: "/images/clients/client-4.png" },
    { name: "Client 5", image: "/images/clients/client-5.png" },
];

export default function ClientLogos() {
    return (
        <section className="bg-[#F8F9FA] py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-[#1E293B] rounded-3xl overflow-hidden relative">
                    <div
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle, #F59E0B 1px, transparent 1px)`,
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B] opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                    <div className="relative px-5 md:px-10 py-8 md:py-12">
                        <div className="text-center mb-6">
                            <p className="text-[14px] font-black uppercase tracking-[0.3em] text-[#F59E0B]">
                                Klien Kami
                            </p>
                            <div className="w-10 h-1 bg-[#F59E0B] rounded-full mx-auto mt-3" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                            {CLIENTS.map((client) => (
                                <div
                                    key={client.name}
                                    className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex items-center justify-center grayscale hover:grayscale-0 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-default"
                                >
                                    <img
                                        src={client.image}
                                        alt={client.name}
                                        className="h-10 md:h-12 w-auto max-w-full opacity-50 group-hover:opacity-100 transition"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
