#!/bin/bash

docker compose down

docker compose up -d

cd backend/

docker compose exec laravel-app composer install

docker compose exec laravel-app composer dump-autoload

docker compose exec laravel-app php artisan config:cache
