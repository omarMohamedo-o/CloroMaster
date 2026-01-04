# ==========================================
# Production-Optimized Prometheus
# ==========================================

FROM prom/prometheus:v2.48.1 AS production

# Metadata
LABEL maintainer="ChloroMaster Engineering" \
    description="Production Prometheus monitoring" \
    version="2.0"

# Copy custom configuration
COPY --chown=nobody:nobody prometheus.yml /etc/prometheus/prometheus.yml

# Create necessary directories
RUN mkdir -p /prometheus && \
    chown -R nobody:nobody /prometheus /etc/prometheus

# Switch to non-root user
USER nobody

# Expose Prometheus port
EXPOSE 9090

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:9090/-/healthy || exit 1

# Start Prometheus with optimized settings
CMD ["--config.file=/etc/prometheus/prometheus.yml", \
    "--storage.tsdb.path=/prometheus", \
    "--storage.tsdb.retention.time=7d", \
    "--storage.tsdb.retention.size=5GB", \
    "--web.enable-lifecycle", \
    "--web.console.libraries=/usr/share/prometheus/console_libraries", \
    "--web.console.templates=/usr/share/prometheus/consoles"]
