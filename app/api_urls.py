from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import EventViewSet, mark_attendance, verify_hash, admin_login, admin_logout

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [
    path('', include(router.urls)),
    path('attendees/mark-attendance/', mark_attendance, name='mark_attendance'),
    path('attendees/verify-hash/', verify_hash, name='verify_hash'),
    path('admin/login/', admin_login, name='api_admin_login'),
    path('admin/logout/', admin_logout, name='api_admin_logout'),
]
