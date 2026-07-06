import { useState, useEffect } from "react";
import SpeakingTab     from "./components/SpeakingTab";
import VocabularyTab   from "./components/VocabularyTab";
import GrammarTab      from "./components/GrammarTab";
import ListeningTab    from "./components/ListeningTab";
import ParagraphTab    from "./components/ParagraphTab";
import SettingsTab     from "./components/SettingsTab";
import DashboardTab    from "./components/DashboardTab";
import ProgressTab     from "./components/ProgressTab";
import HistoryTab      from "./components/HistoryTab";
import ExaminationTab  from "./components/ExaminationTab";
import AchievementsTab from "./components/AchievementsTab";
import WelcomeModal    from "./components/WelcomeModal";
import TranslatorTab from "./components/TranslatorTab";
import { useLang } from "./context/LanguageContext";
import "./App.css";

type Tab =
  | "dashboard" | "speaking" | "listening" | "vocabulary"
  | "grammar" | "paragraph" | "translator" | "progress" | "history"
  | "examination" | "achievements" | "settings";

type BackendStatus = "checking" | "ok" | "error";



export default function App() {
  const { t } = useLang();
  const PRACTICE_NAV = [
    { id: "speaking",   icon: "🎙", label: t("nav_speaking") },
    { id: "listening",  icon: "🎧", label: t("nav_listening") },
    { id: "vocabulary", icon: "🃏", label: t("nav_vocabulary") },
    { id: "grammar",    icon: "📖", label: t("nav_grammar") },
    { id: "paragraph",  icon: "📄", label: t("nav_paragraph") },
    { id: "translator", icon: "🔍", label: t("nav_translator") },
  ];

  const PERSONAL_NAV = [
    { id: "dashboard",    icon: "🏠", label: t("nav_dashboard") },
    { id: "progress",     icon: "📈", label: t("nav_progress") },
    { id: "history",      icon: "🕓", label: t("nav_history") },
    { id: "examination",  icon: "📝", label: t("nav_examination") },
    { id: "achievements", icon: "🏆", label: t("nav_achievements") },
  ];

  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem("awen_onboarded")
  );
  const [tab, setTab]             = useState<Tab>("dashboard");
  const [backend, setBackend]     = useState<BackendStatus>("checking");
  const [apiKey, setApiKey]       = useState(() => localStorage.getItem("awen_groq_key") || "");
  const [micDevice, setMicDevice] = useState(() => localStorage.getItem("awen_mic_device") || "");
  const [theme, setTheme]         = useState<"light" | "dark">(
    () => (localStorage.getItem("awen_theme") as "light" | "dark") || "light"
  );

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("awen_theme", theme);
  }, [theme]);

  // Backend health check
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
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);

  const handleWelcomeComplete = (key: string, th: "light" | "dark") => {
    setApiKey(key);
    setTheme(th);
    setShowWelcome(false);
  };

  return (
    <div className="app-root">

      {/* Welcome modal — shown on first launch */}
      {showWelcome && (
        <WelcomeModal onComplete={handleWelcomeComplete} />
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div
          className="logo-mark"
          onClick={() => setTab("dashboard")}
          style={{ cursor: "pointer" }}
          title="Dashboard"
        >
          A
        </div>

        <div className="sidebar-group-label">Practice</div>
        {PRACTICE_NAV.map(n => (
          <button
            key={n.id}
            className={`nav-icon ${tab === n.id ? "active" : ""}`}
            onClick={() => setTab(n.id as Tab)}
            title={n.label}
          >
            {n.icon}
          </button>
        ))}

        <div className="sidebar-divider" />

        <div className="sidebar-group-label">You</div>
        {PERSONAL_NAV.map(n => (
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
            <button
              className="nav-icon"
              onClick={() => setShowWelcome(true)}
              title="Setup guide"
            >
              🧭
            </button>
          <button
            className="nav-icon"
            onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            className={`nav-icon ${tab === "settings" ? "active" : ""}`}
            onClick={() => setTab("settings")}
            title="Settings"
          >
            ⚙️
          </button>
          <div className={`status-dot-global ${backend}`} title={`Backend: ${backend}`} />
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {tab === "dashboard"    && <DashboardTab   onNavigate={t => setTab(t as Tab)} apiKey={apiKey} />}
        {tab === "speaking"     && <SpeakingTab    apiKey={apiKey} micDevice={micDevice} />}
        {tab === "listening"    && <ListeningTab   apiKey={apiKey} />}
        {tab === "vocabulary"   && <VocabularyTab />}
        {tab === "grammar"      && <GrammarTab     apiKey={apiKey} />}
        {tab === "paragraph"    && <ParagraphTab   apiKey={apiKey} />}
        {tab === "progress"     && <ProgressTab />}
        {tab === "history"      && <HistoryTab />}
        {tab === "examination"  && <ExaminationTab apiKey={apiKey} />}
        {tab === "achievements" && <AchievementsTab />}
        {tab === "translator" && <TranslatorTab apiKey={apiKey} />}
        {tab === "settings"     && (
          <SettingsTab
            apiKey={apiKey}
            micDevice={micDevice}
            theme={theme}
            onSave={(key, mic, th) => {
              setApiKey(key);
              setMicDevice(mic);
              setTheme(th);
            }}
          />
        )}
      </main>

    </div>
  );
}