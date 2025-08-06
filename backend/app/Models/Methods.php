<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Analytes;
use App\Models\TurnAroundTime;

class Methods extends Model
{
    use HasFactory;

   /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'methods'; // Your admin table name
          /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'method_id';


    protected $fillable =
    [
        'method_id',
        'analyte_id',
        'method_name',
        'matrix',
        'media',
        'measurement',
        'sample_rate',
        'limit_of_quantification',
        'general_comments',
    ];
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public function test()
    {
        return $this->belongsTo(Analytes::class, 'analyte_id', 'analyte_id');
    }

    // public function turnaroundtime()
    // {
    //     return $this->hasMany(TurnAroundTime::class);
    // }

public function turnaroundtime()
{
    return $this->hasMany(TurnAroundTime::class, 'method_id', 'method_id');
}

    public function getTurnAroundTimeByMethodId($method_id)
    {
        $methods = TurnAroundTime::where('method_id', $method_id)->get();
        return response()->json($methods);
    }

    //ADDED THIS
    public function analyte() {
    return $this->belongsTo(\App\Models\Analytes::class, 'analyte_id', 'analyte_id');
}



}
