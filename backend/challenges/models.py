from django.db import models
from django.contrib.auth.models import User

class Challenge(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_challenges')
    song_title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    genre = models.CharField(max_length=50, blank=True)
    
    original_lyric = models.TextField()
    blanked_lyric = models.TextField()
    correct_answer = models.CharField(max_length=200)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.song_title} by {self.artist}"

class ChallengeAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    answer_submitted = models.CharField(max_length=200)
    is_correct = models.BooleanField()
    hints_used = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']