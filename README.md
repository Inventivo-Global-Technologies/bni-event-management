# 🎉 BNI Event Management System

A modern, full-stack event management platform built for BNI (Business Network International) to create, manage, and track events with automated email notifications and attendance marking.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Django](https://img.shields.io/badge/Django-4.2-darkgreen?logo=django)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Email Setup](#email-setup)
- [Usage Guide](#usage-guide)
- [Database Models](#database-models)
- [Frontend Components](#frontend-components)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The BNI Event Management System is a comprehensive platform that enables administrators to create and manage events while allowing users to register, receive automated confirmations, and mark attendance through secure hash codes. The system features real-time updates, email notifications, and an intuitive user interface.

### Key Highlights:
- ✅ **Event Management**: Create, edit, and manage events with full CRUD operations
- ✅ **User Registration**: Easy event registration with validation
- ✅ **Automated Emails**: Confirmation emails with registration hash codes
- ✅ **Attendance Tracking**: QR/Hash-based attendance marking system
- ✅ **Real-time Updates**: Live event status and registration count updates
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## Features

### 🎯 Core Features

#### Event Management
- Create new events with title, description, location, dates, capacity, and poster
- Automatic slug generation for SEO-friendly URLs
- Event status tracking (Upcoming, Ongoing, Completed, Cancelled)
- Automatic status updates based on event date
- Event capacity management with registration limits

#### User Registration
- Simple and intuitive registration form
- Support for multiple attendee types:
  - Primary Member
  - Cross Region
  - Launch Member
  - Family Member
  - VIP
  - Support Staff
  - Visitor
- Email validation to prevent duplicate registrations
- Company and business category tracking

#### Email Notifications
- Automated confirmation emails after registration
- Event details included in emails
- Registration hash code in all communications
- Clickable "Mark Attendance" link in emails
- Professional HTML email templates with branding

#### Attendance Tracking
- Unique 16-character hash codes for each registration
- One-click attendance marking from email links
- Hash code verification system
- Attendance status display
- Attendee information stored with verification status

#### Admin Dashboard
- View all registered attendees for an event
- Monitor registration counts vs. capacity
- Track verified attendees
- Real-time event statistics

---

## Tech Stack

### Backend
- **Framework**: Django 4.2.9
- **API**: Django REST Framework
- **Database**: SQLite (Development) / PostgreSQL (Production Ready)
- **Email**: Django Email with Gmail SMTP
- **Authentication**: Django Session Authentication

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Build Tool**: Create React App / Webpack
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context API

### DevOps & Tools
- **Version Control**: Git/GitHub
- **Package Managers**: pip (Python), npm (Node.js)
- **Environment Management**: python-dotenv

---

## Project Structure

```
bni_event_management/
├── app/                              # Django App
│   ├── migrations/                   # Database migrations
│   │   ├── 0001_initial.py
│   │   ├── 0002_event_slug.py
│   │   ├── 0003_event_poster_url.py
│   │   └── 0004_eventattendee_update.py
│   ├── management/
│   │   └── commands/
│   │       └── create_admin_user.py  # Create admin user command
│   ├── admin.py                      # Django admin configuration
│   ├── api_views.py                  # API endpoint views & email logic
│   ├── api_urls.py                   # API URL routing
│   ├── models.py                     # Database models (Event, EventAttendee)
│   ├── serializers.py                # DRF serializers
│   ├── tests.py                      # Unit tests
│   ├── urls.py                       # App URL patterns
│   ├── views.py                      # Django views
│   └── apps.py                       # App configuration
│
├── bni_event_management/             # Django Project Settings
│   ├── settings.py                   # Project settings (DATABASES, INSTALLED_APPS, etc.)
│   ├── urls.py                       # Project URL routing
│   ├── wsgi.py                       # WSGI application
│   ├── asgi.py                       # ASGI application
│   └── __init__.py
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js            # Navigation component
│   │   ├── context/
│   │   │   └── AuthContext.js       # Authentication context
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js      # Admin dashboard
│   │   │   │   ├── AdminEventDetail.js    # Admin event details
│   │   │   │   ├── AdminLogin.js         # Admin login
│   │   │   │   ├── EventCreate.js        # Create event form
│   │   │   │   └── EventEdit.js          # Edit event form
│   │   │   └── user/
│   │   │       ├── MarkAttendance.js     # Mark attendance page
│   │   │       ├── PublicEventDetail.js  # Public event details
│   │   │       ├── PublicEvents.js       # Events listing
│   │   │       ├── Registration.js       # Event registration
│   │   │       └── RegistrationSuccess.js # Success page
│   │   ├── services/
│   │   │   └── api.js               # API client with axios
│   │   ├── styles/                  # CSS files (Tailwind)
│   │   ├── utils/
│   │   │   └── helpers.js           # Utility functions
│   │   ├── App.js                   # Main App component
│   │   └── index.js                 # React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
├── manage.py                        # Django management script
├── requirements.txt                 # Python dependencies
├── package.json                     # Node.js project configuration
├── .env                            # Environment variables (create this)
├── .gitignore
├── ARCHITECTURE.md                 # Architecture documentation
├── email_template.py               # Email template functions
├── fix_slugs.py                    # Utility script for slug fixes
├── run_backend.sh                  # Backend startup script
├── run_frontend.sh                 # Frontend startup script
├── LICENSE
└── README.md                       # This file
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 8+** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Gmail Account** - For email notifications (optional, can use console backend)

### Verify Installation:
```bash
python --version      # Should show Python 3.11+
node --version        # Should show Node.js 16+
npm --version         # Should show npm 8+
git --version         # Should show git version
```

---

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Inventivo-Global-Technologies/bni-event-management.git
cd bni_event_management
```

### Step 2: Set Up Python Environment

#### Windows (PowerShell):
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Install Node Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 5: Create Database
```bash
python manage.py migrate
```

### Step 6: Create Superuser (Admin Account)
```bash
python manage.py createsuperuser
# Follow the prompts to create admin account
```

---

## Configuration

### Step 1: Create `.env` File

Create a `.env` file in the project root:

```bash
# Gmail Configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
```

### Step 2: Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. Search for "App passwords"
4. Select **Mail** and **Windows Computer** (or your device)
5. Copy the 16-character app password
6. Add it to `.env` file as `EMAIL_HOST_PASSWORD`

### Step 3: Update Django Settings (if needed)

Edit `bni_event_management/settings.py`:

```python
# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', 'your-email@gmail.com')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'your-app-password')
DEFAULT_FROM_EMAIL = 'your-email@gmail.com'
```

---

## Running the Application

### Option 1: Run Both Servers (Recommended for Development)

#### Terminal 1 - Start Backend (Django):
```bash
cd d:\Projects\bni_event_management
python manage.py runserver
# Backend running at http://127.0.0.1:8000
```

#### Terminal 2 - Start Frontend (React):
```bash
cd d:\Projects\bni_event_management\frontend
npm start
# Frontend running at http://localhost:3000
```

### Option 2: Using Startup Scripts

#### Windows:
```bash
# Terminal 1
run_backend.sh

# Terminal 2
run_frontend.sh
```

#### macOS/Linux:
```bash
# Terminal 1
bash run_backend.sh

# Terminal 2
bash run_frontend.sh
```

### Verify Everything is Running:
- Frontend: http://localhost:3000
- Backend: http://127.0.0.1:8000
- Django Admin: http://127.0.0.1:8000/admin

---

## API Documentation

### Base URL
```
http://127.0.0.1:8000/api
```

### Authentication
The API uses Django Session Authentication for admin endpoints. Public endpoints allow anonymous access.

### Events Endpoints

#### Get All Events
```
GET /events/
Parameters: None
Response: List of all events
```

#### Get Event by Slug
```
GET /events/{slug}/
Parameters: 
  - slug (string): Event slug
Response: Event details
```

#### Create Event
```
POST /events/
Headers: Content-Type: application/json
Body: {
  "title": "Event Name",
  "description": "Event description",
  "location": "Event location",
  "start_date": "2026-05-01T10:00:00Z",
  "end_date": "2026-05-01T12:00:00Z",
  "capacity": 100,
  "poster_url": "https://example.com/poster.jpg"
}
Response: Created event details
```

#### Register for Event
```
POST /events/{slug}/register/
Headers: Content-Type: application/json
Body: {
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "company_name": "Company Name",
  "business_category": "Category",
  "registration_type": "visitor"
}
Response: Registration details with hash code
```

#### Get Event Attendees
```
GET /events/{slug}/attendees/
Authorization: Required (Admin only)
Response: List of all attendees for the event
```

### Attendee Endpoints

#### Mark Attendance
```
POST /attendees/mark-attendance/
Headers: Content-Type: application/json
Body: {
  "registration_hash": "11B3EBB52DD9B3FF"
}
Response: Attendee details with verified status
```

#### Verify Hash Code
```
GET /attendees/verify-hash/?hash=11B3EBB52DD9B3FF
Response: Attendee information if hash is valid
```

### Admin Endpoints

#### Admin Login
```
POST /admin/login/
Headers: Content-Type: application/json
Body: {
  "username": "admin_username",
  "password": "admin_password"
}
Response: Login success/failure
```

#### Admin Logout
```
POST /admin/logout/
Response: Logout success
```

---

## Email Setup

### Email Features
- ✅ Automated confirmation emails after registration
- ✅ Event details included in email
- ✅ Unique 16-character hash code for attendance
- ✅ Clickable "Mark Attendance" button
- ✅ Professional HTML email template

### Email Configuration Options

#### Option 1: Gmail SMTP (Recommended)
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'app-password'
```

#### Option 2: Console Backend (Testing)
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# Emails will be printed to console instead of sending
```

#### Option 3: File Backend (Testing)
```python
EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_FILE_PATH = BASE_DIR / 'sent_emails'
```

### Email Template Structure
The email includes:
- Event title and emoji header
- Event details (date, time, location, type)
- Registration hash code in highlighted box
- Clickable "Mark Attendance" button
- Plain text fallback link
- Footer with copyright

---

## Usage Guide

### For Users

#### 1. **Browse Events**
- Visit http://localhost:3000
- View all available events
- Click on an event to see details

#### 2. **Register for Event**
- Click "Register Now" button
- Fill in registration form:
  - Full Name (required)
  - Email (required)
  - Phone (optional)
  - Company Name (optional)
  - Business Category (optional)
  - Attendee Type (required)
- Click "Complete Registration"
- Check email for confirmation

#### 3. **Mark Attendance**
- **Option A**: Click button in confirmation email
- **Option B**: Visit "Mark Attendance" page and enter hash code
- Hash code is automatically pre-filled if clicking email link
- Attendance status updated immediately

### For Administrators

#### 1. **Create Event**
- Visit Admin Dashboard: http://localhost:3000/admin/login
- Log in with admin credentials
- Click "Create New Event"
- Fill in event details:
  - Title (required)
  - Description (required)
  - Location (required)
  - Start Date & Time (required)
  - End Date & Time (required)
  - Capacity (required)
  - Poster URL (optional)
- Click "Create Event"

#### 2. **View Event Details**
- Click on event to view details
- See all registered attendees
- Monitor capacity vs. registrations
- Check verified attendees

#### 3. **Edit Event** (if needed)
- Click edit button on event
- Modify event details
- Save changes

---

## Database Models

### Event Model
```python
Event:
  - id (AutoField)
  - title (CharField, max_length=200)
  - slug (SlugField, unique=True)
  - description (TextField)
  - location (CharField, max_length=255)
  - start_date (DateTimeField)
  - end_date (DateTimeField)
  - capacity (IntegerField)
  - registered_count (IntegerField, default=0)
  - status (CharField: upcoming, ongoing, completed, cancelled)
  - poster_url (URLField, optional)
  - created_at (DateTimeField, auto_now_add=True)
  - updated_at (DateTimeField, auto_now=True)
```

### EventAttendee Model
```python
EventAttendee:
  - id (AutoField)
  - event (ForeignKey to Event)
  - full_name (CharField, max_length=200)
  - company_name (CharField, max_length=255, optional)
  - business_category (CharField, max_length=255, optional)
  - email (EmailField)
  - phone (CharField, max_length=15, optional)
  - registration_type (CharField: visitor, primary_member, etc.)
  - registration_hash (CharField, max_length=64, unique=True)
  - registered_at (DateTimeField, auto_now_add=True)
  - is_verified (BooleanField, default=False)
  
  Constraints:
  - unique_together: (event, email)
```

---

## Frontend Components

### Pages

#### Public Pages
- **PublicEvents.js**: Events listing page with search and filters
- **PublicEventDetail.js**: Individual event details with registration button
- **Registration.js**: Event registration form
- **RegistrationSuccess.js**: Success confirmation page
- **MarkAttendance.js**: Attendance marking with hash code

#### Admin Pages
- **AdminLogin.js**: Admin authentication
- **AdminDashboard.js**: Dashboard with events overview
- **AdminEventDetail.js**: Event details with attendees list
- **EventCreate.js**: Create new event form
- **EventEdit.js**: Edit existing event

### Components
- **Navbar.js**: Navigation component with routing

### Context
- **AuthContext.js**: Authentication state management

### Services
- **api.js**: Axios instance with all API endpoints

### Utilities
- **helpers.js**: Date formatting and utility functions

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Email Configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:8000/api

# Django Configuration
DEBUG=True
SECRET_KEY=django-insecure-change-this-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional)
# DATABASE_URL=sqlite:///db.sqlite3
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. **"ModuleNotFoundError: No module named 'bni_event_management.settings'"**
**Solution:**
```bash
# Ensure you're in the correct directory
cd d:\Projects\bni_event_management
# Activate virtual environment
.\venv\Scripts\Activate.ps1
# Run migrations
python manage.py migrate
```

#### 2. **"Port 8000 is already in use"**
**Solution:**
```bash
# Use a different port
python manage.py runserver 8001
# Or kill the process using port 8000
# Windows: netstat -ano | findstr :8000
# macOS/Linux: lsof -i :8000
```

#### 3. **"Port 3000 is already in use"**
**Solution:**
```bash
# Use a different port
PORT=3001 npm start
```

#### 4. **"Email not sending"**
**Solution:**
1. Check `.env` file has correct Gmail credentials
2. Ensure Gmail account has 2-Factor Authentication enabled
3. Use app-specific password (not regular password)
4. Check `EMAIL_HOST_USER` matches the account with app password
5. In settings.py, ensure `EMAIL_BACKEND` is set to `'django.core.mail.backends.smtp.EmailBackend'`

#### 5. **"CORS errors in console"**
**Solution:**
Verify `CORS_ALLOWED_ORIGINS` in settings.py:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000',
]
```

#### 6. **Database migration errors**
**Solution:**
```bash
# Remove old migrations (careful!)
rm app/migrations/000*.py
# Create fresh migrations
python manage.py makemigrations
python manage.py migrate
```

#### 7. **"npm: command not found"**
**Solution:**
- Reinstall Node.js from https://nodejs.org/
- Add Node.js to PATH environment variable
- Restart terminal/command prompt

---

## Contributing

We welcome contributions from the community! Here's how to contribute:

### Steps:
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Guidelines:
- Follow PEP 8 for Python code
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting PR
- Update README if adding new features

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Contact

For issues, questions, or suggestions:
- **Email**: support@bnieventmanagement.com
- **GitHub Issues**: [Create an Issue](https://github.com/Inventivo-Global-Technologies/bni-event-management/issues)
- **Documentation**: [Architecture Doc](ARCHITECTURE.md)

---

## Changelog

### Version 1.0.0 (2026-04-27)
- ✅ Initial release
- ✅ Event management system
- ✅ User registration with email confirmation
- ✅ Automated attendance marking
- ✅ Admin dashboard
- ✅ Email notifications with hash codes
- ✅ Responsive UI with Tailwind CSS

---

## Acknowledgments

- Built with [Django](https://www.djangoproject.com/)
- Frontend with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- API with [Django REST Framework](https://www.django-rest-framework.org/)
- Thanks to [BNI](https://www.bni.com/) for the inspiration

---

**Happy Event Management! 🎉**

Last Updated: April 27, 2026
