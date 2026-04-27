# BNI Event Management - Complete Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                           │
│                   (Port 3000 - Localhost)                       │
├─────────────────────────────────────────────────────────────────┤
│  - Navbar with conditional navigation                           │
│  - Auth Context for admin state management                      │
│  - Public pages (events, registration, attendance)              │
│  - Admin pages (login, dashboard, CRUD)                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    (HTTP/REST API)
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                   Django REST API Backend                       │
│                  (Port 8000 - Localhost)                        │
├─────────────────────────────────────────────────────────────────┤
│  - REST API endpoints (/api/events, /api/attendees, etc.)       │
│  - Session-based authentication                                 │
│  - CORS enabled for localhost:3000                              │
│  - Serializers for data validation                              │
│  - ViewSets for CRUD operations                                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                          Database
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    SQLite / MySQL                               │
│                   Database Server                               │
├─────────────────────────────────────────────────────────────────┤
│  - Event model (title, dates, capacity, etc.)                   │
│  - EventAttendee model (registrations, hash codes)              │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── AuthContext (Global state management)
├── Navbar
│   ├── Logo/Brand
│   └── Navigation menu (conditional based on auth)
│
├── Routes
│   ├── Public Routes (AllowAny)
│   │   ├── "/" - PublicEvents
│   │   ├── "/event/:slug" - PublicEventDetail
│   │   ├── "/event/:slug/register" - Registration
│   │   ├── "/registration/success/:slug/:id" - RegistrationSuccess
│   │   └── "/mark-attendance" - MarkAttendance
│   │
│   └── Protected Routes (Admin only)
│       ├── "/admin/login" - AdminLogin
│       ├── "/admin/dashboard" - AdminDashboard
│       ├── "/admin/event/create" - EventCreate
│       ├── "/admin/event/:slug/edit" - EventEdit
│       └── "/admin/event/:slug" - AdminEventDetail
```

## Data Flow

### User Registration Flow
1. User visits PublicEvents page
2. Clicks on event → PublicEventDetail page
3. Clicks "Register Now" → Registration form
4. Submits form → API POST /events/{slug}/register/
5. Backend creates EventAttendee with hash code
6. Backend returns attendee data
7. Frontend redirects to RegistrationSuccess
8. User sees hash code (saved for attendance marking)

### Admin Event Management Flow
1. Admin visits /admin/login
2. Enters credentials → API POST /api/admin/login/
3. Backend authenticates and returns user data
4. Frontend stores admin info in localStorage
5. Redirected to AdminDashboard
6. Admin can:
   - View all events: API GET /api/events/
   - Create event: API POST /api/events/
   - Edit event: API PUT /api/events/{slug}/
   - Delete event: API DELETE /api/events/{slug}/
   - View attendees: API GET /api/events/{slug}/attendees/

### Attendance Marking Flow
1. User visits "/mark-attendance"
2. Enters hash code → API POST /api/attendees/mark-attendance/
3. Backend finds attendee by hash code
4. Sets is_verified = True
5. Returns attendee and event info
6. Frontend shows confirmation with attendee details

## API Endpoints

### Event Management
```
GET    /api/events/                      - List all events
GET    /api/events/{slug}/               - Get event details
POST   /api/events/                      - Create event (admin)
PUT    /api/events/{slug}/               - Update event (admin)
DELETE /api/events/{slug}/               - Delete event (admin)
POST   /api/events/{slug}/register/      - Register attendee
GET    /api/events/{slug}/attendees/     - List attendees (admin)
```

### Attendance
```
POST   /api/attendees/mark-attendance/   - Mark attendance (hash code)
GET    /api/attendees/verify-hash/       - Verify hash code
```

### Admin Authentication
```
POST   /api/admin/login/                 - Login (returns user data)
POST   /api/admin/logout/                - Logout
```

## Data Models

### Event
- id (PK)
- title (string)
- slug (string, unique) - URL-friendly name
- description (text)
- location (string)
- start_date (datetime)
- end_date (datetime)
- capacity (integer)
- registered_count (integer) - auto-incremented on registration
- status (choice) - upcoming/ongoing/completed/cancelled
- poster_url (URL, optional) - event image
- created_at (datetime, auto)
- updated_at (datetime, auto)

### EventAttendee
- id (PK)
- event (FK to Event)
- full_name (string)
- email (string, unique per event)
- phone (string, optional)
- company_name (string, optional)
- business_category (string, optional)
- registration_type (choice) - visitor/primary_member/cross_region/etc.
- registration_hash (string, unique) - 16-char hash code
- registered_at (datetime, auto)
- is_verified (boolean) - True when attendance marked

## Authentication & Authorization

### Admin Authentication
- Session-based using Django's authentication system
- Required for: create, update, delete events; view attendees
- Stored in localStorage on frontend
- CSRF token in cookie for form submissions

### Public Access
- No authentication required for browsing events
- No authentication required for registration
- Verification done via hash code (not authentication)

## State Management

### Frontend State
- **AuthContext**: Stores admin user info
  - admin (user object or null)
  - handleAdminLogin (function)
  - handleAdminLogout (function)
  - Persisted in localStorage

- **Component State**: Local state for forms, loading, errors
  - Form data (registration, event creation)
  - Loading states
  - Error messages

### Backend State
- User session created on login
- Stored in Django's session framework
- Verified with @login_required decorator

## Security Considerations

1. **Authentication**
   - Only staff/admin users can login
   - Session-based authentication
   - Password handled by Django

2. **CORS**
   - Limited to localhost:3000 for development
   - Should be restricted in production

3. **API Permissions**
   - GET endpoints: AllowAny
   - POST/PUT/DELETE: IsAuthenticated (admin only)
   - Registration: AllowAny (no auth needed)
   - Attendance marking: AllowAny (hash verification)

4. **Hash Codes**
   - 16-character SHA256-based hash
   - Unique per attendee
   - Used for verification, not authentication

## File Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLogin.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── EventCreate.js
│   │   │   ├── EventEdit.js
│   │   │   └── AdminEventDetail.js
│   │   └── user/
│   │       ├── PublicEvents.js
│   │       ├── PublicEventDetail.js
│   │       ├── Registration.js
│   │       ├── RegistrationSuccess.js
│   │       └── MarkAttendance.js
│   ├── services/
│   │   └── api.js (Axios configuration)
│   ├── styles/
│   │   ├── index.css (global)
│   │   ├── Navbar.css
│   │   ├── AdminLogin.css
│   │   ├── AdminDashboard.css
│   │   ├── EventForm.css
│   │   ├── AdminEventDetail.css
│   │   ├── PublicEvents.css
│   │   ├── PublicEventDetail.css
│   │   ├── Registration.css
│   │   ├── RegistrationSuccess.css
│   │   ├── MarkAttendance.css
│   │   └── App.css
│   ├── utils/
│   │   └── helpers.js (utility functions)
│   ├── App.js (routing setup)
│   └── index.js (React entry point)
├── package.json
├── .env (API URL)
└── README.md

backend/
├── app/
│   ├── migrations/
│   ├── templates/ (legacy, can be deleted)
│   ├── api_views.py (REST API views)
│   ├── api_urls.py (API routes)
│   ├── models.py
│   ├── serializers.py (DRF serializers)
│   ├── views.py (legacy Django views)
│   ├── urls.py (legacy routes)
│   └── admin.py
├── bni_event_management/
│   ├── settings.py (includes REST framework config)
│   ├── urls.py (includes API routes)
│   └── wsgi.py/asgi.py
├── manage.py
├── requirements.txt (Python dependencies)
├── .env (database credentials)
└── db.sqlite3 (SQLite database)
```

## Development Workflow

### Starting the App
1. Terminal 1 - Backend:
   ```bash
   cd d:\Projects\bni_event_management
   venv\Scripts\activate
   python manage.py runserver
   ```

2. Terminal 2 - Frontend:
   ```bash
   cd d:\Projects\bni_event_management\frontend
   npm start
   ```

### Making Changes
- Frontend: Changes hot-reload automatically
- Backend: Changes require server restart (Ctrl+C, run again)

### Testing the API
- Use frontend UI or postman
- Check Network tab in browser DevTools
- Check Django console for debug messages

## Performance Optimizations (Future)

1. **Frontend**
   - Lazy loading components
   - Memoization for expensive components
   - Code splitting with React.lazy

2. **Backend**
   - Database query optimization (select_related, prefetch_related)
   - Caching with Redis
   - Pagination for large datasets

3. **General**
   - Image optimization
   - Minification for production
   - CDN for static assets

## Deployment

### Frontend Deployment
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API URL in environment

### Backend Deployment
1. Use production settings
2. Configure proper database (MySQL/PostgreSQL)
3. Set up proper CORS origins
4. Use Gunicorn + Nginx
5. Configure HTTPS
