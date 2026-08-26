<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::updateOrCreate(
            ['name' => 'Commercial Spiral Dough Mixer 20L / 8 Kg - Heavy Duty'],
            [
            'category' => 'Mixer',
            'description' => "Commercial Spiral Mixer ini dirancang khusus untuk memenuhi kebutuhan adonan bertekstur kental dan berat dengan kapasitas besar pada dapur profesional. Tidak seperti mixer biasa, pengaduk (hook) dan mangkuk (bowl) pada mesin ini berputar secara bersamaan untuk menghasilkan adonan yang kalis sempurna, lembut, dan merata dalam waktu singkat.\n\nBisa digunakan untuk apa saja (Fungsi):\n\n* Mengaduk adonan roti berat seperti Roti Tawar, Baguette, dan Bun.\n* Membuat adonan Pizza berkualitas tinggi dengan tingkat kalis maksimal.\n* Mengolah adonan Donat dan Bakpao dalam jumlah massal.\n* Mencampur adonan Mie komersial yang membutuhkan tekstur padat.\n\nSangat Ideal Untuk:\nBakery, Restoran, Kafe, Hotel, Catering, dan UMKM Kuliner skala menengah hingga besar.",
            'image' => null,
            'price' => 9500000,
            'material' => 'Stainless Steel SUS 304',
            'dimensions_std' => '680 mm x 360 mm x 750 mm',
            'is_customizable' => false,
            'stock' => 9,
            'warranty' => '1 Tahun Servis + 6 Bulan Sparepart',
            'usage_instructions' => "1. Persiapan: Pastikan mesin diletakkan di permukaan yang rata dan kokoh. Hubungkan kabel daya ke stopkontak.\n2. Pemuatan Bahan: Masukkan bahan kering (tepung, ragi) dan cairan ke dalam mangkuk stainless sesuai kapasitas maksimal.\n3. Penguncian: Turunkan kap pelindung jaring besi (safety guard) di atas mangkuk demi keamanan operasional.\n4. Pengoperasian: Tekan tombol ON, lalu pilih kecepatan putaran (tersedia kecepatan rendah untuk pencampuran awal dan kecepatan tinggi untuk mengaliskan adonan).\n5. Selesai: Setelah adonan kalis, matikan mesin (tombol OFF / Stop), angkat kap pelindung, dan keluarkan adonan dari mangkuk.\n6. Pembersihan: Lap mangkuk dan kait pengaduk menggunakan kain lembap bersih setelah selesai digunakan.",
        ]);
    }
}