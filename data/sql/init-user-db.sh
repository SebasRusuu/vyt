#!/bin/bash
set -e

echo "Running init-user-db.sh..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'vytdb') THEN
            CREATE DATABASE vytdb;
            GRANT ALL PRIVILEGES ON DATABASE vytdb TO $POSTGRES_USER;
        END IF;
    END
    \$\$;
EOSQL

echo "init-user-db.sh completed successfully."