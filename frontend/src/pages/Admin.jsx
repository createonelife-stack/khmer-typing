import { useEffect, useState } from "react";
import { getLessons, updateLesson, createLesson, deleteLesson } from "../api.js";

export default function Admin() {
  const [lessons, setLessons] = useState([]);
  const [activeId, setActiveId] = useState(1);
  const [title, setTitle] = useState("");
  const [words, setWords] = useState([]);
  const [bulkText, setBulkText] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLessons()
      .then((data) => {
        setLessons(data);
        const first = data.find((l) => l.id === activeId) || data[0];
        if (first) loadIntoForm(first);
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadIntoForm(lesson) {
    setActiveId(lesson.id);
    setTitle(lesson.title);
    setWords(lesson.words);
    setBulkText(lesson.words.join("\n"));
    setStatus("");
  }

  function selectLesson(lessonId) {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) loadIntoForm(lesson);
  }

  function handleWordChange(index, value) {
    const next = [...words];
    next[index] = value;
    setWords(next);
  }

  function removeWord(index) {
    const next = words.filter((_, i) => i !== index);
    setWords(next);
  }

  function addWord() {
    setWords([...words, ""]);
  }

  function applyBulkText() {
    const parsed = bulkText
      .split(/\r?\n|,/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
    setWords(parsed);
    setStatus(`បានផ្ទុក ${parsed.length} ពាក្យពី​ការបិទភ្ជាប់`);
  }

  async function handleSave() {
    setSaving(true);
    setStatus("");
    setError("");
    const cleanWords = words.map((w) => w.trim()).filter((w) => w.length > 0);
    try {
      const updated = await updateLesson(activeId, { title, words: cleanWords });
      setWords(updated.words);
      setLessons((prev) =>
        prev.map((l) => (l.id === activeId ? { ...l, title: updated.title, words: updated.words } : l))
      );
      setStatus(`បានរក្សាទុក ${updated.words.length} ពាក្យសម្រាប់ ${updated.title}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateLesson() {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const newLesson = await createLesson();
      setLessons(prev => [...prev, newLesson]);
      loadIntoForm(newLesson);
      setStatus("បានបង្កើតមេរៀនថ្មី!");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLesson() {
    if (!window.confirm("តើអ្នកពិតជាចង់លុបមេរៀននេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។")) {
      return;
    }
    setSaving(true);
    setError("");
    setStatus("");
    try {
      await deleteLesson(activeId);
      setLessons(prev => {
        const next = prev.filter(l => l.id !== activeId);
        if (next.length > 0) {
          loadIntoForm(next[0]);
        } else {
          setActiveId(null);
          setTitle("");
          setWords([]);
          setBulkText("");
        }
        return next;
      });
      setStatus("បានលុបមេរៀនជោគជ័យ។");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const wordCountWarning = words.length !== 30;

  return (
    <div className="admin-page">

      {error && <p className="error">មានបញ្ហា៖ {error}</p>}
      {status && <p className="success">{status}</p>}

      <div className="admin-container">
        <div className="admin-tabs vertical">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              className={`admin-tab ${activeId === lesson.id ? "active" : ""}`}
              onClick={() => selectLesson(lesson.id)}
              type="button"
            >
              {lesson.title}
            </button>
          ))}
          <button className="admin-tab new-tab" onClick={handleCreateLesson} type="button">
            + បង្កើតថ្មី
          </button>
        </div>

        <div className="admin-form">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '24px' }}>
          <label className="field" style={{ flex: 1, margin: 0 }}>
            <span>ចំណងជើងមេរៀន</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} lang="km" />
          </label>

          <div className={`word-count ${wordCountWarning ? "warn" : "ok"}`} style={{ margin: 0 }}>
            ចំនួនពាក្យបច្ចុប្បន្ន: {words.length} {wordCountWarning ? "(គួរមាន ៣០ ពាក្យ)" : "✓"}
          </div>
        </div>

        <div className="admin-columns">
          <div className="word-list-editor">
            <h3>បញ្ជីពាក្យ (កែម្តងមួយៗ)</h3>
            <div className="word-list">
              {words.map((w, i) => (
                <div className="word-row" key={i}>
                  <span className="word-index">{i + 1}</span>
                  <input
                    value={w}
                    onChange={(e) => handleWordChange(i, e.target.value)}
                    lang="km"
                  />
                  <button type="button" className="btn small danger delete-word-btn glow-on-hover" onClick={() => removeWord(i)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                    <span className="delete-text">លុប</span>
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn small spark-btn" onClick={addWord}>
              + បន្ថែមពាក្យ
            </button>
          </div>

          <div className="bulk-editor">
            <h3>បិទភ្ជាប់ពាក្យច្រើនក្នុងពេលតែមួយ</h3>
            <textarea
              rows={12}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              lang="km"
            />
            <button type="button" className="btn small spark-btn" onClick={applyBulkText}>
              ប្រើពាក្យទាំងនេះ
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
          <button type="button" className="btn btn-border-reveal reveal-primary" onClick={handleSave} disabled={saving || !activeId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
          </button>
          <button type="button" className="btn btn-border-reveal reveal-danger" onClick={handleDeleteLesson} disabled={saving || !activeId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            លុបមេរៀននេះ
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
