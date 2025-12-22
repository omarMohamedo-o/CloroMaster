# ============================================
# Stage 1: Dependencies (Optimized Layer)
# ============================================
FROM node:18-alpine AS deps

WORKDIR /app

# Copy only package files for better layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ============================================
# Stage 2: Builder (Development Build)
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Build optimizations
ENV NODE_ENV=production \
    GENERATE_SOURCEMAP=false \
    INLINE_RUNTIME_CHUNK=false

# Build the React application
RUN npm run build && \
    # Remove dev dependencies and keep only production node_modules
    rm -rf node_modules && \
    npm ci --only=production --ignore-scripts

# ============================================
# Stage 3: Production (Nginx with Security)
# ============================================
FROM nginx:1.27-alpine

# Metadata
LABEL maintainer="ChloroMaster Engineering"
LABEL description="Production-ready React frontend with Nginx"
LABEL version="1.0"

# Install security updates and minimal tools
RUN apk upgrade --no-cache && \
    apk add --no-cache \
    curl \
    dumb-init \
    tzdata && \
    rm -rf /var/cache/apk/*

# Create non-root user for nginx
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx 2>/dev/null || true

# Create necessary directories with proper permissions
RUN mkdir -p \
    /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/run \
    /var/log/nginx && \
    chown -R nginx:nginx \
    /var/cache/nginx \
    /var/run \
    /var/log/nginx \
    /etc/nginx/conf.d && \
    chmod -R 755 /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Remove default nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy optimized nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx nginx-security.conf /etc/nginx/conf.d/security.conf

# Copy built application from builder stage
COPY --from=builder --chown=nginx:nginx /app/build /usr/share/nginx/html

# Optimize file permissions for security
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
