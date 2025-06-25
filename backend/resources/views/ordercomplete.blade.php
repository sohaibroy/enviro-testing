<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enviro Works Order Receipt </title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f4f4f4; color: #000000;">
    <div class="container" style="max-width: 800px; min-width:700px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div class="flexthis" style="display: flex; justify-content:space-between; gap:1rem;">
            <img src="cid:eurofins-logo" alt="Eurofins Logo" style="margin-top: 0; width: 380px; height: 65px;">
            <div class="" style="margin-top: 0;">
                <p style="margin-top: 0; margin-bottom: 0;">18949 111 Ave NW, </p>
                <p style="margin-top: 0; margin-bottom: 0;"> Edmonton AB T5S 2X4</p>
                <p style="margin-top: 0; margin-bottom: 0;">Phone: (780) 457-4652</p>
             </div>
        </div>
        <h2 style="margin-top: 0; color: #000000;">Order Receipt</h2>
        <div class="flexthis" style="display: flex; justify-content:space-between; gap:1rem;">       
               <table class="half-width-table" style="width: 50%; border-collapse: collapse; margin-bottom: 10px;">
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Company ID</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $company_info['company_id'] }}</td>
            </tr>
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Company Name</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $company_info['company_name']}}</td>
            </tr>
                        </tr>
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Company Number</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $company_info['company_phone'] }}</td>
            </tr>
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Company Address</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $company_info['company_address'] }}</td>
            </tr>
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Account ID</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $order->account_id }}</td>

            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Account Name</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{$company_info['first_name']. ' '. $company_info['last_name']  }}</td>
            </tr>
        </table>
          <table class="half-width-table" style="width: 50%; border-collapse: collapse; margin-bottom: 10px;">
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Order Number</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $order->order_id }}</td>
            </tr>
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Order Date</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $order->order_date }}</td>
            </tr>
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Subtotal</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">${{ number_format($order->subtotal, 2) }}</td>
            </tr>
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">GST</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">${{ number_format($order->gst, 2) }}</td>
            </tr>
            <tr>
                <th style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2; font-size:15px;">Total Amount</th>
                <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">${{ number_format($order->total_amount, 2) }}</td>
            </tr>
        </table>
        </div>
 
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <h2 style="margin-top: 0; color: #000000;">Order Details</h2>
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
                @if(!empty($orderDetail)) 
                @foreach($orderDetail as $detail)
                    <tr>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail->analyte_name . ' ' . $detail->method_name}}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">${{ $detail->price }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail->quantity }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail->quantity_pumps ?? 0 }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail->quantity_media ?? 0 }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail->turnaround_time }}</td>
                        <td style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">{{ $detail->comments ?? '' }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="5" style="padding: 2px; text-align: left; border-bottom: 1px solid #ddd;">No order details found</td>
                </tr>
                @endif
            </tbody>
        </table>
        <section>
            <h2 style="margin-top: 0; color: #000000;">Returns</h2>
            <p style="margin-top: 0;">
        If you encounter any problems or have concerns regarding your order, please do not hesitate to contact our office immediately. We are here to assist you and ensure that any issues are addressed promptly. Your satisfaction is our top priority, and we appreciate your business. </p>
        </section>
    </div>

</body>

</html>