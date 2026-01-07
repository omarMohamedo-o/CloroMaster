# ==========================================
# Production-Optimized Backend Dockerfile
# Multi-stage build with minimal layers
# ==========================================

# ==========================================
# Stage 1: Build
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0-jammy AS build

WORKDIR /src

# Copy and restore (layer caching)
COPY backend/src/ChloroMaster.API/ChloroMaster.API.csproj src/ChloroMaster.API/
COPY backend/src/ChloroMaster.Core/ChloroMaster.Core.csproj src/ChloroMaster.Core/
COPY backend/src/ChloroMaster.Infrastructure/ChloroMaster.Infrastructure.csproj src/ChloroMaster.Infrastructure/

RUN dotnet restore src/ChloroMaster.API/ChloroMaster.API.csproj

# Copy source and publish in one layer
COPY backend/src/ src/
WORKDIR /src/src/ChloroMaster.API

RUN dotnet publish ChloroMaster.API.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false \
    /p:PublishTrimmed=false \
    /p:PublishSingleFile=false

# ==========================================
# Frontend Build Stage
# ==========================================
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
# Use `npm install` here to avoid build failures when `package-lock.json` and
# `package.json` are slightly out of sync in the repo. This keeps the container
# build smooth; keep the repository lockfile in sync during development.
RUN npm install --no-audit --no-fund

# Copy frontend source files and build the application
COPY frontend/ .
RUN npm run build    # produces build/ (production)

# ==========================================
# Final Stage: Combine Backend and Frontend
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-jammy AS final

# Metadata
LABEL maintainer="ChloroMaster Engineering" \
    description="Production .NET 8 API with Frontend" \
    version="2.0"

# Runtime optimizations
ENV ASPNETCORE_URLS=http://+:5000 \
    DOTNET_EnableDiagnostics=0 \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=true \
    ASPNETCORE_ENVIRONMENT=Production

WORKDIR /app

# Install runtime tools and create user (single layer)
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    sqlite3 \
    tzdata \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -m appuser && \
    mkdir -p /app/data /app/logs /app/storage/datasheets && \
    chown -R appuser:appgroup /app

# Copy published app, scripts, and frontend build
COPY --from=build --chown=appuser:appgroup /app/publish .
COPY --chown=appuser:appgroup backend/migrations /app/migrations
COPY --chown=appuser:appgroup backend/scripts /app/scripts
COPY --chown=appuser:appgroup backend/storage/datasheets /app/storage/datasheets
COPY --from=frontend-build --chown=appuser:appgroup /app/build ./wwwroot

# Set script permissions
RUN chmod +x /app/scripts/*.sh

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["dotnet", "ChloroMaster.API.dll"]
