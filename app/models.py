from django.db import models
from django.utils import timezone
from django.utils.text import slugify
import uuid
import hashlib

class EventManager(models.Manager):
    """Custom manager to handle event status updates"""
    
    def get_queryset(self):
        """Override to automatically update completed events"""
        qs = super().get_queryset()
        # Update events where end_date has passed and status is not completed
        qs.filter(end_date__lt=timezone.now()).exclude(status='completed').update(status='completed')
        return qs

class Event(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, null=True, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    capacity = models.IntegerField()
    registered_count = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    poster_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = EventManager()
    
    def update_status_if_completed(self):
        """Automatically update status to completed if end_date has passed"""
        if self.end_date <= timezone.now() and self.status != 'completed':
            self.status = 'completed'
            return True
        return False
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Automatically update status to completed if end date has passed
        self.update_status_if_completed()
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title


class EventAttendee(models.Model):
    REGISTRATION_TYPES = [
        ('primary_member', 'Primary Member'),
        ('cross_region', 'Cross Region'),
        ('launch_member', 'Launch Member'),
        ('family_member', 'Family Member'),
        ('vip', 'VIP'),
        ('visitor', 'Visitor'),
        ('support_staff', 'Support Staff'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
    full_name = models.CharField(max_length=200)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    business_category = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    registration_type = models.CharField(max_length=20, choices=REGISTRATION_TYPES, default='visitor')
    registration_hash = models.CharField(max_length=64, unique=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('event', 'email')
    
    def generate_registration_hash(self):
        """Generate unique hash code for registration"""
        unique_string = f"{self.event.id}{self.email}{uuid.uuid4()}{timezone.now()}"
        hash_code = hashlib.sha256(unique_string.encode()).hexdigest()[:16].upper()
        return hash_code
    
    def save(self, *args, **kwargs):
        if not self.registration_hash:
            self.registration_hash = self.generate_registration_hash()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.full_name} - {self.event.title}"
