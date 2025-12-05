import React, { FunctionComponent, useState } from "react";
import styles from "./LandingPageLyrIQ.module.css";

// ========== ICONS ==========
import CalendarBlank from "./assets/UX_DESIGN_icon/CalendarBlank.svg";
import Ellipse1 from "./assets/UX_DESIGN_icon/Ellipse_1.svg";
// (add other icons if you need them later, e.g. Group, Play, etc.)

// ========== IMAGES (NO /source IN PATH) ==========
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



const LandingPageLyrIQ: FunctionComponent = () => {
  const [challenge, setChallenge] = useState<LyricChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // Later you can replace this with a real signup flow or API call
  };

  return (
    <div className={styles.landingPageLyriq}>
      {/* ------------------------------------------------ */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------ */}
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
              <b className={styles.remastered}>LOGIN</b>
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

          <div className={styles.container4}>
            <div className={styles.input}>
              <div className={styles.divplaceholder}>
                <div className={styles.remastered}>WHAT’S YOUR EMAIL?</div>
              </div>
            </div>

            <div className={styles.container5}>
              <button className={styles.signUp} onClick={handleSignupClick}>
                SIGN UP
              </button>
            </div>
          </div>

          <div className={styles.container6}>
            <img
              className={styles.calendarblankIcon}
              alt=""
              src={CalendarBlank}
            />
            <div className={styles.container7}>
              <div className={styles.earlyAccessInfo}>
                Early Access Launch: 12/23
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* FEATURES + LEVELS SECTION */}
      {/* ------------------------------------------------ */}
      <div className={styles.sectionNews}>
        <div className={styles.container8}>
          <div className={styles.container9}>
            <div className={styles.remastered}>Games &amp; More</div>

            <div className={styles.features}>
              {/* Column 1 */}
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

              {/* Column 2 */}
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

          {/* LEVELS SECTION */}
          <div className={styles.container16}>
            {/* LEVEL 1 */}
            <div className={styles.container17}>
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

            {/* LEVEL 2 */}
            <div className={styles.container17}>
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

            {/* LEVEL 3 */}
            <div className={styles.container17}>
              <img className={styles.img63311Icon} alt="" src={Img6331} />
              <b className={styles.levelTitle}>LEVEL 3 – Expert Mode</b>
              <div className={styles.levelDescription3}>
                Minimal hints. Deeper cuts. No obvious hooks. You’ll need memory,
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

      {/* ------------------------------------------------ */}
      {/* TOP PLAYERS / LEADERBOARD SECTION */}
      {/* ------------------------------------------------ */}
      <div className={styles.gameplaysSection}>
        <img className={styles.backgroundImageIcon} alt="" src={BackgroundImage} />
        <div className={styles.background3} />

        <div className={styles.container20}>
          <div className={styles.container21}>
            <div className={styles.modoZumbiAgora}>TOP PLAYERS</div>

            <div className={styles.sectionDescription}>
              Meet the current leaders dominating LyrIQ’s global scoreboard.
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

        {/* PLAYER STATS ROWS */}
        <div className={styles.container23}>
          <div className={styles.container7}>
            <div className={styles.playerStats}>
              <b>Rank:</b> #1 &nbsp;
              <b>Longest Streak:</b> 143 correct guesses &nbsp;
              <b>Fastest Guess:</b> 0.92s &nbsp;
              <b>Accuracy:</b> 97% &nbsp;
              <b>Most Played Genre:</b> Hip-Hop &nbsp;
              <b>Signature Mode:</b> Expert Mode
            </div>
          </div>
        </div>

        <div className={styles.container25}>
          <div className={styles.container7}>
            <div className={styles.playerHandle}>@NTMONSUMI</div>
          </div>
        </div>

        <div className={styles.container27}>
          <div className={styles.container7}>
            <div className={styles.playerStats}>
              <b>Rank:</b> #4 &nbsp;
              <b>Longest Streak:</b> 96 correct guesses &nbsp;
              <b>Fastest Guess:</b> 1.08s &nbsp;
              <b>Accuracy:</b> 95% &nbsp;
              <b>Most Played Genre:</b> Hip-Hop &nbsp;
              <b>Signature Mode:</b> Expert Mode
            </div>
          </div>
        </div>

        <div className={styles.container29}>
          <div className={styles.container7}>
            <div className={styles.playerHandle}>@3arth2u_</div>
          </div>
        </div>

        <div className={styles.container31}>
          <div className={styles.container7}>
            <div className={styles.playerHandle}>@WHOMPWHO</div>
          </div>
        </div>

        <div className={styles.playerHandleWrapper}>
          <div className={styles.container7}>
            <div className={styles.playerHandle}>@LyricLegend</div>
          </div>
        </div>

        <div className={styles.container33}>
          <div className={styles.container7}>
            <div className={styles.playerStats}>
              <b>Rank:</b> #2 &nbsp;
              <b>Longest Streak:</b> 118 correct guesses
              <br />
              <b>Fastest Guess:</b> 1.10s
              <br />
              <b>Accuracy:</b> 94%
              <br />
              <b>Most Played Genre:</b> R&amp;B &nbsp;
              <b>Signature Mode:</b> Remix Mode
            </div>
          </div>
        </div>

        <div className={styles.container35}>
          <div className={styles.container7}>
            <div className={styles.playerStats}>
              <b>Rank:</b> #3 &nbsp;
              <b>Longest Streak:</b> 102 correct guesses &nbsp;
              <b>Fastest Guess:</b> 1.34s
              <br />
              <b>Accuracy:</b> 92%
              <br />
              <b>Most Played Genre:</b> Pop &nbsp;
              <b>Signature Mode:</b> Warm-Up Mode
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* LIVE GAME SECTION – BACKEND CONNECTED */}
      {/* ------------------------------------------------ */}
      <section className={styles.liveGameSection}>
        <div className={styles.liveGameHeader}>
          <h2>TRY THE GAME LIVE</h2>
          <p>
            Generate a real lyric challenge powered by your backend and see
            how fast you can fill in the missing words.
          </p>
        </div>

        <button
          className={styles.liveGameButton}
          onClick={handleGenerateChallenge}
          disabled={loading}
        >
          {loading ? "Loading challenge..." : "Generate Lyric Challenge"}
        </button>

        {error && <p className={styles.errorText}>{error}</p>}

        {challenge && (
          <div className={styles.challengeCard}>
            <h3>
              {challenge.title} — {challenge.artist}
            </h3>

            <div className={styles.challengeSection}>
              <h4>Preview</h4>
              <p>{challenge.preview}</p>
            </div>

            <div className={styles.challengeSection}>
              <h4>Challenge Line</h4>
              <p>{challenge.challengeLine}</p>
            </div>

            <div className={styles.challengeSection}>
              <h4>Missing Words Version</h4>
              <p>{challenge.maskedLine}</p>
            </div>

            <div className={styles.challengeAnswer}>
              <span className={styles.answerLabel}>Answer:</span>{" "}
              <span className={styles.answerText}>{challenge.answer}</span>
            </div>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ */}
      {/* CTA SECTION */}
      {/* ------------------------------------------------ */}
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

      {/* ------------------------------------------------ */}
      {/* FOOTER */}
      {/* ------------------------------------------------ */}
      <div className={styles.footer}>
        <div className={styles.footerText}>
          LyrIQ uses the Genius API to access publicly available lyrics.
          All song lyrics, album art, and artist names belong to their
          respective copyright owners.
          <br />
          This project is for entertainment and educational purposes only.
        </div>
      </div>
    </div>
  );
};

export default LandingPageLyrIQ;
