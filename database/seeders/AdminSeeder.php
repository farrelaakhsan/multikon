<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $plain = env('ADMIN_PASSWORD') ?: config('services.admin.password') ?: 'MultikonAdmin2026!';

        User::updateOrCreate(
            ['email' => 'admin@multikon.test'],
            [
                'name' => 'Admin Multikon',
                'password' => $plain,
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
