import { CircleCheck } from "lucide-react";

const securityTips = [
    "Gunakan minimal 8 karakter",
    "Campurkan huruf besar, kecil, angka, dan simbol",
    "Jangan gunakan password yang sama dengan akun lain",
    "Ubah password secara berkala",
];

export default function SecurityTips() {
    return (
        <div className="bg-white rounded-[20px] border border-slate-200 p-7 sm:p-8">
            <p className="text-[11px] font-medium text-slate-400 mb-4 tracking-wide">TIPS KEAMANAN</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
                {securityTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                        <CircleCheck size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[13px] text-slate-600 leading-relaxed">{tip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
