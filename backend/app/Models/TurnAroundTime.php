<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Methods;

class TurnAroundTime extends Model
{
    use HasFactory;

       /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'turn_around_times';
          /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'turn_around_id'; 


    protected $fillable = [
        'turn_around_id',
        'method_id', 
        'price',
        'turnaround_time',
        'is_default_price',
        'is_active'
    ];
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public function method()
    {
        return $this->belongsTo(Methods::class, 'method_id', 'method_id');
    }

}
