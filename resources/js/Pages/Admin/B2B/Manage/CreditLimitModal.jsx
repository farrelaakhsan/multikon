import { Wallet } from "lucide-react";
import { formatPrice } from "../../../../utils/format";
import ModalShell from "../../../../Components/ui/ModalShell";

export default function CreditLimitModal({ company, form, setForm, onSubmit, onClose }) {
    if (!company) return null;

    return (
        <ModalShell
            open={!!company}
            onClose={onClose}
            title="Edit limit kredit"
            subtitle={
                company
                    ? `${company.company_name || company.name} \u00b7 Perubahan limit berlaku langsung setelah disimpan.`
                    : undefined
            }
            width="w-[380px]"
        >
            <form onSubmit={onSubmit}>
                <label className="text-xs text-slate-400 mb-1 block">
                    Limit kredit baru (Rp)
                </label>
                <input
                    type="number"
                    min="0"
                    value={form.credit_limit}
                    onChange={(e) =>
                        setForm({ ...form, credit_limit: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-[10px] px-3 py-2.5 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
                <p className="text-[10px] text-slate-400 mb-4">
                    Sisa limit saat ini: {formatPrice(company.remaining_credit)}
                </p>

                <label className="text-xs text-slate-400 mb-1 block">
                    Jatuh tempo ToP (hari)
                </label>
                <input
                    type="number"
                    min="1"
                    max="365"
                    value={form.top_tenure_days}
                    onChange={(e) =>
                        setForm({ ...form, top_tenure_days: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-[10px] px-3 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-600"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="bg-slate-800 text-white rounded-[9px] px-4 py-2 text-sm font-medium flex items-center gap-1.5 hover:bg-slate-700 transition"
                    >
                        <Wallet size={14} />
                        Simpan
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}
