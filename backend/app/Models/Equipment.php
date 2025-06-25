<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * @var string
     */
    protected $table = 'equipment';

    /**
     * The primary key for the model.
     * @var string
     */
    protected $primaryKey = 'equipment_id';

    protected $fillable = [
        'equipment_name',
        'description',
        'specsheet',
        'daily_cost',
        'available_quantity',
        'is_active',
    ];

    /**
     * Indicates if the table should be timestamped.
     * @var bool
     */
    public $timestamps = false;

    /**
     * An equipment can have many rental details
     * @return HasMany
     */
    public function rentalDetails()
    {
        return $this->hasMany(RentalDetails::class, 'equipment_id', 'equipment_id');
    }

    /**
     * An equipment can have many equipment values
     * @return HasMany
     */
    public function equipmentValues()
    {
        return $this->hasMany(EquipmentValues::class, 'equipment_id', 'equipment_id');
    }

    public function equipmentDetails() {
        return $this->belongsToMany(EquipmentDetails::class, 'equipment_id', 'equipment_id');
    }
}
