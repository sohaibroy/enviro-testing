<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentValues extends Model
{
    use HasFactory;

    protected $table = 'equipment_values';

    protected $fillable = [
        'equipment_id',
        'attribute_id',
        'attribute_value',
    ];

    public $timestamps = false;

    /**
     * An equipment value belongs to an equipment
     * @return BelongsTo
     */
    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment_id', 'equipment_id');
    }

    /**
     * An equipment value belongs to an equipment attribute
     * @return BelongsTo
     */
    public function equipmentAttributes()
    {
        return $this->belongsTo(EquipmentAttributes::class, 'attribute_id', 'attribute_id');
    }
}
