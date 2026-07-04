<?php

namespace App\Http\Requests\Admin;

use App\Models\Product;
use App\Services\ProductImageService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreProductImagesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'images' => [
                'required',
                'array',
                'min:1',
                'max:'.ProductImageService::MAX_IMAGES_PER_PRODUCT,
            ],
            'images.*' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:'.ProductImageService::MAX_IMAGE_SIZE_KB,
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $product = $this->route('product');

            if (! $product instanceof Product) {
                return;
            }

            $incomingImages = $this->file('images', []);

            $totalImages = $product->images()->count() + count($incomingImages);

            if ($totalImages > ProductImageService::MAX_IMAGES_PER_PRODUCT) {
                $validator->errors()->add(
                    'images',
                    'A product can have a maximum of '
                        .ProductImageService::MAX_IMAGES_PER_PRODUCT
                        .' images.',
                );
            }
        });
    }
}