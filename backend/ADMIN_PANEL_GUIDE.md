# Admin Panel Setup Guide

## Overview

The ChloroMaster admin panel provides a comprehensive dashboard to track website visitors and manage contact form submissions.

## Features

### 📊 Dashboard Statistics

- **Total Visitors**: Track all website visits
- **Today's Visitors**: Real-time daily traffic
- **Total Submissions**: All contact form submissions
- **Today's Submissions**: Daily form activity
- **Unread Submissions**: Pending messages count
- **Conversion Rate**: Visitor to submission ratio
- **Top Traffic Sources**: Referrer analysis
- **Top Pages**: Most visited pages

### 📝 Submission Management

- View all contact form submissions
- Filter by read/unread status
- Search by name, email, company, or message
- Mark messages as read/unread
- Delete submissions
- View detailed submission information including:
  - Contact details (name, email, phone)
  - Company information (company, industry, country, postal code)
  - Message content
  - Submission metadata (date, IP, user agent)

### 👥 Visitor Analytics

- Page visit tracking
- Country and city statistics
- Device type breakdown (Mobile, Tablet, Desktop)
- Browser statistics
- Session duration tracking
- Daily visit trends

## Backend API

### Admin Controller (`/api/admin`)

#### Authentication

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}

Response:
{
  "token": "...",
  "username": "admin",
  "email": "admin@chloromaster.com",
  "fullName": "Administrator"
}
```

#### Dashboard Stats

```http
GET /api/admin/dashboard/stats

Response:
{
  "totalVisitors": 1250,
  "todayVisitors": 45,
  "totalSubmissions": 89,
  "todaySubmissions": 3,
  "unreadSubmissions": 7,
  "conversionRate": 7.12,
  "topTrafficSources": [...],
  "topPages": [...]
}
```

#### Get Submissions (Paginated)

```http
GET /api/admin/submissions?page=1&pageSize=10&isRead=false&search=test

Response:
{
  "data": [...],
  "page": 1,
  "pageSize": 10,
  "total": 89,
  "totalPages": 9
}
```

#### Get Submission Detail

```http
GET /api/admin/submissions/123

