<?php

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Services\ProductImageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function productImageAdmin(): User
{
    return User::factory()->create([
        'is_admin' => true,
    ]);
}

test('a normal user cannot upload product images', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.products.images.store', $product), [
            'images' => [
                UploadedFile::fake()->image('headphones.jpg'),
            ],
        ])
        ->assertForbidden();
});

test('an admin can upload product images and they keep sort order', function () {
    Storage::fake(ProductImageService::DISK);

    $admin = productImageAdmin();
    $product = Product::factory()->create();

    $existingImage = ProductImage::factory()
        ->for($product)
        ->create([
            'path' => "{$product->id}/existing.jpg",
            'sort_order' => 0,
        ]);

    Storage::disk(ProductImageService::DISK)->put(
        $existingImage->path,
        'existing image',
    );

    $this->actingAs($admin)
        ->post(route('admin.products.images.store', $product), [
            'images' => [
                UploadedFile::fake()->image('front.jpg', 800, 800)->size(300),
                UploadedFile::fake()->image('side.webp', 800, 800)->size(300),
            ],
        ])
        ->assertRedirect(route('admin.products.edit', $product));

    $images = $product->fresh()->images;

    expect($images->count())->toBe(3);
    expect($images->pluck('sort_order')->all())->toBe([0, 1, 2]);

    foreach ($images as $image) {
        expect($image->path)->toStartWith("{$product->id}/");
        Storage::disk(ProductImageService::DISK)->assertExists($image->path);
    }
});

test('product images must be supported image formats', function () {
    $admin = productImageAdmin();
    $product = Product::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.products.images.store', $product), [
            'images' => [
                UploadedFile::fake()->create(
                    'document.pdf',
                    100,
                    'application/pdf',
                ),
            ],
        ])
        ->assertSessionHasErrors('images.0');
});

test('product images cannot exceed five megabytes', function () {
    $admin = productImageAdmin();
    $product = Product::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.products.images.store', $product), [
            'images' => [
                UploadedFile::fake()
                    ->image('large.jpg')
                    ->size(ProductImageService::MAX_IMAGE_SIZE_KB + 1),
            ],
        ])
        ->assertSessionHasErrors('images.0');
});

test('a product cannot have more than eight images', function () {
    $admin = productImageAdmin();
    $product = Product::factory()->create();

    foreach (range(0, 6) as $sortOrder) {
        ProductImage::factory()
            ->for($product)
            ->create([
                'sort_order' => $sortOrder,
            ]);
    }

    $this->actingAs($admin)
        ->post(route('admin.products.images.store', $product), [
            'images' => [
                UploadedFile::fake()->image('first.jpg'),
                UploadedFile::fake()->image('second.jpg'),
            ],
        ])
        ->assertSessionHasErrors('images');
});

test('an admin can delete one product image and its physical file', function () {
    Storage::fake(ProductImageService::DISK);

    $admin = productImageAdmin();
    $product = Product::factory()->create();

    $image = ProductImage::factory()
        ->for($product)
        ->create([
            'path' => "{$product->id}/remove-me.jpg",
        ]);

    Storage::disk(ProductImageService::DISK)->put(
        $image->path,
        'image content',
    );

    $this->actingAs($admin)
        ->delete(route('admin.products.images.destroy', [
            'product' => $product,
            'image' => $image,
        ]))
        ->assertRedirect(route('admin.products.edit', $product));

    $this->assertDatabaseMissing('product_images', [
        'id' => $image->id,
    ]);

    Storage::disk(ProductImageService::DISK)
        ->assertMissing($image->path);
});

test('an admin cannot delete an image belonging to another product', function () {
    $admin = productImageAdmin();
    $firstProduct = Product::factory()->create();
    $secondProduct = Product::factory()->create();

    $image = ProductImage::factory()
        ->for($secondProduct)
        ->create();

    $this->actingAs($admin)
        ->delete(route('admin.products.images.destroy', [
            'product' => $firstProduct,
            'image' => $image,
        ]))
        ->assertNotFound();
});

test('deleting a product removes its image records and physical files', function () {
    Storage::fake(ProductImageService::DISK);

    $admin = productImageAdmin();
    $product = Product::factory()->create();

    $image = ProductImage::factory()
        ->for($product)
        ->create([
            'path' => "{$product->id}/delete-with-product.jpg",
        ]);

    Storage::disk(ProductImageService::DISK)->put(
        $image->path,
        'image content',
    );

    $this->actingAs($admin)
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);

    $this->assertDatabaseMissing('product_images', [
        'id' => $image->id,
    ]);

    Storage::disk(ProductImageService::DISK)
        ->assertMissing($image->path);
});