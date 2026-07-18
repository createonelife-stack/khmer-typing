import { useState, useEffect } from "react";
import { getUsers, updateUserRole, deleteUser, updateUserStatus, getStats, register } from "../api";

export default function Owner({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  // New User Form State
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successPopup, setSuccessPopup] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (currentUser?.role !== 'owner' && currentUser?.role !== 'admin') {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([getUsers(), getStats()])
      .then(([usersData, statsData]) => {
        setUsers(usersData);
        setStats(statsData);
        setError("");
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleRoleChange = async (username, newRole) => {
    if (!window.confirm(`តើអ្នកពិតជាចង់ប្តូរសិទ្ធិ ${username} ទៅជា ${newRole} មែនទេ?`)) return;
    try {
      await updateUserRole(username, newRole);
      fetchData(); // Refresh the list & stats
    } catch (err) {
      alert("មានបញ្ហា៖ " + err.message);
    }
  };

  const handleStatusChange = async (username, newStatus) => {
    if (!window.confirm(`តើអ្នកពិតជាចង់${newStatus === 'suspended' ? 'បិទ' : 'បើក'}គណនី ${username} មែនទេ?`)) return;
    try {
      await updateUserStatus(username, newStatus);
      fetchData(); // Refresh the list & stats
    } catch (err) {
      alert("មានបញ្ហា៖ " + err.message);
    }
  };

  const handleDelete = async (username) => {
    if (!window.confirm(`តើអ្នកពិតជាចង់លុបគណនី ${username} មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`)) return;
    try {
      await deleteUser(username);
      fetchData(); // Refresh the list & stats
    } catch (err) {
      alert("មានបញ្ហា៖ " + err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      alert("សូមបញ្ចូលឈ្មោះ និងពាក្យសម្ងាត់!");
      return;
    }
    setIsCreating(true);
    try {
      await register({ username: newUsername, password: newPassword });
      setSuccessPopup({ username: newUsername, password: newPassword });
      setNewUsername("");
      setNewPassword("");
      fetchData();
    } catch (err) {
      alert("មានបញ្ហា៖ " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="admin">
      <div className="admin-header" style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "'Moul', serif" }}>ផ្ទាំងគ្រប់គ្រង (Dashboard)</h1>
      </div>
      <button onClick={fetchData} className="btn primary" style={{ position: 'fixed', bottom: '24px', right: '24px', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(91, 75, 255, 0.4)', zIndex: 1000, padding: 0, transition: 'all 0.3s ease' }} title="ទាញយកទិន្នន័យថ្មី">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
      </button>

      {error && <div className="error" style={{ marginBottom: "16px" }}>{error}</div>}
      
      {loading ? (
        <p>កំពុងផ្ទុកទិន្នន័យ...</p>
      ) : (
        <>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {currentUser?.role === 'owner' ? (
                <>
                  <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>អ្នកប្រើប្រាស់ (Owner បង្កើត)</h3>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalUsersByOwner || 0}</div>
                  </div>
                  <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>អ្នកប្រើប្រាស់ (Admin បង្កើត)</h3>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00C49F' }}>{stats.totalUsersByAdmin || 0}</div>
                  </div>
                </>
              ) : (
                <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>សរុបអ្នកប្រើប្រាស់</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalUsers || 0}</div>
                </div>
              )}

              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>មេរៀនវាយពាក្យសរុប</h3>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8a2be2' }}>{stats.totalLessons}</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>មេរៀនសំណួរសរុប</h3>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff9f43' }}>{stats.totalQuizzes || 0}</div>
              </div>
            </div>
          )}

          <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '16px' }}>បង្កើតគណនីថ្មី</h2>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>ឈ្មោះអ្នកប្រើ (Username)</label>
                <input 
                  type="text" 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                  placeholder="username" 
                  autoComplete="off"
                  style={{ width: '100%', height: '48px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>ពាក្យសម្ងាត់ (Password)</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="password" 
                    autoComplete="new-password"
                    style={{ width: '100%', height: '48px', padding: '12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', boxSizing: 'border-box' }}
                  />
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
              <div style={{ flex: 1, minWidth: '200px' }}>
                <button type="submit" className="btn primary" disabled={isCreating} style={{ width: '100%', height: '48px', padding: '12px 24px', boxSizing: 'border-box' }}>
                  {isCreating ? "កំពុងបង្កើត..." : "បង្កើតគណនី"}
                </button>
              </div>
            </form>
          </div>

          {(currentUser?.role === 'owner' || currentUser?.role === 'admin') && (
            <>
              <h2 style={{ marginBottom: '16px' }}>
                {currentUser?.role === 'owner' ? 'បញ្ជីអ្នកប្រើប្រាស់សរុប' : 'បញ្ជីគណនីដែលអ្នកបានបង្កើត'}
              </h2>
              <div className="lesson-list" style={{ overflowX: 'auto', borderRadius: '12px' }}>
            <table style={{ width: "100%", minWidth: "700px", borderCollapse: "collapse", background: "var(--surface)", borderRadius: "12px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "var(--primary)", color: "white" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>លេខរៀង (No.)</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>ឈ្មោះអ្នកប្រើ (Username)</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>សិទ្ធិ (Role)</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>ស្ថានភាព (Status)</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>ចំនួនដង Login</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>សកម្មភាព (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", opacity: u.status === 'suspended' ? 0.6 : 1 }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{index + 1}</td>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{u.username}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "4px", 
                        background: u.role === 'owner' ? '#ff4757' : u.role === 'admin' ? '#2ed573' : 'var(--border)',
                        color: u.role === 'owner' ? 'white' : u.role === 'admin' ? 'black' : 'var(--text)'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "4px", 
                        background: u.status === 'suspended' ? '#ff4757' : '#2ed573',
                        color: u.status === 'suspended' ? 'white' : 'black'
                      }}>
                        {u.status === 'suspended' ? 'បិទ' : 'សកម្ម'}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: "bold" }}>
                      {u.loginCount}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {((currentUser?.role === 'owner' && u.role !== 'owner') || (currentUser?.role === 'admin' && u.role === 'user')) && (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          {u.role === 'user' && currentUser?.role === 'owner' && (
                            <button onClick={() => handleRoleChange(u.username, 'admin')} className="btn" style={{ padding: "4px 8px", fontSize: "12px" }}>
                              ឡើងជា Admin
                            </button>
                          )}
                          {u.role === 'admin' && currentUser?.role === 'owner' && (
                            <button onClick={() => handleRoleChange(u.username, 'user')} className="btn" style={{ padding: "4px 8px", fontSize: "12px", background: "var(--border)", color: "var(--text)" }}>
                              ទម្លាក់ជា User
                            </button>
                          )}
                          {u.status === 'active' ? (
                            <button onClick={() => handleStatusChange(u.username, 'suspended')} className="btn" style={{ padding: "4px 8px", fontSize: "12px", background: "orange", color: "white" }}>
                              បិទគណនី
                            </button>
                          ) : (
                            <button onClick={() => handleStatusChange(u.username, 'active')} className="btn" style={{ padding: "4px 8px", fontSize: "12px", background: "#2ed573", color: "black" }}>
                              បើកគណនីវិញ
                            </button>
                          )}
                          <button onClick={() => handleDelete(u.username)} className="btn btn-danger" style={{ padding: "4px 8px", fontSize: "12px" }}>
                            លុបចោល
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </>
          )}
        </>
      )}

      {successPopup && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style={{ color: 'var(--success)', marginBottom: '12px' }}>គណនីបង្កើតបានជោគជ័យ!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
              សូមផ្ញើ account នេះទៅមនុស្សដែលអ្នកចង់អោយគាត់ចូលធ្វើតេស្ត៖
            </p>
            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left', border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ឈ្មោះអ្នកប្រើ (Username):</span>
                <strong style={{ color: 'var(--text)' }}>{successPopup.username}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ពាក្យសម្ងាត់ (Password):</span>
                <strong style={{ color: 'var(--text)' }}>{successPopup.password}</strong>
              </div>
            </div>
            <button className="btn primary" onClick={() => setSuccessPopup(null)} style={{ width: '100%', padding: '12px', borderRadius: '8px' }}>បិទ (Close)</button>
          </div>
        </div>
      )}
    </div>
  );
}
