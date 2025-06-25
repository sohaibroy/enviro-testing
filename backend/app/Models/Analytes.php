<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Orders;
use App\Models\Categories;
use App\Models\Methods;

class Analytes extends Model
{
    use HasFactory;

       /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'analytes';
          /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'analyte_id';

    protected $fillable =[
        'analyte_id',
        'analyte_name',
        'cas_number',
    ];
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    

    // Defining the relationships
    public function orders()// function indicates that there are many orders with many test-> pointing to our conjunction table 'order_details'
    {
        return $this->belongsToMany(Orders::class, 'order_details', 'analyte_id', 'order_id')
            ->withPivot('quantity');
    }

    public function categories()
    {
        return $this->hasMany(Categories::class);
    }

    public function methods()
    {
        return $this->hasMany(Methods::class);
    }

    public function getMethodsByAnalyteId($analyte_id)
    {
        $methods = Methods::where('analyte_id', $analyte_id)->get();
        return response()->json($methods);
    }
}
