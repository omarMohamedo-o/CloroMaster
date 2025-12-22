# ==========================================
# Multi-stage Dockerfile for Nginx Reverse Proxy
# ==========================================

# Stage 1: Base with security updates
FROM nginx:1.25-alpine AS base

# Install security updates and required tools
RUN apk upgrade --no-cache && \
    apk add --no-cache curl dumb-init && \
    rm -rf /var/cache/apk/*

# Stage 2: Production Runner
FROM base AS runner

# Create non-root user
RUN addgroup -g 1001 -S nginxapp && \
    adduser -S nginxapp -u 1001 -G nginxapp

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
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
    chmod -R 777 /var/cache/nginx /var/log/nginx /var/run /tmp/nginx && \
    touch /var/run/nginx.pid && \
    chown nginxapp:nginxapp /var/run/nginx.pid && \
    chmod 666 /var/run/nginx.pid

# Create health check endpoint
RUN echo "OK" > /usr/share/nginx/html/health

# Switch to non-root user
USER nginxapp

# Expose non-privileged port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start nginx with dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
