# ==========================================
# Multi-stage Dockerfile for .NET 8 Backend API
# ==========================================

# Stage 1: Base runtime with security updates
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Install curl for health checks and security updates
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 -s /bin/bash dotnetapp

WORKDIR /app
EXPOSE 5000

# Stage 2: Build dependencies
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS restore
WORKDIR /src

# Copy project files for restore (leverage caching)
COPY ["src/ChloroMaster.API/ChloroMaster.API.csproj", "src/ChloroMaster.API/"]
COPY ["src/ChloroMaster.Core/ChloroMaster.Core.csproj", "src/ChloroMaster.Core/"]
COPY ["src/ChloroMaster.Infrastructure/ChloroMaster.Infrastructure.csproj", "src/ChloroMaster.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "src/ChloroMaster.API/ChloroMaster.API.csproj"

# Stage 3: Build application
FROM restore AS build

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/src/ChloroMaster.API"
RUN dotnet build "ChloroMaster.API.csproj" \
    -c Release \
    -o /app/build

# Stage 4: Publish application
FROM build AS publish
WORKDIR "/src/src/ChloroMaster.API"
RUN dotnet publish "ChloroMaster.API.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# Stage 5: Final runtime image
FROM base AS final
WORKDIR /app

# Install sqlite3 for migrations
RUN apt-get update && \
    apt-get install -y --no-install-recommends sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Copy published application
COPY --from=publish --chown=dotnetapp:dotnetapp /app/publish .

# Copy migration scripts and SQL files
COPY --chown=dotnetapp:dotnetapp migrations /app/migrations
COPY --chown=dotnetapp:dotnetapp scripts /app/scripts

# Create data and logs directories with proper permissions
RUN mkdir -p /app/data /app/logs && \
    chmod +x /app/scripts/*.sh && \
    chown -R dotnetapp:dotnetapp /app

# Switch to non-root user
USER dotnetapp

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["dotnet", "ChloroMaster.API.dll"]
