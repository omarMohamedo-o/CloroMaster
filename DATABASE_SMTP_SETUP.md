# Database & SMTP Configuration Guide

## ✅ Setup Complete

### PostgreSQL Database

**Status:** ✅ Running in Kubernetes  
**Version:** PostgreSQL 16.11  
**Storage:** 10Gi Persistent Volume

### MailHog SMTP Server

**Status:** ✅ Running in Kubernetes  
**Purpose:** Development/Staging email testing  
**Web UI:** Port 8025, SMTP Port: 1025

---

## 📊 PostgreSQL Configuration

### Connection Details

**Kubernetes Service:**

- Host: `postgres` (within cluster)
- Port: `5432`
- Database: `chloromaster`
- Username: `chloromaster_admin`
- Password: Stored in `k8s/02-secrets.yaml` (DATABASE_URL)

**Connection Strings:**

```bash
# Kubernetes (within cluster)
postgresql://chloromaster_admin:ChloroMaster_DB_Secure_Pass_2026_Change_In_Production@postgres:5432/chloromaster

# Local development (via port-forward)
postgresql://chloromaster_admin:ChloroMaster_DB_Secure_Pass_2026_Change_In_Production@localhost:5433/chloromaster
```

### Database Schema

**Tables Created:**

1. **AdminUsers** - Administrator accounts
   - Id (SERIAL PRIMARY KEY)
   - Username, PasswordHash, Email, FullName
   - IsActive, CreatedAt, LastLoginAt

2. **ContactSubmissions** - Contact form submissions
   - Id, FirstName, LastName, Email, Phone
   - Company, Industry, Country, PostalCode
   - Message, ReceiveEmails, SubmittedAt
   - IsRead, IpAddress, UserAgent

3. **DatasheetRequests** - Product datasheet requests
   - Id, FullName, Email, Company, Phone
   - ProductName, RequestedAt, IpAddress
   - IsProcessed

4. **VisitorAnalytics** - Website visitor tracking
   - Id, VisitDate, PagePath
   - IpAddress, UserAgent, Referrer
   - VisitedAt

**Indexes:**

- idx_contact_submitted_at - Fast querying of recent submissions
- idx_contact_is_read - Filter read/unread submissions
- idx_datasheet_requested_at - Recent datasheet requests
- idx_visitor_date - Analytics by date
- idx_visitor_page - Analytics by page

### Default Admin User

```
Username: admin
Password: aK2lQ8tXeVt59hkHkU4bJA
Email: admin@chloromaster.com
```

---

## 🔧 Access & Management

### Local Access (Port Forwarding)

**PostgreSQL:**

```bash
# Start port-forward
kubectl port-forward -n chloromaster postgres-0 5433:5432

# Connect with psql
PGPASSWORD="ChloroMaster_DB_Secure_Pass_2026_Change_In_Production" \
psql -h localhost -p 5433 -U chloromaster_admin -d chloromaster

# Common commands
\dt                    # List tables
\d "AdminUsers"        # Describe table
\du                    # List users
\l                     # List databases
SELECT version();      # PostgreSQL version
```

**Connect from Application:**

```bash
# Environment variable (already configured in k8s/02-secrets.yaml)
DATABASE_URL=postgresql://chloromaster_admin:ChloroMaster_DB_Secure_Pass_2026_Change_In_Production@postgres:5432/chloromaster
```

### Database Operations

**Backup Database:**

```bash
# Backup to file
kubectl exec -n chloromaster postgres-0 -- pg_dump -U chloromaster_admin -d chloromaster > backup-$(date +%Y%m%d).sql

# Backup with compression
kubectl exec -n chloromaster postgres-0 -- pg_dump -U chloromaster_admin -d chloromaster | gzip > backup-$(date +%Y%m%d).sql.gz
```

**Restore Database:**

```bash
# Restore from backup
cat backup.sql | kubectl exec -i -n chloromaster postgres-0 -- psql -U chloromaster_admin -d chloromaster

# Restore from compressed backup
gunzip -c backup.sql.gz | kubectl exec -i -n chloromaster postgres-0 -- psql -U chloromaster_admin -d chloromaster
```

**Migration from SQLite:**

```bash
# Run migration script
cd backend/scripts
./migrate-to-postgres.sh

# Manual migration (if needed)
export PG_HOST=localhost
export PG_PORT=5433
export PG_USER=chloromaster_admin
export PG_DB=chloromaster
export PG_PASSWORD="ChloroMaster_DB_Secure_Pass_2026_Change_In_Production"
./migrate-to-postgres.sh
```

**Query Examples:**

