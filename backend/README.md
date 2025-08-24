# ChloroMaster Backend - .NET 8 API

A modern, scalable backend API for the ChloroMaster sustainable solutions platform, built with .NET 8 and designed to integrate seamlessly with the existing React frontend.

## 🚀 Features

- **Modern .NET 8 Architecture** - Built with the latest .NET 8 features
- **Clean Architecture** - Separation of concerns with Core, Infrastructure, and Application layers
- **Entity Framework Core** - SQL Server database with code-first approach
- **JWT Authentication** - Secure user authentication and authorization
- **Email Service** - Automated email notifications for contact form submissions
- **Contact Management** - Full CRUD operations for contact form submissions
- **Service Catalog** - Manage and display company services
- **Rate Limiting** - Protect against abuse with configurable rate limits
- **Logging** - Comprehensive logging with Serilog
- **CORS Support** - Configured for React frontend integration
- **Swagger Documentation** - Interactive API documentation
- **Docker Support** - Containerized development and deployment

## 🏗️ Architecture

```
ChloroMaster.Backend/
├── src/
│   ├── ChloroMaster.API/           # Main API project
│   ├── ChloroMaster.Core/          # Domain models and DTOs
│   ├── ChloroMaster.Infrastructure/# Data access and external services
│   └── ChloroMaster.Application/   # Controllers and application logic
├── Dockerfile                      # Container configuration
├── docker-compose.yml             # Development environment
└── ChloroMaster.sln               # Solution file
```

### Layer Responsibilities

- **Core**: Domain models, DTOs, and business logic
- **Infrastructure**: Database context, services, and external integrations
- **Application**: Controllers, middleware, and API endpoints
- **API**: Configuration, dependency injection, and startup

## 🛠️ Technology Stack

- **.NET 8** - Latest .NET framework
- **ASP.NET Core 8** - Web framework
- **Entity Framework Core 8** - ORM for database operations
- **SQL Server** - Primary database
- **Redis** - Caching and session storage
- **JWT** - Authentication tokens
- **Serilog** - Structured logging
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **Swagger/OpenAPI** - API documentation

## 📋 Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB, Express, or Developer Edition)
- Docker (optional, for containerized development)
- Visual Studio 2022 or VS Code

## 🚀 Getting Started

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Update connection string** in `src/ChloroMaster.API/appsettings.json`
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ChloroMasterDB;Trusted_Connection=true;MultipleActiveResultSets=true"
   }
   ```

3. **Update email settings** (optional)
   ```json
   "Email": {
     "SmtpServer": "smtp.gmail.com",
     "SmtpPort": 587,
     "SmtpUsername": "your-email@gmail.com",
     "SmtpPassword": "your-app-password"
   }
   ```

4. **Restore packages and run**
   ```bash
   dotnet restore
   dotnet run --project src/ChloroMaster.API
   ```

### Option 2: Docker Development

1. **Start the development environment**
   ```bash
   docker-compose up -d
   ```

2. **Access the API**
   - API: http://localhost:5000
   - Swagger: http://localhost:5000/swagger
   - SQL Server: localhost:1433
   - Redis: localhost:6379

## 🔐 Authentication

The API uses JWT tokens for authentication. Default admin credentials:

- **Email**: admin@chloromaster.com
- **Password**: Admin123!

### JWT Configuration

Update the JWT settings in `appsettings.json`:

```json
"Jwt": {
  "Key": "YourSuperSecretKeyHereMakeItLongAndSecure123!@#",
  "Issuer": "https://chloromaster.com",
  "Audience": "https://chloromaster.com",
  "ExpiryInMinutes": 60
}
```

## 📚 API Endpoints

### Public Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/contact` - Submit contact form
- `GET /api/services` - Get all services
- `GET /api/services/{id}` - Get service by ID
- `GET /api/services/category/{category}` - Get services by category
- `GET /api/services/categories` - Get all categories

