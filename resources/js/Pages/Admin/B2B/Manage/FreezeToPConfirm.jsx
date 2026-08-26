import ModalShell from "../../../../Components/ui/ModalShell";

export default function FreezeToPConfirm({ open, companyName, isFrozen, onClose, onConfirm }) {
    const frozen = isFrozen ?? false;

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title={frozen ? "Aktifkan ToP?" : "Bekukan ToP?"}
            subtitle={
                frozen
                    ? `${companyName} akan bisa membuat pesanan ToP baru setelah diaktifkan.`
                    : `${companyName} tidak akan bisa membuat pesanan ToP baru sampai dibuka kembali.`
            }
            width="w-[360px]"
        >
            <div className="flex gap-2 justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-slate-600"
                >
                    Batal
                </button>
                <button
                    onClick={onConfirm}
                    className={`text-white rounded-[9px] px-4 py-2 text-sm font-medium transition ${
                        frozen
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                    {frozen ? "Ya, aktifkan" : "Ya, bekukan"}
                </button>
            </div>
        </ModalShell>
    );
}
