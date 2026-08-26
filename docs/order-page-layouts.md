# Order Page Layouts — Multikon

Dokumentasi layout, state variants, dan behavior dari page-page terkait pesanan (user-facing dan admin).

---

## 1. User: MyOrders.jsx (`/orders`)

**Layout:** Full-page listing, `PublicLayout`.

### Top Section
- Breadcrumb: Home › Pesanan Saya
- Header: "Pesanan Saya" (judul besar) + total count + link "Belanja Lagi" ke `/catalog`
- Filter tabs (pill buttons): Semua / Belum Bayar / Diproses / Dikirim / Selesai
  - Meneruskan `?filter=` query param ke `/orders`
  - Aktif: bg `#1E293B` text putih; Inaktif: bg putih border slate

### Order Cards (per-item)
Setiap item adalah `<Link>` ke `/order/{order_code}/tracking`.

**Unread dot badge:** Jika `order.has_unread_for_user === true`, render red dot absolute `top-3 right-3`.

**Card layout:**
- Kiri: `ProductImage` (24x24 rounded-2xl) atau fallback icon
- Kanan:
  - Badge tipe: "Product Custom" (amber) atau "Ready Stock"
  - Nama produk (line-clamp-2)
  - `StatusBadge` dengan label status
  - Baris info: kode order (mono) | tanggal | quantity
  - Harga: "Total Belanja" + total_price (text-lg font-black)
  - Hover: muncul "Lihat Rincian →"
- Bottom bar (bg `#F8F9FA`):
  - Metode bayar
  - Status bayar (Lunas / Belum Dibayar) dengan dot

### Empty State
Icon box, "Belum Ada Pesanan", deskripsi, tombol "Lihat Katalog".

### Pagination
Render `Pagination` component di bawah daftar jika `orders.links` tersedia.

---

## 2. User: Detail.jsx (`/order/{code}/tracking`)

**Layout:** 2-column grid (`lg:grid-cols-3`), `PublicLayout`.

### Global Header
- Tombol "Kembali" ke `/orders`
- Judul "Rincian Pesanan"
- Kode order (mono)
- `StatusBadge` — jika `payment_proof` terkirim, tampilkan "Sedang Diverifikasi" terlepas dari status sebenarnya

### State Variants

#### A. Cargo Courier Selection (full-width)
**Muncul jika:** `isCargo && !shipping_cost && !isPaid && status === 'waiting_payment' && estimated_weight`

Tombol "Cek Ongkir" → POST `/orders/{id}/shipping-cost` (fetch dengan CSRF header).
Response ditampilkan sebagai daftar courier card dengan rates (selectable).
- Simpan: PATCH `/orders/{id}/shipping` → simpan `courier_name`, `courier_service`, `shipping_cost`
- Batal: reset ke state awal
- Jika tidak ada kurir: teks "Tidak ada kurir tersedia"

#### B. Payment Proof Sent Banner (full-width)
**Muncul jika:** `!isPaid && payment_proof`
Amber banner: "Bukti Pembayaran Sedang Diverifikasi".

#### C. Confirm Received (left column, inside)
**Muncul jika:** `status === 'shipped'`
Blue info card:
- Cargo: "Pesanan Sedang Dalam Pengiriman" + tombol "Pesanan Diterima"
- Pickup: "Pesanan Siap Diambil" + tombol "Barang Sudah Diambil"
- Link "Bantuan / Laporkan Kendala" ke WhatsApp

#### D. Pickup Info Card (left column)
**Muncul jika:** `status === 'shipped' && !isCargo`
Workshop name, address, maps link, hours, PIC, WA kontak.
"Tunjukkan Kode Pesanan" tip.

#### E. Produk Dipesan (left column, always)
- `ProductImage` atau fallback
- Badge "Product Custom" / "Ready Stock"
- Nama produk
- Quantity × price

