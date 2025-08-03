<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Orders;
use App\Http\Controllers\OrdersController;
use App\Helpers\EmailOrderHelper;

class CompanyOrderNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Orders $order;
    public string $customerEmail;

public function __construct(Orders $order, string $customerEmail)
{
    $this->order = EmailOrderHelper::loadFullOrder($order->order_id);
    $this->customerEmail = $customerEmail;
}
    public function build()
    {
        return $this->subject('New Order Received')
    ->view('emails.company-notification')
    ->with([
        'order' => $this->order,
        'customerEmail' => $this->customerEmail,
        'analyteDetails' => $this->order->orderDetails,
    ]);
    }
}
