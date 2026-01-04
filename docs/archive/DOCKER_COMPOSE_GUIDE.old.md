# Docker Compose Configuration Guide

## 📁 Docker Compose Files Overview

This project has **two** docker-compose configurations serving different purposes:

### 1. Root `/docker-compose.yml` ⭐ **PRIMARY**

**Purpose**: Full application stack for production/Kubernetes deployment

**Services**:

- ✅ **Frontend** (React + Nginx)
- ✅ **Backend** (.NET 8 API)
- ✅ **SQLite Database** (embedded, persistent volume)
- ✅ **Nginx Proxy** (optional, for production-like setup)

**When to use**:

- Building production Docker images
- Testing full stack locally
- Preparing for Kubernetes deployment
- CI/CD pipelines

**Usage**:

```bash
# Build and start all services
docker compose up -d

# Build specific service
docker compose build backend
docker compose build frontend

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Access**:

- Frontend: <http://localhost> (port 80) via nginx proxy
- Direct Frontend: <http://localhost:3000>
- Backend API: <http://localhost:5000/api>
- Admin Dashboard: <http://localhost/admin/login> or <http://localhost:3000/admin/login>

---

### 2. Backend `/backend/docker-compose.yml` 🔧 **DEVELOPMENT**

**Purpose**: Backend development environment with full database

**Services**:

- ✅ **Backend API** (.NET 8)
- ✅ **SQL Server** (Microsoft SQL Server 2022)
- ✅ **Redis Cache** (for caching)

**When to use**:

- Backend-only development
- Testing with SQL Server (not SQLite)
- Developing backend features in isolation
- Backend debugging

**Usage**:

```bash
# From backend directory
cd backend
docker compose up -d

# View logs
docker compose logs -f api

# Stop services
docker compose down
```

**Access**:

- Backend API: <http://localhost:5000>
- SQL Server: localhost:1433 (user: sa, password: YourStrong@Passw0rd)
- Redis: localhost:6379

---

## 🎯 Which One Should I Use?

| Scenario | Use This |
|----------|----------|
| **Full stack development** | Root `/docker-compose.yml` ✅ |
| **Building for Kubernetes** | Root `/docker-compose.yml` ✅ |
| **Backend-only development** | Backend `/backend/docker-compose.yml` |
| **Testing with SQL Server** | Backend `/backend/docker-compose.yml` |
| **Frontend development** | Root `/docker-compose.yml` ✅ |
| **Production deployment** | Kubernetes (use built images from root) |

## 📦 Quick Start Guide

### For Full Application (Recommended)

```bash
# 1. Start from project root
cd /home/omar/Projects/CloroMaster

# 2. Build and start all services
docker compose up -d --build

# 3. Check status
docker compose ps

# 4. Access application
# Frontend: http://localhost or http://localhost:3000
# Admin: http://localhost/admin/login
```

### For Backend Development Only

```bash
# 1. Navigate to backend directory
cd /home/omar/Projects/CloroMaster/backend

# 2. Start backend services
docker compose up -d

# 3. Check status
docker compose ps

# 4. Test API
curl http://localhost:5000/health
```

---

## 🔄 Common Workflows

### Building Images for Kubernetes

```bash
# From project root
docker compose build

# Verify images
docker images | grep chloromaster

# Expected output:
# chloromaster/frontend:latest
# chloromaster/backend:latest
# chloromaster/nginx:latest
```

### Development Workflow

**Option 1: Full Stack** (Frontend + Backend)

```bash
# Terminal 1: Start services
docker compose up

# Terminal 2: Watch logs
docker compose logs -f backend

# Make changes, rebuild specific service
docker compose up -d --build backend
```

**Option 2: Backend Only** (with SQL Server)

```bash
cd backend

# Terminal 1: Start backend services
docker compose up

# Terminal 2: Run API tests
dotnet test

