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
            className="lesson-card"
            onClick={(e) => {
              const token = localStorage.getItem("jwt_token");
              if (!token) {
                e.preventDefault();
                alert("សូមចុះឈ្មោះចូលប្រើប្រាស់ជាមុនសិន!");
                navigate("/auth");
              }
            }}
          >
            <div className="lesson-number">{lesson.id}</div>
            <div className="lesson-title">{lesson.title}</div>
            <div className="lesson-meta">{lesson.words.length} ពាក្យ</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
