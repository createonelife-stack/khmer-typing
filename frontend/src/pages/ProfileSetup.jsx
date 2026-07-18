import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api";

export default function ProfileSetup({ user, setUser }) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (user.profileCompleted) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !gender || !jobRole) {
      setError("សូមបំពេញព័ត៌មានឲ្យបានគ្រប់គ្រាន់!");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await updateProfile(user.username, { fullName, gender, jobRole });
      
      const updatedUser = { 
        ...user, 
        profileCompleted: res.user.profileCompleted,
        fullName: res.user.fullName,
        gender: res.user.gender,
        jobRole: res.user.jobRole
      };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h2 className="profile-setup-title">សូមបំពេញព័ត៌មានរបស់អ្នក</h2>
        
        {error && <div style={{ background: "#ff475722", color: "#ff4757", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", border: "1px solid rgba(255, 71, 87, 0.3)" }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>គោត្តនាម-នាម</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              placeholder="ឧទាហរណ៍៖ សុខ សាន្ត" 
              required
            />
          </div>
          
          <div className="field">
            <label>ភេទ</label>
            <select 
              value={gender} 
              onChange={e => setGender(e.target.value)} 
              required
            >
              <option value="">-- ជ្រើសរើសភេទ --</option>
              <option value="ប្រុស">ប្រុស</option>
              <option value="ស្រី">ស្រី</option>
            </select>
          </div>
          
          <div className="field">
            <label>តួនាទី</label>
            <select 
              value={jobRole} 
              onChange={e => setJobRole(e.target.value)} 
              required
            >
              <option value="">-- ជ្រើសរើសតួនាទី --</option>
              <option value="ប្រធាន កចប">ប្រធាន កចប</option>
              <option value="ការីកុំព្យូទ័រ">ការីកុំព្យូទ័រ</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="btn primary" style={{ width: "100%", fontSize: "18px", padding: "16px", borderRadius: "12px", marginTop: "16px", boxShadow: "0 8px 16px rgba(91, 75, 255, 0.25)" }}>
            {loading ? "កំពុងរក្សាទុក..." : "យល់ព្រម និងចាប់ផ្តើម"}
          </button>
        </form>
      </div>
    </div>
  );
}
