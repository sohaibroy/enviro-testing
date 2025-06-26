# FROM php:8.2-apache

# # Install dependencies
# RUN apt-get update && \
#     apt-get install -y \
#     libzip-dev \
#     zip

# RUN echo "ServerName laravel-app.local" >> /etc/apache2/apache2.conf

# # Enable mod_rewrite
# RUN a2enmod rewrite

# # Install PHP extensions
# RUN docker-php-ext-install pdo_mysql zip

# ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
# RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
# RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# # Copy the application code
# COPY backend/. /var/www/html

# # Set the working directory
# WORKDIR /var/www/html

# # Install composer
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# # Install project dependencies
# RUN composer install
# RUN composer dump-autoload

# #Cache Configuration
# RUN php artisan config:cache

# # Set permissions
# RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Dockerfile (in root of repo, assumes Laravel in backend/)

FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git zip unzip curl libzip-dev && \
    docker-php-ext-install pdo_mysql zip && \
    a2enmod rewrite

# Set Apache document root to Laravel public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf && \
    sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set working directory
WORKDIR /var/www/html

# Copy Laravel source *after* setting working directory
COPY . .

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Build argument for environment (use with docker-compose `args`)
ARG APP_ENV=local

# Install dependencies based on environment
RUN if [ "$APP_ENV" = "production" ]; then \
      composer install --no-dev --optimize-autoloader; \
    else \
      composer install; \
    fi

# Ensure folders exist before chown
RUN mkdir -p storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Clear config caches to avoid stale state
RUN php artisan config:clear && php artisan route:clear && php artisan view:clear

# Default command
CMD ["apache2-foreground"]