#### F. Alamat Pengiriman (left column)
**Muncul jika:** `order.address`
- Nama penerima, alamat lengkap
- Badge "Cargo" atau "Pickup"
- **Di dalam card (conditional):** Jika ada `custom_requirements`, `custom_specifications`, `custom_notes`, `reference_file_url`, atau `notes`, muncul separator + field-field tersebut:
  - `custom_requirements`: "Kebutuhan"
  - `custom_specifications`: "Spesifikasi" (whitespace-pre-line)
  - `custom_notes`: "Catatan"
  - `reference_file_url`: **File Referensi** — preview thumbnail untuk jpg/jpeg/png/webp dengan overlay "Lihat" yang membuka modal; untuk PDF fallback sebagai link "Lihat File"
  - `notes`: "Catatan Pesanan"

#### G. Informasi Pengiriman (left column)
**Muncul jika:** `isCargo && shipping_cost && status !== 'shipped'`
Menampilkan nama kurir + ongkir yang sudah dipilih user.

#### H. Waiting Review Banner (left column)
**Muncul jika:** `isCustom && status === 'waiting_review'`
Purple banner: "Menunggu admin mereview dan menentukan harga"

#### I. Shipping Info — Cargo Shipped (left column)
**Muncul jika:** `status === 'shipped' && isCargo`
Grid 2-col: Kurir, No Resi (dengan tombol Salin), Kontak Driver (dengan WA link), Bukti Pengiriman (thumbnail, klik perbesar).

### Right Column (sticky)

#### Rincian Tagihan
- Subtotal
- Ongkos Kirim: "Belum Ditentukan" (jika needsShippingCost), "Gratis" (jika pickup), atau nominal
- Grand Total (jika tidak needsShippingCost)
- **Payment Success Banner** (jika isPaid): green banner "Pembayaran Lunas"
- **Waiting Payment Banner** (jika `showWaitingPayment`): amber "Menunggu pembayaran"
- **Bayar Sekarang button** (jika `showPaymentAction && !payment_proof`): Link ke `/order/payment/{order_code}`

#### Status & Progress
Timeline dari `order.progress_steps`:
- Complete: green check
- Active: amber dot (pulse)
- Inactive: grey dot
- Label + sublabel (Selesai / Sedang Diproses / Menunggu)

#### Payment Method Card (pre-payment)
**Muncul jika:** `!isPaid && !needsShippingCost && status !== 'waiting_review' && !payment_proof`
- Default state: tampilkan metode yang dipilih + tombol "Ubah"
- Edit state: daftar payment options (bank transfer + QRIS), pilih, "Konfirmasi Perubahan" → PATCH `/orders/{id}/payment-method`

#### Payment Proof Sent Card
**Muncul jika:** `showPaymentProofSent && !resending`
- Metode pembayaran + icon
- Bukti transfer (thumbnail) + "Lihat Bukti" → modal
- "Kirim Ulang / Ubah Bukti Bayar"
- "Hubungi CS via WhatsApp"

#### Upload Resend Form
**Muncul jika:** `showPaymentProofSent && resending`
- Dropzone / preview file
- "Kirim Ulang Bukti Bayar" → POST

### Modals
- **Receipt Modal**: full-size payment proof image
- **Reference File Modal**: full-size reference file image
- **Shipping Photo Modal**: full-size shipping proof image

---

## 3. User: Payment.jsx (`/order/payment/{code}`)

**Layout:** 2-column grid (`lg:grid-cols-3`), `PublicLayout`.

**Shared untuk:** Ready stock dan custom (unified).
`handleSubmit` POST ke `/order/{code}/custom-payment` jika custom, `/order/payment/{code}` jika ready stock.

### State: PAID (full-width)
Green banner: "Pembayaran Terkonfirmasi".

### State: Not Paid

#### Header
- Back link ke tracking page
- Judul "Pembayaran" + kode order
- StatusBadge: "Proses Verifikasi" (jika hasProof) / "Menunggu Pembayaran"

#### Left Column
1. **Receipt Card** (`showProofSent`):
   - Amber alert: "Bukti Pembayaran Berhasil Dikirim"
   - Thumbnail bukti + "Lihat Foto" + "Unggah Ulang"

