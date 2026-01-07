#!/bin/bash
# Initialize PostgreSQL database with schema

set -e

echo "=== ChloroMaster PostgreSQL Initialization ==="

# Get PostgreSQL pod name
POSTGRES_POD=$(kubectl get pods -n chloromaster -l app=postgres -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POSTGRES_POD" ]; then
    echo "Error: PostgreSQL pod not found"
    exit 1
fi

echo "PostgreSQL Pod: $POSTGRES_POD"
echo ""

# Create database schema
echo "Creating database schema..."
kubectl exec -n chloromaster "$POSTGRES_POD" -- psql -U chloromaster_admin -d chloromaster <<'EOF'
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submitted_at ON ContactSubmissions(SubmittedAt DESC);
CREATE INDEX IF NOT EXISTS idx_contact_is_read ON ContactSubmissions(IsRead);
CREATE INDEX IF NOT EXISTS idx_datasheet_requested_at ON DatasheetRequests(RequestedAt DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_date ON VisitorAnalytics(VisitDate DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_page ON VisitorAnalytics(PagePath);

-- Insert default admin user
INSERT INTO AdminUsers (Username, PasswordHash, Email, FullName, IsActive, CreatedAt)
VALUES ('admin', 'Wa7a0iBavGWL5pxybfsUTiGttmqoWNTDEfCMEjb+7ek=', 'admin@chloromaster.com', 'Administrator', true, CURRENT_TIMESTAMP)
ON CONFLICT (Username) DO NOTHING;

EOF

echo "✓ Database schema created"
echo ""

# Verify tables
echo "Verifying tables..."
kubectl exec -n chloromaster "$POSTGRES_POD" -- psql -U chloromaster_admin -d chloromaster -c "\dt"

echo ""
echo "=== Initialization Complete ==="
echo ""
echo "Database: chloromaster"
echo "Tables: AdminUsers, ContactSubmissions, DatasheetRequests, VisitorAnalytics"
echo "Admin user: admin"
echo "Password: aK2lQ8tXeVt59hkHkU4bJA"
