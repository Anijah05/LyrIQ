from rest_framework import serializers
from .models import Challenge, ChallengeAttempt

class ChallengeSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    
    class Meta:
        model = Challenge
        fields = [
            'id', 'song_title', 'artist', 'genre',
            'blanked_lyric', 'correct_answer',
            'creator', 'creator_name', 'created_at'
        ]
        read_only_fields = ['id', 'creator', 'created_at']

class ChallengeDetailSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    
    class Meta:
        model = Challenge
        fields = [
            'id', 'song_title', 'artist', 'genre',
            'original_lyric', 'blanked_lyric', 'correct_answer',
            'creator', 'creator_name', 'created_at'
        ]
        read_only_fields = ['id', 'creator', 'created_at']

class ChallengeAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeAttempt
        fields = ['id', 'challenge', 'answer_submitted', 'is_correct', 'hints_used', 'created_at']
        read_only_fields = ['id', 'user', 'is_correct', 'created_at']