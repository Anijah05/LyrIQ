from django.contrib import admin
from .models import Challenge, ChallengeAttempt

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ['song_title', 'artist', 'creator', 'genre', 'created_at']
    list_filter = ['genre', 'created_at', 'creator']
    search_fields = ['song_title', 'artist', 'correct_answer']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Song Information', {
            'fields': ('song_title', 'artist', 'genre')
        }),
        ('Challenge Details', {
            'fields': ('original_lyric', 'blanked_lyric', 'correct_answer')
        }),
        ('Metadata', {
            'fields': ('creator', 'created_at', 'updated_at')
        }),
    )

@admin.register(ChallengeAttempt)
class ChallengeAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'challenge', 'is_correct', 'hints_used', 'created_at']
    list_filter = ['is_correct', 'created_at']
    search_fields = ['user__username', 'challenge__song_title']
    readonly_fields = ['created_at']