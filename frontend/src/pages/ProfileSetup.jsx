import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api";

export default function ProfileSetup({ user, setUser }) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [photo, setPhoto] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (user.profileCompleted) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      setError("មិនអាចបើកកាមេរ៉ាបានទេ៖ " + err.message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    setPhoto(dataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !gender || !jobRole || !photo) {
      setError("សូមបំពេញព័ត៌មាននិងថតរូបឲ្យបានគ្រប់គ្រាន់!");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await updateProfile(user.username, { fullName, gender, jobRole, photo });
      
      const updatedUser = { 
        ...user, 
        profileCompleted: res.user.profileCompleted,
        fullName: res.user.fullName,
        gender: res.user.gender,
        jobRole: res.user.jobRole,
        photo: res.user.photo
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
          
          <div className="field">
            <label>ថតរូបបញ្ជាក់អត្តសញ្ញាណ</label>
            
            {!photo && !cameraActive && (
              <div className="photo-upload-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px", opacity: 0.8 }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <br/>
                <button type="button" onClick={startCamera} className="btn primary" style={{ borderRadius: "100px", padding: "10px 24px" }}>
                  បើកកាមេរ៉ាដើម្បីថតរូប
                </button>
              </div>
            )}
            
            <div style={{ textAlign: "center", display: !photo && cameraActive ? "block" : "none", background: "rgba(0,0,0,0.05)", padding: "16px", borderRadius: "16px" }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "320px", borderRadius: "12px", border: "4px solid var(--primary)", marginBottom: "16px", boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}></video>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button type="button" onClick={capturePhoto} className="btn primary" style={{ background: "#22c55e", borderColor: "#22c55e" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px", verticalAlign: "middle" }}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                  ថតរូបទីនេះ
                </button>
                <button type="button" onClick={stopCamera} className="btn" style={{ background: "var(--surface)", color: "var(--text)" }}>បិទកាមេរ៉ា</button>
              </div>
            </div>
            
            {photo && (
              <div style={{ textAlign: "center", background: "rgba(0,0,0,0.05)", padding: "16px", borderRadius: "16px" }}>
                <img src={photo} alt="Profile" style={{ width: "100%", maxWidth: "320px", borderRadius: "12px", border: "4px solid var(--success)", marginBottom: "16px", boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }} />
                <div>
                  <button type="button" onClick={retakePhoto} className="btn" style={{ background: "var(--surface)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px", verticalAlign: "middle" }}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    ថតរូបម្តងទៀត
                  </button>
                </div>
              </div>
            )}
            
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
          
          <button type="submit" disabled={loading} className="btn primary" style={{ width: "100%", fontSize: "18px", padding: "16px", borderRadius: "12px", marginTop: "16px", boxShadow: "0 8px 16px rgba(91, 75, 255, 0.25)" }}>
            {loading ? "កំពុងរក្សាទុក..." : "យល់ព្រម និងចាប់ផ្តើម"}
          </button>
        </form>
      </div>
    </div>
  );
}
