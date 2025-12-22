# Docker Compose Configuration Guide

## ✨ Unified Docker Compose with Profiles

**Best Practice**: One `docker-compose.yml` file with **profiles** for different use cases! ⭐

### 📦 Available Profiles

The root `/docker-compose.yml` now supports multiple profiles:

| Profile | Services | Use Case |
|---------|----------|----------|
| **default** | Frontend + Backend (SQLite) + Nginx | ✅ Production stack, Full application |
| **dev** | + SQL Server + Redis | 🔧 Backend development with full database |
| **monitoring** | + Prometheus + Grafana | 📊 Performance monitoring & metrics |

---

## 🚀 Quick Start

### Production Stack (Default)

```bash
# Start frontend + backend + nginx
docker compose up -d

# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

**Access**:

- Frontend: <http://localhost> (via nginx)
- Backend API: <http://localhost/api>

---

### Development Mode (with SQL Server + Redis)

```bash
# Start with dev profile
docker compose --profile dev up -d

# Build and start
docker compose --profile dev up -d --build

# Stop
docker compose --profile dev down
```

**Access**:

- All default services PLUS:
- SQL Server: localhost:1433 (user: `sa`, password: `YourStrong@Passw0rd`)
- Redis: localhost:6379

---

### With Monitoring (Prometheus + Grafana) 📊

```bash
# Start monitoring to view website statistics
docker compose --profile monitoring up -d

# Open Grafana dashboard
xdg-open http://localhost:3001
```

**Grafana Login** (for website statistics & monitoring):

- URL: <http://localhost:3001>
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change password after first login!**

**Monitoring Access**:

- **Grafana** (statistics/dashboards): <http://localhost:3001>
- **Prometheus** (raw metrics): <http://localhost:9090>

**What you can monitor:**

- Website traffic and performance
- Backend API response times
- Server resource usage (CPU, memory)
- Database query performance
- Real-time visitor statistics

---

### Everything Combined

```bash
# All services: default + dev + monitoring
docker compose --profile dev --profile monitoring up -d
```

---

## 🎯 Common Use Cases

### Full Stack Development

```bash
# Production-like environment
docker compose up -d

# Access application
xdg-open http://localhost
```

### Backend Development with SQL Server

```bash
# Backend with SQL Server + Redis
docker compose --profile dev up -d

# Connect to SQL Server
sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd'
```

### Website Statistics & Performance Monitoring

```bash
# Add monitoring to view website statistics
docker compose --profile monitoring up -d

# Open Grafana for statistics and dashboards
xdg-open http://localhost:3001  # Grafana (login: admin/admin123)

# Or view raw metrics
xdg-open http://localhost:9090  # Prometheus
```

### Building for Kubernetes

```bash
# Build images (default profile)
docker compose build

# Verify
docker images | grep chloromaster
```

---

## 📊 Service Overview

### Default Profile (Always Runs)

- ✅ **Frontend** (React + Nginx) - Port 3000
- ✅ **Backend** (.NET 8 API) - Port 5000
- ✅ **Nginx** (Reverse Proxy) - Port 80/443
- ✅ **SQLite** (Embedded database)

### Dev Profile (`--profile dev`)

- 🔧 **SQL Server 2022** - Port 1433
- 🔧 **Redis 7** - Port 6379

### Monitoring Profile (`--profile monitoring`)

- 📊 **Prometheus** - Port 9090
- 📊 **Grafana** - Port 3001

---

## 🔧 Advanced Usage

### View Running Services

```bash
# All services
docker compose ps

# Specific profile
docker compose --profile dev ps
```

### Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend

# With timestamps
docker compose logs -f --timestamps backend
```

### Rebuild Specific Service

```bash
# Rebuild backend
docker compose build backend

# Rebuild and restart
docker compose up -d --build backend
```

### Scale Services (Manual)

```bash
# Scale backend to 3 replicas
docker compose up -d --scale backend=3

# Note: Kubernetes handles auto-scaling in production
```

---

## 🗂️ Data Persistence

All data is persisted in Docker volumes:

| Volume | Purpose | Profile |
|--------|---------|---------|
| `backend_data` | SQLite database | default |
| `backend_logs` | Application logs | default |
| `sqlserver_data` | SQL Server database | dev |
| `redis_data` | Redis cache | dev |
| `prometheus_data` | Metrics history | monitoring |
| `grafana_data` | Grafana dashboards | monitoring |

### Backup Volumes

```bash
# Backup SQLite
docker compose cp backend:/app/data ./backup/

# Backup SQL Server
docker exec -it chloromaster-sqlserver-1 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Passw0rd' \
  -Q "BACKUP DATABASE ChloroMasterDb TO DISK='/var/opt/mssql/data/backup.bak'"
```

### Clean Up

```bash
# Stop and remove containers (keeps volumes)
docker compose down

# Remove containers AND volumes (⚠️ data loss)
docker compose down -v

# Remove specific profile
docker compose --profile dev down -v
```

---

## 🐛 Troubleshooting

### Grafana Login Not Working (Website Statistics)

```bash
# Check if Grafana is running
docker compose --profile monitoring ps

# View Grafana logs
docker compose logs grafana

# Grafana credentials for viewing statistics:
# URL: http://localhost:3001
# Username: admin
# Password: admin123
```

### Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# Use alternative ports (edit docker-compose.yml)
# Change nginx ports from "80:80" to "8080:80"
```

### Backend Connection Failed

```bash
# Check backend health
curl http://localhost:5000/health

# View backend logs
docker compose logs backend

# Restart backend
docker compose restart backend
```

### SQL Server Connection Issues

```bash
# Check if SQL Server is running
docker compose --profile dev ps sqlserver

# Test connection
docker exec -it chloromaster-sqlserver-1 \
  /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd'

# View SQL Server logs
docker compose logs sqlserver
```

---

## 🚀 Migration from Old Setup

If you have the old `backend/docker-compose.yml`:

1. **Backup** (already done): `backend/docker-compose.old.yml`
2. **Use new unified file**:

   ```bash
   # Old: cd backend && docker compose up
   # New: docker compose --profile dev up -d
   ```

3. **Update scripts**: Replace `cd backend && docker compose` with `docker compose --profile dev`

---

## 📝 Environment Variables

### Default Profile

- `ASPNETCORE_ENVIRONMENT`: Development or Production
- `ASPNETCORE_URLS`: http://+:5000
- `ConnectionStrings__DefaultConnection`: SQLite path

### Dev Profile

- `SA_PASSWORD`: SQL Server sa password
- `ACCEPT_EULA`: Y (SQL Server EULA)
- `ConnectionStrings__DefaultConnection`: SQL Server connection string

### Monitoring Profile

- `GF_SECURITY_ADMIN_PASSWORD`: admin123 (Grafana admin password)
- `GF_USERS_ALLOW_SIGN_UP`: false

---

## 📚 Further Reading

- [Docker Compose Profiles Documentation](https://docs.docker.com/compose/profiles/)
- [Grafana Configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/)
- [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
- [KUBERNETES_GUIDE.md](./KUBERNETES_GUIDE.md) - Kubernetes deployment

---

## ✅ Best Practices

1. **Use profiles** instead of multiple docker-compose files
2. **Always set passwords** via environment variables
3. **Backup volumes** before running `docker compose down -v`
4. **Monitor website statistics** with Grafana (use `--profile monitoring`)
5. **Use Kubernetes** for production deployments with auto-scaling
6. **Test locally** with docker compose before pushing to Kubernetes
