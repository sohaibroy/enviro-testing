<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentTypes extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * @var string
     */
    protected $table = 'equipment_types';

    /**
     * The primary key for the model.
     * @var string
     */
    protected $primaryKey = 'equipment_type_id';

    protected $fillable = [
        'equipment_type_id',
        'equipment_type_name',
    ];

    /**
     * Indicates if the table should be timestamped.
     * @var bool
     */
    public $timestamps = false;

    /**
     * Many equipment types can have many equipment attributes.
     * @return BelongsToMany
     */
    public function equipmentAttributes()
    {
        return $this->belongsToMany(EquipmentAttributes::class, 'equipment_type_id', 'equipment_type_id');
    }
}
