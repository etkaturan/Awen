import { useState, useEffect } from "react";
import "./SettingsTab.css";

interface Props {
  apiKey: string;
  micDevice: string;
  theme: "light" | "dark";
  onSave: (key: string, mic: string, theme: "light" | "dark") => void;
}

export default function SettingsTab({ apiKey, micDevice, theme, onSave }: Props) {
  const [key, setKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | "error" | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState(micDevice);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">(theme);

  useEffect(() => { setKey(apiKey); }, [apiKey]);
  useEffect(() => { setSelectedMic(micDevice); }, [micDevice]);
  useEffect(() => { setSelectedTheme(theme); }, [theme]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((d) => {
      setDevices(d.filter((dev) => dev.kind === "audioinput"));
    });
  }, []);

  const handleSave = () => {
    const trimmed = key.trim();
    localStorage.setItem("awen_groq_key", trimmed);
    localStorage.setItem("awen_mic_device", selectedMic);
    localStorage.setItem("awen_theme", selectedTheme);
    onSave(trimmed, selectedMic, selectedTheme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Say OK" }],
          api_key: key.trim(),
        }),
      });
      setTestResult(res.ok ? "ok" : "error");
    } catch {
      setTestResult("error");
    }
    setTesting(false);
  };

  return (
    <div className="settings-root">
      <div className="settings-card">
        <div className="settings-title">Settings</div>
        <div className="settings-sub">Configure your API keys, microphone, and appearance.</div>

        <div className="settings-section">API Keys</div>
        <div className="field-group">
          <label className="field-label">Groq API Key</label>
          <div className="field-sub">Used for AI tutor, speech recognition, and TTS. Get yours at console.groq.com</div>
          <div className="field-row">
            <input
              type="password"
              className="field-input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="gsk_..."
            />
            <button className="btn-test" onClick={handleTest} disabled={testing || !key}>
              {testing ? "Testing..." : "Test"}
            </button>
          </div>
          {testResult === "ok" && <div className="field-status ok">✓ Connected successfully</div>}
          {testResult === "error" && <div className="field-status error">✗ Connection failed — check your key</div>}
        </div>

        <div className="settings-section">Microphone</div>
        <div className="field-group">
          <label className="field-label">Input device</label>
          <div className="field-sub">Select which microphone to use for speaking practice</div>
          <select
            className="field-input"
            value={selectedMic}
            onChange={(e) => setSelectedMic(e.target.value)}
          >
            <option value="">Default microphone</option>
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Microphone ${d.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-section">Appearance</div>
        <div className="field-group">
          <label className="field-label">Theme</label>
          <div className="field-sub">Choose your preferred color scheme</div>
          <div className="theme-picker">
            <div
              className={`theme-option ${selectedTheme === "light" ? "active" : ""}`}
              onClick={() => setSelectedTheme("light")}
            >
              <div className="theme-preview light-preview">
                <div className="tp-sidebar" />
                <div className="tp-main" />
              </div>
              <div className="theme-label">Light</div>
            </div>
            <div
              className={`theme-option ${selectedTheme === "dark" ? "active" : ""}`}
              onClick={() => setSelectedTheme("dark")}
            >
              <div className="theme-preview dark-preview">
                <div className="tp-sidebar" />
                <div className="tp-main" />
              </div>
              <div className="theme-label">Dark — Royal Blue</div>
            </div>
          </div>
        </div>

        <div className="settings-section">LLM Model</div>
        <div className="field-group">
          <label className="field-label">Model</label>
          <div className="field-sub">More models coming in future versions</div>
          <select className="field-input">
            <option value="llama-3.3-70b-versatile">Groq — llama-3.3-70b-versatile</option>
            <option disabled>OpenAI — coming soon</option>
            <option disabled>Ollama (local) — coming soon</option>
          </select>
        </div>

        <div className="settings-section">Profile</div>
        <div className="field-group">
          <label className="field-label">Your level</label>
          <select className="field-input">
            <option>B2 — Upper Intermediate</option>
            <option>B1 — Intermediate</option>
            <option>C1 — Advanced</option>
          </select>
        </div>

        <button className="btn-save" onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}