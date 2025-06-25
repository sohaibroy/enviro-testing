<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Methods;

class OrderDetails extends Model
{
    use HasFactory;

       /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'order_details'; // Your admin table name


    protected $fillable = [
        'method_id',
        'order_id',
        'price',
        'quantity',
        'quantity_pumps',
        'comments',
    ];
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public function method()
    {
        return $this->belongsTo(Methods::class, 'method_id', 'method_id');
    }

    public function orders() {
        return $this->belongsTo(Orders::class, 'order_id', 'order_id');
    }

}
