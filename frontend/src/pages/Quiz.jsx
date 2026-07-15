import { useState } from "react";
import "./Quiz.css";

const questions = [
  {
    id: 1,
    question: "តើម្រាមដៃចង្អុលខាងឆ្វេង គួរដាក់នៅលើអក្សរអ្វី?",
    options: ["A", "S", "D", "F"],
    answer: "F",
  },
  {
    id: 2,
    question: "តើម្រាមដៃចង្អុលខាងស្តាំ គួរដាក់នៅលើអក្សរអ្វី?",
    options: ["J", "K", "L", ";"],
    answer: "J",
  },
  {
    id: 3,
    question: "តើម្រាមដៃមេ (Thumbs) ទាំងពីរត្រូវបានប្រើសម្រាប់ចុចប៊ូតុងអ្វី?",
    options: ["Enter", "Spacebar", "Shift", "Alt"],
    answer: "Spacebar",
  },
  {
    id: 4,
    question: "តើ Home Row Keys (ជួរកណ្តាល) គឺជាអ្វីខ្លះ?",
    options: ["Q W E R T Y U I O P", "Z X C V B N M", "A S D F J K L ;", "1 2 3 4 5 6 7 8 9 0"],
    answer: "A S D F J K L ;",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleAnswerOptionClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
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

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {showScore ? (
          <div className="score-section">
            <h2>លទ្ធផលរបស់អ្នក</h2>
            <p className="score-text">អ្នកទទួលបាន {score} លើ {questions.length} ពិន្ទុ!</p>
            <button className="btn primary" onClick={restartQuiz}>ចាប់ផ្តើមម្តងទៀត</button>
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>សំណួរទី {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className="question-text">{questions[currentQuestion].question}</div>
            </div>
            <div className="answer-section">
              {questions[currentQuestion].options.map((option, index) => (
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
                {currentQuestion === questions.length - 1 ? "បញ្ចប់" : "បន្ទាប់"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
