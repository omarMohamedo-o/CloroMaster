# ==========================================
# Production-Optimized Nginx Reverse Proxy
# Multi-stage build with minimal layers
# ==========================================

FROM nginx:1.27-alpine AS production

# Metadata
LABEL maintainer="ChloroMaster Engineering" \
    description="Production Nginx reverse proxy with Redis" \
    version="2.0"

# Security updates and tools (single layer)
RUN apk upgrade --no-cache && \
    apk add --no-cache curl dumb-init tzdata && \
    rm -rf /var/cache/apk/* && \
    addgroup -g 1001 -S nginxapp 2>/dev/null || true && \
    adduser -S nginxapp -u 1001 -G nginxapp 2>/dev/null || true && \
    rm -f /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/cache/nginx/static \
    /var/cache/nginx/api \
    /var/log/nginx \
    /var/run \
    /usr/share/nginx/html \
    /tmp/nginx && \
    chown -R nginxapp:nginxapp /var/cache/nginx \
    /var/log/nginx \
    /var/run \
    /usr/share/nginx/html \
    /etc/nginx/conf.d \
    /tmp/nginx && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html /tmp/nginx && \
    touch /var/run/nginx.pid && \
    chown nginxapp:nginxapp /var/run/nginx.pid && \
    chmod 666 /var/run/nginx.pid && \
    echo "OK" > /usr/share/nginx/html/health

# Copy configurations
COPY --chown=nginxapp:nginxapp nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginxapp:nginxapp default.conf /etc/nginx/conf.d/default.conf

USER nginxapp

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
