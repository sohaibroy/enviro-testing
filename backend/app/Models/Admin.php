<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

      /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'admin_id';


    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'admins'; // Your admin table name

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getRememberTokenName()
    {
        return 'token'; // Name of the token column in your remember_tokens table
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
