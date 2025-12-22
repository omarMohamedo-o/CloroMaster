# Monitoring Microservices Architecture

## Overview

ChloroMaster uses a **containerized monitoring stack** following microservices best practices with custom Dockerfiles for both Prometheus and Grafana.

## Architecture Benefits

### ✅ Custom Dockerfiles Provide

1. **Version Control & Reproducibility**
   - Lock specific versions (Prometheus, Grafana)
   - Consistent deployments across environments
   - Easy rollback if needed

2. **Pre-configured Setup**
   - Baked-in configurations (no runtime setup)
   - Pre-loaded dashboards and datasources
   - Faster startup times

3. **Security Hardening**
   - Minimal attack surface
   - Non-root user execution
   - Health checks built-in

4. **Portability**
   - Works in Docker Compose (dev)
   - Works in Kubernetes (prod)
   - Works in any container orchestrator

## Components

### 1. Prometheus (`monitoring/prometheus/`)

**Purpose**: Time-series database for metrics collection

**Custom Dockerfile Benefits**:

- ✅ Custom `prometheus.yml` baked into image
- ✅ Pre-configured scrape targets (backend, nginx, etc.)
- ✅ Web lifecycle API enabled for config reloads
- ✅ Optimized storage settings

**Configuration**:

```yaml
# Scrape Targets:
- Backend API: http://backend:5000/metrics (10s interval)
- Prometheus self: http://localhost:9090/metrics (15s interval)
- Nginx: http://nginx:8080/metrics (10s interval) - if enabled
- cAdvisor: http://cadvisor:8080/metrics (30s interval) - if enabled
```

**Exposed Port**: `9090`

### 2. Grafana (`monitoring/grafana/`)

**Purpose**: Visualization and alerting platform

**Custom Dockerfile Benefits**:

- ✅ Pre-installed plugins (piechart, clock)
- ✅ Provisioned datasource (Prometheus auto-connected)
- ✅ Pre-loaded ChloroMaster dashboard
- ✅ Custom `grafana.ini` with security settings
- ✅ Health checks configured

**Pre-configured Dashboard Panels**:

1. **Page Views (Total)** - Total website visits
2. **Contact Form Submissions** - Lead generation tracking
3. **Emails Sent** - Email delivery monitoring
4. **Request Duration (p95)** - Performance monitoring
5. **Page Views Over Time** - Traffic trends
6. **Request Duration Distribution** - p50, p90, p95, p99 latencies
7. **Service Views** - Most popular services
8. **API Calls by Endpoint** - API usage patterns

**Exposed Port**: `3001`
**Default Credentials**: admin / admin123

## Deployment

### Docker Compose (Development)

```bash
# Start monitoring stack
docker compose --profile monitoring up -d

# Rebuild monitoring images
docker compose --profile monitoring build

# View logs
docker compose logs -f prometheus grafana
```

### Kubernetes (Production)

The custom Docker images can be deployed to Kubernetes:

```bash
# Build and push to registry
docker build -t your-registry/chloromaster-prometheus:latest ./monitoring/prometheus
docker build -t your-registry/chloromaster-grafana:latest ./monitoring/grafana
docker push your-registry/chloromaster-prometheus:latest
docker push your-registry/chloromaster-grafana:latest

# Deploy to K8s
kubectl apply -f k8s/monitoring/
```

## Metrics Collected

### Backend Metrics (ASP.NET Core)

| Metric | Type | Description |
|--------|------|-------------|
| `chloromaster_page_views_total` | Counter | Total page views by page and method |
| `chloromaster_unique_visitors` | Gauge | Approximate unique visitors |
| `chloromaster_contact_submissions_total` | Counter | Contact form submissions |
| `chloromaster_emails_sent_total` | Counter | Emails sent (by status) |
| `chloromaster_request_duration_seconds` | Histogram | HTTP request duration |
| `chloromaster_api_calls_total` | Counter | API endpoint calls |
| `chloromaster_service_views_total` | Counter | Service detail page views |
| `chloromaster_active_sessions` | Gauge | Concurrent active sessions |
| `http_request_duration_seconds` | Histogram | ASP.NET Core request metrics |
| `http_requests_received_total` | Counter | Total HTTP requests |

### Prometheus Self-Metrics

- `prometheus_tsdb_*` - Time-series database metrics
- `prometheus_target_*` - Scrape target health
- `go_*` - Go runtime metrics

