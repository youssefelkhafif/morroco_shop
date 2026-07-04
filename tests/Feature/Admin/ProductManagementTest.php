<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function adminUser(): User
{
    return User::factory()->create([
        'is_admin' => true,
    ]);
}

function validProductPayload(Category $category, array $overrides = []): array
{
    return array_merge([
        'category_id' => $category->id,
        'name' => 'Wireless Headphones',
        'slug' => 'wireless-headphones',
        'description' => 'Comfortable wireless headphones.',
        'price_mad' => '499.99',
        'old_price_mad' => '599.99',
        'stock_quantity' => 25,
        'is_active' => true,
        'is_featured' => false,
    ], $overrides);
}

test('a normal user cannot access admin product management', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.products.index'))
        ->assertForbidden();
});

test('an admin can create a product', function () {
    $admin = adminUser();
    $category = Category::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.products.store'), validProductPayload($category))
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseHas('products', [
        'category_id' => $category->id,
        'name' => 'Wireless Headphones',
        'slug' => 'wireless-headphones',
        'stock_quantity' => 25,
        'is_active' => 1,
        'is_featured' => 0,
    ]);
});

test('a product requires a valid price and non-negative stock', function () {
    $admin = adminUser();
    $category = Category::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.products.store'), validProductPayload($category, [
            'price_mad' => '0',
            'stock_quantity' => -1,
        ]))
        ->assertSessionHasErrors([
            'price_mad',
            'stock_quantity',
        ]);
});

test('a product old price must be greater than its current price', function () {
    $admin = adminUser();
    $category = Category::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.products.store'), validProductPayload($category, [
            'price_mad' => '500.00',
            'old_price_mad' => '499.99',
        ]))
        ->assertSessionHasErrors('old_price_mad');
});

test('a product slug must be unique', function () {
    $admin = adminUser();
    $category = Category::factory()->create();

    Product::factory()->create([
        'category_id' => $category->id,
        'slug' => 'wireless-headphones',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.products.store'), validProductPayload($category))
        ->assertSessionHasErrors('slug');
});

test('an admin can update a product', function () {
    $admin = adminUser();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Old Product Name',
        'slug' => 'old-product-name',
        'price_mad' => '100.00',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.products.update', $product), validProductPayload($category, [
            'name' => 'Updated Product Name',
            'slug' => 'updated-product-name',
            'price_mad' => '450.00',
            'old_price_mad' => null,
            'stock_quantity' => 12,
            'is_featured' => true,
        ]))
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Product Name',
        'slug' => 'updated-product-name',
        'stock_quantity' => 12,
        'is_featured' => 1,
    ]);
});

test('an admin can delete a product', function () {
    $admin = adminUser();
    $product = Product::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);
});