<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tests extends Model
{
//    TODO: Figure out what the hell this is for
//          because the name is not descriptive enough
//          and the implementations are irregular/unclear
    use HasFactory;
    protected $fillable =[
        'test_id',
        'method_id',
        'category_id',
        'test_name',
        'created_at',
        'updated_at',
    ];
}
