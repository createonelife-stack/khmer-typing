import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLessons } from "../api.js";
import { LockIcon, UnlockIcon } from "../components/Icons";

export default function Home({ user }) {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const isAdminOrOwner = user?.role === "admin" || user?.role === "owner";

  if (user && user.permissions?.canTyping === false && !isAdminOrOwner) {
    return (
      <div className="home" style={{ textAlign: 'center', padding: '64px' }}>
        <h2>🚫 មិនមានសិទ្ធិប្រើប្រាស់</h2>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>គណនីរបស់អ្នកមិនត្រូវបានអនុញ្ញាតឲ្យចូលប្រើប្រាស់មុខងារវាយពាក្យទេ។ សូមទាក់ទង Admin។</p>
      </div>
    );
  }

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

      {user && !isAdminOrOwner && (
        <div className="student-dashboard">
          <div>
            <h2>សួស្តី, {user.username}! 👋</h2>
            <p>សូមស្វាគមន៍មកកាន់ប្រព័ន្ធរៀនវាយអក្សរខ្មែរ</p>
          </div>
          <div className="student-stats">
            <div className="stat-box">
              <div className="stat-value">{lessons.filter(l => user?.allowedLessons?.includes(l.id)).length}</div>
              <div className="stat-label">មេរៀនដែលបើកសោរ</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{lessons.length}</div>
              <div className="stat-label">មេរៀនសរុប</div>
            </div>
          </div>
        </div>
      )}

      <div className="roadmap-container">
        {lessons.map((lesson, index) => {
          const isAllowed = user?.allowedLessons?.includes(lesson.id) || false;
          const isEffectivelyLocked = lesson.isLocked && !isAdminOrOwner && !isAllowed;
          const isInsufficientWords = lesson.words.length < 30;
          
          let nodeClass = "roadmap-node ";
          if (isEffectivelyLocked || isInsufficientWords) {
            nodeClass += "locked";
          } else {
            // For now, unlocked lessons are shown as "current" or "completed"
            // Let's just make the first unlocked one "current" and the rest "completed" (for visual mockup)
            nodeClass += "current";
          }

          return (
          <div key={lesson.id} className="roadmap-node-wrapper">
            <Link 
              to={`/lesson/${lesson.id}`} 
              className={nodeClass}
              style={(isInsufficientWords || isEffectivelyLocked) ? { cursor: (lesson.isLocked && (isAdminOrOwner || isAllowed)) ? "pointer" : "not-allowed" } : {}}
              onClick={(e) => {
                if (isEffectivelyLocked) {
                  e.preventDefault();
                  setShowLockedModal(true);
                  return;
                }
                if (isInsufficientWords) {
                  e.preventDefault();
                  setShowModal(true);
                  return;
                }
                const token = localStorage.getItem("jwt_token");
                if (!token) {
                  e.preventDefault();
                  setShowAuthModal(true);
                }
              }}
            >
              <div className="lesson-icon">
                {lesson.isLocked ? (
                  <span style={{ fontSize: '24px', filter: (isAdminOrOwner || isAllowed) ? 'opacity(0.8)' : 'none', display: 'flex' }}>
                    {(isAdminOrOwner || isAllowed) ? <UnlockIcon size={24} /> : <LockIcon size={24} />}
                  </span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
                    <path d="M6 10h.01"></path>
                    <path d="M10 10h.01"></path>
                    <path d="M14 10h.01"></path>
                    <path d="M18 10h.01"></path>
                    <path d="M6 14h.01"></path>
                    <path d="M18 14h.01"></path>
                    <path d="M10 14h4"></path>
                  </svg>
                )}
              </div>
              <div className="lesson-number-text">{index + 1}</div>
              <div className="lesson-title-tooltip">{lesson.title}</div>
            </Link>
          </div>
        )})}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>បដិសេធការចូលប្រើប្រាស់</h3>
            <p>សូមទាក់ទង admin ដើម្បី ទទួលសិទ្ធ</p>
            <button type="button" className="btn primary" onClick={() => setShowModal(false)}>
              យល់ព្រម
            </button>
          </div>
        </div>
      )}

      {showLockedModal && (
        <div className="modal-overlay" onClick={() => setShowLockedModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>មេរៀននេះត្រូវបានចាក់សោរ</h3>
            <p>អ្នកមិនអាចចូលរៀនមេរៀននេះបានទេ រហូតដល់ Admin ដោះសោរជាមុនសិន។</p>
            <button type="button" className="btn primary" onClick={() => setShowLockedModal(false)}>
              យល់ព្រម
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{textAlign: 'center', maxWidth: '400px'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '16px'}}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            <h3 style={{marginBottom: '16px'}}>តម្រូវឲ្យចុះឈ្មោះ (Login Required)</h3>
            <p style={{marginBottom: '24px', color: 'var(--text-muted)'}}>សូមចុះឈ្មោះចូលប្រើប្រាស់ (Login) ជាមុនសិន ដើម្បីអាចចូលរៀនមេរៀននេះបាន។</p>
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
