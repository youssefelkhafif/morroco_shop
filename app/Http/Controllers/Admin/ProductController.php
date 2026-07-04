<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\ProductImageService;

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
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::create($request->validated());

        return to_route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('admin/products/edit', [
            'product' => [
                'id' => $product->id,
                'category_id' => $product->category_id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price_mad' => $product->price_mad,
                'old_price_mad' => $product->old_price_mad,
                'stock_quantity' => $product->stock_quantity,
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
            ],
            'categories' => $this->categoriesForForm(),
        ]);
    }

    public function update(
        UpdateProductRequest $request,
        Product $product,
    ): RedirectResponse {
        $product->update($request->validated());

        return to_route('admin.products.index')
            ->with('success', 'Product updated successfully.');
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
}
