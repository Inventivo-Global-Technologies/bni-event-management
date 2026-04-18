from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from .models import Event, EventAttendee
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from datetime import datetime
from django.utils import timezone
import json
import string 
import random
from django.http import JsonResponse
from django.conf import settings

@login_required(login_url='admin_login')
def home(request):
    """Home page - List all events (requires login)"""
    # Redirect admins to dashboard, regular users to event list
    if request.user.is_staff:
        return redirect('admin_dashboard')
    
    all_events = Event.objects.all()
    active_events = all_events.exclude(status='completed')
    completed_events = all_events.filter(status='completed')
    
    stats = {
        'total_events': Event.objects.count(),
        'upcoming_events': Event.objects.filter(status='upcoming').count(),
        'completed_events': Event.objects.filter(status='completed').count(),
        'total_attendees': EventAttendee.objects.count(),
    }
    return render(request, 'app/index.html', {
        'active_events': active_events,
        'completed_events': completed_events,
        'stats': stats
    })


@login_required(login_url='admin_login')
def event_list(request):
    """List all events"""
    events = Event.objects.all()
    return render(request, 'app/event_list.html', {'events': events})


@login_required(login_url='admin_login')
def event_poster(request, slug):
    """View public event poster - no application UI"""
    event = get_object_or_404(Event, slug=slug)
    return render(request, 'app/event_poster.html', {'event': event})


@login_required(login_url='admin_login')
@require_http_methods(["GET", "POST"])
def event_create(request):
    """Create a new event"""
    if request.method == 'POST':
        try:
            # Parse date strings to datetime objects
            start_date_str = request.POST.get('start_date')
            end_date_str = request.POST.get('end_date')
            
            # Try to parse datetime with different formats
            try:
                start_date = datetime.fromisoformat(start_date_str)
            except (ValueError, TypeError):
                start_date = datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M')
            
            try:
                end_date = datetime.fromisoformat(end_date_str)
            except (ValueError, TypeError):
                end_date = datetime.strptime(end_date_str, '%Y-%m-%dT%H:%M')
            
            # Make them timezone-aware
            if start_date.tzinfo is None:
                start_date = timezone.make_aware(start_date)
            if end_date.tzinfo is None:
                end_date = timezone.make_aware(end_date)
            
            event = Event.objects.create(
                title=request.POST.get('title'),
                description=request.POST.get('description'),
                location=request.POST.get('location'),
                start_date=start_date,
                end_date=end_date,
                capacity=int(request.POST.get('capacity', 0)),
                status=request.POST.get('status', 'upcoming'),
                poster_url=request.POST.get('poster_url', '')
            )
            messages.success(request, f'Event "{event.title}" created successfully!')
            return redirect('event_poster', slug=event.slug)
        except Exception as e:
            messages.error(request, f'Error creating event: {str(e)}')
            return redirect('event_create')
    
    return render(request, 'app/event_create.html')


@login_required(login_url='admin_login')
def event_detail(request, slug):
    """View event details and attendees"""
    event = get_object_or_404(Event, slug=slug)
    attendees = event.attendees.all()
    return render(request, 'app/event_detail.html', {
        'event': event,
        'attendees': attendees,
        'remaining_capacity': event.capacity - event.registered_count
    })


