# 🎯 BNI Event Management - Admin Setup Guide

## Overview
This document provides instructions for setting up and using the admin authentication system for managing events and attendees.

## ✅ What Has Been Implemented

### 1. **Admin Authentication System**
   - Login page with secure authentication
   - Dashboard with event statistics
   - Role-based access control (staff/superuser)

### 2. **Admin Models Management**
   - Event model registered in Django admin
   - EventAttendee model registered in Django admin
   - Custom list displays and filtering

### 3. **Admin Views**
   - `/admin/login/` - Custom admin login page
   - `/admin/dashboard/` - Main admin dashboard with statistics
   - `/admin/event/<slug>/` - Event details and attendee management
   - `/admin/logout/` - Logout functionality

### 4. **Database Superuser**
   - Automatic superuser creation with management command
   - Credentials: admin@gmail.com / admin@123

## 🚀 Quick Start Setup

### Step 1: Create Superuser
Run the management command to create the admin user:

```bash
python manage.py create_admin_user
```

Output should show:
```
✓ Admin Panel URL: /admin/
✓ Username: admin
✓ Email: admin@gmail.com
✓ Password: admin@123
```

### Step 2: Start Development Server
```bash
python manage.py runserver
```

### Step 3: Access Admin Interfaces

#### Custom Admin Dashboard:
- URL: `http://localhost:8000/admin/login/`
- Username: `admin`
- Password: `admin@123`

#### Django Admin Panel (Optional):
- URL: `http://localhost:8000/admin/`
- Username: `admin`
- Password: `admin@123`

## 📋 Admin Dashboard Features

### Dashboard Overview
The admin dashboard (`/admin/dashboard/`) provides:

1. **Statistics Cards**
   - Total Events
   - Upcoming Events
   - Ongoing Events
   - Completed Events
   - Cancelled Events
   - Total Attendees

2. **Event Management Table**
   - View all events with key information
   - Quick actions: View, Edit, Delete
   - Event status badges (Upcoming, Ongoing, Completed, Cancelled)
   - Attendee count vs capacity

### Event Management Workflow

#### Creating an Event
1. Click "Create New Event" button
2. Fill in event details:
   - Title
   - Description
   - Location
   - Start Date & Time
   - End Date & Time
   - Capacity
   - Event Status
   - Poster URL (optional)
3. Submit form

#### Viewing Event Details
1. Click "View" button next to an event
2. See complete event information
3. View and manage attendees
4. Option to remove attendees (if event not completed)

#### Editing an Event
1. Click "Edit" button next to an event
2. Modify event details
3. Save changes
4. Note: Cannot edit completed events

#### Deleting an Event
1. Click "Delete" button
2. Confirm deletion
3. Note: Cannot delete completed events

#### Managing Attendees
1. Click "View" on an event
2. View attendee list with:
   - Name
   - Email
   - Phone
   - Registration Date
   - Remove option
3. Remove attendees (if needed)
4. Note: Cannot modify completed events

## 🔐 Security Features

1. **Authentication Required**
   - Login required to access admin pages
   - Session-based authentication

2. **Role-Based Access**
   - Only staff/superuser can access admin pages
   - Regular users cannot access admin functions

3. **CSRF Protection**
   - All forms protected with CSRF tokens
   - Secure form submissions

4. **Permissions**
   - Event deletion restricted for completed events
   - Attendee modification restricted for completed events

## 📧 Email Notifications

Events trigger email notifications:
- Event invitation emails to registered attendees
- Room ID generation for virtual events
- Customizable email templates

## 🛠️ Technical Details

### Files Modified/Created

**Modified Files:**
- `app/admin.py` - Model registration with custom admin classes
- `app/views.py` - Added admin views and authentication
- `app/urls.py` - Added admin URL routes

**New Files:**
- `app/management/commands/create_admin_user.py` - Superuser management command
- `app/templates/app/admin_login.html` - Login template
- `app/templates/app/admin_dashboard.html` - Dashboard template
- `app/templates/app/admin_event_detail.html` - Event detail template

### Database Changes
No additional migrations required. The system uses Django's built-in User model.

## 🐛 Troubleshooting

### Issue: Admin login not working
**Solution:** 
- Ensure superuser was created: `python manage.py create_admin_user`
- Clear browser cache and try again

### Issue: Cannot access dashboard
**Solution:**
- Verify you're logged in
- Check that your user has staff permissions
- Try accessing via incognito window

### Issue: Events not appearing
**Solution:**
- Ensure events have been created
- Check Event model status field
- Verify database migrations: `python manage.py migrate`

## 📱 Responsive Design

The admin interface is fully responsive:
- Desktop: Full layout with multiple columns
- Tablet: Optimized grid layout
- Mobile: Single column layout with proper spacing

## 🔄 Future Enhancements

Potential features to add:
- Export attendee lists to CSV/Excel
- Email campaigns to attendees
- Event analytics and reporting
- Custom email templates
- Bulk event operations
- User profile management
- Event categories and tags

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Django documentation: https://docs.djangoproject.com/
3. Check error messages in Django debug mode

---

**Created:** April 2026
**Application:** BNI Event Management System
**Version:** 1.0
