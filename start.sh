#!/bin/sh

# Set ownership of the volume mount point before starting the app
chown -R django:django /data

# Run migrations to create the database file
gosu django python manage.py migrate

# Execute the main application command as the non-root 'django' user
exec gosu django gunicorn project.wsgi:application --bind 0.0.0.0:8000
