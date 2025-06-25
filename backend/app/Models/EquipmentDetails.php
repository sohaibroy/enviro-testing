<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentDetails extends Model
{
    use HasFactory;

    protected $table = 'equipment_details';

    protected $primaryKey = 'serial_id';

    protected $fillable = [
        'serial_number',
        'equipment_id',
        'status'
    ];

    protected $timestamps = false;
}
