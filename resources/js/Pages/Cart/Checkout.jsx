import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import PublicLayout from "../../Layouts/PublicLayout";
import Field from "../../Components/ui/Field";
import { ShippingTypeCard } from "../../Components/ui/SelectableCard";
import { SelectableCard } from "../../Components/ui/SelectableCard";
import AddressSelector from "../../Components/Checkout/AddressSelector";
import CourierPicker from "../../Components/Checkout/CourierPicker";
import PickupInfoCard from "../../Components/Checkout/PickupInfoCard";
import TopPaymentSection from "../../Components/Checkout/TopPaymentSection";
import OrderSummarySidebar from "../../Components/Checkout/OrderSummarySidebar";

const SHIPPING_TYPES = [
    { key: "cargo", label: "Cargo", icon: "🚛", desc: "Untuk barang besar & heavy equipment" },
    { key: "pickup", label: "Pickup", icon: "🏪", desc: "Ambil langsung di lokasi" },
];

export default function Checkout({
    items = [],
    total = 0,
    addresses = [],
    is_b2b_verified = false,
    credit_limit = null,
    remaining_credit = null,
    top_tenure_days = 30,
    top_disabled = false,
    direct_buy = false,
}) {
    const { props } = usePage();
    const ps = props.paymentSettings || {};
    const bankAccounts = ps.bank_accounts || [];

    const firstBank = bankAccounts[0] || null;
    const qrisAvailable = !!ps.qris_image_url;

    const allItemsReadyStock = items.length > 0 && items.every((i) => !i.is_customizable);
    const remainingCredit = Number(remaining_credit ?? 0);

    const topMethod = allItemsReadyStock
        ? [
              {
                  key: "top",
                  label: "Pembayaran Tempo (ToP / Net 30)",
                  icon: "⏳",
                  desc: top_disabled
                      ? "Fasilitas ToP sedang dibekukan admin"
                      : `Bayar kemudian dalam ${top_tenure_days} hari setelah invoice (khusus B2B)`,
                  account: null,
                  accountName: null,
                  locked: !is_b2b_verified || top_disabled,
                  lockReason: top_disabled
                      ? "Fasilitas Pembayaran Tempo (ToP) untuk pesanan baru sedang dibekukan sementara oleh admin. Gunakan metode Full Payment / Pay in Advance."
                      : null,
              },
          ]
        : [];

    const PAYMENT_METHODS = [
        ...(firstBank
            ? [{
                  key: "bank_0",
                  label: "Transfer Bank",
                  icon: "\uD83C\uDFE6",
                  desc: `Transfer ke rekening ${firstBank.bank} a.n. ${firstBank.name}`,
                  account: firstBank.account,
                  accountName: firstBank.name,
              }]
            : []),
        ...(qrisAvailable
            ? [{ key: "qris", label: "QRIS", icon: "\uD83D\uDCF1", desc: "Scan QR code di halaman konfirmasi order", account: null, accountName: null }]
            : []),
        ...topMethod,
    ];

    const defaultAddress = addresses.find((a) => a.is_default) || addresses[0] || null;

    const [form, setForm] = useState({
        whatsapp_number: defaultAddress?.receiver_phone || "",
        selected_address_id: defaultAddress?.id || null,
        shipping_type: "",
        notes: "",
        payment_method: "",
        courier_name: "",
        courier_service: "",
        shipping_cost: "",
        subdistrict_id: defaultAddress?.subdistrict_id || "",
        subdistrict_name: defaultAddress?.subdistrict_name || "",
        district_name: defaultAddress?.district_name || "",
        city_name: defaultAddress?.city_name || "",
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [poFile, setPoFile] = useState(null);

    const [courierLoading, setCourierLoading] = useState(false);
    const [courierOptions, setCourierOptions] = useState([]);
    const [courierError, setCourierError] = useState("");

    const selectedAddress = addresses.find((a) => a.id === form.selected_address_id) || defaultAddress;

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    const totalShipping = courierOptions.length > 0 && form.courier_name
        ? (() => {
              for (const courier of courierOptions) {
                  for (const service of courier.costs || []) {
                      if (service.service === form.courier_service && courier.code === form.courier_name) {
                          return service.cost?.[0]?.value || 0;
                      }
                  }
              }
              return 0;
          })()
        : 0;

    const grandTotal = total + totalShipping;

    const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

    const fetchShippingCost = async (subdistrictId) => {
        setCourierLoading(true);
        setCourierError("");
        setCourierOptions([]);
        update("courier_name", "");
        update("courier_service", "");
        update("shipping_cost", "");

        try {
            const res = await fetch("/shipping-cost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({
                    product_ids: items.map((i) => i.product_id),
                    quantities: Object.fromEntries(items.map((i) => [i.product_id, i.quantity])),
                    destination_subdistrict_id: subdistrictId,
                }),
            });
            const data = await res.json();
            console.log('[RajaOngkir] response:', data);
            if (data.error) { setCourierError(data.error); return; }
            setCourierOptions(data.costs || []);
        } catch {
            setCourierError("Gagal menghubungi server. Coba lagi.");
        } finally {
            setCourierLoading(false);
        }
    };

    const handleSelectCourier = (courierCode, serviceName, costValue) => {
        update("courier_name", courierCode);
        update("courier_service", serviceName);
        update("shipping_cost", costValue);
    };

    const handleChangeCourier = () => {
        update("courier_name", "");
        update("courier_service", "");
        update("shipping_cost", "");
    };

    const handleAddressSelect = (addr) => {
        update("selected_address_id", addr.id);
        update("whatsapp_number", addr.receiver_phone || "");
        update("subdistrict_id", addr.subdistrict_id || "");
        update("subdistrict_name", addr.subdistrict_name || "");
        update("district_name", addr.district_name || "");
        update("city_name", addr.city_name || "");
        if (form.shipping_type === "cargo" && addr.subdistrict_id) {
            fetchShippingCost(addr.subdistrict_id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        let hasError = false;
        const newErrors = {};

        if (!form.selected_address_id && addresses.length > 0) { newErrors.address = "Pilih alamat pengiriman"; hasError = true; }
        if (addresses.length === 0) { newErrors.address = "Atur alamat pengiriman di Settings"; hasError = true; }
        if (!form.shipping_type) { newErrors.shipping_type = "Pilih metode pengiriman"; hasError = true; }
        if (!form.payment_method) { newErrors.payment_method = "Pilih metode pembayaran"; hasError = true; }

        if (form.payment_method === "top") {
            if (!poFile) {
                newErrors.po_document =
                    "Dokumen Purchase Order (PO) wajib dilampirkan. Silakan unggah dokumen PO resmi perusahaan Anda dalam format PDF atau Gambar (maksimal 5MB).";
                hasError = true;
            }
            if (remainingCredit > 0 && grandTotal > remainingCredit) {
                newErrors.credit_limit =
                    "Sisa limit kredit tidak mencukupi. Total transaksi ini melebihi batas Credit Limit Anda. Silakan lunasi tagihan berjalan Anda terlebih dahulu atau gunakan metode pembayaran lain.";
                hasError = true;
            }
        }

        if (hasError) { setErrors(newErrors); return; }

        const itemIds = items.map((i) => i.id);
        const directItem = items[0] || null;

        setProcessing(true);
        router.post("/cart/checkout", {
            ...(direct_buy && directItem
                ? { product_id: Number(directItem.product_id), quantity: Number(directItem.quantity) }
                : { cart_items: itemIds }),
            selected_address_id: form.selected_address_id,
            whatsapp_number: form.whatsapp_number,
            shipping_type: form.shipping_type,
            notes: form.notes,
            payment_method: form.payment_method,
            shipping_cost: form.shipping_cost || "",
            courier_name: form.courier_name || "",
            courier_service: form.courier_service || "",
            subdistrict_id: form.subdistrict_id || "",
            subdistrict_name: form.subdistrict_name || "",
            district_name: form.district_name || "",
            city_name: form.city_name || "",
            po_document: form.payment_method === "top" ? poFile : null,
        }, {
            forceFormData: true,
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <PublicLayout>
            <Head title="Checkout" />

            <div className="bg-[#F8F9FA] min-h-screen">
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                        <Link href="/cart" className="hover:text-[#F59E0B]">Keranjang</Link>
                        <span>›</span>
                        <span className="text-[#F59E0B]">Checkout</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-[#1E293B]">Checkout</h1>
                        <p className="text-sm text-slate-500 mt-2">Lengkapi data untuk melanjutkan pemesanan</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            {/* Card 1: Data Pemesan */}
                            <div className="bg-white rounded-[2rem] border border-[#1E293B]/10 shadow-sm p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-black">1</div>
                                    <h2 className="text-lg font-black italic uppercase tracking-tighter text-[#1E293B]">Data Pemesan</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <AddressSelector
                                            addresses={addresses}
                                            selectedAddress={selectedAddress}
                                            onSelect={handleAddressSelect}
                                            error={errors.address}
                                            userName={props.auth.user?.name}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Field label="Catatan Tambahan" error={errors.notes}>
                                            <textarea rows="2" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Catatan pengiriman atau instruksi khusus" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 resize-none" />
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Metode Pengiriman */}
                            <div className="bg-white rounded-[2rem] border border-[#1E293B]/10 shadow-sm p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-black">2</div>
                                    <h2 className="text-lg font-black italic uppercase tracking-tighter text-[#1E293B]">Metode Pengiriman</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                                    {SHIPPING_TYPES.map((type) => (
                                        <ShippingTypeCard key={type.key} method={type} selected={form.shipping_type} onSelect={(key) => {
                                            update("shipping_type", key);
                                            if (key === "cargo" && form.subdistrict_id) {
                                                fetchShippingCost(form.subdistrict_id);
                                            }
                                        }} />
                                    ))}
                                </div>
                                {errors.shipping_type && <p className="text-xs text-red-500 mb-4">{errors.shipping_type}</p>}
                                {form.shipping_type === "cargo" && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <CourierPicker
                                            subdistrictId={form.subdistrict_id}
                                            selectedAddress={selectedAddress}
                                            courierLoading={courierLoading}
                                            courierError={courierError}
                                            courierOptions={courierOptions}
                                            courierName={form.courier_name}
                                            courierService={form.courier_service}
                                            shippingCost={form.shipping_cost}
                                            onSelect={handleSelectCourier}
                                            onFetchShippingCost={fetchShippingCost}
                                            onChangeCourier={handleChangeCourier}
                                        />
                                    </div>
                                )}
                                {form.shipping_type === "pickup" && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <PickupInfoCard />
                                    </div>
                                )}
                            </div>

                            {/* Card 3: Metode Pembayaran */}
                            <div className="bg-white rounded-[2rem] border border-[#1E293B]/10 shadow-sm p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-black">3</div>
                                    <h2 className="text-lg font-black italic uppercase tracking-tighter text-[#1E293B]">Metode Pembayaran</h2>
                                </div>
                                <div className="space-y-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <SelectableCard
                                            key={method.key}
                                            selected={form.payment_method === method.key}
                                            onClick={() => update("payment_method", method.key)}
                                            icon={method.icon}
                                            label={method.label}
                                            desc={method.desc}
                                            account={method.account}
                                            accountName={method.accountName}
                                            locked={method.locked}
                                            lockReason={method.lockReason}
                                        />
                                    ))}
                                </div>
                                {errors.payment_method && <p className="text-xs text-red-500 mt-2">{errors.payment_method}</p>}

                                {form.payment_method === "top" && (
                                    <TopPaymentSection
                                        creditLimit={credit_limit}
                                        remainingCredit={remainingCredit}
                                        grandTotal={grandTotal}
                                        poFile={poFile}
                                        onPoFileChange={(file) => {
                                            setPoFile(file);
                                            if (errors.po_document) setErrors((p) => ({ ...p, po_document: undefined }));
                                        }}
                                        errors={errors}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:col-span-4">
                            <OrderSummarySidebar
                                items={items}
                                total={total}
                                shippingType={form.shipping_type}
                                courierName={form.courier_name}
                                courierService={form.courier_service}
                                totalShipping={totalShipping}
                                grandTotal={grandTotal}
                                processing={processing}
                                paymentMethod={form.payment_method}
                                poFile={poFile}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
