import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getQuizzes } from "../api";
import "./Quiz.css";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes()
      .then(data => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home">
      <h1>ជ្រើសរើសមេរៀនសំណួរ</h1>
      <p className="subtitle">សាកល្បងចំណេះដឹងរបស់អ្នកអំពីការវាយអក្សរ</p>

      <div className="lesson-grid" style={{ marginTop: '40px' }}>
        {loading && <p>កំពុងផ្ទុកទិន្នន័យ...</p>}
        {error && <p className="error">មានបញ្ហា៖ {error}</p>}
        {!loading && quizzes.map((lesson, index) => (
          <Link 
            to={`/quiz/${lesson.id}`} 
            key={lesson.id} 
            className="lesson-card quiz-card-bg"
            onClick={(e) => {
              const token = localStorage.getItem("jwt_token");
              if (!token) {
                e.preventDefault();
                setShowAuthModal(true);
              }
            }}
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
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{lesson.questions?.length || 0} សំណួរ</span>
            </div>
          </Link>
        ))}
      </div>

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{textAlign: 'center', maxWidth: '400px'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '16px'}}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            <h3 style={{marginBottom: '16px'}}>តម្រូវឲ្យចុះឈ្មោះ (Login Required)</h3>
            <p style={{marginBottom: '24px', color: 'var(--text-muted)'}}>សូមចុះឈ្មោះចូលប្រើប្រាស់ (Login) ជាមុនសិន ដើម្បីអាចឆ្លើយសំណួរនេះបាន។</p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
              <button type="button" className="btn" onClick={() => setShowAuthModal(false)}>
                បិទ
              </button>
              <button type="button" className="btn primary" onClick={() => navigate("/auth")}>
                ទៅកាន់ទំព័រ Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
