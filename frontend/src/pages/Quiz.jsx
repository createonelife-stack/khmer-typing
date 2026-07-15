import { Link } from "react-router-dom";
import { quizLessons } from "../quizData";
import "./Quiz.css";

export default function Quiz() {
  return (
    <div className="home">
      <h1>ជ្រើសរើសមេរៀនសំណួរ</h1>
      <p className="subtitle">សាកល្បងចំណេះដឹងរបស់អ្នកអំពីការវាយអក្សរ</p>

      <div className="lesson-grid" style={{ marginTop: '40px' }}>
        {quizLessons.map((lesson) => (
          <Link 
            to={`/quiz/${lesson.id}`} 
            key={lesson.id} 
            className="lesson-card"
          >
            <div className="lesson-number">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
            <div className="lesson-title">{lesson.title}</div>
            <div className="lesson-meta" style={{ marginTop: '8px' }}>
              {lesson.description}<br/>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{lesson.questions.length} សំណួរ</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
