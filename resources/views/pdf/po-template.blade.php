<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contoh Template Purchase Order (PO)</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 32px 40px;
        }
        .header {
            border-bottom: 3px solid #1e293b;
            padding-bottom: 12px;
            margin-bottom: 18px;
        }
        .header .line1 { font-size: 16px; font-weight: bold; }
        .header .line2 { font-size: 11px; color: #475569; }
        .title-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 18px;
        }
        .title-row h1 { font-size: 18px; margin: 0; text-transform: uppercase; }
        .title-row .no-po {
            font-size: 12px;
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            border-radius: 4px;
        }
        .tables { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
        .tables td { padding: 4px 0; }
        .tables .label { width: 150px; color: #64748b; }
        .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items th,
        .items td { border: 1px solid #cbd5e1; }
        .items th {
            background: #1e293b;
            color: #fff;
            padding: 8px 10px;
            text-align: left;
            font-size: 11px;
        }
        .items td { padding: 8px 10px; font-size: 11px; }
        .items .num { text-align: right; }
        .sign { margin-top: 36px; }
        .sign table { width: 100%; table-layout: fixed; }
        .sign td { vertical-align: top; padding: 0; width: 50%; }
        .sign .right { text-align: right; }
        .sign .placeholder { margin-top: 70px; }
        .note {
            margin-top: 28px;
            padding-top: 12px;
            border-top: 1px dashed #cbd5e1;
            font-size: 10px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="line1">[KOP SURAT PERUSAHAAN PEMOHON]</div>
        <div class="line2">Nama PT / CV — Alamat — Nomor Telepon — NPWP</div>
    </div>

    <div class="title-row">
        <h1>Purchase Order</h1>
        <div class="no-po">No. PO: [Nomor PO]</div>
    </div>

    <table class="tables">
        <tr>
            <td class="label">Tanggal</td>
            <td>[Tanggal PO]</td>
        </tr>
        <tr>
            <td class="label">Kepada</td>
            <td>CV Multikon Erindotama — Jl. Jatinegara Kaum No.17A, Jakarta Timur</td>
        </tr>
        <tr>
            <td class="label">Pembeli</td>
            <td>[Nama Perusahaan Pembeli]</td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th style="width:30px">No</th>
                <th>Rincian Barang</th>
                <th style="width:50px">Qty</th>
                <th style="width:60px">Satuan</th>
                <th style="width:120px">Harga Satuan</th>
                <th style="width:120px">Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>[Nama Produk / Spesifikasi]</td>
                <td>[Qty]</td>
                <td>[unit]</td>
                <td class="num">Rp [Harga Satuan]</td>
                <td class="num">Rp [Total]</td>
            </tr>
            <tr>
                <td colspan="5" style="text-align:right"><strong>Total</strong></td>
                <td class="num"><strong>Rp [Total Keseluruhan]</strong></td>
            </tr>
        </tbody>
    </table>

    <p>
        <strong>Catatan / Ketentuan:</strong><br>
        Barang yang tercantum di atas kami mohon disediakan sesuai syarat &amp; ketentuan yang berlaku di CV Multikon Erindotama.
    </p>

    <div class="sign">
        <table>
            <tr>
                <td class="right">Hormat Kami,<br>(Pihak Pemesan)</td>
                <td>Mengetahui / Menyetujui,<br>(CV Multikon Erindotama)</td>
            </tr>
            <tr>
                <td class="right">
                    <div class="placeholder">(Tanda Tangan &amp; Stempel)</div>
                </td>
                <td>
                    <div class="placeholder">(Tanda Tangan &amp; Stempel)</div>
                </td>
            </tr>
            <tr>
                <td class="right" style="padding-top:10px">Nama &amp; Jabatan</td>
                <td style="padding-top:10px">Nama &amp; Jabatan</td>
            </tr>
        </table>
    </div>

    <div class="note">
        Template ini hanya contoh acuan. Ganti seluruh teks dalam kurung siku [ ... ] dengan data perusahaan dan pesanan Anda, serta lengkapi stempel &amp; tanda tangan pejabat berwenang agar PO dinyatakan sah.
    </div>
</body>
</html>