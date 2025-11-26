import lyricsgenius
from decouple import config
import re

class LyricsService:
    def __init__(self):
        """Initialize Genius API client"""
        api_key = config('GENIUS_API_KEY')
        self.genius = lyricsgenius.Genius(
            api_key,
            skip_non_songs=True,
            excluded_terms=["(Remix)", "(Live)"],
            remove_section_headers=True,
            verbose=False
        )
    
    def search_songs(self, query, max_results=10):
        """
        Search for songs by title or artist
        Returns: List of song dictionaries with basic info
        """
        try:
            response = self.genius.search_songs(query)
            
            songs = []
            for hit in response['hits'][:max_results]:
                song_data = hit['result']
                songs.append({
                    'id': song_data['id'],
                    'title': song_data['title'],
                    'artist': song_data['primary_artist']['name'],
                    'album': song_data.get('album', {}).get('name', 'Unknown'),
                    'release_date': song_data.get('release_date_for_display', 'Unknown'),
                    'thumbnail': song_data.get('song_art_image_thumbnail_url', ''),
                    'url': song_data['url']
                })
            
            return songs
        except Exception as e:
            print(f"Error searching songs: {str(e)}")
            return []
    
    def get_lyrics(self, song_id):
        """
        Get full lyrics for a specific song by ID
        Returns: Dictionary with song info and lyrics
        """
        try:
            song = self.genius.song(song_id)
            
            if song and 'song' in song:
                song_data = song['song']
                lyrics = song_data.get('lyrics', '')
                
                # Clean up lyrics
                lyrics = self._clean_lyrics(lyrics)
                
                return {
                    'id': song_data['id'],
                    'title': song_data['title'],
                    'artist': song_data['primary_artist']['name'],
                    'lyrics': lyrics,
                    'url': song_data['url']
                }
            
            return None
        except Exception as e:
            print(f"Error fetching lyrics: {str(e)}")
            return None
    
    def get_lyrics_by_search(self, title, artist=None):
        """
        Search and get lyrics in one go
        Returns: Dictionary with song info and lyrics
        """
        try:
            query = f"{title} {artist}" if artist else title
            song = self.genius.search_song(title, artist)
            
            if song:
                lyrics = self._clean_lyrics(song.lyrics)
                
                return {
                    'id': song.id if hasattr(song, 'id') else None,
                    'title': song.title if hasattr(song, 'title') else title,
                    'artist': song.artist if hasattr(song, 'artist') else artist,
                    'lyrics': lyrics,
                    'url': song.url if hasattr(song, 'url') else ''
                }
            
            return None
        except Exception as e:
            print(f"Error fetching lyrics: {str(e)}")
            return None
        
    def _clean_lyrics(self, lyrics):
        """
        Clean up lyrics text - remove unnecessary metadata
        """
        # Remove "Embed" and numbers at the end
        lyrics = re.sub(r'\d+Embed$', '', lyrics)
        lyrics = re.sub(r'Embed$', '', lyrics)
        
        # Remove "You might also like" text
        lyrics = lyrics.replace('You might also like', '')
        
        # Remove extra whitespace
        lyrics = re.sub(r'\n\s*\n', '\n\n', lyrics)
        lyrics = lyrics.strip()
        
        return lyrics
    
    def split_into_lines(self, lyrics):
        """
        Split lyrics into individual lines for challenge creation
        Returns: List of lyric lines
        """
        lines = [line.strip() for line in lyrics.split('\n') if line.strip()]
        return lines
    
    def create_challenge_snippet(self, lyrics, line_index, words_to_blank=1):
        """
        Create a fill-in-the-blank challenge from lyrics
        
        Args:
            lyrics: Full lyrics string
            line_index: Which line to use (0-indexed)
            words_to_blank: How many words to remove (default 1)
        
        Returns: Dictionary with original line, blanked line, and answer
        """
        lines = self.split_into_lines(lyrics)
        
        if line_index >= len(lines):
            return None
        
        original_line = lines[line_index]
        words = original_line.split()
        
        if len(words) < words_to_blank:
            return None
        
        # Find a good spot to blank (avoid first/last word for better gameplay)
        start_index = len(words) // 3  # Start somewhere in the middle third
        end_index = start_index + words_to_blank
        
        # Get the answer
        answer = ' '.join(words[start_index:end_index])
        
        # Create blanked version
        blanked_words = words.copy()
        for i in range(start_index, end_index):
            blanked_words[i] = '____'
        
        blanked_line = ' '.join(blanked_words)
        
        return {
            'original_line': original_line,
            'blanked_line': blanked_line,
            'answer': answer,
            'line_index': line_index
        }


# Singleton instance
lyrics_service = LyricsService()