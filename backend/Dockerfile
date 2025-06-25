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
# COPY . /var/www/html

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

FROM php:8.2-apache

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl && \
    docker-php-ext-install pdo_mysql zip

# Enable Apache rewrite module
RUN a2enmod rewrite

# Set Apache document root to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf && \
    sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copy Laravel app
COPY ./ /var/www/html

# Delete stale route cache
RUN rm -f bootstrap/cache/routes-*.php

# Set working directory
WORKDIR /var/www/html

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# ✅ Entry script to clear caches then start apache
COPY ./start.sh /start.sh
RUN chmod +x /start.sh

RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan config:cache

CMD ["apache2-foreground"]