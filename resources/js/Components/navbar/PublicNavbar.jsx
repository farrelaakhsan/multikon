import { useState, useRef, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function PublicNavbar() {
    const { url, props } = usePage();
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const menuRef = useRef(null);

    const user = props.auth?.user ?? null;
    const cartCount = props.cartCount ?? 0;
    const activeOrderCount = props.activeOrderCount ?? 0;

    const isActive = (path) =>
        path === "/" ? url === "/" : url === path || url.startsWith(path + "/");

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/catalog", label: "Catalog" },
    ];

    const handleLogout = () => {
        setOpen(false);
        setUserMenuOpen(false);
        router.post("/logout");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearchOpen(false);
        setSearchQuery("");
        router.get("/catalog", { search: searchQuery.trim() });
    };

    const closeSearch = () => {
        setSearchOpen(false);
        setSearchQuery("");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        const handleEsc = (e) => {
            if (e.key === "Escape") closeSearch();
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-[#1E293B] border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center h-16">
                    {/* Logo — kiri */}
                    <Link href="/" className="flex items-center gap-2 mr-auto">
                        <span className="w-7 h-7 rounded-md bg-[#F59E0B] flex items-center justify-center shrink-0">
                            <span className="text-[#1E293B] text-[10px] font-black">
                                M
                            </span>
                        </span>
                        <span className="text-white text-sm font-black uppercase tracking-[0.15em]">
                            Multikon
                        </span>
                    </Link>

                    {/* Nav links — center (desktop) */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`
                                    relative px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition rounded-lg
                                    ${
                                        isActive(href)
                                            ? "text-[#F59E0B] bg-white/5"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                {label}
                                {isActive(href) && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F59E0B]" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right section — desktop */}
                    <div className="hidden md:flex items-center ml-auto gap-2">
                        {searchOpen ? (
                            <form onSubmit={handleSearch} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk..."
                                    className="w-64 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-400 outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30"
                                    autoFocus
                                />
                                <button type="submit" className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition" title="Cari">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                        <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button type="button" onClick={closeSearch} className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition" title="Tutup">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(true)}
                                    className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                                    title="Cari Produk"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                        <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                {/* Cart Icon */}
                                {user && (
                                    <Link
                                        href="/cart"
                                        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition relative"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                            <path d="M3.75 4.5h16.5l-1.5 12H5.25l-1.5-12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M18 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-[19px] h-[19px] rounded-full bg-[#F59E0B] text-[#1E293B] text-[8px] font-black flex items-center justify-center shadow-sm">
                                                {cartCount > 9 ? "9+" : cartCount}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* Auth */}
                                <div className="flex items-center">
                                    {user ? (
                                        <div className="relative" ref={menuRef}>
                                            <button
                                                type="button"
                                                onClick={() => setUserMenuOpen((p) => !p)}
                                                className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4.5 20.118c0-2.75 3.25-4.5 7.5-4.5s7.5 1.75 7.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>

                                            {userMenuOpen && (
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#1E293B]/10 shadow-xl shadow-black/10 overflow-hidden">
                                                    <div className="px-5 py-4 border-b border-slate-100">
                                                        <p className="text-xs font-bold text-[#1E293B] truncate">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>

                                                    <div className="p-1.5 space-y-0.5">
                                                        <Link
                                                            href="/orders"
                                                            onClick={() => setUserMenuOpen(false)}
                                                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 hover:text-[#1E293B] hover:bg-[#F8F9FA] transition"
                                                        >
                                                            <span className="flex items-center gap-3">
                                                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                                                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                Pesanan Saya
                                                            </span>
                                                            {activeOrderCount > 0 && (
                                                                <span className="bg-[#F59E0B] text-[#1E293B] text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                                                                    {activeOrderCount}
                                                                </span>
                                                            )}
                                                        </Link>
                                                        <Link
                                                            href={user.is_b2b_verified ? "/b2b/dashboard" : "/b2b"}
                                                            onClick={() => setUserMenuOpen(false)}
                                                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 hover:text-[#1E293B] hover:bg-[#F8F9FA] transition"
                                                        >
                                                            <span className="flex items-center gap-3">
                                                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                                                                    <path d="M4 4a2 2 0 012-2h5.586A2 2 0 0113 2.586L16.414 6A2 2 0 0117 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                Akun Bisnis
                                                            </span>
                                                            <span className="text-[9px] text-slate-400 normal-case tracking-normal font-normal">
                                                                {user.is_b2b_verified ? 'Dashboard Bisnis' : 'Pengajuan B2B'}
                                                            </span>
                                                        </Link>
                                                        <Link
                                                            href="/settings"
                                                            onClick={() => setUserMenuOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 hover:text-[#1E293B] hover:bg-[#F8F9FA] transition"
                                                        >
                                                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                                                                <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 7a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 7.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM10 10a2 2 0 10-4 0 2 2 0 004 0zM17.25 10.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM4.25 13.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 14.25a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" />
                                                            </svg>
                                                            Settings
                                                        </Link>
                                                    </div>

                                                    <div className="border-t border-slate-100 p-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={handleLogout}
                                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                                                        >
                                                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                                <path d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2z" />
                                                                <path d="M5.35 5.35a.75.75 0 010 1.06A6.5 6.5 0 1016.5 10a6.5 6.5 0 00-4.85-6.24.75.75 0 01.46-1.43 8 8 0 11-7.76 1.02.75.75 0 011.06 0z" />
                                                            </svg>
                                                            Logout
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="text-[11px] font-black uppercase tracking-[0.15em] bg-[#F59E0B] text-[#1E293B] px-5 py-2.5 rounded-full hover:brightness-105 transition"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Hamburger — mobile */}
                    <button
                        type="button"
                        className="md:hidden ml-auto p-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                        aria-label={open ? "Tutup menu" : "Buka menu"}
                        onClick={() => setOpen((p) => !p)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5"
                            aria-hidden="true"
                        >
                            {open ? (
                                <>
                                    <path
                                        d="M6 6l12 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M18 6L6 18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </>
                            ) : (
                                <>
                                    <path
                                        d="M4 6h16"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M4 12h10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M4 18h16"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-[#1E293B] border-t border-white/10 px-6 py-4">
                    {/* Search — mobile */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari produk..."
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30"
                            />
                            <button type="submit" className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#F59E0B] text-[#1E293B] hover:brightness-105 transition" title="Cari">
                                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                    <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Cart link — mobile */}
                    {user && (
                        <Link
                            href="/cart"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between w-full px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 transition mb-2"
                        >
                            <span>Keranjang</span>
                            {cartCount > 0 && (
                                <span className="bg-[#F59E0B] text-[#1E293B] text-[10px] font-black px-2 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Nav links */}
                    <div className="space-y-0.5 mb-4">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`
                                    flex items-center justify-between px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition
                                    ${
                                        isActive(href)
                                            ? "bg-white/10 text-[#F59E0B]"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                {label}
                                {isActive(href) && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 pt-4 space-y-2">
                        {user ? (
                            <>
                                {user.is_admin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 transition"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                        Dashboard Admin
                                    </Link>
                                )}
                                <Link
                                    href="/orders"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-between w-full px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 transition"
                                >
                                    <span className="flex items-center gap-3">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-500">
                                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Pesanan Saya
                                    </span>
                                    {activeOrderCount > 0 && (
                                        <span className="bg-[#F59E0B] text-[#1E293B] text-[10px] font-black px-2 py-0.5 rounded-full leading-none">
                                            {activeOrderCount}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href={user.is_b2b_verified ? "/b2b/dashboard" : "/b2b"}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-between w-full px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 transition"
                                >
                                    <span className="flex items-center gap-3">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-500">
                                            <path d="M4 4a2 2 0 012-2h5.586A2 2 0 0113 2.586L16.414 6A2 2 0 0117 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Akun Bisnis
                                    </span>
                                    <span className="text-[9px] text-slate-500 normal-case tracking-normal font-normal">
                                        {user.is_b2b_verified ? 'Dashboard Bisnis' : 'Pengajuan B2B'}
                                    </span>
                                </Link>
                                <Link
                                    href="/settings"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 transition"
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-500">
                                        <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 7a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 7.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM10 10a2 2 0 10-4 0 2 2 0 004 0zM17.25 10.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM4.25 13.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 14.25a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" />
                                    </svg>
                                    Settings
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-red-400 hover:bg-white/5 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="block px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="block text-center px-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] bg-[#F59E0B] text-[#1E293B] hover:brightness-105 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
