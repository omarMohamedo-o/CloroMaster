# Website Monitoring & Statistics Guide

## 📊 Overview

This guide explains how to use **Grafana** and **Prometheus** to monitor your ChloroMaster website statistics, performance, and server health.

---

## 🎯 What Can You Monitor?

### Website Performance

- ✅ Page load times
- ✅ API response times
- ✅ Backend performance
- ✅ Database query speed

### Traffic & Usage

- ✅ Number of visitors
- ✅ API requests per second
- ✅ Most popular pages
- ✅ Error rates

### Server Health

- ✅ CPU usage
- ✅ Memory consumption
- ✅ Disk space
- ✅ Network traffic

### Application Metrics

- ✅ Active connections
- ✅ Cache hit/miss rates
- ✅ Database connections
- ✅ Request success/failure rates

---

## 🚀 Quick Start

### 1. Start Monitoring Services

```bash
# Start your website with monitoring
docker compose --profile monitoring up -d

# Wait for services to start (30 seconds)
sleep 30
```

### 2. Access Grafana Dashboard

**URL**: <http://localhost:3001>

**Login Credentials**:

- **Username**: `admin`
- **Password**: set via environment variable `GF_SECURITY_ADMIN_PASSWORD` (do not use `admin123` in production)

⚠️ **Important**: Set a secure password via environment variables before exposing Grafana. Change the password immediately after first login if a default was used.

### 3. View Statistics

Once logged in, you can:

1. Create custom dashboards
2. View real-time metrics
3. Set up alerts
4. Export reports

---

## 📈 Grafana vs Prometheus

| Tool | Purpose | Access | Use Case |
|------|---------|--------|----------|
| **Grafana** | Visual dashboards & statistics | <http://localhost:3001> | ✅ View beautiful charts and graphs |
| **Prometheus** | Raw metrics collection | <http://localhost:9090> | 🔧 Advanced users, raw data queries |

**Recommendation**: Use **Grafana** for normal monitoring. It's user-friendly and visual!

---

## 🎨 Creating Your First Dashboard

### Step 1: Login to Grafana

```bash
xdg-open http://localhost:3001
# Login: admin / (password set via GF_SECURITY_ADMIN_PASSWORD)
```

### Step 2: Add a Dashboard

1. Click **"+"** (Create) → **Dashboard**
2. Click **"Add visualization"**
3. Select **"Prometheus"** as data source

### Step 3: Choose Metrics

**Popular metrics to display**:

#### Backend API Performance

```promql
# Request rate
rate(http_requests_total[5m])

# Average response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

#### Server Resources

```promql
# CPU Usage
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory Usage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100
```

### Step 4: Save Dashboard

1. Click **"Save dashboard"** (disk icon)
2. Give it a name like "Website Statistics"
3. Click **"Save"**

---

## 🔔 Setting Up Alerts

### Email Alerts for Issues

1. Go to **Alerting** → **Contact points**
2. Click **"New contact point"**
3. Choose **Email** and add your email
4. Save

### Create Alert Rules

1. In your dashboard, edit a panel
2. Go to **Alert** tab
3. Click **"Create alert rule"**
4. Set conditions (e.g., "CPU > 80%")
5. Save

---

## 📊 Pre-configured Dashboards

Grafana has many ready-made dashboards you can import:

### Popular Dashboards

1. **Node Exporter Full** (ID: 1860)
   - Complete server monitoring
   - CPU, Memory, Disk, Network

2. **.NET Core Dashboard** (ID: 12831)
   - ASP.NET Core metrics
   - Request rates, latency

3. **Docker Container Metrics** (ID: 893)
   - Container resource usage
   - Per-container statistics

### How to Import

1. Click **"+"** → **Import**
2. Enter dashboard ID (e.g., 1860)
3. Click **"Load"**
4. Select **"Prometheus"** as data source
5. Click **"Import"**

---

## 🔧 Common Queries

### Website Traffic

```promql
# Total requests today
increase(http_requests_total[24h])

# Requests per minute
rate(http_requests_total[1m]) * 60
```

### Performance

```promql
# Average API response time
avg(http_request_duration_seconds)

# Slow requests (>1 second)
http_request_duration_seconds > 1
```

### Errors

```promql
# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# 404 errors
http_requests_total{status="404"}
```

---

## 🐛 Troubleshooting

### Can't Access Grafana

```bash
# Check if services are running
docker compose ps

# Should show grafana and prometheus as "Up"

# Check Grafana logs
docker compose logs grafana

# Restart if needed
docker compose restart grafana
```

### Forgot Grafana Password

```bash
# Reset admin password
docker compose exec grafana grafana-cli admin reset-admin-password newpassword123

# Or restart with default password
docker compose down grafana
docker compose --profile monitoring up -d grafana
```

### No Data in Dashboards

```bash
# Check Prometheus is scraping
xdg-open http://localhost:9090/targets

# All targets should show "UP" status

# Check backend is exposing metrics
curl http://localhost:5000/metrics
```

---

## 🎓 Learning Resources

### Grafana

- [Official Documentation](https://grafana.com/docs/grafana/latest/)
- [Dashboard Examples](https://grafana.com/grafana/dashboards/)
- [Alerting Guide](https://grafana.com/docs/grafana/latest/alerting/)

### Prometheus

- [Query Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Best Practices](https://prometheus.io/docs/practices/naming/)
- [Metric Types](https://prometheus.io/docs/concepts/metric_types/)

---

## 💡 Best Practices

1. **Change default password** immediately after first login
2. **Create separate dashboards** for different purposes (performance, errors, traffic)
3. **Set up alerts** for critical metrics (CPU >90%, errors >10%)
4. **Regular backups** of Grafana dashboards
5. **Use annotations** to mark deployments and incidents

---

## 📝 Monitoring Checklist

### Daily

- [ ] Check Grafana dashboards for anomalies
- [ ] Review error rates
- [ ] Monitor response times

### Weekly

- [ ] Review alert history
- [ ] Check disk space trends
- [ ] Analyze traffic patterns

### Monthly

- [ ] Export performance reports
- [ ] Review and update alert thresholds
- [ ] Clean up old Prometheus data

---

## 🚀 Advanced: Production Monitoring

For production deployments with Kubernetes, see:

- [KUBERNETES_GUIDE.md](./KUBERNETES_GUIDE.md) - Kubernetes monitoring setup
- [DOCKER_COMPOSE_GUIDE.md](./DOCKER_COMPOSE_GUIDE.md) - Docker Compose profiles

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start monitoring | `docker compose --profile monitoring up -d` |
| Stop monitoring | `docker compose stop grafana prometheus` |
| View logs | `docker compose logs grafana` |
| Restart | `docker compose restart grafana prometheus` |
| Access Grafana | <http://localhost:3001> (admin/admin123) |
| Access Prometheus | <http://localhost:9090> |

---

**Remember**: Grafana is your friend for understanding how your website is performing! 📊✨
