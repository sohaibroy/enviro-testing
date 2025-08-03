<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormToCustomerMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function build()
    {
        return $this->subject('We’ve received your message')
            ->view('emails.contact-to-customer')
            ->with(['name' => $this->name]);
    }
}
