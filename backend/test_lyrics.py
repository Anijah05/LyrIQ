print("Step 1: Starting test...")

import os
import sys
print("Step 2: Imports successful")

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
print("Step 3: Path added")

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
print("Step 4: Django settings configured")

import django
django.setup()
print("Step 5: Django setup complete")

from decouple import config
print(f"Step 6: Genius API Key present: {bool(config('GENIUS_API_KEY', default=None))}")

from challenges.services.lyrics_service import lyrics_service
print("Step 7: Lyrics service imported")

print("\nTesting Genius API connection...")

try:
    songs = lyrics_service.search_songs("Hello", max_results=2)
    print(f"Step 8: Search completed, found {len(songs)} songs")
    
    if songs:
        print("\n✓ Success! Songs found:")
        for song in songs:
            print(f"  - {song['title']} by {song['artist']}")
    else:
        print("✗ No songs returned")
        
except Exception as e:
    print(f"✗ Error occurred: {str(e)}")
    import traceback
    traceback.print_exc()

print("\nTest complete.")