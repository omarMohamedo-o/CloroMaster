-- Migration: ExtendedContactAndAdminPanel
-- Date: 2025-01-XX

-- Step 1: Extend ContactSubmissions table
ALTER TABLE ContactSubmissions 
    ADD COLUMN FirstName TEXT NOT NULL DEFAULT '',
    ADD COLUMN LastName TEXT NOT NULL DEFAULT '',
    ADD COLUMN Company TEXT NULL,
    ADD COLUMN Industry TEXT NULL,
    ADD COLUMN Country TEXT NULL,
    ADD COLUMN PostalCode TEXT NULL,
    ADD COLUMN ReceiveEmails INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN UserAgent TEXT NULL;

-- Remove Subject column (if exists)
-- SQLite doesn't support DROP COLUMN in older versions, so we recreate the table
-- This is handled automatically by EF Core migrations

-- Step 2: Create PageVisits table
CREATE TABLE IF NOT EXISTS PageVisits (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    PageUrl TEXT NOT NULL,
    PageTitle TEXT NULL,
    Referrer TEXT NULL,
    VisitedAt TEXT NOT NULL,
    IpAddress TEXT NULL,
    UserAgent TEXT NULL,
    Country TEXT NULL,
    City TEXT NULL,
    DeviceType TEXT NULL,
    Browser TEXT NULL,
    SessionDuration INTEGER NULL
);

CREATE INDEX IF NOT EXISTS IX_PageVisits_VisitedAt ON PageVisits(VisitedAt);
CREATE INDEX IF NOT EXISTS IX_PageVisits_PageUrl ON PageVisits(PageUrl);

-- Step 3: Create AdminUsers table
CREATE TABLE IF NOT EXISTS AdminUsers (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    PasswordHash TEXT NOT NULL,
    Email TEXT NOT NULL,
    FullName TEXT NOT NULL,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    LastLoginAt TEXT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS IX_AdminUsers_Username ON AdminUsers(Username);
CREATE UNIQUE INDEX IF NOT EXISTS IX_AdminUsers_Email ON AdminUsers(Email);

-- Step 4: Add indexes for ContactSubmissions
CREATE INDEX IF NOT EXISTS IX_ContactSubmissions_SubmittedAt ON ContactSubmissions(SubmittedAt);
CREATE INDEX IF NOT EXISTS IX_ContactSubmissions_Email ON ContactSubmissions(Email);
CREATE INDEX IF NOT EXISTS IX_ContactSubmissions_IsRead ON ContactSubmissions(IsRead);

-- Step 5: Insert default admin user (password: Admin@123)
-- Password hash for "Admin@123" with salt "ChloroMasterSalt2025"
INSERT INTO AdminUsers (Username, PasswordHash, Email, FullName, IsActive, CreatedAt)
VALUES (
    'admin',
    '6mGvhzMJQZlZ8F3s8fF8mYqL7E+YdZ4w3KzF7E1fY+I=',
    'admin@chloromaster.com',
    'Administrator',
    1,
    datetime('now')
);
