import { Head, Link } from "@inertiajs/react";
import PublicLayout from "../Layouts/PublicLayout";

const ADDRESS =
    "Jl. Jatinegara Kaum No.17A, RT.6/RW.3, Jatinegara Kaum, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13250";
const COMPANY = "CV Multikon Erindotama";
const WA_1 = "0813-9909-6871";
const WA_2 = "0858-8573-9462";

const SECTIONS = [
    {
        number: 1,
        title: "Pendahuluan",
        paragraphs: [
            "Syarat dan Ketentuan ini mengatur penggunaan situs web Multikon serta layanan yang disediakan oleh " +
                COMPANY +
                " (\"Multikon\", \"kami\", \"kita\"), termasuk pembelian produk Ready Stock, pemesanan produk Custom, konsultasi, dan fitur lainnya yang tersedia di situs web ini.",
            "Dengan mengakses, mendaftar, atau menggunakan layanan Multikon, Anda (\"Pengguna\", \"Anda\") dianggap telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan ini. Apabila Anda tidak setuju dengan sebagian atau seluruh ketentuan, mohon untuk tidak menggunakan layanan Multikon.",
            "Syarat dan Ketentuan ini dapat diperbarui sewaktu-waktu. Perubahan akan diumumkan melalui situs web Multikon dan berlaku efektif sejak tanggal publikasi. Pengguna disarankan untuk meninjau halaman ini secara berkala.",
        ],
    },
    {
        number: 2,
        title: "Akun Pengguna",
        paragraphs: [
            "Untuk dapat mengakses fitur tertentu seperti keranjang belanja, pemesanan, dan konsultasi, Pengguna wajib mendaftar dan memiliki akun Multikon. Pendaftaran hanya dapat dilakukan oleh individu yang telah berusia minimal 18 tahun atau memiliki kapasitas hukum untuk mengikatkan diri dalam suatu perjanjian.",
            "Pengguna bertanggung jawab penuh atas kerahasiaan data akun, termasuk email dan password yang digunakan. Segala aktivitas yang terjadi dalam akun Pengguna merupakan tanggung jawab Pengguna. Apabila terjadi penyalahgunaan akun, segera hubungi tim Multikon.",
            "Pengguna menjamin bahwa seluruh data pribadi yang diberikan saat pendaftaran dan penggunaan layanan adalah benar, akurat, dan terkini. Multikon berhak menonaktifkan atau menghapus akun apabila ditemukan ketidaksesuaian data atau pelanggaran terhadap ketentuan ini.",
        ],
    },
    {
        number: 3,
        title: "Produk dan Layanan",
        paragraphs: [
            "Multikon menyediakan dua kategori produk utama: (a) Produk Ready Stock, yaitu produk jadi yang tersedia di gudang dan siap dikirim setelah pembayaran dikonfirmasi; (b) Produk Custom, yaitu produk yang dibuat berdasarkan spesifikasi teknis yang diajukan oleh Pengguna.",
            "Seluruh informasi produk termasuk spesifikasi, dimensi, material, harga, dan ketersediaan stok yang tercantum di situs web bersifat informatif dan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Multikon berusaha menyajikan informasi yang akurat namun tidak menjamin bebas dari kesalahan.",
            "Multikon juga menyediakan layanan konsultasi produk custom melalui fitur chat, yang memungkinkan Pengguna berdiskusi dengan tim kami sebelum melakukan pemesanan.",
        ],
    },
    {
        number: 4,
        title: "Pemesanan",
        paragraphs: [
            "Pemesanan produk Ready Stock dilakukan melalui halaman Keranjang dan Checkout. Pengguna wajib melengkapi data pengiriman, memilih metode pengiriman, dan memilih metode pembayaran yang tersedia. Pesanan dianggap sah setelah Pengguna menekan tombol \"Buat Pesanan\" dan sistem mengonfirmasi penerimaan pesanan.",
            "Untuk produk Custom, Pengguna dapat mengajukan pemesanan melalui formulir Product Custom dengan menyertakan spesifikasi teknis dan file referensi, atau melalui konsultasi chat dengan tim Multikon. Admin akan meninjau kebutuhan Pengguna dan memberikan harga. Pesanan Custom dianggap sah setelah harga disetujui oleh Pengguna.",
            "Multikon berhak menolak atau membatalkan pesanan apabila: (a) produk tidak tersedia; (b) terjadi kesalahan harga atau informasi produk; (c) indikasi penipuan atau pelanggaran ketentuan; (d) alasan lain yang sah menurut kebijakan Multikon. Pembatalan akan dikomunikasikan kepada Pengguna dan pembayaran yang telah diterima akan dikembalikan sesuai ketentuan.",
        ],
    },
    {
        number: 5,
        title: "Harga dan Pembayaran",
        paragraphs: [
            "Harga produk yang tercantum sudah termasuk Pajak Pertambahan Nilai (PPN) namun belum termasuk biaya ongkos kirim. Ongkos kirim dihitung secara otomatis berdasarkan berat produk dan alamat tujuan pada saat checkout.",
            "Multikon menyediakan metode pembayaran melalui Transfer Bank (BCA, BRI, Mandiri) dan QRIS. Informasi rekening tujuan beserta nominal yang harus dibayarkan akan ditampilkan pada halaman pembayaran setelah pesanan berhasil dibuat.",
            "Pembayaran wajib dilakukan dalam batas waktu 1x24 jam sejak pesanan dibuat. Apabila pembayaran tidak diterima dalam batas waktu tersebut, pesanan akan otomatis dibatalkan. Bukti pembayaran harus diunggah pada halaman pembayaran yang tersedia untuk proses verifikasi oleh tim Multikon.",
            "Untuk produk Custom, pembayaran dilakukan setelah harga disetujui oleh Pengguna. Pembayaran dapat dilakukan secara penuh atau sesuai kesepakatan dengan tim Multikon.",
        ],
    },
    {
        number: 6,
        title: "Pengiriman",
        paragraphs: [
            "Multikon menyediakan dua metode pengiriman: (a) Cargo, yaitu barang diantarkan oleh jasa kurir ke alamat tujuan yang didaftarkan oleh Pengguna; (b) Pickup, yaitu barang dapat diambil langsung di workshop Multikon yang beralamat di " +
            ADDRESS +
            ".",
            "Produk Ready Stock diproses dalam waktu 1-2 hari kerja setelah pembayaran dikonfirmasi, tidak termasuk hari libur nasional. Untuk produk Custom, estimasi produksi akan disepakati bersama antara Pengguna dan tim Multikon sebelum pemesanan dikonfirmasi.",
            "Risiko kerusakan atau kehilangan barang selama pengiriman oleh jasa kurir menjadi tanggung jawab jasa kurir yang bersangkutan. Pengguna wajib memeriksa kondisi barang saat diterima dan melaporkan kerusakan kepada tim Multikon paling lambat 1x24 jam setelah barang diterima.",
        ],
    },
    {
        number: 7,
        title: "Produk Custom",
        paragraphs: [
            "Produk Custom adalah produk yang dibuat berdasarkan spesifikasi teknis, desain, dan kebutuhan yang diajukan oleh Pengguna. Seluruh spesifikasi teknis yang diajukan oleh Pengguna menjadi acuan utama dalam proses produksi. Multikon akan meninjau kelayakan teknis dan memberikan masukan apabila diperlukan.",
            "Harga produk Custom ditentukan setelah tim Multikon meninjau spesifikasi teknis, material, kompleksitas desain, dan jumlah pesanan. Harga yang telah disetujui bersifat final dan tidak dapat diubah setelah produksi dimulai.",
            "Perubahan spesifikasi setelah produksi dimulai hanya dapat dilakukan atas kesepakatan kedua belah pihak dan dapat mempengaruhi harga serta estimasi waktu produksi. Multikon tidak bertanggung jawab atas ketidaksesuaian hasil produksi apabila Pengguna tidak memberikan spesifikasi yang jelas dan lengkap.",
        ],
    },
    {
        number: 8,
        title: "Garansi dan Retur",
        paragraphs: [
            "Produk Multikon dilengkapi garansi sesuai ketentuan yang tercantum pada halaman detail produk masing-masing. Garansi mencakup kerusakan material dan cacat produksi dalam jangka waktu tertentu terhitung sejak barang diterima oleh Pengguna.",
            "Garansi tidak berlaku untuk: (a) kerusakan akibat penggunaan yang tidak sesuai petunjuk; (b) kerusakan akibat kecelakaan, kelalaian, atau modifikasi oleh pihak ketiga; (c) keausan normal akibat pemakaian; (d) kerusakan akibat force majeure seperti bencana alam, kebakaran, atau banjir.",
            "Retur atau penukaran barang hanya dapat dilakukan apabila: (a) produk yang diterima tidak sesuai dengan pesanan; (b) produk mengalami kerusakan cacat produksi yang telah diverifikasi oleh tim Multikon. Pengajuan retur harus dilakukan dalam waktu 1x24 jam setelah barang diterima dengan menyertakan foto dan nomor pesanan.",
            "Produk Custom tidak dapat diretur atau ditukar kecuali terdapat cacat produksi yang telah diverifikasi, mengingat produk dibuat sesuai spesifikasi khusus Pengguna.",
        ],
    },
    {
        number: 9,
        title: "Hak Kekayaan Intelektual",
        paragraphs: [
            "Seluruh konten yang terdapat dalam situs web Multikon, termasuk namun tidak terbatas pada teks, gambar, logo, desain, ikon, video, dan perangkat lunak, merupakan hak kekayaan intelektual Multikon atau pihak ketiga yang telah memberikan lisensi kepada Multikon, dan dilindungi oleh undang-undang hak cipta serta kekayaan intelektual lainnya.",
            "Pengguna dilarang menyalin, mereproduksi, mendistribusikan, memodifikasi, atau membuat karya turunan dari konten situs web Multikon tanpa izin tertulis dari Multikon. Pelanggaran terhadap ketentuan ini dapat mengakibatkan tuntutan hukum sesuai peraturan perundang-undangan yang berlaku.",
        ],
    },
    {
        number: 10,
        title: "Pembatasan Tanggung Jawab",
        paragraphs: [
            "Multikon tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, konsekuensial, atau punitif yang timbul dari penggunaan atau ketidakmampuan menggunakan situs web dan layanan Multikon, termasuk namun tidak terbatas pada kerugian akibat keterlambatan pengiriman, ketidaksesuaian produk, atau gangguan teknis.",
            "Multikon tidak memberikan jaminan bahwa situs web akan beroperasi tanpa gangguan atau bebas dari kesalahan. Multikon berhak melakukan pemeliharaan, pembaruan, atau penghentian sementara layanan tanpa pemberitahuan terlebih dahulu.",
            "Dalam hal terjadi sengketa, tanggung jawab Multikon dibatasi pada nilai transaksi yang menjadi pokok sengketa dan tidak melebihi jumlah yang telah dibayarkan oleh Pengguna untuk produk atau layanan yang disengketakan.",
        ],
    },
    {
        number: 11,
        title: "Pengakhiran Akses",
        paragraphs: [
            "Multikon berhak menangguhkan atau mengakhiri akses Pengguna terhadap akun dan layanan Multikon apabila Pengguna melanggar Syarat dan Ketentuan ini, melakukan tindakan ilegal, atau merugikan pihak lain dalam penggunaan layanan Multikon.",
            "Pengguna dapat mengakhiri penggunaan akun kapan saja dengan menghubungi tim Multikon. Pengakhiran akun tidak menghilangkan kewajiban pembayaran yang masih terutang atas pesanan yang telah dilakukan sebelumnya.",
            "Ketentuan mengenai hak kekayaan intelektual, pembatasan tanggung jawab, dan penyelesaian sengketa tetap berlaku setelah pengakhiran akses.",
        ],
    },
    {
        number: 12,
        title: "Ketentuan Lainnya",
        paragraphs: [
            "Apabila sebagian dari Syarat dan Ketentuan ini dinyatakan tidak sah atau tidak dapat diberlakukan oleh pengadilan yang berwenang, ketentuan lainnya tetap berlaku dan memiliki kekuatan hukum penuh.",
            "Syarat dan Ketentuan ini tunduk pada hukum Negara Republik Indonesia. Segala sengketa yang timbul dari penggunaan layanan Multikon akan diselesaikan melalui musyawarah untuk mufakat terlebih dahulu. Apabila tidak tercapai kesepakatan, sengketa akan diselesaikan melalui Pengadilan Negeri Jakarta Timur.",
            "Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi tim Multikon melalui WhatsApp di " +
            WA_1 +
            " atau " +
            WA_2 +
            ", atau melalui halaman Contact yang tersedia di situs web Multikon. Tim kami akan merespon dalam waktu 1x24 jam pada hari kerja.",
        ],
    },
];

