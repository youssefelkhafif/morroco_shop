<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Shop\CartService;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(CartService $cartService): Response
    {
        $products = Product::where('is_active', true)
            ->with(['category', 'images', 'colors'])
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('shop/products/index', [
            'products' => $products->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category_name' => $product->category?->name,
                'price_mad' => $product->price_mad,
                'old_price_mad' => $product->old_price_mad,
                'stock_quantity' => $product->stock_quantity,
                'is_featured' => $product->is_featured,
                'image_url' => $product->images->first()?->url,
            ])->all(),
            'paginated' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
            ],
            'cart_item_count' => $cartService->summary()['item_count'],
        ]);
    }

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
                    'url' => $image->url,
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
