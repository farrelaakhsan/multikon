export default function HowItWorks() {
    return (
        <div className="bg-[#F59E0B]/10 border-2 border-[#F59E0B]/30 rounded-[2rem] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">ℹ️</span>
                <h2 className="text-lg font-black italic uppercase tracking-tighter text-[#1E293B]">Cara Kerja</h2>
            </div>
            <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                <li>Kirim form dengan detail kebutuhan Anda</li>
                <li>Admin akan mereview dan menentukan harga</li>
                <li>Cek status dan harga di halaman Rincian Pesanan (simpan kode pesanan)</li>
                <li>Lakukan pembayaran dan proses selanjutnya</li>
            </ol>
        </div>
    );
}
