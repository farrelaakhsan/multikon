<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/products.json');
        if (!is_file($path)) {
            return;
        }

        $items = json_decode((string) file_get_contents($path), true);
        if (!is_array($items)) {
            return;
        }

        foreach ($items as $item) {
            $name = trim((string) ($item['name'] ?? ''));
            if ($name === '') {
                continue;
            }

            $baseSlug = Str::slug($name);
            $slug = $baseSlug;
            $suffix = 2;
            while (isset($item['_slug_used'][$slug]) || Product::where('slug', $slug)->where('name', '!=', $name)->exists()) {
                $slug = $baseSlug . '-' . $suffix++;
            }

            $data = [
                'name' => $name,
                'slug' => $slug,
                'category' => $item['category'] ?? 'General',
                'description' => $item['description'] ?? '',
                'image' => $item['image'] ?? null,
                'price' => $item['price'] ?? 0,
                'specifications' => $item['specifications'] ?? null,
                'is_customizable' => (bool) ($item['is_customizable'] ?? false),
                'stock' => (int) ($item['stock'] ?? 0),
                'weight' => $item['weight'] ?? null,
                'warranty' => $item['warranty'] ?? null,
                'usage_instructions' => $item['usage_instructions'] ?? null,
            ];

            if (empty($data['image'])) {
                $data['image'] = null;
            }

            $existing = Product::where('slug', $slug)->first();
            if ($existing && $existing->image && empty($item['image'])) {
                unset($data['image']);
            }

            Product::updateOrCreate(['slug' => $slug], $data);
        }
    }
}
