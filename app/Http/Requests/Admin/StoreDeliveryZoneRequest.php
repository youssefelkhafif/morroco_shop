<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDeliveryZoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'city' => trim((string) $this->input('city')),
            'district' => trim((string) $this->input('district')),
            'zone_name' => trim((string) $this->input('zone_name')),
            'is_active' => $this->boolean('is_active'),
        ]);
    }

    public function rules(): array
    {
        return [
            'city' => [
                'required',
                'string',
                'max:120',
            ],
            'district' => [
                'required',
                'string',
                'max:120',
            ],
            'zone_name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('delivery_zones', 'zone_name')
                    ->where(fn ($query) => $query
                        ->where('city', $this->input('city'))
                        ->where('district', $this->input('district'))),
            ],
            'delivery_fee_mad' => [
                'required',
                'decimal:0,2',
                'min:0',
            ],
            'estimated_delivery_days' => [
                'nullable',
                'integer',
                'between:1,255',
            ],
            'is_active' => [
                'required',
                'boolean',
            ],
        ];
    }
}