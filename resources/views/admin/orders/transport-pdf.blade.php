<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <style>
        @page {
            margin: 28px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            color: #111827;
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            line-height: 1.45;
        }

        h1,
        h2,
        h3,
        p {
            margin: 0;
        }

        .header {
            border-bottom: 2px solid #111827;
            padding-bottom: 16px;
        }

        .brand {
            color: #111827;
            font-size: 20px;
            font-weight: bold;
        }

        .document-title {
            margin-top: 5px;
            color: #4b5563;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .order-number {
            margin-top: 16px;
            font-size: 16px;
            font-weight: bold;
        }

        .badge {
            float: right;
            margin-top: -22px;
            border: 1px solid #111827;
            padding: 5px 9px;
            font-size: 10px;
            font-weight: bold;
        }

        .section {
            margin-top: 22px;
        }

        .section-title {
            margin-bottom: 9px;
            color: #374151;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        .info-table,
        .items-table,
        .totals-table {
            border-collapse: collapse;
            width: 100%;
        }

        .info-table td {
            border: 1px solid #d1d5db;
            padding: 8px;
            vertical-align: top;
        }

        .info-label {
            color: #6b7280;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .items-table th {
            border-bottom: 1px solid #111827;
            padding: 8px 6px;
            text-align: left;
        }

        .items-table td {
            border-bottom: 1px solid #d1d5db;
            padding: 9px 6px;
            vertical-align: top;
        }

        .text-right {
            text-align: right;
        }

        .totals-wrapper {
            margin-left: auto;
            margin-top: 18px;
            width: 48%;
        }

        .totals-table td {
            border-bottom: 1px solid #d1d5db;
            padding: 7px 0;
        }

        .cod-row td {
            border-bottom: 2px solid #111827;
            font-size: 13px;
            font-weight: bold;
        }

        .note {
            margin-top: 22px;
            border: 1px solid #d1d5db;
            padding: 10px;
        }

        .footer {
            bottom: 0;
            color: #6b7280;
            font-size: 9px;
            left: 0;
            position: fixed;
            right: 0;
            text-align: center;
        }
    </style>
</head>

<body>
    <header class="header">
        <p class="brand">Morocco Shop</p>
        <p class="document-title">Transport order sheet</p>

        <p class="order-number">
            Order: {{ $order->order_number }}
        </p>

        <span class="badge">COD</span>
    </header>

    <section class="section">
        <p class="section-title">Transport details</p>

        <table class="info-table">
            <tr>
                <td width="50%">
                    <p class="info-label">Order date</p>
                    <p>{{ $order->created_at->format('d/m/Y H:i') }}</p>
                </td>

                <td width="50%">
                    <p class="info-label">Order status</p>
                    <p>{{ str_replace('_', ' ', $order->status) }}</p>
                </td>
            </tr>

            <tr>
                <td>
                    <p class="info-label">Carrier</p>
                    <p>{{ $order->carrier_name ?: 'Not assigned yet' }}</p>
                </td>

                <td>
                    <p class="info-label">Tracking number</p>
                    <p>{{ $order->tracking_number ?: 'Not assigned yet' }}</p>
                </td>
            </tr>
        </table>
    </section>

    <section class="section">
        <p class="section-title">Recipient and delivery address</p>

        <table class="info-table">
            <tr>
                <td width="50%">
                    <p class="info-label">Customer name</p>
                    <p>{{ $order->customer_name }}</p>
                </td>

                <td width="50%">
                    <p class="info-label">Phone</p>
                    <p>{{ $order->customer_phone }}</p>
                </td>
            </tr>

            @if ($order->customer_email)
                <tr>
                    <td colspan="2">
                        <p class="info-label">Email</p>
                        <p>{{ $order->customer_email }}</p>
                    </td>
                </tr>
            @endif

            <tr>
                <td colspan="2">
                    <p class="info-label">Zone</p>
                    <p>
                        {{ $order->delivery_city }}
                        · {{ $order->delivery_district }}
                        · {{ $order->delivery_zone_name }}
                    </p>
                </td>
            </tr>

            <tr>
                <td colspan="2">
                    <p class="info-label">Full address</p>
                    <p>{!! nl2br(e($order->delivery_address)) !!}</p>
                </td>
            </tr>
        </table>
    </section>

    <section class="section">
        <p class="section-title">Products to deliver</p>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th class="text-right">Unit price</th>
                    <th class="text-right">Quantity</th>
                    <th class="text-right">Line total</th>
                </tr>
            </thead>

            <tbody>
                @foreach ($order->items as $item)
                    <tr>
                        <td>{{ $item->product_name }}</td>
                        <td class="text-right">
                            MAD {{ number_format((float) $item->unit_price_mad, 2) }}
                        </td>
                        <td class="text-right">{{ $item->quantity }}</td>
                        <td class="text-right">
                            MAD {{ number_format((float) $item->line_total_mad, 2) }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals-wrapper">
            <table class="totals-table">
                <tr>
                    <td>Products subtotal</td>
                    <td class="text-right">
                        MAD {{ number_format((float) $order->subtotal_mad, 2) }}
                    </td>
                </tr>

                <tr>
                    <td>Delivery fee</td>
                    <td class="text-right">
                        MAD {{ number_format((float) $order->delivery_fee_mad, 2) }}
                    </td>
                </tr>

                <tr class="cod-row">
                    <td>Cash on Delivery total to collect</td>
                    <td class="text-right">
                        MAD {{ number_format((float) $order->cod_amount_mad, 2) }}
                    </td>
                </tr>
            </table>
        </div>
    </section>

    @if ($order->customer_note)
        <section class="note">
            <p class="info-label">Customer delivery note</p>
            <p>{!! nl2br(e($order->customer_note)) !!}</p>
        </section>
    @endif

    <footer class="footer">
        Morocco Shop · Transport document generated for {{ $order->order_number }}
    </footer>
</body>
</html>