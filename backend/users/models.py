from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    firebase_uid = models.CharField(max_length=128, unique=True)
    display_name = models.CharField(max_length=100)
    total_score = models.IntegerField(default=0)
    challenges_created = models.IntegerField(default=0)
    challenges_completed = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.display_name