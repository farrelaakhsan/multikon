import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Box,
    ShoppingCart,
    Building2,
    Store,
    MessageCircle,
    CreditCard,
    ExternalLink,
    LogOut,
} from "lucide-react";
import { Toast } from "../Components/ui/Toast";

const MENU_GROUPS = [
    {
        label: "Umum",
        items: [
            { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
            { key: "produk", label: "Produk", icon: Box, href: "/admin/products" },
            { key: "pesanan", label: "Pesanan", icon: ShoppingCart, href: "/admin/orders" },
        ],
    },
    {
        label: "Kemitraan B2B",
        items: [
            { key: "pengajuan-b2b", label: "Pengajuan B2B", icon: Store, href: "/admin/b2b", badgeKey: "pendingB2bCount" },
            { key: "kelola-b2b", label: "Kelola B2B", icon: Building2, href: "/admin/b2b/manage" },
        ],
    },
    {
        label: "Lainnya",
        items: [
            { key: "konsultasi", label: "Konsultasi Custom", icon: MessageCircle, href: "/admin/chats" },
            { key: "pembayaran", label: "Pembayaran", icon: CreditCard, href: "/admin/payment-settings" },
        ],
    },
];

/* ─── Sidebar Logo ──────────────────────────────────────────────────── */

function SidebarLogo() {
    return (
        <div className="px-6 pt-6 pb-5">
            <Link href="/admin" className="block">
                <div className="flex items-center gap-2.5">
                    <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center font-medium text-[17px] text-slate-800 shrink-0 shadow-[0_4px_10px_rgba(245,158,11,0.35)]">
                        M
                    </div>
                    <div>
                        <div className="text-base font-medium text-white italic tracking-tight leading-tight">
                            Multikon
                        </div>
                        <div className="text-[9.5px] text-slate-500 tracking-[0.1em] uppercase mt-0.5">
                            Admin Panel
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

/* ─── Sidebar Nav ───────────────────────────────────────────────────── */

function SidebarNav({ activeKey, badgeCounts }) {
    return (
        <nav className="flex-1 px-4 flex flex-col overflow-y-auto">
            {MENU_GROUPS.map((group) => (
                <div key={group.label}>
                    <div className="text-[9.5px] font-medium text-slate-600 uppercase tracking-[0.1em] px-3 pt-5 pb-2 first:pt-0">
                        {group.label}
                    </div>
                    {group.items.map((item) => (
                        <SidebarNavItem
                            key={item.key}
                            item={item}
                            active={activeKey === item.key}
                            badgeCount={item.badgeKey ? badgeCounts?.[item.badgeKey] : undefined}
                        />
                    ))}
                </div>
            ))}
        </nav>
    );
}

function SidebarNavItem({ item, active, badgeCount }) {
    const Icon = item.icon;

    if (active) {
        return (
            <Link
                href={item.href}
                className="flex items-center gap-3 pl-2.5 pr-3 py-2.5 rounded-[11px] mb-0.5 bg-amber-500/10 border-l-[3px] border-amber-500"
            >
                <Icon size={16} className="text-amber-400" />
                <span className="text-[13px] font-medium text-amber-200">
                    {item.label}
                </span>
            </Link>
        );
    }

    return (
        <Link
            href={item.href}
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-[11px] mb-0.5 text-slate-400 text-[13px] hover:bg-white/[0.04] hover:text-slate-200 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Icon size={16} className="text-slate-500" />
                {item.label}
            </div>
            {!!badgeCount && (
                <span className="bg-red-500 text-white text-[10px] font-medium min-w-[17px] h-[17px] rounded-full flex items-center justify-center px-1.5 shadow-[0_2px_6px_rgba(239,68,68,0.5)]">
                    {badgeCount}
                </span>
            )}
        </Link>
    );
}

/* ─── Sidebar Footer ────────────────────────────────────────────────── */

function SidebarFooter({ admin, onLogout, onGoPublic }) {
    const initials = (admin?.name || "A")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="mx-3 mb-4 p-4 bg-white/[0.04] border border-white/[0.06] rounded-2xl">
            <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-medium text-slate-200 shrink-0">
                    {initials}
                </div>
                <div className="overflow-hidden">
                    <div className="text-[12.5px] font-medium text-slate-200 truncate">
                        {admin?.name}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate">
                        {admin?.email}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onGoPublic}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border border-white/10 text-slate-400 text-[11.5px] hover:bg-white/[0.06] transition"
                >
                    <ExternalLink size={13} />
                    Publik
                </button>
                <button
                    onClick={onLogout}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] bg-gradient-to-br from-red-400 to-red-500 text-white text-[11.5px] font-medium shadow-[0_3px_8px_rgba(239,68,68,0.3)] hover:brightness-110 transition"
                >
                    <LogOut size={13} />
                    Logout
                </button>
            </div>
        </div>
    );
}

