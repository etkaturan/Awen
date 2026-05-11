import { useState, useEffect } from "react";
import "./SettingsTab.css";

interface Props {
  apiKey: string;
  onSave: (key: string) => void;
}

export default function SettingsTab({ apiKey, onSave }: Props) {
  const [key, setKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | "error" | null>(null);

  useEffect(() => {
    setKey(apiKey);
  }, [apiKey]);

    const handleSave = () => {
    const trimmed = key.trim();
    localStorage.setItem("awen_groq_key", trimmed);
    onSave(trimmed);
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
        <div className="settings-sub">Configure your API keys and preferences.</div>

        <div className="settings-section">API Keys</div>

        <div className="field-group">
          <label className="field-label">Groq API Key</label>
          <div className="field-sub">Used for the AI tutor. Get yours at console.groq.com</div>
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
          <label className="field-label">Your Level</label>
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