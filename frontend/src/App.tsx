import { useState, useEffect } from "react";
import SpeakingTab from "./components/SpeakingTab";
import SettingsTab from "./components/SettingsTab";
import "./App.css";

type Tab = "speaking" | "vocabulary" | "grammar" | "settings";
type BackendStatus = "checking" | "ok" | "error";

export default function App() {
  const [tab, setTab] = useState<Tab>("speaking");
  const [backend, setBackend] = useState<BackendStatus>("checking");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("awen_groq_key") || "");
  
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/health");
        setBackend(res.ok ? "ok" : "error");
      } catch {
        setBackend("error");
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="logo">
          <span className="logo-name">Awen</span>
          <span className="logo-sub">German AI Tutor</span>
        </div>
        <nav className="nav-tabs">
          {(["speaking", "vocabulary", "grammar", "settings"] as Tab[]).map((t) => (
            <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {tabIcon(t)} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
        <div className="topbar-right">
          <span className={`status-dot ${backend}`} title={`Backend: ${backend}`} />
          <span className="level-tag">B2 Prep</span>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-section">Practice</div>
          <button className="sidebar-item active">🎙 Speak a paragraph</button>
          <button className="sidebar-item">✏️ Write & correct</button>
          <button className="sidebar-item">💬 Free conversation</button>
          <div className="sidebar-section">Content</div>
          <button className="sidebar-item">📄 Upload text</button>
          <button className="sidebar-item">✨ Generate topic <span className="si-badge">AI</span></button>
          <button className="sidebar-item">🕓 Past sessions</button>
          <div className="score-box">
            <div className="score-label">Backend</div>
            <div className={`score-value ${backend}`}>
              {backend === "ok" ? "Online" : backend === "error" ? "Offline" : "..."}
            </div>
            {!apiKey && (
              <div style={{ fontSize: "11px", color: "var(--red)", marginTop: "6px" }}>
                ⚠ No API key — go to Settings
              </div>
            )}
          </div>
        </aside>

        <main className="main-content">
          {backend === "checking" && <Placeholder icon="⏳" text="Connecting to backend..." />}
          {backend === "error" && <Placeholder icon="⚠️" text="Backend offline — run python main.py in /backend" warn />}
          {backend === "ok" && (
            <>
              {tab === "speaking" && <SpeakingTab apiKey={apiKey} />}
              {tab === "settings" && <SettingsTab apiKey={apiKey} onSave={setApiKey} />}
              {(tab === "vocabulary" || tab === "grammar") && (
                <Placeholder icon="🚧" text={`${tab} tab coming in next version`} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function tabIcon(t: Tab) {
  return { speaking: "🎙", vocabulary: "🃏", grammar: "📖", settings: "⚙️" }[t];
}

function Placeholder({ icon, text, warn }: { icon: string; text: string; warn?: boolean }) {
  return (
    <div className={`placeholder ${warn ? "warn" : ""}`}>
      <div className="ph-icon">{icon}</div>
      <div className="ph-text">{text}</div>
    </div>
  );
}