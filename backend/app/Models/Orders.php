<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $primaryKey = 'order_id';
    public $timestamps = false;

protected $fillable = [
    'transaction_id',
    'account_id',
    'order_date',
    'subtotal',
    'gst',
    'total_amount',
    'status',
    'payment_status',
    'payment_method',
    'po_number',
    'payment_received_at',
    'payment_reference',
    'stripe_session_id',
    'stripe_payment_intent_id',
    'created_at',
    'updated_at'
];

    public function transactions()
    {
        return $this->belongsTo(Transactions::class, 'transaction_id', 'transaction_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetails::class, 'order_id', 'order_id');
    }

    public function equipmentItems()
    {
        return $this->hasMany(OrderEquipment::class, 'order_id', 'order_id');
    }

    public function account()
{
    return $this->belongsTo(\App\Models\Accounts::class, 'account_id', 'account_id');
}
}
