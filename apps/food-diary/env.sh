#!/bin/sh

sed_script="/tmp/sed_script.sed"
> "$sed_script"

# Ensure the sed script file is cleaned up on exit
trap 'rm -f "$sed_script"' EXIT

# Ensure that the env var prefix is defined
if [ -z "$APP_ENV_PREFIX" ]; then
    echo "APP_ENV_PREFIX is not set. Exiting."
    exit 1
fi

# Extract all environment variables prefixed with $APP_ENV_PREFIX and build the sed expression
env | grep "^$APP_ENV_PREFIX" | while IFS='=' read -r key value; do
    # Escape slashes and other special characters in key and value
    escaped_key=$(printf '%s' "$key" | sed 's/[\/&]/\\&/g')
    escaped_value=$(printf '%s' "$value" | sed 's/[\/&]/\\&/g')
    # Append to sed script file
    echo "s|${escaped_key}|${escaped_value}|g;" >> "$sed_script"
done

# Check if the sed script file was created and is not empty
if [ ! -s "$sed_script" ]; then
    echo "No " $APP_ENV_PREFIX " environment variables found. Exiting with error."
    exit 1
fi

# sed All files
find /usr/share/nginx/html -type f -exec sed -i -f "$sed_script" '{}' +
