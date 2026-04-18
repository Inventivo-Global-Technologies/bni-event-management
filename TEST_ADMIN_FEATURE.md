# 🚀 Quick Start - Test Admin Share Link Feature

## Step 1: Start the Development Server

```bash
cd D:\Projects\bni_event_management
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

## Step 2: Login to Django Admin

1. Open browser: `http://localhost:8000/admin/`
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin@123`

## Step 3: Test Share Link Feature

### Test 3A: Create a Test Event

1. Click **"Events"** in the admin panel
2. Click **"+ Add Event"** button
3. Fill in the form:
   ```
   Title: Test Event 2026
   Description: This is a test event
   Location: New York City
   Start Date: 2026-05-20 10:00 AM
   End Date: 2026-05-20 05:00 PM
   Capacity: 50
   Status: Upcoming
   ```
4. Click **"Save"**

### Test 3B: Copy Event Registration Link

1. Click on the event you just created
2. **Scroll down** to find **"📤 Share with End Users"** section
3. You'll see:
   ```
   🔗 Event Registration Link
   [http://localhost:8000/public/event/test-event-2026/register/]
   [📋 Copy Link]
   ```
4. Click the **"📋 Copy Link"** button
   - Button should change to **"✅ Copied!"** in green
   - URL is now in your clipboard

### Test 3C: Test the Registration Link

1. **Open a new browser tab** (or incognito window)
2. Paste the URL from clipboard: `http://localhost:8000/public/event/test-event-2026/register/`
3. You should see the **Registration Form** with fields:
   - Full Name (required)
   - Email (required)
   - Company Name
   - Business Category
   - Mobile Number
   - Registration Type (dropdown with 7 options)
4. **Fill the form:**
   ```
   Full Name: John Smith
   Email: john@example.com
   Company: Acme Corp
   Business Category: Technology
   Mobile: +1-555-0100
   Registration Type: Primary Member
   ```
5. Click **"🎫 Complete Registration"**

### Test 3D: Verify Registration Success

1. You should see **Success Page** with:
   - ✅ Green checkmark
   - "Registration Successful!" message
   - **Your Hash Code** displayed prominently
   - Example: `A1B2C3D4E5F6G7H8`
   - "Confirmation Email Sent!" message

### Test 3E: View Attendee Hash Code in Admin

1. **Go back to Django Admin tab**
2. Click **"Events"** → Select your event
3. Click **"Event Attendees"** (or navigate to Event Attendees list)
4. You should see **"John Smith"** in the list with hash code showing as `A1B2C3...`
5. Click on **"John Smith"** to open their details
6. **Scroll down** to **"🔑 Check-in Code"** section
7. You'll see:
   ```
   🔑 Registration Hash Code (for check-in)
   [A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6]
   [📋 Copy Code]
   ```
8. Click **"📋 Copy Code"** button
   - Button should change to **"✅ Copied!"** in green

## Step 4: Verify Email (Optional)

If email is configured:
1. Check the email inbox used during registration
2. You should receive an email with:
   - Subject: `✅ Registration Confirmed - Test Event 2026 | Hash Code: A1B2C3...`
   - Body contains the hash code prominently displayed
   - Registration details and event information

## ✅ Feature Verification Checklist

- [ ] Share Link button appears in Event Admin
- [ ] Copy Link button works (changes to "✅ Copied!")
- [ ] URL copied correctly to clipboard
- [ ] Registration form loads when using shared URL
- [ ] Form submission creates attendee record
- [ ] Success page shows hash code
- [ ] Attendee appears in admin list
- [ ] Hash code visible in attendee detail view
- [ ] Copy Code button works (changes to "✅ Copied!")
- [ ] Email received with confirmation (if configured)

## 🔍 What Should Happen

### Admin Clicks Copy Link
```
Before: [📋 Copy Link]
        ↓ (click)
After:  [✅ Copied!] ← shows for 2 seconds
        ↓ (after 2 seconds)
Back to: [📋 Copy Link]
```

### User Copies Hash Code
```
Before: [📋 Copy Code]
        ↓ (click)
After:  [✅ Copied!] ← shows for 2 seconds
        ↓ (after 2 seconds)
Back to: [📋 Copy Code]
```

## 🐛 Troubleshooting

**Copy button doesn't work?**
- Open browser DevTools (F12)
- Check Console tab for JavaScript errors
- Ensure JavaScript is enabled in browser

**Hash code not showing?**
- Click on attendee name in the list
- Scroll down in detail view
- Check if attendee record was created

**Registration form not loading?**
- Verify event slug is correct in URL
- Check Django console for errors
- Ensure event status is "Upcoming"

**Email not received?**
- Configure EMAIL settings in `.env`
- Check email service logs
- Verify email address is correct

## 📝 Test Data Template

Use this for testing multiple registrations:

```
Registration 1:
- Name: Alice Johnson
- Email: alice@example.com
- Type: VIP

Registration 2:
- Name: Bob Wilson
- Email: bob@example.com
- Type: Visitor

Registration 3:
- Name: Carol Davis
- Email: carol@example.com
- Type: Support Staff
```

## 💡 Pro Tips

1. **Test in Incognito Window** - Use incognito/private browser tab to test registration link independently
2. **Check Admin Twice** - Refresh admin page after registration to see updated attendee list
3. **Copy Multiple Times** - Test copy button multiple times to ensure consistency
4. **Different Emails** - Use different email addresses for each registration to test uniqueness
5. **Check Terminal** - Monitor Django server terminal for any error messages

## 📱 Mobile Testing

To test on mobile:
1. Find your computer IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
2. Access admin on phone: `http://{YOUR_IP}:8000/admin/`
3. Test copy buttons work on touch devices

## 🎉 Success Criteria

✅ **Feature is working correctly if:**
- Copy buttons change to "✅ Copied!" when clicked
- URLs and hash codes are successfully copied to clipboard
- New event registrations create attendee records
- Hash codes are unique for each registration
- Admin can easily share links and verify attendees
- All information displays correctly in admin interface

---

**Ready to test?** Start with Step 1! 🚀
