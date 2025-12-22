# ChloroMaster - Full-Stack Application

A modern, professional website for ChloroMaster - Sustainable Design and Eco Consulting Services, built with React frontend and .NET 9 backend.

## 📚 Documentation

### 🚀 Getting Started

- **[Docker Compose Guide](DOCKER_COMPOSE_GUIDE.md)** ⭐ - Choose the right docker-compose file
- **[Kubernetes Guide](KUBERNETES_GUIDE.md)** - Complete K8s deployment guide
- **[Admin Dashboard Guide](ADMIN_DASHBOARD_GUIDE.md)** 🔐 - Access and manage your admin panel

### 📖 Reference

- **[Architecture Overview](ARCHITECTURE.md)** - System design and components
- **[Docker Guide](DOCKER.md)** - Container setup and configuration
- **[Database Migrations](MIGRATIONS.md)** - Migration management and best practices
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Production deployment steps

### 🔧 Advanced

- **[Custom Metrics HPA](k8s/CUSTOM_METRICS_HPA.md)** - Advanced auto-scaling guide
- **[K8s Implementation](K8S_IMPLEMENTATION.md)** - Complete K8s setup details
- **[Project Status](PROJECT_STATUS.md)** - Current implementation status

## 🏗️ Architecture Overview

### Frontend (React)

- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth, professional animations
- **Icons**: React Icons (Font Awesome, Feather, etc.)
- **Responsive**: Mobile-first design with dark mode support

### Backend (.NET 9)

- **Framework**: .NET 9 with ASP.NET Core 8
- **Architecture**: Clean Architecture with layered approach
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT-based authentication
- **API**: RESTful API with Swagger documentation
- **Logging**: Serilog with structured logging
- **Validation**: FluentValidation for request validation

## 🚀 Quick Start

### Prerequisites

- **.NET 9 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop)
- **SQL Server** (or use Docker)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd CloroMaster
```

### 2. Start Backend

```bash
cd backend

# Option 1: Using Docker (Recommended)
docker compose up -d

# Option 2: Using PowerShell script
./start-dev.ps1

# Option 3: Manual setup
dotnet restore
dotnet build
dotnet run --project src/ChloroMaster.API
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm start
```

### 4. Access Applications

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:5000>
- **API Documentation**: <http://localhost:5000/swagger>
- **Database**: localhost:1433 (SQL Server)

## 🏛️ Project Structure

```
CloroMaster/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   ├── config/          # Configuration files
│   │   └── assets/          # Images and static assets
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
├── backend/                  # .NET backend application
│   ├── src/
│   │   ├── ChloroMaster.API/           # Web API layer
│   │   ├── ChloroMaster.Core/          # Domain models & DTOs
│   │   ├── ChloroMaster.Infrastructure/# Data access & external services
│   │   └── ChloroMaster.Application/   # Application services & controllers
│   ├── docker-compose.yml   # Docker services configuration
│   ├── Dockerfile           # Backend container configuration
│   └── start-dev.ps1        # Development startup script
└── README.md                # This file
```

## 🔧 Backend Architecture

### Layer Structure

1. **API Layer** (`ChloroMaster.API`)
   - Controllers and middleware
   - Configuration and dependency injection
   - Authentication and authorization setup

2. **Application Layer** (`ChloroMaster.Application`)
   - Controllers and application services
   - Request/response handling
   - Business logic orchestration

3. **Infrastructure Layer** (`ChloroMaster.Infrastructure`)
   - Data access (Entity Framework)
   - External service integrations
   - Email service implementation

4. **Core Layer** (`ChloroMaster.Core`)
   - Domain models and entities
   - DTOs and interfaces
   - Business rules and validation

### Key Features

- **JWT Authentication**: Secure API access with role-based authorization
- **Entity Framework**: Code-first database approach with migrations
- **AutoMapper**: Clean object mapping between layers
- **Serilog**: Structured logging with file and console outputs
- **Swagger**: Interactive API documentation
- **CORS**: Cross-origin resource sharing for frontend integration
- **Validation**: Request validation with FluentValidation
- **Error Handling**: Global exception handling middleware

## 🎨 Frontend Architecture

### Component Structure

- **Navbar**: Navigation with dark mode toggle
- **Hero**: Main landing section with animated statistics
- **ServicesGrid**: Interactive services showcase with filtering
- **About**: Company information with animated features
- **ContactForm**: Integrated contact form with backend API
- **Footer**: Company links and social media

### Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Animations**: Smooth animations using Framer Motion
- **API Integration**: Real-time communication with backend
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: User-friendly error messages and loading states

## 🗄️ Database Schema

### Core Entities

- **Users**: Authentication and user management
- **Contacts**: Contact form submissions
- **Services**: Company service catalog

### Sample Data

The application includes seed data for:

- Default admin user (<admin@chloromaster.com> / Admin123!)
- Sample services (Sustainable Design, Eco Consulting, Green Technology)

## 🔐 Authentication & Security

### JWT Configuration

- **Issuer**: <https://chloromaster.com>
- **Audience**: <https://chloromaster.com>
- **Expiry**: 60 minutes (configurable)
- **Algorithm**: HMAC-SHA256

### Role-Based Access

- **Admin**: Full access to all endpoints
- **User**: Limited access to public endpoints

## 📧 Email Service

### Configuration

- **SMTP Server**: Gmail (configurable)
- **Port**: 587 (TLS)
- **Authentication**: Username/password or app password

### Email Types

- **Contact Notifications**: Admin and user confirmations
- **Welcome Emails**: User registration confirmations

## 🐳 Docker Support

### Services

- **API**: .NET 9 application
- **SQL Server**: Database server
- **Redis**: Caching (optional)

### Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f api

# Stop services
docker compose down

# Rebuild and start
docker compose up -d --build
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
dotnet test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 📊 Monitoring & Logging

### Logging

- **Console**: Development logging
- **File**: Daily rolling log files
- **Structured**: JSON format for production

### Health Checks

- **Database**: Connection status
- **Services**: Service availability
- **API**: Endpoint responsiveness

## 🚀 Deployment

### Backend Deployment

1. Build Docker image: `docker build -t chloromaster-api .`
2. Configure environment variables
3. Deploy to container platform (Azure, AWS, etc.)

### Frontend Deployment

1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure API endpoint for production

## 🔧 Configuration

### Environment Variables

- **API_URL**: Backend API endpoint
- **JWT_KEY**: Secret key for JWT tokens
- **SMTP_CREDENTIALS**: Email service configuration
- **DATABASE_CONNECTION**: Database connection string

### Configuration Files

- **appsettings.json**: Backend configuration
- **config.js**: Frontend configuration
- **docker-compose.yml**: Docker services configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Email**: <info@chloromaster.com>
- **Phone**: +20 3 486 0034
- **Address**: 336 El Geish Road, Royal Plaza, Building D, Mezzanine floor, Gleem 21500, Alexandria, Egypt

## 🎯 Roadmap

### Phase 1 (Current)

- ✅ Basic website with animations
- ✅ Contact form integration
- ✅ JWT authentication
- ✅ Service catalog

### Phase 2 (Future)

- 🔄 User dashboard
- 🔄 Service booking system
- 🔄 Payment integration
- 🔄 Admin panel

### Phase 3 (Future)

- 🔄 Mobile application
- 🔄 Advanced analytics
- 🔄 Multi-language support
- 🔄 API rate limiting

---

**Built with ❤️ by the ChloroMaster Team**
