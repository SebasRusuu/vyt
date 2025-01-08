#!/bin/sh

MASTER_HOST="DB_MASTER"
SLAVE_HOST="DB_REPLICA"
REPLICATION_SLOT="replication_slot"
REPLICATOR_USER="replicator"
REPLICATOR_PASSWORD="replicator_password"
BACKEND_HOST="backend"
BACKEND_PORT="8080"

check_master() {
  pg_isready -h $MASTER_HOST -U postgres
}

promote_slave() {
  docker exec -i $SLAVE_HOST pg_ctl promote
}

resync_master() {
  docker stop $MASTER_HOST
  docker exec -i $SLAVE_HOST pg_basebackup --pgdata=/var/lib/postgresql/data --host=$SLAVE_HOST --port=5432 --username=$REPLICATOR_USER --progress
  docker start $MASTER_HOST
}

restart_master() {
  docker start $MASTER_HOST
}

notify_backend() {
  curl -X GET http://$BACKEND_HOST:$BACKEND_PORT/health-check
}

# Install curl
apk add --no-cache curl

while true; do
  if ! check_master; then
    echo "Master is down! Promoting slave..."
    promote_slave
    echo "Waiting for the old master to come online..."
    while ! check_master; do
      sleep 10
    done
    echo "Resynchronizing master with the new primary..."
    resync_master
    echo "Restarting master..."
    restart_master
    echo "Notifying backend..."
    notify_backend
  fi
  sleep 10
done
