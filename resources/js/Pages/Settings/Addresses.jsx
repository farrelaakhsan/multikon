import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { ArrowLeft, MapPin, Pencil, Trash2, Plus, Check } from "lucide-react";
import PublicLayout from "../../Layouts/PublicLayout";
import ConfirmDialog from "./ConfirmDialog";
import AddressFormModal from "./AddressFormModal";

export default function SettingsAddresses({ addresses = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    const handleBack = () => {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        if (redirect && redirect.startsWith("/")) {
            router.visit(redirect);
        } else {
            window.history.back();
        }
    };

    const openAddForm = () => { setEditingAddress(null); setShowForm(true); };
    const openEditForm = (addr) => { setEditingAddress(addr); setShowForm(true); };
    const closeForm = () => { setShowForm(false); setEditingAddress(null); };

    const handleSetDefault = async (addr) => {
        setProcessing(true);
        try {
            const res = await fetch(`/addresses/${addr.id}/default`, {
                method: "POST",
                headers: { "X-CSRF-TOKEN": csrfToken, "X-Requested-With": "XMLHttpRequest" },
            });
            if (res.ok) {
                setSuccessMessage(`"${addr.label}" sekarang menjadi alamat utama`);
                setTimeout(() => setSuccessMessage(""), 3000);
                window.location.reload();
            }
        } catch { } finally { setProcessing(false); }
    };

    const handleDelete = async () => {
        if (!deletingAddress) return;
        setProcessing(true);
        try {
            const body = new URLSearchParams();
            body.append("_method", "DELETE");
            const res = await fetch(`/addresses/${deletingAddress.id}`, {
                method: "POST",
                headers: { "X-CSRF-TOKEN": csrfToken, "X-Requested-With": "XMLHttpRequest" },
                body,
            });
            if (res.ok) { setDeletingAddress(null); window.location.reload(); }
        } catch { } finally { setProcessing(false); }
    };

    const truncateAddress = (addr) => {
        const parts = [addr.address];
        if (addr.subdistrict_name) parts.push(`Kel. ${addr.subdistrict_name}`);
        if (addr.district_name) parts.push(`Kec. ${addr.district_name}`);
        if (addr.city_name) parts.push(addr.city_name);
        return parts.join(", ");
    };

    return (
        <PublicLayout>
            <Head title="Pengaturan Alamat - Multikon" />

            <div className="bg-[#F8F9FA] min-h-screen">
                <div className="w-full max-w-[1024px] mx-auto px-6 sm:px-12 py-10">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1.5 mb-4"
                    >
                        <ArrowLeft size={13} /> KEMBALI
                    </button>
                    <p className="text-[22px] font-medium italic text-slate-900 mb-1.5">Pengaturan Alamat</p>
                    <p className="text-sm text-slate-500 mb-6">{addresses.length} alamat tersimpan</p>

                    {successMessage && (
                        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                            <p className="text-sm text-emerald-700">{successMessage}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                            <AddressCard
                                key={addr.id}
                                address={addr}
                                onEdit={() => openEditForm(addr)}
                                onDelete={() => setDeletingAddress(addr)}
                                onSetPrimary={() => handleSetDefault(addr)}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={openAddForm}
                            className="bg-transparent border-2 border-dashed border-slate-300 rounded-[20px] flex flex-col items-center justify-center gap-2 py-8 hover:border-slate-400 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-[10px] bg-white border border-slate-200 flex items-center justify-center">
                                <Plus size={18} className="text-slate-500" />
                            </div>
                            <span className="text-[13.5px] font-medium text-slate-600">Tambah alamat baru</span>
                        </button>
                    </div>
                </div>
            </div>

            <AddressFormModal open={showForm} address={editingAddress} onClose={closeForm} csrfToken={csrfToken} />
            <ConfirmDialog
                open={!!deletingAddress}
                title="Hapus Alamat?"
                message={deletingAddress ? `Apakah kamu yakin ingin menghapus alamat "${deletingAddress.label}"? Tindakan ini tidak bisa dibatalkan.` : ""}
                onConfirm={handleDelete}
                onCancel={() => setDeletingAddress(null)}
                processing={processing}
            />
        </PublicLayout>
    );
}

function AddressCard({ address, onEdit, onDelete, onSetPrimary }) {
    const isDefault = address.is_default;

    const truncateAddress = (addr) => {
        const parts = [addr.address];
        if (addr.subdistrict_name) parts.push(`Kel. ${addr.subdistrict_name}`);
        if (addr.district_name) parts.push(`Kec. ${addr.district_name}`);
        if (addr.city_name) parts.push(addr.city_name);
        return parts.join(", ");
    };

    return (
        <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
            <div className="flex">
                <div className="w-1 flex-shrink-0 bg-amber-500" />
                <div className="flex-1 p-5">

                    <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-[10px] bg-slate-800 flex items-center justify-center flex-shrink-0">
                                <MapPin size={17} className="text-amber-500" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-[14.5px] font-medium text-slate-900">{address.label}</p>
                                    {isDefault && (
                                        <span className="text-[10.5px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                            Utama
                                        </span>
                                    )}
                                </div>
                                {(address.receiver_phone || address.label) && (
                                    <p className="text-[12.5px] text-slate-500">
                                        {address.receiver_phone || "-"}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                            <button
                                type="button"
                                onClick={onEdit}
                                aria-label="Edit alamat"
                                className="w-[30px] h-[30px] rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                            >
                                <Pencil size={14} className="text-slate-500" />
                            </button>
                            <button
                                type="button"
                                onClick={onDelete}
                                aria-label="Hapus alamat"
                                className="w-[30px] h-[30px] rounded-lg border border-slate-200 flex items-center justify-center hover:bg-red-50"
                            >
                                <Trash2 size={14} className="text-red-600" />
                            </button>
                        </div>
                    </div>

                    <p className="text-[12.5px] text-slate-500 leading-relaxed mb-3.5 pl-[48px]">
                        {truncateAddress(address)}
                    </p>

                    <div className="pt-3 border-t border-slate-100 pl-[48px]">
                        <label className="text-xs text-slate-400 flex items-center gap-1.5 cursor-pointer w-fit">
                            <span
                                className={`w-[15px] h-[15px] rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isDefault ? "bg-amber-500 border-amber-500" : "border border-slate-300"
                                }`}
                                style={{ borderWidth: isDefault ? 0 : 1.5 }}
                            >
                                {isDefault && <Check size={10} className="text-white" />}
                            </span>
                            <input
                                type="radio"
                                checked={isDefault}
                                onChange={onSetPrimary}
                                className="sr-only"
                            />
                            Alamat utama
                        </label>
                    </div>

                </div>
            </div>
        </div>
    );
}
