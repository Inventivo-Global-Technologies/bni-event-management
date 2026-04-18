# Admin Workflow Documentation

## 🔄 User Flow Diagrams

### Login Flow
```
User Visits /admin/login/
        ↓
Display Login Form
        ↓
User Enters: username=admin, password=admin@123
        ↓
Django Authenticates User
        ↓
Check: Is user staff/superuser?
        ├─ YES → Create Session → Redirect to /admin/dashboard/
        └─ NO → Show Error Message → Stay on /admin/login/
```

### Admin Dashboard Flow
```
User Accesses /admin/dashboard/
        ↓
Check: Is user authenticated and staff?
        ├─ NO → Redirect to /admin/login/
        └─ YES ↓
Fetch Statistics:
  - Event counts (upcoming, ongoing, completed, cancelled)
  - Total attendees count
        ↓
Fetch All Events
        ↓
Render Dashboard with:
  - Stats cards
  - Event management table
  - Action buttons (View, Edit, Delete)
```

### Event Management Flow
```
Admin on Dashboard
        ↓
┌─────────────────────┬──────────────────┬─────────────────┐
│                     │                  │                 │
V                     V                  V                 V
CREATE        VIEW              EDIT           DELETE
EVENT         DETAILS            EVENT          EVENT
  ↓             ↓                  ↓              ↓
Form        Event Detail      Edit Form       Confirm
Page        + Attendees      (Pre-filled)     Dialog
  ↓             ↓                  ↓              ↓
Save         See All          Update       Delete
Event        Attendees        Event        Event
  ↓             ↓                  ↓              ↓
Success      View/Remove      Success      Success
Message      Options          Message      Message
```

### Attendee Management Flow
```
Admin Clicks "View" on Event
        ↓
Load Event Details Page
        ↓
Fetch All Attendees for Event
        ↓
Display Attendee Table:
  - Name
  - Email
  - Phone
  - Registration Date
  - Remove Button
        ↓
┌─────────────────────────────┐
│ Event Status Check?         │
├─────────────────────────────┤
│ If Completed:               │
│ - Show "Event Completed"    │
│ - Disable Remove buttons    │
│ If Not Completed:           │
│ - Show Remove buttons       │
│ - Allow attendee removal    │
└─────────────────────────────┘
        ↓
User Clicks Remove Button
        ↓
Show Confirmation
        ↓
Delete Attendee Record
        ↓
Update registered_count
        ↓
Show Success Message
```

---

## 📊 Data Flow

### Event Creation (Public/Admin)
```
User → POST /events/create/
         ↓
    Parse Form Data
         ↓
    Create Event Object:
    - title
    - slug (auto-generated)
    - description
    - location
    - start_date
    - end_date
    - capacity
    - status
    - poster_url
         ↓
    Save to Database
         ↓
    Redirect to Event Poster
         ↓
    Send Success Message
```

### Event Editing (Public/Admin)
```
User → GET /events/<slug>/update/
         ↓
    Load Event Details
    Display Edit Form (Pre-filled)
         ↓
User → POST with Updated Data
         ↓
    Validate Data
         ↓
Check Event Status:
├─ If Completed → Show Error
└─ If Not Completed → Continue
         ↓
    Update Fields:
    - title
    - description
    - location
    - dates
    - capacity
    - status
    - poster_url
         ↓
    Save to Database
         ↓
    Redirect to Event Detail
         ↓
    Show Success Message
```

### Attendee Registration
```
User → GET /events/<slug>/register/
         ↓
    Check Event Status:
    ├─ If Completed → Show Error
    └─ If Not Completed → Continue
         ↓
    Display Registration Form
         ↓
User → POST with:
    - name
    - email
    - phone
         ↓
    Check Capacity:
    ├─ If Full → Show Error
    └─ If Available → Continue
         ↓
    Create/Update EventAttendee:
    ├─ If New → Increment registered_count
    └─ If Exists → Show Info
         ↓
    Save to Database
         ↓
    Send Email Invitation
    (with room ID)
         ↓
    Redirect to Event Detail
         ↓
    Show Success Message
```

---

## 🔐 Permission Checks

### Authentication Check
```python
@login_required(login_url='admin_login')
def admin_dashboard(request):
    if not request.user.is_staff:
        # Deny access
    # Grant access
```

### Event Modification Restrictions
```python
if event.status == 'completed':
    # Cannot edit, delete, or modify attendees
    Show Error Message
else:
    # Allow modifications
    Allow Action
```

### Capacity Check
```python
if event.registered_count >= event.capacity:
    # Event is full
    Prevent Registration
    Show Error
else:
    # Capacity available
    Allow Registration
```

