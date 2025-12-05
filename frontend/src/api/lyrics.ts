// src/api/lyrics.ts

export type LyricChallenge = {
    title: string;
    artist: string;
    preview: string;
    challengeLine: string;
    maskedLine: string;
    answer: string;
  };
  
  // change this to match your backend URL if needed
  const API_BASE_URL = "http://localhost:8000";
  
  export async function fetchLyricChallenge(): Promise<LyricChallenge> {
    const res = await fetch(`${API_BASE_URL}/api/lyric-challenge`);
  
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
  
    const data = await res.json();
  
    // make sure these keys match your backend JSON
    return {
      title: data.title,
      artist: data.artist,
      preview: data.preview,
      challengeLine: data.challenge_line,
      maskedLine: data.masked_line,
      answer: data.answer,
    };
  }
  