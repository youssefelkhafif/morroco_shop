<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductImageService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with('category:id,name')
            ->withCount('images')
            ->latest()
            ->paginate(15)
            ->through(fn(Product $product) => [
                'id' => $product->id,
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ],
                'name' => $product->name,
                'slug' => $product->slug,
                'price_mad' => $product->price_mad,
                'old_price_mad' => $product->old_price_mad,
                'stock_quantity' => $product->stock_quantity,
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'images_count' => $product->images_count,
            ]);

        return Inertia::render('admin/products/index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/create', [
            'categories' => $this->categoriesForForm(),
            'collections' => $this->collectionsForForm(),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = Product::create($request->validated());

        if (! empty($colors = $request->validated()['colors'] ?? [])) {
            $this->syncProductColors($product, $colors);
        }

        return to_route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['images', 'colors']);

        return Inertia::render('admin/products/edit', [
            'product' => [
                'id' => $product->id,
                'category_id' => $product->category_id,
                'name' => $product->name,
                'slug' => $product->slug,
                'collection_id' => $product->collection_id,
                'description' => $product->description,
                'price_mad' => $product->price_mad,
                'old_price_mad' => $product->old_price_mad,
                'stock_quantity' => $product->stock_quantity,
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'images' => $product->images
                    ->map(fn(ProductImage $image) => [
                        'id' => $image->id,
                        'url' => $image->url,
                        'sort_order' => $image->sort_order,
                    ])
                    ->values()
                    ->all(),
                'colors' => $product->colors
                    ->map(fn ($color) => [
                        'id' => $color->id,
                        'name' => $color->name,
                        'hex_code' => $color->hex_code,
                        'sort_order' => $color->sort_order,
                    ])
                    ->values()
                    ->all(),
            ],
            'categories' => $this->categoriesForForm(),
            'collections' => $this->collectionsForForm(),
        ]);
    }

    public function update(
        UpdateProductRequest $request,
        Product $product,
    ): RedirectResponse {
        $product->update($request->validated());

        $this->syncProductColors($product, $request->validated()['colors'] ?? []);

        return to_route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    private function syncProductColors(Product $product, array $colors): void
    {
        $submittedIds = collect($colors)
            ->pluck('id')
            ->filter()
            ->all();

        $product->colors()
            ->whereNotIn('id', $submittedIds)
            ->delete();

        foreach ($colors as $index => $color) {
            $data = [
                'name' => $color['name'],
                'hex_code' => $color['hex_code'],
                'sort_order' => $color['sort_order'] ?? $index,
            ];

            if (! empty($color['id'])) {
                $product->colors()->where('id', $color['id'])->update($data);
                continue;
            }

            $product->colors()->create($data);
        }
    }

    public function destroy(
        Product $product,
        ProductImageService $productImages,
    ): RedirectResponse {
        $productImages->deleteAllForProduct($product);

        $product->delete();

        return to_route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    private function categoriesForForm(): array
    {
        return Category::query()
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get(['id', 'name', 'is_active'])
            ->map(fn(Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'is_active' => $category->is_active,
            ])
            ->all();
    }

    private function collectionsForForm(): array
    {
        return Collection::query()
            ->orderByDesc('is_active')
            ->orderBy('title')
            ->get(['id', 'title', 'is_active'])
            ->map(fn(Collection $collection) => [
                'id' => $collection->id,
                'title' => $collection->title,
                'is_active' => $collection->is_active,
            ])
            ->all();
    }
}
