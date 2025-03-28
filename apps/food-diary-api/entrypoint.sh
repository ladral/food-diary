#!/bin/sh

if [ "$FOOD_DIARY_API_DB_HOST" = "postgres" ]
then
    echo "Waiting for postgreSQL..."
    echo "$FOOD_DIARY_API_DB_HOST"
    echo "$FOOD_DIARY_API_DB_PORT"

    while ! nc -z "$FOOD_DIARY_API_DB_HOST" "$FOOD_DIARY_API_DB_PORT"; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

echo "Start DB migrations"
python manage.py migrate

echo "Collect static files"
python manage.py collectstatic --no-input --clear

# Create superuser if it doesn't exist
echo "Create superuser"
python manage.py createsuperuser --noinput

exec "$@"
