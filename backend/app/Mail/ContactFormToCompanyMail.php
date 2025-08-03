<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormToCompanyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct(array $formData)
    {
        $this->data = $formData;
    }

    public function build()
    {
        return $this->subject('New Contact Form Submission')
            ->view('emails.contact-to-company')
            ->with(['data' => $this->data]);
    }
}