@login_required(login_url='admin_login')
@require_http_methods(["GET", "POST"])
def event_update(request, slug):
    """Update an event"""
    event = get_object_or_404(Event, slug=slug)
    
    if event.status == 'completed':
        messages.error(request, 'Cannot modify a completed event!')
        return redirect('event_detail', slug=event.slug)
    
    if request.method == 'POST':
        try:
            event.title = request.POST.get('title', event.title)
            event.description = request.POST.get('description', event.description)
            event.location = request.POST.get('location', event.location)
            event.capacity = int(request.POST.get('capacity', event.capacity))
            event.status = request.POST.get('status', event.status)
            event.poster_url = request.POST.get('poster_url', event.poster_url)
            
            # Parse dates if provided
            start_date_str = request.POST.get('start_date')
            if start_date_str:
                try:
                    start_date = datetime.fromisoformat(start_date_str)
                except (ValueError, TypeError):
                    try:
                        start_date = datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M')
                    except (ValueError, TypeError):
                        start_date = event.start_date
                
                if start_date.tzinfo is None:
                    start_date = timezone.make_aware(start_date)
                event.start_date = start_date
            
            end_date_str = request.POST.get('end_date')
            if end_date_str:
                try:
                    end_date = datetime.fromisoformat(end_date_str)
                except (ValueError, TypeError):
                    try:
                        end_date = datetime.strptime(end_date_str, '%Y-%m-%dT%H:%M')
                    except (ValueError, TypeError):
                        end_date = event.end_date
                
                if end_date.tzinfo is None:
                    end_date = timezone.make_aware(end_date)
                event.end_date = end_date
            
            event.save()
            messages.success(request, f'Event "{event.title}" updated successfully!')
            return redirect('event_detail', slug=event.slug)
        except Exception as e:
            messages.error(request, f'Error updating event: {str(e)}')
    
    return render(request, 'app/event_update.html', {'event': event})


@login_required(login_url='admin_login')
@require_http_methods(["POST"])
def event_delete(request, slug):
    """Delete an event"""
    event = get_object_or_404(Event, slug=slug)
    
    if event.status == 'completed':
        messages.error(request, 'Cannot delete a completed event!')
        return redirect('event_detail', slug=event.slug)
    
    event_title = event.title
    event.delete()
    messages.success(request, f'Event "{event_title}" deleted successfully!')
    return redirect('event_list')


@login_required(login_url='admin_login')
@require_http_methods(["GET", "POST"])
def register_attendee(request, slug):
    """Register an attendee for an event"""
    event = get_object_or_404(Event, slug=slug)
    
    if event.status == 'completed':
        messages.error(request, 'Cannot register for a completed event!')
        return redirect('event_detail', slug=event.slug)
    
    if request.method == 'POST':
        try:
            if event.registered_count >= event.capacity:
                messages.error(request, 'Event is full! No more registrations allowed.')
                return redirect('event_detail', slug=event.slug)
            
            attendee, created = EventAttendee.objects.get_or_create(
                event=event,
                email=request.POST.get('email'),
                defaults={
                    'name': request.POST.get('name'),
                    'phone': request.POST.get('phone'),
                }
            )
            
            if created:
                event.registered_count += 1
                event.save()
                messages.success(request, 'Registered successfully for the event!')
            else:
                messages.info(request, 'You are already registered for this event.')
            
            return redirect('event_detail', slug=event.slug)
        except Exception as e:
            messages.error(request, f'Error registering: {str(e)}')
            return redirect('event_detail', slug=event.slug)
    
    return render(request, 'app/register.html', {'event': event})


@login_required(login_url='admin_login')
def attendee_list(request, slug):
    """List attendees for an event"""
    event = get_object_or_404(Event, slug=slug)
    attendees = event.attendees.all()
    return render(request, 'app/attendee_list.html', {
        'event': event,
        'attendees': attendees
    })


@login_required(login_url='admin_login')
@require_http_methods(["POST"])
def remove_attendee(request, slug, attendee_id):
    """Remove an attendee from an event"""
    event = get_object_or_404(Event, slug=slug)
    
    if event.status == 'completed':
        messages.error(request, 'Cannot remove attendees from a completed event!')
        return redirect('attendee_list', slug=event.slug)
    
    attendee = get_object_or_404(EventAttendee, id=attendee_id, event=event)
    attendee_name = attendee.name
    attendee.delete()
    event.registered_count = max(0, event.registered_count - 1)
    event.save()
    messages.success(request, f'Attendee "{attendee_name}" removed successfully!')
    return redirect('attendee_list', slug=event.slug)


