-- Migration: Add DatasheetRequests table
-- Date: 2025-01-25

CREATE TABLE IF NOT EXISTS DatasheetRequests (
    Id SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(50),
    Company VARCHAR(100),
    Country VARCHAR(100),
    DatasheetSlug VARCHAR(200) NOT NULL,
    RequestedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IpAddress VARCHAR(50),
    UserAgent VARCHAR(500)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_datasheet_requests_requested_at ON DatasheetRequests(RequestedAt);
CREATE INDEX IF NOT EXISTS idx_datasheet_requests_email ON DatasheetRequests(Email);
CREATE INDEX IF NOT EXISTS idx_datasheet_requests_slug ON DatasheetRequests(DatasheetSlug);
