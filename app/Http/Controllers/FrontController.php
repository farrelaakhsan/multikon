<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FrontController extends Controller
{
    public function index(): Response
    {
        $featuredProducts = Product::query()
            ->latest('id')
            ->take(3)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
        ]);
    }

    public function catalog(Request $request): Response
    {
        $type = $request->string('type')->toString();
        $sort = $request->string('sort')->toString();

        $query = Product::query();

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($sort === 'latest') {
            $query->latest('id');
        } else {
            $query->orderBy('category')->orderBy('name');
        }

        if ($type === 'ready') {
            $query->where('is_customizable', false);
        } elseif ($type === 'custom') {
            $query->where('is_customizable', true);
        }

        $products = $query
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($p) => $this->formatProduct($p));

        return Inertia::render('Catalog', [
            'products'     => $products,
            'activeFilter' => $type ?: 'all',
            'activeSort'   => $sort ?: 'default',
            'search'       => $request->search,
        ]);
    }

    public function show(Product $product): Response
    {
        $relatedProducts = Product::query()
            ->where('id', '!=', $product->id)
            ->when(
                $product->category,
                fn ($q) => $q->where('category', $product->category)
            )
            ->take(4)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        return Inertia::render('Product/Show', [
            'product'         => $this->formatProduct($product),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About');
    }

    public function caraBelanja(): Response
    {
        return Inertia::render('CaraBelanja');
    }

    public function faq(): Response
    {
        return Inertia::render('Faq');
    }

    public function kebijakanPrivasi(): Response
    {
        return Inertia::render('KebijakanPrivasi');
    }

    public function syaratKetentuan(): Response
    {
        return Inertia::render('SyaratKetentuan');
    }

    public function tentangAplikasi(): Response
    {
        return Inertia::render('TentangAplikasi');
    }

    /**
     * Format data produk untuk dikirim ke frontend.
     * Selalu gunakan image_url (bukan image mentah).
     */
    private function formatProduct(Product $p): array
    {
        return [
            'id'                => $p->id,
            'name'              => $p->name,
            'category'          => $p->category,
            'description'       => $p->description,
            'image'             => $p->image,
            'image_url'        => $p->image_url,
            'price'             => $p->price,
            'specifications'   => $p->specifications,
            'is_customizable'  => $p->is_customizable,
            'stock'             => $p->stock,
            'warranty'          => $p->warranty,
            'usage_instructions'=> $p->usage_instructions,
        ];
    }
}