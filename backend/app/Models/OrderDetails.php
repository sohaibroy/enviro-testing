<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetails extends Model
{
    use HasFactory;

    protected $table = 'order_details';
    public $timestamps = true;

    protected $fillable = [
        'order_id',
        'method_id',
    'analyte_id',
        'turn_around_id',
        'price',
        'required_quantity',
        'required_pumps',
        'required_media',
        'customer_comment',
    ];

    public function orders()
    {
        return $this->belongsTo(Orders::class, 'order_id', 'order_id');
    }

    public function turnAround()
    {
        return $this->belongsTo(TurnAroundTime::class, 'turn_around_id', 'turn_around_id');
    }

    //ADDED THIS 

    public function method() {
    return $this->belongsTo(\App\Models\Methods::class, 'method_id', 'method_id');
}

}
