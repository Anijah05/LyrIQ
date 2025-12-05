// src/api/backend.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Important for CORS
});

export interface LeaderboardPlayer {
  rank: number;
  username: string;
  score: number;
  challenges_completed: number;
  challenges_created: number;
}

export interface Challenge {
  id: number;
  song_title: string;
  artist: string;
  genre: string;
  blanked_lyric: string;
  correct_answer?: string;
  original_lyric?: string;
  creator_name: string;
  created_at: string;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  correct_answer?: string;
  score: number;
  message: string;
}

export const getLeaderboard = async (): Promise<LeaderboardPlayer[]> => {
  const response = await api.get('/leaderboard/');
  return response.data.leaderboard;
};

export const getAllChallenges = async (): Promise<Challenge[]> => {
  const response = await api.get('/challenges/');
  return response.data;
};

export const submitAnswer = async (
  challengeId: number,
  answer: string,
  hintsUsed: number = 0
): Promise<SubmitAnswerResponse> => {
  try {
    const response = await api.post(`/challenges/${challengeId}/submit_answer/`, {
      answer: answer,
      hints_used: hintsUsed
    });
    return response.data;
  } catch (error: any) {
    console.error('Submit answer error:', error.response?.data || error);
    throw error;
  }
};