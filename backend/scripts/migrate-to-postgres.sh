#!/bin/bash
# Database Migration Script - SQLite to PostgreSQL

set -e

echo "=== ChloroMaster Database Migration ==="
echo "SQLite -> PostgreSQL"
echo ""

# Configuration
SQLITE_DB="./chloromaster.db"
PG_HOST="${PG_HOST:-localhost}"
PG_PORT="${PG_PORT:-5432}"
PG_USER="${PG_USER:-chloromaster_admin}"
PG_DB="${PG_DB:-chloromaster}"
export PGPASSWORD="${PG_PASSWORD}"

echo "Source: SQLite ($SQLITE_DB)"
echo "Target: PostgreSQL ($PG_HOST:$PG_PORT/$PG_DB)"
echo ""

# Check if SQLite database exists
if [ ! -f "$SQLITE_DB" ]; then
    echo "Error: SQLite database not found at $SQLITE_DB"
    exit 1
fi

# Check PostgreSQL connection
echo "Testing PostgreSQL connection..."
if ! psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "Error: Cannot connect to PostgreSQL"
    exit 1
fi
echo "✓ PostgreSQL connection successful"
echo ""

# Create PostgreSQL schema
echo "Creating PostgreSQL schema..."
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" <<EOF
-- Drop existing tables if they exist
DROP TABLE IF EXISTS DatasheetRequests CASCADE;
DROP TABLE IF EXISTS ContactSubmissions CASCADE;
DROP TABLE IF EXISTS AdminUsers CASCADE;
DROP TABLE IF EXISTS VisitorAnalytics CASCADE;

-- AdminUsers table
CREATE TABLE IF NOT EXISTS AdminUsers (
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LastLoginAt TIMESTAMP
);

-- ContactSubmissions table
CREATE TABLE IF NOT EXISTS ContactSubmissions (
    Id SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Company VARCHAR(100),
    Industry VARCHAR(50),
    Country VARCHAR(50),
    PostalCode VARCHAR(20),
    Message TEXT NOT NULL,
    ReceiveEmails BOOLEAN NOT NULL DEFAULT FALSE,
    SubmittedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN NOT NULL DEFAULT FALSE,
    IpAddress VARCHAR(45),
    UserAgent TEXT
);

-- DatasheetRequests table
CREATE TABLE IF NOT EXISTS DatasheetRequests (
    Id SERIAL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Company VARCHAR(100),
    Phone VARCHAR(20),
    ProductName VARCHAR(200) NOT NULL,
    RequestedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IpAddress VARCHAR(45),
    IsProcessed BOOLEAN NOT NULL DEFAULT FALSE
);

-- VisitorAnalytics table
CREATE TABLE IF NOT EXISTS VisitorAnalytics (
    Id SERIAL PRIMARY KEY,
    VisitDate DATE NOT NULL,
    PagePath VARCHAR(255) NOT NULL,
    IpAddress VARCHAR(45),
    UserAgent TEXT,
    Referrer VARCHAR(255),
    VisitedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_submitted_at ON ContactSubmissions(SubmittedAt DESC);
CREATE INDEX IF NOT EXISTS idx_contact_is_read ON ContactSubmissions(IsRead);
CREATE INDEX IF NOT EXISTS idx_datasheet_requested_at ON DatasheetRequests(RequestedAt DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_date ON VisitorAnalytics(VisitDate DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_page ON VisitorAnalytics(PagePath);

EOF

echo "✓ PostgreSQL schema created"
echo ""

# Export data from SQLite and import to PostgreSQL
echo "Migrating data..."

# Migrate AdminUsers
echo "  - Migrating AdminUsers..."
sqlite3 "$SQLITE_DB" <<EOF | psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB"
.mode csv
.headers off
SELECT 
    Username,
    PasswordHash,
    Email,
    FullName,
    IsActive,
    CreatedAt,
    LastLoginAt
FROM AdminUsers;
EOF

# Migrate ContactSubmissions
echo "  - Migrating ContactSubmissions..."
sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM ContactSubmissions;" | while read count; do
    if [ "$count" -gt 0 ]; then
        sqlite3 -csv "$SQLITE_DB" "SELECT FirstName, LastName, Email, Phone, Company, Industry, Country, PostalCode, Message, ReceiveEmails, SubmittedAt, IsRead, IpAddress, UserAgent FROM ContactSubmissions;" | \
        psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "COPY ContactSubmissions(FirstName, LastName, Email, Phone, Company, Industry, Country, PostalCode, Message, ReceiveEmails, SubmittedAt, IsRead, IpAddress, UserAgent) FROM STDIN WITH CSV;"
    fi
done

# Migrate DatasheetRequests
echo "  - Migrating DatasheetRequests..."
sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM DatasheetRequests;" | while read count; do
    if [ "$count" -gt 0 ]; then
        sqlite3 -csv "$SQLITE_DB" "SELECT FullName, Email, Company, Phone, ProductName, RequestedAt, IpAddress, IsProcessed FROM DatasheetRequests;" | \
        psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "COPY DatasheetRequests(FullName, Email, Company, Phone, ProductName, RequestedAt, IpAddress, IsProcessed) FROM STDIN WITH CSV;"
    fi
done

# Migrate VisitorAnalytics
echo "  - Migrating VisitorAnalytics..."
sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM VisitorAnalytics;" | while read count; do
    if [ "$count" -gt 0 ]; then
        sqlite3 -csv "$SQLITE_DB" "SELECT VisitDate, PagePath, IpAddress, UserAgent, Referrer, VisitedAt FROM VisitorAnalytics;" | \
        psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "COPY VisitorAnalytics(VisitDate, PagePath, IpAddress, UserAgent, Referrer, VisitedAt) FROM STDIN WITH CSV;"
    fi
done

echo "✓ Data migration completed"
echo ""

# Verify migration
echo "Verifying migration..."
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" <<EOF
SELECT 'AdminUsers' as table_name, COUNT(*) as row_count FROM AdminUsers
UNION ALL
SELECT 'ContactSubmissions', COUNT(*) FROM ContactSubmissions
UNION ALL
SELECT 'DatasheetRequests', COUNT(*) FROM DatasheetRequests
UNION ALL
SELECT 'VisitorAnalytics', COUNT(*) FROM VisitorAnalytics;
EOF

echo ""
echo "=== Migration Complete ==="
echo "Please update your application configuration to use PostgreSQL"
