import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { CloudUpload, Download, Copy, CalendarClock, X } from 'lucide-react';

export default function SettlementUploadModal({ orderId, orderCode, isOpen, onClose, bankInfo, qrisImageUrl, initialMethod }) {
  const [selectedMethod, setSelectedMethod] = useState(initialMethod);
  const [form, setForm] = useState({ senderName: '', transferDate: '', proofFile: null });
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(initialMethod);
    } else {
      setForm({ senderName: '', transferDate: '', proofFile: null });
      setPreview(null);
      setErrors({});
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopyAccountNumber = async () => {
    if (!bankInfo?.accountNumber) return;
    await navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFileChange = (f) => {
    if (!f) return;
    setForm((prev) => ({ ...prev, proofFile: f }));
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (selectedMethod === 'transfer_bank' && !form.senderName.trim()) newErrors.senderName = 'Wajib diisi';
    if (!form.transferDate) newErrors.transferDate = 'Wajib diisi';
    if (!form.proofFile) newErrors.proofFile = 'Wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('settlement_proof', form.proofFile);
    formData.append('sender_bank_name', form.senderName);
    formData.append('transfer_date', form.transferDate);

    router.post(`/orders/${orderId}/settlement`, formData, { forceFormData: true });
    onClose();
  };

  if (!isOpen) return null;

  const isTransferBank = selectedMethod === 'transfer_bank';

  return (
    <div className="fixed inset-0 bg-slate-900/45 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-[22px] w-full max-w-[410px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-start gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-lg bg-amber-50 flex items-center justify-center">
                  <CloudUpload className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <h3 className="text-slate-900 text-[15.5px] font-semibold">Kirim Bukti Pelunasan</h3>
              </div>
              <p className="text-slate-400 text-xs mt-1.5">
                Untuk pesanan <span className="text-amber-600 font-semibold">#{orderCode}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-[26px] h-[26px] rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">
          {/* Form: Instruksi + Upload Bukti */}
            <>
              {/* Instruksi pembayaran — card gelap */}
              {isTransferBank ? (
                <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-slate-900 to-[#0F172A] px-5 py-5 mb-5">
                  <div className="absolute -top-8 -right-8 w-[120px] h-[120px] rounded-full bg-amber-500/10" />
                  <div className="relative flex items-center justify-between mb-3.5">
                    <span className="text-slate-300 text-[11px] tracking-wide">TRANSFER KE REKENING</span>
                    <span className="bg-amber-500/15 text-amber-200 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {bankInfo?.bankName || 'Bank'}
                    </span>
                  </div>
                  <div className="relative text-white text-[23px] font-bold tracking-wider">
                    {bankInfo?.accountNumber || '-'}
                  </div>
                  <div className="relative flex items-center justify-between mt-3">
                    <span className="text-slate-200 text-[12.5px]">a.n. {bankInfo?.accountHolder || '-'}</span>
                    <button
                      type="button"
                      onClick={handleCopyAccountNumber}
                      className="flex items-center gap-1 text-amber-200 text-[11.5px] font-medium"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-slate-900 to-[#0F172A] px-6 py-6 mb-5 flex flex-col items-center">
                  <div className="absolute -top-8 -left-8 w-[120px] h-[120px] rounded-full bg-emerald-500/10" />
                  <span className="relative bg-emerald-500/15 text-emerald-200 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3.5">
                    QRIS
                  </span>
                  {qrisImageUrl ? (
                    <img
                      src={qrisImageUrl}
                      alt="Kode QRIS"
                      className="relative w-[168px] h-[168px] object-contain rounded-xl bg-white p-2"
                    />
                  ) : (
                    <div className="relative w-[168px] h-[168px] rounded-xl bg-white/10 flex items-center justify-center">
                      <span className="text-slate-400 text-xs">QRIS belum tersedia</span>
                    </div>
                  )}
                  <p className="relative text-slate-200 text-xs mt-3.5 text-center">
                    Scan menggunakan aplikasi pembayaran favorit Anda
                  </p>
                  {qrisImageUrl && (
                    <a
                      href={qrisImageUrl}
                      download
                      className="relative inline-flex items-center gap-1.5 mt-3 bg-white/10 hover:bg-white/20 text-slate-200 text-[11.5px] font-medium rounded-lg px-3.5 py-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Unduh QR Code
                    </a>
                  )}
                </div>
              )}

              {/* Form bukti transfer */}
              {isTransferBank && (
                <div className="mb-4">
                  <label className="text-slate-900 text-[13px] font-semibold mb-1.5 block">
                    Nama Pengirim <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: CV ABC a.n Budi"
                    value={form.senderName}
                    onChange={(e) => { setForm((f) => ({ ...f, senderName: e.target.value })); setErrors((p) => ({ ...p, senderName: undefined })); }}
                    className={`w-full bg-slate-50 border-[1.5px] rounded-xl px-4 py-3 text-[13.5px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${errors.senderName ? 'border-red-400' : 'border-[#EEF1F5]'}`}
                  />
                  {errors.senderName && <p className="text-[11px] text-red-500 mt-1">{errors.senderName}</p>}
                  {!errors.senderName && <div className="mb-4" />}
                </div>
              )}

              <div className="mb-4">
                <label className="text-slate-900 text-[13px] font-semibold mb-1.5 block">
                  Tanggal Transfer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.transferDate}
                    onChange={(e) => { setForm((f) => ({ ...f, transferDate: e.target.value })); setErrors((p) => ({ ...p, transferDate: undefined })); }}
                    className={`w-full bg-slate-50 border-[1.5px] rounded-xl px-4 py-3 text-[13.5px] text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${errors.transferDate ? 'border-red-400' : 'border-[#EEF1F5]'}`}
                  />
                  <CalendarClock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.transferDate && <p className="text-[11px] text-red-500 mt-1">{errors.transferDate}</p>}
              </div>

              <div className="mb-5">
                <label className="text-slate-900 text-[13px] font-semibold mb-1.5 block">
                  Upload Bukti Transfer <span className="text-red-500">*</span>
                </label>
                <label className="flex flex-col items-center justify-center gap-2.5 border-[1.5px] border-dashed border-slate-300 bg-slate-50/50 rounded-2xl py-7 cursor-pointer hover:border-amber-500 hover:bg-amber-50/20 transition-colors">
                  <div className="w-[38px] h-[38px] rounded-[10px] bg-amber-50 flex items-center justify-center">
                    <CloudUpload className="w-4 h-4 text-amber-600" />
                  </div>
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-32 rounded-lg object-contain" />
                  ) : (
                    <>
                      <span className="text-slate-900 text-[13.5px] font-semibold">Klik atau seret file ke sini</span>
                      <span className="text-slate-400 text-[11.5px]">Maksimal 5MB &middot; JPG, PNG, WEBP</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => { handleFileChange(e.target.files?.[0]); setErrors((p) => ({ ...p, proofFile: undefined })); }}
                  />
                </label>
                {errors.proofFile && <p className="text-[11px] text-red-500 mt-1">{errors.proofFile}</p>}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-br from-amber-500 to-[#EA8A0A] text-white text-sm font-semibold py-3.5 rounded-[13px] shadow-[0_8px_16px_rgba(245,158,11,0.28)] hover:opacity-95 transition-opacity"
              >
                Kirim Sekarang
              </button>
            </>
        </div>
      </div>
    </div>
  );
}
