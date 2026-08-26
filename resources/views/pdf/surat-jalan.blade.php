<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan {{ $order_code }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 28px 36px;
        }
        .title-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; }
        .title-row h1 { font-size: 18px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .title-row .no-box {
            font-size: 11px; border: 1px solid #cbd5e1; padding: 7px 12px; border-radius: 4px; text-align: right;
        }
        .title-row .no-box .lbl { color: #64748b; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
        table.grid { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        table.grid td { padding: 3px 0; vertical-align: top; }
        table.grid .lbl { width: 130px; color: #64748b; }
        .items { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .items th, .items td { border: 1px solid #cbd5e1; }
        .items th { background: #1e293b; color: #fff; padding: 7px 9px; text-align: left; font-size: 10px; }
        .items td { padding: 7px 9px; font-size: 10px; }
        .num { text-align: right; }
        .box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; }
        .box .box-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px; }
        .sign { margin-top: 34px; }
        .sign table { width: 100%; table-layout: fixed; }
        .sign td { vertical-align: top; padding: 0; width: 50%; text-align: center; }
        .sign .placeholder { margin-top: 62px; }
        .note { margin-top: 22px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 9px; color: #64748b; }
    </style>
</head>
<body>
    @include('pdf.partials.company-header')

    <div class="title-row">
        <h1>Surat Jalan</h1>
        <div class="no-box">
            <div class="lbl">No. Surat Jalan</div>
            <strong>{{ $document_number }}</strong>
        </div>
    </div>

    <table class="grid">
        <tr>
            <td class="lbl">Tanggal</td>
            <td>{{ $issue_date }}</td>
            <td class="lbl">Kode Pesanan</td>
            <td><strong>{{ $order_code }}</strong></td>
        </tr>
        <tr>
            <td class="lbl">Dikirim Kepada</td>
            <td><strong>{{ $receiver_name ?? $buyer['name'] }}</strong></td>
            <td class="lbl">NPWP</td>
            <td>{{ $buyer['npwp_display'] ?? '-' }}</td>
        </tr>
        <tr>
            <td class="lbl">Penerima / PIC</td>
            <td>{{ $receiver_name ?: $buyer['name'] }}</td>
            <td class="lbl">Kontak (WhatsApp)</td>
            <td>{{ $receiver_contact }}</td>
        </tr>
        <tr>
            <td class="lbl">Alamat Tujuan</td>
            <td colspan="3">{{ $address }}</td>
        </tr>
        <tr>
            <td class="lbl">Metode</td>
            <td colspan="3">{{ $is_cargo ? 'Pengiriman Cargo / Ekspedisi' : 'Pickup di Workshop Multikon' }}</td>
        </tr>
        @if ($is_cargo)
            <tr>
                <td class="lbl">Kurir / Ekspedisi</td>
                <td>{{ $courier_name }}</td>
                <td class="lbl">No. Resi</td>
                <td>{{ $tracking_number }}</td>
            </tr>
            <tr>
                <td class="lbl">Kontak Driver</td>
                <td colspan="3">{{ $driver_contact }}</td>
            </tr>
        @endif
    </table>

    <table class="items">
        <thead>
            <tr>
                <th style="width:28px">No</th>
                <th>Nama Barang</th>
                <th style="width:50px">Qty</th>
                <th style="width:70px">Satuan</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($items as $idx => $item)
                <tr>
                    <td>{{ $idx + 1 }}</td>
                    <td>{{ $item['product_name'] }}</td>
                    <td class="num">{{ $item['quantity'] }}</td>
                    <td class="num">Unit</td>
                    <td>{{ $notes }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @if (! $is_cargo)
        <div class="box">
            <div class="box-title">Pengambilan Barang</div>
            Barang dapat diambil di <strong>{{ $company['name'] }}</strong> — {{ $company['address'] }}. Hubungi {{ $company['phone'] }} untuk pengaturan jadwal pengambilan.
        </div>
    @endif

    <div class="sign">
        <table>
            @if ($is_cargo)
                <tr>
                    <td style="width:33.33%">Penerima Barang,</td>
                    <td style="width:33.33%">Sopir / Kurir,</td>
                    <td style="width:33.33%">Pengirim (CV Multikon Erindotama),</td>
                </tr>
                <tr>
                    <td style="width:33.33%"><div class="placeholder">(Tanda Tangan &amp; Nama)</div></td>
                    <td style="width:33.33%"><div class="placeholder">(Tanda Tangan &amp; Nama)</div></td>
                    <td style="width:33.33%"><div class="placeholder">(Tanda Tangan &amp; Stempel)</div></td>
                </tr>
            @else
                <tr>
                    <td>Penerima Barang,</td>
                    <td>Pengirim (CV Multikon Erindotama),</td>
                </tr>
                <tr>
                    <td><div class="placeholder">(Tanda Tangan &amp; Nama)</div></td>
                    <td><div class="placeholder">(Tanda Tangan &amp; Stempel)</div></td>
                </tr>
            @endif
        </table>
    </div>

    <div class="note">
        Barang yang tercantum di atas telah diperiksa dan diserahkan dalam keadaan baik. Surat jalan ini diterbitkan otomatis oleh sistem Multikon — simpan sebagai bukti serah terima barang.
    </div>
</body>
</html>