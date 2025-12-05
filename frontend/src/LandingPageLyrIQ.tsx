import React, { FunctionComponent, useState, useEffect } from "react";
import styles from "./LandingPageLyrIQ.module.css";

// ========== COMPONENTS ==========
import ChallengeGame from "./components/ChallengeGame";

// ========== ICONS ==========
import CalendarBlank from "./assets/UX_DESIGN_icon/CalendarBlank.svg";
import Ellipse1 from "./assets/UX_DESIGN_icon/Ellipse_1.svg";

// ========== IMAGES ==========
import BackgroundImage from "./assets/UX_DESIGN_img/Background_Image.png";
import Music from "./assets/UX_DESIGN_img/MUSIC.png";
import Music1 from "./assets/UX_DESIGN_img/MUSIC-1.png";

import Img5994 from "./assets/UX_DESIGN_img/IMG_5994.png";
import Img5995 from "./assets/UX_DESIGN_img/IMG_5995.png";
import Img6323 from "./assets/UX_DESIGN_img/IMG_6323.png";
import Img6328 from "./assets/UX_DESIGN_img/IMG_6328.png";
import Img6330 from "./assets/UX_DESIGN_img/IMG_6330.png";
import Img6331 from "./assets/UX_DESIGN_img/IMG_6331.png";
import Img6333 from "./assets/UX_DESIGN_img/IMG_6333.png";
import Logo1 from "./assets/UX_DESIGN_img/logo_a.png";

import { fetchLyricChallenge, type LyricChallenge } from "./api/lyrics";

// ========= FIREBASE AUTH =========
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
} from "./firebase";
import type { User } from "firebase/auth";

// ========= BACKEND API =========
import { 
  getLeaderboard, 
  getAllChallenges,
  type LeaderboardPlayer,
  type Challenge 
} from "./api/backend";

