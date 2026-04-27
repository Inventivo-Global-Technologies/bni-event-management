from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import Event, EventAttendee
from .serializers import EventSerializer, EventAttendeeSerializer


def send_registration_confirmation_email(attendee, event):
    """Send registration confirmation email with event details and hash code"""
    try:
        subject = f"✅ Registration Confirmation: {event.title}"
        
        # Format dates
        event_date = event.start_date.strftime("%B %d, %Y")
        event_time = event.start_date.strftime("%I:%M %p")
        
        # Build attendance link
        attendance_link = f"{settings.FRONTEND_URL}/mark-attendance?hash={attendee.registration_hash}"
        
        # Create email content
        html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; background: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
            .content {{ padding: 20px; }}
            .event-details {{ background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }}
            .hash-code {{ background: #e8f4f8; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 16px; font-weight: bold; text-align: center; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; text-align: center; width: 100%; box-sizing: border-box; }}
            .button:hover {{ opacity: 0.9; }}
            .footer {{ text-align: center; color: #888; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Registration Confirmed!</h1>
            </div>
            <div class="content">
                <p>Dear {attendee.full_name},</p>
                <p>Thank you for registering for our event! We're excited to have you join us.</p>
                
                <div class="event-details">
                    <h2>📋 Event Details</h2>
                    <p><strong>Event:</strong> {event.title}</p>
                    <p><strong>Date:</strong> {event_date}</p>
                    <p><strong>Time:</strong> {event_time}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Type:</strong> {attendee.get_registration_type_display()}</p>
                </div>
                
                <h3>🔐 Your Registration Hash Code</h3>
                <p>Use this code to mark your attendance at the event:</p>
                <div class="hash-code">{attendee.registration_hash}</div>
                
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                    Save this code and show it on your phone or print it when you arrive at the event.
                </p>
                
                <p style="margin-top: 30px; text-align: center;">
                    <a href="{attendance_link}" class="button">📍 Mark Attendance</a>
                </p>
                
                <p style="text-align: center; color: #666; font-size: 12px;">
                    Or copy and paste this link in your browser:<br>
                    <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">{attendance_link}</code>
                </p>
                
                <p>If you have any questions, please feel free to contact us.</p>
                <p>Best regards,<br/>BNI Event Management Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 BNI Event Management. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
        
        text_content = strip_tags(html_content)
        
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [attendee.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        print(f"✅ Confirmation email sent to {attendee.email}")
        return True
    except Exception as e:
        print(f"⚠️ Error sending email to {attendee.email}: {str(e)}")
        # Don't raise exception - email failure shouldn't prevent registration
        return False

class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Event CRUD operations
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        """
        Public: list/retrieve events, register, create
        Auth required: attendees, update/delete
        """
        if self.action in ['list', 'retrieve', 'register', 'create']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def register(self, request, slug=None):
        """Register an attendee for an event"""
        event = self.get_object()
        
        # Check if capacity is available
        if event.registered_count >= event.capacity:
            return Response(
                {'message': 'This event is full. No more registrations are available.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = EventAttendeeSerializer(data=request.data)
        if serializer.is_valid():
            # Check if email already registered for this event
            existing = EventAttendee.objects.filter(event=event, email=serializer.validated_data['email']).exists()
            if existing:
                return Response(
                    {'message': 'This email is already registered for this event.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            attendee = serializer.save(event=event)
            print(f"New registration: {attendee.full_name} for event {event.title}")
            print(f"Registration hash: {attendee.registration_hash}")
            event.registered_count += 1
            event.save()
            
            # Send confirmation email with registration hash
            email_sent = send_registration_confirmation_email(attendee, event)
            print(f"Email sent: {email_sent}")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return detailed validation errors
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def attendees(self, request, slug=None):
        """Get all attendees for an event"""
        event = self.get_object()
        attendees = event.attendees.all()
        serializer = EventAttendeeSerializer(attendees, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def mark_attendance(request):
    """Mark attendance using registration hash"""
    hash_code = request.data.get('registration_hash', '').upper()
    
    if not hash_code:
        return Response(
            {'message': 'Hash code is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        attendee = EventAttendee.objects.get(registration_hash=hash_code)
    except EventAttendee.DoesNotExist:
        return Response(
            {'message': 'Invalid hash code. Please check and try again.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Mark as verified
    attendee.is_verified = True
    attendee.save()
    
    serializer = EventAttendeeSerializer(attendee)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_hash(request):
    """Verify and get attendee info by hash code"""
    hash_code = request.query_params.get('hash', '').upper()
    
    if not hash_code:
        return Response(
            {'message': 'Hash code is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        attendee = EventAttendee.objects.get(registration_hash=hash_code)
    except EventAttendee.DoesNotExist:
        return Response(
            {'message': 'Hash code not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = EventAttendeeSerializer(attendee)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """Admin login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'message': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, username=username, password=password)
    
    if user is None:
        return Response(
            {'message': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_staff:
        return Response(
            {'message': 'Only staff members can login'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    login(request, user)
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    """Admin logout endpoint"""
    logout(request)
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
