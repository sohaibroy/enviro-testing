<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $primaryKey = 'payment_id';

    protected $fillable = [
        'transaction_id',
        'payment_method',
        'payment_status',
        'transaction_reference',
        'amount',
        'created_at',
        'updated_at',
        'card_holder_name',
        'card_last_four',
        'card_expiry_month',
        'card_expiry_year',
        'payment_token'
    ];

    public $timestamps = false;

    public function transaction() {
        return $this->belongsTo(Transactions::class, 'transaction_id', 'transaction_id');
    }
}
