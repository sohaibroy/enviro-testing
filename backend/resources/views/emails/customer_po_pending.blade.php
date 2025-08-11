<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your Order is Confirmed (Payment Pending)</title>
  <style>
    body { font-family: Arial, sans-serif; background-color:#f8fafc; color:#333; margin:0; padding:0; }
    .wrap { max-width:700px; margin:40px auto; background:#fff; border:1px solid #ddd; padding:28px; border-radius:8px; }
    .header { text-align:center; border-bottom:1px solid #e0e0e0; padding-bottom:18px; }
    .header img { max-width:180px; height:auto; }
    h2 { color:#0f3c6b; margin:16px 0 6px; }
    .pill { display:inline-block; padding:4px 10px; border-radius:999px; font-size:12px; margin-top:6px; background:#fff7e6; color:#8a5a00; border:1px solid #ffe0a6; }
    .grid p { margin:4px 0; }
    .section { margin-top:22px; }
    .note { background:#f1f5f9; padding:12px; border-radius:6px; font-size:14px; }
    .footer { margin-top:32px; font-size:12px; color:#888; text-align:center; }
  </style>
</head>
<body>
  @php
    $frontend = config('app.frontend_url') ?: env('FRONTEND_URL');
  @endphp
  <div class="wrap">
    <div class="header">
      <img src="https://two025-may-enviroworks-mainapplication.onrender.com/img/eurofins-logo.png" alt="Eurofins EnviroWorks Logo">
      <h2>Your Order is Confirmed</h2>
      <div class="pill">PAYMENT PENDING</div>
    </div>

    <div class="section grid">
      <p><strong>Order ID:</strong> {{ $order->order_id }}</p>
      <p><strong>Order Date:</strong> {{ $order->order_date }}</p>
      <p><strong>Payment Method:</strong> {{ $order->payment_method ?? 'PO' }}</p>
      @if(!empty($order->po_number))
        <p><strong>PO Number:</strong> {{ $order->po_number }}</p>
      @endif
      <p><strong>Subtotal:</strong> ${{ number_format((float)$order->subtotal, 2) }}</p>
      <p><strong>GST:</strong> ${{ number_format((float)$order->gst, 2) }}</p>
      <p><strong>Total:</strong> ${{ number_format((float)$order->total_amount, 2) }}</p>
    </div>

    <div class="section note">
      <p>Your order has been recorded, but payment is still pending.</p>
      <p>You can pay by credit card from your Customer Portal once services are performed, or call us with your PO to process payment. If you already paid, please ignore this message.</p>
      @if($frontend)
        <p>Customer Portal: <a href="{{ rtrim($frontend,'/') }}/customer-portal">{{ rtrim($frontend,'/') }}/customer-portal</a></p>
      @endif
    </div>

    <div class="section">
      <h3>Analyte Details</h3>
      @forelse($order->orderDetails as $d)
        <p>
          <strong>Analyte:</strong> {{ $d->method->analyte->analyte_name ?? 'Unknown' }}<br>
          <strong>Method:</strong> {{ $d->method->method_name ?? 'Unknown' }}<br>
          <strong>Turnaround:</strong> {{ $d->turnaroundTime->label ?? $d->turn_around_id }}<br>
          <strong>Quantity:</strong> {{ $d->required_quantity ?? 1 }}<br>
          <strong>Pumps:</strong> {{ $d->required_pumps ?? 0 }}<br>
          <strong>Media:</strong> {{ $d->required_media ?? 'N/A' }}<br>
          <strong>Price:</strong> ${{ number_format((float)$d->price, 2) }}
        </p>
      @empty
        <p>No analytes listed.</p>
      @endforelse
    </div>

    <div class="section">
      <h3>Equipment Rental</h3>
      @forelse($order->equipmentItems as $item)
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

    <div class="footer">
      <p>&copy; {{ date('Y') }} Eurofins EnviroWorks. All rights reserved.</p>
    </div>
  </div>
</body>
</html>