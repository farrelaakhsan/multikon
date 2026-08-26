const FAQ_CATEGORIES = [
    {
        id: "akun",
        title: "Akun & Pendaftaran",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        questions: [
            { id: "daftar", question: "Bagaimana cara mendaftar akun di Multikon?", answer: "Untuk mendaftar, buka halaman Register melalui menu Daftar di pojok kanan atas. Isi nama lengkap, alamat email, dan password. Setelah berhasil mendaftar, Anda dapat langsung masuk ke akun dan mulai berbelanja." },
            { id: "login-harus", question: "Apakah saya harus login untuk berbelanja?", answer: "Ya. Untuk dapat menambahkan produk ke keranjang dan melakukan pemesanan, Anda harus masuk ke akun Multikon terlebih dahulu. Apabila belum memiliki akun, silakan melakukan pendaftaran terlebih dahulu melalui halaman Register." },
            { id: "lupa-password", question: "Saya lupa password, bagaimana cara meresetnya?", answer: 'Pada halaman Login, klik tautan "Lupa Password?" yang tersedia. Masukkan alamat email yang terdaftar, kemudian ikuti instruksi yang dikirimkan ke email Anda untuk mereset password.' },
        ],
    },
    {
        id: "produk",
        title: "Produk & Katalog",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        questions: [
            { id: "ready-vs-custom", question: "Apa perbedaan produk Ready Stock dan Custom?", answer: "Produk Ready Stock adalah produk jadi yang tersedia di gudang dan dapat langsung dikirim setelah pembayaran dikonfirmasi. Produk Custom adalah produk yang dibuat sesuai permintaan spesifikasi pelanggan, melalui proses konsultasi dan produksi terlebih dahulu." },
            { id: "ppn", question: "Apakah harga produk sudah termasuk PPN?", answer: "Ya, harga yang tercantum di halaman produk sudah termasuk PPN. Namun, harga tersebut belum termasuk biaya ongkos kirim yang akan dihitung secara otomatis saat checkout berdasarkan berat produk dan alamat tujuan." },
            { id: "spesifikasi", question: "Bagaimana cara mengetahui spesifikasi produk secara detail?", answer: "Klik produk yang Anda minati di halaman Catalog untuk membuka halaman detail produk. Di sana tersedia informasi lengkap mengenai spesifikasi, dimensi, bahan, berat, stok, garansi, dan harga produk tersebut." },
            { id: "foto-produk", question: "Apakah foto produk sesuai dengan aslinya?", answer: "Foto produk yang ditampilkan merupakan representasi dari produk asli. Namun, tampilan fisik dapat sedikit berbeda tergantung pencahayaan dan perangkat yang digunakan. Untuk produk Custom, hasil akhir dapat berbeda dari gambar referensi yang dilampirkan." },
        ],
    },
    {
        id: "pemesanan",
        title: "Pemesanan",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        questions: [
            { id: "pesan-ready", question: "Bagaimana cara memesan produk Ready Stock?", answer: 'Cari produk di halaman Catalog, buka detail produk, kemudian klik ikon Keranjang. Buka halaman Keranjang, centang barang yang akan dibeli, lalu klik "Check Out". Lengkapi data pengiriman dan pilih metode pembayaran, kemudian klik "Buat Pesanan". Lakukan pembayaran melalui menu Pesanan Saya.' },
            { id: "pesan-custom", question: "Bagaimana cara memesan produk Custom?", answer: 'Anda dapat memesan produk Custom melalui dua cara: (1) Klik "Konsultasi Product Custom" untuk berkonsultasi melalui chat dengan tim kami, atau (2) Isi langsung formulir pemesanan custom di halaman Product Custom dengan menyertakan spesifikasi teknis dan file referensi. Admin akan mereview kebutuhan Anda dan menentukan harga.' },
            { id: "konsultasi", question: "Apakah saya bisa konsultasi terlebih dahulu sebelum memesan produk Custom?", answer: 'Tentu. Silakan klik tombol "Konsultasi Product Custom" yang tersedia di halaman beranda maupun halaman produk. Anda dapat berdiskusi dengan tim kami mengenai kebutuhan spesifikasi, desain, material, hingga estimasi harga sebelum memutuskan untuk memesan.' },
            { id: "ubah-pesanan", question: "Bisakah saya mengubah atau membatalkan pesanan?", answer: "Untuk perubahan atau pembatalan pesanan, silakan hubungi tim Multikon melalui WhatsApp di 0813-9909-6871 atau 0858-8573-9462. Perubahan dapat dilakukan selama pesanan belum memasuki tahap produksi atau pengiriman." },
        ],
    },
    {
        id: "pembayaran",
        title: "Pembayaran",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 10h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        questions: [
            { id: "metode-bayar", question: "Apa saja metode pembayaran yang tersedia?", answer: "Multikon menyediakan metode pembayaran melalui Transfer Bank (BCA, BRI, Mandiri) dan QRIS. Informasi rekening lengkap beserta nominal yang harus dibayarkan akan ditampilkan pada halaman pembayaran setelah pesanan berhasil dibuat." },
            { id: "cara-bayar-transfer", question: "Bagaimana cara melakukan pembayaran transfer bank?", answer: 'Setelah pesanan berhasil dibuat, buka menu Pesanan Saya, kemudian klik tombol "Bayar" pada pesanan yang belum dibayar. Informasi rekening tujuan akan ditampilkan. Lakukan transfer sesuai nominal yang tertera, kemudian unggah bukti transfer pada halaman yang sama.' },
            { id: "cara-bayar-qris", question: "Bagaimana cara melakukan pembayaran via QRIS?", answer: "Pilih metode QRIS saat checkout. Setelah pesanan dibuat, buka halaman pembayaran dan scan kode QR yang ditampilkan menggunakan aplikasi pembayaran yang mendukung QRIS (GoPay, OVO, DANA, mobile banking, dan lain-lain). Lakukan pembayaran sesuai nominal dan unggah bukti pembayaran." },
            { id: "batas-waktu", question: "Berapa batas waktu pembayaran setelah pesanan dibuat?", answer: "Batas waktu pembayaran adalah 1x24 jam sejak pesanan berhasil dibuat. Apabila pembayaran tidak diterima dalam batas waktu tersebut, pesanan akan otomatis dibatalkan. Setelah bukti pembayaran diunggah, tim kami akan melakukan verifikasi dalam waktu 1x24 jam." },
        ],
    },
    {
        id: "pengiriman",
        title: "Pengiriman",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 8h3l4 4v5a1 1 0 01-1 1h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        questions: [
            { id: "metode-kirim", question: "Apa saja metode pengiriman yang tersedia?", answer: "Kami menyediakan dua metode pengiriman: Cargo (barang diantar oleh kurir ke alamat tujuan) dan Pickup (barang dapat diambil langsung di workshop Multikon yang berlokasi di Jakarta Timur)." },
            { id: "biaya-ongkir", question: "Berapa biaya ongkos kirim dan bagaimana cara mengetahuinya?", answer: "Biaya ongkos kirim dihitung secara otomatis berdasarkan berat total produk dan alamat tujuan. Pada halaman checkout, pilih metode Cargo dan pastikan alamat tujuan memiliki kecamatan yang terdaftar. Sistem akan menampilkan daftar kurir beserta tarif ongkos kirim yang dapat dipilih." },
            { id: "estimasi-waktu", question: "Berapa lama estimasi waktu pengiriman?", answer: "Produk Ready Stock diproses dalam waktu 1\u20132 hari kerja setelah pembayaran dikonfirmasi. Untuk produk Custom, estimasi produksi akan disepakati bersama setelah proses konsultasi. Lama pengiriman tergantung lokasi tujuan dan jasa kurir yang dipilih." },
            { id: "pickup", question: "Apakah saya bisa mengambil barang langsung di workshop (pickup)?", answer: "Ya, tentu. Saat checkout, Anda dapat memilih metode Pickup. Barang dapat diambil langsung di workshop Multikon yang beralamat di Jl. Jatinegara Kaum No.17A, Jakarta Timur. Tim kami akan menginformasikan jadwal pengambilan setelah pesanan siap." },
        ],
    },
    {
        id: "status-garansi",
        title: "Status & Garansi",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        questions: [
            { id: "cek-status", question: "Bagaimana cara melihat status pesanan saya?", answer: 'Buka menu "Pesanan Saya" melalui dropdown profil di pojok kanan atas. Di halaman tersebut, Anda dapat melihat daftar seluruh pesanan beserta status terkininya. Klik "Lihat Rincian" untuk melihat detail lengkap pesanan dan riwayat status.' },
            { id: "arti-status", question: "Apa arti dari setiap status pesanan?", answer: "Untuk produk Ready Stock: Menunggu Pembayaran (belum dibayar), Diproses (sedang disiapkan), Dikirim (dalam perjalanan), Selesai (telah diterima). Untuk produk Custom: Konsultasi (menunggu review admin), Dikonfirmasi (harga telah disetujui), Produksi (sedang diproduksi), Dikirim, Selesai." },
            { id: "garansi", question: "Apakah produk Multikon memiliki garansi?", answer: "Ya, produk Multikon dilengkapi garansi sesuai ketentuan yang tercantum pada halaman detail produk masing-masing. Garansi mencakup kerusakan material dan cacat produksi dalam jangka waktu tertentu. Kerusakan akibat penggunaan yang tidak sesuai ketentuan tidak termasuk dalam garansi." },
            { id: "produk-rusak", question: "Bagaimana jika produk yang saya terima rusak atau tidak sesuai?", answer: "Segera hubungi tim Multikon melalui WhatsApp di 0813-9909-6871 atau 0858-8573-9462 dengan menyertakan foto produk dan nomor pesanan. Tim kami akan membantu proses pengajuan klaim dan memberikan solusi terbaik sesuai kondisi." },
        ],
    },
    {
        id: "custom-order",
        title: "Product Custom",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        questions: [
            { id: "proses-custom", question: "Bagaimana proses pemesanan produk Custom secara lengkap?", answer: "Proses Custom terdiri dari beberapa tahap: (1) Ajukan kebutuhan melalui Konsultasi Chat atau formulir Product Custom dengan menyertakan spesifikasi teknis dan file referensi. (2) Admin mereview kebutuhan dan menentukan harga. (3) Setelah harga disetujui, lakukan pembayaran. (4) Produksi dimulai sesuai spesifikasi yang disepakati. (5) Produk dikirim setelah selesai. Anda dapat memantau status melalui menu Pesanan Saya." },
            { id: "estimasi-produksi", question: "Berapa lama estimasi produksi produk Custom?", answer: "Estimasi produksi tergantung pada kompleksitas desain, material yang digunakan, dan jumlah pesanan. Tim Multikon akan memberikan estimasi waktu produksi setelah meninjau spesifikasi teknis yang diajukan. Informasi estimasi tersebut dapat dilihat pada halaman rincian pesanan." },
        ],
    },
];

export default FAQ_CATEGORIES;
