# Grafana Dashboards

## Overview

Production-optimized Grafana visualization platform with pre-configured dashboards for ChloroMaster monitoring.

## Features

- ✅ **Pre-installed Plugins**: Piechart, Clock, Worldmap
- ✅ **Auto-provisioned**: Datasources & dashboards
- ✅ **Security Hardened**: Non-root user
- ✅ **Health Checks**: Automated monitoring
- ✅ **Dark Theme**: Default UI theme
- ✅ **Custom Dashboards**: Ready-to-use templates

## Configuration

### Dockerfile

**Optimizations**:

- Ubuntu-based (stable, enterprise-ready)
- Version pinned (11.4.0)
- Non-root user execution
- Plugins pre-installed
- Health checks enabled
- Proper file permissions

### grafana.ini

**Key Settings**:

```ini
[server]
http_port = 3000
enable_gzip = true

[security]
admin_user = admin
; Do NOT store admin passwords in source. Set via environment variable `GF_SECURITY_ADMIN_PASSWORD`.

[users]
allow_sign_up = false
default_theme = dark

[analytics]
reporting_enabled = false
```

### Plugins Included

1. **grafana-piechart-panel**: Pie/donut charts
2. **grafana-clock-panel**: Clock display
3. **grafana-worldmap-panel**: Geographical visualization

## Usage

### Build Image

```bash
docker compose build grafana
```

### Start Service

```bash
docker compose --profile monitoring up -d grafana
```

### Access UI

```bash
# Web interface
open http://localhost:3001

# Default credentials:
# Username: admin
# Password: set via GF_SECURITY_ADMIN_PASSWORD (do not use `admin123` in production)
```

### Change Password

```bash
# Via CLI
docker exec -it chloromaster-grafana grafana-cli admin reset-admin-password newpassword

# Or via UI after first login
```

## Datasources

### Prometheus (Auto-configured)

Located in `provisioning/datasources/prometheus.yml`:

```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

### Add Additional Datasources

Create files in `provisioning/datasources/`:

```yaml
# mysql.yml
apiVersion: 1
datasources:
  - name: MySQL
    type: mysql
    url: sqlserver:1433
    database: chloromaster
    user: grafana_reader
    secureJsonData:
      password: 'your-password'
```

## Dashboards

### Auto-provisioning

Located in `provisioning/dashboards/`:

```yaml
# dashboard-provider.yml
apiVersion: 1
providers:
  - name: 'default'
    folder: 'ChloroMaster'
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

### Create Dashboard

1. **Via UI**: Create → Dashboard
2. **Export JSON**: Save to `dashboards/`
3. **Rebuild**: `docker compose build grafana`

### Import Dashboard

```bash
# From Grafana.com
# 1. Find dashboard ID (e.g., 1860 for Node Exporter)
# 2. UI: + → Import → Enter ID 1860

# Via API
curl -X POST http://localhost:3001/api/dashboards/db \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -d @dashboard.json
```

## Commands

### Service Management

```bash

# Check health
curl http://localhost:3001/api/health

# Get datasources (use API token or basic auth; avoid embedding password in commands)
curl -H "Authorization: Bearer <API_TOKEN>" http://localhost:3001/api/datasources

# List dashboards
curl -H "Authorization: Bearer <API_TOKEN>" http://localhost:3001/api/search

# Service logs
docker compose logs -f grafana
```

### Plugin Management

```bash
# List installed plugins
docker exec chloromaster-grafana grafana-cli plugins ls

# Install new plugin
docker exec chloromaster-grafana grafana-cli plugins install <plugin-name>
docker compose restart grafana

# Update plugins
docker exec chloromaster-grafana grafana-cli plugins update-all
```

### User Management

```bash
# Create user (use API token or protected admin session)
curl -X POST http://localhost:3001/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -d '{"name":"John Doe","email":"john@example.com","login":"john","password":"password"}'

# List users
curl -H "Authorization: Bearer <API_TOKEN>" http://localhost:3001/api/users

# Reset password
docker exec chloromaster-grafana grafana-cli admin reset-admin-password newpass
```

## Dashboard Examples

### Backend API Dashboard

```json
{
  "dashboard": {
    "title": "ChloroMaster Backend",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_requests_total[5m])"
        }]
      },
      {
        "title": "Error Rate",
        "targets": [{
          "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
        }]
      }
    ]
  }
}
```

### System Metrics Dashboard

Panels to include:

- CPU Usage
- Memory Usage
- Disk I/O
- Network Traffic
- Container Stats

### Nginx Dashboard

Metrics to display:

- Request Rate
- Response Codes
- Active Connections
- Request Duration
- Bandwidth

## Alerts

### Configure Alert Channel

```bash
# Slack notification
curl -X POST http://admin:admin123@localhost:3001/api/alert-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Slack",
    "type": "slack",
    "settings": {
      "url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
    }
  }'
```

### Create Alert

