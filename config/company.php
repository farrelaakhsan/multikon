<?php

/*
|--------------------------------------------------------------------------
| Profil Perusahaan (Kop Surat & Dokumen PDF)
|--------------------------------------------------------------------------
| Data statis CV Multikon Erindotama yang dipakai untuk kop surat pada
| Commercial Invoice, Surat Jalan, dan Faktur Pajak.
|
| TODO: Lengkapi NPWP resmi dan email perusahaan. Isi placeholder saat ini
| hanya contoh — ganti sebelum dokumen dipakai untuk faktur resmi.
*/

return [
    'name'      => 'CV Multikon Erindotama',
    'address'   => 'Jl. Jatinegara Kaum No.17A, RT.6/RW.3, Jatinegara Kaum, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13250',
    'city'      => 'Jakarta Timur',
    'phone'     => '0813-9909-6871',
    'phone2'    => '0858-8573-9462',
    'email'     => 'cs@multikon.test',
    'npwp'      => '00.000.000.0-000.000',
    'logo'      => null, // Path logo relatif ke public/ (contoh: 'images/logo-multikon.png'). null = text-only.
    'director'  => 'Direktur',
];