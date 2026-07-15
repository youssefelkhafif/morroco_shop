<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'product_slug',
        'product_color_id',
        'product_color_name',
        'unit_price_mad',
        'quantity',
        'line_total_mad',
    ];

    protected function casts(): array
    {
        return [
            'unit_price_mad' => 'decimal:2',
            'quantity' => 'integer',
            'line_total_mad' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}