from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import Event, EventAttendee
import json
from django.http import JsonResponse

def home(request):
    """Home page - List all events"""
    events = Event.objects.all()
    stats = {
        'total_events': Event.objects.count(),
        'upcoming_events': Event.objects.filter(status='upcoming').count(),
        'completed_events': Event.objects.filter(status='completed').count(),
        'total_attendees': EventAttendee.objects.count(),
    }
    return render(request, 'app/index.html', {'events': events, 'stats': stats})


def event_list(request):
    """List all events"""
    events = Event.objects.all()
    return render(request, 'app/event_list.html', {'events': events})


@require_http_methods(["GET", "POST"])
def event_create(request):
    """Create a new event"""
    if request.method == 'POST':
        try:
            event = Event.objects.create(
                title=request.POST.get('title'),
                description=request.POST.get('description'),
                location=request.POST.get('location'),
                start_date=request.POST.get('start_date'),
                end_date=request.POST.get('end_date'),
                capacity=int(request.POST.get('capacity', 0)),
                status=request.POST.get('status', 'upcoming')
            )
            messages.success(request, f'Event "{event.title}" created successfully!')
            return redirect('event_detail', slug=event.slug)
        except Exception as e:
            messages.error(request, f'Error creating event: {str(e)}')
            return redirect('event_create')
    
    return render(request, 'app/event_create.html')


def event_detail(request, slug):
    """View event details and attendees"""
    event = get_object_or_404(Event, slug=slug)
    attendees = event.attendees.all()
    return render(request, 'app/event_detail.html', {
        'event': event,
        'attendees': attendees,
        'remaining_capacity': event.capacity - event.registered_count
    })


@require_http_methods(["GET", "POST"])
def event_update(request, slug):
    """Update an event"""
    event = get_object_or_404(Event, slug=slug)
    
    if request.method == 'POST':
        try:
            event.title = request.POST.get('title', event.title)
            event.description = request.POST.get('description', event.description)
            event.location = request.POST.get('location', event.location)
            event.start_date = request.POST.get('start_date', event.start_date)
            event.end_date = request.POST.get('end_date', event.end_date)
            event.capacity = int(request.POST.get('capacity', event.capacity))
            event.status = request.POST.get('status', event.status)
            event.save()
            messages.success(request, f'Event "{event.title}" updated successfully!')
            return redirect('event_detail', slug=event.slug)
        except Exception as e:
            messages.error(request, f'Error updating event: {str(e)}')
    
    return render(request, 'app/event_update.html', {'event': event})


@require_http_methods(["POST"])
def event_delete(request, slug):
    """Delete an event"""
    event = get_object_or_404(Event, slug=slug)
    event_title = event.title
    event.delete()
    messages.success(request, f'Event "{event_title}" deleted successfully!')
    return redirect('event_list')


@require_http_methods(["GET", "POST"])
def register_attendee(request, slug):
    """Register an attendee for an event"""
    event = get_object_or_404(Event, slug=slug)
    
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


def attendee_list(request, slug):
    """List attendees for an event"""
    event = get_object_or_404(Event, slug=slug)
    attendees = event.attendees.all()
    return render(request, 'app/attendee_list.html', {
        'event': event,
        'attendees': attendees
    })


@require_http_methods(["POST"])
def remove_attendee(request, slug, attendee_id):
    """Remove an attendee from an event"""
    event = get_object_or_404(Event, slug=slug)
    attendee = get_object_or_404(EventAttendee, id=attendee_id, event=event)
    attendee_name = attendee.name
    attendee.delete()
    event.registered_count = max(0, event.registered_count - 1)
    event.save()
    messages.success(request, f'Attendee "{attendee_name}" removed successfully!')
    return redirect('attendee_list', slug=event.slug)