<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderConfirmedNotification extends Notification
{
    use Queueable;

    public function __construct(protected Order $order)
    {
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'message' => "Your order {$this->order->order_number} has been confirmed.",
            'whatsapp_url' => $this->whatsappUrl(),
        ];
    }

    protected function whatsappUrl(): ?string
    {
        $whatsAppNumber = preg_replace('/\D+/', '', (string) config('shop.whatsapp.number'));

        if ($whatsAppNumber === '') {
            return null;
        }

        $message = implode("\n", [
            'Hello Morocco Shop,',
            '',
            "I have received confirmation for my order {$this->order->order_number}.",
            "Customer: {$this->order->customer_name}",
            "Phone: {$this->order->customer_phone}",
            '',
            'Please send any shipment updates here.',
        ]);

        return 'https://wa.me/' . $whatsAppNumber . '?text=' . rawurlencode($message);
    }
}
