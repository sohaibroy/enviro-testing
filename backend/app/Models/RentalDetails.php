<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RentalDetails extends Model
{
    use HasFactory;

    /**
     * The table associated with the model
     * @var string
     */
    protected $table = 'rental_details';

    protected $fillable = [
        'rental_id',
        'equipment_id',
        'start_date',
        'end_date', // Expected return date (when the rental SHOULD be returned)
        'return_date', // Actual return date (when the rental IS returned)
        'quantity',
        'price',
        'condition',
        'is_active',
    ];

    public $timestamps = false;

    /**
     * A rental detail belongs to a rental
     * @return BelongsTo
     */
    public function rental()
    {
        return $this->belongsTo(Rentals::class, 'rental_id', 'rental_id');
    }

    /**
     * A rental detail belongs to an equipment
     * @return HasOne
     */
    public function equipmentDetails()
     {
        return $this->hasOne(EquipmentDetails::class, 'serial_id', 'serial_id');
    }

    public function equipment(){
        return $this->hasOneThrough(Equipment::class, EquipmentDetails::class, 'serial_id', 'equipment_id', 'serial_id', 'equipment_id');
    }
}
