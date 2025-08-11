@php
    use Carbon\Carbon;

    // Dates & totals
    $dt = $order->payment_received_at
        ? Carbon::parse($order->payment_received_at)->format('Y-m-d H:i')
        : Carbon::parse($order->order_date ?? now())->format('Y-m-d H:i');

    $subtotal = number_format((float)($order->subtotal ?? 0), 2);
    $gst      = number_format((float)($order->gst ?? 0), 2);
    $total    = number_format((float)($order->total_amount ?? 0), 2);

    $method    = $order->payment_method ?: 'Credit Card';
    $po        = $order->po_number ?? null;
    $reference = $order->payment_reference ?? ($order->stripe_payment_intent_id ?? $order->stripe_session_id ?? null);
@endphp
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Payment Receipt</title>
  <style>
    body { margin:0; padding:0; background:#f6f7fb; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#1f2937; }
    a { color:#0ea5e9; text-decoration:none; }
    img { border:0; line-height:100%; vertical-align:middle; }
    .wrapper { width:100%; background:#f6f7fb; padding:24px 0; }
    .container { width:100%; max-width:680px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 28px rgba(2,8,20,0.08); }
    .header { padding:22px 28px; background:#ffffff; border-bottom:1px solid #f1f5f9; text-align:center; }
    .logo { max-width:220px; height:auto; }
    .body { padding:28px; }
    .eyebrow { font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#16a34a; margin:0 0 6px; font-weight:700; }
    .title { margin:0 0 10px; font-size:22px; line-height:1.25; color:#0f172a; font-weight:800; }
    .subtitle { margin:0 0 18px; font-size:14px; color:#334155; }
    .card { border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; margin:16px 0 20px; }
    .row { display:flex; flex-wrap:wrap; }
    .cell { width:50%; padding:14px 16px; border-bottom:1px solid #e5e7eb; }
    .cell:nth-child(odd) { border-right:1px solid #e5e7eb; }
    .label { display:block; font-size:12px; color:#64748b; margin-bottom:4px; }
    .value { font-size:14px; color:#0f172a; font-weight:600; }
    @media(max-width:520px){ .cell { width:100%; border-right:none !important; } }
    .section-title { margin:18px 0 8px; font-size:16px; color:#0f172a; font-weight:700; }
    .table { width:100%; border-collapse:collapse; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; }
    .table th { text-align:left; font-size:12px; color:#64748b; background:#f8fafc; padding:10px 12px; border-bottom:1px solid #e5e7eb; }
    .table td { font-size:13px; color:#0f172a; padding:10px 12px; border-bottom:1px solid #f1f5f9; vertical-align:top; }
    .totals { margin-top:14px; text-align:right; }
    .totals p { margin:4px 0; font-size:14px; }
    .totals .grand { font-weight:800; font-size:16px; }
    .btn-wrap { text-align:center; margin:22px 0 6px; }
    .btn { display:inline-block; background:#0ea5e9; color:#ffffff !important; padding:12px 18px; border-radius:10px; font-weight:700; font-size:14px; }
    .footer { text-align:center; padding:18px 10px 28px; color:#94a3b8; font-size:12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img class="logo" src="{{ $logoUrl }}" alt="Eurofins EnviroWorks Logo">
      </div>

      <div class="body">
        <p class="eyebrow">Payment Received</p>
        <h1 class="title">Thank you — your payment has been recorded</h1>
        <p class="subtitle">This email is your official receipt. A summary of your order is below.</p>

        <div class="card">
          <div class="row">
            <div class="cell"><span class="label">Order #</span><span class="value">#{{ $order->order_id }}</span></div>
            <div class="cell"><span class="label">Date</span><span class="value">{{ $dt }}</span></div>
            <div class="cell"><span class="label">Payment Method</span><span class="value">{{ $method }}</span></div>
            <div class="cell"><span class="label">Payment Status</span><span class="value">{{ ucfirst($order->payment_status ?? 'paid') }}</span></div>
            @if($po)
              <div class="cell"><span class="label">PO Number</span><span class="value">{{ $po }}</span></div>
            @endif
            @if($reference)
              <div class="cell"><span class="label">Payment Reference</span><span class="value">{{ $reference }}</span></div>
            @endif
            <div class="cell"><span class="label">Subtotal</span><span class="value">${{ $subtotal }}</span></div>
            <div class="cell"><span class="label">GST</span><span class="value">${{ $gst }}</span></div>
            <div class="cell" style="border-bottom:none;"><span class="label">Total</span><span class="value">${{ $total }}</span></div>
          </div>
        </div>

        @if(!empty($details))
          <h3 class="section-title">Analyte Details</h3>
          <table class="table" role="presentation" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th>Analyte</th>
                <th>Method</th>
                <th>Turnaround</th>
                <th>Qty</th>
                <th>Pumps</th>
                <th>Media</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              @foreach($details as $d)
              <tr>
                <td>{{ $d['analyte_name'] }}</td>
                <td>{{ $d['method_name'] }}</td>
                <td>{{ $d['turnaround_time'] }}</td>
                <td>{{ $d['required_quantity'] }}</td>
                <td>{{ $d['required_pumps'] ?? '—' }}</td>
                <td>{{ $d['required_media'] ?? '—' }}</td>
                <td>${{ number_format($d['price'], 2) }}</td>
              </tr>
              @if(!empty($d['customer_comment']))
              <tr>
                <td colspan="7"><em>Comment:</em> {{ $d['customer_comment'] }}</td>
              </tr>
              @endif
              @endforeach
            </tbody>
          </table>
        @endif

        @if(!empty($equipment))
          <h3 class="section-title">Equipment Rental</h3>
          <table class="table" role="presentation" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Category</th>
                <th>Start</th>
                <th>Return</th>
                <th>Qty</th>
                <th>Daily Cost</th>
              </tr>
            </thead>
            <tbody>
              @foreach($equipment as $e)
              <tr>
                <td>{{ $e['equipment_name'] }}</td>
                <td>{{ $e['category'] }}</td>
                <td>{{ $e['start_date'] }}</td>
                <td>{{ $e['return_date'] }}</td>
                <td>{{ $e['quantity'] }}</td>
                <td>${{ number_format($e['daily_cost'], 2) }}</td>
              </tr>
              @endforeach
            </tbody>
          </table>
        @endif

        <div class="btn-wrap">
          <a class="btn" href="{{ $portalUrl }}" target="_blank" rel="noopener">View in Customer Portal</a>
        </div>

        <p class="subtitle" style="margin-top:16px;">
          Questions? Just reply to this email and our team will help.
        </p>
      </div>

      <div class="footer">
        &copy; {{ date('Y') }} EnviroWorks. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>