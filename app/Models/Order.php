<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const PAYMENT_METHOD_CASH_ON_DELIVERY = 'cash_on_delivery';

    public const STATUS_PENDING_WHATSAPP_CONFIRMATION = 'pending_whatsapp_confirmation';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_PREPARING = 'preparing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_NO_ANSWER = 'no_answer';
    public const STATUS_REFUSED_AT_DELIVERY = 'refused_at_delivery';
    public const STATUS_RETURNED = 'returned';

    protected $fillable = [
        'order_number',
        'customer_id',
        'delivery_zone_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'delivery_city',
        'delivery_district',
        'delivery_zone_name',
        'delivery_address',
        'customer_note',
        'payment_method',
        'status',
        'subtotal_mad',
        'delivery_fee_mad',
        'total_mad',
        'cod_amount_mad',
        'stock_deducted_at',
        'carrier_name',
        'tracking_number',
        'confirmed_at',
        'confirmed_by',
        'preparing_at',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
        'cancelled_by',
        'no_answer_at',
        'refused_at_delivery_at',
        'returned_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal_mad' => 'decimal:2',
            'delivery_fee_mad' => 'decimal:2',
            'total_mad' => 'decimal:2',
            'cod_amount_mad' => 'decimal:2',
            'stock_deducted_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'preparing_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'no_answer_at' => 'datetime',
            'refused_at_delivery_at' => 'datetime',
            'returned_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function deliveryZone(): BelongsTo
    {
        return $this->belongsTo(DeliveryZone::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function confirmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    public function canceller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function hasStockBeenDeducted(): bool
    {
        return $this->stock_deducted_at !== null;
    }

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING_WHATSAPP_CONFIRMATION,
            self::STATUS_CONFIRMED,
            self::STATUS_PREPARING,
            self::STATUS_SHIPPED,
            self::STATUS_DELIVERED,
            self::STATUS_CANCELLED,
            self::STATUS_NO_ANSWER,
            self::STATUS_REFUSED_AT_DELIVERY,
            self::STATUS_RETURNED,
        ];
    }
}
