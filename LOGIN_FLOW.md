# 🔐 Login-First Application Flow

## Overview
The application now requires users to login before accessing any features. When the application starts or a user visits it, they will see the login page first.

---

## 🚀 Application Flow

### Step 1: User Visits Application
```
User opens http://localhost:8000/
         ↓
Root URL (/) redirects to /admin/login/
         ↓
Login Page Displays
```

### Step 2: User Enters Credentials
```
Login Page Shows:
- Username field
- Password field
- Login button
- Default credentials info
```

### Step 3: Authentication
```
User Submits Form
         ↓
Django Authenticates Credentials
         ↓
Is user staff/superuser?
├─ YES: Create session → Redirect to /admin/dashboard/
└─ NO:  Show error message → Stay on login page
```

### Step 4: Access Application
```
Logged-in Admin User
         ↓
Can Access:
- /admin/dashboard/ (main admin panel)
- /admin/event/<slug>/ (event details)
- /events/ (event list)
- /events/create/ (create events)
- /events/<slug>/ (view events)
- /events/<slug>/update/ (edit events)
- /events/<slug>/register/ (register attendees)
- /home/ (user home)
```

### Step 5: Logout
```
Click Logout Button
         ↓
Session Cleared
         ↓
Redirect to Login Page
```

---

## 🔑 Access Control

### Unauthenticated Users
- ❌ Cannot access `/` (redirects to login)
- ❌ Cannot access `/events/`
- ❌ Cannot access `/events/create/`
- ❌ Cannot access `/admin/dashboard/`
- ✅ Can only see `/admin/login/`

### Authenticated Users (Staff/Admin)
- ✅ Can access all pages
- ✅ Can create/edit/delete events
- ✅ Can manage attendees
- ✅ Can view admin dashboard
- ✅ Can logout

### Non-Staff Users (if created)
- ❌ Cannot login (login checks for is_staff)
- ❌ Automatically logged out if somehow access is gained

---

## 📍 URL Routing

| URL | Requires Login | Notes |
|-----|----------------|-------|
| `/` | No | Redirects to `/admin/login/` |
| `/admin/login/` | No | Login page |
| `/admin/dashboard/` | ✅ Yes | Main admin panel |
| `/admin/event/<slug>/` | ✅ Yes | Event details |
| `/admin/logout/` | ✅ Yes | Logout |
| `/home/` | ✅ Yes | User home |
| `/events/` | ✅ Yes | Event list |
| `/events/create/` | ✅ Yes | Create event form |
| `/events/<slug>/` | ✅ Yes | Event details |
| `/events/<slug>/update/` | ✅ Yes | Edit event |
| `/events/<slug>/delete/` | ✅ Yes | Delete event |
| `/events/<slug>/register/` | ✅ Yes | Register attendee |
| `/poster/<slug>/` | ✅ Yes | Event poster |
| `/events/<slug>/attendees/` | ✅ Yes | Attendee list |

---

## ⚙️ Configuration Changes

### settings.py
```python
# Login Configuration
LOGIN_URL = 'admin_login'  # Redirect to login for protected views
```

This setting tells Django where to redirect users when they try to access a protected view without being authenticated.

### urls.py
```python
# Root URL - redirect to login
path('', RedirectView.as_view(url='admin/login/', permanent=False), name='root'),
path('home/', views.home, name='home'),
```

The root URL now redirects to the login page instead of showing content.

### views.py
All public views now have the `@login_required` decorator:
```python
@login_required(login_url='admin_login')
def event_list(request):
    # Only accessible by authenticated users
    ...
```

---

## 🔐 Security Features

### Authentication Required
- Every protected page checks if user is authenticated
- Unauthenticated users are redirected to login
- Users cannot bypass by directly accessing URLs

### Staff Permission Check
- Login requires `is_staff = True`
- Regular users cannot access the application
- Only superusers can login

### Session Management
- Sessions are created upon successful login
- Sessions are destroyed upon logout
- Sessions have Django's default timeout

### CSRF Protection
- All forms include CSRF tokens
- POST requests are validated

---

## 📊 Login Flow Diagram

```
┌─────────────────┐
│  Visit Website  │
│  (/) or direct  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Redirect Check: │
│ Authenticated?  │
└────────┬────────┘
         │
    ┌────┴─────────┐
    │              │
   NO             YES
    │              │
    ↓              ↓
┌──────────┐  ┌──────────────────┐
│ Show     │  │ Is Staff?        │
│ Login    │  │ is_staff=True?   │
│ Page     │  └────────┬─────────┘
└──────────┘           │
                   ┌───┴────┐
                   │        │
                  YES      NO
                   │        │
                   ↓        ↓
              ┌─────────┐ ┌──────────┐
              │ Show    │ │ Logout &  │
              │ App     │ │ Redirect  │
              │ Content │ │ to Login   │
              └─────────┘ └──────────┘
```

---

## 🧪 Testing the Login Flow

### Test 1: Root URL Redirect
```bash
1. Open http://localhost:8000/
2. Should redirect to http://localhost:8000/admin/login/
3. Should see login form
```

### Test 2: Login Success
```bash
1. Enter username: admin
2. Enter password: admin@123
3. Click Sign In
4. Should see admin dashboard
5. Should see "Welcome back, admin" message
```

### Test 3: Invalid Credentials
```bash
1. Enter invalid username/password
2. Should see error message
3. Should stay on login page
```

### Test 4: Direct URL Access Without Login
```bash
1. Try to visit /admin/dashboard/ directly
2. Should redirect to /admin/login/
```

### Test 5: Logout
```bash
1. Click Logout button
2. Should see "You have been logged out" message
3. Should redirect to login page
4. Trying to visit /admin/dashboard/ should redirect to login
```

---

## 🔄 Redirect Behavior

### After Login
- Users are redirected to `/admin/dashboard/`
- If coming from a protected page, they're redirected to that page

### After Logout
- Users are redirected to `/admin/login/`
- They cannot access any protected pages

### Trying to Access Protected Pages
- Unauthenticated users are redirected to `/admin/login/`
- After login, they can access the requested page

---

## 📱 User Experience

### For Admin Users
1. Open application → See login page
2. Enter credentials → Enter dashboard
3. Can create, edit, manage events
4. Can manage attendees
5. Can logout anytime

### For Unauthorized Access
1. Try to access app directly → Redirect to login
2. Login fails → Error message shown
3. Cannot access any features

---

## 🆘 Common Scenarios

### Scenario 1: User Forgets to Login
```
User tries /events/ directly
         ↓
Unauthenticated → Redirected to /admin/login/
         ↓
User must login first
```

### Scenario 2: Session Expires
```
User has been idle for a while
         ↓
Session timeout (Django default)
         ↓
Next request → Redirected to /admin/login/
         ↓
User must login again
```

### Scenario 3: Multiple Tabs
```
User logged in Tab 1
         ↓
User logs out from Tab 1
         ↓
Tab 2 session still valid
         ↓
But next action in Tab 2 → Redirect to login
```

---

## ✨ Benefits

✅ **Complete Security:** All content is protected
✅ **User Identification:** System knows who is accessing
✅ **Audit Trail:** Can track user actions
✅ **Controlled Access:** Only authorized users can access
✅ **Clean UX:** Users see login first, then dashboard

---

**Login Flow Documentation v1.0**
**Last Updated:** April 18, 2026
