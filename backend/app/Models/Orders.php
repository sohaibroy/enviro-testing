<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Accounts;
use App\Models\Analytes;

class Orders extends Model
{
    use HasFactory;

       /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'orders';
          /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'order_id';

    protected $fillable =[
        'order_id',
        'transaction_id',
        'order_date',
        'subtotal',
        'gst',
        'total_amount',
        'is_active',
    ];
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public function tests()
    {
        return $this->belongsToMany(Tests::class, 'order_details', 'order_id', 'analyte_id')
            ->withPivot('quantity');
    }

    public function transactions() {
        return $this->belongsTo(Transactions::class, 'transaction_id', 'transaction_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetails::class, 'order_id', 'order_id');
    }
}
