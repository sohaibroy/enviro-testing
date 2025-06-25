<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderCompleted extends Mailable
{
    use Queueable, SerializesModels;

    public $orderData; // Define a public property to hold the order data

    /**
     * Create a new message instance.
     *
     * @param array $orderData The data related to the order
     * @return void
     */
    public function __construct($orderData)
    {
        $this->orderData = $orderData; // Assign the order data to the public property
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.ordercomplete'); // Return the email view template
    }
}
