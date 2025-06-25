<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enviro Works Chain of Custody</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f4f4f4; color: #000000;">
  <div class="container" style="max-width: 1100px; min-width:700px; margin: 20px auto; padding: 20px; background-color:     #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div class="flexthis" style="display: flex; justify-content:space-between; gap: 1rem;">
      <img src="{{ $message->embed($logoPath) }}" alt="Eurofins Logo" style="margin-top: 0; width: 380px; height: 65px;">
      <div style="margin-top: 0; margin-left: auto;">
        <p style="margin-top: 0; margin-bottom: 0;">18949 111 Ave NW,</p>
        <p style="margin-top: 0; margin-bottom: 0;">Edmonton AB T5S 2X4</p>
        <p style="margin-top: 0; margin-bottom: 0;">Phone: (780) 457-4652</p>
      </div>
    </div>
    
    <h1 style="text-align: center; margin-top: 1rem;">New Chain of Custody Submission</h1>
    
    <h2 style="color: #2d3748; margin-top: 25px;">Client Information</h2>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      @foreach([
        'Lab Client'      => $formData['labClient'],
        'Date'            => $formData['date'],
        'Contact Name'    => $formData['contactName'],
        'Email'           => $formData['email'],
        'Phone'           => $formData['phone'],
        'Fax'             => $formData['fax'] ?? 'N/A',
        'Project'         => $formData['project'],
        'Address'         => implode(', ', [
                              $formData['streetAddress'],
                              $formData['city'],
                              $formData['province'],
                              $formData['postalCode'],
                              $formData['country'],
                            ]),
        'PO Number'       => $formData['poNumber'],
        'Credit Card'     => $formData['creditCard'],
        'Expiration Date' => $formData['expDate']
      ] as $label => $value)
      <tr>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left; background-color: #f8f9fa;">{{ $label }}</th>
        <td style="padding: 12px; border: 1px solid #ddd;">{{ $value }}</td>
      </tr>
    @endforeach
    </table>
    
    <h2 style="color: #2d3748; margin-top: 25px;">Turnaround Time</h2>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left; background-color: #f8f9fa;">Selected Turnaround Time</th>
        <td style="padding: 12px; border: 1px solid #ddd;">{{ $formData['turnaround'] }}</td>
      </tr>
      <tr>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left; background-color: #f8f9fa;">Time Received</th>
        <td style="padding: 12px; border: 1px solid #ddd;">{{ $formData['timeReceived'] }}</td>
      </tr>
    </table>

    <h2 style="color: #2d3748; margin-top: 25px;">
      Samples ({{ count($formData['samples']) }})
    </h2>

    @foreach($formData['samples'] as $index => $sample)
      <div style="overflow-x: auto; max-width: 100%;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th colspan="2" style="padding: 12px; border: 1px solid #ddd; text-align: left;">
                Sample #{{ $index + 1 }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Analyte</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['analyte'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['method'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Matrix</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['matrix'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Measurement</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['measurement'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Sample Rate</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['sample_rate'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">LOQ</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['limit_of_quantification'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Pumps</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['pumps'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Media</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['media'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Sample Description</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['customer_comment'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Quantity</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['quantity'] ?? '0' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Price</th>
              <td style="padding: 12px; border: 1px solid #ddd;">
                ${{ number_format($sample['price'] ?? 0, 2) }}
              </td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Time On</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['timeOn'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Time Off</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['timeOff'] ?? 'N/A' }}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Flow Rate</th>
              <td style="padding: 12px; border: 1px solid #ddd;">{{ $sample['flowRate'] ?? 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    @endforeach

    <h2 style="color: #2d3748; margin-top: 25px;">Signature</h2>
    <p>{{ $formData['signature'] }}</p>
    
    <div style="margin-top: 30px; color: #718096; font-size: 0.9em;">
      <p>Submitted at: {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>
  </div>
</body>
</html>