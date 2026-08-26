import { useState, useEffect } from "react";
import { X, Tag, Phone, Search } from "lucide-react";

export default function AddressFormModal({ open, address, onClose, csrfToken }) {
    const isEdit = !!address;

    const [label, setLabel] = useState(address?.label || "");
    const [receiverPhone, setReceiverPhone] = useState(address?.receiver_phone || "");
    const [fullAddress, setFullAddress] = useState(address?.address || "");
    const [subdistrictId, setSubdistrictId] = useState(address?.subdistrict_id || "");
    const [subdistrictName, setSubdistrictName] = useState(address?.subdistrict_name || "");
    const [districtName, setDistrictName] = useState(address?.district_name || "");
    const [cityName, setCityName] = useState(address?.city_name || "");

    const [searchKecamatan, setSearchKecamatan] = useState(address?.subdistrict_name || "");
    const [locationResults, setLocationResults] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            setLabel(address?.label || "");
            setReceiverPhone(address?.receiver_phone || "");
            setFullAddress(address?.address || "");
            setSubdistrictId(address?.subdistrict_id || "");
            setSubdistrictName(address?.subdistrict_name || "");
            setDistrictName(address?.district_name || "");
            setCityName(address?.city_name || "");
            setSearchKecamatan(address?.subdistrict_name || "");
            setLocationResults([]);
            setErrors({});
        }
    }, [open, address]);

    const handleSearchLocation = async () => {
        if (!searchKecamatan.trim()) return;
        setLocationLoading(true);
        setLocationResults([]);
        try {
            const res = await fetch("/shipping-cost/search?q=" + encodeURIComponent(searchKecamatan), {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            const data = await res.json();
            setLocationResults(data.results || []);
        } catch {
            setLocationResults([]);
        } finally {
            setLocationLoading(false);
        }
    };

    const handleSelectLocation = (loc) => {
        setSubdistrictId(String(loc.id));
        setSubdistrictName(loc.subdistrict_name);
        setDistrictName(loc.district_name);
        setCityName(loc.city_name);
        setLocationResults([]);
        setSearchKecamatan(loc.label);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const errs = {};
        if (!label.trim()) errs.label = "Isi label alamat";
        if (!fullAddress.trim()) errs.address = "Isi alamat lengkap";
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setProcessing(true);

        const url = isEdit ? `/addresses/${address.id}` : "/addresses";

        const body = new URLSearchParams();
        body.append("label", label);
        body.append("receiver_phone", receiverPhone);
        body.append("address", fullAddress);
        body.append("subdistrict_id", subdistrictId);
        body.append("subdistrict_name", subdistrictName);
        body.append("district_name", districtName);
        body.append("city_name", cityName);
        if (isEdit) body.append("_method", "PATCH");

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
                body,
            });

            if (!res.ok) {
                const data = await res.json();
                setErrors(data.errors || {});
                return;
            }

            onClose();
            window.location.reload();
        } catch {
            setErrors({ form: "Gagal menyimpan alamat." });
        } finally {
            setProcessing(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-6 z-50" onClick={onClose}>
            <div className="w-full max-w-[480px] bg-white rounded-[20px] p-7 sm:p-8" onClick={(e) => e.stopPropagation()}>

                <div className="flex items-center justify-between mb-5">
                    <p className="text-[17px] font-medium italic text-slate-900">
                        {isEdit ? "Edit Alamat" : "Alamat Baru"}
                    </p>
                    <button onClick={onClose} aria-label="Tutup" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {errors.form && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-xs text-red-700">{errors.form}</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">

                    <div className="grid grid-cols-2 gap-3.5">
                        <FormField
                            label="LABEL ALAMAT"
                            required
                            icon={<Tag size={14} className="text-slate-400 flex-shrink-0" />}
                            value={label}
                            onChange={setLabel}
                            placeholder="Rumah, Kantor, Kos, dll"
                            error={errors.label}
                        />
                        <FormField
                            label="NOMOR PENERIMA"
                            icon={<Phone size={14} className="text-slate-400 flex-shrink-0" />}
                            value={receiverPhone}
                            onChange={setReceiverPhone}
                            placeholder="0812-3456-7890"
                            type="tel"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                            ALAMAT LENGKAP <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={fullAddress}
                            onChange={(e) => setFullAddress(e.target.value)}
                            placeholder="Jl. Nama Jalan No. xx, Kelurahan, Kecamatan, Kota, Kode Pos"
                            className="w-full border border-slate-200 rounded-[10px] px-3.5 py-2.5 text-[13px] text-slate-900 resize-none font-sans focus:outline-none focus:border-slate-400 transition"
                        />
                        {errors.address && <p className="text-xs text-red-500 mt-1.5">{errors.address}</p>}
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                            CARI KECAMATAN / KELURAHAN
                            {subdistrictName && <span className="text-green-600 ml-2">✓ {subdistrictName}</span>}
                        </label>
                        <div className="flex items-center border border-slate-200 rounded-[10px] px-3.5 gap-1.5 h-[38px] box-border focus-within:border-slate-400 transition">
                            <Search size={14} className="text-slate-400 flex-shrink-0" />
                            <input
                                value={searchKecamatan}
                                onChange={(e) => setSearchKecamatan(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearchLocation()}
                                placeholder="Cari nama kecamatan atau kelurahan..."
                                className="border-none outline-none text-[13px] text-slate-900 placeholder:text-slate-400 w-full bg-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleSearchLocation}
                                disabled={locationLoading || !searchKecamatan.trim()}
                                className="bg-slate-800 text-white rounded-md px-3.5 py-1.5 text-xs font-medium flex-shrink-0 hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                {locationLoading ? "..." : "Cari"}
                            </button>
                        </div>
                        {locationResults.length > 0 && (
                            <div className="mt-2 border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
                                {locationResults.map((loc) => (
                                    <button
                                        key={loc.id}
                                        type="button"
                                        onClick={() => handleSelectLocation(loc)}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-amber-50 transition border-b border-slate-100 last:border-0"
                                    >
                                        <span className="font-semibold">{loc.subdistrict_name}</span>
                                        <span className="text-slate-500"> — {loc.district_name}, {loc.city_name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2.5 mt-1.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-transparent border border-slate-200 text-slate-600 rounded-full py-2.5 text-[13.5px] font-medium hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-slate-900 rounded-full py-2.5 text-[13.5px] font-medium transition-colors"
                        >
                            {processing ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan"}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

function FormField({ label, required, icon, value, onChange, placeholder, type = "text", error }) {
    return (
        <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            <div className={`flex items-center border rounded-[10px] px-3.5 gap-1.5 h-[38px] box-border focus-within:border-slate-400 transition ${
                error ? "border-red-400" : "border-slate-200"
            }`}>
                {icon}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="border-none outline-none text-[13px] text-slate-900 placeholder:text-slate-400 w-full bg-transparent"
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>
    );
}
