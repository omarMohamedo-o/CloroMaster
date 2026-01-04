# Prometheus Monitoring

## Overview

Production-optimized Prometheus monitoring service for ChloroMaster application metrics.

## Features

- ✅ **Metrics Collection**: 15s scrape interval
- ✅ **Data Retention**: 15 days / 10GB
- ✅ **API Access**: Web API enabled for queries
- ✅ **Lifecycle Management**: Hot reload via API
- ✅ **Health Checks**: Automated monitoring
- ✅ **Security**: Non-root user (nobody)

## Configuration

### Dockerfile

**Optimizations**:

- Specific version pinned (`v2.48.1`)
- Non-root user execution
- Health checks enabled
- Proper file permissions
- Storage retention configured

### prometheus.yml

**Scrape Targets**:

- Prometheus itself (localhost:9090)
- Backend API (backend:5000)
- Nginx metrics (nginx:8080)
- Container metrics (cAdvisor:8080)
- System metrics (node-exporter:9100)

**Settings**:

```yaml
scrape_interval: 15s
evaluation_interval: 15s
storage.tsdb.retention.time: 15d
storage.tsdb.retention.size: 10GB
```

## Usage

### Build Image

```bash
docker compose build prometheus
```

### Start Service

```bash
docker compose --profile monitoring up -d prometheus
```

### Access UI

```bash
# Web interface
open http://localhost:9090

# Or curl
curl http://localhost:9090
```

### Reload Configuration

```bash
# Hot reload without restart
curl -X POST http://localhost:9090/-/reload
```

## Queries

### Example PromQL Queries

#### Backend Metrics

```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# CPU usage
rate(process_cpu_seconds_total[5m])

# Memory usage
process_resident_memory_bytes
```

#### Nginx Metrics

```promql
# Request rate
rate(nginx_http_requests_total[5m])

# Active connections
nginx_http_connections{state="active"}

# Response codes
rate(nginx_http_requests_total{status="200"}[5m])
```

#### Container Metrics

```promql
# Container CPU
rate(container_cpu_usage_seconds_total[5m])

# Container memory
container_memory_usage_bytes

# Network I/O
rate(container_network_receive_bytes_total[5m])
```

## Commands

### Check Configuration

```bash
# Validate config file
docker run --rm -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:v2.48.1 promtool check config /etc/prometheus/prometheus.yml
```

### Query Data

```bash
# Instant query
curl 'http://localhost:9090/api/v1/query?query=up'

# Range query
curl 'http://localhost:9090/api/v1/query_range?query=up&start=2024-01-01T00:00:00Z&end=2024-01-02T00:00:00Z&step=15s'

# All targets
curl http://localhost:9090/api/v1/targets
```

### Manage Service

```bash
# Check health
curl http://localhost:9090/-/healthy

# Check readiness
curl http://localhost:9090/-/ready

# Reload config
curl -X POST http://localhost:9090/-/reload

# View flags
curl http://localhost:9090/api/v1/status/flags
```

## Monitoring

### Service Health

```bash
# Docker health status
docker compose ps prometheus

# Service logs
docker compose logs -f prometheus

# Metrics endpoint
curl http://localhost:9090/metrics
```

### Storage

```bash
# Check TSDB stats
curl http://localhost:9090/api/v1/status/tsdb

# Storage size
docker exec chloromaster-prometheus du -sh /prometheus
```

### Performance

```bash
# Query statistics
curl http://localhost:9090/api/v1/status/runtimeinfo

# Active targets
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets | length'
```

## Integration

### With Grafana

Prometheus is automatically configured as a datasource in Grafana:

```yaml
# See monitoring/grafana/provisioning/datasources/prometheus.yml
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
```

### With Backend API

Add metrics endpoint to .NET API:

```csharp
// Install: OpenTelemetry.Exporter.Prometheus.AspNetCore
app.UseOpenTelemetryPrometheusScrapingEndpoint();
```

## Alerts (Optional)

### Create Alert Rules

Create `alerts.yml`:

```yaml
groups:
  - name: chloromaster_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
```

Enable in prometheus.yml:

```yaml
rule_files:
  - "alerts.yml"
```

## Backup & Restore

### Backup Data

```bash
# Create snapshot
curl -X POST http://localhost:9090/api/v1/admin/tsdb/snapshot

# Copy snapshot
docker cp chloromaster-prometheus:/prometheus/snapshots ./backup/
```

### Restore Data

```bash
# Copy data back
docker cp ./backup/snapshot-* chloromaster-prometheus:/prometheus/
docker compose restart prometheus
```

## Troubleshooting

### Service Not Starting

```bash
# Check logs
docker compose logs prometheus

# Validate config
docker run --rm -v $(pwd)/prometheus.yml:/tmp/prometheus.yml \
  prom/prometheus:v2.48.1 promtool check config /tmp/prometheus.yml

# Check permissions
docker exec chloromaster-prometheus ls -la /etc/prometheus/
```

### Targets Down

```bash
# Check target status
curl http://localhost:9090/api/v1/targets

# Test target connectivity
docker exec chloromaster-prometheus wget -O- http://backend:5000/metrics
```

### High Memory Usage

```bash
# Check memory stats
docker stats chloromaster-prometheus

# Reduce retention
# Edit prometheus.yml or Dockerfile:
--storage.tsdb.retention.time=7d
--storage.tsdb.retention.size=5GB
```

## Performance Tuning

### Scrape Intervals

```yaml
# Global default
global:
  scrape_interval: 15s

# Per-job override
scrape_configs:
  - job_name: "backend"
    scrape_interval: 10s  # More frequent
```

### Storage

```bash
# Reduce retention time
--storage.tsdb.retention.time=7d

# Reduce retention size
--storage.tsdb.retention.size=5GB

# Disable WAL compression (faster writes)
--storage.tsdb.wal-compression=false
```

### Query Limits

```bash
# Limit concurrent queries
--query.max-concurrency=10

# Query timeout
--query.timeout=2m
```

## Security

### Authentication (Optional)

Add reverse proxy with basic auth:

```nginx
location /prometheus/ {
    auth_basic "Prometheus";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://prometheus:9090/;
}
```

### Network Isolation

- Prometheus only accessible within Docker network
- Expose through Nginx reverse proxy
- Use TLS for external access

## Exporters

### Node Exporter (System Metrics)

```yaml
# docker-compose.yml
node-exporter:
  image: prom/node-exporter:latest
  ports:
    - "9100:9100"
```

### cAdvisor (Container Metrics)

```yaml
cadvisor:
  image: gcr.io/cadvisor/cadvisor:latest
  ports:
    - "8080:8080"
  volumes:
    - /:/rootfs:ro
    - /var/run:/var/run:ro
    - /sys:/sys:ro
    - /var/lib/docker/:/var/lib/docker:ro
```

## Resources

- **Prometheus Docs**: <https://prometheus.io/docs/>
- **PromQL Guide**: <https://prometheus.io/docs/prometheus/latest/querying/basics/>
- **Best Practices**: <https://prometheus.io/docs/practices/>
- **Exporters**: <https://prometheus.io/docs/instrumenting/exporters/>

## Production Checklist

- [x] Dockerfile optimized
- [x] Health checks enabled
- [x] Non-root user configured
- [x] Storage retention set
- [x] Scrape targets configured
- [ ] Alert rules defined (optional)
- [ ] Backup automation (recommended)
- [ ] Monitoring exporters added (recommended)
- [ ] Authentication enabled (if exposed)

---

**Version**: 2.0  
**Updated**: January 2, 2026  
**Status**: Production Ready ✅
