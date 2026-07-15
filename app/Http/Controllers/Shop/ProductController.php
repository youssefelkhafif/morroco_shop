<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Shop\CartService;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product, CartService $cartService): Response
    {
        $product->load(['category', 'images']);

        return Inertia::render('shop/products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price_mad' => $product->price_mad,
                'old_price_mad' => $product->old_price_mad,
                'stock_quantity' => $product->stock_quantity,
                'is_featured' => $product->is_featured,
                'category_name' => $product->category?->name,
                'images' => $product->images->map(fn ($image) => [
                    'id' => $image->id,
                    'url' => Storage::disk('public')->url($image->path),
                ])->values(),
                'colors' => $product->colors->map(fn ($color) => [
                    'id' => $color->id,
                    'name' => $color->name,
                    'hex_code' => $color->hex_code,
                ])->values(),
            ],
            'cart_item_count' => $cartService->summary()['item_count'],
        ]);
    }
}
