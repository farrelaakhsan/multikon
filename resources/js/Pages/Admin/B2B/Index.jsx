import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Pagination from "../../../Components/ui/Pagination";

const STATUS_STYLE = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
};

export default function B2BIndex({ applications }) {
    const items = applications.data || [];

    return (
        <AdminLayout title="Pengajuan B2B">
            <Head title="Admin — Pengajuan B2B" />

            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500">
                    {applications.total} pengajuan
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {[
                                    "Perusahaan",
                                    "Pengaju",
                                    "Status",
                                    "Diajukan",
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
                                        Belum ada pengajuan B2B.
                                    </td>
                                </tr>
                            ) : (
                                items.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-slate-50 transition"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-black text-slate-900 italic uppercase tracking-tight">
                                                {app.company_name}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                NPWP: {app.company_npwp}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-slate-700">
                                                {app.user_name}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {app.user_email}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    STATUS_STYLE[app.status] ??
                                                    "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {app.status_label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {app.created_at}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/admin/b2b/${app.id}`}
                                                className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] hover:underline"
                                            >
                                                Tinjau →
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={applications.links} />
        </AdminLayout>
    );
}
