<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::latest()
            ->paginate(20)
            ->through(fn ($p) => [
                'id'       => $p->id,
                'name'     => $p->name,
                'category' => $p->category,
                'price'    => $p->price,
                'image_url' => $p->image_url,
                'is_customizable' => $p->is_customizable,
                'stock'    => $p->stock,
            ]);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'               => ['required', 'string', 'max:255'],
            'category'           => ['required', 'string', 'max:255'],
            'description'        => ['required', 'string'],
            'price'              => ['required', 'numeric', 'min:0'],
            'specifications'     => ['nullable', 'string'],
            'is_customizable'    => ['boolean'],
            'stock'              => ['nullable', 'integer', 'min:0'],
            'weight'             => ['nullable', 'numeric', 'min:0'],
            'warranty'           => ['nullable', 'string'],
            'usage_instructions' => ['nullable', 'string'],
            'image'              => ['nullable', 'string', 'max:500'],
            'image_file'         => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        // Upload file kalau ada — prioritas di atas URL
        if ($request->hasFile('image_file')) {
            $data['image'] = $request->file('image_file')->store('products', 'public');
        }

        unset($data['image_file']);

        Product::create($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => [
                'id'             => $product->id,
                'name'           => $product->name,
                'category'       => $product->category,
                'description'    => $product->description,
                'price'          => $product->price,
                'specifications' => $product->specifications,
                'is_customizable'=> $product->is_customizable,
                'stock'          => $product->stock,
                'weight'         => $product->weight,
                'warranty'       => $product->warranty,
                'usage_instructions' => $product->usage_instructions,
                'image'          => $product->image_url,
                'image_raw'      => $product->image,
            ],
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'name'               => ['required', 'string', 'max:255'],
            'category'           => ['required', 'string', 'max:255'],
            'description'        => ['required', 'string'],
            'price'              => ['required', 'numeric', 'min:0'],
            'specifications'     => ['nullable', 'string'],
            'is_customizable'    => ['boolean'],
            'stock'              => ['nullable', 'integer', 'min:0'],
            'weight'             => ['nullable', 'numeric', 'min:0'],
            'warranty'           => ['nullable', 'string'],
            'usage_instructions' => ['nullable', 'string'],
            'image'              => ['nullable', 'string', 'max:500'],
            'image_file'         => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('image_file')) {
            if ($product->image && ! str_starts_with($product->image, 'http')) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image_file')->store('products', 'public');
        } else {
            unset($data['image']);
        }

        unset($data['image_file']);

        $product->update($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image && ! str_starts_with($product->image, 'http')) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}