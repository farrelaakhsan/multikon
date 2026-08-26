import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    ArrowLeft,
    Check,
    X,
    FileText,
    Info,
    AlertCircle,
    Wallet,
} from "lucide-react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { formatPrice } from "../../../utils/format";

const STATUS_CONFIG = {
    pending: {
        accent: "border-amber-500",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        label: "Menunggu tinjauan",
    },
    approved: {
        accent: "border-emerald-500",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        label: "Disetujui",
    },
    rejected: {
        accent: "border-red-500",
        badgeBg: "bg-red-50",
        badgeText: "text-red-700",
        label: "Ditolak",
    },
};

function Field({ label, value, emphasis }) {
    return (
        <div>
            <div className="text-[11px] text-slate-400 mb-0.5">{label}</div>
            <div
                className={
                    emphasis
                        ? "text-sm font-medium text-emerald-600"
                        : "text-[13px] text-slate-800"
                }
            >
                {value}
            </div>
        </div>
    );
}

export default function B2BShow({ application }) {
    const config = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.pending;

    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [approveData, setApproveData] = useState({
        credit_limit: "",
        top_tenure_days: 30,
    });
    const [rejectReason, setRejectReason] = useState("");
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(null);

    const handleApprove = (e) => {
        e.preventDefault();
        setProcessing("approve");
        setErrors({});
        router.post(`/admin/b2b/${application.id}/approve`, approveData, {
            onError: (errs) => {
                setErrors(errs);
                setProcessing(null);
            },
            onFinish: () => {
                setProcessing(null);
                setShowApproveModal(false);
            },
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        setProcessing("reject");
        setErrors({});
        router.post(
            `/admin/b2b/${application.id}/reject`,
            { rejection_reason: rejectReason },
            {
                onError: (errs) => {
                    setErrors(errs);
                    setProcessing(null);
                },
                onFinish: () => {
                    setProcessing(null);
                    setShowRejectModal(false);
                },
            }
        );
    };

    const docLinks = [
        { label: "NPWP", url: application.npwp_file_url },
        { label: "NIB", url: application.nib_file_url },
        { label: "SIUP", url: application.siup_file_url },
    ].filter((d) => d.url);

    return (
        <AdminLayout title="Detail Pengajuan B2B">
            <Head title="Admin — Detail Pengajuan B2B" />

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-slate-400 mb-4">
                <Link
                    href="/admin/b2b"
                    className="hover:text-amber-600 transition flex items-center gap-1"
                >
                    <ArrowLeft size={14} />
                    Pengajuan B2B
                </Link>
                <span>/</span>
                <span className="text-slate-800 font-medium">
                    #{application.id}
                </span>
            </div>

            {/* Main card */}
            <div
                className={`bg-white rounded-[20px] border-l-4 ${config.accent} px-7 py-6`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <div className="text-[15px] font-medium text-slate-800 mb-0.5">
                            {application.company_name}
                        </div>
                        <div className="text-xs text-slate-400">
                            Diajukan {application.created_at}
                        </div>
                    </div>
                    <span
                        className={`${config.badgeBg} ${config.badgeText} text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1`}
                    >
                        {application.status === "approved" && (
                            <Check size={11} />
                        )}
                        {application.status === "rejected" && (
                            <X size={11} />
                        )}
                        {config.label}
                    </span>
                </div>

                {/* Data grid */}
                <div className="grid grid-cols-3 gap-x-5 gap-y-4 pb-4 mb-4 border-b border-slate-100">
                    <Field label="NPWP" value={application.company_npwp} />
                    <Field
                        label="NIB"
                        value={application.company_nib || "-"}
                    />
                    <Field
                        label="Pengaju"
                        value={`${application.user?.name || "-"} (${application.user?.email || "-"})`}
                    />
                    <Field
                        label={
                            application.status === "approved"
                                ? "Credit limit"
                                : "Credit limit diajukan"
                        }
                        value={
                            application.credit_limit
                                ? formatPrice(application.credit_limit)
                                : "-"
                        }
                        emphasis={application.status === "approved"}
                    />
                    <Field
                        label="Jatuh tempo ToP"
                        value={
                            application.top_tenure_days
                                ? `Net ${application.top_tenure_days} Hari`
                                : "-"
                        }
                    />
                    {application.reviewed_at && (
                        <Field
                            label="Ditinjau oleh"
                            value={`${application.reviewer_name || "-"}, ${application.reviewed_at}`}
                        />
                    )}
                </div>

                {/* Documents */}
                {docLinks.length > 0 && (
                    <div className="flex gap-2.5 mb-4">
                        {docLinks.map((doc) => (
                            <a
                                key={doc.label}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-slate-200 rounded-[10px] px-3.5 py-2 text-xs text-slate-800 flex items-center gap-1.5 cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition"
                            >
                                <FileText
                                    size={14}
                                    className="text-slate-500"
                                />
                                {doc.label}
                            </a>
                        ))}
                    </div>
                )}

                {/* Bottom area — changes by status */}
                {application.status === "pending" && (
                    <div className="flex gap-2.5">
                        <button
                            onClick={() => setShowApproveModal(true)}
                            className="flex-1 bg-emerald-500 text-white rounded-[10px] py-2.5 text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition"
                        >
                            <Check size={14} />
                            Setujui pengajuan
                        </button>
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 bg-white text-red-500 border border-red-200 rounded-[10px] py-2.5 text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-red-50 transition"
                        >
                            <X size={14} />
                            Tolak pengajuan
                        </button>
                    </div>
                )}

                {application.status === "approved" && (
                    <div className="bg-emerald-50 rounded-[10px] px-3.5 py-2.5 flex gap-2 items-center">
                        <Info size={14} className="text-emerald-700" />
                        <span className="text-xs text-emerald-700">
                            Pengajuan ini sudah disetujui dan tidak dapat diubah
                            lagi
                        </span>
                    </div>
                )}

                {application.status === "rejected" && (
                    <div className="bg-red-50 rounded-[10px] px-3.5 py-2.5 flex gap-2 items-start">
                        <AlertCircle
                            size={14}
                            className="text-red-700 mt-0.5"
                        />
                        <span className="text-xs text-red-700">
                            Pengajuan ini ditolak dan tidak dapat diubah lagi.
                            {application.rejection_reason
                                ? ` Alasan: ${application.rejection_reason}`
                                : " Alasan penolakan belum tersedia."}
                        </span>
                    </div>
                )}
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div
                    className="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
                    onClick={() => setShowApproveModal(false)}
                >
                    <form
                        onSubmit={handleApprove}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-[20px] p-6 w-[380px] shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-medium text-slate-800">
                                Setujui pengajuan
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">
                            {application.company_name} &middot; Masukkan limit
                            kredit dan jatuh tempo ToP.
                        </p>

                        <label className="text-xs text-slate-400 mb-1 block">
                            Limit kredit (Rp){" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={approveData.credit_limit}
                            onChange={(e) =>
                                setApproveData((p) => ({
                                    ...p,
                                    credit_limit: e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    ),
                                }))
                            }
                            placeholder="Contoh: 50000000"
                            className="w-full border border-slate-200 rounded-[10px] px-3 py-2.5 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                        {errors.credit_limit && (
                            <p className="text-xs text-red-500 mb-3">
                                {errors.credit_limit}
                            </p>
                        )}
                        {!errors.credit_limit && <div className="mb-3" />}

                        <label className="text-xs text-slate-400 mb-1 block">
                            Jatuh tempo ToP (hari){" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={approveData.top_tenure_days}
                            onChange={(e) =>
                                setApproveData((p) => ({
                                    ...p,
                                    top_tenure_days: e.target.value,
                                }))
                            }
                            className="w-full border border-slate-200 rounded-[10px] px-3 py-2.5 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                        <p className="text-[10px] text-slate-400 mb-4">
                            Default: Net 30 Hari
                        </p>
                        {errors.top_tenure_days && (
                            <p className="text-xs text-red-500 mb-3">
                                {errors.top_tenure_days}
                            </p>
                        )}

                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowApproveModal(false)}
                                className="px-4 py-2 text-sm text-slate-600"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing === "approve"}
                                className="bg-emerald-500 text-white rounded-[9px] px-4 py-2 text-sm font-medium flex items-center gap-1.5 hover:bg-emerald-600 transition disabled:opacity-50"
                            >
                                <Wallet size={14} />
                                {processing === "approve"
                                    ? "Menyetujui..."
                                    : "Setujui & Verifikasi"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div
                    className="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
                    onClick={() => setShowRejectModal(false)}
                >
                    <form
                        onSubmit={handleReject}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-[20px] p-6 w-[420px] shadow-2xl"
                    >
                        <h3 className="text-base font-medium text-slate-800 mb-1">
                            Tolak pengajuan
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">
                            Alasan ini akan dilihat oleh pengaju.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Contoh: Dokumen NIB tidak terbaca, mohon unggah ulang."
                            rows={4}
                            className="w-full border border-slate-200 rounded-[10px] px-3 py-2.5 text-sm mb-1 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                        />
                        {errors.rejection_reason && (
                            <p className="text-xs text-red-500 mb-3">
                                {errors.rejection_reason}
                            </p>
                        )}

                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-sm text-slate-600"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={
                                    processing === "reject" ||
                                    !rejectReason.trim()
                                }
                                className="bg-red-500 text-white rounded-[9px] px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-red-600 transition"
                            >
                                {processing === "reject"
                                    ? "Menolak..."
                                    : "Tolak pengajuan"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
}
