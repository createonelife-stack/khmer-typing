import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz } from "../api";
import "./Quiz.css";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function QuizSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes = 1200 seconds
  const timerRef = useRef(null);

  useEffect(() => {
    getQuiz(id)
      .then(data => {
        setLesson(data);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setUserAnswers({});
        setTimeLeft(1200);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, navigate]);

  // countdown timer
  useEffect(() => {
    if (loading || error || showScore) {
      clearInterval(timerRef.current);
      return;
    }
    
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
  }, [loading, error, showScore]);

  // Handle time's up
  useEffect(() => {
    if (timeLeft === 0 && !showScore) {
      calculateAndSetScore();
      setShowScore(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, showScore]);

  const calculateAndSetScore = () => {
    if (!lesson) return;
    let finalScore = 0;
    lesson.questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        finalScore += 4;
      }
    });
    setScore(finalScore);
  };

  const handleAnswerOptionClick = (option) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: option
    }));
  };

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < lesson.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      calculateAndSetScore();
      setShowScore(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setUserAnswers({});
    setTimeLeft(1200);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>កំពុងផ្ទុកសំនួរ...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>មានបញ្ហា៖ {error}</div>;
  if (!lesson) return <div style={{ textAlign: 'center', padding: '40px' }}>រកមិនឃើញកម្រងសំនួរនេះទេ</div>;

  return (
    <div className="quiz-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: 'var(--primary)', textAlign: 'left', margin: 0 }}>{lesson.title}</h1>
          <p className="subtitle" style={{ textAlign: 'left', margin: '4px 0 0 0' }}>{lesson.description}</p>
        </div>
        {!showScore && (
          <div className={`timer ${timeLeft <= 60 ? "time-low" : ""}`} style={{ margin: 0 }}>
            {formatTime(timeLeft)}
          </div>
        )}
      </div>
      
      <div className="quiz-card">
        {showScore ? (
          <div className="score-section">
            <h2>លទ្ធផលរបស់អ្នក</h2>
            <p className="score-text">អ្នកទទួលបានពិន្ទុ {score} / {lesson.questions.length * 4}</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn" onClick={() => navigate("/quiz")}>ត្រលប់ទៅបញ្ជីមេរៀន</button>
              <button className="btn primary" onClick={restartQuiz}>ចាប់ផ្តើមម្តងទៀត</button>
            </div>
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>សំណួរទី {currentQuestion + 1}</span>/{lesson.questions.length}
              </div>
              <div className="question-text">{lesson.questions[currentQuestion].question}</div>
            </div>
            <div className="answer-section">
              {lesson.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option-btn ${userAnswers[currentQuestion] === option ? "selected" : ""}`}
                  onClick={() => handleAnswerOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="quiz-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                className="btn" 
                onClick={handlePrevious} 
                disabled={currentQuestion === 0}
              >
                ថយក្រោយ
              </button>
              <button 
                className="btn primary" 
                onClick={handleNext} 
                disabled={!userAnswers[currentQuestion]}
              >
                {currentQuestion === lesson.questions.length - 1 ? "បញ្ចប់" : "បន្ទាប់"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
