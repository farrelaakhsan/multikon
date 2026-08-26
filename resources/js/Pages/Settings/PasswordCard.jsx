import { useState } from "react";
import { router } from "@inertiajs/react";
import { Lock } from "lucide-react";
import PasswordInput from "../../Components/ui/PasswordInput";

export default function PasswordCard() {
    const [form, setForm] = useState({ current_password: "", password: "", password_confirmation: "" });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        router.post("/settings/password", form, {
            onFinish: () => {
                setProcessing(false);
                setForm({ current_password: "", password: "", password_confirmation: "" });
            },
            onError: (err) => setErrors(err),
        });
    };

    const inputClass = (field) =>
        `w-full rounded-[10px] border px-3.5 py-2.5 pl-10 pr-11 text-[13px] outline-none transition
        ${errors[field]
            ? "border-red-400 focus:border-red-500"
            : "border-slate-200 focus:border-slate-400"
        }`;

    return (
        <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
            <div className="flex">
                <div className="w-1 flex-shrink-0 bg-blue-500" />
                <div className="flex-1 p-7 sm:p-8">

                    <div className="flex items-center gap-3.5 mb-6">
                        <div className="w-12 h-12 rounded-[10px] bg-slate-800 flex items-center justify-center text-amber-500">
                            <Lock size={22} />
                        </div>
                        <div>
                            <p className="text-base font-medium text-slate-900">Ubah password</p>
                            <p className="text-[13px] text-slate-500">Pastikan akun kamu menggunakan password yang kuat</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                            <PasswordInput
                                label="PASSWORD SAAT INI"
                                value={form.current_password}
                                onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                                error={errors.current_password}
                                autoComplete="current-password"
                                placeholder="Masukkan password saat ini"
                                inputClass={inputClass("current_password")}
                            />
                            <PasswordInput
                                label="PASSWORD BARU"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                error={errors.password}
                                autoComplete="new-password"
                                placeholder="Minimal 8 karakter"
                                inputClass={inputClass("password")}
                            />
                            <PasswordInput
                                label="KONFIRMASI PASSWORD BARU"
                                value={form.password_confirmation}
                                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                error={errors.password_confirmation}
                                autoComplete="new-password"
                                placeholder="Ulangi password baru"
                                inputClass={inputClass("password_confirmation")}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-70 text-white text-[13.5px] font-medium rounded-full px-7 py-2.5 transition-colors"
                            >
                                {processing ? "Memperbarui..." : "Perbarui password"}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