2. **Bank Transfer Card** (jika bank):
   - Icon bank (3 huruf pertama), nama bank
   - Nomor rekening (besar) + tombol "Salin"
   - a.n. pemilik rekening

3. **QRIS Card** (jika qris):
   - Image QRIS + "Scan QR Code"

4. **Total Tagihan**: total_price (text-3xl bold)

5. **Rincian Pesanan** (collapsible):
   - Nama produk × qty, subtotal
   - Ongkir: nominal / "Gratis" / "Akan Dikonfirmasi"
   - Total

#### Right Column (sticky)

**Proof-sent state:**
- Timeline step: Bukti Dikirim (✓) → Verifikasi Admin (active) → Pesanan Diproses (next)
- "Lihat Status Pesanan Saya" link
- "Bantuan CS / Konfirmasi WA"

**Upload state** (`showUploadForm`):
- Dropzone / preview file upload
- "Kirim Bukti Bayar" button
- "Kembali ke Pesanan Saya" link

### Modal
- Receipt Modal: full-size bukti bayar

---

## 4. Admin: Orders/Index.jsx (`/admin/orders`)

**Layout:** Single column, `AdminLayout`.

### Stats Row
4 card stats: Total Pesanan, Menunggu, Diproses, Selesai (masing-masing dengan count).

### Search + Filter Bar
- Search input (debounce 400ms) → `?search=` query param
- Filter pills: All, Ready Stock (■), Product Custom (◆)
- Routing ke `/admin/orders` + query params

### Order Cards (per-item)
Clickable card `border-l-4` dengan accent warna sesuai status.

**Unread dot badge:** Jika `order.has_unread_for_admin === true`, render red dot absolute `-top-1.5 -right-1.5`.

**Card layout:**
- Avatar/kiri: product image thumbnail (40x40 rounded)
- Tengah:
  - Kode order (mono, amber) + payment status label (Lunas/Belum)
  - Nama customer
  - Nama produk + tanggal
- Kanan:
  - Order type badge: Custom (bg dark, amber text) / Ready (bg amber)
  - StatusBadge dengan dot + label

### Empty State
Pesan sesuai filter: "Belum Ada Pesanan" / custom / ready stock, atau "Pesanan Tidak Ditemukan" jika search.

### Pagination
Render `Pagination` component.

---

## 5. Admin: Orders/Show.jsx (`/admin/orders/{id}`)

**Layout:** 2-column grid (`md:grid-cols-3`), `AdminLayout`.

### Global Header
- Back button ke `/admin/orders`
- "Detail Pesanan"
- Order code (mono, copy button) + StatusBadge

### Smart Action Bar (full-width)
Data pengiriman + tombol aksi berdasarkan status:
- `waiting_confirmation` / `waiting_payment` (dengan proof): "Konfirmasi Pembayaran" (emerald)
- `processing` / `in_production`: "Kirim Pesanan" (cargo) / "Siap Diambil" (pickup) → blue
- `shipped`: "Menunggu Konfirmasi Pembeli" (indigo) + "Selesaikan (Override)"
- Selalu ada: "Hubungi via WhatsApp" link

### Left Column

#### A. Payment Section (3 sub-variant)
1. **Unpaid (no proof)**: Icon + "Belum Ada Pembayaran" + payment label
2. **Waiting verification (hasProof, unpaid)**: Amber left border card
   - Label "Menunggu Verifikasi" + metode bayar
   - Total harga (besar)
   - Bukti transfer thumbnail + "Perbesar"
   - Tombol "Tolak" (reset ke pending_payment) + "Konfirmasi Pembayaran" (green)
3. **Paid**: Green left border card
   - "Pembayaran Terkonfirmasi" + metode bayar
   - Thumbnail bukti (clickable)

#### B. Rincian Produk
- Product image, nama, tipe (Product Custom badge jika custom)
- Quantity × price → subtotal
- Ongkos kirim (jika ada)
- Total pesanan (double border-top)

