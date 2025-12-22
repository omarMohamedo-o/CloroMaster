# ChloroMaster - Docker Microservices Architecture

## Overview

This project uses a microservices architecture with Docker for containerization, featuring:

- Multi-stage Docker builds for optimized images
- Non-root user security
- Health checks and monitoring
- Resource limits and logging
- Production-ready configuration

## Architecture

```
┌─────────────────────────────────────────────┐
│              Nginx (Port 80)                │
│         Reverse Proxy & Load Balancer       │
│              (nginxapp user)                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          React Frontend (Port 3000)         │
│            Static File Server               │
│             (reactapp user)                 │
└─────────────────────────────────────────────┘
```

## Features

### Security

- ✅ Non-root users in all containers
- ✅ Read-only filesystems
- ✅ Capability dropping (cap_drop: ALL)
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ No new privileges flag
- ✅ Tmpfs for temporary data

### Performance

- ✅ Multi-stage builds (smaller images)
- ✅ Layer caching optimization
- ✅ Gzip compression
- ✅ Static file caching
- ✅ Resource limits (CPU & Memory)
- ✅ Health checks

### Monitoring

- ✅ Health check endpoints
- ✅ Structured logging
- ✅ Log rotation (10MB, 3 files)
- ✅ Container status monitoring

## Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Make (optional, for convenience)

### Using Make (Recommended)

```bash
# Install and start everything
make install

# Build images
make build

# Start services
make up

# Stop services
make down

# View logs
make logs

# Check health
make health

# Restart services
make restart

# Clean rebuild
make rebuild
```

### Using Docker Compose Directly

```bash
# Build and start services
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

## Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Website | <http://localhost> | Main application |
| Health Check | <http://localhost/health> | Nginx health |
| Frontend Health | <http://localhost:3000> | Direct frontend access |

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Node Environment
NODE_ENV=production

# Ports
FRONTEND_PORT=3000
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443

# Resource Limits
FRONTEND_CPU_LIMIT=0.5
FRONTEND_MEMORY_LIMIT=512M
NGINX_CPU_LIMIT=0.3
NGINX_MEMORY_LIMIT=256M
```

### Docker Compose Override

For local development, create `docker-compose.override.yml`:

```yaml
version: '3.9'

services:
  frontend:
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## Image Sizes

| Service | Size | Optimizations |
|---------|------|---------------|
| Frontend | ~150MB | Multi-stage build, Alpine base |
| Nginx | ~25MB | Alpine base, minimal config |

## Resource Usage

| Service | CPU Limit | Memory Limit | Reserved CPU | Reserved Memory |
|---------|-----------|--------------|--------------|-----------------|
| Frontend | 0.5 cores | 512MB | 0.25 cores | 256MB |
| Nginx | 0.3 cores | 256MB | 0.15 cores | 128MB |

## Health Checks

All services include health checks:

```yaml
healthcheck:
  interval: 30s    # Check every 30 seconds
  timeout: 10s     # Timeout after 10 seconds
  retries: 3       # Retry 3 times before marking unhealthy
  start_period: 40s # Wait 40s before first check
```

## Security Best Practices

### Container Security

1. **Non-root users**: All containers run as non-root users (UID 1001)
2. **Read-only filesystem**: Containers use read-only root filesystem
3. **Capability dropping**: All Linux capabilities dropped except necessary ones
4. **No privilege escalation**: `no-new-privileges` flag set

### Network Security

1. **Isolated network**: Services communicate on isolated bridge network
2. **Minimal exposed ports**: Only necessary ports exposed to host
3. **Security headers**: Comprehensive security headers in Nginx

## Logging

Logs are configured with rotation:

- **Max size**: 10MB per file
- **Max files**: 3 files kept
- **Format**: JSON for easy parsing

View logs:

```bash
# All services
make logs

# Specific service
docker-compose logs -f frontend
docker-compose logs -f nginx
```

## Troubleshooting

### Container won't start

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs frontend

# Check health
docker inspect chloromaster-frontend --format='{{.State.Health.Status}}'
```

### Permission issues

```bash
# Rebuild with no cache
docker-compose build --no-cache

# Clean and restart
make rebuild
```

### Port already in use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill process or change port in docker-compose.yml
```

## Maintenance

### Update images

```bash
# Pull latest base images
docker-compose pull

# Rebuild
make rebuild
```

### Clean up

```bash
# Remove stopped containers
make clean

# Remove all unused resources
make prune
```

### Backup

```bash
# Export images
docker save chloromaster/frontend:latest | gzip > frontend-backup.tar.gz
docker save chloromaster/nginx:latest | gzip > nginx-backup.tar.gz

# Export volumes
docker run --rm -v chloromaster-nginx-cache:/data -v $(pwd):/backup alpine tar czf /backup/nginx-cache-backup.tar.gz /data
```

## Production Deployment

### Pre-deployment Checklist

- [ ] Update environment variables
- [ ] Configure SSL certificates
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test health checks
- [ ] Review security settings
- [ ] Set resource limits

### Deploy

```bash
# Production deployment
make prod

# Or with docker-compose
NODE_ENV=production docker-compose up -d --build
```

## Monitoring & Metrics

### Check service health

```bash
make health
```

### Check resource usage

```bash
docker stats chloromaster-frontend chloromaster-nginx
```

### View container details

```bash
docker inspect chloromaster-frontend
docker inspect chloromaster-nginx
```

## Development

### Local development with hot reload

```bash
cd frontend
npm start
```

### Build for production

```bash
cd frontend
npm run build
```

### Test Docker build locally

```bash
docker build -t chloromaster/frontend:test ./frontend
docker run -p 3000:3000 chloromaster/frontend:test
```

## Support

For issues or questions:

1. Check logs: `make logs`
2. Check health: `make health`
3. Review documentation
4. Contact support

## License

Copyright © 2025 ChloroMaster. All rights reserved.
