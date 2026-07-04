<?php

namespace App\Http\Requests\Admin;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_featured' => $this->boolean('is_featured'),
        ]);
    }

    public function rules(): array
    {
        $product = $this->route('product');

        $productId = $product instanceof Product
            ? $product->getKey()
            : $product;

        return [
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id'),
            ],
            'name' => [
                'required',
                'string',
                'max:180',
            ],
            'slug' => [
                'required',
                'string',
                'max:180',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('products', 'slug')->ignore($productId),
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'price_mad' => [
                'required',
                'decimal:0,2',
                'min:0.01',
            ],
            'old_price_mad' => [
                'nullable',
                'decimal:0,2',
                'gt:price_mad',
            ],
            'stock_quantity' => [
                'required',
                'integer',
                'min:0',
            ],
            'is_active' => [
                'required',
                'boolean',
            ],
            'is_featured' => [
                'required',
                'boolean',
            ],
        ];
    }
}