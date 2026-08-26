<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Commercial Invoice {{ $order_code }}</title>
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
        .title-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 16px;
        }
        .title-row h1 { font-size: 18px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .title-row .no-box {
            font-size: 11px;
            border: 1px solid #cbd5e1;
            padding: 7px 12px;
            border-radius: 4px;
            text-align: right;
        }
        .title-row .no-box .lbl { color: #64748b; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
        .grid-2 { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .grid-2 td { padding: 3px 0; vertical-align: top; }
        .grid-2 .lbl { width: 130px; color: #64748b; }
        .box {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px 12px;
            margin-bottom: 16px;
        }
        .box .box-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px; }
        .items { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .items th, .items td { border: 1px solid #cbd5e1; }
        .items th { background: #1e293b; color: #fff; padding: 7px 9px; text-align: left; font-size: 10px; }
        .items td { padding: 7px 9px; font-size: 10px; }
        .num { text-align: right; }
        .sum { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .sum td { padding: 4px 0; }
        .sum .lbl { width: 70%; text-align: right; color: #475569; }
        .sum .val { width: 30%; text-align: right; font-weight: bold; }
        .sum .grand { font-size: 13px; }
        .status-pill {
            display: inline-block;
            border: 1px solid #f59e0b;
            background: #fef3c7;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: bold;
            margin-top: 4px;
        }
        .status-pill.paid { border-color: #10b981; background: #d1fae5; color: #065f46; }
        .note { margin-top: 20px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 9px; color: #64748b; }
    </style>
</head>
<body>
    @include('pdf.partials.company-header')

    <div class="title-row">
        <h1>Commercial Invoice</h1>
        <div class="no-box">
            <div class="lbl">No. Invoice</div>
            <strong>{{ $document_number }}</strong>
        </div>
    </div>

    <table class="grid-2">
        <tr>
            <td class="lbl">Tanggal</td>
            <td>{{ $issue_date }}</td>
            <td class="lbl">Kode Pesanan</td>
            <td><strong>{{ $order_code }}</strong></td>
        </tr>
        <tr>
            <td class="lbl">Kepada</td>
            <td><strong>{{ $buyer['name'] }}</strong></td>
            <td class="lbl">NPWP Pembeli</td>
            <td>{{ $buyer['npwp_display'] ?? '-' }}</td>
        </tr>
        <tr>
            <td class="lbl">Alamat Faktur</td>
            <td colspan="3">{{ $address }}</td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th style="width:28px">No</th>
                <th>Nama &amp; Rincian Produk</th>
                <th style="width:44px">Qty</th>
                <th style="width:100px">Harga Satuan</th>
                <th style="width:110px">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($items as $idx => $item)
                <tr>
                    <td>{{ $idx + 1 }}</td>
                    <td>{{ $item['product_name'] }}</td>
                    <td class="num">{{ $item['quantity'] }}</td>
                    <td class="num">Rp {{ number_format($item['unit_price'], 0, ',', '.') }}</td>
                    <td class="num">Rp {{ number_format($item['subtotal'], 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @if ($is_bill && $bill)
        <div class="box">
            <div class="box-title">Tagihan Termin</div>
            <strong>{{ $bill['label'] }} ({{ $bill['percent'] }}%)</strong> — nominal Rp {{ number_format((float) $bill['amount'], 0, ',', '.') }} termasuk PPN 11%.
        </div>
    @endif

    <table class="sum">
        <tr>
            <td class="lbl">Dasar Pengenaan Pajak (DPP)</td>
            <td class="val">Rp {{ number_format($tax['dpp'], 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="lbl">PPN 11%</td>
            <td class="val">Rp {{ number_format($tax['ppn'], 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="lbl">Total Produk Termasuk PPN</td>
            <td class="val">Rp {{ number_format($taxed_total, 0, ',', '.') }}</td>
        </tr>
        @unless ($is_bill)
            @if ($shipping > 0)
                <tr>
                    <td class="lbl">Ongkos Kirim (di luar PPN)</td>
                    <td class="val">Rp {{ number_format($shipping, 0, ',', '.') }}</td>
                </tr>
            @endif
        @endunless
        <tr>
            <td class="lbl grand">Grand Total</td>
            <td class="val grand">Rp {{ number_format($is_bill ? $taxed_total : $grand_total, 0, ',', '.') }}</td>
        </tr>
    </table>

    <div class="box">
        <div class="box-title">Status Pembayaran</div>
        <strong>{{ $payment_label }}</strong>
        @if ($payment_method === 'termin' && count($termin_bills) > 0)
            <table style="width:100%; margin-top:8px; border-collapse:collapse;">
                <tr style="background:#f1f5f9; font-size:9px; text-align:left;">
                    <th style="padding:4px 6px;">Tagihan</th>
                    <th style="padding:4px 6px;" class="num">%</th>
                    <th style="padding:4px 6px;" class="num">Nominal</th>
                    <th style="padding:4px 6px; width:80px;" class="num">Status</th>
                </tr>
                @foreach ($termin_bills as $tb)
                    <tr>
                        <td style="padding:4px 6px;">{{ $tb['label'] }}</td>
                        <td style="padding:4px 6px;" class="num">{{ $tb['percent'] }}%</td>
                        <td style="padding:4px 6px;" class="num">Rp {{ number_format((float) $tb['amount'], 0, ',', '.') }}</td>
                        <td style="padding:4px 6px;" class="num">
                            {{ in_array($tb['key'], $paid_bills, true) ? 'Lunas' : 'Belum Lunas' }}
                        </td>
                    </tr>
                @endforeach
            </table>
        @elseif ($payment_method === 'top')
            <div class="status-pill">Tempo / Net 30 — Pembayaran menyusul sesuai jatuh tempo</div>
        @else
            <div class="status-pill {{ $payment_status === 'paid' ? 'paid' : '' }}">
                {{ $payment_status === 'paid' ? 'LUNAS' : 'Belum Lunas' }}
            </div>
        @endif
    </div>

    @if (count($bank_accounts) > 0)
        <div class="box">
            <div class="box-title">Petunjuk Pembayaran — Rekening Tujuan</div>
            <table style="width:100%; border-collapse:collapse;">
                @foreach ($bank_accounts as $acc)
                    <tr>
                        <td style="padding:3px 0; width:140px;"><strong>{{ $acc['bank'] }}</strong></td>
                        <td style="padding:3px 0; font-family:'DejaVu Sans Mono', monospace;">{{ $acc['account'] }}</td>
                        <td style="padding:3px 0; text-align:right;">a.n. {{ $acc['name'] }}</td>
                    </tr>
                @endforeach
            </table>
        </div>
    @endif

    <div class="note">
        Dokumen ini diterbitkan otomatis oleh sistem Multikon. Simpan kode pesanan <strong>{{ $order_code }}</strong> untuk korespondensi. Pembayaran dinyatakan sah setelah dikonfirmasi oleh CV Multikon Erindotama.
    </div>
</body>
</html>