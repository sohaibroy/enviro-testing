<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class EquipmentAttributes extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * @var string
     */
    protected $table = 'equipment_attributes';

    protected $primaryKey = 'attribute_id';

    protected $fillable = [
        'attribute_id',
        'equipment_type_id',
        'attribute_name',
        'attribute_data_type',
    ];

    public $timestamps = false;

    /**
     * An equipment attribute has an equipment value
     * @return HasMany
     */
    public function equipmentValues()
    {
        return $this->hasMany(EquipmentValues::class, 'attribute_id', 'attribute_id');
    }

    /**
     * An equipment attribute belongs to an equipment type
     * @return BelongsToMany
     */
    public function equipmentTypes()
    {
        return $this->belongsToMany(EquipmentTypes::class, 'equipment_type_id', 'equipment_type_id');
    }
}
