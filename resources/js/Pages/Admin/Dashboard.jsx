import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { formatPrice } from "../../utils/format";

function StatCard({ label, value, sub, color }) {
    return (
        <div
            className={`bg-white rounded-2xl border border-[#1E293B]/10 shadow-sm p-6 ${color}`}
        >
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
                {label}
            </p>
            <p className="text-4xl font-black italic tracking-tighter text-[#1E293B]">
                {value}
            </p>
            {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
    );
}

export default function Dashboard({ stats, recentOrders }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard
                    label="Total Produk"
                    value={stats.total_products}
                    sub="Produk di catalog"
                />
                <StatCard
                    label="Total Pesanan"
                    value={stats.total_orders}
                    sub="Semua waktu"
                />
                <StatCard
                    label="Pending"
                    value={stats.pending_orders}
                    sub="Menunggu konfirmasi"
                />
                <StatCard
                    label="Custom Konsultasi"
                    value={stats.custom_orders}
                    sub="Produk custom"
                />
            </div>

            {/* Quick actions */}
            <div className="grid sm:grid-cols-2 gap-5 mb-8">
                <Link
                    href="/admin/products/create"
                    className="bg-[#F59E0B] text-[#1E293B] p-6 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition flex items-center gap-4"
                >
                    <span className="text-3xl">➕</span>
                    <div>
                        <p className="text-sm">Tambah Produk</p>
                        <p className="text-[10px] font-semibold text-[#1E293B]/70 normal-case not-italic">
                            Tambahkan produk baru ke catalog
                        </p>
                    </div>
                </Link>
                <Link
                    href="/admin/orders"
                    className="bg-[#1E293B] text-white p-6 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-[#1E293B]/20 hover:bg-[#1E293B]/90 transition flex items-center gap-4"
                >
                    <span className="text-3xl">📋</span>
                    <div>
                        <p className="text-sm">Lihat Pesanan</p>
                        <p className="text-[10px] font-semibold text-slate-400 normal-case not-italic">
                            Kelola semua pesanan masuk
                        </p>
                    </div>
                </Link>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-[#1E293B]/10 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-black italic uppercase tracking-tight text-[#1E293B]">
                        Pesanan Terbaru
                    </h2>
                    <Link
                        href="/admin/orders"
                        className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] hover:text-[#1E293B] transition"
                    >
                        Lihat Semua →
                    </Link>
                </div>
                <div className="divide-y divide-slate-50">
                    {recentOrders.length === 0 ? (
                        <div className="px-6 py-10 text-center text-slate-400 text-sm">
                            Belum ada pesanan.
                        </div>
                    ) : (
                        recentOrders.map((order) => {
                            const isDone = order.status === 'completed' || order.status === 'done';
                            return (
                            <div
                                key={order.order_code}
                                className="px-6 py-4 flex items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-0.5">
                                        <p className="font-mono text-xs font-black text-blue-600">
                                            {order.order_code}
                                        </p>
                                        <span
                                            className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                                        >
                                            {order.status_label}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-[#1E293B] truncate">
                                        {order.customer_name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {order.product_name}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-slate-500">
                                        {order.payment_label}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {order.created_at}
                                    </p>
                                </div>
                            </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}