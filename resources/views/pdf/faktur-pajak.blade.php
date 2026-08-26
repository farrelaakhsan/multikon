<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Faktur Pajak {{ $order_code }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 28px 36px;
            position: relative;
        }
        .faktur-head { text-align: center; margin-bottom: 18px; }
        .faktur-head h1 { font-size: 20px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 2px; }
        .faktur-head .serial { font-size: 12px; font-family: 'DejaVu Sans Mono', monospace; font-weight: bold; }
        .faktur-head .tgline { font-size: 10px; color: #475569; margin-top: 4px; }
        table.info { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
        table.info td { padding: 3px 0; vertical-align: top; }
        table.info .lbl { width: 150px; color: #64748b; }
        table.info .pkc { border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; }
        table.info .pkc-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 2px; }
        table.info .pkc-name { font-size: 12px; font-weight: bold; }
        .items { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .items th, .items td { border: 1px solid #cbd5e1; }
        .items th { background: #1e293b; color: #fff; padding: 7px 9px; text-align: left; font-size: 10px; }
        .items td { padding: 7px 9px; font-size: 10px; }
        .num { text-align: right; }
        .sum { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .sum td { padding: 4px 0; }
        .sum .lbl { width: 70%; text-align: right; color: #475569; }
        .sum .val { width: 30%; text-align: right; font-weight: bold; }
        .sign { margin-top: 28px; }
        .sign table { width: 100%; table-layout: fixed; }
        .sign td { vertical-align: top; width: 50%; text-align: center; }
        .sign .placeholder { margin-top: 60px; }
        .note { margin-top: 22px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 9px; color: #64748b; }
        .watermark {
            position: fixed;
            top: 45%;
            left: 0; right: 0;
            text-align: center;
            font-size: 64px;
            font-weight: bold;
            color: rgba(30, 41, 59, 0.05);
            transform: rotate(-32deg);
            pointer-events: none;
            z-index: 0;
        }
    </style>
</head>
<body>
    <div class="watermark">SIMULASI</div>

    <div class="faktur-head">
        <h1>Faktur Pajak</h1>
        <div class="serial">{{ $document_number }}</div>
        <div class="tgline">Nomor Seri Faktur Pajak — Tanggal Penerbitan {{ $issue_date }}</div>
    </div>

    <table class="info">
        <tr>
            <td colspan="2">
                <div class="pkc">
                    <div class="pkc-title">Pengusaha Kena Pajak</div>
                    <div class="pkc-name">{{ $company['name'] }}</div>
                    <div>NPWP: {{ $company['npwp'] }}</div>
                    <div>{{ $company['address'] }}</div>
                </div>
            </td>
        </tr>
    </table>

    <table class="info">
        <tr>
            <td class="lbl">Masa Pajak</td>
            <td>{{ $masa }}</td>
            <td class="lbl">Tahun Pajak</td>
            <td>{{ $tahun }}</td>
        </tr>
        <tr>
            <td class="lbl">Tanggal Faktur</td>
            <td>{{ $issue_date }}</td>
            <td class="lbl">Kode Pesanan</td>
            <td>{{ $order_code }}</td>
        </tr>
        <tr>
            <td colspan="4">
                <div class="pkc">
                    <div class="pkc-title">Pembeli Barang Kena Pajak</div>
                    <div class="pkc-name">{{ $buyer['name'] }}</div>
                    <div>NPWP: {{ $buyer['npwp_display'] ?? '-' }}</div>
                    <div>Alamat: {{ $address }}</div>
                </div>
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th style="width:28px">No</th>
                <th>Nama Barang Kena Pajak / Jasa</th>
                <th style="width:44px">Qty</th>
                <th style="width:100px">Harga Satuan</th>
                <th style="width:110px">Jumlah (Termasuk PPN)</th>
                <th style="width:95px">PPN (11%)</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($items as $idx => $item)
                <tr>
                    <td>{{ $idx + 1 }}</td>
                    <td>{{ $item['product_name'] }}{{ $is_bill && $bill ? ' — ' . $bill['label'] . ' (' . $bill['percent'] . '%)' : '' }}</td>
                    <td class="num">{{ $item['quantity'] }}</td>
                    <td class="num">Rp {{ number_format($item['unit_price'], 0, ',', '.') }}</td>
                    <td class="num">Rp {{ number_format($item['subtotal'], 0, ',', '.') }}</td>
                    <td class="num">Rp {{ number_format(round($item['subtotal'] / 1.11 * 0.11, 2), 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="sum">
        <tr>
            <td class="lbl">Jumlah Dasar Pengenaan Pajak</td>
            <td class="val">Rp {{ number_format($dpp, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="lbl">Jumlah PPN (11%)</td>
            <td class="val">Rp {{ number_format($ppn, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="lbl">Jumlah Total (Termasuk PPN)</td>
            <td class="val">Rp {{ number_format($total, 0, ',', '.') }}</td>
        </tr>
    </table>

    <div class="sign">
        <table>
            <tr>
                <td>Pembeli Barang Kena Pajak</td>
                <td>Pengusaha Kena Pajak</td>
            </tr>
            <tr>
                <td><div class="placeholder">(Tanda Tangan)</div></td>
                <td><div class="placeholder">(Tanda Tangan &amp; Stempel)</div></td>
            </tr>
            <tr>
                <td style="padding-top:6px">{{ $buyer['name'] }}</td>
                <td style="padding-top:6px">{{ $company['director'] }} — {{ $company['name'] }}</td>
            </tr>
        </table>
    </div>

    <div class="note">
        Faktur Pajak ini merupakan SIMULASI yang diterbitkan otomatis oleh sistem Multikon dan belum dikirim/divalidasikan ke DJP. Data NPWP Pengusaha Kena Pajak bersifat sementara — harap konfirmasi ke CV Multikon Erindotama sebelum digunakan untuk pelaporan PPN.
    </div>
</body>
</html>