from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Event, EventAttendee

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'start_date', 'status', 'registered_count', 'capacity')
    list_filter = ('status', 'start_date', 'created_at')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('slug', 'created_at', 'updated_at', 'share_link_button')
    
    def share_link_button(self, obj):
        """Display the public event registration URL with a copy button"""
        if not obj.id:
            return "Event must be saved first"
        
        # Build the public event registration URL
        from django.contrib.sites.shortcuts import get_current_site
        from django.http import HttpRequest
        
        # Create a request object to get the domain
        try:
            public_url = f"/public/event/{obj.slug}/register/"
            full_url = f"http://localhost:8000{public_url}"
            
            # Return HTML with copy button
            return format_html(
                '''
                <div style="background: #f0f8ff; border: 2px solid #667eea; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <p style="margin: 0 0 10px 0; font-weight: 600; color: #333;">
                        🔗 Event Registration Link
                    </p>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="text" 
                            id="share-link-input" 
                            value="{}" 
                            readonly 
                            style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; background: white;"
                        />
                        <button type="button" 
                            onclick="copyToClipboard('share-link-input')"
                            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; white-space: nowrap;">
                            📋 Copy Link
                        </button>
                    </div>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                        Share this link with end users to register for the event
                    </p>
                </div>
                <script>
                    function copyToClipboard(elementId) {{
                        const copyText = document.getElementById(elementId);
                        copyText.select();
                        copyText.setSelectionRange(0, 99999);
                        
                        try {{
                            document.execCommand('copy');
                            // Show success message
                            const button = event.target;
                            const originalText = button.textContent;
                            button.textContent = '✅ Copied!';
                            button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                            
                            setTimeout(function() {{
                                button.textContent = originalText;
                                button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            }}, 2000);
                        }} catch (err) {{
                            alert('Failed to copy link');
                        }}
                    }}
                </script>
                ''',
                full_url
            )
        except Exception as e:
            return format_html('<p style="color: #dc3545;">Error generating link: {}</p>', str(e))
    
    share_link_button.short_description = "Share Event Link"
    
    fieldsets = (
        ('Event Information', {
            'fields': ('title', 'slug', 'description', 'location')
        }),
        ('Schedule', {
            'fields': ('start_date', 'end_date')
        }),
        ('Details', {
            'fields': ('capacity', 'registered_count', 'status', 'poster_url')
        }),
        ('📤 Share with End Users', {
            'fields': ('share_link_button',),
            'description': 'Copy the registration link below and send it to end users',
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EventAttendee)
class EventAttendeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'registration_type', 'event', 'registered_at', 'display_hash')
    list_filter = ('event', 'registered_at', 'registration_type')
    search_fields = ('full_name', 'email', 'phone', 'registration_hash')
    readonly_fields = ('registered_at', 'registration_hash', 'display_hash_code')
    
    def display_hash(self, obj):
        """Display hash code in list view"""
        return format_html(
            '<code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 11px;">{}</code>',
            obj.registration_hash[:8] + '...'
        )
    display_hash.short_description = 'Hash Code'
    
    def display_hash_code(self, obj):
        """Display full hash code in detail view with copy button"""
        return format_html(
            '''
            <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #333;">
                    🔑 Registration Hash Code (for check-in)
                </p>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" 
                        id="hash-code-input" 
                        value="{}" 
                        readonly 
                        style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 14px; font-weight: bold; color: #d39e00; background: white;"
                    />
                    <button type="button" 
                        onclick="copyHashCode()"
                        style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; white-space: nowrap;">
                        📋 Copy Code
                    </button>
                </div>
            </div>
            <script>
                function copyHashCode() {{
                    const copyText = document.getElementById('hash-code-input');
                    copyText.select();
                    copyText.setSelectionRange(0, 99999);
                    
                    try {{
                        document.execCommand('copy');
                        const button = event.target;
                        const originalText = button.textContent;
                        button.textContent = '✅ Copied!';
                        button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                        
                        setTimeout(function() {{
                            button.textContent = originalText;
                            button.style.background = 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)';
                        }}, 2000);
                    }} catch (err) {{
                        alert('Failed to copy hash code');
                    }}
                }}
            </script>
            ''',
            obj.registration_hash
        )
    display_hash_code.short_description = "Hash Code for Check-in"
    
    fieldsets = (
        ('Attendee Information', {
            'fields': ('full_name', 'email', 'phone', 'company_name', 'business_category')
        }),
        ('Registration Details', {
            'fields': ('event', 'registration_type', 'registered_at')
        }),
        ('🔑 Check-in Code', {
            'fields': ('display_hash_code',),
            'description': 'This unique code is used for event check-in',
            'classes': ('wide',)
        }),
    )
