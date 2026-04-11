from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('events/', views.event_list, name='event_list'),
    path('events/create/', views.event_create, name='event_create'),
    path('events/<slug:slug>/', views.event_detail, name='event_detail'),
    path('events/<slug:slug>/update/', views.event_update, name='event_update'),
    path('events/<slug:slug>/delete/', views.event_delete, name='event_delete'),
    path('events/<slug:slug>/register/', views.register_attendee, name='register_attendee'),
    path('events/<slug:slug>/attendees/', views.attendee_list, name='attendee_list'),
    path('events/<slug:slug>/attendees/<int:attendee_id>/remove/', views.remove_attendee, name='remove_attendee'),
]