# Quick Reference - Admin Panel

## 🚀 Setup (One-time)
```bash
# Create admin superuser
python manage.py create_admin_user

# Start server
python manage.py runserver
```

## 🔑 Admin Credentials
```
Username: admin
Email: admin@gmail.com
Password: admin@123
```

## 📍 Access Points

| Purpose | URL | User |
|---------|-----|------|
| Custom Admin Login | `/admin/login/` | admin/admin@123 |
| Admin Dashboard | `/admin/dashboard/` | admin/admin@123 |
| Django Admin | `/admin/` | admin/admin@123 |
| Logout | `/admin/logout/` | Any logged-in user |

## 📊 Admin Dashboard Features

### Statistics Section
- **Total Events** - Count of all events
- **Upcoming Events** - Events not started
- **Ongoing Events** - Events currently running
- **Completed Events** - Finished events
- **Cancelled Events** - Cancelled events
- **Total Attendees** - Total registered attendees

### Event Management
- **View** - See event details and attendees
- **Edit** - Modify event information
- **Delete** - Remove event (if not completed)
- **Create New** - Add new event

### Event Details (View page)
- Full event information
- Attendee list with:
  - Name
  - Email
  - Phone
  - Registration date
  - Remove option
- Edit and delete buttons

## 🎯 Common Workflows

### Create Event
1. Login to `/admin/dashboard/`
2. Click "Create New Event"
3. Fill form and submit

### Add Attendee (Public)
1. Go to event poster
2. Click register
3. Fill attendee form

### Manage Attendees (Admin)
1. Dashboard → Click "View" on event
2. See attendee list
3. Click "Remove" to delete attendee

### Edit Event
1. Dashboard → Click "Edit" on event
2. Modify details
3. Save

### Delete Event
1. Dashboard → Click "Delete" on event
2. Confirm deletion

## 🔒 Security Notes
- All pages require login (except public event pages)
- Completed events cannot be modified
- CSRF protection on all forms
- Session-based authentication

## 📧 Email Features
- Invitation emails sent on registration
- HTML-formatted emails
- Unique room IDs generated
- Customizable templates in `email_template.py`

## 🛠️ Technical Stack
- **Framework:** Django 4.2
- **Database:** MySQL (configured in settings.py)
- **Auth:** Django's built-in authentication
- **Frontend:** HTML/CSS with responsive design

## 🐛 Quick Fixes

| Issue | Fix |
|-------|-----|
| Admin login fails | Run `python manage.py create_admin_user` |
| 404 on /admin/login/ | Check `app/urls.py` includes admin routes |
| Page styling broken | Clear browser cache |
| Can't access dashboard | Ensure you're logged in and is_staff=True |

## 📝 File Structure
```
app/
├── admin.py                    (Admin configuration)
├── views.py                    (Admin + public views)
├── urls.py                     (Admin + public routes)
├── management/
│   └── commands/
│       └── create_admin_user.py (Superuser creation)
└── templates/app/
    ├── admin_login.html        (Login page)
    ├── admin_dashboard.html    (Dashboard)
    └── admin_event_detail.html (Event details)
```

## ✨ Features Included
✅ Admin login & authentication
✅ Admin dashboard with statistics
✅ Event creation (admin & public)
✅ Event editing & deletion
✅ Attendee registration & management
✅ Email notifications
✅ Responsive design
✅ Role-based access control
✅ CSRF protection
✅ Session management
