export const WORKSHOP = {
    name: 'Workshop & Warehouse Multikon',
    pic: 'Pak Budi',
};

export const DOC_META = {
    commercial_invoice: { label: 'Commercial Invoice', color: 'bg-amber-100 text-amber-700' },
    faktur_pajak: { label: 'Faktur Pajak (PPN 11%)', color: 'bg-indigo-100 text-indigo-700' },
    surat_jalan: { label: 'Surat Jalan', color: 'bg-emerald-100 text-emerald-700' },
};

export const ADMIN_DOC_TYPES = [
    { type: 'commercial_invoice', label: 'Commercial Invoice' },
    { type: 'faktur_pajak', label: 'Faktur Pajak' },
    { type: 'surat_jalan', label: 'Surat Jalan' },
];

export const STATUS_TONE_MAP = {
    completed: 'selesai',
    done: 'selesai',
    pending_payment: 'menunggu',
    waiting_payment: 'menunggu',
    waiting_confirmation: 'menunggu',
    waiting_review: 'menunggu',
    waiting_settlement: 'menunggu',
    processing: 'proses',
    in_production: 'proses',
    shipped: 'proses',
    po_verification: 'proses',
    cancelled: 'batal',
    rejected: 'batal',
};

export const ACCENT_MAP = {
    menunggu: 'border-l-amber-400',
    proses: 'border-l-blue-400',
    selesai: 'border-l-emerald-400',
    batal: 'border-l-red-400',
};
