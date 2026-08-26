import { Head, Link, useForm } from "@inertiajs/react";

export default function AdminLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/login", { onFinish: () => reset("password") });
    };

    return (
        <div className="min-h-screen bg-[#1E293B] flex items-center justify-center px-4 py-12">
            <Head title="Admin Login" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="w-14 h-14 rounded-2xl bg-[#F59E0B] flex items-center justify-center shadow-lg shadow-amber-900/30">
                                <span className="text-[#1E293B] text-2xl font-black">
                                    M
                                </span>
                            </span>
                        </div>
                        <span className="text-3xl font-black italic uppercase tracking-tighter text-white">
                            Multikon
                        </span>
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#F59E0B] mt-3">
                        Admin Panel
                    </p>
                </div>

                <div className="bg-[#F8F9FA] rounded-[2rem] shadow-2xl shadow-black/20 p-8 lg:p-10">
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-[#1E293B] mb-6">
                        Masuk sebagai Admin
                    </h1>

                    {errors.email && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-bold">
                            {errors.email}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                autoFocus
                                autoComplete="email"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 transition"
                                placeholder="email@domain.com"
                            />
                        </div>

                        <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#F59E0B] text-[#1E293B] py-4 rounded-xl font-black uppercase tracking-wider text-sm shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? "Memverifikasi..." : "Masuk ke Admin"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <Link
                            href="/login"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#F59E0B] transition"
                        >
                            ← Login untuk Pengguna Biasa
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition"
                    >
                        ← Kembali ke Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
