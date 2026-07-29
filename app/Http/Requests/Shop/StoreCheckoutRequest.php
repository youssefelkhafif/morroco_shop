<?php

namespace App\Http\Requests\Shop;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'customer_email' => ['nullable', 'email', 'max:190'],
            'delivery_zone_id' => ['required', 'integer', 'exists:delivery_zones,id'],
            'delivery_address' => ['required', 'string', 'max:1000'],
            'customer_note' => ['nullable', 'string', 'max:2000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'customer_name' => trim((string) $this->input('customer_name')),
            'customer_phone' => trim((string) $this->input('customer_phone')),
            'customer_email' => $this->nullableTrimmed('customer_email'),
            'delivery_address' => trim((string) $this->input('delivery_address')),
            'customer_note' => $this->nullableTrimmed('customer_note'),
        ]);
    }

    private function nullableTrimmed(string $key): ?string
    {
        $value = trim((string) $this->input($key));

        return $value === '' ? null : $value;
    }
}