import { useEffect, useState } from "react";
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz, seedQuizzes } from "../api";

export default function QuizAdmin() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
      if (data.length > 0 && !activeId) {
        loadIntoForm(data[0]);
      } else if (data.length > 0 && activeId) {
        const found = data.find(q => q.id === activeId);
        if (found) loadIntoForm(found);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const loadIntoForm = (quiz) => {
    setActiveId(quiz.id);
    setTitle(quiz.title);
    setDescription(quiz.description);
    setQuestions(quiz.questions || []);
    setStatus("");
    setError("");
  };

  const selectQuiz = (id) => {
    const quiz = quizzes.find((q) => q.id === id);
    if (quiz) loadIntoForm(quiz);
  };

  const handleCreateQuiz = async () => {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const newQuiz = await createQuiz();
      setQuizzes(prev => [...prev, newQuiz]);
      loadIntoForm(newQuiz);
      setStatus("បានបង្កើតមេរៀនសំនួរថ្មី!");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const payload = { title, description, questions };
      const updated = await updateQuiz(activeId, payload);
      setQuizzes(prev => prev.map(q => q.id === activeId ? updated : q));
      loadIntoForm(updated);
      setStatus("បានរក្សាទុកជោគជ័យ។");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("តើអ្នកពិតជាចង់លុបមេរៀនសំនួរនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។")) return;
    setSaving(true);
    setStatus("");
    setError("");
    try {
      await deleteQuiz(activeId);
      const next = quizzes.filter(q => q.id !== activeId);
      setQuizzes(next);
      if (next.length > 0) {
        loadIntoForm(next[0]);
      } else {
        setActiveId(null);
        setTitle("");
        setDescription("");
        setQuestions([]);
      }
      setStatus("បានលុបជោគជ័យ។");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("តើអ្នកពិតជាចង់ Seed ទិន្នន័យមែនទេ? សកម្មភាពនេះនឹងលុបសំនួរចាស់ទាំងអស់។")) return;
    setSeeding(true);
    setStatus("");
    setError("");
    try {
      const res = await seedQuizzes();
      setStatus(res.message || "Seed ជោគជ័យ។");
      setActiveId(null);
      await fetchQuizzes();
    } catch (e) {
      setError(e.message);
    } finally {
      setSeeding(false);
    }
  };

  // Question editing functions
  const addQuestion = () => {
    setQuestions([...questions, {
      question: "",
      options: ["", "", "", ""],
      answer: ""
    }]);
  };

  const removeQuestion = (idx) => {
    const next = questions.filter((_, i) => i !== idx);
    setQuestions(next);
  };

  const updateQuestionField = (idx, field, value) => {
    const next = [...questions];
    next[idx][field] = value;
    setQuestions(next);
  };

  const updateOption = (qIdx, optIdx, value) => {
    const next = [...questions];
    next[qIdx].options[optIdx] = value;
    setQuestions(next);
  };

  return (
    <div className="admin-page">
      {error && <p className="error">មានបញ្ហា៖ {error}</p>}
      {status && <p className="success">{status}</p>}

      <div className="admin-container">
        <div className="admin-tabs vertical">
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              className={`admin-tab ${activeId === quiz.id ? "active" : ""}`}
              onClick={() => selectQuiz(quiz.id)}
              type="button"
            >
              {quiz.title}
            </button>
          ))}
          <button className="admin-tab new-tab" onClick={handleCreateQuiz} type="button">
            + បង្កើតកម្រងសំនួរថ្មី
          </button>
          <button className="admin-tab new-tab" onClick={handleSeed} type="button" disabled={seeding} style={{ marginTop: '24px', background: '#ff4757', color: 'white', borderColor: '#ff4757' }}>
            {seeding ? "កំពុង Seed..." : "⟲ បង្កើតសំណួរស្វ័យប្រវត្តិ ៣ មេរៀន (Seed)"}
          </button>
        </div>

        {activeId && (
          <div className="admin-form" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', marginBottom: '24px' }}>
              <label className="field" style={{ margin: 0 }}>
                <span>ចំណងជើងកម្រងសំនួរ</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} lang="km" />
              </label>
              
              <label className="field" style={{ margin: 0 }}>
                <span>ការពិពណ៌នា</span>
                <input value={description} onChange={(e) => setDescription(e.target.value)} lang="km" />
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>បញ្ជីសំណួរ ({questions.length})</h3>
              <button type="button" className="btn small spark-btn" onClick={addQuestion}>
                + បន្ថែមសំណួរ
              </button>
            </div>

            <div className="question-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {questions.map((q, qIdx) => (
                <div key={qIdx} style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary)' }}>សំណួរទី {qIdx + 1}</h4>
                    <button type="button" className="btn small danger" onClick={() => removeQuestion(qIdx)}>
                      លុបសំណួរនេះ
                    </button>
                  </div>

                  <label className="field" style={{ marginBottom: '12px' }}>
                    <span>សំណួរ៖</span>
                    <input 
                      value={q.question} 
                      onChange={(e) => updateQuestionField(qIdx, 'question', e.target.value)} 
                      lang="km" 
                    />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    {q.options.map((opt, oIdx) => (
                      <label className="field" key={oIdx} style={{ margin: 0 }}>
                        <span style={{ fontSize: '12px' }}>ជម្រើសទី {oIdx + 1}៖</span>
                        <input 
                          value={opt} 
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} 
                          lang="km" 
                        />
                      </label>
                    ))}
                  </div>

                  <label className="field" style={{ margin: 0 }}>
                    <span style={{ color: '#00C49F' }}>ចម្លើយត្រឹមត្រូវ (Copy ជម្រើសមួយមកដាក់ទីនេះ)៖</span>
                    <select 
                      value={q.answer} 
                      onChange={(e) => updateQuestionField(qIdx, 'answer', e.target.value)} 
                      style={{ padding: '8px', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                      <option value="">-- ជ្រើសរើសចម្លើយត្រឹមត្រូវ --</option>
                      {q.options.map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>{opt || `ជម្រើសទី ${oIdx + 1}`}</option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '32px' }}>
              <button type="button" className="btn primary" onClick={handleSave} disabled={saving}>
                {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុកកម្រងសំនួរនេះ"}
              </button>
              <button type="button" className="btn danger" onClick={handleDelete} disabled={saving}>
                លុបកម្រងសំនួរនេះ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
