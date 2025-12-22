#!/bin/bash
# ==========================================
# Database Migration Script for Kubernetes
# ==========================================

set -e

echo "=========================================="
echo "Database Migration Starting..."
echo "=========================================="

DB_PATH="${DB_PATH:-/app/data/chloromaster.db}"
MIGRATIONS_DIR="/app/migrations"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "Database does not exist. Creating new database..."
    mkdir -p "$(dirname "$DB_PATH")"
fi

# Check if sqlite3 is available
if ! command -v sqlite3 &> /dev/null; then
    echo "Installing sqlite3..."
    apt-get update && apt-get install -y sqlite3
fi

# Create migrations table if not exists
sqlite3 "$DB_PATH" "CREATE TABLE IF NOT EXISTS __MigrationHistory (
    MigrationId TEXT PRIMARY KEY,
    AppliedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);"

# Function to check if migration was applied
is_migration_applied() {
    local migration_id=$1
    local count=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM __MigrationHistory WHERE MigrationId='$migration_id';")
    [ "$count" -gt 0 ]
}

# Function to apply migration
apply_migration() {
    local migration_file=$1
    local migration_id=$(basename "$migration_file" .sql)
    
    if is_migration_applied "$migration_id"; then
        echo "✓ Migration $migration_id already applied, skipping..."
        return 0
    fi
    
    echo "→ Applying migration: $migration_id"
    
    # Apply the migration
    if sqlite3 "$DB_PATH" < "$migration_file"; then
        # Record the migration
        sqlite3 "$DB_PATH" "INSERT INTO __MigrationHistory (MigrationId) VALUES ('$migration_id');"
        echo "✓ Migration $migration_id applied successfully"
    else
        echo "✗ Migration $migration_id failed!"
        exit 1
    fi
}

# Apply all migrations in order
if [ -d "$MIGRATIONS_DIR" ]; then
    echo "Checking for pending migrations..."
    
    for migration_file in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$migration_file" ]; then
            apply_migration "$migration_file"
        fi
    done
else
    echo "No migrations directory found at $MIGRATIONS_DIR"
fi

echo ""
echo "=========================================="
echo "Database Migration Complete!"
echo "=========================================="

# Show applied migrations
echo ""
echo "Applied migrations:"
sqlite3 "$DB_PATH" "SELECT MigrationId, AppliedAt FROM __MigrationHistory ORDER BY AppliedAt;"

exit 0
