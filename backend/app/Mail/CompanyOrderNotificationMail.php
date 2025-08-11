<?php

namespace App\Mail;

use App\Models\Orders;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanyOrderNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Orders $order;
    public ?string $customerEmail;

    public function __construct(Orders $order, ?string $customerEmail = null)
    {
        $this->order = $order->loadMissing([
            'orderDetails.method.analyte',
            'orderDetails.turnAround',
            'equipmentItems',
            'account',
        ]);
        $this->customerEmail = $customerEmail;
    }

    public function build()
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->subject('Order Notification — '.$this->order->order_id)
            ->view('emails.company-notification')
            ->with([
                'order'         => $this->order,
                'customerEmail' => $this->customerEmail,
            ]);
    }
}


