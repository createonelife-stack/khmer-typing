import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz } from "../api";
import "./Quiz.css";

export default function QuizSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    if (u && u.role === 'user' && !u.profileCompleted) {
      navigate('/profile-setup');
      return;
    }

    getQuiz(id)
      .then(data => {
        setLesson(data);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer("");
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleAnswerOptionClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer === lesson.questions[currentQuestion].answer) {
      setScore(score + 4); // 4 points per correct answer
    }
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < lesson.questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer("");
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer("");
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>កំពុងផ្ទុកសំនួរ...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>មានបញ្ហា៖ {error}</div>;
  if (!lesson) return <div style={{ textAlign: 'center', padding: '40px' }}>រកមិនឃើញកម្រងសំនួរនេះទេ</div>;

  return (
    <div className="quiz-container">
      <div style={{ textAlign: 'center', marginBottom: '24px', width: '100%' }}>
        <h1 style={{ color: 'var(--primary)' }}>{lesson.title}</h1>
        <p className="subtitle">{lesson.description}</p>
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
                  className={`quiz-option-btn ${selectedAnswer === option ? "selected" : ""}`}
                  onClick={() => handleAnswerOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="quiz-actions">
              <button 
                className="btn primary" 
                onClick={handleNext} 
                disabled={!selectedAnswer}
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
