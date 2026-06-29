import { useState, useRef, useEffect } from "react";
import "./SpeakingTab.css";

const TOPICS = [
  { id: "general",    icon: "💬", name: "General conversation",   sub: "Free topic practice" },
  { id: "umwelt",     icon: "🌿", name: "Umwelt & Klimawandel",   sub: "Environment & Climate" },
  { id: "digital",   icon: "💻", name: "Digitalisierung",         sub: "Digitalisation & Society" },
  { id: "bildung",   icon: "🎓", name: "Bildung & Schule",        sub: "Education & School" },
  { id: "gesundheit",icon: "❤️", name: "Gesundheit",              sub: "Health & Lifestyle" },
  { id: "arbeit",    icon: "💼", name: "Arbeitswelt",             sub: "Work & Career" },
  { id: "migration", icon: "🌍", name: "Migration",               sub: "Migration & Integration" },
  { id: "medien",    icon: "📰", name: "Medien",                  sub: "Media & News" },
  { id: "wohnen",    icon: "🏙", name: "Wohnungsnot",             sub: "Housing shortage" },
  { id: "politik",   icon: "🏛", name: "Politik & Gesellschaft",  sub: "Politics & Society" },
];

interface Message {
  role: "ai" | "user";
  content: string;
  feedback?: Feedback;
}

interface Feedback { fluency: number; accuracy: number; vocabulary: number; }

function parseFeedback(text: string): Feedback {
  const get = (key: string) => {
    const m = text.match(new RegExp(`${key}[:\\s*]*([0-9]+)`, "i"));
    return m ? parseInt(m[1]) : 0;
  };
  return { fluency: get("fluency"), accuracy: get("accuracy"), vocabulary: get("vocabulary") };
}

function ScoreChip({ label, value }: { label: string; value: number }) {
  const c = value >= 80 ? "good" : value >= 60 ? "warn" : "bad";
  return <div className={`score-chip ${c}`}>{label}: {value}%</div>;
}

