import { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Upload, CloudUpload, X, Download, Building2, Smartphone } from 'lucide-react';
import { formatCurrency } from '../../../../utils/format';

export default function PopupMetodeBayar({ orderId, orderCode, stage, isOpen, onClose }) {
  const { props } = usePage();
  const paymentSettings = props.paymentSettings || {};
  const bankAccounts = paymentSettings.bank_accounts || [];
  const qrisImageUrl = paymentSettings.qris_image_url;

  const [metode, setMetode] = useState('transfer_bank');
  const [senderBankName, setSenderBankName] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setMetode('transfer_bank');
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
    if (metode === 'transfer_bank' && !senderBankName.trim()) newErrors.sender_bank_name = 'Wajib diisi';
    if (!transferDate) newErrors.transfer_date = 'Wajib diisi';
    if (!file) newErrors.file = 'Wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('payment_proof', file);
    formData.append('metode', metode);
    formData.append('sender_bank_name', senderBankName);
    formData.append('transfer_date', transferDate);

    router.post(`/orders/${orderId}/termin-bill`, formData, {
      forceFormData: true,
      onSuccess: () => onClose(),
    });
  };

  if (!isOpen || !stage) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-[20px] p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <p className="text-[16px] font-bold text-slate-800">
            Bayar {stage.label}
          </p>
          <button type="button" onClick={onClose}>
            <X className="w-[18px] h-[18px] text-slate-400 hover:text-slate-600" />
          </button>
        </div>
        <p className="text-[13px] text-slate-500 mb-4">
          {formatCurrency(stage.amount)} — pilih metode pembayaran
        </p>

        {/* Radio Metode */}
        <RadioMetode
          selected={metode === 'transfer_bank'}
          onSelect={() => setMetode('transfer_bank')}
          icon={<Building2 className="w-5 h-5" />}
          title="Transfer bank"
          subtitle="Transfer manual ke rekening perusahaan"
        />
        <RadioMetode
          selected={metode === 'qris'}
          onSelect={() => setMetode('qris')}
          icon={<Smartphone className="w-5 h-5" />}
          title="QRIS"
          subtitle="Scan untuk bayar via e-wallet/m-banking"
        />

        {/* Form */}
        <div className="border-t border-slate-200 pt-4 mt-3">
          {metode === 'transfer_bank' ? (
            <FormTransferBank
              bankAccounts={bankAccounts}
              senderBankName={senderBankName}
              setSenderBankName={setSenderBankName}
              transferDate={transferDate}
              setTransferDate={setTransferDate}
              file={file}
              preview={preview}
              dragActive={dragActive}
              setDragActive={setDragActive}
              handleFileChange={handleFileChange}
              handleDrop={handleDrop}
              fileInputRef={fileInputRef}
              errors={errors}
              setErrors={setErrors}
            />
          ) : (
            <FormQris
              qrisImageUrl={qrisImageUrl}
              transferDate={transferDate}
              setTransferDate={setTransferDate}
              file={file}
              preview={preview}
              dragActive={dragActive}
              setDragActive={setDragActive}
              handleFileChange={handleFileChange}
              handleDrop={handleDrop}
              fileInputRef={fileInputRef}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-[14px] mt-4 transition-colors"
          >
            Kirim bukti pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}

function RadioMetode({ selected, onSelect, icon, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 mb-2.5 text-left border-[1.5px] transition ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
        selected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
      }`}>
        {selected && <span className="w-2 h-2 rounded-full bg-white" />}
      </div>
      <div className={`${selected ? 'text-blue-700' : 'text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-[13.5px] font-semibold ${selected ? 'text-blue-800' : 'text-slate-800'}`}>{title}</p>
        <p className="text-[11.5px] text-slate-500">{subtitle}</p>
      </div>
    </button>
  );
}

function FormTransferBank({
  bankAccounts, senderBankName, setSenderBankName, transferDate, setTransferDate,
  file, preview, dragActive, setDragActive, handleFileChange, handleDrop,
  fileInputRef, errors, setErrors,
}) {
  const firstBank = bankAccounts[0] || null;

  return (
    <>
      {firstBank && (
        <>
          <FieldLabel>Transfer ke rekening</FieldLabel>
          <div className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 mb-3">
            <p className="text-[13.5px] font-semibold text-slate-800">
              {firstBank.bank} — {firstBank.account}
            </p>
            <p className="text-[12px] text-slate-500 mt-0.5">a.n. {firstBank.name}</p>
          </div>
        </>
      )}

      <FieldLabel>Nama pengirim</FieldLabel>
      <input
        type="text"
        placeholder="Nama sesuai rekening pengirim"
        value={senderBankName}
        onChange={(e) => { setSenderBankName(e.target.value); setErrors((p) => ({ ...p, sender_bank_name: undefined })); }}
        className={`w-full border rounded-[10px] px-3.5 py-[11px] text-[13.5px] text-slate-800 bg-[#F8F9FA] mb-1 ${errors.sender_bank_name ? 'border-red-400' : 'border-slate-200'}`}
      />
      {errors.sender_bank_name && <p className="text-[11px] text-red-500 mb-3">{errors.sender_bank_name}</p>}
      {!errors.sender_bank_name && <div className="mb-3" />}

      <FieldLabel>Tanggal transfer</FieldLabel>
      <input
        type="date"
        value={transferDate}
        onChange={(e) => { setTransferDate(e.target.value); setErrors((p) => ({ ...p, transfer_date: undefined })); }}
        className={`w-full border rounded-[10px] px-3.5 py-[11px] text-[13.5px] text-slate-800 bg-[#F8F9FA] mb-1 ${errors.transfer_date ? 'border-red-400' : 'border-slate-200'}`}
      />
      {errors.transfer_date && <p className="text-[11px] text-red-500 mb-3">{errors.transfer_date}</p>}
      {!errors.transfer_date && <div className="mb-3" />}

      <FieldLabel>Bukti transfer</FieldLabel>
      <FileDropzone
        file={file} preview={preview} dragActive={dragActive}
        setDragActive={setDragActive} handleFileChange={handleFileChange}
        handleDrop={handleDrop} fileInputRef={fileInputRef}
        error={errors.file} clearError={() => setErrors((p) => ({ ...p, file: undefined }))}
      />
    </>
  );
}

function FormQris({
  qrisImageUrl, transferDate, setTransferDate,
  file, preview, dragActive, setDragActive, handleFileChange, handleDrop,
  fileInputRef, errors, setErrors,
}) {
  return (
    <>
      <FieldLabel>Scan atau unduh QRIS</FieldLabel>
      <div className="bg-[#F8F9FA] border border-slate-200 rounded-xl p-4 mb-3 flex flex-col items-center">
        {qrisImageUrl ? (
          <>
            <img
              src={qrisImageUrl}
              alt="QRIS pembayaran"
              className="w-[140px] h-[140px] object-contain bg-white border border-slate-200 rounded-lg"
            />
            <a
              href={qrisImageUrl}
              download
              className="mt-2.5 text-blue-600 text-[12.5px] font-medium flex items-center gap-1 hover:underline"
            >
              <Download className="w-3.5 h-3.5" /> Unduh QRIS
            </a>
          </>
        ) : (
          <div className="w-[140px] h-[140px] rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-[12px]">
            QRIS tidak tersedia
          </div>
        )}
      </div>

      <FieldLabel>Tanggal pembayaran</FieldLabel>
      <input
        type="date"
        value={transferDate}
        onChange={(e) => { setTransferDate(e.target.value); setErrors((p) => ({ ...p, transfer_date: undefined })); }}
        className={`w-full border rounded-[10px] px-3.5 py-[11px] text-[13.5px] text-slate-800 bg-[#F8F9FA] mb-1 ${errors.transfer_date ? 'border-red-400' : 'border-slate-200'}`}
      />
      {errors.transfer_date && <p className="text-[11px] text-red-500 mb-3">{errors.transfer_date}</p>}
      {!errors.transfer_date && <div className="mb-3" />}

      <FieldLabel>Bukti pembayaran</FieldLabel>
      <FileDropzone
        file={file} preview={preview} dragActive={dragActive}
        setDragActive={setDragActive} handleFileChange={handleFileChange}
        handleDrop={handleDrop} fileInputRef={fileInputRef}
        error={errors.file} clearError={() => setErrors((p) => ({ ...p, file: undefined }))}
      />
    </>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="text-[12.5px] font-semibold text-slate-800 block mb-1.5">{children}</label>
  );
}

function FileDropzone({ file, preview, dragActive, setDragActive, handleFileChange, handleDrop, fileInputRef, error, clearError }) {
  return (
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-[1.5px] border-dashed rounded-xl p-5 text-center bg-[#F8F9FA] cursor-pointer transition ${
          error ? 'border-red-400' : dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
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
          onChange={(e) => { handleFileChange(e.target.files?.[0]); clearError(); }}
        />
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </>
  );
}
