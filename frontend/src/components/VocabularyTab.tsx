import { useState, useEffect } from "react";
import "./VocabularyTab.css";

interface Word {
  id: number;
  word_de: string;
  word_en: string;
  article: string;
  status: "new" | "learning" | "known";
}

const STATUS_ORDER = ["new", "learning", "known"] as const;

export default function VocabularyTab() {
  const [words, setWords] = useState<Word[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "learning" | "known">("all");
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ word_de: "", word_en: "", article: "" });
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/vocabulary/");
      const data = await res.json();
      setWords(data);
    } catch {
      console.error("Failed to fetch vocabulary");
    }
    setLoading(false);
  };

  useEffect(() => { fetchWords(); }, []);

  const addWord = async () => {
    if (!form.word_de || !form.word_en) return;
    await fetch("http://127.0.0.1:8000/vocabulary/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ word_de: "", word_en: "", article: "" });
    setShowForm(false);
    fetchWords();
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`http://127.0.0.1:8000/vocabulary/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchWords();
  };

  const deleteWord = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/vocabulary/${id}`, { method: "DELETE" });
    fetchWords();
  };

  const toggleFlip = (id: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = filter === "all" ? words : words.filter((w) => w.status === filter);

  return (
    <div className="vocab-root">
      <div className="vocab-header">
        <div className="vocab-title">Vocabulary</div>
        <div className="vocab-filters">
          {(["all", "new", "learning", "known"] as const).map((f) => (
            <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">
                {f === "all" ? words.length : words.filter((w) => w.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Word"}
        </button>
      </div>

      {showForm && (
        <div className="word-form">
          <input
            className="form-input"
            placeholder="German word (e.g. die Nachhaltigkeit)"
            value={form.word_de}
            onChange={(e) => setForm({ ...form, word_de: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Article (der/die/das)"
            value={form.article}
            onChange={(e) => setForm({ ...form, article: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="English meaning"
            value={form.word_en}
            onChange={(e) => setForm({ ...form, word_en: e.target.value })}
          />
          <button className="btn-save-word" onClick={addWord}>Save Word</button>
        </div>
      )}

      {loading && <div className="vocab-empty">Loading...</div>}

      {!loading && filtered.length === 0 && (
        <div className="vocab-empty">
          {filter === "all" ? "No words yet — add your first word above." : `No ${filter} words.`}
        </div>
      )}

      <div className="vocab-grid">
        {filtered.map((w) => (
          <div
            key={w.id}
            className={`vocab-card ${flipped.has(w.id) ? "flipped" : ""}`}
            onClick={() => toggleFlip(w.id)}
          >
            <div className={`status-dot ${w.status}`} />
            {w.article && <div className="word-article">{w.article}</div>}
            <div className="word-de">{w.word_de}</div>
            {flipped.has(w.id) && <div className="word-en">{w.word_en}</div>}
            {!flipped.has(w.id) && <div className="word-hint">Click to reveal</div>}
            <div className="card-actions" onClick={(e) => e.stopPropagation()}>
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  className={`status-btn ${w.status === s ? "active-" + s : ""}`}
                  onClick={() => updateStatus(w.id, s)}
                >
                  {s}
                </button>
              ))}
              <button className="delete-btn" onClick={() => deleteWord(w.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}