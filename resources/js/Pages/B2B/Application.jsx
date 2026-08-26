import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Building2,
    Clock,
    Hourglass,
    Info,
    FileText,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import PublicLayout from "../../Layouts/PublicLayout";
import { formatPrice } from "../../utils/format";

function B2BStatusCard({ b2bStatus, rejectionReason, reviewEstimate }) {
    if (b2bStatus === "approved") {
        return (
            <div className="bg-white rounded-[20px] border-l-4 border-l-emerald-500 p-7 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-[10px] bg-emerald-50 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h1 className="text-slate-900 text-base font-bold">
                            Pengajuan Akun Bisnis (B2B)
                        </h1>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3.5 py-1.5 rounded-full">
                        ✓ Terverifikasi
                    </span>
                </div>
            </div>
        );
    }

    if (b2bStatus === "rejected") {
        return (
            <div className="bg-white rounded-[20px] border-l-4 border-l-red-500 p-7 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-[10px] bg-red-50 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-red-600" />
                        </div>
                        <h1 className="text-slate-900 text-base font-bold">
                            Pengajuan Akun Bisnis (B2B)
                        </h1>
                    </div>
                    <span className="bg-red-50 text-red-700 text-xs font-bold px-3.5 py-1.5 rounded-full">
                        ✕ Ditolak
                    </span>
                </div>

                {rejectionReason && (
                    <div className="bg-red-50 rounded-2xl p-4 mt-4 flex gap-3 items-start">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-red-800 text-[13.5px] font-bold">
                                Alasan Penolakan
                            </div>
                            <p className="text-red-700 text-[12.5px] mt-1 leading-relaxed">
                                {rejectionReason}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (b2bStatus === "pending") {
        return (
            <div className="bg-white rounded-[20px] border-l-4 border-l-blue-500 p-7 shadow-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[10px] bg-blue-50 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h1 className="text-slate-900 text-base font-bold">
                        Pengajuan Akun Bisnis (B2B)
                    </h1>
                </div>
                <span className="inline-block mt-3.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                    ● Menunggu Review
                </span>

                <div className="bg-slate-50 rounded-2xl p-4 mt-4 flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-slate-900 text-[13.5px] font-semibold">
                            Sedang ditinjau admin
                        </div>
                        <div className="text-slate-600 text-xs mt-0.5">
                            Pengajuan Anda sedang diverifikasi. Proses biasanya{" "}
                            {reviewEstimate || "1-2 hari kerja"}.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[20px] border-l-4 border-l-amber-500 p-7 shadow-sm">
            <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-amber-50 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-amber-600" />
                </div>
                <h1 className="text-slate-900 text-base font-bold">
                    Pengajuan Akun Bisnis (B2B)
                </h1>
            </div>
            <p className="text-slate-600 text-[13px] mt-2">
                Verifikasi bisnis untuk mengaktifkan pembayaran Tempo (ToP) dan
                Termin.
            </p>
            <span className="inline-block mt-3.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                ● Belum Mengajukan
            </span>
        </div>
    );
}

/* ─── B2BCreditInfoCard ─────────────────────────────────────────────── */

function B2BCreditInfoCard({ creditLimit, remainingCredit, topTenureDays }) {
    return (
        <div className="bg-white rounded-[20px] p-7 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="text-slate-400 text-[11px]">
                        Credit Limit
                    </div>
                    <div className="text-slate-900 text-lg font-extrabold mt-0.5">
                        {formatPrice(creditLimit)}
                    </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="text-slate-400 text-[11px]">
                        Sisa Limit Kredit
                    </div>
                    <div className="text-emerald-600 text-lg font-extrabold mt-0.5">
                        {formatPrice(remainingCredit)}
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 rounded-2xl px-4 py-3.5 mt-3 flex items-center justify-between">
                <span className="text-slate-600 text-[12.5px]">
                    Jatuh Tempo ToP
                </span>
                <span className="text-slate-900 text-[13px] font-bold">
                    Net {topTenureDays} Hari
                </span>
            </div>
        </div>
    );
}

/* ─── PaymentSchemeTerminInfoCard ───────────────────────────────────── */

function PaymentSchemeTerminInfoCard() {
    const stages = [
        { percentage: 40, label: "DP / Pembayaran Awal" },
        { percentage: 40, label: "Produksi" },
        { percentage: 20, label: "Pelunasan" },
    ];

    return (
        <div className="bg-white rounded-[20px] p-7 shadow-sm">
            <h2 className="text-slate-900 text-sm font-bold">
                Skema Pembayaran Termin (Custom)
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 mb-4">
                Berlaku untuk pelanggan B2B terverifikasi pada pesanan produk
                Custom
            </p>

            <div className="grid grid-cols-3 gap-3">
                {stages.map((stage) => (
                    <div
                        key={stage.label}
                        className="bg-slate-50 rounded-2xl p-4 text-center"
                    >
                        <div className="text-slate-900 text-xl font-extrabold">
                            {stage.percentage}%
                        </div>
                        <div className="text-slate-600 text-[11.5px] mt-1 leading-tight">
                            {stage.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── PaymentTopInfoCard ────────────────────────────────────────────── */

function PaymentTopInfoCard() {
    return (
        <div className="bg-white rounded-[20px] p-7 shadow-sm">
            <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-blue-50 flex items-center justify-center">
                    <Hourglass className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-slate-900 text-sm font-bold">
                    Pembayaran Tempo (ToP)
                </h2>
            </div>
            <p className="text-slate-400 text-xs mt-2 mb-4">
                Bayar penuh setelah barang diterima — cocok untuk arus kas
                bisnis Anda
            </p>

            <div className="bg-slate-50 rounded-2xl px-4 py-4 flex items-center justify-between mb-3.5">
                <div>
                    <div className="text-slate-400 text-[11px]">
                        Jatuh Tempo
                    </div>
                    <div className="text-slate-900 text-[17px] font-extrabold mt-0.5">
                        Net 30 Hari
                    </div>
                </div>
                <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    Minimal
                </span>
            </div>

            <div className="flex gap-2.5 items-start">
                <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Tenor jatuh tempo dapat lebih panjang tergantung hasil
                    verifikasi dan kebijakan untuk masing-masing pelanggan B2B.
                </p>
            </div>
        </div>
    );
}

/* ─── FileUploadBox ─────────────────────────────────────────────────── */

function FileUploadBox({
    acceptLabel,
    compact = false,
    className = "",
    onChange,
    error,
    value,
}) {
    return (
        <div className={className}>
            <label
                className={`flex flex-col items-center justify-center gap-1.5 border-[1.5px] border-dashed border-slate-300 bg-white rounded-xl cursor-pointer hover:border-amber-500 transition ${
                    compact ? "py-3" : "py-4"
                }`}
            >
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 text-[11.5px] font-medium">
                    {value ? value.name : "Pilih File"}
                </span>
                <span className="text-slate-400 text-[10px] text-center px-2">
                    {acceptLabel}
                </span>
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={onChange}
                    className="hidden"
                />
            </label>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

/* ─── B2BApplicationForm ────────────────────────────────────────────── */

function B2BApplicationForm({ isResubmit = false }) {
    const [data, setData] = useState({
        company_name: "",
        company_npwp: "",
        company_nib: "",
        npwp_file: null,
        nib_file: null,
        siup_file: null,
        terms_accepted: false,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const set = (field, value) =>
        setData((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post("/b2b", data, {
            forceFormData: true,
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const inputClass =
        "w-full bg-slate-50 border-[1.5px] border-slate-200 rounded-[10px] px-3.5 py-2.5 mt-1.5 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all";

    return (
        <div className="bg-white rounded-[20px] border-l-4 border-l-amber-500 p-7 shadow-sm">
            <h2 className="text-slate-900 text-sm font-bold mb-4">
                {isResubmit ? "Ajukan Ulang" : "Formulir Pengajuan"}
            </h2>

            <div className="mb-3.5">
                <label className="text-slate-900 text-xs font-semibold">
                    Nama Perusahaan (PT / CV){" "}
                    <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.company_name}
                    onChange={(e) => set("company_name", e.target.value)}
                    placeholder="Contoh: CV Mitra Sejahtera"
                    className={inputClass}
                />
                {errors.company_name && (
                    <p className="text-xs text-red-500 mt-1">
                        {errors.company_name}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
                <div>
                    <label className="text-slate-900 text-xs font-semibold">
                        Nomor NPWP <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.company_npwp}
                        onChange={(e) =>
                            set(
                                "company_npwp",
                                e.target.value.replace(/[^0-9]/g, ""),
                            )
                        }
                        placeholder="15 digit NPWP"
                        className={inputClass}
                    />
                    {errors.company_npwp && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.company_npwp}
                        </p>
                    )}
                </div>
                <div>
                    <label className="text-slate-900 text-xs font-semibold">
                        Nomor NIB <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength="13"
                        value={data.company_nib}
                        onChange={(e) =>
                            set(
                                "company_nib",
                                e.target.value.replace(/[^0-9]/g, ""),
                            )
                        }
                        placeholder="13 digit NIB"
                        className={inputClass}
                    />
                    {errors.company_nib && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.company_nib}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
                <div>
                    <label className="text-slate-900 text-xs font-semibold">
                        Dokumen NPWP <span className="text-red-500">*</span>
                    </label>
                    <FileUploadBox
                        className="mt-1.5"
                        acceptLabel="PDF, JPG, JPEG, PNG, WEBP — maks. 2MB"
                        value={data.npwp_file}
                        onChange={(e) =>
                            set("npwp_file", e.target.files[0] || null)
                        }
                        error={errors.npwp_file}
                    />
                </div>
                <div>
                    <label className="text-slate-900 text-xs font-semibold">
                        Dokumen NIB <span className="text-red-500">*</span>
                    </label>
                    <FileUploadBox
                        className="mt-1.5"
                        acceptLabel="PDF, JPG, JPEG, PNG, WEBP — maks. 2MB"
                        value={data.nib_file}
                        onChange={(e) =>
                            set("nib_file", e.target.files[0] || null)
                        }
                        error={errors.nib_file}
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="text-slate-900 text-xs font-semibold">
                    Surat Pemusatan PPN / SIUP / Legalitas Tambahan{" "}
                    <span className="text-slate-400 text-xs">(opsional)</span>
                </label>
                <FileUploadBox
                    className="mt-1.5"
                    acceptLabel="PDF, JPG, JPEG, PNG, WEBP — maks. 2MB"
                    compact
                    value={data.siup_file}
                    onChange={(e) =>
                        set("siup_file", e.target.files[0] || null)
                    }
                    error={errors.siup_file}
                />
            </div>

            <label className="flex gap-2.5 items-start bg-slate-50 rounded-xl px-3.5 py-3 mb-4 cursor-pointer">
                <input
                    type="checkbox"
                    checked={data.terms_accepted}
                    onChange={(e) => set("terms_accepted", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-amber-500"
                />
                <span className="text-slate-600 text-[11.5px] leading-relaxed">
                    Saya mewakili Perusahaan dengan ini menyatakan bahwa seluruh
                    data yang diisi adalah benar, serta menyetujui{" "}
                    <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-amber-600 font-semibold hover:underline"
                    >
                        Syarat &amp; Ketentuan
                    </button>{" "}
                    Fasilitas Pembayaran Tempo (ToP) &amp; Termin di CV Multikon
                    Erindotama.
                </span>
            </label>
            {errors.terms_accepted && (
                <p className="text-xs text-red-500 -mt-3 mb-4">
                    {errors.terms_accepted}
                </p>
            )}

            <button
                type="button"
                onClick={handleSubmit}
                disabled={processing || !data.terms_accepted}
                className="w-full bg-amber-500 text-white text-sm font-bold py-3.5 rounded-xl hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing
                    ? "Mengirim..."
                    : isResubmit
                      ? "Ajukan Ulang"
                      : "Ajukan Pengajuan B2B"}
            </button>

            {showTerms && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowTerms(false)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">
                                Syarat &amp; Ketentuan Fasilitas ToP &amp;
                                Termin
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowTerms(false)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>
                                Fasilitas Pembayaran Tempo (ToP) untuk produk
                                Ready Stock dan Termin untuk produk Custom hanya
                                berlaku setelah akun bisnis Anda terverifikasi
                                oleh CV Multikon Erindotama.
                            </p>
                            <ul className="space-y-2.5 list-none">
                                <li className="flex gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                    <span>
                                        <span className="font-semibold text-slate-800">
                                            Tanggung jawab pemesanan:{" "}
                                        </span>
                                        Seluruh pesanan atas nama perusahaan
                                        dianggap sah dan menjadi tanggung jawab
                                        penuh perusahaan pemohon.
                                    </span>
                                </li>
                                <li className="flex gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                    <span>
                                        <span className="font-semibold text-slate-800">
                                            Ketaatan pembayaran:{" "}
                                        </span>
                                        Pembayaran wajib dilunasi paling lambat{" "}
                                        <span className="font-semibold text-slate-800">
                                            Net 30 hari
                                        </span>{" "}
                                        sejak invoice diterbitkan (sesuai tenure
                                        yang ditetapkan admin).
                                    </span>
                                </li>
                                <li className="flex gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                    <span>
                                        <span className="font-semibold text-slate-800">
                                            Wanprestasi:{" "}
                                        </span>
                                        Jika terjadi keterlambatan atau
                                        kegagalan pembayaran, CV Multikon
                                        Erindotama berhak membatalkan atau
                                        menyesuaikan limit kredit tanpa
                                        pemberitahuan sebelumnya.
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    set("terms_accepted", true);
                                    setShowTerms(false);
                                }}
                                className="bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-600 transition"
                            >
                                Saya Setuju
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── B2BApplicationHistoryCard ─────────────────────────────────────── */

function B2BApplicationHistoryCard({ application }) {
    return (
        <div className="bg-white rounded-[20px] p-7 shadow-sm">
            <h2 className="text-slate-900 text-sm font-bold mb-4">
                Pengajuan Terakhir
            </h2>

            <div className="grid grid-cols-2 gap-3.5 mb-4">
                <div>
                    <div className="text-slate-400 text-[11px]">Perusahaan</div>
                    <div className="text-slate-900 text-[13.5px] font-semibold mt-0.5">
                        {application.company_name}
                    </div>
                </div>
                <div>
                    <div className="text-slate-400 text-[11px]">
                        {application.reviewed_at ? "Ditinjau" : "Diajukan"}
                    </div>
                    <div className="text-slate-900 text-[13.5px] font-semibold mt-0.5">
                        {application.reviewed_at ?? application.created_at}
                    </div>
                </div>
                <div>
                    <div className="text-slate-400 text-[11px]">NPWP</div>
                    <div className="text-slate-900 text-[13.5px] font-semibold mt-0.5">
                        {application.company_npwp}
                    </div>
                </div>
                <div>
                    <div className="text-slate-400 text-[11px]">NIB</div>
                    <div className="text-slate-900 text-[13.5px] font-semibold mt-0.5">
                        {application.company_nib || "—"}
                    </div>
                </div>
            </div>

            <div className="flex gap-2.5">
                {application.npwp_file_url && (
                    <a
                        href={application.npwp_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 rounded-[10px] py-2.5 text-slate-900 text-xs font-medium hover:bg-slate-100 transition"
                    >
                        <FileText className="w-3.5 h-3.5" /> File NPWP
                    </a>
                )}
                {application.nib_file_url && (
                    <a
                        href={application.nib_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 rounded-[10px] py-2.5 text-slate-900 text-xs font-medium hover:bg-slate-100 transition"
                    >
                        <FileText className="w-3.5 h-3.5" /> File NIB
                    </a>
                )}
            </div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */

export default function B2BApplication({
    b2b_status,
    is_b2b_verified,
    credit_limit,
    remaining_credit,
    top_tenure_days,
    rejection_reason,
    can_apply,
    latest_application,
}) {
    return (
        <PublicLayout>
            <Head title="Pengajuan Akun Bisnis (B2B)" />

            <div className="max-w-[56rem] mx-auto px-6 py-6 md:py-10">
                <nav className="text-xs text-slate-400 mb-4">
                    <Link href="/" className="hover:text-slate-600">
                        Home
                    </Link>
                    <span className="mx-1.5">&#8250;</span>
                    <span className="text-slate-600">Pengajuan B2B</span>
                </nav>

                <div className="space-y-4">
                    {/* Status Card — always first */}
                    <B2BStatusCard
                        b2bStatus={b2b_status}
                        rejectionReason={rejection_reason}
                    />

                    {/* Credit Info — only when verified */}
                    {is_b2b_verified && (
                        <B2BCreditInfoCard
                            creditLimit={credit_limit}
                            remainingCredit={remaining_credit}
                            topTenureDays={top_tenure_days}
                        />
                    )}

                    {/* Termin Scheme — always shown */}
                    <PaymentSchemeTerminInfoCard />

                    {/* ToP Info — only when not yet applied or pending */}
                    {(b2b_status === "none" || b2b_status === "pending") && (
                        <PaymentTopInfoCard />
                    )}

                    {/* Application History — pending or verified */}
                    {latest_application &&
                        (b2b_status === "pending" ||
                            b2b_status === "approved") && (
                            <B2BApplicationHistoryCard
                                application={latest_application}
                            />
                        )}

                    {/* Application Form — none or rejected */}
                    {can_apply && (
                        <B2BApplicationForm
                            isResubmit={b2b_status === "rejected"}
                        />
                    )}

                    {/* Pending awaiting review message */}
                    {b2b_status === "pending" && !latest_application && (
                        <div className="bg-white rounded-[20px] p-7 shadow-sm text-center">
                            <p className="text-sm text-slate-500">
                                Pengajuan Anda sedang diproses admin. Mohon
                                tunggu konfirmasi.
                            </p>
                        </div>
                    )}

                    {/* Approved final message */}
                    {b2b_status === "approved" && (
                        <div className="bg-white rounded-[20px] p-7 shadow-sm text-center">
                            <div className="flex items-center justify-center gap-2 text-emerald-600">
                                <CheckCircle2 className="w-5 h-5" />
                                <p className="text-sm font-semibold">
                                    Akun Anda sudah terverifikasi B2B. Terima
                                    kasih!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
