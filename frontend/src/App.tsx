import { useState, useEffect } from "react";
import SpeakingTab from "./components/SpeakingTab";
import VocabularyTab from "./components/VocabularyTab";
import GrammarTab from "./components/GrammarTab";
import ListeningTab from "./components/ListeningTab";
import ParagraphTab from "./components/ParagraphTab";
import SettingsTab from "./components/SettingsTab";
import "./App.css";

type Tab = "speaking" | "listening" | "vocabulary" | "grammar" | "paragraph" | "settings";
type BackendStatus = "checking" | "ok" | "error";

const NAV = [
  { id: "speaking",   icon: "🎙", label: "Speaking" },
  { id: "listening",  icon: "🎧", label: "Listening" },
  { id: "vocabulary", icon: "🃏", label: "Vocabulary" },
  { id: "grammar",    icon: "📖", label: "Grammar" },
  { id: "paragraph",  icon: "📄", label: "Paragraph" },
] as const;

export default function App() {
  const [tab, setTab]         = useState<Tab>("speaking");
  const [backend, setBackend] = useState<BackendStatus>("checking");
  const [apiKey, setApiKey]   = useState(() => localStorage.getItem("awen_groq_key") || "");
  const [micDevice, setMicDevice] = useState(() => localStorage.getItem("awen_mic_device") || "");
  const [theme, setTheme]     = useState<"light"|"dark">(() => (localStorage.getItem("awen_theme") as "light"|"dark") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("awen_theme", theme);
  }, [theme]);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/health");
        setBackend(res.ok ? "ok" : "error");
      } catch { setBackend("error"); }
    };
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <div className="app-root">
      {/* Slim sidebar */}
      <aside className="sidebar">
        <div className="logo-mark">A</div>
        {NAV.map(n => (
          <button
            key={n.id}
            className={`nav-icon ${tab === n.id ? "active" : ""}`}
            onClick={() => setTab(n.id as Tab)}
            title={n.label}
          >
            {n.icon}
          </button>
        ))}
        <div className="sidebar-bottom">
          <button className="nav-icon" onClick={toggleTheme} title="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            className={`nav-icon ${tab === "settings" ? "active" : ""}`}
            onClick={() => setTab("settings")}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {tab === "speaking"   && <SpeakingTab   apiKey={apiKey} micDevice={micDevice} />}
        {tab === "listening"  && <ListeningTab  apiKey={apiKey} />}
        {tab === "vocabulary" && <VocabularyTab />}
        {tab === "grammar"    && <GrammarTab    apiKey={apiKey} />}
        {tab === "paragraph"  && <ParagraphTab  apiKey={apiKey} />}
        {tab === "settings"   && (
          <SettingsTab
            apiKey={apiKey}
            micDevice={micDevice}
            onSave={(key: string, mic: string) => {
              setApiKey(key);
              setMicDevice(mic);
            } } theme={"light"}          />
        )}
      </main>

      {/* Status dot — top right corner */}
      <div className={`status-dot-global ${backend}`} title={`Backend: ${backend}`} />
    </div>
  );
}