<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Shop\CartService;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(CartService $cartService): Response
    {
        $products = Product::query()
            ->with([
                'category',
                'images',
            ])
            ->where('is_active', true)
            ->orderByDesc('is_featured')
            ->latest()
            ->paginate(12)
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price_mad' => $product->price_mad,
                'old_price_mad' => $product->old_price_mad,
                'stock_quantity' => $product->stock_quantity,
                'is_featured' => $product->is_featured,
                'category_name' => $product->category?->name,
                'image_url' => $product->images->first()
                    ? Storage::disk('public')->url(
                        $product->images->first()->path,
                    )
                    : null,
            ]);

        return Inertia::render('shop/home', [
            'products' => $products,
            'cart_item_count' => $cartService->summary()['item_count'],
        ]);
    }
}