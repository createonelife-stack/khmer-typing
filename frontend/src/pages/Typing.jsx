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
            <div style={{
              position: 'absolute',
              top: '-32px',
              left: `${progressPercent}%`,
              transform: 'translateX(-50%)',
              fontSize: '28px',
              transition: 'left 1s linear',
              zIndex: 10,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              {runnerEmoji}
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
