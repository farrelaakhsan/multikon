import { Head } from "@inertiajs/react";
import PublicLayout from "../Layouts/PublicLayout";

const ADDRESS = "Jl. Jatinegara Kaum No.17A, RT.6/RW.3, Jatinegara Kaum, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13250";
const COMPANY = "CV Multikon Erindotama";

const SECTIONS = [
    {
        number: 1,
        title: "Pendahuluan",
        content:
            "Kebijakan Privasi ini menjelaskan bagaimana " +
            COMPANY +
            " mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda ketika menggunakan situs web Multikon serta layanan yang kami sediakan, termasuk pemesanan produk, konsultasi custom, dan layanan chat.\n\n" +
            "Dengan mendaftar dan menggunakan layanan Multikon, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan dalam Kebijakan Privasi ini.",
    },
    {
        number: 2,
        title: "Data Pribadi yang Dikumpulkan",
        content:
            "Kami mengumpulkan data pribadi yang Anda berikan secara langsung saat menggunakan layanan Multikon. Data tersebut meliputi nama lengkap, alamat email, nomor telepon, dan nomor WhatsApp yang Anda daftarkan. Kami juga menyimpan alamat pengiriman lengkap beserta kecamatan, kelurahan, kota, dan provinsi tujuan.\n\n" +
            "Selain itu, kami mencatat riwayat produk yang dibeli, spesifikasi teknis untuk produk custom, file referensi yang dilampirkan, serta metode pembayaran dan bukti pembayaran yang Anda unggah. Data komunikasi seperti riwayat percakapan melalui fitur chat konsultasi dan chatbot juga kami simpan untuk keperluan layanan. Secara teknis, kami mencatat alamat IP, jenis peramban, sistem operasi, dan data penggunaan situs secara anonim untuk meningkatkan kualitas layanan.",
    },
    {
        number: 3,
        title: "Cara Pengumpulan Data",
        content:
            "Data pribadi Anda dikumpulkan melalui berbagai aktivitas saat menggunakan layanan Multikon. Saat Anda mendaftar akun melalui halaman Daftar, data identitas Anda tercatat dalam sistem. Ketika melakukan pemesanan, data alamat dan metode pengiriman yang Anda pilih akan kami simpan. Data pembayaran diperoleh saat Anda mengunggah bukti pembayaran pada halaman pembayaran.\n\n" +
            "Apabila Anda menggunakan fitur Konsultasi Product Custom atau chatbot, riwayat percakapan akan tercatat. Pengisian formulir pemesanan produk custom dengan spesifikasi teknis dan file referensi juga menjadi sumber data. Setiap komunikasi yang Anda lakukan melalui WhatsApp atau halaman Contact akan kami dokumentasikan untuk keperluan pelayanan.",
    },
    {
        number: 4,
        title: "Tujuan Penggunaan Data Pribadi",
        content:
            "Data pribadi yang kami kumpulkan digunakan untuk mendukung kelancaran layanan Multikon. Tujuan utamanya adalah memproses dan mengelola pesanan Anda, baik produk Ready Stock maupun Custom. Kami juga menggunakan data tersebut untuk memverifikasi pembayaran dan mengirimkan konfirmasi status pesanan.\n\n" +
            "Pemberitahuan terkait pesanan akan disampaikan melalui WhatsApp dan email yang Anda daftarkan. Data Anda juga kami gunakan untuk menyediakan layanan konsultasi produk custom dan dukungan pelanggan. Untuk keperluan pengiriman, data alamat dan nomor telepon diberikan kepada jasa kurir yang Anda pilih. Selain itu, kami menganalisis data penggunaan situs untuk meningkatkan kualitas layanan dan pengalaman pengguna. Seluruh pemrosesan data dilakukan sesuai dengan kewajiban hukum dan peraturan yang berlaku.",
    },
    {
        number: 5,
        title: "Dasar Hukum Pemrosesan Data",
        content:
            "Pemrosesan data pribadi Anda dilakukan berdasarkan persetujuan yang Anda berikan saat mendaftar dan menggunakan layanan Multikon. Data juga diproses untuk memenuhi kewajiban kontraktual, yaitu pemrosesan pesanan yang Anda lakukan melalui situs web kami.\n\n" +
            "Selain itu, kami tunduk pada kewajiban hukum yang berlaku di Indonesia, termasuk Undang-Undang Informasi dan Transaksi Elektronik serta Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik.",
    },
    {
        number: 6,
        title: "Penyimpanan dan Keamanan Data",
        content:
            "Kami menyimpan data pribadi Anda di server yang aman dengan menerapkan berbagai langkah pengamanan. Data disimpan dalam sistem yang dilindungi firewall dan hanya dapat diakses oleh personel yang memiliki otorisasi. Password akun disimpan dalam bentuk terenkripsi sehingga tidak dapat dibaca oleh pihak mana pun.\n\n" +
            "Data pembayaran seperti bukti transfer disimpan dengan aman dan tidak dibagikan tanpa izin Anda. Data pribadi disimpan selama diperlukan untuk memenuhi tujuan pemrosesan atau sesuai dengan ketentuan perundang-undangan yang berlaku. Meskipun kami berupaya melindungi data pribadi Anda, perlu diketahui bahwa tidak ada metode transmisi atau penyimpanan elektronik yang sepenuhnya aman.",
    },
    {
        number: 7,
        title: "Pengungkapan Data kepada Pihak Ketiga",
        content:
            "Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak ketiga. Data pribadi hanya dapat diungkapkan dalam kondisi tertentu. Untuk keperluan pengiriman, data alamat dan nomor telepon diberikan kepada jasa kurir seperti JNE, TIKI, atau POS Indonesia.\n\n" +
            "Kami juga dapat mengungkapkan data apabila diwajibkan oleh hukum, peraturan, atau permintaan resmi dari lembaga penegak hukum. Data dapat digunakan untuk melindungi hak, properti, atau keselamatan Multikon, pengguna, atau pihak lain. Penyedia layanan yang membantu operasional kami, seperti penyedia hosting, dapat mengakses data namun terikat dengan kewajiban kerahasiaan yang ketat.",
    },
    {
        number: 8,
        title: "Hak Pengguna",
        content:
            "Sebagai pengguna, Anda memiliki hak-hak tertentu terkait data pribadi yang kami simpan. Anda berhak meminta informasi mengenai data pribadi yang kami miliki. Apabila terdapat data yang tidak akurat, Anda dapat memperbarui atau memperbaikinya melalui menu Pengaturan Akun atau dengan menghubungi kami.\n\n" +
            "Anda juga dapat meminta penghapusan data pribadi selama tidak bertentangan dengan kewajiban hukum yang berlaku. Dalam kondisi tertentu, Anda berhak meminta pembatasan pemrosesan data. Anda dapat menarik persetujuan pemrosesan data kapan saja tanpa memengaruhi keabsahan pemrosesan yang telah dilakukan sebelumnya. Anda juga berhak mengajukan keberatan terhadap pemrosesan data untuk kepentingan pemasaran langsung. Untuk menggunakan hak-hak tersebut, silakan hubungi tim Multikon melalui kontak yang tercantum pada bab terakhir kebijakan ini.",
    },
    {
        number: 9,
        title: "Perubahan Kebijakan Privasi",
        content:
            "Kebijakan Privasi ini dapat diperbarui sewaktu-waktu untuk mencerminkan perubahan dalam praktik kami atau perubahan peraturan yang berlaku. Setiap perubahan akan diumumkan melalui situs web Multikon.\n\n" +
            "Kami menyarankan Anda untuk meninjau halaman ini secara berkala agar selalu mengetahui bagaimana kami melindungi data pribadi Anda.",
    },
    {
        number: 10,
        title: "Kontak",
        content:
            "Apabila Anda memiliki pertanyaan, keluhan, atau ingin menggunakan hak-hak terkait data pribadi, silakan hubungi kami melalui WhatsApp di 0813-9909-6871 atau 0858-8573-9462. Anda juga dapat mengunjungi halaman Contact di situs Multikon atau datang langsung ke kantor kami yang beralamat di " +
            ADDRESS +
            ".\n\n" +
            "Kami akan merespon permintaan Anda dalam waktu 1x24 jam pada hari kerja.",
    },
];

