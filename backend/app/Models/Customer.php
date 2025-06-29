<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable =
    [
        'order_id',
        'first_name',
        'last_name',
        'company_name',
        'password',
        'email',
        'phone',
        'address',
    ];
}
