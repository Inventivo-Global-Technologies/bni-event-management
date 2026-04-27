#!/bin/bash
# Install backend dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py create_admin_user

# Start Django backend server
python manage.py runserver 0.0.0.0:8000
