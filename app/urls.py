from django.urls import path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    # Root URL - redirect to login
    path('', RedirectView.as_view(url='admin/login/', permanent=False), name='root'),
    path('home/', views.home, name='home'),
    
    # Public Event Routes (No Login Required)
    path('events/public/', views.public_events, name='public_events'),
    path('public/event/<slug:slug>/', views.public_event_detail, name='public_event_detail'),
    path('public/event/<slug:slug>/register/', views.public_register, name='public_register'),
    path('registration/success/<slug:slug>/<int:attendee_id>/', views.registration_success, name='registration_success'),
    
    # Protected Event Routes (Login Required)
    path('events/', views.event_list, name='event_list'),
    path('events/create/', views.event_create, name='event_create'),
    path('poster/<slug:slug>/', views.event_poster, name='event_poster'),
    path('events/<slug:slug>/', views.event_detail, name='event_detail'),
    path('events/<slug:slug>/update/', views.event_update, name='event_update'),
    path('events/<slug:slug>/delete/', views.event_delete, name='event_delete'),
    path('events/<slug:slug>/register/', views.register_attendee, name='register_attendee'),
    path('events/<slug:slug>/attendees/', views.attendee_list, name='attendee_list'),
    path('events/<slug:slug>/attendees/<int:attendee_id>/remove/', views.remove_attendee, name='remove_attendee'),
    
    # Admin URLs
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/event/<slug:slug>/', views.admin_event_detail, name='admin_event_detail'),
    path('admin/logout/', views.admin_logout, name='admin_logout'),
]