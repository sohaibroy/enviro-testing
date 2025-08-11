<?php

namespace App\Mail;

use App\Models\Orders;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CustomerPoOrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Orders $order;
    public ?string $customerEmail;
    public array $details = [];

    public function __construct(Orders $order, ?string $customerEmail = null)
    {
        $this->order = $order->loadMissing(['equipmentItems']);
        $this->customerEmail = $customerEmail;

        // Build a details array that resolves method/analyte even if od.method_id is null
        $this->details = DB::table('order_details as od')
            ->leftJoin('turn_around_times as t', 't.turn_around_id', '=', 'od.turn_around_id')
            ->leftJoin('methods as m', function ($join) {
                $join->on('m.method_id', '=', 'od.method_id')
                     ->orOn('m.method_id', '=', 't.method_id');
            })
            ->leftJoin('analytes as a', 'a.analyte_id', '=', 'm.analyte_id')
            ->where('od.order_id', $order->order_id)
            ->get([
                'od.required_quantity',
                'od.required_pumps',
                'od.required_media',
                'od.price',
                'od.customer_comment',
                't.turnaround_time',
                'm.method_name',
                'a.analyte_name',
            ])
            ->map(function ($r) {
                return [
                    'analyte_name'      => $r->analyte_name ?? '',
                    'method_name'       => $r->method_name ?? '',
                    'turnaround_time'   => $r->turnaround_time ?? '',
                    'required_quantity' => (int)($r->required_quantity ?? 1),
                    'required_pumps'    => $r->required_pumps,
                    'required_media'    => $r->required_media,
                    'price'             => (float)($r->price ?? 0),
                    'customer_comment'  => $r->customer_comment,
                ];
            })->toArray();
    }

    public function build()
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->subject('Your Order is Confirmed (Pending Payment) — Eurofins EnviroWorks')
            ->view('emails.po_confirmation_html')
            ->with([
                'order'   => $this->order,
                'details' => $this->details, // <-- pass details
                'logoUrl' => 'https://two025-may-enviroworks-mainapplication.onrender.com/img/eurofins-logo.png',
                'portalUrl' => rtrim(config('app.frontend_url') ?: env('FRONTEND_URL'), '/') . '/customer-portal',
            ]);
    }
}

