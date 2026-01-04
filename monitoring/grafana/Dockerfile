# ==========================================
# Production-Optimized Grafana (Alpine)
# ==========================================

FROM grafana/grafana:11.4.0 AS production

# Metadata
LABEL maintainer="ChloroMaster Engineering" \
    description="Production Grafana dashboards" \
    version="2.0"

# Install plugins (as root) - minimal set
USER root

RUN grafana-cli plugins install grafana-piechart-panel && \
    grafana-cli plugins install grafana-clock-panel && \
    rm -rf /var/lib/grafana/plugins/*/.git /var/lib/grafana/plugins/*/img

# Copy configurations
COPY provisioning/ /etc/grafana/provisioning/
COPY dashboards/ /var/lib/grafana/dashboards/
COPY grafana.ini /etc/grafana/grafana.ini

# Create necessary directories and set permissions (UID 472 is grafana user in official image)
RUN mkdir -p /var/lib/grafana/data \
    /var/lib/grafana/logs \
    /var/lib/grafana/plugins && \
    chown -R 472:0 /var/lib/grafana /etc/grafana /var/log/grafana && \
    chmod -R 775 /var/lib/grafana

# Switch to grafana user (UID 472)
USER 472

# Expose Grafana port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start Grafana
ENTRYPOINT ["/run.sh"]
