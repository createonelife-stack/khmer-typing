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
      
      const updatedUser = { ...user, profileCompleted: res.user.profileCompleted };
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
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px", color: "var(--primary)" }}>សូមបំពេញព័ត៌មានរបស់អ្នក</h2>
        
        {error && <div style={{ background: "#ff475722", color: "#ff4757", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>គោត្តនាម-នាម</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              className="input-field"
              placeholder="ឧទាហរណ៍៖ សុខ សាន្ត" 
              required
            />
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>ភេទ</label>
            <select 
              value={gender} 
              onChange={e => setGender(e.target.value)} 
              className="input-field"
              required
            >
              <option value="">-- ជ្រើសរើសភេទ --</option>
              <option value="ប្រុស">ប្រុស</option>
              <option value="ស្រី">ស្រី</option>
            </select>
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>តួនាទី</label>
            <select 
              value={jobRole} 
              onChange={e => setJobRole(e.target.value)} 
              className="input-field"
              required
            >
              <option value="">-- ជ្រើសរើសតួនាទី --</option>
              <option value="ប្រធាន កចប">ប្រធាន កចប</option>
              <option value="ការីកុំព្យូទ័រ">ការីកុំព្យូទ័រ</option>
            </select>
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>ថតរូប</label>
            
            {!photo && !cameraActive && (
              <div style={{ textAlign: "center", padding: "20px", border: "2px dashed var(--border)", borderRadius: "8px" }}>
                <button type="button" onClick={startCamera} className="btn">បើកកាមេរ៉ាដើម្បីថតរូប</button>
              </div>
            )}
            
            {!photo && cameraActive && (
              <div style={{ textAlign: "center" }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "320px", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "10px" }}></video>
                <div>
                  <button type="button" onClick={capturePhoto} className="btn" style={{ background: "#2ed573", color: "black", marginRight: "10px" }}>ថតរូបទីនេះ</button>
                  <button type="button" onClick={stopCamera} className="btn" style={{ background: "var(--border)", color: "var(--text)" }}>បិទកាមេរ៉ា</button>
                </div>
              </div>
            )}
            
            {photo && (
              <div style={{ textAlign: "center" }}>
                <img src={photo} alt="Profile" style={{ width: "100%", maxWidth: "320px", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "10px" }} />
                <div>
                  <button type="button" onClick={retakePhoto} className="btn" style={{ background: "orange", color: "white" }}>ថតរូបម្តងទៀត</button>
                </div>
              </div>
            )}
            
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", fontSize: "18px", padding: "12px" }}>
            {loading ? "កំពុងរក្សាទុក..." : "ចាប់ផ្តើម"}
          </button>
        </form>
      </div>
    </div>
  );
}
