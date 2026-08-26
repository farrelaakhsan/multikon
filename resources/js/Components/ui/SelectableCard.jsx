import { Link } from "@inertiajs/react";

export function SelectableCard({ selected, onClick, icon, label, desc, account, accountName, locked, lockReason, disabled }) {
    const isSelected = selected;
    const isLocked = Boolean(locked);

    const body = (
        <>
            <span className={`text-2xl mt-0.5 ${isLocked ? "grayscale opacity-50" : ""}`}>{icon}</span>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-black ${isLocked ? "text-slate-400" : isSelected ? "text-[#1E293B]" : "text-slate-800"}`}>{label}</p>
                <p className={`text-[10px] ${isLocked ? "text-slate-400" : "text-slate-500"} mt-0.5 leading-relaxed`}>{desc}</p>
                {isSelected && account && (
                    <p className="text-[10px] font-black text-[#F59E0B] mt-1 font-mono">{account} — {accountName}</p>
                )}
            </div>
            <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                isLocked ? "border-slate-300 bg-slate-100" : isSelected ? "border-[#F59E0B] bg-[#F59E0B]" : "border-slate-300"
            }`}>
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
            </div>
            {isLocked && <LockedB2BInfo reason={lockReason} />}
        </>
    );

    if (isLocked || disabled) {
        return (
            <div className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 cursor-not-allowed transition">
                {body}
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition ${
                isSelected ? "border-[#F59E0B] bg-[#F59E0B]/10 shadow-lg" : "border-slate-200 bg-white hover:border-[#1E293B]/30"
            }`}
        >
            {body}
        </button>
    );
}

export function ShippingTypeCard({ method, selected, onSelect }) {
    const isSelected = selected === method.key;
    return (
        <button
            type="button"
            onClick={() => onSelect(method.key)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
                isSelected ? "border-[#F59E0B] bg-[#F59E0B]/10" : "border-slate-200 bg-white hover:border-[#1E293B]/30"
            }`}
        >
            <span className="text-2xl">{method.icon}</span>
            <div className="flex-1">
                <p className={`text-sm font-black ${isSelected ? "text-[#1E293B]" : "text-slate-800"}`}>{method.label}</p>
                <p className="text-[10px] text-slate-500">{method.desc}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#F59E0B] bg-[#F59E0B]" : "border-slate-300"}`}>
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
            </div>
        </button>
    );
}

function LockedB2BInfo({ reason }) {
    return (
        <span className="group relative inline-flex w-5 h-5 rounded-full bg-slate-200 items-center justify-center cursor-help shrink-0">
            <span className="text-[10px] font-black text-slate-500 leading-none">i</span>
            <span className="absolute top-6 right-0 z-50 w-56 rounded-xl bg-slate-900 text-white p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 shadow-2xl">
                <span className="block text-[11px] leading-snug">
                    {reason || "Metode ini hanya tersedia untuk akun bisnis (B2B) terverifikasi."}
                </span>
                <span className="block text-[11px] leading-snug mt-1">
                    Lakukan pengajuan akun bisnis untuk membuka opsi pembayaran ini.
                </span>
                <Link
                    href="/b2b"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 mt-2 text-[10px] font-black uppercase tracking-widest text-[#F59E0B] hover:underline"
                >
                    Ajukan Sekarang
                </Link>
            </span>
        </span>
    );
}
