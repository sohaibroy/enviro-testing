<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Http\OrdersController;
use App\Http\EstimateController;

class EstimateEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $estimateDetails; 
    public $companyInfo;

    public function __construct($order, $estimateDetails, $company_info)
    {
        $this->order = $order; 
        $this->estimateDetails = $estimateDetails;
        $this->companyInfo = $company_info;

    }

    // build the estimate email
    public function build()
    {
        return $this
            ->from('info.enviroworks@gmail.com', 'Eurofins Enviro-Works')
            ->subject('Eurofins Estimate')
            ->view('estimate', [
                'order'       => $this->order,
                'estimateDetails' => $this->estimateDetails,
                'company_info'=> $this->companyInfo,
                'logoPath'    => public_path('storage/img/eurofins-logo.png'),
            ]);
    }
}