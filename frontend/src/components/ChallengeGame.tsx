import React, { useState, useEffect } from 'react';
import { getAllChallenges, submitAnswer, type Challenge } from '../api/backend';
import styles from './ChallengeGame.module.css';

interface ChallengeGameProps {
  level: number;
  genre?: string;
  onBack: () => void;
}

const ChallengeGame: React.FC<ChallengeGameProps> = ({ level, genre, onBack }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    score: number;
    correctAnswer?: string;
  } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, [genre]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await getAllChallenges();
      
      let filtered = genre 
        ? data.filter(c => c.genre.toLowerCase() === genre.toLowerCase())
        : data;
      
      // RANDOMIZE the challenges
      filtered = filtered.sort(() => Math.random() - 0.5);
      
      setChallenges(filtered);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentChallenge = challenges[currentIndex];

  const handleSubmit = async () => {
    console.log('Submit clicked!');
    console.log('User answer:', userAnswer);
    console.log('Current challenge:', currentChallenge);
    
    if (!userAnswer.trim()) {
      alert('Please enter an answer first!');
      return;
    }
    
    if (!currentChallenge) {
      alert('No challenge loaded!');
      return;
    }
  
    try {
      console.log('Submitting answer...');
      const result = await submitAnswer(currentChallenge.id, userAnswer, 0);
      console.log('Result:', result);
      
      setFeedback({
        isCorrect: result.is_correct,
        message: result.message,
        score: result.score,
        correctAnswer: result.correct_answer,
      });
  
      // FIX: Update score IMMEDIATELY when correct
      if (result.is_correct) {
        const newScore = totalScore + result.score;
        console.log('New score:', newScore);
        setTotalScore(newScore);
      }
  
      setTimeout(() => {
        if (currentIndex < challenges.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setUserAnswer('');
          setFeedback(null);
        } else {
          setShowComplete(true);
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error: ' + error);
    }
  };

  const handleSkip = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
      setShowComplete(true);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading challenges...</div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noChallenge}>
          <h2>No challenges available</h2>
          <button onClick={onBack} className={styles.backButton}>
            Back to Levels
          </button>
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.complete}>
          <h1>🎉 Level {level} Complete!</h1>
          <div className={styles.scoreDisplay}>
            <p className={styles.finalScore}>Final Score: {totalScore}</p>
            <p className={styles.accuracy}>
              Completed {challenges.length} challenges
            </p>
          </div>
          <button onClick={onBack} className={styles.backButton}>
            Back to Levels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backBtn}>← Back</button>
        <div className={styles.progress}>
          <span>Level {level}</span>
          <span>Challenge {currentIndex + 1} of {challenges.length}</span>
          <span>Score: {totalScore}</span>
        </div>
      </div>

      <div className={styles.challengeCard}>
        <div className={styles.songInfo}>
          <div className={styles.albumArt}>
            <div className={styles.albumPlaceholder}>
              {currentChallenge.song_title.charAt(0)}
            </div>
          </div>
          
          <div className={styles.songDetails}>
            <h2 className={styles.songTitle}>{currentChallenge.song_title}</h2>
            <p className={styles.artist}>{currentChallenge.artist}</p>
            <span className={styles.genre}>{currentChallenge.genre}</span>
          </div>
        </div>

        {currentChallenge.original_lyric && (
          <div className={styles.lyricContext}>
            <p className={styles.contextLabel}>Lyrics:</p>
            <p className={styles.contextLyric}>{currentChallenge.original_lyric}</p>
          </div>
        )}

        <div className={styles.challengeSection}>
          <p className={styles.challengeLabel}>Fill in the blank:</p>
          <p className={styles.challengeLyric}>{currentChallenge.blanked_lyric}</p>
        </div>

        {!feedback && (
          <div className={styles.answerSection}>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userAnswer.trim()) {
                  handleSubmit();
                }
              }}
              placeholder="Type your answer..."
              className={styles.answerInput}
              autoFocus
            />
            
            <div className={styles.buttons}>
              <button 
                onClick={handleSubmit} 
                className={styles.submitBtn}
              >
                Submit
              </button>
              <button onClick={handleSkip} className={styles.skipBtn}>
                Skip
              </button>
            </div>
          </div>
        )}

        {feedback && (
          <div className={`${styles.feedback} ${feedback.isCorrect ? styles.correct : styles.incorrect}`}>
            <p className={styles.feedbackMessage}>{feedback.message}</p>
            {feedback.isCorrect && (
              <p className={styles.scoreEarned}>+{feedback.score} points!</p>
            )}
            {!feedback.isCorrect && feedback.correctAnswer && (
              <p className={styles.correctAnswer}>
                Correct answer: <strong>{feedback.correctAnswer}</strong>
              </p>
            )}
            <p className={styles.nextMessage}>
              {currentIndex < challenges.length - 1 
                ? 'Moving to next challenge...' 
                : 'Finishing up...'}
            </p>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <p>Challenge created by {currentChallenge.creator_name}</p>
      </div>
    </div>
  );
};

export default ChallengeGame;