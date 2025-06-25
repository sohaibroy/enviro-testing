<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enviro Works Contact Request</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f4f4f4; color: #000000;">
<div class="container" style="max-width: 800px; min-width:700px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h1 style="margin-top: 2rem; margin-bottom: 1rem;">Contact Request</h1>
    <p style="margin-top: 0; margin-bottom: 1rem;">You have received a new contact request from the Enviro-Works Portal.</p>
    <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Contact Details</h2>
    <ul style="margin-top: 0; margin-bottom: 1rem;">
        <li><strong>Name:</strong> {{ $name }}</li>
        <li><strong>Email:</strong> {{ $email }}</li>
        <li><strong>Phone:</strong> {{ $phone }}</li>
        <li><strong>City:</strong> {{ $city }}</li>
        <li><strong>State:</strong> {{ $state }}</li>
    </ul>
    <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Message</h2>
    <p style="margin-top: 0; margin-bottom: 1rem;">{{ $message }}</p>
</div>

</body>

</html>
