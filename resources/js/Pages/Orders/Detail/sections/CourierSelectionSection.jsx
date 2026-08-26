import { useState, useMemo } from 'react';
import { Truck, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

const VISIBLE_COURIER_COUNT = 4;
const VISIBLE_SERVICE_COUNT = 3;

function formatRupiah(value) {
  return `Rp${value.toLocaleString('id-ID')}`;
}

function groupByCourier(couriers) {
  const map = new Map();
  for (const c of couriers) {
    const code = c.name;
    if (!map.has(code)) {
      map.set(code, {
        courierName: c.name,
        courierCode: code,
        services: [],
      });
    }
    map.get(code).services.push({
      code: c.service,
      name: c.service,
      etd: c.etd,
      price: c.cost,
    });
  }
  return Array.from(map.values());
}

export default function CourierSelectionSection({
  couriers,
  loadingCouriers,
  selectedCourier,
  setSelectedCourier,
  onCekOngkir,
  onSaveCourier,
  onCancelCourier,
}) {
  const [expandedCourier, setExpandedCourier] = useState(null);
  const [showAllCouriers, setShowAllCouriers] = useState(false);
  const [expandedServices, setExpandedServices] = useState({});

  const courierGroups = useMemo(() => {
    if (!couriers || couriers.length === 0) return [];
    return groupByCourier(couriers);
  }, [couriers]);

  const sortedGroups = useMemo(() => {
    return [...courierGroups]
      .map((group) => ({
        ...group,
        services: [...group.services].sort((a, b) => a.price - b.price),
      }))
      .sort((a, b) => {
        const cheapestA = Math.min(...a.services.map((s) => s.price));
        const cheapestB = Math.min(...b.services.map((s) => s.price));
        return cheapestA - cheapestB;
      });
  }, [courierGroups]);

  const visibleGroups = showAllCouriers
    ? sortedGroups
    : sortedGroups.slice(0, VISIBLE_COURIER_COUNT);
  const hiddenCount = sortedGroups.length - VISIBLE_COURIER_COUNT;

  const toggleCourier = (courierCode) => {
    setExpandedCourier((prev) => (prev === courierCode ? null : courierCode));
  };

  const toggleShowAllServices = (courierCode) => {
    setExpandedServices((prev) => ({ ...prev, [courierCode]: true }));
  };

  const handleSelectService = (group, service) => {
    setSelectedCourier({
      name: group.courierCode,
      service: service.name,
      cost: service.price,
      etd: service.etd,
      cost_formatted: formatRupiah(service.price),
    });
  };

  const isSelected = (courierCode, serviceCode) => {
    return (
      selectedCourier?.name === courierCode &&
      selectedCourier?.service === serviceCode
    );
  };

  if (!couriers) {
    return (
      <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
        <div className="flex">
          <div className="w-1 flex-shrink-0 bg-[#F59E0B]" />
          <div className="flex-1 p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Truck size={19} className="text-slate-400" />
              <p className="text-base font-medium text-slate-900">Pilih Kurir Pengiriman</p>
            </div>
            <p className="text-sm text-slate-500 mb-4 pl-[29px]">
              Cek pilihan ekspedisi dan estimasi ongkir ke alamatmu
            </p>
            <button
              type="button"
              onClick={onCekOngkir}
              disabled={loadingCouriers}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium rounded-full px-5 py-2.5 transition-colors"
            >
              <Calculator size={16} />
              {loadingCouriers ? 'Mengecek ongkir...' : 'Cek Ongkir'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (couriers.length === 0) {
    return (
      <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
        <div className="flex">
          <div className="w-1 flex-shrink-0 bg-[#F59E0B]" />
          <div className="flex-1 p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Truck size={19} className="text-slate-400" />
              <p className="text-base font-medium text-slate-900">Pilih Kurir Pengiriman</p>
            </div>
            <p className="text-sm text-slate-500 pl-[29px]">
              Tidak ada kurir tersedia untuk alamat ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
      <div className="flex">
        <div className="w-1 flex-shrink-0 bg-[#F59E0B]" />
        <div className="flex-1 p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-1">
            <Truck size={19} className="text-slate-400" />
            <p className="text-base font-medium text-slate-900">Pilih Kurir Pengiriman</p>
          </div>
          <p className="text-sm text-slate-500 mb-4 pl-[29px]">
            Pilih ekspedisi, lalu pilih layanan pengiriman yang tersedia
          </p>

          <div className="flex flex-col gap-2">
            {visibleGroups.map((group) => {
              const isExpanded = expandedCourier === group.courierCode;
              const cheapest = Math.min(...group.services.map((s) => s.price));
              const showAllServices = expandedServices[group.courierCode];
              const servicesToShow = showAllServices
                ? group.services
                : group.services.slice(0, VISIBLE_SERVICE_COUNT);
              const remainingServices = group.services.length - VISIBLE_SERVICE_COUNT;

              return (
                <div
                  key={group.courierCode}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleCourier(group.courierCode)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 text-left transition-colors ${
                      isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-600 flex-shrink-0">
                        {group.courierCode}
                      </div>
                      <div>
                        <p className="text-[13.5px] font-medium text-slate-900">
                          {group.courierName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {group.services.length} layanan tersedia · mulai {formatRupiah(cheapest)}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 pb-2.5 pt-1.5 flex flex-col">
                      {servicesToShow.map((service) => {
                        const checked = isSelected(group.courierCode, service.code);
                        return (
                          <label
                            key={service.code}
                            className="flex items-center justify-between py-2 px-1 rounded-lg cursor-pointer hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="radio"
                                name={`courier-${group.courierCode}`}
                                checked={checked}
                                onChange={() => handleSelectService(group, service)}
                                className="w-4 h-4 accent-amber-500"
                              />
                              <div>
                                <p className="text-[13px] text-slate-900">{service.name}</p>
                                <p className="text-[11.5px] text-slate-400">
                                  Estimasi {service.etd}
                                </p>
                              </div>
                            </div>
                            <p className="text-[13px] font-medium text-slate-900">
                              {formatRupiah(service.price)}
                            </p>
                          </label>
                        );
                      })}

                      {!showAllServices && remainingServices > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleShowAllServices(group.courierCode)}
                          className="text-xs text-amber-600 hover:text-amber-700 mt-1.5 pl-1 text-left"
                        >
                          +{remainingServices} layanan lainnya
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {!showAllCouriers && hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllCouriers(true)}
                className="text-[12.5px] text-amber-600 hover:text-amber-700 text-left pl-1 mt-0.5"
              >
                Lihat {hiddenCount} ekspedisi lainnya
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 mt-4">
            <button
              type="button"
              disabled={!selectedCourier}
              onClick={onSaveCourier}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-full px-5 py-2.5 transition-colors"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onCancelCourier}
              className="bg-transparent text-slate-500 hover:text-slate-700 border border-slate-200 text-sm font-medium rounded-full px-5 py-2.5 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
