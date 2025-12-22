# Production-ready Grafana with pre-configured dashboards
FROM grafana/grafana:11.4.0-ubuntu

# Install plugins
RUN grafana cli plugins install grafana-piechart-panel && \
    grafana cli plugins install grafana-clock-panel

# Copy provisioning configs (datasources, dashboards, etc.)
COPY provisioning/ /etc/grafana/provisioning/

# Copy custom dashboards
COPY dashboards/ /var/lib/grafana/dashboards/

# Copy custom grafana.ini if needed
COPY grafana.ini /etc/grafana/grafana.ini

# Set permissions
USER root
RUN chown -R grafana:grafana /etc/grafana/provisioning /var/lib/grafana/dashboards
USER grafana

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
