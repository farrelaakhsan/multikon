import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

function formatRelative(iso) {
    if (!iso) return "-";
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "baru saja";
    if (minutes < 60) return `${minutes} mnt lalu`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} jam lalu`;

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function ChatIndex({ conversations }) {
    return (
        <AdminLayout title="Konsultasi Custom">
            <Head title="Konsultasi Custom" />

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="text-5xl mb-4">💬</span>
                        <h3 className="text-lg font-black text-[#1E293B] mb-2">
                            Belum ada permintaan Konsultasi Product Custom
                        </h3>
                        <p className="text-sm text-slate-400 max-w-md">
                            Permintaan konsultasi dari pengunjung website akan muncul di sini.
                            Admin dapat membalas pesan setelah pengunjung mengirimkan pesan pertama.
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-sm font-bold text-[#1E293B]">
                                Daftar Permintaan Konsultasi
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {conversations.map((conv) => (
                                <Link
                                    key={conv.id}
                                    href={`/admin/chats/${conv.id}`}
                                    className="flex items-center gap-4 px-6 py-5 hover:bg-[#F8F9FA] transition group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0">
                                        <span className="text-[#1E293B] text-sm font-black">
                                            {conv.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4
                                                className={[
                                                    "text-sm truncate",
                                                    conv.unread ? "font-black text-[#1E293B]" : "font-bold text-[#1E293B]",
                                                ].join(" ")}
                                            >
                                                {conv.user.name}
                                            </h4>
                                            {conv.unread && (
                                                <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">
                                            {conv.latest_message || "Belum ada pesan"}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {formatRelative(conv.latest_message_at)}
                                        </p>
                                        <span className="inline-block mt-1 text-[10px] font-black text-[#F59E0B] opacity-0 group-hover:opacity-100 transition">
                                            Buka →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}