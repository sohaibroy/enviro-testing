<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmailContact extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct($first_name, $last_name, $email, $phone_number, $city, $province_state, $message)
    {
        $this->name = $first_name . ' ' . $last_name;
        $this->email = $email;
        $this->phone = $phone_number;
        $this->city = $city;
        $this->state = $province_state;
        $this->message = $message;
    }

    public function build()
    {
        Log::info('Start of function');
        $name = $this->name;
        $email = $this->email;
        $phone = $this->phone;
        $city = $this->city;
        $state = $this->state;
        $message = $this->message;
        Log::info('Variables set');
        $mail = new PHPMailer(true);

        try {
            //Server settings
            $mail->SMTPDebug = 0;                      // Enable verbose debug output
            $mail->isSMTP();                           // Set mailer to use SMTP
            $mail->Host = 'smtp.gmail.com';          // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                    // Enable SMTP authentication
            $mail->Username = 'info.enviroworks@gmail.com'; // SMTP username
            $mail->Password = 'zrnnmfmaunjlnlsk';    // SMTP password
            $mail->SMTPSecure = 'tls';                 // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 587;                         // TCP port to connect to

            Log::info('Server settings set');

            $mail->setFrom('info.enviroworks@gmail.com', 'John Doe');
            $mail->addAddress('info.enviroworks@gmail.com', 'Jane Doe');     // Add a recipient

            Log::info('Recipients set');

            $mail->isHTML(true);
            $mail->Subject = 'Contact Form Request';
            $mail->Body = view('contact', compact('name', 'email', 'phone', 'city', 'state', 'message'))->render();
            $mail->AltBody = 'A new contact form request has been submitted.';

            Log::info('Mail body set');

            $mail->send();

            return response()->json(['message' => 'Email sent successfully!'], 200);

        } catch (Exception $e) {
            Log::error('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
        }

    }
}