## Directory Structure

```
monitoring/
├── prometheus/
│   ├── Dockerfile              # Custom Prometheus image
│   └── prometheus.yml          # Scrape configuration
└── grafana/
    ├── Dockerfile              # Custom Grafana image
    ├── grafana.ini             # Grafana configuration
    ├── provisioning/
    │   ├── datasources/
    │   │   └── prometheus.yml  # Auto-connect Prometheus
    │   └── dashboards/
    │       └── dashboards.yml  # Dashboard provider config
    └── dashboards/
        └── chloromaster-dashboard.json  # Pre-built dashboard
```

## Microservices Best Practices Applied

### ✅ 1. Single Responsibility

- Prometheus: Metrics storage and scraping
- Grafana: Visualization and alerting

### ✅ 2. Immutable Infrastructure

- Configuration baked into images
- No runtime configuration drift
- Declarative setup (Infrastructure as Code)

### ✅ 3. Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --spider http://localhost:3000/api/health || exit 1
```

### ✅ 4. Least Privilege

- Non-root user execution
- Read-only volumes where possible
- Minimal system access

### ✅ 5. Observability

- Prometheus scrapes itself
- Grafana has health endpoint
- Structured logging

### ✅ 6. Environment Agnostic

- Works in Docker Compose (dev)
- Works in Kubernetes (prod)
- Works in Docker Swarm (if needed)

## Accessing Dashboards

### Local Development (Docker Compose)

1. **Prometheus**: <http://localhost:9090>
   - Targets: <http://localhost:9090/targets>
   - Graph: <http://localhost:9090/graph>

2. **Grafana**: <http://localhost:3001>
   - Login: admin / admin123
   - Pre-configured dashboard available immediately

### Production (Kubernetes)

Access through Ingress or port-forward:

```bash
# Port-forward Grafana
kubectl port-forward svc/grafana 3001:3000 -n monitoring

# Port-forward Prometheus
kubectl port-forward svc/prometheus 9090:9090 -n monitoring
```

## Troubleshooting

### Prometheus Not Scraping Backend

1. Check if backend is accessible:

   ```bash
   docker compose exec prometheus wget -qO- http://backend:5000/metrics
   ```

2. Check Prometheus logs:

   ```bash
   docker compose logs prometheus | grep -i error
   ```

3. Verify targets in Prometheus UI:
   <http://localhost:9090/targets>

### Grafana Dashboard Not Loading

1. Check datasource connection:
   - Grafana UI → Configuration → Data Sources → Prometheus
   - Click "Test" button

2. Verify provisioning worked:

   ```bash
   docker compose exec grafana ls -la /etc/grafana/provisioning/
   ```

3. Check Grafana logs:

   ```bash
   docker compose logs grafana | grep -i error
   ```

## Next Steps

### Optional Enhancements

1. **Add AlertManager**

   ```yaml
   alertmanager:
     build: ./monitoring/alertmanager
     ports:
       - "9093:9093"
   ```

2. **Add cAdvisor** (Container metrics)

   ```yaml
   cadvisor:
     image: gcr.io/cadvisor/cadvisor:latest
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock:ro
   ```

3. **Add Node Exporter** (System metrics)

   ```yaml
   node-exporter:
     image: prom/node-exporter:latest
   ```

4. **Deploy to Kubernetes**
   - Create K8s manifests in `k8s/monitoring/`
   - Use Helm charts for easier management
   - Consider using Prometheus Operator

## Security Considerations

1. **Change default passwords** in production:

   ```ini
   # grafana.ini
   [security]
   admin_password = <strong-password>
   ```

2. **Enable HTTPS** with reverse proxy:

   ```yaml
   # Use Traefik or Nginx for TLS termination
   ```

3. **Restrict network access**:

   ```yaml
   networks:
     monitoring:
       internal: true  # No external access
   ```

4. **Use secrets** for sensitive data:

   ```yaml
   secrets:
     grafana_admin_password:
       file: ./secrets/grafana_password.txt
   ```

## Conclusion

By using **custom Dockerfiles for monitoring tools**, ChloroMaster follows microservices best practices:

- ✅ Repeatable deployments
- ✅ Version-controlled configuration
- ✅ Fast startup times
- ✅ Production-ready setup
- ✅ Easy to scale and manage

This approach ensures consistent monitoring across all environments (dev, staging, prod) and makes it easy to add new metrics and dashboards as the application grows.
