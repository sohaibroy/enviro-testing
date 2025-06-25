#!/bin/sh

php artisan config:clear
php artisan route:clear
php artisan view:clear

exec apache2-foreground