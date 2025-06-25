<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Rentals extends Model
{
    use HasFactory;

    /**
     * The table associated with the model
     * @var string
     */
    protected $table = "rentals";

    /**
     * The primary key for the model.
     * @var string
     */
    protected $primaryKey = 'rental_id';

    protected $fillable =[
        'transaction_id',
        'rental_date',
        'subtotal',
        'gst',
        'is_complete',
    ];
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * A rental belongs to an account
     * @return BelongsTo
     */
    public function transaction()
    {
        return $this->belongsTo(Transactions::class, 'transaction_id', 'transaction_id');
    }
    /**
     * A rental can have many rental details
     * @return HasMany
     */
    public function rentalDetails()
    {
        return $this->hasMany(RentalDetails::class, 'rental_id', 'rental_id');
    }

    /**
     * A rental can have many equipments through rental details
     * @return HasManyThrough
     */
    public function equipmentDetails()
    {
        return $this->hasManyThrough(EquipmentDetails::class, RentalDetails::class, 'rental_id', 'serial_id', 'rental_id', 'serial_id');
    }
}
