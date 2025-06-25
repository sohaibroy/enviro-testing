<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    use HasFactory;

    protected $table = 'transactions';

    protected $primaryKey = 'transaction_id';

    protected $fillable = [
        'account_id',
        'transaction_date',
        'total_amount',
        'subtotal',
        'gst',
        'status',
        'is_active'
    ];

    public $timestamps = false;

    public function accounts() {
        return $this->belongsTo(Accounts::class, 'account_id');
    }

    public function orders() {
        return $this->hasOne(Orders::class, 'transaction_id');
    }

    public function rentals() {
        return $this->hasOne(Rentals::class, 'transaction_id');
    }

    public function payments() {
        return $this->hasOne(Payments::class, 'transaction_id');
    }
}
