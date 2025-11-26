from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'challenges', views.ChallengeViewSet, basename='challenge')

urlpatterns = [
    # Router URLs (includes all CRUD operations)
    path('', include(router.urls)),
    
    # Lyrics endpoints
    path('lyrics/search/', views.search_songs, name='search-songs'),
    path('lyrics/fetch/', views.get_lyrics, name='get-lyrics'),
    
    # Challenge creation helper
    path('challenges/create_from_lyrics/', views.create_challenge_from_lyrics, name='create-from-lyrics'),
    
    # Leaderboard
    path('leaderboard/', views.leaderboard, name='leaderboard'),
]