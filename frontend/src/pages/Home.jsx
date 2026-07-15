import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLessons } from "../api.js";

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLessons()
      .then((data) => setLessons(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <h1>ជ្រើសរើសមេរៀន</h1>
      <p className="subtitle">
        ១ មេរៀន មាន ៣០ ពាក្យ · រយៈពេល ១០ នាទី · ១ ពាក្យ = ៣ ពិន្ទុ
      </p>
      <p className="subtitle small">
        បញ្ចប់ក្រោម ៥ នាទី បានពិន្ទុបន្ថែម ១០ ពិន្ទុ · បញ្ចប់ក្រោម ៧ នាទី បានពិន្ទុបន្ថែម ៥ ពិន្ទុ
      </p>
      
      {loading && <p>កំពុងផ្ទុក...</p>}
      {error && <p className="error">មានបញ្ហា៖ {error}</p>}

      <div className="lesson-grid">
        {lessons.map((lesson) => (
          <Link to={`/lesson/${lesson.id}`} key={lesson.id} className="lesson-card">
            <div className="lesson-number">{lesson.id}</div>
            <div className="lesson-title">{lesson.title}</div>
            <div className="lesson-meta">{lesson.words.length} ពាក្យ</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
