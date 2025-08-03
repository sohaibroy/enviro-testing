<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Orders;
use Illuminate\Support\Facades\DB;
use App\Helpers\EmailOrderHelper;

class CustomerOrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Orders $order;
    public string $analyteDetails; //This must be initialized before use

public function __construct(Orders $order)
{
    $this->order = EmailOrderHelper::loadFullOrder($order->order_id);
    $this->analyteDetails = $this->order->orderDetails;
}

    public function build()
    {
        return $this->subject('Order Confirmation')
                    ->view('emails.customer-confirmation')
                    ->with([
                        'order' => $this->order,
                        'analyteDetails' => $this->analyteDetails,
                    ]);
    }
}