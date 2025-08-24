FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY ["src/ChloroMaster.API/ChloroMaster.API.csproj", "src/ChloroMaster.API/"]
COPY ["src/ChloroMaster.Core/ChloroMaster.Core.csproj", "src/ChloroMaster.Core/"]
COPY ["src/ChloroMaster.Infrastructure/ChloroMaster.Infrastructure.csproj", "src/ChloroMaster.Infrastructure/"]
COPY ["src/ChloroMaster.Application/ChloroMaster.Application.csproj", "src/ChloroMaster.Application/"]

# Restore dependencies
RUN dotnet restore "src/ChloroMaster.API/ChloroMaster.API.csproj"

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/src/ChloroMaster.API"
RUN dotnet build "ChloroMaster.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ChloroMaster.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENTRYPOINT ["dotnet", "ChloroMaster.API.dll"]
