import { Head, Link } from "@inertiajs/react";
import PublicLayout from "../Layouts/PublicLayout";

const STEPS = [
    {
        number: 1,
        title: "Masuk atau Daftar",
        items: [
            "Pelanggan perlu masuk ke akun Multikon terlebih dahulu.",
            "Apabila belum memiliki akun, silakan melakukan pendaftaran melalui halaman Daftar.",
            "Pastikan alamat email, nomor telepon, dan alamat yang digunakan aktif dan benar.",
            "Dengan mendaftar, pelanggan menyetujui Syarat dan Ketentuan serta Kebijakan Privasi Multikon.",
        ],
    },
    {
        number: 2,
        title: "Pilih Produk",
        items: [
            "Cari produk melalui pencarian atau halaman Catalog.",
            "Buka detail produk untuk melihat foto, deskripsi, spesifikasi, dan ketersediaan stok.",
            { text: "Klik ikon keranjang untuk memasukkan produk ke Keranjang.", badge: "Ready Stock" },
            { text: "Klik \"Konsultasi Product Custom\" untuk berkonsultasi melalui chat, atau isi langsung formulir pemesanan custom dengan menyertakan spesifikasi teknis dan file referensi.", badge: "Custom" },
        ],
    },
    {
        number: 3,
        title: "Periksa Keranjang",
        items: [
            "Buka Keranjang melalui ikon keranjang di pojok kanan atas.",
            "Periksa nama produk, jumlah barang, subtotal, dan catatan lain apabila tersedia.",
            "Untuk mengubah jumlah barang, gunakan tombol +/-. Centang checkbox barang yang akan dibeli.",
            "Klik \"Check Out\" apabila sudah sesuai.",
        ],
    },
    {
        number: 4,
        title: "Lengkapi Data Pengiriman",
        items: [
            "Pastikan nomor WhatsApp aktif dan alamat penerima sudah benar.",
            "Pilih metode pengiriman yang tersedia:",
            { text: "Barang diantar oleh kurir. Pilih kecamatan tujuan untuk melihat daftar kurir dan tarif ongkos kirim.", badge: "Cargo" },
            { text: "Barang dapat diambil langsung di workshop Multikon.", badge: "Pickup" },
        ],
    },
    {
        number: 5,
        title: "Pilih Pembayaran",
        items: [
            "Pilih metode pembayaran yang tersedia: Transfer Bank (BCA, BRI, Mandiri) atau QRIS.",
            "Biaya transaksi akan ditampilkan sebelum pesanan dikonfirmasi.",
        ],
    },
    {
        number: 6,
        title: "Konfirmasi dan Bayar",
        items: [
            "Periksa kembali pesanan sebelum menekan tombol \"Buat Pesanan\".",
            { text: "Setelah checkout, buka menu Pesanan Saya, klik \"Bayar\", kemudian unggah bukti pembayaran sesuai metode yang dipilih.", badge: "Ready Stock" },
            { text: "Admin akan mengonfirmasi harga terlebih dahulu. Setelah harga disetujui, lakukan pembayaran melalui menu yang tersedia.", badge: "Custom" },
        ],
    },
    {
        number: 7,
        title: "Cek Status Pesanan",
        items: [
            "Buka menu Pesanan Saya untuk melihat status terbaru.",
            { text: "Menunggu Pembayaran \u2192 Diproses \u2192 Dikirim \u2192 Selesai.", badge: "Ready Stock" },
            { text: "Konsultasi \u2192 Dikonfirmasi \u2192 Produksi \u2192 Dikirim \u2192 Selesai.", badge: "Custom" },
            "Status pembayaran akan diperbarui setelah pembayaran diterima atau diverifikasi.",
        ],
    },
    {
        number: 8,
        title: "Pesanan Diproses dan Dikirim",
        items: [
            { text: "Pesanan diproses dalam waktu 1\u20132 hari kerja, tidak termasuk hari libur.", badge: "Ready Stock" },
            { text: "Pesanan diproduksi sesuai estimasi yang telah disepakati.", badge: "Custom" },
            "Nomor resi akan ditampilkan apabila tersedia.",
        ],
    },
];

function CheckIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function CaraBelanja() {
    return (
        <PublicLayout>
            <Head title="Cara Belanja" />

            {/* ── HERO SECTION ──────────────────────────────────────────── */}
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
                                Panduan
                            </div>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.1] tracking-tight mb-4 max-w-3xl">
                                Cara Belanja di{" "}
                                <span className="relative inline-block">
                                    <span className="text-[#F59E0B]">Website Multikon</span>
                                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#F59E0B]/40 rounded-full" />
                                </span>
                            </h1>

                            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                                Ikuti langkah-langkah mudah berikut untuk berbelanja kebutuhan kitchen equipment
                                dan custom stainless steel di Multikon. Proses cepat, aman, dan terpercaya.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STEPS SECTION ─────────────────────────────────────────── */}
            <section className="bg-white py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                            Langkah-Langkah
                        </p>
                        <h2 className="text-3xl font-black text-[#1E293B]">
                            Panduan Berbelanja
                        </h2>
                        <div className="w-10 h-1 bg-[#F59E0B] rounded-full mx-auto mt-4" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 pt-4 md:pt-6">
                        {STEPS.map((step) => {
                            const badgeColors = {
                                "Ready Stock": "bg-[#F59E0B]/20 text-[#F59E0B]",
                                Custom: "bg-blue-500/20 text-blue-400",
                                Cargo: "bg-emerald-500/20 text-emerald-400",
                                Pickup: "bg-purple-500/20 text-purple-400",
                            };

                            return (
                                <div
                                    key={step.number}
                                    className="relative rounded-3xl p-6 md:p-8 shadow-xl bg-[#1E293B] overflow-hidden"
                                >
                                    <span className="absolute top-4 right-5 md:top-6 md:right-8 text-6xl md:text-7xl font-black text-white/5 select-none leading-none">
                                        {String(step.number).padStart(2, "0")}
                                    </span>

                                    <div className="w-10 h-1 bg-[#F59E0B] rounded-full mb-5" />
                                    <h3 className="text-lg md:text-xl font-black text-white mb-4 pr-12">
                                        {step.number}. {step.title}
                                    </h3>

                                    <ul className="space-y-3">
                                        {step.items.map((item, i) => {
                                            if (typeof item === "string") {
                                                return (
                                                    <li key={i} className="flex gap-2.5">
                                                        <CheckIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#F59E0B]" />
                                                        <span className="text-slate-300 text-sm leading-relaxed">
                                                            {item}
                                                        </span>
                                                    </li>
                                                );
                                            }

                                            return (
                                                <li key={i} className="flex gap-2.5">
                                                    <CheckIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#F59E0B]" />
                                                    <span className="text-slate-300 text-sm leading-relaxed">
                                                        {item.badge && (
                                                            <span
                                                                className={
                                                                    "inline-block text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full mr-1.5 align-middle " +
                                                                    badgeColors[item.badge]
                                                                }
                                                            >
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                        <span>{item.text}</span>
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── CTA SECTION ───────────────────────────────────────────── */}
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
                                Siap Memulai?
                            </h2>
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8">
                                Jelajahi katalog produk Multikon sekarang dan temukan kebutuhan kitchen
                                equipment serta custom stainless steel untuk bisnis Anda.
                            </p>
                            <Link
                                href="/catalog"
                                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E293B] font-black text-sm uppercase tracking-[0.1em] px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                    <path
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Mulai Berbelanja
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