```sql
-- Count records
SELECT 
    'AdminUsers' as table_name, COUNT(*) as count FROM "AdminUsers"
UNION ALL
SELECT 'ContactSubmissions', COUNT(*) FROM "ContactSubmissions"
UNION ALL
SELECT 'DatasheetRequests', COUNT(*) FROM "DatasheetRequests"
UNION ALL
SELECT 'VisitorAnalytics', COUNT(*) FROM "VisitorAnalytics";

-- Recent contact submissions
SELECT "Id", "FirstName", "LastName", "Email", "SubmittedAt", "IsRead"
FROM "ContactSubmissions"
ORDER BY "SubmittedAt" DESC
LIMIT 10;

-- Unread submissions
SELECT COUNT(*) as unread_count
FROM "ContactSubmissions"
WHERE "IsRead" = false;

-- Daily visitor analytics
SELECT "VisitDate", COUNT(*) as visits
FROM "VisitorAnalytics"
GROUP BY "VisitDate"
ORDER BY "VisitDate" DESC
LIMIT 30;
```

---

## 📧 SMTP Configuration

### MailHog (Development/Staging)

**Service Details:**

- SMTP Port: `1025` (within cluster)
- Web UI Port: `8025`
- Service Name: `mailhog`

**Access Web UI:**

```bash
# Port-forward to local machine
kubectl port-forward -n chloromaster svc/mailhog 8025:8025

# Open in browser
http://localhost:8025
```

**SMTP Configuration (Development):**

```yaml
SMTP_HOST: mailhog
SMTP_PORT: 1025
SMTP_USE_SSL: false
SMTP_USERNAME: (empty)
SMTP_PASSWORD: (empty)
SMTP_FROM_EMAIL: chloromaster365@gmail.com
SMTP_FROM_NAME: ChloroMaster
```

**Testing Email:**

```bash
# Send test email (requires swaks or similar)
swaks --to test@example.com \
      --from noreply@chloromaster.com \
      --server localhost:1025 \
      --body "Test email from ChloroMaster"

# View in MailHog UI
http://localhost:8025
```

### Production SMTP (SendGrid Example)

**Update k8s/02-secrets.yaml:**

```yaml
stringData:
  # Switch to production SMTP
  SMTP_HOST: smtp.sendgrid.net
  SMTP_PORT: "587"
  SMTP_USERNAME: apikey
  SMTP_PASSWORD: YOUR_SENDGRID_API_KEY_HERE
  SMTP_USE_SSL: "true"
   SMTP_FROM_EMAIL: chloromaster365@gmail.com
  SMTP_FROM_NAME: ChloroMaster
```

**Alternative Providers:**

**Gmail:**

```yaml
SMTP_HOST: smtp.gmail.com
SMTP_PORT: "587"
SMTP_USERNAME: your-email@gmail.com
SMTP_PASSWORD: your-app-password  # Generate at https://myaccount.google.com/apppasswords
SMTP_USE_SSL: "true"
```

**AWS SES:**

```yaml
SMTP_HOST: email-smtp.us-east-1.amazonaws.com
SMTP_PORT: "587"
SMTP_USERNAME: YOUR_AWS_SES_SMTP_USERNAME
SMTP_PASSWORD: YOUR_AWS_SES_SMTP_PASSWORD
SMTP_USE_SSL: "true"
```

**Mailgun:**

```yaml
SMTP_HOST: smtp.mailgun.org
SMTP_PORT: "587"
SMTP_USERNAME: postmaster@yourdomain.com
SMTP_PASSWORD: YOUR_MAILGUN_SMTP_PASSWORD
SMTP_USE_SSL: "true"
```

**Apply Changes:**

```bash
# Update secrets
kubectl apply -f k8s/02-secrets.yaml

# Restart backend to pick up new SMTP settings
kubectl rollout restart deployment/backend -n chloromaster
```

---

## 🔄 Backend Configuration

### Automatic Database Detection

The backend automatically detects the database type based on the connection string:

```csharp
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? "Data Source=chloromaster.db";

var usePostgres = connectionString.StartsWith("postgresql://") || 
                  connectionString.Contains("Host=") ||
                  connectionString.Contains("Server=");

if (usePostgres) {
    options.UseNpgsql(connectionString);
} else {
    options.UseSqlite(connectionString);
}
```

**Environment Variable Priority:**

1. `DATABASE_URL` (PostgreSQL connection string)
2. `DefaultConnection` (from appsettings.json)
3. Fallback to SQLite: `chloromaster.db`

### Docker Compose (.env file)

```bash
# Add to .env file
DATABASE_URL=postgresql://chloromaster_admin:password@postgres:5432/chloromaster
```

### Kubernetes (Already Configured)

