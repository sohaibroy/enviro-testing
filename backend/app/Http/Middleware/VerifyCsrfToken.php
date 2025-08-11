<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
    'api/account/update/*', //disabling CSRF check for all update accounts
    'api/orders/create',
    'api/equipment/return',
    'api/order/update/*',
    'api/orders',
    'api/transactions/create',
    'api/create-checkout-session',
    'api/send-contact-email',
    'api/accounts/*/assign-company',
    'api/accounts/*/remove-company',
    'api/turnaroundtimes/*',
    'api/method/update/*', 
    'api/method/delete/*',
    'api/category/create/*',
    'api/synonym/create/*',
    'api/synonym/delete/*',
    'api/login/account',
    'api/login/admin',
    'api/company/*',
    'api/companies',         
    'api/equipment/*',
    'api/priceoverride/*',
    'api/analyte/*',
    'api/method/*',
    'api/category/*',
    'api/synonym/*',
    'api/equipment-data/*',
    'api/equipment-types/*',
    'api/signup/*',
    'api/orders/*',
    ];
}
