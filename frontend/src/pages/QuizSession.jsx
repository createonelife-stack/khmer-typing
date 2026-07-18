import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz } from "../api";
import "./Quiz.css";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function QuizSession({ user }) {
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

  const allAnswered = lesson && Object.keys(userAnswers).length === lesson.questions.length;

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
                <h2 style={{ marginBottom: '16px' }}>{timeLeft === 0 ? "អស់ពេល!" : "ចប់ការប្រឡង!"}</h2>
                <div className="score-total" style={{ margin: 0, fontSize: '48px', color: 'var(--primary)', fontWeight: 'bold' }}>{score} ពិន្ទុ</div>
                <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>ពិន្ទុពេញ៖ {lesson.questions.length * 4}</p>
              </div>

              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                {user && user.photo ? (
                  <img src={user.photo} alt="Profile" style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                ) : (
                  <div style={{ width: '120px', height: '160px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>គ្មានរូបថត</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
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
            <div className="quiz-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: allAnswered ? '24px' : '0' }}>
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
                disabled={currentQuestion === lesson.questions.length - 1 || !userAnswers[currentQuestion]}
              >
                បន្ទាប់
              </button>
            </div>
            
            {allAnswered && (
              <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <p style={{ color: 'var(--success)', marginBottom: '16px', fontWeight: 'bold' }}>អ្នកបានឆ្លើយគ្រប់សំណួរអស់ហើយ!</p>
                <button 
                  className="btn primary" 
                  onClick={() => {
                    calculateAndSetScore();
                    setShowScore(true);
                  }}
                  style={{ width: '100%', background: '#22c55e', borderColor: '#22c55e', padding: '14px', fontSize: '18px' }}
                >
                  បញ្ចប់ការប្រឡង
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
