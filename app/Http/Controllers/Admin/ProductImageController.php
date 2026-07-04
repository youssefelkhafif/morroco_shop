<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductImagesRequest;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductImageService;
use Illuminate\Http\RedirectResponse;

class ProductImageController extends Controller
{
    public function store(
        StoreProductImagesRequest $request,
        Product $product,
        ProductImageService $productImages,
    ): RedirectResponse {
        $uploadedImages = $request->file('images', []);

        $productImages->store($product, $uploadedImages);

        return to_route('admin.products.edit', $product)
            ->with('success', 'Product images uploaded successfully.');
    }

    public function destroy(
        Product $product,
        ProductImage $image,
        ProductImageService $productImages,
    ): RedirectResponse {
        abort_unless($image->product_id === $product->id, 404);

        $productImages->delete($image);

        return to_route('admin.products.edit', $product)
            ->with('success', 'Product image deleted successfully.');
    }
}