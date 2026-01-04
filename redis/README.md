# Redis Cache Configuration

## Overview

Custom Redis cache service optimized for ChloroMaster production environment.

## Features

- ✅ **LRU Eviction**: Automatic memory management (256MB limit)
- ✅ **Dual Persistence**: RDB snapshots + AOF log
- ✅ **Connection Pooling**: Up to 10,000 concurrent clients
- ✅ **Security Hardened**: Non-root user, minimal capabilities
- ✅ **Health Checks**: Automatic monitoring with redis-cli ping
- ✅ **Optimized Config**: Production-ready settings

## Configuration

### Memory Settings

```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### Persistence

**RDB (Snapshots)**:

- Every 15 minutes if 1+ key changed
- Every 5 minutes if 10+ keys changed
- Every 1 minute if 10000+ keys changed

**AOF (Append Only File)**:

- Enabled with `everysec` fsync policy
- Automatic rewrite when file grows 100%
- Uses RDB preamble for faster loading

### Connection Settings

```conf
tcp-backlog 511
timeout 300
tcp-keepalive 300
maxclients 10000
```

## Files

### `Dockerfile`

Multi-stage production build with:

- Base: `redis:7-alpine`
- Security updates
- Non-root user (redis)
- Custom configuration
- Health checks
- Signal handling (dumb-init)

### `redis.conf`

Production configuration with:

- Network binding
- Memory management
- Persistence settings
- Connection limits
- Security options

### `.dockerignore`

Excludes temporary files from build context.

## Usage

### Build Image

```bash
docker compose build redis
```

### Start Service

```bash
docker compose up -d redis
```

### Check Status

```bash
docker compose ps redis
```

### Connect to Redis CLI

```bash
docker exec -it chloromaster-redis redis-cli
```

### Monitor Activity

```bash
# Real-time monitoring
docker exec -it chloromaster-redis redis-cli MONITOR

# Check memory usage
docker exec -it chloromaster-redis redis-cli INFO memory

# Check statistics
docker exec -it chloromaster-redis redis-cli INFO stats

# Check persistence status
docker exec -it chloromaster-redis redis-cli INFO persistence
```

## Commands

### Cache Management

```bash
# Check if key exists
docker exec chloromaster-redis redis-cli EXISTS mykey

# Get key value
docker exec chloromaster-redis redis-cli GET mykey

# Set key value with expiration
docker exec chloromaster-redis redis-cli SETEX mykey 3600 "value"

# Delete key
docker exec chloromaster-redis redis-cli DEL mykey

# Flush all data (⚠️ use with caution)
docker exec chloromaster-redis redis-cli FLUSHALL
```

### Performance Testing

```bash
# Benchmark
docker exec chloromaster-redis redis-cli --intrinsic-latency 100

# Connection test
docker exec chloromaster-redis redis-cli PING
# Expected: PONG
```

### Backup & Restore

```bash
# Create snapshot
docker exec chloromaster-redis redis-cli BGSAVE

# Check last save time
docker exec chloromaster-redis redis-cli LASTSAVE

# Copy backup
docker cp chloromaster-redis:/data/dump.rdb ./backup/

# Restore backup
docker cp ./backup/dump.rdb chloromaster-redis:/data/
docker compose restart redis
```

## Security

### Password Protection (Optional)

Uncomment in `redis.conf`:

```conf
requirepass YourStrongRedisPassword123!
```

Then connect with:

```bash
docker exec -it chloromaster-redis redis-cli -a YourStrongRedisPassword123!
```

### Network Security

- Binds to Docker network only (not exposed to host)
- Protected mode enabled
- Non-root user execution
- Minimal Linux capabilities

## Performance Tuning

### Memory Optimization

Adjust in `redis.conf`:

```conf
# Increase memory limit
maxmemory 512mb

# Change eviction policy
maxmemory-policy allkeys-lfu  # Least Frequently Used
```

### Persistence Tuning

```conf
# More frequent snapshots
save 60 1000

# Disable AOF for pure cache
appendonly no
```

### Connection Tuning

```conf
# Increase client limit
maxclients 20000

# Adjust TCP backlog
tcp-backlog 1024
```

## Monitoring

### Key Metrics

```bash
# Connected clients
docker exec chloromaster-redis redis-cli INFO clients | grep connected_clients

# Memory usage
docker exec chloromaster-redis redis-cli INFO memory | grep used_memory_human

# Hit/miss ratio
docker exec chloromaster-redis redis-cli INFO stats | grep keyspace

# Operations per second
docker exec chloromaster-redis redis-cli INFO stats | grep instantaneous_ops_per_sec
```

### Logs

```bash
# View Redis logs
docker compose logs -f redis

# Last 100 lines
docker compose logs --tail=100 redis
```

## Troubleshooting

### Redis Not Starting

```bash
# Check logs
docker compose logs redis

# Verify configuration
docker exec chloromaster-redis redis-cli CONFIG GET "*"

# Test config file
docker run --rm -v $(pwd)/redis/redis.conf:/tmp/redis.conf redis:7-alpine redis-server /tmp/redis.conf --test-memory 256mb
```

### High Memory Usage

```bash
# Check memory
docker exec chloromaster-redis redis-cli INFO memory

# Analyze keys
docker exec chloromaster-redis redis-cli --bigkeys

# Force eviction
docker exec chloromaster-redis redis-cli CONFIG SET maxmemory 128mb
```

### Slow Performance

```bash
# Check slow log
docker exec chloromaster-redis redis-cli SLOWLOG GET 10

# Monitor latency
docker exec chloromaster-redis redis-cli --latency

# Check stats
docker exec chloromaster-redis redis-cli INFO stats
```

## Integration with Nginx

Redis is used by Nginx as an upstream for caching. See `nginx/default.conf`:

```nginx
upstream redis {
    server redis:6379;
    keepalive 16;
    keepalive_timeout 60s;
}
```

## Health Checks

Docker automatically monitors Redis health:

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 10s
  timeout: 3s
  retries: 3
```

Service is considered healthy when `redis-cli ping` returns `PONG`.

## Resource Limits

### Docker Compose Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### Redis Internal Limits

- Max memory: 256MB (configurable)
- Max clients: 10,000 (configurable)
- Max databases: 16

## Production Checklist

- [x] Custom Dockerfile created
- [x] Production configuration optimized
- [x] Health checks enabled
- [x] Persistence configured (RDB + AOF)
- [x] Memory limits set
- [x] Connection pooling configured
- [x] Security hardened
- [x] Non-root user
- [x] Resource limits defined
- [ ] Password protection (optional, set if needed)
- [ ] Monitoring connected (optional)
- [ ] Backup automation (recommended)

## Additional Resources

- **Redis Documentation**: <https://redis.io/documentation>
- **Redis Configuration**: <https://redis.io/topics/config>
- **Redis Persistence**: <https://redis.io/topics/persistence>
- **Redis Security**: <https://redis.io/topics/security>

---

**Version**: 2.0  
**Updated**: January 2, 2026  
**Status**: Production Ready ✅
