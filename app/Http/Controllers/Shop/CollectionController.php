<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Services\Shop\CartService;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    public function index(CartService $cartService): Response
    {
        $collections = Collection::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('shop/collections/index', [
            'collections' => $collections->map(fn (Collection $collection) => [
                'id' => $collection->id,
                'title' => $collection->title,
                'subtitle' => $collection->subtitle,
                'badge' => $collection->badge,
                'image_url' => $collection->image_url,
            ])->all(),
            'cart_item_count' => $cartService->summary()['item_count'],
        ]);
    }

    public function show(Collection $collection, CartService $cartService): Response
    {
        $collection->load(['products.images', 'products.category']);

        return Inertia::render('shop/collections/show', [
            'collection' => [
                'id' => $collection->id,
                'title' => $collection->title,
                'subtitle' => $collection->subtitle,
                'badge' => $collection->badge,
                'image_url' => $collection->image_url,
                'products' => $collection->products->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category_name' => $product->category?->name,
                    'price_mad' => $product->price_mad,
                    'old_price_mad' => $product->old_price_mad,
                    'stock_quantity' => $product->stock_quantity,
                    'is_featured' => $product->is_featured,
                    'image_url' => $product->images->first()
                        ? Storage::disk('public')->url($product->images->first()->path)
                        : null,
                ])->all(),
            ],
            'cart_item_count' => $cartService->summary()['item_count'],
        ]);
    }
}
