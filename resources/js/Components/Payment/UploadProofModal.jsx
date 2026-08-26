import { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Upload, X, CloudUpload } from "lucide-react";

export default function UploadProofModal({ order, isOpen, onClose }) {
    const [senderBankName, setSenderBankName] = useState('');
    const [transferDate, setTransferDate] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setSenderBankName('');
            setTransferDate('');
            setFile(null);
            setPreview(null);
            setErrors({});
        }
    }, [isOpen]);

    const handleFileChange = (f) => {
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        handleFileChange(e.dataTransfer.files?.[0]);
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!senderBankName.trim()) newErrors.sender_bank_name = 'Wajib diisi';
        if (!transferDate) newErrors.transfer_date = 'Wajib diisi';
        if (!file) newErrors.file = 'Wajib diisi';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append('payment_proof', file);
        formData.append('sender_bank_name', senderBankName);
        formData.append('transfer_date', transferDate);

        const endpoint = order.is_custom
            ? `/order/${order.order_code}/custom-payment`
            : `/order/payment/${order.order_code}`;

        router.post(endpoint, formData, { forceFormData: true });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-200 rounded-[20px] p-7 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-start mb-1.5">
                    <p className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                        <Upload className="w-[18px] h-[18px] text-amber-500" />
                        Kirim Bukti Pembayaran
                    </p>
                    <button type="button" onClick={onClose}>
                        <X className="w-[18px] h-[18px] text-slate-400 hover:text-slate-600" />
                    </button>
                </div>
                <p className="text-[13px] text-slate-600 mb-5">
                    Unggah bukti transfer untuk pesanan{' '}
                    <span className="text-amber-500 font-semibold">#{order.order_code}</span>{' '}
                    agar dapat segera kami proses.
                </p>

                <label className="text-[12.5px] font-semibold text-slate-800 block mb-1.5">
                    Nama Bank Anda <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Contoh: BCA a.n Budi"
                    value={senderBankName}
                    onChange={(e) => { setSenderBankName(e.target.value); setErrors((p) => ({ ...p, sender_bank_name: undefined })); }}
                    className={`w-full border rounded-[10px] px-3.5 py-[11px] text-[13.5px] text-slate-800 bg-[#F8F9FA] mb-1 ${errors.sender_bank_name ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.sender_bank_name && <p className="text-[11px] text-red-500 mb-3">{errors.sender_bank_name}</p>}
                {!errors.sender_bank_name && <div className="mb-4" />}

                <label className="text-[12.5px] font-semibold text-slate-800 block mb-1.5">
                    Tanggal Transfer <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={transferDate}
                    onChange={(e) => { setTransferDate(e.target.value); setErrors((p) => ({ ...p, transfer_date: undefined })); }}
                    className={`w-full border rounded-[10px] px-3.5 py-[11px] text-[13.5px] text-slate-800 bg-[#F8F9FA] mb-1 ${errors.transfer_date ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.transfer_date && <p className="text-[11px] text-red-500 mb-3">{errors.transfer_date}</p>}
                {!errors.transfer_date && <div className="mb-4" />}

                <label className="text-[12.5px] font-semibold text-slate-800 block mb-1.5">
                    Upload Bukti / Struk <span className="text-red-500">*</span>
                </label>
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-[1.5px] border-dashed rounded-xl p-5 text-center bg-[#F8F9FA] mb-1 cursor-pointer transition ${
                        errors.file ? 'border-red-400' : dragActive ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-contain" />
                    ) : (
                        <>
                            <CloudUpload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                            <p className="text-[13px] font-semibold text-slate-800 mb-0.5">Klik atau seret file ke sini</p>
                            <p className="text-[11.5px] text-slate-400">Maksimal 5MB. Format: JPG, PNG, WEBP.</p>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { handleFileChange(e.target.files?.[0]); setErrors((p) => ({ ...p, file: undefined })); }}
                    />
                </div>
                {errors.file && <p className="text-[11px] text-red-500 mt-1">{errors.file}</p>}

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full text-[14px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl py-[14px] mt-4 transition-colors"
                >
                    Kirim Sekarang
                </button>
            </div>
        </div>
    );
}
