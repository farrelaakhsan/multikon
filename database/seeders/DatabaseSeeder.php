<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Baris ini yang akan memanggil ProductSeeder kamu
        $this->call([
            ProductSeeder::class,
        ]);
    }
}