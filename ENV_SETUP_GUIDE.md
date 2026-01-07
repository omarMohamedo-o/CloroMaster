# Environment Variables Guide

## Overview

All sensitive credentials and configuration are now stored in environment variables instead of hardcoded in the source code.

## Files Created

- `.env` - Production environment variables (DO NOT COMMIT)
- `.env.example` - Template for environment variables (safe to commit)
- `backend/.env.development` - Development-specific variables
- `.gitignore.security` - Additional gitignore rules for sensitive files

## Usage

### For Development

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values

3. Load environment variables:

   ```bash
   # Linux/Mac
   export $(cat .env | xargs)
   
   # Or use dotenv
   dotenv run your_command
   ```

### For Docker

Add environment variables to `docker-compose.yml`:

```yaml
services:
  backend:
    env_file:
      - .env
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
```

### For Kubernetes

Create a Secret:

```bash
kubectl create secret generic chloromaster-secrets \
  --from-env-file=.env \
  --namespace=chloromaster
```

## Environment Variables

### Security

- `SECURITY_PASSWORD_SALT` - Salt for password hashing
- `ADMIN_PASSWORD` - Current admin password
- `ADMIN_PASSWORD_HASH` - Pre-computed password hash
- `JWT_SECRET_KEY` - Secret key for JWT token signing

### Admin Account

- `ADMIN_USERNAME` - Admin username
- `ADMIN_EMAIL` - Admin email
- `ADMIN_FULLNAME` - Admin display name

### Database

- `DATABASE_CONNECTION_STRING` - SQLite connection string

### SMTP

- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port
- `SMTP_FROM_EMAIL` - From email address
- `SMTP_FROM_NAME` - From display name
- `SMTP_USE_SSL` - Enable SSL/TLS
- `SMTP_USERNAME` - SMTP authentication username
- `SMTP_PASSWORD` - SMTP authentication password

### API

- `API_BASE_URL` - Backend API URL
- `FRONTEND_URL` - Frontend application URL

### Rate Limiting

- `RATE_LIMIT_REQUESTS_PER_MINUTE` - General API rate limit
- `RATE_LIMIT_REQUESTS_PER_HOUR` - Hourly API rate limit
- `RATE_LIMIT_LOGIN_ATTEMPTS_PER_MINUTE` - Login attempts limit
- `RATE_LIMIT_CONTACT_SUBMISSIONS_PER_HOUR` - Contact form limit

## Security Best Practices

1. **Never commit `.env` files to version control**
2. **Use strong, unique passwords for each environment**
3. **Rotate secrets regularly (every 90 days)**
4. **Use different values for development/staging/production**
5. **Limit access to `.env` files (chmod 600)**
6. **Use secret management tools in production (Vault, AWS Secrets Manager)**

## Password Generation

Generate secure passwords using GenHash.cs:

```bash
cd backend
export ADMIN_PASSWORD="your_new_password"
export SECURITY_PASSWORD_SALT="your_salt"
dotnet run --project GenHash.cs
```

## Troubleshooting

### Environment variables not loading

- Check file permissions: `chmod 600 .env`
- Verify file encoding (UTF-8 without BOM)
- Ensure no spaces around `=` in `.env` file
- Check for quotes if values contain spaces

### Docker not reading .env

- Verify `env_file` is specified in docker-compose.yml
- Restart containers: `docker-compose restart`
- Check logs: `docker-compose logs backend`

## Migration from Hardcoded Values

All hardcoded credentials have been removed from:

- ✅ `GenHash.cs` - Now reads from environment
- ✅ `AdminController.cs` - Uses IConfiguration
- ✅ `PasswordHelper.cs` - Uses configuration/environment
- ✅ All translation files - Removed password hints

## Production Deployment Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Generate strong random passwords
- [ ] Set unique JWT secret (min 32 characters)
- [ ] Configure SMTP credentials
- [ ] Set correct URLs for API and frontend
- [ ] Review and adjust rate limits
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Set proper file permissions (`chmod 600 .env`)
- [ ] Backup `.env` securely (encrypted)
- [ ] Document where secrets are stored
