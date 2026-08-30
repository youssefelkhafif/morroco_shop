<?php

namespace App\Services\Orders;

use App\Models\Order;

class WhatsAppNotificationService
{
    public function confirmationUrl(Order $order): string
    {
        $whatsAppNumber = $this->configuredWhatsAppNumber();

        if (! $whatsAppNumber) {
            throw new \RuntimeException('WhatsApp confirmation is not configured.');
        }

        $items = $order->items
            ->map(
                fn ($item) => "- {$item->product_name} × {$item->quantity} — MAD {$item->line_total_mad}",
            )
            ->implode("\n");

        $message = implode("\n", [
            'Hello Morocco Shop,',
            '',
            "I want to confirm order {$order->order_number}.",
            '',
            "Customer: {$order->customer_name}",
            "Phone: {$order->customer_phone}",
            "Delivery: {$order->delivery_city} · {$order->delivery_district} · {$order->delivery_zone_name}",
            "Address: {$order->delivery_address}",
            '',
            'Products:',
            $items,
            '',
            "Cash on Delivery total: MAD {$order->cod_amount_mad}",
        ]);

        return 'https://wa.me/' . $whatsAppNumber . '?text=' . rawurlencode($message);
    }

    public function configuredWhatsAppNumber(): ?string
    {
        $number = preg_replace(
            '/\D+/',
            '',
            (string) config('shop.whatsapp.number'),
        );

        return $number === '' ? null : $number;
    }
}
