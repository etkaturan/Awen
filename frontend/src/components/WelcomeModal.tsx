import { useState } from "react";
import "./WelcomeModal.css";

interface Props {
  onComplete: (apiKey: string, theme: "light" | "dark", level: string) => void;
}

const FEATURES = [
  { icon: "🎙", title: "Speaking practice",    sub: "AI feedback on fluency & grammar" },
  { icon: "🎧", title: "Listening exercises",  sub: "Generated audio with Q&A" },
  { icon: "🃏", title: "Vocabulary",           sub: "Flashcards with spaced repetition" },
  { icon: "📝", title: "Exam simulation",      sub: "Full B2 speaking exam practice" },
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

const TIPS = [
  { icon: "🎙", text: "Hold the mic button and speak — release when done" },
  { icon: "💬", text: "Switch to Text mode if you prefer typing" },
  { icon: "🃏", text: "Add vocabulary words as you encounter them" },
  { icon: "📝", text: "Try the Examination tab when you feel ready" },
];

export default function WelcomeModal({ onComplete }: Props) {
  const [step, setStep]       = useState(0);
  const [apiKey, setApiKey]   = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | "error" | null>(null);
  const [theme, setTheme]     = useState<"light" | "dark">("light");
  const [level, setLevel]     = useState("B2");

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Say OK" }],
          api_key: apiKey.trim(),
        }),
      });
      setTestResult(res.ok ? "ok" : "error");
    } catch {
      setTestResult("error");
    }
    setTesting(false);
  };

  const handleComplete = () => {
    localStorage.setItem("awen_groq_key", apiKey.trim());
    localStorage.setItem("awen_theme", theme);
    localStorage.setItem("awen_level", level);
    localStorage.setItem("awen_onboarded", "true");
    onComplete(apiKey.trim(), theme, level);
  };

  return (
    <div className="wm-overlay">
      <div className="wm-modal">

        {/* Step dots */}
        <div className="wm-steps">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`wm-dot ${i === step ? "active" : i < step ? "done" : ""}`}
            />
          ))}
        </div>

        {/* ── Step 0: Welcome ────────────────────────────────────────── */}
        {step === 0 && (
          <div className="wm-page">
            <div className="wm-logo">A</div>
            <div className="wm-title">Welcome to Awen</div>
            <div className="wm-sub">Your AI-powered German language tutor. Built for B2 exam preparation and beyond.</div>
            <div className="wm-features">
              {FEATURES.map((f, i) => (
                <div key={i} className="wm-feature">
                  <div className="wmf-icon">{f.icon}</div>
                  <div>
                    <div className="wmf-title">{f.title}</div>
                    <div className="wmf-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="wm-btn-row">
              <div />
              <button className="wm-btn-next" onClick={() => setStep(1)}>Get started →</button>
            </div>
          </div>
        )}

        {/* ── Step 1: API Key ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="wm-page">
            <div className="wm-step-label">Step 1 of 2</div>
            <div className="wm-title">Connect your AI</div>
            <div className="wm-sub">Awen uses Groq's free API for AI responses and speech recognition. It takes 30 seconds to set up.</div>

            <div className="wm-groq-steps">
              <div className="wm-groq-step">
                <div className="wgs-num">1</div>
                <div className="wgs-text">Go to <a href="https://console.groq.com" target="_blank" rel="noreferrer">console.groq.com</a> and create a free account</div>
              </div>
              <div className="wm-groq-step">
                <div className="wgs-num">2</div>
                <div className="wgs-text">Click "API Keys" → "Create API Key" → copy it</div>
              </div>
              <div className="wm-groq-step">
                <div className="wgs-num">3</div>
                <div className="wgs-text">Paste it below — stored locally on your device only</div>
              </div>
            </div>

            <div className="wm-key-row">
              <input
                className="wm-key-input"
                type="password"
                placeholder="gsk_..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <button className="wm-test-btn" onClick={handleTest} disabled={testing || !apiKey}>
                {testing ? "Testing..." : "Test"}
              </button>
            </div>
            {testResult === "ok"    && <div className="wm-status ok">✓ Connected successfully</div>}
            {testResult === "error" && <div className="wm-status error">✗ Connection failed — check your key</div>}
            <div className="wm-key-hint">Your key is saved to your device only. We never see it.</div>

            <div className="wm-btn-row">
              <button className="wm-btn-back" onClick={() => setStep(0)}>← Back</button>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button className="wm-btn-skip" onClick={() => setStep(2)}>Skip for now</button>
                <button className="wm-btn-next" onClick={() => setStep(2)}>Save & continue →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Preferences ─────────────────────────────────────── */}
        {step === 2 && (
          <div className="wm-page">
            <div className="wm-step-label">Step 2 of 2</div>
            <div className="wm-title">Set your preferences</div>
            <div className="wm-sub">Customise Awen to your learning style. You can always change these in Settings.</div>

            <div className="wm-pref-section">
              <div className="wm-pref-label">Theme</div>
              <div className="wm-theme-cards">
                <div className={`wm-theme-card ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>
                  <div className="wtc-preview light">
                    <div className="wtc-sidebar" />
                    <div className="wtc-main" />
                  </div>
                  <div className="wtc-label">Light</div>
                </div>
                <div className={`wm-theme-card ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>
                  <div className="wtc-preview dark">
                    <div className="wtc-sidebar" />
                    <div className="wtc-main" />
                  </div>
                  <div className="wtc-label">Dark — Royal Blue</div>
                </div>
              </div>
            </div>

            <div className="wm-pref-section">
              <div className="wm-pref-label">Your German level</div>
              <div className="wm-levels">
                {LEVELS.map(l => (
                  <button
                    key={l}
                    className={`wm-level ${level === l ? "active" : ""}`}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="wm-btn-row">
              <button className="wm-btn-back" onClick={() => setStep(1)}>← Back</button>
              <button className="wm-btn-next" onClick={() => setStep(3)}>Finish setup →</button>
            </div>
          </div>
        )}

        {/* ── Step 3: Ready ───────────────────────────────────────────── */}
        {step === 3 && (
          <div className="wm-page wm-ready">
            <div className="wm-ready-icon">🎉</div>
            <div className="wm-title">You're all set!</div>
            <div className="wm-sub">Awen is ready. Here are a few tips to get the most out of your practice.</div>
            <div className="wm-tips">
              {TIPS.map((t, i) => (
                <div key={i} className="wm-tip">
                  <span className="wmt-icon">{t.icon}</span>
                  <span className="wmt-text">{t.text}</span>
                </div>
              ))}
            </div>
            <div className="wm-btn-row" style={{ justifyContent: "center" }}>
              <button className="wm-btn-next wm-btn-big" onClick={handleComplete}>
                Start practicing →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}