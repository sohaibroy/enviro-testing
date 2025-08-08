<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    if (app()->environment('production')) {
        config([
            'session.same_site' => 'none',
            'session.secure'    => true,
            'session.domain'    => '.onrender.com',
        ]);
    }
}

}
