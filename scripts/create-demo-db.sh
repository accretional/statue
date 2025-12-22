#!/usr/bin/env bash
set -e

DB_PATH="static/demo.db"

rm -f "$DB_PATH"

sqlite3 "$DB_PATH" <<EOF
CREATE TABLE users (
  id INTEGER,
  name TEXT,
  role TEXT
);

INSERT INTO users VALUES
  (1, 'Sam', 'Admin'),
  (2, 'Oggy', 'User'),
  (3, 'Jack', 'Editor'),
  (4, 'Olivia', 'Moderator'),
  (5, 'Evee', 'Guest');
EOF

echo "Demo database created at $DB_PATH"