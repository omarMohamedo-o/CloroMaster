FROM prom/prometheus:latest

# Copy custom configuration
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Expose Prometheus port
EXPOSE 9090

# Use default entrypoint and command
CMD ["--config.file=/etc/prometheus/prometheus.yml", \
    "--storage.tsdb.path=/prometheus", \
    "--web.enable-lifecycle"]