---

## 📱 Form Workflows

### Login Form
```
Input Fields:
- Username (text) [required]
- Password (password) [required]

Buttons:
- Sign In (submit)

Links:
- Back to Home

Validation:
- Username must exist
- Password must be correct
- User must have is_staff=True
```

### Event Creation Form
```
Input Fields:
- Title (text) [required]
- Description (textarea) [required]
- Location (text) [required]
- Start Date/Time (datetime) [required]
- End Date/Time (datetime) [required]
- Capacity (number) [required]
- Status (select) [optional]
- Poster URL (url) [optional]

Buttons:
- Create Event (submit)
- Cancel

Validation:
- All required fields filled
- End date > Start date
- Capacity > 0
- Valid URL format
```

### Attendee Registration Form
```
Input Fields:
- Name (text) [required]
- Email (email) [required]
- Phone (tel) [required]

Buttons:
- Register (submit)
- Cancel

Validation:
- All required fields filled
- Valid email format
- Event capacity not exceeded
- Email unique per event
```

---

## 🔄 Session Management

### Session Lifecycle
```
User Logs In
    ↓
Session Created (Django)
    ↓
Session ID Stored in Cookie
    ↓
User Can Access Protected Views
    ↓
User Logs Out
    ↓
Session Deleted
    ↓
Redirected to Login Page
    ↓
User Cannot Access Protected Views
```

---

## 📡 API Data Structures

### Event Object
```python
{
    'id': int,
    'title': str,
    'slug': str (unique),
    'description': str,
    'location': str,
    'start_date': datetime,
    'end_date': datetime,
    'capacity': int,
    'registered_count': int,
    'status': str ('upcoming', 'ongoing', 'completed', 'cancelled'),
    'poster_url': str (optional),
    'created_at': datetime,
    'updated_at': datetime
}
```

### EventAttendee Object
```python
{
    'id': int,
    'event_id': int (FK),
    'name': str,
    'email': str,
    'phone': str,
    'registered_at': datetime
}
```

### User/Admin Object
```python
{
    'id': int,
    'username': str,
    'email': str,
    'password': str (hashed),
    'is_staff': bool,
    'is_superuser': bool,
    'is_active': bool,
    'date_joined': datetime,
    'last_login': datetime
}
```

---

## 🎯 State Transitions

### Event Status Transitions
```
Created → [UPCOMING]
           ├─ time passes → [ONGOING]
           │               ├─ end time → [COMPLETED]
           │               └─ cancelled → [CANCELLED]
           ├─ cancelled immediately → [CANCELLED]
           └─ admin changes → [ONGOING/COMPLETED/CANCELLED]
```

### User Access Levels
```
Anonymous User
    ├─ Can view: home, event_list, event_detail, poster, register
    └─ Cannot view: admin pages

Regular User (authenticated, not staff)
    ├─ Can view: home, event_list, event_detail, poster, register
    └─ Cannot view: admin pages

Admin User (authenticated, is_staff=True)
    ├─ Can view: all public pages + admin pages
    ├─ Can create: events (via /events/create/ or admin)
    ├─ Can edit: events, attendees
    └─ Can delete: events, attendees
```

---

## 📊 Statistics Calculation

### Real-time Counts
```python
stats = {
    'total_events': Event.objects.count(),
    # Counts all events in database
    
    'upcoming_events': Event.objects.filter(status='upcoming').count(),
    # Counts events with status='upcoming'
    
    'ongoing_events': Event.objects.filter(status='ongoing').count(),
    # Counts events with status='ongoing'
    
    'completed_events': Event.objects.filter(status='completed').count(),
    # Counts events with status='completed' or end_date passed
    
    'cancelled_events': Event.objects.filter(status='cancelled').count(),
    # Counts events with status='cancelled'
    
    'total_attendees': EventAttendee.objects.count(),
    # Counts all attendee registrations across all events
}
```

---

## 🔔 Event Lifecycle

```
1. CREATION
   - Admin creates event
   - All fields set
   - Auto status = 'upcoming'

2. PRE-EVENT
   - Attendees register
   - registered_count increases
   - Admin can edit/delete

3. DURING EVENT (Start Date Reached)
   - Status auto-updates to 'ongoing'
   - Admin can still manage
   - Cannot delete

4. POST EVENT (End Date Passed)
   - Status auto-updates to 'completed'
   - Cannot edit
   - Cannot delete
   - Cannot modify attendees

5. CANCELLED
   - Admin can manually set status
   - Cannot modify once completed
```

---

**Workflow Documentation v1.0**
**Last Updated:** April 18, 2026
