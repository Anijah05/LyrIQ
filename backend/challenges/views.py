from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from difflib import SequenceMatcher

from .models import Challenge, ChallengeAttempt
from .serializers import ChallengeSerializer, ChallengeDetailSerializer, ChallengeAttemptSerializer
from .services.lyrics_service import lyrics_service


# ===== LYRICS ENDPOINTS =====

@api_view(['GET'])
def search_songs(request):
    """
    Search for songs by title/artist
    GET /api/lyrics/search/?q=song+name
    """
    query = request.GET.get('q', '')
    
    if not query:
        return Response(
            {'error': 'Query parameter "q" is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    max_results = int(request.GET.get('max_results', 10))
    songs = lyrics_service.search_songs(query, max_results)
    
    return Response({'songs': songs})


@api_view(['POST'])
def get_lyrics(request):
    """
    Get lyrics for a specific song
    POST /api/lyrics/fetch/
    Body: {"title": "Song Name", "artist": "Artist Name"}
    """
    title = request.data.get('title')
    artist = request.data.get('artist')
    
    if not title:
        return Response(
            {'error': 'Title is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    song_data = lyrics_service.get_lyrics_by_search(title, artist)
    
    if song_data:
        # Split lyrics into lines for frontend selection
        lines = lyrics_service.split_into_lines(song_data['lyrics'])
        song_data['lines'] = lines
        return Response(song_data)
    else:
        return Response(
            {'error': 'Could not fetch lyrics for this song'},
            status=status.HTTP_404_NOT_FOUND
        )


# ===== CHALLENGE ENDPOINTS =====

class ChallengeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Challenge CRUD operations
    """
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    
    def get_permissions(self):
        """
        Allow anyone to view challenges, but require auth to create/edit
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        """
        Use detailed serializer for retrieve action
        """
        if self.action == 'retrieve':
            return ChallengeDetailSerializer
        return ChallengeSerializer
    
    def perform_create(self, serializer):
        """
        Automatically set the creator to the logged-in user
        """
        serializer.save(creator=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        """
        Only allow users to delete their own challenges
        """
        challenge = self.get_object()
        
        if challenge.creator != request.user:
            return Response(
                {'error': 'You can only delete your own challenges'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_challenges(self, request):
        """
        Get all challenges created by the logged-in user
        GET /api/challenges/my_challenges/
        """
        challenges = Challenge.objects.filter(creator=request.user)
        serializer = self.get_serializer(challenges, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        """
        Submit an answer to a challenge
        POST /api/challenges/:id/submit_answer/
        Body: {"answer": "user's answer", "hints_used": 0}
        """
        challenge = self.get_object()
        submitted_answer = request.data.get('answer', '').strip()
        hints_used = request.data.get('hints_used', 0)
        
        if not submitted_answer:
            return Response(
                {'error': 'Answer is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if answer is correct (with fuzzy matching)
        is_correct = check_answer(challenge.correct_answer, submitted_answer)
        
        # Calculate score (100 points - 10 per hint used)
        score = max(0, 100 - (hints_used * 10)) if is_correct else 0
        
        # Save attempt (only if user is authenticated)
        if request.user.is_authenticated:
            ChallengeAttempt.objects.create(
                user=request.user,
                challenge=challenge,
                answer_submitted=submitted_answer,
                is_correct=is_correct,
                hints_used=hints_used
            )
        
        return Response({
            'is_correct': is_correct,
            'correct_answer': challenge.correct_answer if not is_correct else None,
            'score': score,
            'message': 'Correct!' if is_correct else 'Incorrect. Try again!'
        })
    
    @action(detail=True, methods=['post'])
    def reveal_answer(self, request, pk=None):
        """
        Reveal the answer to a challenge
        POST /api/challenges/:id/reveal_answer/
        """
        challenge = self.get_object()
        
        return Response({
            'correct_answer': challenge.correct_answer,
            'original_lyric': challenge.original_lyric
        })


@api_view(['POST'])
def create_challenge_from_lyrics(request):
    """
    Create a challenge directly from song lyrics
    POST /api/challenges/create_from_lyrics/
    Body: {
        "title": "Song Title",
        "artist": "Artist Name", 
        "line_index": 5,
        "words_to_blank": 2
    }
    """
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    title = request.data.get('title')
    artist = request.data.get('artist')
    line_index = request.data.get('line_index', 0)
    words_to_blank = request.data.get('words_to_blank', 1)
    genre = request.data.get('genre', '')
    
    if not title:
        return Response(
            {'error': 'Title is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Fetch lyrics
    song_data = lyrics_service.get_lyrics_by_search(title, artist)
    
    if not song_data:
        return Response(
            {'error': 'Could not fetch lyrics for this song'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Create challenge snippet
    challenge_data = lyrics_service.create_challenge_snippet(
        song_data['lyrics'],
        line_index,
        words_to_blank
    )
    
    if not challenge_data:
        return Response(
            {'error': 'Could not create challenge from these lyrics'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Save to database
    challenge = Challenge.objects.create(
        creator=request.user,
        song_title=song_data['title'],
        artist=song_data['artist'],
        genre=genre,
        original_lyric=challenge_data['original_line'],
        blanked_lyric=challenge_data['blanked_line'],
        correct_answer=challenge_data['answer']
    )
    
    serializer = ChallengeDetailSerializer(challenge)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ===== HELPER FUNCTIONS =====

def check_answer(correct_answer, user_answer):
    """
    Check if user's answer matches the correct answer
    Uses fuzzy matching to allow minor typos
    """
    # Normalize both answers
    correct = correct_answer.lower().strip()
    user = user_answer.lower().strip()
    
    # Exact match
    if correct == user:
        return True
    
    # Fuzzy match (85% similarity threshold)
    similarity = SequenceMatcher(None, correct, user).ratio()
    return similarity >= 0.85


# ===== LEADERBOARD ENDPOINT =====

@api_view(['GET'])
def leaderboard(request):
    """
    Get top users by score
    GET /api/leaderboard/
    """
    from users.models import UserProfile
    
    top_users = UserProfile.objects.order_by('-total_score')[:10]
    
    leaderboard_data = [
        {
            'rank': idx + 1,
            'username': profile.display_name,
            'score': profile.total_score,
            'challenges_completed': profile.challenges_completed,
            'challenges_created': profile.challenges_created
        }
        for idx, profile in enumerate(top_users)
    ]
    
    return Response({'leaderboard': leaderboard_data})