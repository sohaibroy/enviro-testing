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
    'order_date',
    'subtotal',
    'gst',
    'total_amount',
    'status',
    'payment_status',
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
}