1. Open panel → Edit
2. Click Alert tab
3. Create Alert
4. Set conditions and notifications

## Backup & Restore

### Backup Dashboards

```bash
# Export all dashboards
for dash in $(curl -s http://admin:admin123@localhost:3001/api/search | jq -r '.[] | .uid'); do
  curl -s http://admin:admin123@localhost:3001/api/dashboards/uid/$dash | \
    jq '.dashboard' > dashboards/backup_${dash}.json
done

# Backup Grafana data
docker cp chloromaster-grafana:/var/lib/grafana ./backup/grafana-data
```

### Restore

```bash
# Copy dashboards back
docker cp ./dashboards/ chloromaster-grafana:/var/lib/grafana/

# Or rebuild image with new dashboards
docker compose build grafana
docker compose up -d grafana
```

## Integration

### Prometheus Datasource

Automatically configured via provisioning. Queries Prometheus at `http://prometheus:9090`.

### API Integration

```javascript
// Embed dashboard in your app
<iframe
  src="http://localhost:3001/d/dashboard-uid?orgId=1&theme=dark&kiosk"
  width="100%"
  height="600"
></iframe>
```

### Webhooks

```bash
# Configure webhook for dashboard changes
curl -X POST http://admin:admin123@localhost:3001/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{"url": "http://your-webhook-url", "event": "dashboard-save"}'
```

## Customization

### Theme

Edit `grafana.ini`:

```ini
[users]
default_theme = dark  # or light
```

### Branding

```ini
[branding]
app_title = ChloroMaster Monitoring
logo = /path/to/logo.png
```

### Anonymous Access

```ini
[auth.anonymous]
enabled = true
org_role = Viewer  # Read-only access
```

## Troubleshooting

### Cannot Connect to Prometheus

```bash
# Test connectivity
docker exec chloromaster-grafana wget -O- http://prometheus:9090/api/v1/query?query=up

# Check datasource status
curl http://admin:admin123@localhost:3001/api/datasources/1/health
```

### Dashboards Not Loading

```bash
# Check provisioning logs
docker compose logs grafana | grep provisioning

# Verify dashboard files
docker exec chloromaster-grafana ls -la /var/lib/grafana/dashboards/

# Check permissions
docker exec chloromaster-grafana ls -la /etc/grafana/provisioning/
```

### Plugins Not Working

```bash
# List plugins
docker exec chloromaster-grafana grafana-cli plugins ls

# Reinstall plugin
docker exec chloromaster-grafana grafana-cli plugins install <plugin> --force
docker compose restart grafana

# Check plugin directory
docker exec chloromaster-grafana ls -la /var/lib/grafana/plugins/
```

## Performance

### Enable Caching

```ini
[caching]
enabled = true
ttl = 3600
```

### Database Backend

Default: SQLite (built-in)
Production: PostgreSQL/MySQL recommended

```ini
[database]
type = postgres
host = postgres:5432
name = grafana
user = grafana
password = password
```

### Resource Limits

```yaml
# docker-compose.yml
grafana:
  deploy:
    resources:
      limits:
        memory: 512M
        cpus: '0.5'
```

## Security

### Change Default Password

⚠️ **Important**: Change default admin password!

```bash
docker exec -it chloromaster-grafana grafana-cli admin reset-admin-password YourStrongPassword123!
```

### Enable HTTPS

```ini
[server]
protocol = https
cert_file = /etc/grafana/cert.pem
cert_key = /etc/grafana/key.pem
```

### Disable Anonymous Access

```ini
[auth.anonymous]
enabled = false
```

### Session Security

```ini
[security]
cookie_secure = true
cookie_samesite = strict
```

## Recommended Dashboards

### From Grafana.com

- **1860**: Node Exporter Full
- **893**: Docker & System Monitoring
- **3662**: Prometheus 2.0 Stats
- **7645**: Nginx Metrics
- **11074**: .NET Core Monitoring

### Import Steps

1. Go to <http://localhost:3001>
2. Click + → Import
3. Enter dashboard ID
4. Select Prometheus datasource
5. Click Import

## Resources

- **Grafana Docs**: <https://grafana.com/docs/>
- **Dashboard Library**: <https://grafana.com/grafana/dashboards/>
- **Plugin Catalog**: <https://grafana.com/grafana/plugins/>
- **API Reference**: <https://grafana.com/docs/grafana/latest/http_api/>

## Production Checklist

- [x] Dockerfile optimized
- [x] Health checks enabled
- [x] Non-root user configured
- [x] Plugins installed
- [x] Datasources provisioned
- [ ] Default password changed ⚠️
- [ ] Custom dashboards added
- [ ] Alert channels configured
- [ ] Backup automation setup
- [ ] HTTPS enabled (if exposed)

---

**Version**: 2.0  
**Updated**: January 2, 2026  
**Status**: Production Ready ✅  
**⚠️ Important**: Change default admin password before production!
