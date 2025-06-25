<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Accounts;

class Companies extends Model
{
    use HasFactory;

    protected $table ='companies';

    protected $primaryKey ='company_id';

    protected $fillable =[
        'company_id',
        'company_name',
        'company_phone',
        'address',
        'is_active',
    ];
    public $timestamps = false;

    public function accounts()
    {
        $this->hasMany(Accounts::class, 'company_id', 'company_id');
    }
}