### Protected Endpoints (Admin Only)

- `GET /api/contact` - Get all contacts
- `GET /api/contact/{id}` - Get contact by ID
- `PUT /api/contact/{id}` - Update contact
- `DELETE /api/contact/{id}` - Delete contact
- `POST /api/services` - Create new service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

## 🗄️ Database

The application uses Entity Framework Core with SQL Server. The database will be created automatically on first run.

### Key Entities

- **Contact** - Contact form submissions
- **Service** - Company services and offerings
- **User** - System users and authentication

### Database Seeding

Initial data is seeded automatically:
- Default admin user
- Sample services (Sustainable Design, Eco Consulting, Green Technology)

## 📧 Email Service

The email service automatically sends notifications when:
- Contact form is submitted (admin notification + user confirmation)
- New user registration (welcome email)

### Email Configuration

Update SMTP settings in `appsettings.json`:

```json
"Email": {
  "SmtpServer": "smtp.gmail.com",
  "SmtpPort": 587,
  "SmtpUsername": "your-email@gmail.com",
  "SmtpPassword": "your-app-password",
  "FromEmail": "noreply@chloromaster.com",
  "FromName": "ChloroMaster"
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin and User roles
- **Password Hashing** - BCrypt password encryption
- **Rate Limiting** - Configurable request limits
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Comprehensive request validation

## 📊 Monitoring & Logging

- **Serilog** - Structured logging with file and console outputs
- **Request Logging** - Track all API requests and responses
- **Exception Handling** - Centralized error handling and logging
- **Performance Metrics** - Request duration tracking

## 🐳 Docker Support

### Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Production Build

```bash
# Build the image
docker build -t chloromaster-api .

# Run the container
docker run -p 5000:5000 -p 5001:5001 chloromaster-api
```

## 🧪 Testing

Run the tests using:

```bash
dotnet test
```

## 📝 API Documentation

Once the application is running, access Swagger documentation at:
- **Development**: http://localhost:5000/swagger
- **Production**: https://your-domain.com/swagger

## 🔧 Configuration

### Environment Variables

- `ASPNETCORE_ENVIRONMENT` - Application environment
- `ConnectionStrings__DefaultConnection` - Database connection string
- `Jwt__Key` - JWT signing key
- `Jwt__Issuer` - JWT issuer
- `Jwt__Audience` - JWT audience

### App Settings

Key configuration sections:
- **ConnectionStrings** - Database connections
- **Jwt** - Authentication settings
- **Email** - SMTP configuration
- **Serilog** - Logging configuration

## 🚀 Deployment

### Local Deployment

1. Build the application
   ```bash
   dotnet publish -c Release
   ```

2. Deploy to IIS or run as a service

### Docker Deployment

1. Build and push the Docker image
2. Deploy using Docker Compose or Kubernetes

### Azure Deployment

1. Create an Azure App Service
2. Configure connection strings and app settings
3. Deploy using Azure DevOps or GitHub Actions

## 🤝 Integration with Frontend

The API is designed to work seamlessly with the existing React frontend:

- **CORS** configured for React development servers
- **Contact Form** endpoint matches frontend form structure
- **Services API** provides data for the services grid
- **Authentication** ready for future frontend user features

## 📈 Performance Considerations

- **Response Compression** - Gzip compression for responses
- **Async Operations** - Non-blocking database operations
- **Connection Pooling** - Efficient database connections
- **Caching Ready** - Redis integration for future caching

## 🔮 Future Enhancements

- **File Upload Service** - Handle document and image uploads
- **Notification Service** - Real-time notifications
- **Analytics Service** - Track user interactions
- **Payment Integration** - Online payment processing
- **Multi-tenancy** - Support for multiple organizations

## 📞 Support

For questions or issues:
- Check the API documentation at `/swagger`
- Review the logs in the `logs/` directory
- Contact the development team

## 📄 License

This project is proprietary to ChloroMaster. All rights reserved.
