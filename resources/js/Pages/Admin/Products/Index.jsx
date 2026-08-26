import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Pagination from "../../../Components/ui/Pagination";
import ProductImage from "../../../Components/ui/ProductImage";
import { formatPrice } from "../../../utils/format";

export default function ProductsIndex({ products }) {
    const items = products.data || [];

    const handleDelete = (id, name) => {
        if (
            !confirm(
                `Hapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`,
            )
        )
            return;
        router.delete(`/admin/products/${id}`);
    };

    return (
        <AdminLayout title="Produk">
            <Head title="Admin — Produk" />

            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500">
                    {products.total} produk total
                </p>
                <Link
                    href="/admin/products/create"
                    className="bg-[#F59E0B] text-[#1E293B] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition"
                >
                    + Tambah Produk
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {[
                                    "Produk",
                                    "Kategori",
                                    "Harga",
                                    "Tipe",
                                    "Aksi",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-500"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-slate-400 text-sm"
                                    >
                                        Belum ada produk.
                                    </td>
                                </tr>
                            ) : (
                                items.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-slate-50 transition"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <ProductImage
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-xl border border-slate-100"
                                                />
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 italic uppercase tracking-tight">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs font-bold text-slate-600">
                                            {product.category}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-black text-slate-900">
                                            Rp {formatPrice(product.price)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${product.is_customizable ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                                            >
                                                {product.is_customizable
                                                    ? "Custom"
                                                    : "Ready"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product.id,
                                                            product.name,
                                                        )
                                                    }
                                                    className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500 transition"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={products.links} />
        </AdminLayout>
    );
}
