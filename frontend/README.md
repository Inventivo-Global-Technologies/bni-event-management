# React Frontend - React Event Management

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm
- Python 3.8+
- Django backend running on http://localhost:8000

### Installation

```bash
cd frontend
npm install
```

### Configuration

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:8000/api
```

### Running the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

## Application Structure

### Pages

1. **Public Pages (No Login Required)**
   - `/` - List of all events
   - `/event/:slug` - Event details
   - `/event/:slug/register` - Registration form
   - `/registration/success/:slug/:attendeeId` - Confirmation page with hash code
   - `/mark-attendance` - Attendance marking with hash code

2. **Admin Pages (Login Required)**
   - `/admin/login` - Admin login page
   - `/admin/dashboard` - Event management dashboard
   - `/admin/event/create` - Create new event
   - `/admin/event/:slug/edit` - Edit event
   - `/admin/event/:slug` - View event details and attendees

### Components

- **Navbar** - Navigation bar with conditional menu items
- **PublicEvents** - Event listing for public users
- **PublicEventDetail** - Event details for public users
- **Registration** - Registration form for events
- **RegistrationSuccess** - Confirmation page
- **MarkAttendance** - Attendance verification with hash code
- **AdminLogin** - Admin authentication
- **AdminDashboard** - Event management
- **EventCreate/EventEdit** - Event form
- **AdminEventDetail** - Event details with attendee list

### Services

- **api.js** - Axios API client with all endpoints
- **helpers.js** - Utility functions for date formatting and event status

## Features

### User Features
- Browse events without login
- Register for events
- View hash code for attendance
- Mark attendance on event day

### Admin Features
- Login with admin credentials
- Create, edit, delete events
- View event details and attendee list
- See attendee information (name, email, company, type, hash code)
- Track attendance status

## API Endpoints

All API endpoints are prefixed with `/api/`

### Events
- `GET /events/` - List all events
- `GET /events/{slug}/` - Get event details
- `POST /events/` - Create event (admin only)
- `PUT /events/{slug}/` - Update event (admin only)
- `DELETE /events/{slug}/` - Delete event (admin only)
- `POST /events/{slug}/register/` - Register for event
- `GET /events/{slug}/attendees/` - Get attendees (admin only)

### Attendance
- `POST /attendees/mark-attendance/` - Mark attendance with hash code
- `GET /attendees/verify-hash/?hash={code}` - Verify hash code

### Admin
- `POST /admin/login/` - Admin login
- `POST /admin/logout/` - Admin logout

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure:
1. Django is running on http://localhost:8000
2. React is running on http://localhost:3000
3. CORS is properly configured in Django settings

### API Connection Issues
- Check that the Django backend is running
- Verify REACT_APP_API_URL in .env file
- Check network tab in browser developer tools

## Technologies Used

- React 18.2
- React Router v6
- Axios for API calls
- CSS3 for styling
- No additional UI frameworks (pure CSS)
