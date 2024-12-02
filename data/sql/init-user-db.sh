#!/bin/bash
set -e

echo "Running init-user-db.sh..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE vytdb;
    GRANT ALL PRIVILEGES ON DATABASE vytdb TO $POSTGRES_USER;
EOSQL

echo "init-user-db.sh completed successfully."
