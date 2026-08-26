import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

const BANK_STYLES = {
    BCA: { badge: "bg-blue-100 text-blue-700" },
    BRI: { badge: "bg-emerald-100 text-emerald-700" },
    Mandiri: { badge: "bg-amber-100 text-amber-700" },
    BNI: { badge: "bg-orange-100 text-orange-700" },
    BTN: { badge: "bg-purple-100 text-purple-700" },
    CIMB: { badge: "bg-rose-100 text-rose-700" },
    Danamon: { badge: "bg-cyan-100 text-cyan-700" },
    Permata: { badge: "bg-indigo-100 text-indigo-700" },
};

function getBadgeClass(bankName) {
    return BANK_STYLES[bankName]?.badge || "bg-slate-100 text-slate-700";
}

export default function PaymentSettingsIndex({ settings }) {
    const [bankAccounts, setBankAccounts] = useState(
        settings.bank_accounts && settings.bank_accounts.length > 0
            ? settings.bank_accounts.map((a) => ({ ...a }))
            : []
    );
    const [qrisFile, setQrisFile] = useState(null);
    const [qrisPreview, setQrisPreview] = useState(null);
    const [removeQris, setRemoveQris] = useState(false);
    const [saving, setSaving] = useState(false);

    const updateBank = (index, field, value) => {
        setBankAccounts((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const addBank = () => {
        setBankAccounts((prev) => [...prev, { bank: "", account: "", name: "" }]);
    };

    const removeBank = (index) => {
        setBankAccounts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleQrisFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrisFile(file);
            setRemoveQris(false);
            const reader = new FileReader();
            reader.onload = (ev) => setQrisPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveQris = () => {
        setQrisFile(null);
        setQrisPreview(null);
        setRemoveQris(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);

        const payload = new FormData();
        payload.append("bank_accounts", JSON.stringify(bankAccounts));

        if (qrisFile) {
            payload.append("qris_image", qrisFile);
        }
        if (removeQris && !qrisFile) {
            payload.append("remove_qris", "1");
        }

        router.post("/admin/payment-settings", payload, {
            forceFormData: true,
            onFinish: () => setSaving(false),
        });
    };

    const inputClass =
        "w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-semibold text-[#1E293B] placeholder:text-slate-400 bg-white focus:border-[#F59E0B] focus:ring-0 transition outline-none";

    const labelClass =
        "block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5";

    const hasQris = settings.qris_image_url && !qrisPreview && !removeQris;

    return (
        <AdminLayout title="Pembayaran">
            <Head title="Pengaturan Pembayaran - Admin" />

            <div className="max-w-6xl mx-auto">
                {/* ── HEADER ─────────────────────────────────── */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1E293B] flex items-center justify-center text-2xl shrink-0">
                        💳
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-[#1E293B]">
                            Pengaturan Pembayaran
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                            Kelola rekening bank dan QRIS yang ditampilkan ke pelanggan
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* ── QRIS CARD ───────────────────────────── */}
                        <div className="lg:col-span-2 flex">
                            <div className="bg-white rounded-3xl border border-[#1E293B]/10 shadow-sm overflow-hidden flex-1 flex flex-col">
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-base shrink-0">
                                        📱
                                    </div>
                                    <h2 className="text-sm font-black italic uppercase tracking-tight text-[#1E293B]">
                                        QRIS
                                    </h2>
                                </div>

                                <div className="p-5 flex-1 flex flex-col gap-3">
                                    {hasQris && (
                                        <div className="relative inline-block">
                                            <img
                                                src={settings.qris_image_url}
                                                alt="QRIS"
                                                className="max-h-40 rounded-xl shadow-sm border border-slate-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveQris}
                                                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold hover:bg-red-600 transition shadow-md"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex-1 flex flex-col">
                                        <label className={labelClass}>
                                            {hasQris ? "Ganti Gambar QRIS" : "Upload Gambar QRIS"}
                                        </label>
                                        <label className="flex-1 flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-2xl p-5 cursor-pointer hover:border-[#F59E0B] transition">
                                            {qrisPreview ? (
                                                <img src={qrisPreview} alt="Preview QRIS" className="max-h-28 rounded-xl shadow-sm" />
                                            ) : (
                                                <div className="text-center">
                                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-slate-300 mx-auto mb-2">
                                                        <path d="M4.5 2A2.5 2.5 0 002 4.5v2.879a2.5 2.5 0 00.732 1.767l.94.94a.75.75 0 001.06-1.06l-.94-.94A1 1 0 013.5 7.38V4.5a1 1 0 011-1h2.88a1 1 0 01.708.293l.94.94a.75.75 0 001.06-1.06l-.94-.94A2.5 2.5 0 007.38 2H4.5zm0 16A2.5 2.5 0 012 15.5v-2.88a2.5 2.5 0 01.732-1.767l-.94-.94a.75.75 0 011.06-1.06l.94.94A2.5 2.5 0 015.5 14.62v2.88a1 1 0 001 1h2.88a1 1 0 00.708-.293l.94-.94a.75.75 0 011.06 1.06l-.94.94A2.5 2.5 0 019.38 20H5.5zm11-13.5A2.5 2.5 0 0114 4.5v2.88a2.5 2.5 0 01-.732 1.767l.94.94a.75.75 0 01-1.06 1.06l-.94-.94A2.5 2.5 0 0112 8.38V5.5a1 1 0 00-1-1H8.12a1 1 0 00-.708.293l-.94.94a.75.75 0 01-1.06-1.06l.94-.94A2.5 2.5 0 018.62 2H13a2.5 2.5 0 012.5 2.5zm-2.5 7.5a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5a.75.75 0 01.75-.75z" />
                                                    </svg>
                                                    <p className="text-xs font-bold text-slate-500">Klik atau taruh file di sini</p>
                                                    <p className="text-[9px] text-slate-400 mt-0.5">JPG, PNG, WEBP — Maks 2MB</p>
                                                </div>
                                            )}
                                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleQrisFile} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── REKENING BANK CARD ──────────────────── */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-3xl border border-[#1E293B]/10 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-base shrink-0">
                                        🏦
                                    </div>
                                    <h2 className="text-sm font-black italic uppercase tracking-tight text-[#1E293B]">
                                        Rekening Bank
                                    </h2>
                                    <span className="ml-auto text-[10px] text-slate-400 font-bold bg-[#F8F9FA] px-2.5 py-1 rounded-full">
                                        {bankAccounts.length}
                                    </span>
                                </div>

                                <div className="p-5 space-y-3">
                                    {bankAccounts.map((acc, i) => (
                                        <div
                                            key={i}
                                            className="bg-[#F8F9FA] rounded-2xl p-4 relative border border-slate-200/60 transition hover:border-slate-300"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <span
                                                    className={`text-[10px] font-black uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full ${getBadgeClass(acc.bank)}`}
                                                >
                                                    {acc.bank || "Bank"}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeBank(i)}
                                                    className="ml-auto w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition text-[10px]"
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div className="grid sm:grid-cols-3 gap-3">
                                                <div>
                                                    <label className={labelClass}>Nama Bank</label>
                                                    <input
                                                        type="text"
                                                        value={acc.bank}
                                                        onChange={(e) => updateBank(i, "bank", e.target.value)}
                                                        placeholder="BCA"
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Nomor Rekening</label>
                                                    <input
                                                        type="text"
                                                        value={acc.account}
                                                        onChange={(e) => updateBank(i, "account", e.target.value)}
                                                        placeholder="123 456 7890"
                                                        className={`${inputClass} font-mono`}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Atas Nama</label>
                                                    <input
                                                        type="text"
                                                        value={acc.name}
                                                        onChange={(e) => updateBank(i, "name", e.target.value)}
                                                        placeholder="CV Multikon Erindotama"
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addBank}
                                        className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-3 text-sm font-bold text-slate-500 hover:border-[#F59E0B] hover:text-[#F59E0B] transition flex items-center justify-center gap-2"
                                    >
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                        </svg>
                                        Tambah Rekening
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SUBMIT ──────────────────────────────── */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-[#F59E0B] text-[#1E293B] py-3.5 rounded-2xl font-black uppercase tracking-wider text-sm shadow-lg shadow-[#F59E0B]/30 hover:brightness-105 transition disabled:opacity-60 disabled:cursor-not-allowed mt-6"
                    >
                        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
