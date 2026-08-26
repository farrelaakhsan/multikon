<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class AddressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()->latest()->get();

        return response()->json(['addresses' => $addresses]);
    }

    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'label'            => ['nullable', 'string', 'max:100'],
            'receiver_phone'   => ['nullable', 'string', 'max:20'],
            'address'          => ['required', 'string', 'max:1000'],
            'district_id'      => ['nullable', 'max:50'],
            'district_name'    => ['nullable', 'string', 'max:255'],
            'subdistrict_id'   => ['nullable', 'max:50'],
            'subdistrict_name' => ['nullable', 'string', 'max:255'],
            'city_id'          => ['nullable', 'max:50'],
            'city_name'        => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $hasAddresses = $user->addresses()->exists();

        $address = $user->addresses()->create([
            'label'            => $validated['label'] ?? 'Lainnya',
            'receiver_phone'   => $validated['receiver_phone'] ?? null,
            'address'          => $validated['address'],
            'district_id'      => $validated['district_id'] ?? null,
            'district_name'    => $validated['district_name'] ?? null,
            'subdistrict_id'   => $validated['subdistrict_id'] ?? null,
            'subdistrict_name' => $validated['subdistrict_name'] ?? null,
            'city_id'          => $validated['city_id'] ?? null,
            'city_name'        => $validated['city_name'] ?? null,
            'is_default'       => !$hasAddresses,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['address' => $address]);
        }

        return redirect()->back()->with('success', 'Alamat berhasil ditambahkan.');
    }

    public function update(Request $request, Address $address): RedirectResponse
    {
        $this->authorizeOwner($request, $address);

        $validated = $request->validate([
            'label'            => ['nullable', 'string', 'max:100'],
            'receiver_phone'   => ['nullable', 'string', 'max:20'],
            'address'          => ['required', 'string', 'max:1000'],
            'district_id'      => ['nullable', 'max:50'],
            'district_name'    => ['nullable', 'string', 'max:255'],
            'subdistrict_id'   => ['nullable', 'max:50'],
            'subdistrict_name' => ['nullable', 'string', 'max:255'],
            'city_id'          => ['nullable', 'max:50'],
            'city_name'        => ['nullable', 'string', 'max:255'],
        ]);

        $address->update($validated);

        return redirect()->back()->with('success', 'Alamat berhasil diperbarui.');
    }

    public function destroy(Request $request, Address $address): RedirectResponse
    {
        $this->authorizeOwner($request, $address);

        $address->delete();

        return redirect()->back()->with('success', 'Alamat berhasil dihapus.');
    }

    public function setDefault(Request $request, Address $address): RedirectResponse
    {
        $this->authorizeOwner($request, $address);

        $request->user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return redirect()->back()->with('success', 'Alamat utama berhasil diubah.');
    }

    private function authorizeOwner(Request $request, Address $address): void
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
