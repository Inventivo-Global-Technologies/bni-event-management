# Generated migration for EventAttendee model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_event_poster_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventattendee',
            name='name',
            field=models.CharField(max_length=200),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='eventattendee',
            name='name',
        ),
        migrations.AddField(
            model_name='eventattendee',
            name='full_name',
            field=models.CharField(max_length=200, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='eventattendee',
            name='company_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='eventattendee',
            name='business_category',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='eventattendee',
            name='phone',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AddField(
            model_name='eventattendee',
            name='registration_type',
            field=models.CharField(
                choices=[
                    ('primary_member', 'Primary Member'),
                    ('cross_region', 'Cross Region'),
                    ('launch_member', 'Launch Member'),
                    ('family_member', 'Family Member'),
                    ('vip', 'VIP'),
                    ('visitor', 'Visitor'),
                    ('support_staff', 'Support Staff'),
                ],
                default='visitor',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='eventattendee',
            name='registration_hash',
            field=models.CharField(max_length=64, unique=True, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='eventattendee',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
    ]
