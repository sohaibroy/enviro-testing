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

class DemoEmail extends Mailable
{
    use Queueable, SerializesModels;

    public string $title;
    public string $body;

    public function __construct($title, $body)
    {
        $this->title = $title;
        $this->body = $body;
    }

    public function build()
    {

        $title = $this->title;
        $body = $this->body;

        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->SMTPDebug = 0;                      // Enable verbose debug output
            $mail->isSMTP();                           // Set mailer to use SMTP
            $mail->Host = 'smtp.gmail.com';          // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                    // Enable SMTP authentication
            $mail->Username = '1029jmla.fry@gmail.com'; // SMTP username
            $mail->Password = 'efqppjpcnjnuycln';    // SMTP password
            $mail->SMTPSecure = 'tls';                 // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 587;                         // TCP port to connect to

            // Recipients
            $mail->setFrom('1029jmla.fry@gmail.com', 'John Doe');
            $mail->addAddress('victodern@gmail.com', 'Jane Doe');

            // Content
            $mail->isHTML(true); // Set email format to HTML
            $mail->Subject = $title;
            // using view() returns an invalid view error at /web/send-demo-email but still works.
            // don't use $this->view() since it doesn't work and doesn't throw errors to say what didn't work.
            $mail->Body = view('demo', compact('title', 'body'))->render();
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

            $mail->send();
        } catch (Exception $e) {
            Log::error('Message could not be sent. Mailer Error: ', (array)$mail->ErrorInfo);
        }

        return $this;
    }
}
