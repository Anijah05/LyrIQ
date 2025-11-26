from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'total_score', 'challenges_created', 'challenges_completed', 'created_at']
    search_fields = ['display_name', 'user__username', 'firebase_uid']
    readonly_fields = ['firebase_uid', 'created_at']
    list_filter = ['created_at']