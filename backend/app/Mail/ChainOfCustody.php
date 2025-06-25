<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Http\ChainOfCustodyController;
use Illuminate\Support\Facades\Log;

class ChainOfCustody extends Mailable
{
    use Queueable, SerializesModels;

    public $formData;

    public function __construct($formData)
    {
        $this->formData = $formData;
    }

    // Builds the chain of custody email template 
    public function build()
    {
        $formData = $this->formData;

        return $this
            ->from('info.enviroworks@gmail.com', 'Eurofins Chain of Custody')
            ->subject('New Chain of Custody Submission - ' . $formData['labClient'])
            ->view('chainofcustody', [
                'formData' => $formData,
                'logoPath' => public_path('storage/img/eurofins-logo.png'),
            ]);
    }
}