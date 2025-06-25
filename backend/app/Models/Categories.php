<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Analytes;

class Categories extends Model
{
    use HasFactory;

       /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'categories'; 

    protected $fillable =
    [
        'category_id',
        'analyte_id',
        'category_name',
        'technique',
        'is_active',
    ];
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public function analyte()
    {
        return $this->belongsTo(Analytes::class);
    }
}
