<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enviro Works Estimate</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f4f4f4; color: #000000;">
    <div class="container" style="max-width: 800px; min-width:700px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div class="flexthis" style="display: flex; justify-content:space-between; gap:1rem;">
            <img src="{{ $message->embed($logoPath) }}" alt="Eurofins Logo" style="margin-top: 0; width: 380px; height: 65px;">
            <div class="" style="margin-left: auto;">
                <p style="margin-top: 0; margin-bottom: 0;">18949 111 Ave NW, </p>
                <p style="margin-top: 0; margin-bottom: 0;"> Edmonton AB T5S 2X4</p>
                <p style="margin-top: 0; margin-bottom: 0;">Phone: (780) 457-4652</p>
             </div>
        </div>
        <h2 style="margin-top: 0; color: #000000;">Estimate</h2>
        <h3 style="margin-top: 0; color: #000000;">Hello {{$company_info['first_name']. ' '. $company_info['last_name']  }},</h3>
        <h3 style="margin-top: 0; color: #000000; font-weight: normal;">Please find your project estimate details below:</h3>
 
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <h2 style="margin-top: 0; color: #000000;">Estimate Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
                <tr>
                    <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">Analyte(Method)</th>
                    <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">Price </th>
                    <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">Qty</th>
                    <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">Qty Pumps</th>
                    <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">Qty Media</th>
                    <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">Turn Around Time</th>
                    <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">Comments</th>
                </tr>
            </thead>
            <tbody>
                @if(!empty($estimateDetails)) 
                @foreach($estimateDetails as $detail)
                    <tr>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail['analyte_name'] }} ({{ $detail['method_name'] }})</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">${{ $detail['price'] }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail['required_quantity'] }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail['required_pumps'] ?? 0 }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail['required_media'] ?? 0 }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail['turnaround_time'] }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail['customer_comment'] ?? '' }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="5" style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">No order details found</td>
                </tr>
                @endif
            </tbody>
        </table>
        <table class="half-width-table" style="width: 50%; border-collapse: collapse; margin-bottom: 10px; margin-left: auto;">
            <tbody>
             <tr>
                <td style="padding: 2px; text-align: right;">SubTotal</td>
                <td style="padding: 2px; text-align: right;">{{ number_format($order['subtotal'], 2) }}</td>
             </tr>
             <tr>
                <td style="padding: 2px; text-align: right;">GST</td>
                <td style="padding: 2px; text-align: right;">{{ number_format($order['gst'], 2) }}</td>
             </tr>
             <tr>
                <td style="padding: 2px; text-align: right; font-weight: bold;">Total Amount</td>
                <td style="padding: 2px; text-align: right; font-weight: bold;">{{ number_format($order['total_amount'], 2) }}</td>
             </tr>
            </tbody>
        </table>
        <section>
            <h2 style="margin-top: 0; color: #000000;">NOTE</h2>
            <p style="margin-top: 0;">
            This estimate is for your records only. To submit the order for processing please login to your enviro-works.com account and select: Place my Order.</p>
            <p style="text-align: left; color: #000000; font-weight: bold;">Thank You</p>
            <p style="text-align: left color: #000000;">{{$company_info['first_name']. ' '. $company_info['last_name']  }}</p>
        </section>
    </div>

</body>

</html>