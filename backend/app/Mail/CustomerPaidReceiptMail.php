<?php

namespace App\Mail;

use App\Models\Orders;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CustomerPaidReceiptMail extends Mailable
{
    use Queueable, SerializesModels;

    public Orders $order;
    public string $logoUrl;
    public string $portalUrl;

    public array $details = [];
    public array $equipment = [];

    public function __construct(Orders $order)
    {
        $this->order = $order;
        $this->logoUrl   = 'https://two025-may-enviroworks-mainapplication.onrender.com/img/eurofins-logo.png';
        $this->portalUrl = rtrim(env('FRONTEND_URL', config('app.url')), '/') . '/customer-portal';

        // Join methods using od.method_id OR t.method_id so PO orders resolve names
        $this->details = DB::table('order_details as od')
            ->leftJoin('turn_around_times as t', 't.turn_around_id', '=', 'od.turn_around_id')
            ->leftJoin('methods as m', function ($join) {
                $join->on('m.method_id', '=', 'od.method_id')
                     ->orOn('m.method_id', '=', 't.method_id');
            })
            ->leftJoin('analytes as a', 'a.analyte_id', '=', 'm.analyte_id')
            ->where('od.order_id', $this->order->order_id)
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

        $this->equipment = DB::table('order_equipment')
            ->where('order_id', $order->order_id)
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
            })->toArray();
    }

    public function build()
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->subject('Payment Received — Order #'.$this->order->order_id)
            ->view('emails.paid_receipt_html')
            ->with([
                'order'     => $this->order,
                'details'   => $this->details,
                'equipment' => $this->equipment,
                'logoUrl'   => $this->logoUrl,
                'portalUrl' => $this->portalUrl,
            ]);
    }
}


