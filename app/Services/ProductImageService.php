<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ProductImageService
{
    public const DISK = 'public';

    public const MAX_IMAGES_PER_PRODUCT = 8;

    public const MAX_IMAGE_SIZE_KB = 5120;

    /**
     * @param array<int, UploadedFile> $uploadedImages
     * @return Collection<int, ProductImage>
     */
    public function store(Product $product, array $uploadedImages): Collection
    {
        $storedPaths = [];

        try {
            return DB::transaction(function () use (
                $product,
                $uploadedImages,
                &$storedPaths,
            ): Collection {
                $lastSortOrder = $product->images()->max('sort_order');

                $nextSortOrder = $lastSortOrder === null
                    ? 0
                    : ((int) $lastSortOrder + 1);

                $images = collect();

                foreach ($uploadedImages as $uploadedImage) {
                    $path = $uploadedImage->store(
                        "products/{$product->id}",
                        self::DISK,
                    );

                    $storedPaths[] = $path;

                    $images->push(
                        $product->images()->create([
                            'path' => $path,
                            'sort_order' => $nextSortOrder++,
                        ]),
                    );
                }

                return $images;
            });
        } catch (Throwable $exception) {
            Storage::disk(self::DISK)->delete($storedPaths);

            throw $exception;
        }
    }

    public function delete(ProductImage $image): void
    {
        $path = $image->path;

        $image->delete();

        Storage::disk(self::DISK)->delete($path);
    }

    public function deleteAllForProduct(Product $product): void
    {
        $product->loadMissing('images');

        foreach ($product->images as $image) {
            $this->delete($image);
        }

        Storage::disk(self::DISK)->deleteDirectory(
            "products/{$product->id}",
        );
    }
}