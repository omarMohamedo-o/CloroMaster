# ==========================================
# Production-Optimized Backend Dockerfile
# Multi-stage build with minimal layers
# ==========================================

# ==========================================
# Stage 1: Build
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build

WORKDIR /src

# Copy and restore (layer caching)
COPY src/ChloroMaster.API/ChloroMaster.API.csproj src/ChloroMaster.API/
COPY src/ChloroMaster.Core/ChloroMaster.Core.csproj src/ChloroMaster.Core/
COPY src/ChloroMaster.Infrastructure/ChloroMaster.Infrastructure.csproj src/ChloroMaster.Infrastructure/

RUN dotnet restore src/ChloroMaster.API/ChloroMaster.API.csproj

# Copy source and publish in one layer
COPY src/ src/
WORKDIR /src/src/ChloroMaster.API

RUN dotnet publish ChloroMaster.API.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false \
    /p:PublishTrimmed=false \
    /p:PublishSingleFile=false

# ==========================================
# Stage 2: Production Runtime
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final

# Metadata
LABEL maintainer="ChloroMaster Engineering" \
    description="Production .NET 8 API" \
    version="2.0"

# Runtime optimizations
ENV ASPNETCORE_URLS=http://+:5000 \
    DOTNET_EnableDiagnostics=0 \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=true \
    ASPNETCORE_ENVIRONMENT=Production

WORKDIR /app

# Install runtime tools and create user (single layer)
RUN apk add --no-cache curl sqlite tzdata && \
    rm -rf /var/cache/apk/* && \
    addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser && \
    mkdir -p /app/data /app/logs && \
    chown -R appuser:appgroup /app

# Copy published app and scripts
COPY --from=build --chown=appuser:appgroup /app/publish .
COPY --chown=appuser:appgroup migrations /app/migrations
COPY --chown=appuser:appgroup scripts /app/scripts

# Set script permissions
RUN chmod +x /app/scripts/*.sh

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["dotnet", "ChloroMaster.API.dll"]
