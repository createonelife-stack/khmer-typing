import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizLessons } from "../quizData";
import "./Quiz.css";

export default function QuizSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  useEffect(() => {
    const foundLesson = quizLessons.find(l => l.id === id);
    if (foundLesson) {
      setLesson(foundLesson);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setSelectedAnswer("");
    } else {
      // If not found, go back
      navigate("/quiz");
    }
  }, [id, navigate]);

  const handleAnswerOptionClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer === lesson.questions[currentQuestion].answer) {
      setScore(score + 3); // 3 points per question
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

  if (!lesson) return <div>កំពុងផ្ទុក...</div>;

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
            <p className="score-text">អ្នកទទួលបានពិន្ទុ {score} / {lesson.questions.length * 3}</p>
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
