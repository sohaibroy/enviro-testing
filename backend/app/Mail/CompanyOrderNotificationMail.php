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
    public string $logoUrl;
    public string $customerEmail;

    /** @var array<int,array<string,mixed>> */
    public array $details = [];

    /** @var array<int,array<string,mixed>> */
    public array $equipment = [];

    public function __construct(Orders $order, ?string $customerEmail = '')
    {
        // Eager-load everything we’ll display
        $this->order = $order->loadMissing([
            'orderDetails.method.analyte',
            'orderDetails.turnAround', // if relation exists
            'equipmentItems',
            'account.company',
        ]);

        $this->customerEmail = $customerEmail
            ?: optional($this->order->account)->email
            ?: '';

        $this->logoUrl = 'https://two025-may-enviroworks-mainapplication.onrender.com/img/eurofins-logo.png';

        // Flatten analytes for the template (no relation calls in Blade)
        $this->details = $this->order->orderDetails
            ->map(function ($d) {
                return [
                    'analyte_name'     => optional(optional($d->method)->analyte)->analyte_name ?? 'Unknown',
                    'method_name'      => optional($d->method)->method_name ?? 'Unknown',
                    'turnaround'       => optional($d->turnAround)->turn_around_name
                                          ?? optional($d->turnAround)->label
                                          ?? $d->turn_around_id,
                    'required_quantity'=> (int)($d->required_quantity ?? 1),
                    'required_pumps'   => $d->required_pumps,
                    'required_media'   => $d->required_media,
                    'price'            => (float)($d->price ?? 0),
                    'customer_comment' => $d->customer_comment,
                ];
            })
            ->values()
            ->toArray();

        // Flatten equipment
        $this->equipment = $this->order->equipmentItems
            ->map(function ($e) {
                return [
                    'equipment_name' => $e->equipment_name ?? '',
                    'category'       => $e->category ?? '',
                    'start_date'     => $e->start_date,
                    'return_date'    => $e->return_date,
                    'quantity'       => (int)($e->quantity ?? 0),
                    'daily_cost'     => (float)($e->daily_cost ?? 0),
                ];
            })
            ->values()
            ->toArray();
    }

    public function build()
    {
        $isPaid = strtolower((string)($this->order->payment_status ?? '')) === 'paid';
        $subject = $isPaid ? 'New Order Paid' : 'New Order Created (Pending Payment)';

        return $this
            ->subject($subject)
            ->view('emails.company_notification', [
                'order'          => $this->order,
                'customerEmail'  => $this->customerEmail,
                'logoUrl'        => $this->logoUrl,
                'details'        => $this->details,
                'equipment'      => $this->equipment,
            ]);
    }
}


