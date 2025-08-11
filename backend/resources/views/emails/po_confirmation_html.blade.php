<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Confirmed — Pending Payment</title>
    <style>
        body { font-family: Arial, sans-serif; background:#f8fafc; color:#333; margin:0; padding:0; }
        .wrap { max-width: 720px; margin: 32px auto; background:#fff; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; }
        .header { text-align:center; padding:28px 24px; border-bottom:1px solid #eef2f7; }
        .header img { max-width: 200px; height:auto; }
        .title { color:#0f3c6b; margin:10px 0 0; font-size:22px; }
        .body { padding:24px; }
        .pill { display:inline-block; padding:4px 10px; border-radius:999px; font-size:12px; background:#fff3cd; color:#856404; border:1px solid #ffeeba; }
        .grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px 24px; margin-top:16px; }
        h3 { color:#0f3c6b; margin:24px 0 8px; }
        .item { padding:12px 0; border-bottom:1px solid #f1f5f9; }
        .footer { background:#f9fafb; padding:18px 24px; text-align:center; color:#666; font-size:12px; }
        .btn { display:inline-block; background:#0f3c6b; color:#fff; text-decoration:none; padding:12px 18px; border-radius:6px; margin-top:14px; }
        .totals { text-align:right; margin-top:18px; }
        .totals p { margin:4px 0; }
    </style>
</head>
<body>
@php
    $logoUrl  = $logoUrl ?? 'https://two025-may-enviroworks-mainapplication.onrender.com/img/eurofins-logo.png';
    $portalUrl = $portalUrl ?? (rtrim(config('app.frontend_url') ?: env('FRONTEND_URL'), '/') . '/customer-portal');
@endphp
<div class="wrap">
    <div class="header">
        <img src="{{ $logoUrl }}" alt="Eurofins EnviroWorks Logo">
        <h2 class="title">Your order is confirmed</h2>
        <div class="pill">Payment Status: Pending (PO)</div>
    </div>

    <div class="body">
        <p>Hi,</p>
        <p>Thanks for your order with Eurofins EnviroWorks. We’ve recorded your Purchase Order and will begin processing. You can pay later by credit card in your customer portal, or contact us to process your PO payment.</p>

        <div class="grid">
            <div><strong>Order #:</strong> {{ $order->order_id }}</div>
            <div><strong>Date:</strong> {{ $order->order_date }}</div>
            <div><strong>Payment Method:</strong> {{ $order->payment_method ?? 'PO' }}</div>
            <div><strong>PO Number:</strong> {{ $order->po_number ?? '—' }}</div>
        </div>

       <h3>Analyte Details</h3>
@if(!empty($details))
  @foreach ($details as $d)
    <div class="item">
      <div><strong>Analyte:</strong> {{ $d['analyte_name'] ?: 'Unknown' }}</div>
      <div><strong>Method:</strong> {{ $d['method_name'] ?: 'Unknown' }}</div>
      <div><strong>Turnaround:</strong> {{ $d['turnaround_time'] ?: '—' }}</div>
      <div><strong>Qty:</strong> {{ $d['required_quantity'] ?? 1 }}</div>
      <div><strong>Pumps:</strong> {{ $d['required_pumps'] ?? 0 }}</div>
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

        @if ($order->equipmentItems->count())
            <h3>Equipment Rental</h3>
            @foreach ($order->equipmentItems as $e)
                <div class="item">
                    <div><strong>Equipment:</strong> {{ $e->equipment_name }}</div>
                    <div><strong>Category:</strong> {{ $e->category }}</div>
                    <div><strong>Start:</strong> {{ $e->start_date }}</div>
                    <div><strong>Return:</strong> {{ $e->return_date }}</div>
                    <div><strong>Quantity:</strong> {{ $e->quantity }}</div>
                    <div><strong>Daily Cost:</strong> ${{ number_format((float)$e->daily_cost, 2) }}</div>
                </div>
            @endforeach
        @endif

        <div class="totals">
            <p><strong>Subtotal:</strong> ${{ number_format((float)$order->subtotal, 2) }}</p>
            <p><strong>GST:</strong> ${{ number_format((float)$order->gst, 2) }}</p>
            <p><strong>Total:</strong> ${{ number_format((float)$order->total_amount, 2) }}</p>
        </div>

        <p>
            <a class="btn" href="{{ $portalUrl }}">Open Customer Portal</a>
        </p>

        <p>If you have any questions, reply to this email and our team will help you out.</p>
    </div>

    <div class="footer">
        &copy; {{ date('Y') }} Eurofins EnviroWorks. All rights reserved.
    </div>
</div>
</body>
</html>