Response:
{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Example Corp",
  "industry": "Technology",
  "country": "USA",
  "postalCode": "12345",
  "message": "...",
  "receiveEmails": true,
  "submittedAt": "2025-01-15T10:30:00Z",
  "isRead": false,
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

#### Mark as Read/Unread

```http
PATCH /api/admin/submissions/123/read
Content-Type: application/json

true  // or false
```

#### Delete Submission

```http
DELETE /api/admin/submissions/123
```

#### Visitor Statistics

```http
GET /api/admin/visitors/stats?startDate=2025-01-01&endDate=2025-01-31

Response:
{
  "totalVisits": 1250,
  "dailyVisits": [...],
  "countryStats": [...],
  "deviceStats": [...]
}
```

### PageVisit Controller (`/api/pagevisit`)

#### Track Page Visit

```http
POST /api/pagevisit
Content-Type: application/json

{
  "pageUrl": "/services",
  "pageTitle": "Our Services",
  "referrer": "https://google.com",
  "country": "USA",
  "city": "New York",
  "sessionDuration": 120
}
```

## Database Schema

### ContactSubmissions Table

```sql
- Id (int, primary key)
- FirstName (string, required, max 100)
- LastName (string, required, max 100)
- Email (string, required, max 200)
- Phone (string, required, max 20)
- Company (string, nullable, max 200)
- Industry (string, nullable, max 100)
- Country (string, nullable, max 100)
- PostalCode (string, nullable, max 20)
- Message (string, required)
- ReceiveEmails (bool)
- SubmittedAt (datetime, indexed)
- IsRead (bool, indexed)
- IpAddress (string, nullable)
- UserAgent (string, nullable)

Indexes:
- IX_ContactSubmissions_SubmittedAt
- IX_ContactSubmissions_Email
- IX_ContactSubmissions_IsRead
```

### PageVisits Table

```sql
- Id (int, primary key)
- PageUrl (string, required, max 500)
- PageTitle (string, nullable, max 200)
- Referrer (string, nullable, max 500)
- VisitedAt (datetime, indexed)
- IpAddress (string, nullable, max 50)
- UserAgent (string, nullable)
- Country (string, nullable, max 100)
- City (string, nullable, max 100)
- DeviceType (string, nullable, max 20)
- Browser (string, nullable, max 50)
- SessionDuration (int, nullable)

Indexes:
- IX_PageVisits_VisitedAt
- IX_PageVisits_PageUrl
```

### AdminUsers Table

```sql
- Id (int, primary key)
- Username (string, required, unique, max 50)
- PasswordHash (string, required)
- Email (string, required, unique, max 200)
- FullName (string, required, max 100)
- IsActive (bool)
- CreatedAt (datetime)
- LastLoginAt (datetime, nullable)

Indexes:
- IX_AdminUsers_Username (unique)
- IX_AdminUsers_Email (unique)
```

## Security

### Password Hashing

- Uses SHA256 with salt
- Salt: `ChloroMasterSalt2025` (configurable in appsettings.json)
- Default admin password: `Admin@123` (CHANGE IMMEDIATELY)

### Configuration (appsettings.json)

```json
{
  "Security": {
    "PasswordSalt": "ChloroMasterSalt2025"
  }
}
```

## Installation Steps

### 1. Apply Database Migration

```bash
cd backend/src/ChloroMaster.Infrastructure
dotnet ef database update --startup-project ../ChloroMaster.API
```

Or manually run the SQL script:

```bash
sqlite3 chloromaster.db < ../../migrations/001_ExtendedContactAndAdminPanel.sql
```

### 2. Change Default Admin Password

The default credentials are:

- **Username**: `admin`
- **Password**: `Admin@123`

**⚠️ IMPORTANT**: Change this immediately after first login!

To generate a new password hash:

```csharp
using ChloroMaster.API.Helpers;
PasswordHelper.GeneratePasswordHash("YourNewPassword");
```

Then update the database:

```sql
UPDATE AdminUsers 
SET PasswordHash = 'your-new-hash' 
WHERE Username = 'admin';
```

### 3. Build and Run Backend

```bash
cd backend
dotnet build
dotnet run --project src/ChloroMaster.API
```

Backend will run on: `http://localhost:5000`

### 4. Frontend Integration (Next Steps)

Create React admin components:

- `AdminLogin.jsx` - Login page
- `AdminDashboard.jsx` - Main dashboard
- `SubmissionsList.jsx` - Submissions table
- `SubmissionDetail.jsx` - Detail view
- `VisitorStats.jsx` - Analytics charts

Add routing:

```jsx
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/submissions" element={<SubmissionsList />} />
<Route path="/admin/submissions/:id" element={<SubmissionDetail />} />
```

## Testing

### Test Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

### Test Dashboard Stats

```bash
curl http://localhost:5000/api/admin/dashboard/stats
```

### Track Test Visit

```bash
curl -X POST http://localhost:5000/api/pagevisit \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl": "/",
    "pageTitle": "Home",
    "referrer": "https://google.com"
  }'
```

## Next Steps

1. ✅ Backend API complete
2. ⏳ Build React admin dashboard UI
3. ⏳ Add JWT authentication middleware
4. ⏳ Add authorization checks to admin endpoints
5. ⏳ Create admin user management
6. ⏳ Add export functionality (CSV/Excel)
7. ⏳ Deploy to production

## Maintenance

### Add New Admin User

```sql
INSERT INTO AdminUsers (Username, PasswordHash, Email, FullName, IsActive, CreatedAt)
VALUES (
  'newadmin',
  'hash-from-PasswordHelper',
  'newadmin@chloromaster.com',
  'New Administrator',
  1,
  datetime('now')
);
```

### Disable Admin User

```sql
UPDATE AdminUsers SET IsActive = 0 WHERE Username = 'username';
```

### Clean Old Page Visits (Keep Last 90 Days)

```sql
DELETE FROM PageVisits 
WHERE VisitedAt < datetime('now', '-90 days');
```

## Support

For issues or questions, contact the development team.
