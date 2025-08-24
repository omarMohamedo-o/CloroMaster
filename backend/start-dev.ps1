# ChloroMaster Backend Development Startup Script
# This script sets up and starts the development environment

Write-Host "🚀 Starting ChloroMaster Backend Development Environment..." -ForegroundColor Green

# Check if .NET 9 is installed
Write-Host "Checking .NET 9 installation..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    if ($dotnetVersion -like "9.*") {
        Write-Host "✅ .NET 9 found: $dotnetVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ .NET 9 not found. Please install .NET 9 SDK" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ .NET not found. Please install .NET 9 SDK" -ForegroundColor Red
    exit 1
}

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop" -ForegroundColor Red
    exit 1
}

# Create logs directory if it doesn't exist
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
    Write-Host "📁 Created logs directory" -ForegroundColor Green
}

# Start the development environment
Write-Host "Starting development environment with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be ready
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "Checking service status..." -ForegroundColor Yellow
docker-compose ps

# Build and run the API
Write-Host "Building and starting the API..." -ForegroundColor Yellow
dotnet restore
dotnet build

Write-Host "🎉 Development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 API Endpoints:" -ForegroundColor Cyan
Write-Host "   • API: http://localhost:5000" -ForegroundColor White
Write-Host "   • Swagger: http://localhost:5000/swagger" -ForegroundColor White
Write-Host ""
Write-Host "🗄️  Database:" -ForegroundColor Cyan
Write-Host "   • SQL Server: localhost:1433" -ForegroundColor White
Write-Host "   • Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Default Admin Credentials:" -ForegroundColor Cyan
Write-Host "   • Email: admin@chloromaster.com" -ForegroundColor White
Write-Host "   • Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "💡 To stop the environment, run: docker-compose down" -ForegroundColor Yellow
Write-Host "💡 To view logs, run: docker-compose logs -f api" -ForegroundColor Yellow
