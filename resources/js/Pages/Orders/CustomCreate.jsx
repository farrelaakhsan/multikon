import { Head, Link, useForm, router } from "@inertiajs/react";
import PublicLayout from "../../Layouts/PublicLayout";
import ProductImage from "../../Components/ui/ProductImage";
import Field from "../../Components/ui/Field";
import { ShippingTypeCard } from "../../Components/ui/SelectableCard";
import AddressSelector from "../../Components/Checkout/AddressSelector";
import OrderSummarySidebar from "../../Components/Checkout/OrderSummarySidebar";
import PaymentMethodSelector from "../../Components/CustomOrder/PaymentMethodSelector";
import HowItWorks from "../../Components/CustomOrder/HowItWorks";
import { formatPrice } from "../../utils/format";

export default function CustomCreate({
    product,
    user,
    addresses = [],
    is_b2b_verified = false,
    termin_scheme = [],
}) {
    const defaultAddress = addresses.find((a) => a.is_default) || addresses[0] || null;
    const selectedAddress = addresses.find((a) => a.id === defaultAddress?.id) || defaultAddress;

    const { data, setData, post, processing, errors } = useForm({
        whatsapp_number: defaultAddress?.receiver_phone || "",
        selected_address_id: defaultAddress?.id || null,
        product_name: product?.name || "",
        product_id: product?.id || null,
        requirements: "",
        specifications: "",
        quantity: 1,
        shipping_method: "cargo",
        notes: "",
        reference_file: null,
        payment_method: "instant",
        subdistrict_id: defaultAddress?.subdistrict_id || "",
        subdistrict_name: defaultAddress?.subdistrict_name || "",
        district_name: defaultAddress?.district_name || "",
        city_name: defaultAddress?.city_name || "",
    });

    const handleAddressSelect = (addr) => {
        setData("selected_address_id", addr.id);
        setData("whatsapp_number", addr.receiver_phone || "");
        setData("subdistrict_id", addr.subdistrict_id || "");
        setData("subdistrict_name", addr.subdistrict_name || "");
        setData("district_name", addr.district_name || "");
        setData("city_name", addr.city_name || "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/custom-order", {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("reference_file", file);
        }
    };

    return (
        <PublicLayout>
            <Head title="Pesan Custom - Multikon" />

            <div className="bg-[#F8F9FA] min-h-screen">
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                        <Link href="/catalog" className="hover:text-[#F59E0B]">Catalog</Link>
                        <span>›</span>
                        <span className="text-[#1E293B]">Pesan Custom</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-[#1E293B]">Pesan Custom</h1>
                        <p className="text-sm text-slate-500 mt-2">Buat produk sesuai kebutuhan Anda</p>
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
                                            userName={user.name}
                                        />
                                    </div>
                                    <div className="md:col-span-2 border-t border-slate-100 pt-5 mt-2">
                                        <Field label="Metode Pengiriman" required error={errors.shipping_method}>
                                            <div className="grid grid-cols-2 gap-3">
                                                <ShippingTypeCard
                                                    method={{ key: "cargo", label: "Cargo", icon: "🚚", desc: "Ongkir dihitung bersama total harga barang" }}
                                                    selected={data.shipping_method}
                                                    onSelect={(key) => setData("shipping_method", key)}
                                                />
                                                <ShippingTypeCard
                                                    method={{ key: "pickup", label: "Pickup", icon: "🏪", desc: "Ambil langsung di workshop" }}
                                                    selected={data.shipping_method}
                                                    onSelect={(key) => setData("shipping_method", key)}
                                                />
                                            </div>
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Detail Produk Custom */}
                            <div className="bg-white rounded-[2rem] border border-[#1E293B]/10 shadow-sm p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-black">2</div>
                                    <h2 className="text-lg font-black italic uppercase tracking-tighter text-[#1E293B]">Detail Produk Custom</h2>
                                </div>
                                <div className="space-y-5">
                                    <Field label="Kebutuhan" required error={errors.requirements}>
                                        <textarea
                                            rows="3"
                                            value={data.requirements}
                                            onChange={(e) => setData("requirements", e.target.value)}
                                            placeholder="Jelaskan kebutuhan Anda: untuk apa produk ini digunakan, di mana akan dipakai, dan kondisi lingkungannya."
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 resize-none"
                                        />
                                    </Field>
                                    <Field label="Spesifikasi Teknis" error={errors.specifications}>
                                        <textarea
                                            rows="4"
                                            value={data.specifications}
                                            onChange={(e) => setData("specifications", e.target.value)}
                                            placeholder="Spesifikasi detail:&#10;- Dimensi (panjang x lebar x tinggi)&#10;- Material spesifik (jika ada)&#10;- Ketebalan stainless steel&#10;- Finishing (matt/glossy)&#10;- Fitur tambahan (rak, pintu, dll)"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 resize-none"
                                        />
                                    </Field>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <Field label="Jumlah" required error={errors.quantity}>
                                            <input
                                                type="number"
                                                value={data.quantity}
                                                onChange={(e) => setData("quantity", parseInt(e.target.value) || 1)}
                                                min="1"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20"
                                            />
                                        </Field>
                                        <div>
                                            <Field label="File Referensi (Gambar/Sketsa)" error={errors.reference_file}>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={handleFileChange}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:bg-[#F59E0B] file:text-[#1E293B] file:font-black file:text-xs file:uppercase"
                                                />
                                            </Field>
                                            <p className="text-[9px] text-slate-400 mt-1">Format: JPG, PNG, PDF (Max 5MB)</p>
                                        </div>
                                    </div>
                                    <Field label="Catatan Tambahan" error={errors.notes}>
                                        <textarea
                                            rows="2"
                                            value={data.notes}
                                            onChange={(e) => setData("notes", e.target.value)}
                                            placeholder="Catatan tambahan seperti perkiraan biaya, target waktu penyelesaian, dll."
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 resize-none"
                                        />
                                    </Field>
                                </div>
                            </div>

                            <HowItWorks />

                            {/* Card 3: Metode Pembayaran */}
                            <div className="bg-white rounded-[2rem] border border-[#1E293B]/10 shadow-sm p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-black">3</div>
                                    <h2 className="text-lg font-black italic uppercase tracking-tighter text-[#1E293B]">Metode Pembayaran</h2>
                                </div>
                                <PaymentMethodSelector
                                    paymentMethod={data.payment_method}
                                    onPaymentMethodChange={(val) => setData("payment_method", val)}
                                    isB2bVerified={is_b2b_verified}
                                    terminScheme={termin_scheme}
                                    errors={errors}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <OrderSummarySidebar
                                total={product ? product.price * data.quantity : 0}
                                processing={processing}
                                onSubmit={handleSubmit}
                            >
                                <div className="p-6">
                                    {product ? (
                                        <div className="flex gap-4">
                                            <ProductImage src={product.image_url} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-1">{product.category}</p>
                                                <h3 className="text-sm font-black uppercase tracking-tight text-[#1E293B] line-clamp-2">{product.name}</h3>
                                                <p className="text-lg font-black text-[#1E293B] mt-1">Rp {formatPrice(product.price)}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-3">✨</div>
                                            <p className="text-sm text-slate-500">Produk Custom Baru</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 bg-[#F8F9FA]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Jumlah</span>
                                        <span className="text-sm font-black text-slate-600">{data.quantity} unit</span>
                                    </div>
                                    {product ? (
                                        <>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subtotal</span>
                                                <span className="text-sm font-black text-slate-600">Rp {formatPrice(product.price)} x {data.quantity}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total</span>
                                                <span className="text-xl font-black text-[#1E293B]">Rp {formatPrice((product.price ?? 0) * data.quantity)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                            <p className="text-xs text-amber-800">💰 Harga akan ditentukan oleh admin setelah review kebutuhan Anda.</p>
                                        </div>
                                    )}
                                </div>
                            </OrderSummarySidebar>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