/* ─── Main Layout ───────────────────────────────────────────────────── */

export default function AdminLayout({ children, title }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const pendingB2bCount = props.pendingB2bCount || 0;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        if (props.flash?.success) {
            const id = Date.now();
            setToasts((prev) => [...prev, { id, type: "success", message: props.flash.success }]);
        }
        if (props.flash?.error) {
            const id = Date.now();
            setToasts((prev) => [...prev, { id, type: "error", message: props.flash.error }]);
        }
    }, [props.flash]);

    useEffect(() => {
        if (props.errors && Object.keys(props.errors).length > 0) {
            const id = Date.now();
            setToasts((prev) => [...prev, { id, type: "error", message: "Ada kesalahan pada data yang dikirim. Silakan periksa kembali." }]);
        }
    }, [props.errors]);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getActiveKey = () => {
        const cleanUrl = url.split("?")[0].replace(/\/$/, "");
        if (cleanUrl === "/admin" || cleanUrl === "") return "dashboard";

        const segment = cleanUrl.replace("/admin/", "").split("/")[0];

        const segmentMap = {
            products: "produk",
            orders: "pesanan",
            b2b: "pengajuan-b2b",
            chats: "konsultasi",
            "payment-settings": "pembayaran",
        };

        if (segment === "b2b") {
            const sub = cleanUrl.replace("/admin/b2b", "").replace(/^\//, "");
            if (sub === "manage") return "kelola-b2b";
            return "pengajuan-b2b";
        }

        return segmentMap[segment] || segment;
    };

    const activeKey = getActiveKey();

    const handleLogout = () => {
        router.post("/logout");
    };

    const handleGoPublic = () => {
        router.get("/");
    };

    return (
        <div className="min-h-screen bg-surface-alt flex">
            {/* Sidebar */}
            <aside
                className={[
                    "fixed inset-y-0 left-0 z-40 w-[272px] bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col transition-transform duration-300 shadow-[0_20px_40px_rgba(15,23,42,0.25)] m-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0",
                ].join(" ")}
            >
                <SidebarLogo />
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mx-0 mb-4" />
                <SidebarNav
                    activeKey={activeKey}
                    badgeCounts={{ pendingB2bCount }}
                />
                <SidebarFooter
                    admin={user}
                    onLogout={handleLogout}
                    onGoPublic={handleGoPublic}
                />
            </aside>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col lg:ml-[272px]">
                {/* Topbar */}
                <header className="bg-white border-b border-[#1E293B]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-[#F8F9FA] transition"
                            onClick={() => setSidebarOpen((p) => !p)}
                            aria-label="Toggle sidebar"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-5 w-5"
                            >
                                <path
                                    d="M4 6h16M4 12h16M4 18h16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                        {title && (
                            <h1 className="text-lg font-black italic uppercase tracking-tighter text-[#1E293B]">
                                {title}
                            </h1>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-6">{children}</main>

                {/* Toast Popups */}
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
}
