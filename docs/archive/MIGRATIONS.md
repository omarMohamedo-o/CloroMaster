# Database Migration Guide

Complete guide for managing database migrations in ChloroMaster (Docker + Kubernetes).

## 📊 Overview

ChloroMaster uses SQLite with automated migration scripts that run during container startup. Migrations are:

- ✅ **Automated**: Run in Kubernetes initContainers before app starts
- ✅ **Versioned**: Tracked in `__MigrationHistory` table
- ✅ **Idempotent**: Safe to run multiple times
- ✅ **Fail-safe**: Deployment fails if migration fails

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Kubernetes Pod Lifecycle                                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │ 1. InitContainer: db-migration                  │        │
│  │    - Runs /app/scripts/migrate.sh               │        │
│  │    - Checks __MigrationHistory table            │        │
│  │    - Applies pending *.sql files                │        │
│  │    - Runs /app/scripts/seed.sh (admin user)     │        │
│  │    - Exit 0 = Success, Exit 1 = Failure         │        │
│  └─────────────────────────────────────────────────┘        │
│                           │                                   │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────┐        │
│  │ 2. Main Container: backend-api                  │        │
│  │    - Starts only if initContainer succeeded     │        │
│  │    - Uses migrated database                     │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Persistent Volume (backend-data)                             │
├─────────────────────────────────────────────────────────────┤
│  /data/                                                       │
│    ├── chloromaster.db              (SQLite database)        │
│    └── __MigrationHistory           (Applied migrations)     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Migration File Structure

```
backend/
├── migrations/                  # Migration SQL files
│   ├── 001_initial_schema.sql
│   ├── 002_add_services.sql
│   ├── 003_add_admin_users.sql
│   └── 004_add_indexes.sql
├── scripts/
│   ├── migrate.sh              # Migration script
│   └── seed.sh                 # Data seeding script
└── Dockerfile                   # Copies migrations into image
```

## 📝 Creating Migrations

### 1. Create Migration File

Name format: `{version}_{description}.sql`

```bash
# Example: 005_add_contact_status.sql
cd backend/migrations

cat > 005_add_contact_status.sql <<'EOF'
-- Migration: Add status field to ContactSubmissions
-- Version: 005
-- Author: Your Name
-- Date: 2024-01-15

-- Add status column (if not exists)
ALTER TABLE ContactSubmissions 
ADD COLUMN Status TEXT DEFAULT 'pending' 
CHECK (Status IN ('pending', 'contacted', 'resolved'));

-- Create index for status queries
CREATE INDEX IF NOT EXISTS IX_ContactSubmissions_Status 
ON ContactSubmissions(Status);

-- Update existing records
UPDATE ContactSubmissions 
SET Status = 'pending' 
WHERE Status IS NULL;
EOF
```

### 2. Migration Best Practices

#### ✅ DO

- **Use IF NOT EXISTS**: Makes migrations idempotent

  ```sql
  CREATE TABLE IF NOT EXISTS MyTable (...);
  ALTER TABLE MyTable ADD COLUMN IF NOT EXISTS MyColumn TEXT;
  CREATE INDEX IF NOT EXISTS IX_MyIndex ON MyTable(MyColumn);
  ```

- **Version properly**: Use sequential numbers (001, 002, 003...)

  ```
  001_initial_schema.sql
  002_add_feature_x.sql
  003_add_feature_y.sql
  ```

- **One logical change per migration**: Easier to debug and rollback

  ```sql
  -- GOOD: 005_add_contact_status.sql
  ALTER TABLE ContactSubmissions ADD COLUMN Status TEXT;
  
  -- AVOID: 005_multiple_changes.sql (too many unrelated changes)
  ```

- **Add comments**: Explain why, not just what

  ```sql
  -- Add status tracking for contact submissions
  -- Requested in ticket #123 for customer follow-up workflow
  ALTER TABLE ContactSubmissions ADD COLUMN Status TEXT;
  ```

- **Test rollback strategy**: Document how to undo if needed

  ```sql
  -- To rollback: DROP COLUMN Status (requires table recreation in SQLite)
  ```

#### ❌ DON'T

- **Don't modify existing migrations**: Create new ones instead

  ```bash
  # WRONG: Editing 002_add_services.sql after deployment
  # RIGHT: Create 006_modify_services.sql
  ```

- **Don't use DROP without IF EXISTS**: Causes failures if already dropped

  ```sql
  # WRONG:
  DROP TABLE MyTable;
  
  # RIGHT:
  DROP TABLE IF EXISTS MyTable;
  ```

