<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@multikon.test'],
            [
                'name' => 'Admin Multikon',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'admin123')),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
