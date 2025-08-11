<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Notification</title>
    <style>
        body { font-family: Arial, sans-serif; background-color:#f8fafc; color:#333; margin:0; padding:0; }
        .email-container { max-width:700px; margin:40px auto; background:#fff; border:1px solid #ddd; padding:30px; border-radius:8px; }
        .header { text-align:center; border-bottom:1px solid #e0e0e0; padding-bottom:20px; }
        .header img { max-width:180px; height:auto; }
        h2 { color:#0f3c6b; margin:16px 0 8px; }
        .section { margin-top:24px; }
        .footer { margin-top:32px; font-size:.9em; color:#888; text-align:center; }
        .button { display:inline-block; background-color:#0f3c6b; color:#fff; padding:12px 24px; text-decoration:none; border-radius:6px; margin-top:20px; }
        p { margin:4px 0; }
        .pill { display:inline-block; padding:4px 10px; border-radius:999px; font-size:12px; margin-top:6px; }
        .paid { background:#e6ffed; color:#0a5b2c; border:1px solid #b7efc5; }
        .pending { background:#fff7e6; color:#8a5a00; border:1px solid #ffe0a6; }
    </style>
</head>
<body>
@php
    $isPaid   = strtolower((string)($order->payment_status ?? '')) === 'paid';
    $frontend = rtrim(config('app.frontend_url') ?: env('FRONTEND_URL'), '/');
    $customerEmailResolved = $customerEmail
        ?? optional(optional($order)->account)->email
        ?? '';
@endphp

<div class="email-container">
    <div class="header">
        <img src="https://two025-may-enviroworks-mainapplication.onrender.com/img/eurofins-logo.png" alt="Eurofins EnviroWorks Logo">
        <h2>{{ $isPaid ? 'New Order Paid' : 'New Order Created (Pending Payment)' }}</h2>
        <div class="pill {{ $isPaid ? 'paid' : 'pending' }}">{{ $isPaid ? 'PAID' : 'PENDING' }}</div>
    </div>

    <div class="section">
        <h3>Order Summary</h3>
        <p><strong>Order ID:</strong> {{ $order->order_id }}</p>
        <p><strong>Order Date:</strong> {{ $order->order_date }}</p>
        <p><strong>Customer Email:</strong> {{ $customerEmailResolved ?: '—' }}</p>
        <p><strong>Payment Status:</strong> {{ $order->payment_status ?? 'pending' }}</p>
        <p><strong>Payment Method:</strong> {{ $order->payment_method ?? 'PO' }}</p>
        @if(!empty($order->po_number))
            <p><strong>PO Number:</strong> {{ $order->po_number }}</p>
        @endif
        @if(!empty($order->payment_reference))
            <p><strong>Payment Reference:</strong> {{ $order->payment_reference }}</p>
        @endif
        <p><strong>Subtotal:</strong> ${{ number_format((float)$order->subtotal, 2) }}</p>
        <p><strong>GST:</strong> ${{ number_format((float)$order->gst, 2) }}</p>
        <p><strong>Total Amount:</strong> ${{ number_format((float)$order->total_amount, 2) }}</p>
    </div>

    <div class="section">
        <h3>Analyte Details</h3>
        @if(!empty($details))
            @foreach ($details as $d)
                <p>
                    <strong>Analyte:</strong> {{ $d['analyte_name'] ?: 'Unknown' }}<br>
                    <strong>Method:</strong> {{ $d['method_name'] ?: 'Unknown' }}<br>
                    <strong>Turnaround:</strong> {{ $d['turnaround_time'] ?: '—' }}<br>
                    <strong>Quantity:</strong> {{ $d['required_quantity'] ?? 1 }}<br>
                    <strong>Pumps:</strong> {{ $d['required_pumps'] ?? 0 }}<br>
                    <strong>Media:</strong> {{ $d['required_media'] ?? 'N/A' }}<br>
                    <strong>Price:</strong> ${{ number_format((float)$d['price'], 2) }}<br>
                    @if (!empty($d['customer_comment']))
                        <em>Comments:</em> {{ $d['customer_comment'] }}
                    @endif
                </p>
            @endforeach
        @else
            <p>No analytes listed.</p>
        @endif
    </div>

    <div class="section">
        <h3>Rental Equipment</h3>
        @forelse ($order->equipmentItems as $item)
            <p>
                <strong>Equipment:</strong> {{ $item->equipment_name }}<br>
                <strong>Category:</strong> {{ $item->category }}<br>
                <strong>Start:</strong> {{ $item->start_date }}<br>
                <strong>Return:</strong> {{ $item->return_date }}<br>
                <strong>Quantity:</strong> {{ $item->quantity }}<br>
                <strong>Daily Cost:</strong> ${{ number_format((float)$item->daily_cost, 2) }}
            </p>
        @empty
            <p>No equipment selected.</p>
        @endforelse
    </div>

    @if($frontend)
        <a href="{{ $frontend }}/manage-orders" class="button">View Order in Admin Panel</a>
    @endif

    <div class="footer">
        <p>&copy; {{ date('Y') }} Eurofins EnviroWorks. All rights reserved.</p>
    </div>
</div>
</body>
</html>