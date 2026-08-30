<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Theme;
use App\Models\Collection;
use App\Services\Shop\CartService;
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
                'image_url' => $product->images->first()?->url,
            ]);

        $themes = Theme::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $collections = Collection::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('shop/home', [
            'products' => $products,
            'themes' => $themes,
            'collections' => $collections,
            'cart_item_count' => $cartService->summary()['item_count'],
            'hero_badge' => 'CASH ON DELIVERY · MOROCCO',
            'hero_title' => 'Streetwear caps, refined for everyday wear.',
            'hero_subtitle' => 'Minimal silhouettes, premium finishing, and a sharp fit from first impression to final delivery.',
        ]);
    }
}