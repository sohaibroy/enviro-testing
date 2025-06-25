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
use App\Http\OrdersController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmailOrder extends Mailable
{
    use Queueable, SerializesModels;

    public $order; // Define the order property
    public $orderDetail; // Define the orderDetail property

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($order, $orderDetail, $company_info)
    {
        $this->order = $order; // Initialize the order property
        $this->orderDetail = $orderDetail; // Initialize the orderDetail property
        $this->companyInfo = $company_info;
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */

     public function build()
    {
        $order = $this->order;
        $orderDetail = $this->orderDetail;
        $company_info= $this->companyInfo;

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

            // Recipients
            $mail->setFrom('info.enviroworks@gmail.com', 'Eurofins Enviro-Works');
            // Add CC recipient
            $mail->addCC('enviroworks2024@gmail.com', 'Carbon Copy');
            $mail->addAddress($company_info['email'], $company_info['first_name'] . ' ' . $company_info['last_name']);     // Add a recipient

            // Attach images
            $cid = 'eurofins-logo'; // Unique CID identifier
            $mail->addEmbeddedImage('./storage/img/eurofins-logo.png', $cid, 'eurofins-logo.png');


            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = 'Order';
            $mail->Body = view('ordercomplete', compact('order', 'orderDetail','company_info'))->render();
            $mail->AltBody = 'Your Electronic Invoice';

            $mail->send();
        } catch (Exception $e) {
            Log::error("Message could not be sent. Mailer Error: " . $mail->ErrorInfo);
            Log::error("Exception: " . $e->getMessage());
        }
        return $this;
    }
}
