import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Auth({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const data = await login({ username, password });
      
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
      <div className="auth-card" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="auth-header" style={{ justifyContent: 'center' }}>
          <button type="button" className="auth-tab active" style={{ cursor: 'default' }}>ចូលគណនី</button>
            </div>
            <div className="auth-body">
              <h2 className="auth-title">សូមស្វាគមន៍ត្រលប់មកវិញ!</h2>
              {error && <p className="error" style={{ marginBottom: '16px' }}>{error}</p>}
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="field">
                  <span>ឈ្មោះអ្នកប្រើ (Username)</span>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="បញ្ជូលឈ្មោះរបស់អ្នក..." />
                </div>
                <div className="field">
                  <span>ពាក្យសម្ងាត់ (Password)</span>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="បញ្ជូលពាក្យសម្ងាត់..." style={{ width: '100%', paddingRight: '48px' }} />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                      title={showPassword ? "លាក់" : "បង្ហាញ"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-border-reveal reveal-primary" style={{ width: '100%', marginTop: '32px', padding: '16px' }}>
                  ចូលប្រើប្រាស់
                </button>
              </form>
        </div>
      </div>
    </div>
  );
}
