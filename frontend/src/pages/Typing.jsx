import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLesson, postResult } from "../api.js";

const LESSON_SECONDS = 600; // 10 minutes
const POINTS_PER_WORD = 3;


function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Typing() {
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

  const [result, setResult] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    if (u && u.role === 'user' && !u.profileCompleted) {
      navigate('/profile-setup');
      return;
    }

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
          />
          <div className="stats-row">
            <span className="stat correct">ត្រឹមត្រូវ: {correctCount}</span>
            <span className="stat wrong">ខុស: {wrongCount}</span>
          </div>
        </div>
      )}

      {status === "finished" && result && (
        <div className="result-panel">
          <h2>{result.completedAll ? "ចប់មេរៀន!" : "អស់ពេល!"}</h2>
          <div className="score-total">{result.score} ពិន្ទុ</div>

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

          <div className="result-actions">
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
