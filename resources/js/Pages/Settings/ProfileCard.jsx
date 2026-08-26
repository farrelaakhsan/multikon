import { useState } from "react";
import { router } from "@inertiajs/react";
import { User, Mail, AlertCircle } from "lucide-react";

export default function ProfileCard({ user }) {
    const [form, setForm] = useState({ name: user.name || "", email: user.email || "" });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        router.post("/settings/profile", form, {
            onFinish: () => setProcessing(false),
            onError: (err) => setErrors(err),
        });
    };

    return (
        <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
            <div className="flex">
                <div className="w-1 flex-shrink-0 bg-amber-500" />
                <div className="flex-1 p-7 sm:p-8">

                    {/* Header: avatar + name */}
                    <div className="flex items-center gap-3.5 mb-6">
                        <div className="w-12 h-12 rounded-[10px] bg-slate-800 flex items-center justify-center text-amber-500">
                            <User size={22} />
                        </div>
                        <div>
                            <p className="text-base font-medium text-slate-900">{user.name}</p>
                            <p className="text-[13px] text-slate-400">{user.email}</p>
                        </div>
                    </div>

                    {/* Fields: 2-col grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5.5">
                        <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                NAMA LENGKAP
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <User size={15} />
                                </div>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={`w-full rounded-[10px] border px-3.5 py-2.5 pl-11 text-[13px] text-slate-900 bg-transparent outline-none transition ${
                                        errors.name ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-slate-400"
                                    }`}
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />{errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                ALAMAT EMAIL
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail size={15} />
                                </div>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={`w-full rounded-[10px] border px-3.5 py-2.5 pl-11 text-[13px] text-slate-900 bg-transparent outline-none transition ${
                                        errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-slate-400"
                                    }`}
                                    placeholder="Masukkan alamat email"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />{errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer: save button */}
                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-slate-900 text-[13.5px] font-medium rounded-full px-7 py-2.5 transition-colors"
                        >
                            {processing ? "Menyimpan..." : "Simpan perubahan"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
