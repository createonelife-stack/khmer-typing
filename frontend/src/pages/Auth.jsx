import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("សូមបញ្ចូលឈ្មោះ និងពាក្យសម្ងាត់!");
      return;
    }

    try {
      let data;
      if (isLogin) {
        data = await login({ username, password });
      } else {
        data = await register({ username, password });
      }
      
      const loggedInUser = data.user;
      setUser(loggedInUser);
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      localStorage.setItem("jwt_token", data.token);
      navigate("/");
    } catch (err) {
      let msg = err.message || "មានបញ្ហាពេលភ្ជាប់ទៅកាន់ Server";
      if (msg === "Account is temporarily suspended") {
        msg = "គណនីរបស់អ្នកត្រូវបានបិទជាបណ្ដោះអាសន្ន។";
      }
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-flip-box ${isLogin ? '' : 'flipped'}`}>
        <div className="auth-flip-inner">
          
          {/* FRONT (Login) */}
          <div className="auth-flip-front auth-card">
            <div className="auth-header">
              <button type="button" className="auth-tab active">ចូលគណនី</button>
              <button type="button" className="auth-tab" onClick={() => { setIsLogin(false); setError(""); }}>បង្កើតគណនី</button>
            </div>
            <div className="auth-body">
              <h2 className="auth-title">សូមស្វាគមន៍ត្រលប់មកវិញ!</h2>
              {isLogin && error && <p className="error" style={{ marginBottom: '16px' }}>{error}</p>}
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="field">
                  <span>ឈ្មោះអ្នកប្រើ (Username)</span>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="បញ្ជូលឈ្មោះរបស់អ្នក..." />
                </div>
                <div className="field">
                  <span>ពាក្យសម្ងាត់ (Password)</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="បញ្ជូលពាក្យសម្ងាត់..." />
                </div>
                <button type="submit" className="btn btn-border-reveal reveal-primary" style={{ width: '100%', marginTop: '32px', padding: '16px' }}>
                  ចូលប្រើប្រាស់
                </button>
              </form>
            </div>
          </div>

          {/* BACK (Sign Up) */}
          <div className="auth-flip-back auth-card">
            <div className="auth-header">
              <button type="button" className="auth-tab" onClick={() => { setIsLogin(true); setError(""); }}>ចូលគណនី</button>
              <button type="button" className="auth-tab active">បង្កើតគណនី</button>
            </div>
            <div className="auth-body">
              <h2 className="auth-title">បង្កើតគណនីថ្មីរបស់អ្នក</h2>
              {!isLogin && error && <p className="error" style={{ marginBottom: '16px' }}>{error}</p>}
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="field">
                  <span>ឈ្មោះអ្នកប្រើ (Username)</span>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="បញ្ជូលឈ្មោះរបស់អ្នក..." />
                </div>
                <div className="field">
                  <span>ពាក្យសម្ងាត់ (Password)</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="បញ្ជូលពាក្យសម្ងាត់..." />
                </div>
                <button type="submit" className="btn btn-border-reveal reveal-primary" style={{ width: '100%', marginTop: '16px', padding: '16px' }}>
                  បង្កើតគណនីថ្មី
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
