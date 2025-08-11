<?php

namespace App\Mail;

use App\Models\Orders;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

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
        // Still load account/company for header fields
        $this->order = $order->loadMissing(['account.company']);

        $this->customerEmail = $customerEmail
            ?: optional($this->order->account)->email
            ?: '';

        $this->logoUrl = 'https://two025-may-enviroworks-mainapplication.onrender.com/img/eurofins-logo.png';

        //Flatten analytes with a DB join (never rely on relations inside Blade)
        $this->details = DB::table('order_details as od')
            ->leftJoin('methods as m', 'm.method_id', '=', 'od.method_id')
            ->leftJoin('analytes as a', 'a.analyte_id', '=', 'od.analyte_id')
            ->leftJoin('turn_around_times as t', 't.turn_around_id', '=', 'od.turn_around_id')
            ->where('od.order_id', $this->order->order_id)
            ->get([
                'od.required_quantity',
                'od.required_pumps',
                'od.required_media',
                'od.price',
                'od.customer_comment',
                'a.analyte_name',
                'm.method_name',
                DB::raw("COALESCE(t.turn_around_name, t.turnaround_time) as turnaround"),
            ])
            ->map(function ($r) {
                return [
                    'analyte_name'      => $r->analyte_name ?? 'Unknown',
                    'method_name'       => $r->method_name ?? 'Unknown',
                    'turnaround'        => $r->turnaround ?? '—',
                    'required_quantity' => (int)($r->required_quantity ?? 1),
                    'required_pumps'    => $r->required_pumps,
                    'required_media'    => $r->required_media,
                    'price'             => (float)($r->price ?? 0),
                    'customer_comment'  => $r->customer_comment,
                ];
            })
            ->toArray();

        //Flatten equipment (simple select)
        $this->equipment = DB::table('order_equipment')
            ->where('order_id', $this->order->order_id)
            ->get([
                'equipment_name',
                'category',
                'start_date',
                'return_date',
                'quantity',
                'daily_cost',
            ])
            ->map(function ($r) {
                return [
                    'equipment_name' => $r->equipment_name ?? '',
                    'category'       => $r->category ?? '',
                    'start_date'     => $r->start_date,
                    'return_date'    => $r->return_date,
                    'quantity'       => (int)($r->quantity ?? 0),
                    'daily_cost'     => (float)($r->daily_cost ?? 0),
                ];
            })
            ->toArray();
    }

    public function build()
    {
        $isPaid  = strtolower((string)($this->order->payment_status ?? '')) === 'paid';
        $subject = $isPaid ? 'New Order Paid' : 'New Order Created (Pending Payment)';

        return $this
            ->subject($subject)
            ->view('emails.company_notification', [
                'order'         => $this->order,
                'customerEmail' => $this->customerEmail,
                'logoUrl'       => $this->logoUrl,
                'details'       => $this->details,   // <- array with names already resolved
                'equipment'     => $this->equipment, // <- array
            ]);
    }
}


