<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'user' => [
                'name'  => request()->user()->name,
                'email' => request()->user()->email,
            ],
        ]);
    }

    public function addresses(Request $request): Response
    {
        $addresses = $request->user()->addresses()->latest()->get();

        return Inertia::render('Settings/Addresses', [
            'addresses' => $addresses,
        ]);
    }

    public function profile(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Settings/Profile', [
            'user' => [
                'id'               => $user->id,
                'name'             => $user->name,
                'email'            => $user->email,
                'b2b_status'       => $user->b2b_status,
                'b2b_status_label' => $user->b2b_status_label,
                'created_at'       => $user->created_at->format('d M Y'),
            ],
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'password'         => ['required', 'string', 'confirmed', Password::min(8)],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password berhasil diperbarui.');
    }
}