# Access SQL Server for debugging
sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd'
```

---

## 📊 Service Comparison

### Database Differences

| Feature | Root (SQLite) | Backend (SQL Server) |
|---------|---------------|----------------------|
| **Database Type** | SQLite (embedded) | SQL Server 2022 |
| **Best For** | Production, Kubernetes | Development, Testing |
| **Performance** | Fast, lightweight | Full RDBMS features |
| **Data Persistence** | Volume: `backend_data` | Volume: `sqlserver_data` |
| **Connection String** | `Data Source=/app/data/chloromaster.db` | `Server=sqlserver;Database=ChloroMasterDB;...` |
| **Migration Support** | ✅ Automated | Manual (EF Migrations) |

### When to Switch

**Use SQLite (Root compose)** when:

- ✅ Deploying to production
- ✅ Running in Kubernetes
- ✅ Need lightweight setup
- ✅ Don't need advanced RDBMS features

**Use SQL Server (Backend compose)** when:

- 🔧 Developing complex queries
- 🔧 Testing stored procedures
- 🔧 Need full RDBMS features
- 🔧 Debugging backend-only issues

---

## 🛠️ Troubleshooting

### Port Conflicts

**Problem**: Port already in use

```bash
# Check what's using the port
sudo lsof -i :5000  # Backend
sudo lsof -i :3000  # Frontend
sudo lsof -i :1433  # SQL Server

# Stop conflicting service or change port in docker-compose.yml
```

### Image Build Failures

**Problem**: Build fails with errors

```bash
# Clean Docker cache
docker builder prune -a

# Rebuild without cache
docker compose build --no-cache

# Check Dockerfile syntax
docker compose config
```

### Cannot Connect to Database

**SQLite (Root compose)**:

```bash
# Check volume exists
docker volume ls | grep backend_data

# Inspect volume
docker volume inspect chloromaster_backend_data

# Access database
docker compose exec backend sqlite3 /app/data/chloromaster.db
```

**SQL Server (Backend compose)**:

```bash
# Check SQL Server is running
docker compose ps sqlserver

# Check logs
docker compose logs sqlserver

# Test connection
docker compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "SELECT @@VERSION"
```

---

## 🔐 Admin Dashboard Access

### With Root Docker Compose

```bash
# 1. Start services
docker compose up -d

# 2. Access admin dashboard
# http://localhost/admin/login (via nginx)
# OR
# http://localhost:3000/admin/login (direct frontend)

# 3. Login
# Username: admin
# Password: Admin@123

# 4. IMPORTANT: Change password after first login!
```

### Admin Features Available

- 📊 **Dashboard**: System overview
- 📧 **Contact Management**: View submissions from contact form
- 🛠️ **Service Management**: Add/edit/delete services
- 👤 **Profile**: Change password, update details

---

## 🚀 Deployment

### To Kubernetes

```bash
# 1. Build images with root compose
docker compose build

# 2. Tag for registry (if using remote registry)
docker tag chloromaster/backend:latest your-registry/chloromaster-backend:v1.0.0
docker tag chloromaster/frontend:latest your-registry/chloromaster-frontend:v1.0.0

# 3. Push to registry
docker push your-registry/chloromaster-backend:v1.0.0
docker push your-registry/chloromaster-frontend:v1.0.0

# 4. Deploy to Kubernetes
./k8s/deploy.sh
```

### To Production Server (Docker Swarm/Compose)

```bash
# Use root docker-compose.yml
docker compose -f docker-compose.yml up -d --build

# With custom environment
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 📝 Summary

- **Root `/docker-compose.yml`**: ⭐ Use for full application, Kubernetes prep, and production builds
- **Backend `/backend/docker-compose.yml`**: 🔧 Use for backend-only development with SQL Server

**Recommendation**: Start with root compose for most use cases. Use backend compose only when you specifically need SQL Server for development.

---

## 🆘 Need Help?

**Check service status**:

```bash
# Root compose
docker compose ps
docker compose logs

# Backend compose
cd backend && docker compose ps
```

**Clean everything and start fresh**:

```bash
# Root compose
docker compose down -v  # Removes volumes too!
docker compose up -d --build

# Backend compose
cd backend
docker compose down -v
docker compose up -d
```

**View all running containers**:

```bash
docker ps -a
```
