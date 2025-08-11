<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Notification</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; color:#333; margin:0; padding:0; }
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
        .item { padding:12px 0; border-bottom:1px solid #f1f5f9; }
        .muted { color:#64748b; font-size:12px; }
    </style>
</head>
<body>
@php
    $isPaid = strtolower((string)($order->payment_status ?? '')) === 'paid';
@endphp

<div class="email-container">
    <div class="header">
        <img src="{{ $logoUrl }}" alt="Eurofins EnviroWorks Logo">
        <h2>{{ $isPaid ? 'New Order Paid' : 'New Order Created (Pending Payment)' }}</h2>
        <div class="pill {{ $isPaid ? 'paid' : 'pending' }}">{{ $isPaid ? 'PAID' : 'PENDING' }}</div>
    </div>

    <div class="section">
        <h3>Order Summary</h3>
        <p><strong>Order ID:</strong> {{ $order->order_id }}</p>
        <p><strong>Order Date:</strong> {{ $order->order_date }}</p>
        <p><strong>Customer Email:</strong> {{ $customerEmail ?: '—' }}</p>
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
        <p class="muted">Account: {{ optional($order->account)->first_name }} {{ optional($order->account)->last_name }} @if(optional($order->account)->company) — {{ optional($order->account->company)->company_name }} @endif</p>
    </div>

    <div class="section">
        <h3>Analyte Details</h3>
        @if(!empty($details))
            @foreach ($details as $d)
                <div class="item">
                    <div><strong>Analyte:</strong> {{ $d['analyte_name'] }}</div>
                    <div><strong>Method:</strong> {{ $d['method_name'] }}</div>
                    <div><strong>Turnaround:</strong> {{ $d['turnaround'] }}</div>
                    <div><strong>Qty:</strong> {{ $d['required_quantity'] }}</div>
                    <div><strong>Pumps:</strong> {{ $d['required_pumps'] ?? '—' }}</div>
                    <div><strong>Media:</strong> {{ $d['required_media'] ?? '—' }}</div>
                    <div><strong>Line Total:</strong> ${{ number_format((float)$d['price'], 2) }}</div>
                    @if (!empty($d['customer_comment']))
                        <div><strong>Comments:</strong> {{ $d['customer_comment'] }}</div>
                    @endif
                </div>
            @endforeach
        @else
            <p>No analytes listed.</p>
        @endif
    </div>

    @if(!empty($equipment))
        <div class="section">
            <h3>Equipment Rental</h3>
            @foreach ($equipment as $e)
                <div class="item">
                    <div><strong>Equipment:</strong> {{ $e['equipment_name'] }}</div>
                    <div><strong>Category:</strong> {{ $e['category'] }}</div>
                    <div><strong>Start:</strong> {{ $e['start_date'] }}</div>
                    <div><strong>Return:</strong> {{ $e['return_date'] }}</div>
                    <div><strong>Quantity:</strong> {{ $e['quantity'] }}</div>
                    <div><strong>Daily Cost:</strong> ${{ number_format((float)$e['daily_cost'], 2) }}</div>
                </div>
            @endforeach
        </div>
    @endif

    <div class="footer">
        <p>&copy; {{ date('Y') }} Eurofins EnviroWorks. All rights reserved.</p>
    </div>
</div>
</body>
</html>