def generate_room_id():
    """Generate a unique 5-character alphanumeric room ID"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(characters, k=5))

def send_event_invitation(user_email, user_name, event=None):
    """Send an immersive event invitation email with event details"""
    room_id = generate_room_id()
    
    # Default event details if not provided
    event_title = event.title if event else "Amazing Event"
    event_date = event.start_date.strftime("%B %d, %Y") if event else "TBA"
    event_time = event.start_date.strftime("%I:%M %p") if event else "TBA"
    event_location = event.location if event else "Virtual"
    event_description = event.description if event else "Join us for an amazing experience!"
    event_capacity = event.capacity if event else "Limited"
    poster_url = event.poster_url if event and event.poster_url else "https://via.placeholder.com/600x300?text=Event+Poster"

    subject = f"🎉 You're Invited to {event_title}! - Room ID: {room_id}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Roboto, Arial, sans-serif;
                background-color: #f4f6f8;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }}
            .header {{
                background: linear-gradient(90deg, #4285F4, #34A853);
                color: white;
                padding: 20px;
                text-align: center;
                font-size: 22px;
                font-weight: bold;
            }}
            .content {{
                padding: 30px;
                color: #333;
                line-height: 1.6;
            }}
            .highlight {{
                font-size: 18px;
                font-weight: bold;
                color: #4285F4;
                margin: 20px 0;
            }}
            .room-id {{
                display: inline-block;
                background: #f1f3f4;
                padding: 10px 15px;
                border-radius: 6px;
                font-size: 20px;
                letter-spacing: 2px;
                font-weight: bold;
                color: #202124;
            }}
            .footer {{
                text-align: center;
                padding: 15px;
                font-size: 12px;
                color: #888;
            }}
            .button {{
                display: inline-block;
                padding: 12px 20px;
                background: #4285F4;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                🎉 You're Invited!
            </div>
            <div class="content">
                <p>Hi <strong>{user_name}</strong>,</p>

                <p>
                    We’re thrilled to invite you to an exclusive event filled with
                    inspiration, innovation, and amazing experiences.
                </p>

                <p>
                    Get ready to connect, explore, and be part of something truly special.
                    This event is crafted to bring together brilliant minds and create unforgettable moments.
                </p>

                <div class="highlight">
                    🔐 Your Personal Room ID
                </div>

                <div class="room-id">{room_id}</div>

                <p>
                    Please use this Room ID to join your personalized session.
                </p>

                <a href="#" class="button">Join Event</a>

                <p style="margin-top:30px;">
                    Looking forward to seeing you there! 🚀
                </p>
            </div>

            <div class="footer">
                © 2026 Your Company. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """

    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject,
        text_content,
        "no-reply@yourcompany.com",
        [user_email]
    )

    email.attach_alternative(html_content, "text/html")
    email.send()

    return room_id


# ============================================
# ADMIN PANEL VIEWS
# ============================================

@require_http_methods(["GET", "POST"])
def admin_login(request):
    """Admin login view"""
    # If already logged in, redirect to dashboard
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('admin_dashboard')
        else:
            # Log them out if they're not staff
            logout(request)
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None and user.is_staff:
            login(request, user)
            messages.success(request, f'Welcome back, {user.username}!')
            # Redirect to next page or dashboard
            next_page = request.GET.get('next', 'admin_dashboard')
            return redirect(next_page)
        else:
            messages.error(request, 'Invalid credentials or insufficient permissions.')
    
    return render(request, 'app/admin_login.html')


@login_required(login_url='admin_login')
def admin_dashboard(request):
    """Admin dashboard for event management"""
    if not request.user.is_staff:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    
    # Get statistics
    total_events = Event.objects.count()
    upcoming_events = Event.objects.filter(status='upcoming').count()
    ongoing_events = Event.objects.filter(status='ongoing').count()
    completed_events = Event.objects.filter(status='completed').count()
    total_attendees = EventAttendee.objects.count()
    cancelled_events = Event.objects.filter(status='cancelled').count()
    
    # Get all events with attendee counts
    events = Event.objects.all().order_by('-created_at')
    
    stats = {
        'total_events': total_events,
        'upcoming_events': upcoming_events,
        'ongoing_events': ongoing_events,
        'completed_events': completed_events,
        'cancelled_events': cancelled_events,
        'total_attendees': total_attendees,
    }
    
    return render(request, 'app/admin_dashboard.html', {
        'events': events,
        'stats': stats,
        'user': request.user
    })


