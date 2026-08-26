/**
 * Format angka ke format harga Rupiah.
 */
export function formatPrice(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value || 0));
}

/**
 * Format angka ke format harga Rupiah dengan prefix Rp.
 */
export function formatCurrency(value) {
    return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}

/**
 * Format ISO date string ke format Indonesia.
 */
export function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/**
 * Gambar fallback jika produk tidak punya gambar.
 */
export const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000";
