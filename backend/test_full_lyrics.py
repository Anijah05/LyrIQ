import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from challenges.services.lyrics_service import lyrics_service

print("=== Testing Full Lyrics Fetch ===\n")

# Get lyrics for a song
song_data = lyrics_service.get_lyrics_by_search("Shape of You", "Ed Sheeran")

if song_data:
    print(f"✓ Successfully fetched lyrics!")
    print(f"Title: {song_data['title']}")
    print(f"Artist: {song_data['artist']}")
    print(f"\nLyrics preview (first 300 chars):")
    print(song_data['lyrics'][:300] + "...")
    
    # Test creating a challenge
    print("\n=== Testing Challenge Creation ===\n")
    challenge = lyrics_service.create_challenge_snippet(
        song_data['lyrics'],
        line_index=3,
        words_to_blank=2
    )
    
    if challenge:
        print("✓ Challenge created successfully!")
        print(f"Original line: {challenge['original_line']}")
        print(f"Challenge:     {challenge['blanked_line']}")
        print(f"Answer:        {challenge['answer']}")
    else:
        print("✗ Could not create challenge")
else:
    print("✗ Could not fetch lyrics")