export default function SyaratKetentuan() {
    return (
        <PublicLayout>
            <Head title="Syarat & Ketentuan" />

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
                                Ketentuan
                            </div>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.1] tracking-tight mb-4 max-w-3xl">
                                Syarat{" "}
                                <span className="relative inline-block">
                                    <span className="text-[#F59E0B]">&amp; Ketentuan</span>
                                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#F59E0B]/40 rounded-full" />
                                </span>
                            </h1>

                            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                                Ketentuan hukum yang mengatur penggunaan situs web dan layanan Multikon,
                                termasuk hak, kewajiban, serta tanggung jawab Pengguna dan Perusahaan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTENT SECTIONS ──────────────────────────────────────── */}
            <section className="bg-white py-16 md:py-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                            Pasal
                        </p>
                        <h2 className="text-3xl font-black text-[#1E293B]">
                            Syarat &amp; Ketentuan Penggunaan
                        </h2>
                        <div className="w-10 h-1 bg-[#F59E0B] rounded-full mx-auto mt-4" />
                    </div>

                    <div className="space-y-6">
                        {SECTIONS.map((section) => (
                            <div
                                key={section.number}
                                className="bg-[#1E293B] rounded-3xl p-8 shadow-xl relative overflow-hidden"
                            >
                                <span                                 className="absolute top-[-1px] right-[4px] md:top-[7px] md:right-[8px] text-[62px] md:text-[86px] font-black text-white/[0.03] select-none leading-none pointer-events-none">
                                    {String(section.number).padStart(2, "0")}
                                </span>

                                <div className="relative">
                                    <div className="flex items-start gap-4 mb-5">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F59E0B] text-[#1E293B] text-sm font-bold shrink-0 mt-0.5">
                                            {section.number}
                                        </span>
                                        <h3 className="text-base md:text-lg font-bold text-white leading-snug pt-1">
                                            Pasal {section.number} — {section.title}
                                        </h3>
                                    </div>

                                    <div className="pl-12">
                                        <div className="w-8 h-0.5 bg-[#F59E0B]/60 rounded-full mb-5" />
                                        <div className="text-slate-200 text-[15px] md:text-base leading-[1.8] space-y-4">
                                            {section.paragraphs.map((p, i) => (
                                                <p key={i}>{p}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA SECTION ───────────────────────────────────────────── */}
            <section className="bg-[#F8F9FA] py-16 md:py-20">
                <div className="max-w-3xl mx-auto px-6">
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
                                Ada yang Ingin Ditanyakan?
                            </h2>
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8">
                                Jika Anda membutuhkan klarifikasi mengenai Syarat dan Ketentuan ini,
                                jangan ragu untuk menghubungi tim Multikon.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href="https://wa.me/6281399096871"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E293B] font-black text-sm uppercase tracking-[0.1em] px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                        <path
                                            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Hubungi WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
