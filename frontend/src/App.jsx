import { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Typing from "./pages/Typing.jsx";
import Admin from "./pages/Admin.jsx";
import Owner from "./pages/Owner.jsx";
import Auth from "./pages/Auth.jsx";
import Quiz from "./pages/Quiz.jsx";
import QuizSession from "./pages/QuizSession.jsx";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")) || null);
  const [showDevModal, setShowDevModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("jwt_token");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-kh">វាយអក្សរខ្មែរ</span>
        </div>
        <div className="header-actions">
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="10" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="14" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>
              ប្រឡងវាយពាក្យ
            </NavLink>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowDevModal(true); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              ប្រឡងសំនួរជ្រើសរើស
            </a>
            {(user?.role === "admin" || user?.role === "owner") && (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                គ្រប់គ្រង
              </NavLink>
            )}
            {(user?.role === "admin" || user?.role === "owner") && (
              <NavLink to="/owner" className={({ isActive }) => (isActive ? "active" : "")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                អ្នកប្រើប្រាស់
              </NavLink>
            )}
          </nav>
          
          {user ? (
            <div className="user-profile">
              <span className="user-name">{user.username}</span>
              <button onClick={handleLogout} className="btn-logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                ចាកចេញ
              </button>
            </div>
          ) : (
            <NavLink to="/auth" className="btn-login">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              ចូលប្រើប្រាស់
            </NavLink>
          )}
          <button 
            onClick={toggleTheme} 
            className="btn-theme" 
            title="ប្តូរពណ៌ផ្ទៃ"
          >
            {theme === "light" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:id" element={<Typing />} />
          <Route path="/auth" element={<Auth setUser={setUser} />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:id" element={<QuizSession />} />
          <Route 
            path="/admin" 
            element={(user?.role === "admin" || user?.role === "owner") ? <Admin /> : <div style={{textAlign: 'center', padding: '64px'}}><h2>អ្នកមិនមានសិទ្ធិចូលទំព័រនេះទេ! (Access Denied)</h2></div>} 
          />
          <Route 
            path="/owner" 
            element={(user?.role === "admin" || user?.role === "owner") ? <Owner currentUser={user} /> : <div style={{textAlign: 'center', padding: '64px'}}><h2>អ្នកមិនមានសិទ្ធិចូលទំព័រនេះទេ! (Access Denied)</h2></div>} 
          />
        </Routes>
      </main>

      <footer className="footer">
        <span className="copyright">
          <span style={{ fontFamily: 'var(--en)' }}>© {new Date().getFullYear()}</span> រក្សាសិទ្ធិគ្រប់យ៉ាង
        </span>
        <span className="dot" style={{ fontFamily: 'var(--en)' }}>•</span>
        <span className="designer">រចនាដោយ <strong>លោកសាស្ត្រាចារ្យ ពៅ សាមុត</strong></span>
      </footer>
      {showDevModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'var(--primary)', marginBottom: '16px' }}>កំពុងអភិវឌ្ឍ (Under Development)</h2>
            <p style={{ marginBottom: '24px' }}>មុខងារ "ឆ្លើយសំណួរ" កំពុងស្ថិតក្នុងការអភិវឌ្ឍនៅឡើយ។ សូមរង់ចាំការធ្វើបច្ចុប្បន្នភាពនៅពេលក្រោយ!</p>
            <button className="btn primary" onClick={() => setShowDevModal(false)}>បិទ (Close)</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
