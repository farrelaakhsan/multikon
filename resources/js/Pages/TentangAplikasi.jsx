import { Head } from "@inertiajs/react";
import PublicLayout from "../Layouts/PublicLayout";

const AUTHOR_PHOTO = "/storage/author/fotoprofil.png";
const AUTHOR = {
    name: "Farrel Akmal Akhsanudin",
    initials: "F",
};

const TECH_GROUPS = [
    {
        id: "frontend",
        label: "Frontend",
        items: [
            { index: "T01", name: "React 19", detail: "Komponen UI fungsional & hooks" },
            { index: "T02", name: "Inertia.js", detail: "Jembatan Laravel–React tanpa REST API" },
            { index: "T03", name: "Tailwind CSS", detail: "Styling utilitas yang konsisten" },
            { index: "T04", name: "Vite", detail: "Build tool & dev server" },
            { index: "T05", name: "Lucide", detail: "Set ikon UI ringan" },
            { index: "T06", name: "Axios", detail: "HTTP client untuk chatbot" },
        ],
    },
    {
        id: "backend",
        label: "Backend & Data",
        items: [
            { index: "T07", name: "Laravel 13", detail: "Framework aplikasi utama" },
            { index: "T08", name: "PHP 8.3", detail: "Bahasa runtime server" },
            { index: "T09", name: "MySQL", detail: "Database relasional utama" },
            { index: "T10", name: "Laravel Breeze", detail: "Fondasi autentikasi" },
            { index: "T11", name: "DomPDF", detail: "Generate CI, Faktur Pajak & Surat Jalan" },
        ],
    },
    {
        id: "integration",
        label: "Integrasi & Layanan",
        items: [
            { index: "T12", name: "RajaOngkir", detail: "Perhitungan ongkir cargo/logistik" },
            { index: "T13", name: "AI Assistant", detail: "Chatbot bantuan kontekstual" },
        ],
    },
];

export default function TentangAplikasi() {
    return (
        <PublicLayout>
            <Head title="Tentang Aplikasi" />

            <section className="bg-[#F8F9FA]">
                <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-900 px-6 py-8 lg:px-10 lg:py-9 flex items-center gap-6 relative overflow-hidden">
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute -right-10 -top-10 w-44 h-44 bg-amber-400/10 rounded-full blur-3xl" />
                                <div className="absolute inset-y-0 right-0 w-[48%] opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, white 0 1px, transparent 1px 14px)" }} />
                                <div className="absolute bottom-0 right-8 w-28 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                                <div className="absolute bottom-5 right-6 lg:right-10 hidden sm:block font-mono text-[10px] tracking-[0.4em] text-white/10 uppercase">MULTIKON — 2026</div>
                            </div>
                            {AUTHOR_PHOTO ? (
                                <img
                                    src={AUTHOR_PHOTO}
                                    alt={AUTHOR.name}
                                    className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover shrink-0 ring-2 ring-white/10"
                                />
                            ) : (
                                <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-[0_8px_24px_rgba(245,158,11,0.35)] ring-2 ring-white/10 shrink-0">
                                    <span className="text-[#1E293B] font-black italic text-2xl lg:text-3xl tracking-tighter">
                                        {AUTHOR.initials}
                                    </span>
                                </div>
                            )}
                            <div className="relative min-w-0">
                                <p className="font-mono text-xs tracking-[0.3em] text-amber-400 uppercase">
                                    Penulis · DEV-2026
                                </p>
                                <h2 className="mt-1 font-black italic uppercase tracking-tight text-xl sm:text-2xl lg:text-3xl text-white leading-tight pr-3">
                                    {AUTHOR.name}
                                </h2>
                                <div className="mt-3 h-1 w-10 rounded-full bg-amber-400" />
                            </div>
                        </div>

                        <div className="px-6 py-10 lg:px-8 lg:py-10">
                            <h3 className="font-black italic uppercase tracking-tighter text-xl sm:text-2xl text-[#1E293B]">
                                Teknologi di balik aplikasi
                            </h3>

                            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                                {TECH_GROUPS.map((group) => (
                                    <div
                                        key={group.id}
                                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                                    >
                                        <div className="border-b border-slate-200 bg-slate-900 px-5 py-3">
                                            <h4 className="font-mono text-[11px] tracking-[0.25em] text-amber-400 uppercase">
                                                {group.label}
                                            </h4>
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            {group.items.map((tech) => (
                                                <div key={tech.index} className="px-5 py-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-[#1E293B] text-sm">
                                                                {tech.name}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-0.5">
                                                                {tech.detail}
                                                            </p>
                                                        </div>
                                                        <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                                            {tech.index}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