#### C. Info Pengiriman
**Muncul jika:** sudah ada shipping data (courier/tracking/driver/proof)
- Nama kurir + resi + tombol "Edit"
- Kontak driver
- Bukti pengiriman thumbnail

#### D. Aktivitas Pesanan (timeline)
**Muncul jika:** ada activities
- Per activity: icon sesuai status + label + timestamp

#### E. Info Pelanggan & Logistik
- Nama pemesan (👤)
- Kontak (📞) — WA link
- Alamat pengiriman (📍) + badge Cargo/Pickup
- Catatan pesanan (📝), jika ada
- **Custom-only fields**:
  - Kebutuhan Custom (✏️)
  - Spesifikasi (📐) — whitespace-pre-line
  - Catatan Custom (📌)
  - **File Referensi** (📎) — thumbnail preview untuk gambar (jpg/jpeg/png/webp) dengan overlay "Lihat" link ke new tab; PDF fallback sebagai "Lihat File" link

### Right Column (sticky)

#### Progress Pesanan (timeline)
Sama seperti user detail, dengan tambahan timestamp per step.

### Custom Price Sticky CTA (bottom)
**Muncul jika:** `isCustom && status === 'waiting_review' && !custom_price`
Sticky bar: "Pesanan Custom — Belum ada harga" + "Tetapkan Harga" button → modal.

**Modal form:**
- "Harga per Unit (Rp)" — input numeric required
- "Estimasi Berat (kg)" — input number, **hanya untuk cargo** (required)
- Info text: buyer bisa lihat harga setelah ditetapkan
- "Tetapkan Harga" → PATCH `/admin/orders/{id}/set-price`

### Shipping Modal
**Trigger:** Tombol "Kirim Pesanan" (dari smart action) atau "Edit" (dari info pengiriman)

Form fields:
- Nama ekspedisi (auto-fill dari data customer, atau input manual jika belum)
- Nomor Resi / Surat Jalan (required)
- Kontak Driver/Kurir (required)
- Bukti Pengiriman (file upload, optional)
- Submit → POST `/admin/orders/{id}/shipping` (forceFormData)

Untuk pickup: tampilkan info "Ambil Sendiri (Pickup)" saja (tidak perlu input ekspedisi).

### Receipt Modal
Full-size payment proof image lightbox.

---

## Status Flow

### Ready Stock
```
pending_payment → waiting_confirmation → processing → shipped → completed
```

### Custom
```
waiting_review → waiting_payment → processing → in_production → shipped → done
```

Setelah `setCustomPrice` (admin), langsung ke `waiting_payment`.
Setelah `prosesCustomPayment` (user upload bukti), ke `waiting_confirmation`.

### Notifikasi Dot Badge
- **has_unread_for_admin**: Set true saat user melakukan aksi (storeCustom, prosesPayment, dll). Clear saat admin buka detail (show).
- **has_unread_for_user**: Set true saat admin melakukan aksi (updateStatus, confirmPayment, setCustomPrice, storeShipping). Clear saat user buka tracking.

---

## Key Components & Utilities Used

| Component | Usage |
|-----------|-------|
| `ProductImage` | Product image display (automatic fallback) |
| `Pagination` | Pagination links |
| `PublicLayout` | User-facing page layout |
| `AdminLayout` | Admin page layout |
| `StatusBadge` | Order status badge (color-coded) |
| `formatPrice` | Price formatting (Rp) |
| `InfoLabel` | Label + value pair |
| `SectionCard` (admin) | Card wrapper with optional title |

---

## Catatan Penting

- **File Referensi**: Gunakan regex `/\.(jpg|jpeg|png|webp)(\?|$)/i` untuk deteksi image, bukan `String.match()` (bisa render "0").
- **Upload payment**: Selalu gunakan `forceFormData: true` dengan `router.post()` / `router.patch()`.
- **CSRF Token**: Saat menggunakan `fetch()` untuk Cek Ongkir, ambil token dari `<meta name="csrf-token">`.
- **Pickup shipping**: `shipping_method === 'pickup'` berarti ongkir gratis (`shipping_cost = 0`) dan tidak perlu courier selection.
