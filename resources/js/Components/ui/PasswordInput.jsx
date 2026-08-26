import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function PasswordInput({ label, value, onChange, error, autoComplete, placeholder, inputClass }) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                </div>
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    className={`${inputClass} pl-11 pr-11`}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    );
}
