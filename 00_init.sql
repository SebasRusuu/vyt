CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_password';
SELECT pg_create_physical_replication_slot('replication_slot');
CREATE EXTENSION IF NOT EXISTS pglogical;
CREATE PUBLICATION my_publication FOR ALL TABLES;

-- Grant replication permissions
GRANT USAGE ON SCHEMA public TO replicator;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replicator;