const LandingPageLyrIQ: FunctionComponent = () => {
  const [challenge, setChallenge] = useState<LyricChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Backend data state
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Level selection state - THIS IS KEY!
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
    loadChallenges();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboardData(data);
      console.log('Loaded leaderboard:', data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadChallenges = async () => {
    try {
      const data = await getAllChallenges();
      setChallenges(data);
      console.log('Loaded challenges:', data);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  // Level click handler - sets selected level
  const handleLevelClick = (level: number) => {
    setSelectedLevel(level);
  };

  const handleLoginClick = async () => {
    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;
      setUser(loggedInUser);
      console.log("Logged in as:", loggedInUser.email);
    } catch (err: any) {
      console.error("Google login error:", err);
      setAuthError("Google login failed. Please try again.");
    }
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAuthError(null);
    } catch (err: any) {
      console.error("Logout error:", err);
      setAuthError("Could not log out. Please try again.");
    }
  };

  const handleGenerateChallenge = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLyricChallenge();
      setChallenge(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Something went wrong fetching a challenge.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    console.log("Signup clicked!");
  };

  // IF LEVEL SELECTED, SHOW GAME
  if (selectedLevel) {
    return (
      <ChallengeGame 
        level={selectedLevel} 
        onBack={() => setSelectedLevel(null)} 
      />
    );
  }

  // OTHERWISE SHOW LANDING PAGE
  return (
    <div className={styles.landingPageLyriq}>
      <div className={styles.heroSection}>
        <img className={styles.musicIcon} alt="" src={Music} />
        <div className={styles.background} />
        <div className={styles.background2} />

        <div className={styles.lines}>
          <img className={styles.linesChild} alt="" src={Ellipse1} />
          <div className={styles.divider} />
        </div>

        <div className={styles.container}>
          <div className={styles.container2}>
            <div className={styles.remasteredWrapper}>
              <div className={styles.remastered}>Remastered</div>
            </div>

            <div className={styles.container3}>
              <button
                type="button"
                className={styles.remastered}
                onClick={user ? handleLogoutClick : handleLoginClick}
                style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
              >
                {user ? "LOGOUT" : "LOGIN"}
              </button>
            </div>
          </div>

          <div className={styles.title}>LyrIQ</div>

          <div className={styles.description}>
            Welcome to LyrIQ, the lyric-guessing challenge.
            <br />
            Choose a song, let the Genius-powered engine pull the lyrics,
            and test how well you really know your music.
            <br />
            <br />
            Enter your email to get early access, new features,
            and exclusive game modes.
          </div>

          {user && (
            <div className={styles.container6} style={{ marginBottom: "0.75rem" }}>
              <div className={styles.earlyAccessInfo}>
                Signed in as {user.displayName || user.email}
              </div>
            </div>
          )}

          <div className={styles.container4}>
            <div className={styles.input}>
              <div className={styles.divplaceholder}>
                <div className={styles.remastered}>WHAT'S YOUR EMAIL?</div>
              </div>
            </div>

            <div className={styles.container5}>
              <button className={styles.signUp} onClick={handleSignupClick}>
                SIGN UP
              </button>
            </div>
          </div>

          <div className={styles.container6}>
            <img className={styles.calendarblankIcon} alt="" src={CalendarBlank} />
            <div className={styles.container7}>
              <div className={styles.earlyAccessInfo}>
                Early Access Launch: 12/23
              </div>
            </div>
          </div>

          {authError && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#ff6b6b" }}>
              {authError}
            </div>
          )}
        </div>
      </div>

      <div className={styles.sectionNews}>
        <div className={styles.container8}>
          <div className={styles.container9}>
            <div className={styles.remastered}>Games &amp; More</div>

            <div className={styles.features}>
              <div className={styles.container10}>
                <div className={styles.container11}>
                  <b className={styles.featureTitle}>Real Lyrics, Real Challenge</b>
                  <div className={styles.featureDescription}>
                    LyrIQ pulls authentic song lyrics using the Genius API.
                    Every round is built from the real verses you know —
                    or think you know.
                  </div>
                </div>

                <div className={styles.container12}>
                  <b className={styles.featureTitle}>Smart Missing-Word Generator</b>
                  <div className={styles.featureDescription2}>
                    Our system automatically selects 2–3 key words to remove
                    from each lyric. The difficulty adapts based on the
                    section of the song you choose.
                  </div>
                </div>
              </div>

              <div className={styles.container10}>
                <div className={styles.container12}>
                  <b className={styles.featureTitle3}>Exclusive Game Modes</b>
                  <div className={styles.featureDescription3}>
                    Unlock new ways to play, including Daily Challenges,
                    Artist Packs, Genre Battles, and Hard Mode for true music fans.
                  </div>
                </div>

                <div className={styles.container12}>
                  <b className={styles.featureTitle}>Personalized Music Experience</b>
                  <div className={styles.featureDescription4}>
                    Track your best genres, favorite artists, accuracy rate,
                    streaks, and top guesses. Your profile evolves with
                    your music taste.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.container16}>
            <div 
              className={styles.container17}
              onClick={() => handleLevelClick(1)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img className={styles.img63281Icon} alt="" src={Img6328} />
              <b className={styles.levelTitle}>LEVEL 1 – Warm Up Mode</b>
              <div className={styles.levelDescription}>
                We give you the most recognizable part of the lyric — your job is
                to finish it. This is your warm-up round: simple clues, popular
                tracks, and a chance to build confidence before things get real.
              </div>
              <div className={styles.viewDetails}>
                VIEW DETAILS //////////////////////////////////////
              </div>
            </div>

            <div 
              className={styles.container17}
              onClick={() => handleLevelClick(2)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img className={styles.img63281Icon} alt="" src={Img6330} />
              <b className={styles.levelTitle}>LEVEL 2 – Remix Mode</b>
              <div className={styles.levelDescription2}>
                The clues get shorter and the songs get trickier. You may know
                the artist, but can you finish the lyric with only a few hints?
                This level tests your recall and rhythm.
              </div>
              <div className={styles.viewDetails}>
                VIEW DETAILS //////////////////////////////////////
              </div>
            </div>

            <div 
              className={styles.container17}
              onClick={() => handleLevelClick(3)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img className={styles.img63311Icon} alt="" src={Img6331} />
              <b className={styles.levelTitle}>LEVEL 3 – Expert Mode</b>
              <div className={styles.levelDescription3}>
                Minimal hints. Deeper cuts. No obvious hooks. You'll need memory,
                instinct, and flow to guess the lyric correctly. This mode
                separates casual listeners from true lyric lovers.
              </div>
              <div className={styles.viewDetails}>
                VIEW DETAILS //////////////////////////////////////
              </div>
            </div>
          </div>

          <div className={styles.button}>
            <div className={styles.viewAllUpdates}>VIEW ALL UPDATES</div>
          </div>
        </div>
      </div>

      <div className={styles.gameplaysSection}>
        <img className={styles.backgroundImageIcon} alt="" src={BackgroundImage} />
        <div className={styles.background3} />

        <div className={styles.container20}>
          <div className={styles.container21}>
            <div className={styles.modoZumbiAgora}>TOP PLAYERS</div>
            <div className={styles.sectionDescription}>
              Meet the current leaders dominating LyrIQ's global scoreboard.
              <br />
              These players hold the longest streaks, fastest correct guesses,
              and highest overall accuracy across every genre.
            </div>
          </div>

          <div className={styles.container22}>
            <img className={styles.img63331Icon} alt="" src={Img6331} />
            <img className={styles.img59951Icon} alt="" src={Img5995} />
            <img className={styles.img59942Icon} alt="" src={Img5994} />
            <img className={styles.img63232Icon} alt="" src={Img6323} />
          </div>
        </div>

        {leaderboardData.length > 0 ? (
          <>
            {leaderboardData.slice(0, 4).map((player) => (
              <React.Fragment key={player.rank}>
                <div className={styles.container25}>
                  <div className={styles.container7}>
                    <div className={styles.playerHandle}>@{player.username}</div>
                  </div>
                </div>
                <div className={styles.container23}>
                  <div className={styles.container7}>
                    <div className={styles.playerStats}>
                      <b>Rank:</b> #{player.rank} &nbsp;
                      <b>Score:</b> {player.score} &nbsp;
                      <b>Completed:</b> {player.challenges_completed} &nbsp;
                      <b>Created:</b> {player.challenges_created}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </>
        ) : (
          <>
            <div className={styles.container23}>
              <div className={styles.container7}>
                <div className={styles.playerStats}>
                  <b>Rank:</b> #1 &nbsp; <b>Longest Streak:</b> 143 correct guesses
                </div>
              </div>
            </div>
            <div className={styles.container25}>
              <div className={styles.container7}>
                <div className={styles.playerHandle}>@NTMONSUMI</div>
              </div>
            </div>
          </>
        )}
      </div>

      <section className={styles.liveGameSection}>
        <div className={styles.liveGameHeader}>
          <h2>TRY THE GAME LIVE</h2>
          <p>Generate a real lyric challenge powered by your backend.</p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>
            Available challenges: {challenges.length}
          </p>
        </div>

        <button className={styles.liveGameButton} onClick={handleGenerateChallenge} disabled={loading}>
          {loading ? "Loading challenge..." : "Generate Lyric Challenge"}
        </button>

        {error && <p className={styles.errorText}>{error}</p>}

        {challenge && (
          <div className={styles.challengeCard}>
            <h3>{challenge.title} — {challenge.artist}</h3>
            <div className={styles.challengeSection}>
              <h4>Challenge Line</h4>
              <p>{challenge.challengeLine}</p>
            </div>
            <div className={styles.challengeAnswer}>
              <span className={styles.answerLabel}>Answer:</span>{" "}
              <span className={styles.answerText}>{challenge.answer}</span>
            </div>
          </div>
        )}
      </section>

      <div className={styles.ctaSection}>
        <img className={styles.musicIcon2} alt="" src={Music1} />
        <div className={styles.background6} />
        <div className={styles.container43}>
          <div className={styles.image10Traced2} />
          <div className={styles.container44}>
            <div className={styles.sectionTitle4}>
              JOIN THE LyrIQ EARLY ACCESS LIST
            </div>
            <div className={styles.description}>
              Be one of the first to try new modes, track your stats,
              and compete on the global leaderboard.
            </div>
            <div className={styles.container45}>
              <div className={styles.input}>
                <div className={styles.divplaceholder}>
                  <div className={styles.remastered}>ENTER YOUR EMAIL</div>
                </div>
              </div>
              <div className={styles.container46}>
                <button className={styles.signUp} onClick={handleSignupClick}>
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        </div>
        <img className={styles.logo1Icon2} alt="" src={Logo1} />
      </div>

      <div className={styles.footer}>
        <div className={styles.footerText}>
          LyrIQ uses the Genius API to access publicly available lyrics.
          <br />
          This project is for entertainment and educational purposes only.
        </div>
      </div>
    </div>
  );
};

export default LandingPageLyrIQ;