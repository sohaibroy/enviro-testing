<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Orders;
use App\Models\Companies;

/**
 * Class Customer
 *
 * @package App\Models
 */
class Accounts extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

       /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'accounts';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'account_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company_id',
        'first_name',
        'last_name',
        'password',
        'email',
        'phone',
        'street_address',
        'city',
        'province',
        'postal_code',
        'country',
        'credit_card',
        'is_active',
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', // Hide password by default
        'remember_token',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    public function company()
    {
        return $this->belongsTo(Companies::class, 'company_id', 'company_id');
    }
    
    public function transactions()
    {
        return $this->hasMany(Rentals::class, 'transaction_id', 'transaction_id');
    }

    public function orders() {
        return $this->hasManyThrough(Orders::class, Transactions::class, 'account_id', 'transaction_id', 'account_id', 'transaction_id');
    }

    public function rentals() {
        return $this->hasManyThrough(Rentals::class, Transactions::class, 'account_id', 'transaction_id', 'account_id', 'transaction_id');
    }
    public function getAuthIdentifierName()
{
    return 'account_id';
}}
