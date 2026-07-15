import { useState, useEffect } from "react";
import { getUsers, updateUserRole, deleteUser, updateUserStatus, getStats } from "../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function Owner() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
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

  // Chart Data
  const roleData = stats ? [
    { name: 'អ្នកប្រើប្រាស់ (Users)', value: stats.totalUsers },
    { name: 'អ្នកគ្រប់គ្រង (Admins)', value: stats.totalAdmins },
  ] : [];

  const statusData = stats ? [
    { name: 'សកម្ម (Active)', value: (stats.totalUsers + stats.totalAdmins) - stats.totalSuspended },
    { name: 'បិទ (Suspended)', value: stats.totalSuspended },
  ] : [];

  const COLORS_ROLE = ['#0088FE', '#00C49F'];
  const COLORS_STATUS = ['#2ed573', '#ff4757'];

  return (
    <div className="admin">
      <div className="admin-header" style={{ marginBottom: "24px" }}>
        <h1>ផ្ទាំងគ្រប់គ្រង (Dashboard)</h1>
        <button onClick={fetchData} className="btn">ទាញយកទិន្នន័យថ្មី</button>
      </div>

      {error && <div className="error" style={{ marginBottom: "16px" }}>{error}</div>}
      
      {loading ? (
        <p>កំពុងផ្ទុកទិន្នន័យ...</p>
      ) : (
        <>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>អ្នកប្រើប្រាស់សរុប</h3>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalUsers + stats.totalAdmins}</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>អ្នកគ្រប់គ្រង (Admin)</h3>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00C49F' }}>{stats.totalAdmins}</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>គណនីត្រូវបានបិទ</h3>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff4757' }}>{stats.totalSuspended}</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>មេរៀនសរុប</h3>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8a2be2' }}>{stats.totalLessons}</div>
              </div>
            </div>
          )}

          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>អត្រាសិទ្ធិអ្នកប្រើប្រាស់ (Roles)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_ROLE[index % COLORS_ROLE.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>ស្ថានភាពគណនី (Status)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <h2 style={{ marginBottom: '16px' }}>បញ្ជីអ្នកប្រើប្រាស់</h2>
          <div className="lesson-list">
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface)", borderRadius: "12px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "var(--primary)", color: "white" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>លេខរៀង (ID)</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>ឈ្មោះអ្នកប្រើ (Username)</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>សិទ្ធិ (Role)</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>ស្ថានភាព (Status)</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>សកម្មភាព (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", opacity: u.status === 'suspended' ? 0.6 : 1 }}>
                    <td style={{ padding: "12px" }}>{u.id}</td>
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
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {u.role !== 'owner' && (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          {u.role === 'user' && (
                            <button onClick={() => handleRoleChange(u.username, 'admin')} className="btn" style={{ padding: "4px 8px", fontSize: "12px" }}>
                              ឡើងជា Admin
                            </button>
                          )}
                          {u.role === 'admin' && (
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
    </div>
  );
}
