<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categories;

class Synonyms extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'synonyms';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey ='synonym_id';

    protected $fillable = [
        'category_id', 
        'synonym',
    ];

    public $timestamps = false;

    public function category()
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }
}
