<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>We've Received Your Message</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .email-header {
      background-color: #003883;
      color: #ffffff;
      padding: 24px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 22px;
    }
    .email-body {
      padding: 24px;
      color: #333;
      font-size: 15px;
      line-height: 1.6;
    }
    .email-body p {
      margin-bottom: 16px;
    }
    .email-footer {
      background-color: #f0f0f0;
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Thank You for Contacting Us</h1>
    </div>

    <div class="email-body">
      <p>Dear {{ $name }},</p>

      <p>
        Thank you for reaching out to <strong>Eurofins EnviroWorks</strong>. We’ve received your message and one of our team members will get back to you shortly.
      </p>

      <p>
        If your matter is urgent, please feel free to call us directly at:
        <br><strong>📞 780-457-4652</strong>
      </p>

      <p>
        Best regards,<br>
        <strong>Eurofins EnviroWorks Team</strong>
      </p>
    </div>

    <div class="email-footer">
      This is an automated confirmation. Please do not reply directly to this message.
    </div>
  </div>
</body>
</html>