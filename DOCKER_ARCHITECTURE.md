# ChloroMaster - Microservices Docker Architecture

## 🏗️ Architecture Overview

This project uses a microservices approach with Docker containerization:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                       │
│                    (Port 80 → 8080)                         │
│  • Load Balancing                                           │
│  • SSL Termination (future)                                 │
│  • Caching                                                  │
│  • Compression                                              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend Service                    │
│                    (Internal Port 3000)                      │
│  • Static File Serving                                      │
│  • SPA Routing                                              │
│  • Build Artifacts                                          │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Services

### 1. Frontend Service

- **Technology**: React 18 + Node.js
- **Base Image**: node:18-alpine
- **Port**: 3000 (internal)
- **User**: Non-root (reactapp:1001)
- **Features**:
  - Multi-stage build (builder + runner)
  - Production-optimized build
  - Health checks
  - Read-only filesystem
  - No root privileges

### 2. Nginx Service

- **Technology**: Nginx Alpine
- **Base Image**: nginx:alpine
- **Port**: 8080 (internal) → 80 (external)
- **User**: Non-root (nginx:1001)
- **Features**:
  - Reverse proxy
  - Static file caching
  - Gzip compression
  - Security headers
  - Health checks
  - Read-only filesystem

## 🚀 Quick Start

### Prerequisites

```bash
# Install Docker and Docker Compose
docker --version  # Docker 20.10+
docker-compose --version  # Docker Compose 2.0+
```

### Build and Run

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Access the Application

```
http://localhost
```

## 🔒 Security Features

### Non-Root Users

All containers run as non-root users:

- Frontend: `reactapp` (UID: 1001)
- Nginx: `nginx` (UID: 1001)

### Security Options

- `no-new-privileges`: Prevents privilege escalation
- `read_only`: Filesystem is read-only
- `cap_drop: ALL`: Drops all Linux capabilities
- `cap_add`: Only adds necessary capabilities

### Network Isolation

- Private network: `chloromaster-network`
- Services communicate internally
- Only Nginx exposed to host

## 📊 Health Checks

### Frontend Health Check

```bash
curl http://localhost:3000
```

### Nginx Health Check

```bash
curl http://localhost/health
```

### Docker Health Status

```bash
docker ps
# Look for "healthy" status
```

## 🛠️ Development

### Local Development (without Docker)

```bash
cd frontend
npm install
npm start
```

### Build Individual Services

#### Frontend

```bash
docker build -t chloromaster-frontend:latest ./frontend
```

#### Nginx

```bash
docker build -t chloromaster-nginx:latest ./nginx
```

## 📝 Environment Variables

### Frontend Service

Create `frontend/.env.production`:

```env
NODE_ENV=production
REACT_APP_API_URL=http://localhost/api
```

### Nginx Service

No environment variables needed (configuration in files)

## 🔧 Configuration Files

### Frontend

- `frontend/Dockerfile` - Multi-stage build configuration
- `frontend/.dockerignore` - Files to exclude from build

### Nginx

- `nginx/Dockerfile` - Nginx container configuration
- `nginx/nginx.conf` - Main nginx configuration
- `nginx/default.conf` - Server block configuration
- `nginx/.dockerignore` - Files to exclude from build

### Docker Compose

- `docker-compose.yml` - Service orchestration

## 📈 Performance Optimizations

### Multi-Stage Builds

- **Builder stage**: Compiles and builds the application
- **Runner stage**: Minimal runtime environment
- **Result**: Smaller image size (~60% reduction)

### Caching Strategy

- Nginx caches static assets for 7 days
- Cache invalidation on updates
- Browser caching headers

### Compression

- Gzip compression enabled
- Compression level: 6
- All text-based files compressed

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs frontend
docker-compose logs nginx

# Check container status
docker ps -a

# Restart services
docker-compose restart
```

### Permission Errors

```bash
# Rebuild with no cache
docker-compose build --no-cache

# Check file permissions
ls -la frontend/
```

### Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# Change port in docker-compose.yml
# ports:
#   - "8080:8080"  # Use port 8080 instead
```

## 📋 Maintenance

### Update Dependencies

```bash
# Update frontend dependencies
cd frontend
npm update
npm audit fix

# Rebuild containers
docker-compose build --no-cache
```

### View Container Stats

```bash
docker stats
```

### Clean Up

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything
docker system prune -a --volumes
```

## 🚀 Production Deployment

### Build for Production

```bash
# Build optimized images
docker-compose -f docker-compose.yml build

# Tag images
docker tag chloromaster-frontend:latest registry.example.com/chloromaster-frontend:v1.0.0
docker tag chloromaster-nginx:latest registry.example.com/chloromaster-nginx:v1.0.0

# Push to registry
docker push registry.example.com/chloromaster-frontend:v1.0.0
docker push registry.example.com/chloromaster-nginx:v1.0.0
```

### Kubernetes Deployment (Optional)

See `k8s/` directory for Kubernetes manifests (to be created)

## 📊 Monitoring

### Container Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Resource Usage

```bash
docker stats chloromaster-frontend chloromaster-nginx
```

## 🔐 Security Checklist

- ✅ Non-root users in all containers
- ✅ Read-only filesystems
- ✅ No new privileges
- ✅ Minimal capabilities
- ✅ Security headers configured
- ✅ Health checks implemented
- ✅ Network isolation
- ✅ No secrets in images
- ✅ Multi-stage builds
- ✅ Regular security updates

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Security](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [Docker Security](https://docs.docker.com/engine/security/)

---

**Last Updated**: December 18, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