- **Don't assume data**: Always check before modifying

  ```sql
  # WRONG:
  UPDATE Users SET Role = 'admin' WHERE Id = 1;  -- What if Id 1 doesn't exist?
  
  # RIGHT:
  UPDATE Users SET Role = 'admin' WHERE Id = 1 AND EXISTS(SELECT 1 FROM Users WHERE Id = 1);
  ```

### 3. Testing Migrations Locally

```bash
# 1. Build Docker image with new migration
cd backend
docker build -t chloromaster-backend:test .

# 2. Run migration in test container
docker run --rm \
  -v $(pwd)/test-data:/data \
  chloromaster-backend:test \
  /app/scripts/migrate.sh

# 3. Check migration was applied
sqlite3 test-data/chloromaster.db "SELECT * FROM __MigrationHistory;"

# 4. Verify schema changes
sqlite3 test-data/chloromaster.db ".schema"

# 5. Clean up
rm -rf test-data/
```

## 🚀 Deployment Process

### Kubernetes Deployment (Automated)

```bash
# 1. Build and push new image with migrations
docker build -t your-registry/chloromaster-backend:v1.2.0 backend/
docker push your-registry/chloromaster-backend:v1.2.0

# 2. Update deployment image
kubectl set image deployment/backend \
  backend=your-registry/chloromaster-backend:v1.2.0 \
  -n chloromaster

# 3. Watch migration progress
kubectl logs -f deployment/backend -n chloromaster -c db-migration

# 4. Check migration history
kubectl exec -it deployment/backend -n chloromaster -- \
  sqlite3 /data/chloromaster.db "SELECT * FROM __MigrationHistory ORDER BY AppliedAt DESC;"
```

### Migration Logs

```bash
# View migration initContainer logs
kubectl logs deployment/backend -n chloromaster -c db-migration

# Example output:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Database Migration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ℹ Database: /data/chloromaster.db
# ℹ Migrations: /app/migrations
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ✓ Migration history table ready
# ℹ Found 2 migration files
# ✓ 001_initial_schema.sql - already applied
# ✓ 002_add_services.sql - already applied
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ✓ Migration completed successfully!
```

## 🔧 Migration Script Details

### migrate.sh

Located at `backend/scripts/migrate.sh`:

```bash
#!/bin/bash
# Automated database migration script
# Runs in Kubernetes initContainer before app starts

DB_PATH="/data/chloromaster.db"
MIGRATIONS_PATH="/app/migrations"

# 1. Create __MigrationHistory table
sqlite3 "$DB_PATH" <<EOF
CREATE TABLE IF NOT EXISTS __MigrationHistory (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    MigrationName TEXT NOT NULL UNIQUE,
    AppliedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
EOF

# 2. Apply pending migrations
for migration in $(ls "$MIGRATIONS_PATH"/*.sql | sort); do
    filename=$(basename "$migration")
    
    # Check if already applied
    applied=$(sqlite3 "$DB_PATH" \
        "SELECT COUNT(*) FROM __MigrationHistory WHERE MigrationName = '$filename';")
    
    if [ "$applied" -eq "0" ]; then
        echo "Applying $filename..."
        
        # Apply migration
        sqlite3 "$DB_PATH" < "$migration"
        
        if [ $? -eq 0 ]; then
            # Record in history
            sqlite3 "$DB_PATH" \
                "INSERT INTO __MigrationHistory (MigrationName) VALUES ('$filename');"
            echo "✓ $filename applied"
        else
            echo "✗ Failed to apply $filename"
            exit 1
        fi
    else
        echo "✓ $filename - already applied"
    fi
done

echo "✓ Migration completed successfully!"
```

### seed.sh

Located at `backend/scripts/seed.sh`:

```bash
#!/bin/bash
# Data seeding script (runs after migrations)
# Creates default admin user if doesn't exist

DB_PATH="/data/chloromaster.db"

# Check if admin exists
admin_exists=$(sqlite3 "$DB_PATH" \
    "SELECT COUNT(*) FROM AdminUsers WHERE Username = 'admin';")

if [ "$admin_exists" -eq "0" ]; then
    echo "Creating default admin user..."
    
    sqlite3 "$DB_PATH" <<EOF
INSERT INTO AdminUsers (Username, PasswordHash, CreatedAt)
VALUES (
    'admin',
    'jyEPd6+kpxPGu8Qgz1P8F8YqKdvKj0yYxQZm5E+F8fM=',
    datetime('now')
);
EOF
    
    echo "✓ Admin user created (username: admin, password: Admin@123)"
    echo "⚠ PLEASE CHANGE DEFAULT PASSWORD AFTER FIRST LOGIN!"
else
    echo "✓ Admin user already exists"
fi
```

