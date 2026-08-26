import { useState } from "react";
import { formatPrice } from "../../utils/format";

export default function CourierPicker({
    subdistrictId,
    selectedAddress,
    courierLoading,
    courierError,
    courierOptions,
    courierName,
    courierService,
    shippingCost,
    onSelect,
    onFetchShippingCost,
    onChangeCourier,
}) {
    const [expandedCourier, setExpandedCourier] = useState(null);

    const selectedCourier = courierOptions.find((c) => c.code === courierName);
    const selectedService = selectedCourier?.costs?.find((s) => s.service === courierService);
    const selectedEtd = selectedService?.cost?.[0]?.etd || selectedService?.etd || '';
    const hasSelectedCourier = !!(courierName && courierService && shippingCost);

    const handleSelect = (courierCode, serviceName, costValue) => {
        onSelect(courierCode, serviceName, costValue);
        setExpandedCourier(null);
    };

    if (!subdistrictId) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 font-semibold">Lengkapi kecamatan tujuan</p>
                <p className="text-xs text-amber-600 mt-1">
                    Simpan alamat dengan kecamatan terlebih dahulu untuk melihat ongkos kirim.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 font-semibold">
                    📍 Pengiriman ke {selectedAddress?.subdistrict_name}
                    {selectedAddress?.district_name ? `, ${selectedAddress.district_name}` : ""}
                    {selectedAddress?.city_name ? `, ${selectedAddress.city_name}` : ""}
                </p>
            </div>

            {courierError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-xs text-red-700">{courierError}</p>
                </div>
            )}

            {courierLoading && (
                <div className="text-center py-4">
                    <p className="text-xs text-slate-500">Menghitung ongkos kirim...</p>
                </div>
            )}

            {!courierLoading && courierOptions.length === 0 && !courierError && (
                <button
                    type="button"
                    onClick={() => onFetchShippingCost(subdistrictId)}
                    className="w-full py-3 rounded-xl bg-[#1E293B] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1E293B]/90 transition"
                >
                    Hitung Ongkos Kirim
                </button>
            )}

            {courierOptions.length > 0 && (
                hasSelectedCourier ? (
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-600">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Kurir Dipilih</p>
                                <p className="text-sm font-bold text-emerald-800 mt-0.5">
                                    {selectedCourier?.name || courierName} - {courierService}
                                </p>
                                {selectedEtd && (
                                    <p className="text-xs text-emerald-600 mt-0.5">Estimasi: {selectedEtd}</p>
                                )}
                            </div>
                            <span className="text-sm font-black text-emerald-800 shrink-0">
                                Rp {formatPrice(Number(shippingCost))}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onChangeCourier}
                            className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition"
                        >
                            Ganti Kurir
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                            Pilih Kurir
                        </p>
                        <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                            {courierOptions.map((courier) => {
                                const services = courier.costs?.length
                                    ? courier.costs
                                    : (courier.service ? [courier] : []);
                                const isExpanded = expandedCourier === courier.code;

                                return (
                                    <div key={courier.code || courier.name} className="border border-slate-200 rounded-xl overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedCourier(isExpanded ? null : courier.code)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition text-left"
                                        >
                                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[#1E293B]">
                                                {courier.name}
                                            </span>
                                            <span className={`text-slate-400 text-xs transition ${isExpanded ? 'rotate-180' : ''}`}>
                                                ▾
                                            </span>
                                        </button>

                                        {isExpanded && services.length > 0 && (
                                            <div className="border-t border-slate-100 bg-[#F8F9FA] p-2 space-y-1">
                                                {services.map((svc) => {
                                                    const costVal = Array.isArray(svc.cost)
                                                        ? (svc.cost[0]?.value || 0)
                                                        : (typeof svc.cost === 'number' ? svc.cost : 0);
                                                    const eta = Array.isArray(svc.cost)
                                                        ? (svc.cost[0]?.etd || '-')
                                                        : (svc.etd || '-');
                                                    const serviceName = svc.service || '';
                                                    const isSelected = courierName === courier.code && courierService === serviceName;

                                                    return (
                                                        <button
                                                            key={courier.code + serviceName}
                                                            type="button"
                                                            onClick={() => handleSelect(courier.code, serviceName, costVal)}
                                                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition ${
                                                                isSelected
                                                                    ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                                                                    : 'border-transparent bg-white hover:border-[#1E293B]/20'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                                                    isSelected ? 'border-[#F59E0B] bg-[#F59E0B]' : 'border-slate-300'
                                                                }`}>
                                                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-[#1E293B]">{serviceName}</p>
                                                                    {eta !== '-' && (
                                                                        <p className="text-[9px] text-slate-400">{eta}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-black text-[#1E293B]">Rp {formatPrice(costVal)}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
