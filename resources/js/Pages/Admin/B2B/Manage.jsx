import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import CompanyTableCard from "./Manage/CompanyTableCard";
import TopInvoiceCard from "./Manage/TopInvoiceCard";
import TerminMilestoneCard from "./Manage/TerminMilestoneCard";
import CreditLimitModal from "./Manage/CreditLimitModal";
import FreezeToPConfirm from "./Manage/FreezeToPConfirm";

export default function B2BManage({
    companies,
    top_orders,
    termin_orders,
}) {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [form, setForm] = useState({ credit_limit: "", top_tenure_days: 30 });
    const [freezeTarget, setFreezeTarget] = useState(null);

    const handleEdit = (company) => {
        setSelectedCompany(company);
        setForm({
            credit_limit: company.credit_limit ?? 0,
            top_tenure_days: company.top_tenure_days ?? 30,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCompany) return;
        router.post(
            `/admin/b2b/${selectedCompany.id}/credit-limit`,
            {
                credit_limit: form.credit_limit,
                top_tenure_days: form.top_tenure_days,
                _method: "PUT",
            },
            {
                onSuccess: () => setSelectedCompany(null),
            }
        );
    };

    const handleToggleTop = (company) => {
        setFreezeTarget(company);
    };

    const confirmFreeze = () => {
        if (!freezeTarget) return;
        router.post(
            `/admin/b2b/${freezeTarget.id}/toggle-top`,
            {
                top_disabled: freezeTarget.top_disabled ? 0 : 1,
                _method: "PATCH",
            },
            {
                onFinish: () => setFreezeTarget(null),
            }
        );
    };

    return (
        <AdminLayout title="Manajemen B2B">
            <Head title="Manajemen B2B" />
            <div className="w-full max-w-7xl px-6 lg:px-8 pb-6 lg:pb-8 pt-0">
                <div className="flex items-center gap-4 mb-6">
                    {[
                        {
                            label: "Terverifikasi",
                            value: companies.length,
                            color: "bg-emerald-100 text-emerald-700",
                        },
                        {
                            label: "ToP Aktif",
                            value: top_orders.length,
                            color: "bg-amber-100 text-amber-700",
                        },
                        {
                            label: "Termin Aktif",
                            value: termin_orders.length,
                            color: "bg-blue-100 text-blue-700",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl bg-white shadow-sm border border-slate-100 px-4 py-3 text-center"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {stat.label}
                            </p>
                            <p
                                className={`mt-0.5 text-sm font-black ${stat.color} inline-block px-2 py-0.5 rounded-lg`}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                <CompanyTableCard
                    companies={companies}
                    onEdit={handleEdit}
                    onToggleTop={handleToggleTop}
                />
                <TopInvoiceCard topOrders={top_orders} />
                <TerminMilestoneCard terminOrders={termin_orders} />
            </div>

            <CreditLimitModal
                company={selectedCompany}
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                onClose={() => setSelectedCompany(null)}
            />

            <FreezeToPConfirm
                open={!!freezeTarget}
                companyName={freezeTarget?.company_name || freezeTarget?.name || ""}
                isFrozen={freezeTarget?.top_disabled}
                onClose={() => setFreezeTarget(null)}
                onConfirm={confirmFreeze}
            />
        </AdminLayout>
    );
}
