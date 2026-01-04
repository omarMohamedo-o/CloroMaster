# ============================================
# Production-Optimized Frontend Dockerfile
# Multi-stage build with minimal layers
# ============================================

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files (layer caching optimization)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && \
    npm cache clean --force

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install --ignore-scripts --no-audit --no-fund

# Copy source code (specific directories only)
COPY public ./public
COPY src ./src
COPY postcss.config.js tailwind.config.js ./

# Build optimizations
ENV NODE_ENV=production \
    GENERATE_SOURCEMAP=false \
    INLINE_RUNTIME_CHUNK=false \
    IMAGE_INLINE_SIZE_LIMIT=0

# Build application with optimizations
RUN npm run build && \
    rm -rf node_modules && \
    npm cache clean --force && \
    find /app/build -type f -name '*.map' -delete && \
    find /app/build -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -exec gzip -k {} \;

# ============================================
# Stage 3: Nginx Production Runtime
# ============================================
FROM nginx:1.27-alpine AS production

# Metadata
LABEL maintainer="ChloroMaster Engineering" \
    description="Production React frontend with Nginx" \
    version="2.0"

# Security updates and minimal tools (single layer)
RUN apk upgrade --no-cache && \
    apk add --no-cache curl dumb-init tzdata && \
    rm -rf /var/cache/apk/* && \
    addgroup -g 101 -S nginx 2>/dev/null || true && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx 2>/dev/null || true && \
    mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/run \
    /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html && \
    rm -f /etc/nginx/conf.d/default.conf

# Copy nginx configurations (single layer)
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx nginx-security.conf /etc/nginx/conf.d/security.conf

# Copy built application from builder (permissions set via COPY)
COPY --from=builder --chown=nginx:nginx --chmod=755 /app/build /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
