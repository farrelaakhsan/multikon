const WORKSHOP = {
    name: "Workshop & Warehouse Multikon",
    address: "Jl. Jatinegara Kaum No.17A, RT.6/RW.3, Jatinegara Kaum, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13250",
    mapsUrl: "https://maps.google.com/?q=Jl.+Jatinegara+Kaum+No.17A+Jakarta+Timur",
    hours: "Senin - Sabtu | 08:00 - 17:00 WIB",
    pic: "Pak Budi",
    picPhone: "6281234567890",
};

export default function PickupInfoCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-6">
            <p className="text-sm font-semibold text-slate-900 mb-4">
                🏪 Pickup di Workshop
            </p>

            <div className="flex gap-5">
                <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-slate-900">
                        {WORKSHOP.name}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                        {WORKSHOP.address}
                    </p>
                </div>
                <div className="shrink-0">
                    <a
                        href={WORKSHOP.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group block"
                    >
                        <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-blue-300 transition">
                            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                        <p className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition text-center mt-1.5">
                            ↗ Buka Google Maps
                        </p>
                    </a>
                </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium mt-4">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {WORKSHOP.hours}
            </div>

            <hr className="border-t border-slate-100 my-4" />

            <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-700">
                    👤 PIC Gudang: {WORKSHOP.pic}
                </span>
                <a
                    href={`https://wa.me/${WORKSHOP.picPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition shrink-0"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Hubungi via WhatsApp
                </a>
            </div>

            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 mt-4">
                💡 Cukup tunjukkan <strong>Kode Pesanan</strong> Anda kepada staf gudang saat pengambilan barang di lokasi.
            </div>
        </div>
    );
}
