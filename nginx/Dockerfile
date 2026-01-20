# ==========================================
# Production-Optimized Nginx Reverse Proxy
# Multi-stage build with minimal layers
# ==========================================

FROM nginx:1.25-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf || true

# Copy configs and SSL
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/
COPY ssl/ /etc/nginx/ssl/

# Secure permissions for SSL certs
RUN chmod 600 /etc/nginx/ssl/* || true

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
