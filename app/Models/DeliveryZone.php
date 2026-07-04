<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'city',
        'district',
        'zone_name',
        'delivery_fee_mad',
        'estimated_delivery_days',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'delivery_fee_mad' => 'decimal:2',
            'estimated_delivery_days' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
