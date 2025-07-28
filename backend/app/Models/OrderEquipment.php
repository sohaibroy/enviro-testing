<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderEquipment extends Model
{
    protected $table = 'order_equipment';

    protected $fillable = [
        'order_id',
        'equipment_name',
        'category',
        'start_date',
        'return_date',
        'quantity',
        'daily_cost',
    ];

    public $timestamps = true;
}