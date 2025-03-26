#!/bin/bash
set -e

# Load environment variables from .env file
if [ -f /docker-entrypoint-initdb.d/.env ]; then
  export $(cat /docker-entrypoint-initdb.d/.env | xargs)
fi

# Create database if it doesn't exist
if ! psql -U "$POSTGRESQL_USER" -lqt | cut -d \| -f 1 | grep -qw "$KEYCLOAK_DB"; then
  psql -U "$POSTGRESQL_USER" -c "CREATE DATABASE $KEYCLOAK_DB;"
fi

if ! psql -U "$POSTGRESQL_USER" -lqt | cut -d \| -f 1 | grep -qw "$FOOD_DIARY_API_DB"; then
  psql -U "$POSTGRESQL_USER" -c "CREATE DATABASE $FOOD_DIARY_API_DB;"
fi

# Create  user if it doesn't exist
if ! psql -U "$POSTGRESQL_USER" -c "\du" | grep -qw "$KEYCLOAK_DB_USER"; then
  psql -U "$POSTGRESQL_USER" -c "CREATE USER $KEYCLOAK_DB_USER WITH PASSWORD '$KEYCLOAK_DB_PASS';"
fi

# Create a second user if it doesn't exist
if ! psql -U "$POSTGRESQL_USER" -c "\du" | grep -qw "$FOOD_DIARY_API_DB_USER"; then
  psql -U "$POSTGRESQL_USER" -c "CREATE USER $FOOD_DIARY_API_DB_USER WITH PASSWORD '$FOOD_DIARY_API_DB_PASS';"
fi

# Grant privileges to users
psql -U "$POSTGRESQL_USER" -c "GRANT ALL PRIVILEGES ON DATABASE $KEYCLOAK_DB_USER TO $KEYCLOAK_DB;"
psql -U "$POSTGRESQL_USER" -c "GRANT ALL PRIVILEGES ON DATABASE $FOOD_DIARY_API_DB TO $FOOD_DIARY_API_DB_USER;"