# 📤 Share Event Registration Link - Admin Guide

## Overview
Admins can now easily copy and share event registration links with end users directly from the Django admin interface.

## How to Use

### Step 1: Create or Open an Event
1. Go to **Django Admin** → **Events**
2. Click on an existing event or create a new one
3. Fill in event details (title, description, location, dates, capacity, etc.)
4. Click **Save**

### Step 2: Copy the Registration Link
Once the event is saved, scroll down to the **"📤 Share with End Users"** section.

You'll see:
- **Event Registration Link** - A text field containing the public registration URL
- **📋 Copy Link** button - Click to copy the link to clipboard

Example URL format:
```
http://localhost:8000/public/event/my-event-name/register/
```

### Step 3: Share with End Users
After copying the link, you can:
- Email it to end users
- Post it on social media
- Add it to event invitations
- Share via messaging apps

## What End Users See

When end users click the link, they'll see:
1. **Event Details** - Title, description, location, date, time, capacity
2. **Registration Form** with fields:
   - Full Name (required)
   - Email (required)
   - Company Name
   - Business Category
   - Mobile Number
   - Registration Type (7 options)
3. **Submit Button** - Registers them for the event

## Email Confirmation

After registration, end users automatically receive:
- **Confirmation Email** with their unique hash code
- **Event Details** in the email
- **Hash Code for Check-in** (highlighted in the email)

## Admin Features for Attendees

### View Attendee Registrations
1. Go to **Django Admin** → **Event Attendees**
2. Filter by event or search by name/email
3. Click on any attendee to view full details

### Attendee Details Include
- Full Name, Email, Phone
- Company Name, Business Category
- Registration Type
- **🔑 Registration Hash Code** - Copy button for check-in verification
- Registration date/time

### Copy Hash Code for Check-in
- Open any attendee record
- Scroll to **"🔑 Check-in Code"** section
- Click **📋 Copy Code** to copy the hash code
- Use this during event check-in to verify attendees

## Example Workflow

1. **Admin creates event** "BNI Annual Networking Event"
2. **Admin copies link** from event details: `http://localhost:8000/public/event/bni-annual-networking-event/register/`
3. **Admin emails link** to 100 potential attendees
4. **End users register** by filling the form
5. **Users receive** confirmation emails with hash codes
6. **During event check-in**, admin/staff use the hash codes to verify attendees

## Customizing the Domain (Production)

For production, update the domain in `app/admin.py`:

Change this line in the `share_link_button` method:
```python
full_url = f"http://localhost:8000{public_url}"
```

To your production domain:
```python
full_url = f"https://yourdomain.com{public_url}"
```

Or use Django's request object for automatic detection (requires additional setup).

## Important Notes

⚠️ **Hash Code Security**
- Each registration gets a unique 16-character hash code
- Hash codes are used for check-in verification
- They are generated using SHA256 + UUID for uniqueness
- Store securely and only share with authorized staff

📧 **Email Configuration**
- Ensure your email settings are configured in `.env`
- Required environment variables:
  ```
  EMAIL_HOST_USER=your-email@gmail.com
  EMAIL_HOST_PASSWORD=your-app-password
  ```

🔗 **URL Format**
- Public links are shareable and don't require login
- Format: `/public/event/{event-slug}/register/`
- Slugs are auto-generated from event title
- Check URLs are unique per event

## Troubleshooting

**❌ Copy button doesn't work**
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try manual copy (Ctrl+C after selecting text)

**❌ End users can't access the link**
- Verify the domain matches (localhost:8000 vs production)
- Check firewall/networking settings
- Ensure Django server is running

**❌ Emails not sending**
- Verify EMAIL settings in `settings.py`
- Check email credentials in `.env`
- Review email logs for errors

---

**Last Updated:** April 18, 2026
