from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Create or update the admin superuser'

    def handle(self, *args, **options):
        email = 'admin@gmail.com'
        password = 'admin@123'
        
        # Check if admin user already exists
        if User.objects.filter(username='admin').exists():
            # Update existing admin user
            admin_user = User.objects.get(username='admin')
            admin_user.email = email
            admin_user.set_password(password)
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Successfully updated admin user'))
        else:
            # Create new admin user
            User.objects.create_superuser(
                username='admin',
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS('Successfully created admin user'))
        
        self.stdout.write(self.style.SUCCESS(f'✓ Admin Panel URL: /admin/'))
        self.stdout.write(self.style.SUCCESS(f'✓ Username: admin'))
        self.stdout.write(self.style.SUCCESS(f'✓ Email: {email}'))
        self.stdout.write(self.style.SUCCESS(f'✓ Password: {password}'))