```yaml
# k8s/02-secrets.yaml
stringData:
  DATABASE_URL: postgresql://chloromaster_admin:ChloroMaster_DB_Secure_Pass_2026_Change_In_Production@postgres:5432/chloromaster
```

---

## 📈 Monitoring

### Database Metrics

**Check PostgreSQL Status:**

```bash
kubectl exec -n chloromaster postgres-0 -- pg_isready -U chloromaster_admin

# Database size
kubectl exec -n chloromaster postgres-0 -- psql -U chloromaster_admin -d chloromaster -c "SELECT pg_size_pretty(pg_database_size('chloromaster'));"

# Connection count
kubectl exec -n chloromaster postgres-0 -- psql -U chloromaster_admin -d chloromaster -c "SELECT count(*) FROM pg_stat_activity;"

# Table sizes
kubectl exec -n chloromaster postgres-0 -- psql -U chloromaster_admin -d chloromaster -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

### SMTP Monitoring

**Check MailHog:**

```bash
# Service status
kubectl get svc -n chloromaster mailhog

# Pod logs
kubectl logs -n chloromaster deployment/mailhog --tail=50

# Test SMTP connection
telnet localhost 1025  # (via port-forward)
```

---

## 🔒 Security Best Practices

### Database Security

1. **Change Default Password:**

   ```bash
   # Update k8s/12-postgres.yaml secret
   POSTGRES_PASSWORD: YOUR_STRONG_PASSWORD_HERE
   
   # Apply changes
   kubectl apply -f k8s/12-postgres.yaml
   kubectl delete pod postgres-0 -n chloromaster  # Restart
   ```

2. **Network Policies:**
   - Limit database access to backend pods only
   - No direct external access

3. **Regular Backups:**
   - Automated daily backups
   - Store backups in external storage (S3, GCS)
   - Test restore procedures

4. **SSL/TLS:**

   ```yaml
   # For production, enable SSL
   DATABASE_URL: postgresql://user:pass@host:5432/db?sslmode=require
   ```

### SMTP Security

1. **Use API Keys:**
   - Never commit SMTP passwords to git
   - Use Kubernetes secrets only

2. **Rate Limiting:**
   - Already configured in backend (10 emails/hour per IP)

3. **SPF/DKIM Records:**
   - Configure for production domain
   - Reduces spam score

---

## 🎯 Production Checklist

- [x] PostgreSQL deployed and running
- [x] Database schema created
- [x] Admin user initialized
- [x] MailHog deployed (dev/staging)
- [x] Backend supports PostgreSQL
- [x] Connection strings configured
- [ ] Change PostgreSQL password
- [ ] Configure production SMTP provider
- [ ] Set up automated backups
- [ ] Configure database monitoring
- [ ] Set up database replication (HA)
- [ ] Enable SSL for database connections
- [ ] Configure SPF/DKIM for email domain

---

## 📞 Troubleshooting

### Database Connection Issues

```bash
# Check pod status
kubectl get pods -n chloromaster postgres-0

# View logs
kubectl logs -n chloromaster postgres-0 --tail=100

# Check connection from backend
kubectl exec -n chloromaster deployment/backend -- env | grep DATABASE

# Test connection manually
kubectl exec -n chloromaster postgres-0 -- psql -U chloromaster_admin -d chloromaster -c "SELECT 1;"
```

### SMTP Issues

```bash
# Check MailHog logs
kubectl logs -n chloromaster deployment/mailhog --tail=50

# Test SMTP port
kubectl exec -n chloromaster deployment/backend -- nc -zv mailhog 1025

# View backend SMTP logs
kubectl logs -n chloromaster deployment/backend | grep -i smtp
```

### Migration Issues

```bash
# Check table existence
kubectl exec -n chloromaster postgres-0 -- psql -U chloromaster_admin -d chloromaster -c "\dt"

# Re-run schema creation
./backend/scripts/init-postgres.sh

# Verify data
kubectl exec -n chloromaster postgres-0 -- psql -U chloromaster_admin -d chloromaster -c "SELECT COUNT(*) FROM \"AdminUsers\";"
```

---

## 🎉 Summary

**Database:**

- ✅ PostgreSQL 16.11 running on Kubernetes
- ✅ 4 tables created with indexes
- ✅ Admin user initialized
- ✅ 10Gi persistent storage
- ✅ Automatic SQLite → PostgreSQL migration support

**SMTP:**

- ✅ MailHog for development/staging
- ✅ Production-ready configuration examples
- ✅ Multiple provider options (SendGrid, Gmail, SES, Mailgun)
- ✅ Integrated with backend email system

**Next Steps:**

1. Test email sending from application
2. Configure production SMTP provider
3. Set up automated database backups
4. Enable database monitoring in Grafana
