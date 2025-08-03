<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Order Received</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8fafc;
            color: #333;
            padding: 0;
            margin: 0;
        }
        .email-container {
            max-width: 700px;
            margin: 40px auto;
            background: #fff;
            border: 1px solid #ddd;
            padding: 30px;
            border-radius: 8px;
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 180px;
            height: auto;
        }
        h2 {
            color: #0f3c6b;
        }
        .section {
            margin-top: 30px;
        }
        .footer {
            margin-top: 40px;
            font-size: 0.9em;
            color: #888;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: #0f3c6b;
            color: #fff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
        }
        p {
            margin: 4px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://two025-may-enviroworks-mainapplication.onrender.com/img/eurofins-logo.png" alt="Eurofins EnviroWorks Logo">
            <h2>New Order Received</h2>
        </div>

        <p>A new order has been placed and paid successfully.</p>

        <div class="section">
            <h3>Order Summary</h3>
            <p><strong>Order ID:</strong> {{ $order->order_id }}</p>
            <p><strong>Order Date:</strong> {{ $order->order_date }}</p>
            <p><strong>Customer Email:</strong> {{ $customerEmail }}</p>
            <p><strong>Total Amount:</strong> ${{ number_format($order->total_amount, 2) }}</p>
        </div>

        <div class="section">
            <h3>Analyte Details</h3>
            @forelse ($order->orderDetails as $detail)
                <p>
                    <strong>Analyte:</strong> {{ $detail->method->analyte->analyte_name ?? 'Unknown' }}<br>
                    <strong>Method:</strong> {{ $detail->method->method_name ?? 'Unknown' }}<br>
                    <strong>Quantity:</strong> {{ $detail->required_quantity ?? 1 }}<br>
                    <strong>Pumps:</strong> {{ $detail->required_pumps ?? 0 }}<br>
                    <strong>Media:</strong> {{ $detail->required_media ?? 0 }}<br>
                    <strong>Price:</strong> ${{ number_format($detail->price, 2) }}
                </p>
            @empty
                <p>No analytes listed.</p>
            @endforelse
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
                    <strong>Daily Cost:</strong> ${{ number_format($item->daily_cost, 2) }}
                </p>
            @empty
                <p>No equipment selected.</p>
            @endforelse
        </div>

       <a href="{{ config('app.frontend_url') }}/manage-orders" class="button">
    View Order in Admin Panel
</a>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Eurofins EnviroWorks. All rights reserved.</p>
        </div>
    </div>
</body>
</html>