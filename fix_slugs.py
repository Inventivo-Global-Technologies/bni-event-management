#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bni_event_management.settings')
django.setup()

from app.models import Event
from django.utils.text import slugify

# Update all events with NULL slugs
events = Event.objects.filter(slug__isnull=True)
print(f"Found {events.count()} events with NULL slugs")

for event in events:
    event.slug = slugify(event.title)
    event.save()
    print(f"✓ Updated: {event.title} → {event.slug}")

print(f"✓ All {events.count()} events updated successfully!")