function ScoreBar({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="stat-row">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-val">{value ? `${value}%` : "—"}</span>
      </div>
      <div className="stat-track">
        <div className={`stat-fill ${accent ? "accent" : ""}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function SpeakingTab({ apiKey, micDevice }: { apiKey: string; micDevice: string }) {
  const [topic, setTopic]           = useState(TOPICS[0]);
  const [topicSearch, setTopicSearch] = useState("");
  const [topicOpen, setTopicOpen]   = useState(false);
  const [mode, setMode]             = useState<"voice" | "text">("voice");
  const [messages, setMessages]     = useState<Message[]>([{
    role: "ai",
    content: `Guten Tag! I am Awen, your German AI tutor. We are in free conversation mode. Hold the microphone and speak in German — I will listen, evaluate, and respond.`,
  }]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [recording, setRecording]   = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef       = useRef<HTMLAudioElement>(null);
  const chunksRef      = useRef<Blob[]>([]);
  const topicRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (topicRef.current && !topicRef.current.contains(e.target as Node)) {
        setTopicOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredTopics = TOPICS.filter(t =>
    t.name.toLowerCase().includes(topicSearch.toLowerCase()) ||
    t.sub.toLowerCase().includes(topicSearch.toLowerCase())
  );

  const selectTopic = (t: typeof TOPICS[0]) => {
    setTopic(t);
    setTopicOpen(false);
    setTopicSearch("");
    setMessages([{
      role: "ai",
      content: t.id === "general"
        ? `Guten Tag! Let's have a free German conversation. Speak about anything — I will evaluate your fluency, grammar, and vocabulary.`
        : `Let's practice "${t.name}". Speak in German about this topic and I will give you detailed feedback. Viel Erfolg!`,
    }]);
  };

  // ── TTS ──────────────────────────────────────────────────────────────────────
  const speakText = async (text: string) => {
    try {
      setAiSpeaking(true);
      const clean = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#+\s/g, "").substring(0, 500);
      const res = await fetch("http://127.0.0.1:8000/speech/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, voice_key: "de_female_1", speed: 1.0 }),
      });
      const data = await res.json();
      const blob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: "audio/mpeg" });
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(blob);
        audioRef.current.play();
        audioRef.current.onended = () => setAiSpeaking(false);
      }
    } catch { setAiSpeaking(false); }
  };

  // ── Send to AI ────────────────────────────────────────────────────────────────
  const sendText = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      }));
      history.push({ role: "user", content: `Topic: ${topic.name}\n\nMy answer: ${text}` });
      const res  = await fetch("http://127.0.0.1:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, api_key: apiKey }),
      });
      const data = await res.json();
      const feedback = parseFeedback(data.response);
      setMessages(prev => [...prev, { role: "ai", content: data.response, feedback }]);
      await speakText(data.response);
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Connection error. Is the backend running?" }]);
    }
    setLoading(false);
  };

  // ── Recording ─────────────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: micDevice
          ? { deviceId: { exact: micDevice }, sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true }
          : { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const mr = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        await transcribeAndSend(new Blob(chunksRef.current, { type: mimeType }), mimeType);
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
    } catch { alert("Microphone access denied. Please allow microphone access."); }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
      setLoading(true);
    }
  };

  const transcribeAndSend = async (blob: Blob, mimeType: string) => {
    if (!apiKey) {
      setMessages(prev => [...prev, { role: "ai", content: "No API key set. Please go to Settings." }]);
      setLoading(false);
      return;
    }
    try {
      const ext = mimeType.includes("ogg") ? "ogg" : "webm";
      const form = new FormData();
      form.append("audio", blob, `audio.${ext}`);
      form.append("api_key", apiKey);
      form.append("language", "de");
      const res  = await fetch("http://127.0.0.1:8000/speech/transcribe", { method: "POST", body: form });
      const data = await res.json();
      setLoading(false);
      if (data.text?.trim() && data.text.trim() !== ".") {
        await sendText(data.text);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "I could not hear anything clearly. Try again and speak closer to the mic." }]);
      }
    } catch {
      setLoading(false);
      setMessages(prev => [...prev, { role: "ai", content: "Transcription error. Check your API key in Settings." }]);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────────
  const scored  = messages.filter(m => m.feedback && m.feedback.fluency > 0);
  const avg     = (k: keyof Feedback) => scored.length
    ? Math.round(scored.reduce((a, m) => a + m.feedback![k], 0) / scored.length) : 0;
  const avgF    = avg("fluency");
  const avgA    = avg("accuracy");
  const avgV    = avg("vocabulary");
  const overall = avgF ? Math.round((avgF + avgA + avgV) / 3) : 0;
  const lastAi  = [...messages].reverse().find(m => m.role === "ai");
  const userMsgs = messages.filter(m => m.role === "user");

  return (
    <div className="speaking-root">

      {/* ── Center column ──────────────────────────────────────────────────── */}
      <div className="speak-main">

        {/* Header */}
        <div className="speak-header">
          <div className="speak-header-left">
            {/* Topic dropdown */}
            <div className="topic-dropdown" ref={topicRef}>
              <button className="topic-trigger" onClick={() => setTopicOpen(o => !o)}>
                <span>{topic.icon}</span>
                <span className="topic-trigger-name">{topic.name}</span>
                <span className="topic-trigger-arrow">{topicOpen ? "▲" : "▼"}</span>
              </button>
              {topicOpen && (
                <div className="topic-menu">
                  <div className="topic-search-wrap">
                    <input
                      className="topic-search"
                      placeholder="Search topics..."
                      value={topicSearch}
                      onChange={e => setTopicSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="topic-list">
                    {filteredTopics.map(t => (
                      <div
                        key={t.id}
                        className={`topic-option ${topic.id === t.id ? "active" : ""}`}
                        onClick={() => selectTopic(t)}
                      >
                        <span className="to-icon">{t.icon}</span>
                        <div className="to-text">
                          <div className="to-name">{t.name}</div>
                          <div className="to-sub">{t.sub}</div>
                        </div>
                        {topic.id === t.id && <span className="to-check">✓</span>}
                      </div>
                    ))}
                    {filteredTopics.length === 0 && (
                      <div className="topic-empty">No topics found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="speak-sub">B2 Exam Prep</div>
          </div>

          {/* Mode toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === "voice" ? "active" : ""}`}
              onClick={() => setMode("voice")}
            >
              🎤 Voice
            </button>
            <button
              className={`mode-btn ${mode === "text" ? "active" : ""}`}
              onClick={() => setMode("text")}
            >
              💬 Text
            </button>
          </div>
        </div>

        {/* ── VOICE MODE ─────────────────────────────────────────────────── */}
        {mode === "voice" && (
          <div className="voice-mode">
            <div className="bg-blob b1" />
            <div className="bg-blob b2" />

            <div className="ai-response-area">
              {lastAi && (
                <div className="ai-voice-bubble">
                  <div className={`ai-avatar-ring ${aiSpeaking ? "speaking" : ""}`}>
                    <div className="ai-avatar">A</div>
                  </div>
                  <div className="ai-voice-text">{lastAi.content}</div>
                  {lastAi.feedback && lastAi.feedback.fluency > 0 && (
                    <div className="feedback-chips">
                      <ScoreChip label="Fluency"    value={lastAi.feedback.fluency} />
                      <ScoreChip label="Accuracy"   value={lastAi.feedback.accuracy} />
                      <ScoreChip label="Vocabulary" value={lastAi.feedback.vocabulary} />
                    </div>
                  )}
                </div>
              )}
              {loading && (
                <div className="ai-voice-bubble">
                  <div className="ai-avatar-ring"><div className="ai-avatar">A</div></div>
                  <div className="typing-dots"><span /><span /><span /></div>
                </div>
              )}
            </div>

            <div className="mic-area">
              {recording && (
                <div className="recording-waves">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              )}
              <button
                className={`mic-btn ${recording ? "recording" : ""} ${loading ? "disabled" : ""}`}
                onMouseDown={startRecording} onMouseUp={stopRecording}
                onTouchStart={startRecording} onTouchEnd={stopRecording}
                disabled={loading}
              >
                {loading ? "⏳" : recording ? "🔴" : "🎤"}
              </button>
              <div className="mic-hint">
                {loading ? "Processing..." : recording ? "Release to send" : "Hold to speak"}
              </div>
            </div>
          </div>
        )}

        {/* ── TEXT MODE ──────────────────────────────────────────────────── */}
        {mode === "text" && (
          <div className="chat-mode">
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <div className="msg-avatar">{m.role === "ai" ? "A" : "U"}</div>
                  <div className="msg-body">
                    <div className="msg-bubble">{m.content}</div>
                    {m.feedback && m.feedback.fluency > 0 && (
                      <div className="feedback-chips">
                        <ScoreChip label="Fluency"    value={m.feedback.fluency} />
                        <ScoreChip label="Accuracy"   value={m.feedback.accuracy} />
                        <ScoreChip label="Vocabulary" value={m.feedback.vocabulary} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="msg ai">
                  <div className="msg-avatar">A</div>
                  <div className="msg-bubble typing-dots"><span /><span /><span /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-bar">
              <button
                className={`mic-inline ${recording ? "recording" : ""}`}
                onMouseDown={startRecording} onMouseUp={stopRecording}
                disabled={loading}
                title="Hold to speak"
              >
                {recording ? "🔴" : "🎤"}
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(input); }}}
                placeholder="Schreib auf Deutsch... (Enter to send)"
                rows={2}
              />
              <button className="send-btn" onClick={() => sendText(input)} disabled={loading || !input.trim()}>
                ➤
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="right-panel">

        {/* Overall score */}
        <div className="rp-score-box">
          <div className="rp-score-label">Overall score</div>
          <div className="rp-score-value">{overall ? `${overall}%` : "—"}</div>
          {overall > 0 && (
            <div className="rp-score-sub">
              {overall >= 80 ? "Excellent 🌟" : overall >= 65 ? "Good progress 👍" : "Keep going 💪"}
            </div>
          )}
        </div>

        <div className="rp-divider" />

        {/* Score bars */}
        <div className="rp-section">
          <div className="rp-title">Session scores</div>
          <ScoreBar label="Fluency"    value={avgF} />
          <ScoreBar label="Accuracy"   value={avgA} accent />
          <ScoreBar label="Vocabulary" value={avgV} />
        </div>

        <div className="rp-divider" />

        {/* Session info */}
        <div className="rp-section">
          <div className="rp-title">Session</div>
          <div className="rp-info-row">
            <span className="rp-info-label">Exchanges</span>
            <span className="rp-info-val">{userMsgs.length}</span>
          </div>
          <div className="rp-info-row">
            <span className="rp-info-label">Topic</span>
            <span className="rp-info-val">{topic.icon} {topic.name.split(" ")[0]}</span>
          </div>
          <div className="rp-info-row">
            <span className="rp-info-label">Mode</span>
            <span className="rp-info-val">{mode === "voice" ? "🎤 Voice" : "💬 Text"}</span>
          </div>
        </div>

        <div className="rp-divider" />

        {/* Recent answers */}
        <div className="rp-section">
          <div className="rp-title">Recent answers</div>
          {userMsgs.length === 0 && (
            <div className="rp-empty">Start speaking to see your answers here</div>
          )}
          {userMsgs.slice(-3).reverse().map((m, i) => (
            <div key={i} className="rp-answer-chip">{m.content.slice(0, 42)}{m.content.length > 42 ? "…" : ""}</div>
          ))}
        </div>

        <div className="rp-divider" />

        {/* Tips */}
        <div className="rp-section">
          <div className="rp-title">B2 tip</div>
          <div className="rp-tip">
            Use <strong>Konjunktiv II</strong> to sound more natural: "Es wäre besser, wenn..."
          </div>
        </div>
      </div>

      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}