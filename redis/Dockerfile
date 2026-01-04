# ==========================================
# Production-Optimized Redis Cache
# ==========================================

FROM redis:7-alpine AS production

# Metadata
LABEL maintainer="ChloroMaster Engineering" \
    description="Production Redis cache with optimized configuration" \
    version="2.0"

# Security updates
RUN apk upgrade --no-cache && \
    apk add --no-cache tzdata dumb-init && \
    rm -rf /var/cache/apk/* && \
    mkdir -p /data && \
    chown -R redis:redis /data

# Copy custom Redis configuration
COPY redis.conf /usr/local/etc/redis/redis.conf

# Switch to non-root user
USER redis

# Expose Redis port
EXPOSE 6379

# Health check
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
    CMD redis-cli ping || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start Redis with custom config
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
