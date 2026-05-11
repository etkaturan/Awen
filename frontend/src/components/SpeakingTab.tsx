import { useState } from "react";
import "./SpeakingTab.css";

const TOPICS = [
  { id: "umwelt", icon: "🌿", name: "Umwelt & Klimawandel", sub: "Environment & Climate" },
  { id: "digital", icon: "💻", name: "Digitalisierung", sub: "Digitalisation & Society" },
  { id: "bildung", icon: "🎓", name: "Bildung & Schule", sub: "Education & School" },
  { id: "gesundheit", icon: "❤️", name: "Gesundheit", sub: "Health & Lifestyle" },
  { id: "arbeit", icon: "💼", name: "Arbeitswelt", sub: "Work & Career" },
  { id: "migration", icon: "🌍", name: "Migration", sub: "Migration & Integration" },
  { id: "medien", icon: "📰", name: "Medien", sub: "Media & News" },
];

interface Message {
  role: "ai" | "user";
  content: string;
  feedback?: Feedback;
}

interface Feedback {
  fluency: number;
  accuracy: number;
  vocabulary: number;
}

function parseFeedback(text: string): Feedback {
  const get = (key: string) => {
    const match = text.match(new RegExp(`${key}[:\\s*]*([0-9]+)`, "i"));
    return match ? parseInt(match[1]) : 0;
  };
  return {
    fluency: get("fluency"),
    accuracy: get("accuracy"),
    vocabulary: get("vocabulary"),
  };
}

export default function SpeakingTab({ apiKey }: { apiKey: string }) {
  console.log("SpeakingTab apiKey:", apiKey); // temporary debug
  const [topic, setTopic] = useState(TOPICS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `Guten Tag! I am Awen, your German AI tutor. Today we will practice "${TOPICS[0].name}". Type your answer in German and I will give you detailed feedback. Viel Erfolg!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      }));
      history.push({ role: "user", content: `Topic: ${topic.name}\n\nMy answer: ${text}` });

      const res = await fetch("http://127.0.0.1:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, api_key: apiKey }),
      });

      const data = await res.json();
      const responseText = data.response;
      const feedback = parseFeedback(responseText);

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: responseText, feedback },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Connection error. Is the backend running?" },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const switchTopic = (t: typeof TOPICS[0]) => {
    setTopic(t);
    setMessages([
      {
        role: "ai",
        content: `Great choice! Let us practice "${t.name}". Write a few sentences in German about this topic and I will evaluate your grammar, vocabulary and fluency.`,
      },
    ]);
  };

  return (
    <div className="speaking-root">
      {/* Topic list */}
      <div className="topic-pane">
        <div className="pane-header">B2 Topics</div>
        {TOPICS.map((t) => (
          <div
            key={t.id}
            className={`topic-item ${topic.id === t.id ? "active" : ""}`}
            onClick={() => switchTopic(t)}
          >
            <span className="topic-icon">{t.icon}</span>
            <div>
              <div className="topic-name">{t.name}</div>
              <div className="topic-sub">{t.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="chat-pane">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-avatar">{m.role === "ai" ? "A" : "U"}</div>
              <div className="msg-body">
                <div className="msg-bubble">{m.content}</div>
                {m.feedback && (m.feedback.fluency > 0 || m.feedback.accuracy > 0) && (
                  <div className="feedback-chips">
                    <ScoreChip label="Fluency" value={m.feedback.fluency} />
                    <ScoreChip label="Accuracy" value={m.feedback.accuracy} />
                    <ScoreChip label="Vocabulary" value={m.feedback.vocabulary} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg ai">
              <div className="msg-avatar">A</div>
              <div className="msg-bubble typing">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-bar">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Schreib auf Deutsch... (Enter to send)"
            rows={2}
          />
          <button className="send-btn" onClick={sendMessage} disabled={loading}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreChip({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "good" : value >= 60 ? "warn" : "bad";
  return (
    <div className={`score-chip ${color}`}>
      {label}: {value}%
    </div>
  );
}