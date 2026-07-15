import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLessons } from "../api.js";

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getLessons()
      .then((data) => setLessons(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {loading && <p>កំពុងផ្ទុក...</p>}
      {error && <p className="error">មានបញ្ហា៖ {error}</p>}

      <div className="lesson-grid">
        {lessons.map((lesson) => (
          <Link 
            to={`/lesson/${lesson.id}`} 
            key={lesson.id} 
            className={`lesson-card ${lesson.words.length < 30 ? "disabled" : ""}`}
            style={lesson.words.length < 30 ? { opacity: 0.6, cursor: "not-allowed" } : {}}
            onClick={(e) => {
              if (lesson.words.length < 30) {
                e.preventDefault();
                alert("មេរៀននេះមិនទាន់មានពាក្យគ្រប់គ្រាន់ទេ (ត្រូវការ ៣០ ពាក្យ)!");
                return;
              }
              const token = localStorage.getItem("jwt_token");
              if (!token) {
                e.preventDefault();
                alert("សូមចុះឈ្មោះចូលប្រើប្រាស់ជាមុនសិន!");
                navigate("/auth");
              }
            }}
          >
            <div className="lesson-number">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
                <path d="M6 10h.01"></path>
                <path d="M10 10h.01"></path>
                <path d="M14 10h.01"></path>
                <path d="M18 10h.01"></path>
                <path d="M6 14h.01"></path>
                <path d="M18 14h.01"></path>
                <path d="M10 14h4"></path>
              </svg>
            </div>
            <div className="lesson-title">{lesson.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
