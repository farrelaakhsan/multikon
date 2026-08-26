import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import IdentitySection from "./Form/IdentitySection";
import DescriptionSection from "./Form/DescriptionSection";
import UsageSection from "./Form/UsageSection";
import WarrantySection from "./Form/WarrantySection";
import ImageUploadSection from "./Form/ImageUploadSection";
import InventorySection from "./Form/InventorySection";

export default function ProductForm({ product }) {
    const isEdit = !!product;

    const [data, setData] = useState({
        name: product?.name || "",
        price: product?.price ? String(product.price).replace(/\.\d+$/, "") : "",
        description: product?.description || "",
        specifications: product?.specifications || "",
        weight: product?.weight || "",
        usage_instructions: product?.usage_instructions || "",
        warranty: product?.warranty || "",
        image: product?.image_raw || "",
        image_file: null,
        category: product?.category || "",
        is_customizable: product?.is_customizable ?? false,
        stock: product?.stock ?? 0,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const set = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const payload = {
            name: data.name,
            price: data.price,
            description: data.description,
            specifications: data.specifications,
            weight: data.weight,
            usage_instructions: data.usage_instructions,
            warranty: data.warranty,
            image: data.image,
            category: data.category,
            is_customizable: data.is_customizable,
            stock: data.is_customizable ? 0 : data.stock,
        };

        if (data.image_file) {
            payload.image_file = data.image_file;
        }

        if (isEdit) {
            payload._method = "PUT";
            router.post(`/admin/products/${product.id}`, payload, {
                forceFormData: true,
                onError: (e) => { setErrors(e); setProcessing(false); },
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post("/admin/products", payload, {
                forceFormData: true,
                onError: (e) => { setErrors(e); setProcessing(false); },
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? "Edit Produk" : "Tambah Produk"}>
            <Head title={isEdit ? "Edit Produk" : "Tambah Produk"} />

            <div className="w-full max-w-7xl px-6 lg:px-8 pb-6 lg:pb-8 pt-0">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Link href="/admin/products" className="hover:text-[#F59E0B] transition">← Produk</Link>
                    <span className="text-slate-300">/</span>
                    <span>{isEdit ? "Edit" : "Tambah"}</span>
                </div>

                <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <IdentitySection data={data} set={set} errors={errors} />
                        <DescriptionSection data={data} set={set} errors={errors} />
                        <UsageSection data={data} set={set} />
                        <WarrantySection data={data} set={set} />
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
                            <ImageUploadSection data={data} set={set} errors={errors} />
                            <hr className="border-slate-200" />
                            <InventorySection
                                data={data}
                                set={set}
                                isCustomSelected={data.is_customizable}
                                onToggleCustom={(val) => {
                                    set("is_customizable", val);
                                    set("stock", val ? 0 : (product?.stock || 1));
                                }}
                            />
                        </div>
                    </div>
                </form>

                <div className="sticky bottom-0 w-full bg-white border-t border-slate-200 shadow-lg p-4 flex justify-end gap-3 z-50">
                    <Link href="/admin/products" className="px-6 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                        Batal
                    </Link>
                    <button
                        type="submit"
                        form="product-form"
                        disabled={processing}
                        className="bg-[#F59E0B] text-[#1E293B] px-8 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition disabled:opacity-60"
                    >
                        {processing ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