export default function KebijakanPrivasi() {
    return (
        <PublicLayout>
            <Head title="Kebijakan Privasi" />

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
                                Kebijakan
                            </div>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.1] tracking-tight mb-4 max-w-3xl">
                                Kebijakan{" "}
                                <span className="relative inline-block">
                                    <span className="text-[#F59E0B]">Privasi</span>
                                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#F59E0B]/40 rounded-full" />
                                </span>
                            </h1>

                            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                                Bagaimana Multikon mengumpulkan, menggunakan, menyimpan, dan melindungi
                                data pribadi Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTENT SECTIONS ──────────────────────────────────────── */}
            <section className="bg-white py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                            Ketentuan
                        </p>
                        <h2 className="text-3xl font-black text-[#1E293B]">
                            Perlindungan Data Pribadi
                        </h2>
                        <div className="w-10 h-1 bg-[#F59E0B] rounded-full mx-auto mt-4" />
                    </div>

                    <div className="space-y-5">
                        {SECTIONS.map((section) => (
                            <div
                                key={section.number}
                                className="bg-[#1E293B] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"
                            >
                                <span className="absolute -top-4 -right-2 md:-top-6 md:-right-3 text-7xl md:text-8xl font-black text-white/[0.03] select-none leading-none pointer-events-none">
                                    {String(section.number).padStart(2, "0")}
                                </span>

                                <div className="relative">
                                    <div className="flex items-start gap-4 mb-4">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F59E0B] text-[#1E293B] text-sm font-black shrink-0 mt-0.5">
                                            {section.number}
                                        </span>
                                        <h3 className="text-base md:text-lg font-black text-white leading-snug pt-1">
                                            {section.title}
                                        </h3>
                                    </div>

                                    <div className="pl-12">
                                        <div className="w-8 h-0.5 bg-[#F59E0B]/60 rounded-full mb-4" />
                                        <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                                            {section.content}
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
                                Ada Pertanyaan?
                            </h2>
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8">
                                Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini atau
                                ingin menggunakan hak Anda atas data pribadi, jangan ragu untuk
                                menghubungi tim Multikon.
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
        </PublicLayout>
    );
}
