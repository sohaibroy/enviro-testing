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

# Install dependencies
RUN apt-get update && apt-get install -y \
    git zip unzip curl libzip-dev && \
    docker-php-ext-install pdo_mysql zip && \
    a2enmod rewrite

# Set document root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf && \
    sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set working dir
WORKDIR /var/www/html

# Only COPY if building on Render (not needed for local bind mount)
#COPY backend/. /var/www/html

ARG BUILD_ENV=local

# Only copy files in production (like on Render)
COPY backend/. /var/www/html
RUN if [ "$BUILD_ENV" = "production" ]; then \
      echo "Installing dependencies for production build..." && \
      composer install --no-dev --optimize-autoloader || true; \
    fi

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1

# Safely install dependencies
RUN if [ -f "composer.json" ]; then \
      composer install --no-dev --optimize-autoloader || true; \
    fi

# Create necessary dirs and set permissions
RUN mkdir -p storage bootstrap/cache public && \
    chown -R www-data:www-data storage bootstrap/cache public || true

    # Ensure proper permissions
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Clear Laravel caches and create storage symlink if Artisan exists
RUN if [ -f artisan ]; then \
      php artisan config:clear || true && \
      php artisan route:clear || true && \
      php artisan view:clear || true && \
      php artisan storage:link || true; \
    fi

CMD ["apache2-foreground"]