## 🔍 Troubleshooting

### Migration Failed in Kubernetes

```bash
# 1. Check initContainer logs
kubectl logs deployment/backend -n chloromaster -c db-migration

# 2. Check if pod is stuck in Init state
kubectl get pods -n chloromaster
# NAME                       READY   STATUS     RESTARTS
# backend-6b4f8d9c7b-x8k2p   0/1     Init:0/1   0

# 3. Describe pod for more details
kubectl describe pod <pod-name> -n chloromaster

# 4. Common issues:
# - SQL syntax error in migration file
# - Missing table/column in migration
# - Duplicate migration name
# - Volume mount issues
```

### Manual Migration Recovery

```bash
# 1. Access database directly
kubectl exec -it deployment/backend -n chloromaster -- bash

# 2. Check migration history
sqlite3 /data/chloromaster.db "SELECT * FROM __MigrationHistory;"

# 3. Manually mark migration as applied (if needed)
sqlite3 /data/chloromaster.db \
  "INSERT INTO __MigrationHistory (MigrationName) VALUES ('005_my_migration.sql');"

# 4. Restart deployment
kubectl rollout restart deployment/backend -n chloromaster
```

### Rolling Back Migrations

SQLite doesn't support `ALTER TABLE DROP COLUMN`, so rollbacks require table recreation:

```sql
-- Example: Rolling back 005_add_contact_status.sql

-- 1. Create new table without Status column
CREATE TABLE ContactSubmissions_new (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL,
    Message TEXT NOT NULL,
    SubmittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Copy data (excluding Status)
INSERT INTO ContactSubmissions_new (Id, Name, Email, Message, SubmittedAt)
SELECT Id, Name, Email, Message, SubmittedAt FROM ContactSubmissions;

-- 3. Drop old table
DROP TABLE ContactSubmissions;

-- 4. Rename new table
ALTER TABLE ContactSubmissions_new RENAME TO ContactSubmissions;

-- 5. Remove from migration history
DELETE FROM __MigrationHistory WHERE MigrationName = '005_add_contact_status.sql';
```

**Better approach**: Create forward-only migration:

```sql
-- 006_remove_contact_status.sql
-- Instead of rollback, create new migration to undo changes
-- (Document this in 005 migration comments)
```

## 🛡️ Migration Safety

### Pre-deployment Checklist

- [ ] Migration file follows naming convention
- [ ] SQL uses `IF NOT EXISTS` / `IF EXISTS`
- [ ] Migration tested locally
- [ ] Migration is idempotent (safe to run multiple times)
- [ ] Comments explain why (not just what)
- [ ] Rollback strategy documented
- [ ] No DROP without IF EXISTS
- [ ] No data-destructive changes without backup
- [ ] Sequential version number

### Zero-Downtime Migrations

For production systems with traffic:

1. **Backward-compatible migrations**:

   ```sql
   -- GOOD: Add optional column
   ALTER TABLE Users ADD COLUMN PhoneNumber TEXT;
   
   -- BAD: Add required column (old code will break)
   ALTER TABLE Users ADD COLUMN PhoneNumber TEXT NOT NULL;
   ```

2. **Multi-step approach**:

   ```sql
   -- Step 1: Add nullable column
   -- Deploy v1.1: Code handles null PhoneNumber
   
   -- Step 2: Backfill data
   -- Run after v1.1 is stable
   
   -- Step 3: Add NOT NULL constraint
   -- Deploy v1.2: Code assumes PhoneNumber exists
   ```

3. **Use feature flags**: Enable new features after migration

## 📊 Monitoring

```bash
# Check migration status
kubectl get pods -n chloromaster -w

# View recent migrations
kubectl exec deployment/backend -n chloromaster -- \
  sqlite3 /data/chloromaster.db \
  "SELECT MigrationName, AppliedAt FROM __MigrationHistory ORDER BY AppliedAt DESC LIMIT 5;"

# Database size monitoring
kubectl exec deployment/backend -n chloromaster -- \
  du -h /data/chloromaster.db
```

## 🎯 Summary

✅ **Automated**: Migrations run automatically in Kubernetes initContainers  
✅ **Versioned**: `__MigrationHistory` table tracks applied migrations  
✅ **Safe**: Deployment fails if migration fails (no broken state)  
✅ **Idempotent**: Safe to run multiple times with `IF NOT EXISTS`  
✅ **Tested**: Test locally before deploying  

**Next Steps**:

1. Create migration file in `backend/migrations/`
2. Test locally with Docker
3. Build and push image
4. Deploy to Kubernetes (migration runs automatically)
5. Verify in logs and `__MigrationHistory` table
