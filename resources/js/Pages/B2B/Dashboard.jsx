import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    Clock,
    FileText,
    AlertTriangle,
    Hourglass,
    Inbox,
    ClipboardList,
    AlertCircle,
} from "lucide-react";
import PublicLayout from "../../Layouts/PublicLayout";
import { formatCurrency } from "../../utils/format";

function B2BDashboardHeader({ company }) {
    return (
        <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-[#EA8A0A] flex items-center justify-center flex-shrink-0 shadow-[0_6px_14px_rgba(245,158,11,0.25)]">
                <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
                <h1 className="text-slate-900 text-[19px] font-extrabold">
                    Dashboard Akun Bisnis
                </h1>
                <p className="text-slate-400 text-[12.5px] mt-0.5">
                    {company.name} &middot; NPWP {company.npwp}
                </p>
            </div>
            <Link
                href="/b2b"
                className="text-amber-600 text-xs font-bold whitespace-nowrap hover:underline"
            >
                Detail Verifikasi &rarr;
            </Link>
        </div>
    );
}

/* ─── CreditSummaryCard ─────────────────────────────────────────────── */

function CreditSummaryCard({ account }) {
    return (
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-slate-900 to-[#0F172A] px-6 py-6 mb-3.5">
            <div className="absolute -top-10 -right-10 w-[150px] h-[150px] rounded-full bg-emerald-500/10" />

            <div className="relative flex items-center justify-between mb-4">
                <span className="text-slate-300 text-[11px] tracking-wide">
                    RINGKASAN KREDIT
                </span>
                <span className="bg-emerald-500/15 text-emerald-200 text-[10.5px] font-bold px-2.5 py-1 rounded-full">
                    Terverifikasi
                </span>
            </div>

            <div className="relative grid grid-cols-2 gap-5 mb-4">
                <div>
                    <p className="text-slate-300 text-[11.5px] mb-1">
                        Batas Kredit
                    </p>
                    <p className="text-white text-[21px] font-extrabold">
                        {formatCurrency(account.creditLimit)}
                    </p>
                </div>
                <div>
                    <p className="text-slate-300 text-[11.5px] mb-1">
                        Sisa Limit
                    </p>
                    <p className="text-emerald-300 text-[21px] font-extrabold">
                        {formatCurrency(account.remainingCredit)}
                    </p>
                </div>
            </div>

            <div className="relative h-1.5 bg-white/[0.08] rounded-full overflow-hidden mb-2.5">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                    style={{ width: `${account.usedPercentage}%` }}
                />
            </div>
            <div className="relative flex justify-between text-slate-300 text-[11px]">
                <span>
                    Terpakai {formatCurrency(account.usedCredit)} &middot;{" "}
                    {account.usedPercentage}%
                </span>
                <span>
                    Jatuh Tempo{" "}
                    <span className="text-white font-bold">
                        {account.topDueLabel}
                    </span>
                </span>
            </div>
        </div>
    );
}

/* ─── TopBillingCard ────────────────────────────────────────────────── */

function TopBillingCard({ invoice }) {
    if (!invoice) {
        return (
            <div className="bg-white rounded-[22px] px-6 py-5 shadow-sm mb-3.5">
                <div className="flex items-center gap-2.5 mb-3.5">
                    <div className="w-[34px] h-[34px] rounded-[10px] bg-blue-50 flex items-center justify-center">
                        <Hourglass className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-slate-900 text-[14.5px] font-extrabold">
                        Tagihan Tempo (ToP)
                    </h2>
                </div>
                <div className="bg-slate-50 rounded-2xl py-6 text-center">
                    <div className="w-9 h-9 rounded-full bg-slate-200/50 flex items-center justify-center mx-auto mb-2.5">
                        <Inbox className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-slate-400 text-[12.5px]">
                        Belum ada tagihan ToP berjalan
                    </div>
                </div>
            </div>
        );
    }

    const isOverdue = invoice.daysRemaining < 0;

    return (
        <div className="bg-white rounded-[22px] px-6 py-5 shadow-sm mb-3.5">
            <div className="flex items-center gap-2.5 mb-3.5">
                <div
                    className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center ${
                        isOverdue ? "bg-red-50" : "bg-blue-50"
                    }`}
                >
                    <Hourglass
                        className={`w-4 h-4 ${
                            isOverdue ? "text-red-600" : "text-blue-600"
                        }`}
                    />
                </div>
                <h2 className="text-slate-900 text-[14.5px] font-extrabold">
                    Tagihan Tempo (ToP)
                </h2>
            </div>

            <div
                className={`rounded-2xl px-4 py-4 ${
                    isOverdue ? "bg-red-50" : "bg-slate-50"
                }`}
            >
                <div className="flex items-center justify-between mb-2.5">
                    <span className="bg-white text-slate-600 text-[10.5px] font-bold px-2.5 py-1 rounded-md">
                        {invoice.orderCode}
                    </span>
                    <span
                        className={`text-[11.5px] font-semibold ${
                            isOverdue ? "text-red-700" : "text-slate-500"
                        }`}
                    >
                        {isOverdue
                            ? `Terlambat ${Math.abs(invoice.daysRemaining)} hari`
                            : `Jatuh tempo ${invoice.daysRemaining} hari lagi`}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-slate-400 text-[11px]">
                            Jumlah Tagihan
                        </div>
                        <div className="text-slate-900 text-lg font-extrabold mt-0.5">
                            {formatCurrency(invoice.amount)}
                        </div>
                    </div>
                    <Link
                        href={`/order/${invoice.orderCode}/tracking`}
                        className="bg-amber-500 text-white text-[12.5px] font-bold px-4 py-2.5 rounded-xl hover:bg-amber-600 transition"
                    >
                        Bayar Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ─── TerminMilestonesCard ──────────────────────────────────────────── */

function TerminMilestonesCard({ orders }) {
    return (
        <div className="bg-white rounded-[22px] px-6 py-5 shadow-sm mb-3.5">
            <div className="flex items-center gap-2.5 mb-4">
                <div className="w-[34px] h-[34px] rounded-[10px] bg-amber-50 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                </div>
                <h2 className="text-slate-900 text-[14.5px] font-extrabold">
                    Milestone Termin (Custom)
                </h2>
            </div>

            {orders.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl py-6 text-center">
                    <div className="w-9 h-9 rounded-full bg-slate-200/50 flex items-center justify-center mx-auto mb-2.5">
                        <ClipboardList className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-slate-400 text-[12.5px]">
                        Tidak ada pesanan termin berjalan
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {orders.map((order) => (
                        <div
                            key={order.orderCode}
                            className="border-[1.5px] border-slate-100 rounded-2xl px-4 py-4"
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="bg-slate-50 text-slate-600 text-[10.5px] font-bold px-2.5 py-1 rounded-md tracking-wide">
                                    {order.orderCode}
                                </span>
                                <span className="text-slate-400 text-xs">
                                    Total{" "}
                                    <span className="text-slate-900 font-bold">
                                        {formatCurrency(order.totalAmount)}
                                    </span>
                                </span>
                            </div>
                            <p className="text-slate-900 text-sm font-bold mt-2.5 mb-3">
                                {order.productName}
                            </p>

                            <div className="flex items-center justify-between bg-gradient-to-br from-amber-50 to-[#FEF3E2] rounded-xl px-3.5 py-3">
                                <div>
                                    <p className="text-amber-700 text-[10px] font-bold tracking-wide">
                                        TAGIHAN BERJALAN
                                    </p>
                                    <p className="text-slate-900 text-[13px] font-bold mt-0.5">
                                        {order.currentMilestoneLabel}
                                    </p>
                                </div>
                                <span className="text-amber-600 text-base font-extrabold">
                                    {formatCurrency(
                                        order.currentMilestoneAmount,
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── DocumentCenterCard ────────────────────────────────────────────── */

function DocumentCenterCard({ documents }) {
    return (
        <div className="bg-white rounded-[22px] px-6 py-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-[34px] h-[34px] rounded-[10px] bg-emerald-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-slate-900 text-[14.5px] font-extrabold">
                    Pusat Dokumen
                </h2>
            </div>

            {documents.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl py-6 text-center">
                    <div className="w-9 h-9 rounded-full bg-slate-200/50 flex items-center justify-center mx-auto mb-2.5">
                        <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-slate-400 text-[12.5px]">
                        Belum ada dokumen yang diterbitkan
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {documents.map((doc) => (
                        <div
                            key={doc.key}
                            className="bg-slate-50 rounded-2xl px-4 py-3.5 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-[9px] bg-white flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-slate-900 text-[12.5px] font-bold">
                                        {doc.label}
                                    </p>
                                    <p className="text-slate-400 text-[10.5px] mt-0.5">
                                        {doc.orderCode} &middot; {doc.issuedAt}
                                    </p>
                                </div>
                            </div>
                            {doc.downloadUrl ? (
                                <a
                                    href={doc.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-slate-900 text-white text-[11px] font-bold px-3.5 py-2 rounded-[9px] whitespace-nowrap hover:bg-slate-700 transition"
                                >
                                    Unduh
                                </a>
                            ) : (
                                <span className="text-xs text-slate-300">
                                    -
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */

const DOC_TYPE_LABEL = {
    commercial_invoice: "Commercial Invoice",
    faktur_pajak: "Faktur Pajak (PPN 11%)",
    surat_jalan: "Surat Jalan",
};

export default function B2BDashboard({
    summary,
    top_bills,
    termin_orders,
    documents,
}) {
    const overdueCount = top_bills.filter((b) => b.overdue).length;

    const account = {
        creditLimit: summary.credit_limit,
        remainingCredit: summary.remaining_credit,
        usedCredit: summary.credit_limit - summary.remaining_credit,
        usedPercentage:
            summary.credit_limit > 0
                ? Math.round(
                      ((summary.credit_limit - summary.remaining_credit) /
                          summary.credit_limit) *
                          100,
                  )
                : 0,
        topDueLabel: `Net ${summary.top_tenure_days} Hari`,
    };

    const topInvoice =
        top_bills.length > 0
            ? {
                  orderCode: top_bills[0].order_code,
                  amount: top_bills[0].total_price,
                  dueDate: top_bills[0].due_at,
                  daysRemaining: top_bills[0].days_left ?? 0,
              }
            : null;

    const terminOrders = termin_orders.map((o) => ({
        orderCode: o.order_code,
        productName: o.product_name,
        totalAmount: o.total_price,
        currentMilestoneLabel: o.current_bill?.label ?? "Semua Tagihan Lunas",
        currentMilestoneAmount: o.current_bill?.amount ?? 0,
    }));

    const docs = documents.map((d, i) => ({
        key: `${d.order_code}-${d.type}-${i}`,
        label: DOC_TYPE_LABEL[d.type] ?? d.type,
        orderCode: d.order_code,
        issuedAt: d.issued_at ?? "-",
        downloadUrl: d.url,
    }));

    return (
        <PublicLayout>
            <Head title="Dashboard B2B" />

            <div className="max-w-[1024px] mx-auto px-6 py-6 md:py-8">
                <nav className="text-xs text-slate-400 mb-4">
                    <Link href="/" className="hover:text-slate-600">
                        Home
                    </Link>
                    <span className="mx-1.5">&#8250;</span>
                    <span className="text-slate-600">Dashboard B2B</span>
                </nav>

                {summary.top_disabled && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">
                                Fasilitas ToP sedang dibekukan
                            </p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                Pembayaran Tempo untuk pesanan baru
                                dinonaktifkan sementara oleh admin. Tagihan ToP
                                yang sudah berjalan tetap wajib dilunasi sesuai
                                jatuh tempo.
                            </p>
                        </div>
                    </div>
                )}

                {overdueCount > 0 && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-red-700">
                                {overdueCount} tagihan melewati jatuh tempo
                            </p>
                            <p className="text-xs text-red-600 mt-0.5">
                                Segera hubungi CV Multikon Erindotama atau
                                lakukan pelunasan untuk menghindari pembekuan
                                fasilitas.
                            </p>
                        </div>
                    </div>
                )}

                <B2BDashboardHeader
                    company={{
                        name: summary.company_name || "Perusahaan B2B",
                        npwp: summary.company_npwp || "-",
                    }}
                />
                <CreditSummaryCard account={account} />
                <TopBillingCard invoice={topInvoice} />
                <TerminMilestonesCard orders={terminOrders} />
                <DocumentCenterCard documents={docs} />
            </div>
        </PublicLayout>
    );
}
