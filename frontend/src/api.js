const BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:4000/api" : "/api");

function getAuthHeaders() {
  const token = localStorage.getItem("jwt_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function login(credentials) {
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }).then(handle);
}

export function register(credentials) {
  return fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(credentials)
  }).then(handle);
}

export function getUsers() {
  return fetch(`${BASE_URL}/users`, {
    headers: { ...getAuthHeaders() }
  }).then(handle);
}

export function getStats() {
  return fetch(`${BASE_URL}/stats`, {
    headers: { ...getAuthHeaders() }
  }).then(handle);
}

export function updateUserRole(username, role) {
  return fetch(`${BASE_URL}/users/${username}/role`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ role })
  }).then(handle);
}

export function updateUserStatus(username, status) {
  return fetch(`${BASE_URL}/users/${username}/status`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ status })
  }).then(handle);
}

export function deleteUser(username) {
  return fetch(`${BASE_URL}/users/${username}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() }
  }).then(handle);
}

export function getLessons() {
  return fetch(`${BASE_URL}/lessons`).then(handle);
}

export function getLesson(id) {
  return fetch(`${BASE_URL}/lessons/${id}`).then(handle);
}

export function updateLesson(id, payload) {
  return fetch(`${BASE_URL}/lessons/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function createLesson() {
  return fetch(`${BASE_URL}/lessons`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    }
  }).then(handle);
}

export function deleteLesson(id) {
  return fetch(`${BASE_URL}/lessons/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  }).then(handle);
}

export function postResult(payload) {
  return fetch(`${BASE_URL}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function getResults(lessonId) {
  const q = lessonId ? `?lessonId=${lessonId}` : "";
  return fetch(`${BASE_URL}/results${q}`).then(handle);
}