@login_required(login_url='admin_login')
def admin_event_detail(request, slug):
    """Admin view for event details and attendee management"""
    if not request.user.is_staff:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    
    event = get_object_or_404(Event, slug=slug)
    attendees = event.attendees.all()
    
    return render(request, 'app/admin_event_detail.html', {
        'event': event,
        'attendees': attendees,
        'remaining_capacity': event.capacity - event.registered_count
    })


@login_required(login_url='admin_login')
def admin_logout(request):
    """Admin logout view"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('admin_login')


# ============================================
# PUBLIC VIEWS (NO LOGIN REQUIRED)
# ============================================

def public_events(request):
    """Public event listing page - no login required"""
    events = Event.objects.exclude(status='cancelled').order_by('-start_date')
    
    stats = {
        'total_events': Event.objects.count(),
        'upcoming_events': Event.objects.filter(status='upcoming').count(),
        'completed_events': Event.objects.filter(status='completed').count(),
        'total_attendees': EventAttendee.objects.count(),
    }
    
    return render(request, 'app/public_events.html', {
        'events': events,
        'total_events': stats['total_events'],
        'upcoming_events': stats['upcoming_events'],
        'completed_events': stats['completed_events'],
        'total_attendees': stats['total_attendees'],
    })


def public_event_detail(request, slug):
    """Public event detail page - no login required"""
    event = get_object_or_404(Event, slug=slug)
    return render(request, 'app/public_event_detail.html', {'event': event})


@require_http_methods(["GET", "POST"])
def public_register(request, slug):
    """Public attendee registration - no login required"""
    event = get_object_or_404(Event, slug=slug)
    
    if event.status == 'completed' or event.status == 'cancelled':
        messages.error(request, f'Registration is not available for this {event.get_status_display().lower()} event.')
        return redirect('public_event_detail', slug=event.slug)
    
    if request.method == 'POST':
        try:
            if event.registered_count >= event.capacity:
                messages.error(request, 'This event has reached its maximum capacity. Registration is closed.')
                return redirect('public_event_detail', slug=event.slug)
            
            email = request.POST.get('email')
            full_name = request.POST.get('full_name')
            company_name = request.POST.get('company_name', '')
            business_category = request.POST.get('business_category', '')
            phone = request.POST.get('phone', '')
            registration_type = request.POST.get('registration_type', 'visitor')
            
            # Check if already registered
            attendee, created = EventAttendee.objects.get_or_create(
                event=event,
                email=email,
                defaults={
                    'full_name': full_name,
                    'company_name': company_name,
                    'business_category': business_category,
                    'phone': phone,
                    'registration_type': registration_type,
                }
            )
            
            if created:
                # Increment registered count
                event.registered_count += 1
                event.save()
                
                # Send registration confirmation email with hash code
                send_registration_confirmation_email(attendee)
                
                messages.success(request, f'✅ Registration successful! Check your email for confirmation and hash code.')
                return redirect('registration_success', slug=event.slug, attendee_id=attendee.id)
            else:
                messages.info(request, 'You are already registered for this event. Check your email for your confirmation details.')
                return redirect('public_event_detail', slug=event.slug)
                
        except Exception as e:
            messages.error(request, f'Error during registration: {str(e)}')
            return redirect('public_event_detail', slug=event.slug)
    
    return render(request, 'app/public_register.html', {'event': event})


def registration_success(request, slug, attendee_id):
    """Registration success page"""
    event = get_object_or_404(Event, slug=slug)
    attendee = get_object_or_404(EventAttendee, id=attendee_id, event=event)
    
    return render(request, 'app/registration_success.html', {
        'event': event,
        'attendee': attendee,
    })


def send_registration_confirmation_email(attendee):
    """Send registration confirmation email with hash code"""
    event = attendee.event
    
    subject = f'✅ Registration Confirmed - {event.title} | Hash Code: {attendee.registration_hash}'
    
    # Build phone row if exists
    phone_row = ''
    if attendee.phone:
        phone_row = f'<tr><td>Phone</td><td>{attendee.phone}</td></tr>'
    
    # Build company row if exists
    company_row = ''
    if attendee.company_name:
        company_row = f'<tr><td>Company</td><td>{attendee.company_name}</td></tr>'
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Roboto, Arial, sans-serif;
                background-color: #f4f6f8;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
            }}
            .content {{
                padding: 30px;
                color: #333;
                line-height: 1.8;
            }}
            .hash-code {{
                background: #f8f9fa;
                border: 2px solid #667eea;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            }}
            .hash-code-label {{
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }}
            .hash-code-value {{
                font-size: 28px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 2px;
                font-family: monospace;
            }}
            .info-table {{
                width: 100%;
                margin: 20px 0;
                border-collapse: collapse;
            }}
            .info-table td {{
                padding: 12px;
                border-bottom: 1px solid #e0e0e0;
            }}
            .info-table td:first-child {{
                font-weight: 600;
                width: 150px;
                color: #555;
            }}
            .info-table td:last-child {{
                color: #333;
            }}
            .section-title {{
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-top: 20px;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 2px solid #667eea;
            }}
            .footer {{
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #e0e0e0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Registration Confirmed!</h1>
            </div>
            
            <div class="content">
                <p>Dear <strong>{attendee.full_name}</strong>,</p>
                
                <p>Thank you for registering for our event! Your registration has been confirmed. Please save your unique hash code for event check-in.</p>
                
                <div class="hash-code">
                    <div class="hash-code-label">Your Event Hash Code</div>
                    <div class="hash-code-value">{attendee.registration_hash}</div>
                </div>
                
                <div class="section-title">📋 Registration Details</div>
                <table class="info-table">
                    <tr>
                        <td>Full Name</td>
                        <td>{attendee.full_name}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{attendee.email}</td>
                    </tr>
                    {phone_row}
                    {company_row}
                    <tr>
                        <td>Registration Type</td>
                        <td>{attendee.get_registration_type_display()}</td>
                    </tr>
                </table>
                
                <div class="section-title">🎯 Event Details</div>
                <table class="info-table">
                    <tr>
                        <td>Event Title</td>
                        <td>{event.title}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>{event.start_date.strftime('%B %d, %Y')}</td>
                    </tr>
                    <tr>
                        <td>Time</td>
                        <td>{event.start_date.strftime('%I:%M %p')} - {event.end_date.strftime('%I:%M %p')}</td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td>{event.location}</td>
                    </tr>
                </table>
                
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Important:</strong> Please bring this hash code ({attendee.registration_hash}) or this email to the event for check-in.
                </p>
                
                <p>If you have any questions, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br><strong>BNI Event Management Team</strong></p>
            </div>
            
            <div class="footer">
                <p>&copy; 2026 BNI Event Management. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Registration Confirmed!
    
    Dear {attendee.full_name},
    
    Thank you for registering for our event!
    
    EVENT HASH CODE: {attendee.registration_hash}
    
    Registration Details:
    - Full Name: {attendee.full_name}
    - Email: {attendee.email}
    {f'- Phone: {attendee.phone}' if attendee.phone else ''}
    {f'- Company: {attendee.company_name}' if attendee.company_name else ''}
    - Registration Type: {attendee.get_registration_type_display()}
    
    Event Details:
    - Event Title: {event.title}
    - Date: {event.start_date.strftime('%B %d, %Y')}
    - Time: {event.start_date.strftime('%I:%M %p')} - {event.end_date.strftime('%I:%M %p')}
    - Location: {event.location}
    
    Please bring this hash code or this email to the event for check-in.
    
    Best regards,
    BNI Event Management Team
    """
    
    email = EmailMultiAlternatives(
        subject,
        text_content,
        settings.EMAIL_HOST_USER,
        [attendee.email]
    )
    
    email.attach_alternative(html_content, "text/html")
    email.send()
