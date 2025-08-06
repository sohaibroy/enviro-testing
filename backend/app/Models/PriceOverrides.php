<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceOverrides extends Model
{
    use HasFactory;

       /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'price_overrides';
          /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $fillable = [
        'company_id',
        'turn_around_id', 
        'price_override',
    ];
    public $timestamps = false;

}
