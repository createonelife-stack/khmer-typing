import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLesson, postResult } from "../api.js";

const LESSON_SECONDS = 420; // 7 minutes
const POINTS_PER_WORD = 3;


function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const playSound = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  if (type === 'correct') {
    // Mario Coin Sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1); // E6
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } else if (type === 'wrong') {
    // Mario Bump/Wrong Sound
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }
};

export default function Typing({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | running | finished
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(LESSON_SECONDS);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [typedWords, setTypedWords] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [hitBrick, setHitBrick] = useState(false);
  const [coins, setCoins] = useState([]);

  const [result, setResult] = useState(null);

  useEffect(() => {
    setLesson(null);
    setError("");
    getLesson(id)
      .then((data) => setLesson(data))
      .catch((e) => setError(e.message));
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function resetGame() {
    clearInterval(timerRef.current);
    setStatus("idle");
    setCurrentIndex(0);
    setInput("");
    setTimeLeft(LESSON_SECONDS);
    setCorrectCount(0);
    setWrongCount(0);
    setTypedWords([]);

    setResult(null);
  }

  const finishGame = useCallback(
    (finalCorrect, finalWrong, completedAll, timeUsedOverride) => {
      clearInterval(timerRef.current);
      setStatus("finished");

      const timeUsed =
        timeUsedOverride !== undefined
          ? timeUsedOverride
          : LESSON_SECONDS - timeLeft;

      const baseScore = finalCorrect * POINTS_PER_WORD;
      const bonus = 0;
      const totalScore = baseScore;
      const totalWords = lesson ? lesson.words.length : 0;
      const attempted = finalCorrect + finalWrong;
      const accuracy = attempted > 0 ? Math.round((finalCorrect / attempted) * 100) : 0;
      const minutesUsed = timeUsed / 60;
      const wpm = minutesUsed > 0 ? Math.round(finalCorrect / minutesUsed) : 0;

      const payload = {
        lessonId: Number(id),
        score: totalScore,
        wpm,
        accuracy,
        correctWords: finalCorrect,
        totalWords,
        timeUsed,
        bonus,
      };

      setResult({ ...payload, completedAll, baseScore });
      postResult(payload).catch(() => {});
    },
    [id, lesson, timeLeft]
  );

  // countdown timer
  useEffect(() => {
    if (status !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status]);

  // watch timeLeft hitting 0 while running -> time's up
  useEffect(() => {
    if (status === "running" && timeLeft === 0) {
      finishGame(correctCount, wrongCount, false, LESSON_SECONDS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function startGame() {
    setStatus("running");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleChange(e) {
    if (status !== "running") return;
    setInput(e.target.value);
  }

  function handleKeyDown(e) {
    if (status !== "running") return;
    if (e.key === "Enter") {
      e.preventDefault();
      
      // Trigger Mario Jump
      setIsJumping(true);
      setTimeout(() => {
        setHitBrick(true);
        setTimeout(() => setHitBrick(false), 150);
        setTimeout(() => setIsJumping(false), 150);
      }, 150);

      submitWord();
    }
  }

  function submitWord() {
    if (!lesson) return;
    const target = lesson.words[currentIndex];
    const typed = input.trim();

    const isCorrect = typed === target;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextWrong = wrongCount + (isCorrect ? 0 : 1);

    if (isCorrect) {
      playSound('correct');
      // Spawn 5 coins
      const newCoinGroup = { id: Date.now() };
      setCoins(prev => [...prev, newCoinGroup]);
      setTimeout(() => {
        setCoins(prev => prev.filter(c => c.id !== newCoinGroup.id));
      }, 600);
    } else {
      playSound('wrong');
    }

    setCorrectCount(nextCorrect);
    setWrongCount(nextWrong);
    setTypedWords(prev => [...prev, { original: target, typed, isCorrect }]);
    setInput("");

    const nextIndex = currentIndex + 1;
    if (nextIndex >= lesson.words.length) {
      const timeUsed = LESSON_SECONDS - timeLeft;
      finishGame(nextCorrect, nextWrong, true, timeUsed);
      return;
    }
    setCurrentIndex(nextIndex);

  }

  if (error) {
    return (
      <div className="typing-page">
        <p className="error">មានបញ្ហា៖ {error}</p>
        <Link to="/">ត្រឡប់ក្រោយ</Link>
      </div>
    );
  }

  if (!lesson) {
    return <div className="typing-page">កំពុងផ្ទុកមេរៀន...</div>;
  }

  const total = lesson.words.length;
  const timeLowClass = timeLeft <= 30 ? "time-low" : "";

  // Progress and animation calculations
  const timeUsedSoFar = LESSON_SECONDS - timeLeft;
  const currentWpm = timeUsedSoFar > 0 ? Math.round((correctCount / timeUsedSoFar) * 60) : 0;
  const timeProgress = (timeUsedSoFar / LESSON_SECONDS) * 100;
  const wordProgress = total > 0 ? (currentIndex / total) * 100 : 0;
  
  // Cap progress at 95% so the emoji doesn't completely overflow the right edge
  const progressPercent = Math.min(95, Math.max(timeProgress, wordProgress));
  const isFast = currentWpm >= 15;
  const runnerEmoji = isFast ? "🐇" : "🐢";

  return (
    <div className="typing-page">
      <div className="typing-header">
        <h1>{lesson.title}</h1>
        <div className={`timer ${timeLowClass}`}>{formatTime(timeLeft)}</div>
      </div>


      {status === "idle" && (
        <div className="start-panel">
          <p>ចុចប៊ូតុងខាងក្រោមដើម្បីចាប់ផ្តើម។ ម៉ោងចាប់ផ្តើមរាប់ពេលអ្នកចុចចាប់ផ្តើម។</p>
          <button className="btn primary" onClick={startGame}>
            ចាប់ផ្តើមវាយ
          </button>
        </div>
      )}

      {status === "running" && (
        <div className="game-panel">
          <div className="target-word">
            {lesson.words[currentIndex]}
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <style>
              {`
              .mario-coin {
                position: absolute;
                top: 0;
                left: -5px; /* center horizontally relative to parent */
                width: 10px;
                height: 14px;
                background-color: #f8d020;
                border: 2px solid #e08800;
                border-radius: 50%;
                opacity: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                z-index: 5;
              }
              .mario-coin::after {
                content: "";
                width: 2px;
                height: 6px;
                background-color: #e08800;
              }
              @keyframes coinPop1 {
                0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
                50% { transform: translate(-25px, -45px) scale(1); opacity: 1; }
                100% { transform: translate(-30px, -15px) scale(1); opacity: 0; }
              }
              @keyframes coinPop2 {
                0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
                50% { transform: translate(-10px, -55px) scale(1); opacity: 1; }
                100% { transform: translate(-15px, -25px) scale(1); opacity: 0; }
              }
              @keyframes coinPop3 {
                0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
                50% { transform: translate(10px, -55px) scale(1); opacity: 1; }
                100% { transform: translate(15px, -25px) scale(1); opacity: 0; }
              }
              @keyframes coinPop4 {
                0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
                50% { transform: translate(25px, -45px) scale(1); opacity: 1; }
                100% { transform: translate(30px, -15px) scale(1); opacity: 0; }
              }
              `}
            </style>
            <div style={{
              position: 'absolute',
              top: '-80px',
              left: `${progressPercent}%`,
              transform: 'translateX(-50%)',
              transition: 'left 1s linear',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '80px',
              width: '40px'
            }}>
              {/* Mario Coins Animation */}
              {coins.map(coinGroup => (
                <div key={coinGroup.id} style={{ position: 'absolute', top: '0', left: '50%' }}>
                  <div className="mario-coin" style={{ animation: 'coinPop1 0.5s ease-out forwards' }}></div>
                  <div className="mario-coin" style={{ animation: 'coinPop2 0.5s ease-out forwards', animationDelay: '0.05s' }}></div>
                  <div className="mario-coin" style={{ animation: 'coinPop3 0.5s ease-out forwards', animationDelay: '0.1s' }}></div>
                  <div className="mario-coin" style={{ animation: 'coinPop4 0.5s ease-out forwards', animationDelay: '0.15s' }}></div>
                  <div className="mario-coin" style={{ animation: 'coinPop2 0.5s ease-out forwards', animationDelay: '0.2s' }}></div>
                </div>
              ))}

              {/* Mario Brick */}
              <div style={{
                width: '24px', height: '24px',
                backgroundColor: '#d66427',
                border: '2px solid #5a2c11',
                borderRadius: '2px',
                marginBottom: 'auto',
                boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.3), inset 2px 2px 0px rgba(255,255,255,0.4)',
                transform: hitBrick ? 'translateY(-6px)' : 'none',
                transition: 'transform 0.1s ease',
                backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }}></div>
              
              {/* Mario SVG */}
              <div style={{
                  width: '32px',
                  height: '32px',
                  transform: isJumping ? 'translateY(-24px)' : 'none',
                  transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.4, 1)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}>
                <svg viewBox="0 0 16 16" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="1" width="5" height="1" fill="#FF0000"/>
                  <rect x="3" y="2" width="9" height="1" fill="#FF0000"/>
                  <rect x="3" y="3" width="3" height="1" fill="#653200"/>
                  <rect x="6" y="3" width="2" height="1" fill="#FFCC99"/>
                  <rect x="8" y="3" width="1" height="1" fill="#000000"/>
                  <rect x="9" y="3" width="1" height="1" fill="#FFCC99"/>
                  <rect x="2" y="4" width="1" height="1" fill="#653200"/>
                  <rect x="3" y="4" width="1" height="1" fill="#FFCC99"/>
                  <rect x="4" y="4" width="1" height="1" fill="#653200"/>
                  <rect x="5" y="4" width="3" height="1" fill="#FFCC99"/>
                  <rect x="8" y="4" width="1" height="1" fill="#000000"/>
                  <rect x="9" y="4" width="3" height="1" fill="#FFCC99"/>
                  <rect x="2" y="5" width="1" height="1" fill="#653200"/>
                  <rect x="3" y="5" width="1" height="1" fill="#FFCC99"/>
                  <rect x="4" y="5" width="2" height="1" fill="#653200"/>
                  <rect x="6" y="5" width="3" height="1" fill="#FFCC99"/>
                  <rect x="9" y="5" width="1" height="1" fill="#000000"/>
                  <rect x="10" y="5" width="3" height="1" fill="#FFCC99"/>
                  <rect x="2" y="6" width="2" height="1" fill="#653200"/>
                  <rect x="4" y="6" width="4" height="1" fill="#FFCC99"/>
                  <rect x="8" y="6" width="4" height="1" fill="#000000"/>
                  <rect x="4" y="7" width="7" height="1" fill="#FFCC99"/>
                  <rect x="3" y="8" width="2" height="1" fill="#FF0000"/>
                  <rect x="5" y="8" width="1" height="1" fill="#0000FF"/>
                  <rect x="6" y="8" width="2" height="1" fill="#FF0000"/>
                  <rect x="8" y="8" width="2" height="1" fill="#0000FF"/>
                  <rect x="10" y="8" width="1" height="1" fill="#FF0000"/>
                  <rect x="2" y="9" width="3" height="1" fill="#FF0000"/>
                  <rect x="5" y="9" width="1" height="1" fill="#0000FF"/>
                  <rect x="6" y="9" width="2" height="1" fill="#FF0000"/>
                  <rect x="8" y="9" width="1" height="1" fill="#0000FF"/>
                  <rect x="9" y="9" width="3" height="1" fill="#FF0000"/>
                  <rect x="1" y="10" width="4" height="1" fill="#FF0000"/>
                  <rect x="5" y="10" width="4" height="1" fill="#0000FF"/>
                  <rect x="9" y="10" width="4" height="1" fill="#FF0000"/>
                  <rect x="3" y="11" width="1" height="1" fill="#FFCC99"/>
                  <rect x="4" y="11" width="1" height="1" fill="#0000FF"/>
                  <rect x="5" y="11" width="1" height="1" fill="#FFFF00"/>
                  <rect x="6" y="11" width="2" height="1" fill="#0000FF"/>
                  <rect x="8" y="11" width="1" height="1" fill="#FFFF00"/>
                  <rect x="9" y="11" width="1" height="1" fill="#0000FF"/>
                  <rect x="10" y="11" width="1" height="1" fill="#FFCC99"/>
                  <rect x="3" y="12" width="8" height="1" fill="#0000FF"/>
                  <rect x="2" y="13" width="10" height="1" fill="#0000FF"/>
                  <rect x="2" y="14" width="3" height="1" fill="#653200"/>
                  <rect x="9" y="14" width="3" height="1" fill="#653200"/>
                  <rect x="1" y="15" width="4" height="1" fill="#653200"/>
                  <rect x="9" y="15" width="4" height="1" fill="#653200"/>
                </svg>
              </div>
            </div>
            <input
              ref={inputRef}
              className="type-input"
              type="text"
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="វាយពាក្យខាងលើរួចចុច Enter"
              lang="km"
              style={{ width: '100%' }}
            />
          </div>
          <div className="stats-row">
            <span className="stat correct">ត្រឹមត្រូវ: {correctCount}</span>
            <span className="stat wrong">ខុស: {wrongCount}</span>
          </div>
        </div>
      )}

      {status === "finished" && result && (
        <div className="result-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px' }}>
            <div style={{ textAlign: 'left', flex: 1 }}>
              {user && (
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>{user.fullName || user.username}</div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>ភេទ៖ {user.gender || '-'}</div>
                  <div style={{ color: 'var(--text-muted)' }}>តួនាទី៖ {user.jobRole || '-'}</div>
                </>
              )}
            </div>
            
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2 style={{ marginBottom: '16px' }}>{result.completedAll ? "ចប់មេរៀន!" : "អស់ពេល!"}</h2>
              <div className="score-total" style={{ margin: 0, fontSize: '48px' }}>{result.score} ពិន្ទុ</div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '120px', height: '160px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>
          </div>

          <div className="result-grid">
            <div className="result-item">
              <span className="label">ពាក្យត្រឹមត្រូវ</span>
              <span className="value">{result.correctWords} / {result.totalWords}</span>
            </div>
            <div className="result-item">
              <span className="label">ពាក្យខុស</span>
              <span className="value">{wrongCount}</span>
            </div>

            <div className="result-item">
              <span className="label">ពេលវេលាប្រើ</span>
              <span className="value">{formatTime(result.timeUsed)}</span>
            </div>
            <div className="result-item">
              <span className="label">ល្បឿន (ពាក្យ/នាទី)</span>
              <span className="value">{result.wpm}</span>
            </div>
            <div className="result-item">
              <span className="label">ភាពត្រឹមត្រូវ</span>
              <span className="value">{result.accuracy}%</span>
            </div>
          </div>

          <div className="result-words-container" style={{ display: 'flex', gap: '20px', marginTop: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <table className="results-table" style={{ flex: '1 1 300px' }}>
              <thead>
                <tr>
                  <th>ល.រ</th>
                  <th>ពាក្យដើម</th>
                  <th>ពាក្យវាយ</th>
                  <th>✔/✖</th>
                </tr>
              </thead>
              <tbody>
                {typedWords.slice(0, Math.ceil(typedWords.length / 2)).map((w, i) => (
                  <tr key={i} className={!w.isCorrect ? "wrong-row" : ""}>
                    <td style={{textAlign: 'center'}}>{i + 1}</td>
                    <td>{w.original}</td>
                    <td className={!w.isCorrect ? "wrong-cell" : ""}>{w.typed || "-"}</td>
                    <td style={{textAlign: 'center'}}>{w.isCorrect ? "✔" : "✖"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {typedWords.length > 1 && (
              <table className="results-table" style={{ flex: '1 1 300px' }}>
                <thead>
                  <tr>
                    <th>ល.រ</th>
                    <th>ពាក្យដើម</th>
                    <th>ពាក្យវាយ</th>
                    <th>✔/✖</th>
                  </tr>
                </thead>
                <tbody>
                  {typedWords.slice(Math.ceil(typedWords.length / 2)).map((w, i) => {
                    const actualIndex = i + Math.ceil(typedWords.length / 2);
                    return (
                      <tr key={actualIndex} className={!w.isCorrect ? "wrong-row" : ""}>
                        <td style={{textAlign: 'center'}}>{actualIndex + 1}</td>
                        <td>{w.original}</td>
                        <td className={!w.isCorrect ? "wrong-cell" : ""}>{w.typed || "-"}</td>
                        <td style={{textAlign: 'center'}}>{w.isCorrect ? "✔" : "✖"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="result-actions" style={{ marginTop: '30px' }}>
            <button className="btn primary" onClick={resetGame}>
              ព្យាយាមម្តងទៀត
            </button>
            <button className="btn" onClick={() => navigate("/")}>
              ត្រឡប់ទៅមេរៀន
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
