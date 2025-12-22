#!/bin/bash
# ==========================================
# Database Seed Script for Admin User
# ==========================================

set -e

DB_PATH="${DB_PATH:-/app/data/chloromaster.db}"

echo "Checking for admin user..."

# Check if admin user exists
ADMIN_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM AdminUsers WHERE Username='admin';" 2>/dev/null || echo "0")

if [ "$ADMIN_COUNT" -eq 0 ]; then
    echo "Creating default admin user..."
    
    # Password hash for "Admin@123" with salt "ChloroMasterSalt2025"
    # Generated with: echo -n "Admin@123ChloroMasterSalt2025" | sha256sum | base64
    ADMIN_PASS_HASH="jyEPd6+kpxPGu8Qgz1P8F8YqKdvKj0yYxQZm5E+F8fM="
    
    sqlite3 "$DB_PATH" "INSERT INTO AdminUsers (Username, PasswordHash, Email, FullName, IsActive, CreatedAt)
    VALUES (
        'admin',
        '$ADMIN_PASS_HASH',
        'admin@chloromaster.com',
        'Administrator',
        1,
        datetime('now')
    );"
    
    echo "✓ Default admin user created"
    echo "  Username: admin"
    echo "  Password: Admin@123"
    echo "  ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!"
else
    echo "✓ Admin user already exists"
fi

exit 0
