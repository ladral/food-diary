#!/bin/sh

if [ "$FOOD_DIARY_API_DB_HOST" = "postgres" ]
then
    echo "Waiting for postgreSQL..."

    while ! nc -z "$FOOD_DIARY_API_DB_HOST" "$FOOD_DIARY_API_DB_PORT"; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

echo "Start DB migrations"
python manage.py migrate

echo "Start seeding food database based on swiss nutritional database"
python manage.py seed_food_categories
python manage.py seed_food_and_synonyms

if [ "$FOOD_DIARY_API_SETUP_DEMO_USER_DATA" = "true" ]
then

    echo "Start seeding demo data for demo user"
    python manage.py seed_demo_user
    python manage.py seed_demo_user_intakes
    python manage.py seed_demo_user_symptoms
    python manage.py seed_demo_user_occurrences
    echo "Inserting demo data seed completed"

fi

echo "Collect static files"
python manage.py collectstatic --no-input --clear

# Create superuser if it doesn't exist
echo "Create superuser"
python manage.py createsuperuser --noinput

exec "$@"
