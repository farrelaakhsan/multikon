import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", { onFinish: () => reset("password") });
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-12">
            <Head title="Login" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="w-12 h-12 rounded-xl bg-[#F59E0B] flex items-center justify-center">
                                <span className="text-[#1E293B] text-2xl font-black">M</span>
                            </span>
                        </div>
                        <span className="text-3xl font-black italic uppercase tracking-tighter text-[#1E293B]">
                            Multikon
                        </span>
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-2">
                        Masuk ke Akun Anda
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] border border-[#1E293B]/10 shadow-sm p-8 lg:p-10">
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-[#1E293B] mb-6">
                        Masuk
                    </h1>

                    {status && (
                        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-bold">
                            {status}
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
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1.5">
                                    {errors.email}
                                </p>
                            )}
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
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1.5">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]"
                                />
                                <span className="text-xs font-bold text-slate-500">
                                    Ingat saya
                                </span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-bold text-[#F59E0B] hover:text-[#1E293B] transition"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#F59E0B] text-[#1E293B] py-4 rounded-xl font-black uppercase tracking-wider text-sm shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? "Masuk..." : "Masuk"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500">
                            Belum punya akun?{" "}
                            <Link
                                href="/register"
                                className="font-black text-[#F59E0B] hover:text-[#1E293B] transition"
                            >
                                Daftar
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#F59E0B] transition"
                    >
                        ← Kembali ke Website
                    </Link>
                </div>
            </div>
        </div>
    );
}