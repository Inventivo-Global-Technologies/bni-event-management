from rest_framework import serializers
from .models import Event, EventAttendee

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'slug', 'description', 'location', 'start_date', 'end_date', 
                  'capacity', 'registered_count', 'status', 'poster_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'registered_count', 'created_at', 'updated_at']

class EventAttendeeSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventAttendee
        fields = ['id', 'full_name', 'email', 'phone', 'company_name', 'business_category', 
                  'registration_type', 'registration_hash', 'registered_at', 'is_verified', 'event_title']
        read_only_fields = ['id', 'registration_hash', 'registered_at', 'is_verified']

class EventAttendeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendee
        fields = '__all__'
        read_only_fields = ['registered_at']
