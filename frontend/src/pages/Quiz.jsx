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
  {
    id: 5,
    question: "តើម្រាមដៃកូនខាងឆ្វេង គួរដាក់នៅលើអក្សរអ្វី?",
    options: ["A", "S", "D", "F"],
    answer: "A",
  },
  {
    id: 6,
    question: "តើម្រាមដៃកូនខាងស្តាំ គួរដាក់នៅលើសញ្ញាអ្វី?",
    options: ["J", "K", "L", "; (សញ្ញាចុចក្បៀស)"],
    answer: "; (សញ្ញាចុចក្បៀស)",
  },
  {
    id: 7,
    question: "ដើម្បីវាយអក្សរធំ (Capital Letter) តើយើងត្រូវចុចប៊ូតុងអ្វី?",
    options: ["Ctrl", "Alt", "Shift", "Tab"],
    answer: "Shift",
  },
  {
    id: 8,
    question: "តើប៊ូតុងណាដែលប្រើសម្រាប់លុបអក្សរទៅក្រោយ?",
    options: ["Delete", "Backspace", "Spacebar", "Enter"],
    answer: "Backspace",
  },
  {
    id: 9,
    question: "តើប៊ូតុង Enter (បញ្ជូន) មានតួនាទីជាអ្វីនៅពេលកំពុងវាយអក្សរ?",
    options: ["លុបអក្សរ", "ចុះបន្ទាត់ថ្មី", "ដកឃ្លា", "ប្តូរភាសា"],
    answer: "ចុះបន្ទាត់ថ្មី",
  },
  {
    id: 10,
    question: "តើការអង្គុយវាយអក្សរដែលត្រឹមត្រូវគួរតែមានលក្ខណៈដូចម្តេច?",
    options: ["ខ្នងកោង មុខកៀកអេក្រង់", "ខ្នងត្រង់ ភ្នែកសម្លឹងអេក្រង់ ជើងរាបស្មើ", "ដេកវាយ", "សម្លឹងមើលតែក្តារចុច"],
    answer: "ខ្នងត្រង់ ភ្នែកសម្លឹងអេក្រង់ ជើងរាបស្មើ",
  }
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
      setScore(score + 3); // 3 points per question
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
            <p className="score-text">អ្នកទទួលបានពិន្ទុ {score} / {questions.length * 3}</p>
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
