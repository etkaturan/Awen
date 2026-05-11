import { useState } from "react";
import "./ParagraphTab.css";

type Mode = "input" | "analyze" | "practice" | "feedback";

interface Props {
  apiKey: string;
}

export default function ParagraphTab({ apiKey }: Props) {
  const [mode, setMode] = useState<Mode>("input");
  const [paragraph, setParagraph] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeParagraph = async () => {
    if (!paragraph.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/speech/analyze-paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: paragraph, api_key: apiKey }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setMode("analyze");
    } catch {
      setAnalysis("Error connecting to backend.");
    }
    setLoading(false);
  };

  const submitPractice = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/speech/practice-paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paragraph,
          user_answer: userAnswer,
          api_key: apiKey,
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setMode("feedback");
    } catch {
      setFeedback("Error connecting to backend.");
    }
    setLoading(false);
  };

  const reset = () => {
    setMode("input");
    setParagraph("");
    setUserAnswer("");
    setAnalysis("");
    setFeedback("");
  };

  return (
    <div className="para-root">
      {/* Step indicator */}
      <div className="para-steps">
        <div className={`step ${mode === "input" ? "active" : ["analyze","practice","feedback"].includes(mode) ? "done" : ""}`}>
          <span className="step-num">1</span> Paste Paragraph
        </div>
        <div className="step-line" />
        <div className={`step ${mode === "analyze" ? "active" : ["practice","feedback"].includes(mode) ? "done" : ""}`}>
          <span className="step-num">2</span> Analyze
        </div>
        <div className="step-line" />
        <div className={`step ${mode === "practice" ? "active" : mode === "feedback" ? "done" : ""}`}>
          <span className="step-num">3</span> Practice
        </div>
        <div className="step-line" />
        <div className={`step ${mode === "feedback" ? "active" : ""}`}>
          <span className="step-num">4</span> Feedback
        </div>
      </div>

      <div className="para-body">

        {/* STEP 1 — Input */}
        {mode === "input" && (
          <div className="para-card">
            <div className="para-card-title">Paste your paragraph</div>
            <div className="para-card-sub">
              Paste a German paragraph you want to study — from your notes, a textbook, or let the AI generate one for you.
            </div>
            <textarea
              className="para-textarea"
              placeholder="Paste German text here..."
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              rows={6}
            />
            <div className="para-actions">
              <button
                className="btn-secondary"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const res = await fetch("http://127.0.0.1:8000/chat/message", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        messages: [{ role: "user", content: "Generate a 3-4 sentence B2 level German paragraph about Klimawandel. Return only the German text, no explanation." }],
                        api_key: apiKey,
                      }),
                    });
                    const data = await res.json();
                    setParagraph(data.response);
                  } catch {}
                  setLoading(false);
                }}
                disabled={loading}
              >
                {loading ? "Generating..." : "✨ Generate for me"}
              </button>
              <button
                className="btn-primary"
                onClick={analyzeParagraph}
                disabled={!paragraph.trim() || loading}
              >
                {loading ? "Analyzing..." : "Analyze →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Analysis */}
        {mode === "analyze" && (
          <div className="para-card">
            <div className="para-card-title">Paragraph Analysis</div>
            <div className="original-text">{paragraph}</div>
            <div className="analysis-box">
              <div className="analysis-label">AI Analysis</div>
              <div className="analysis-text">{analysis}</div>
            </div>
            <div className="para-actions">
              <button className="btn-secondary" onClick={reset}>← Start over</button>
              <button className="btn-primary" onClick={() => setMode("practice")}>
                Practice this paragraph →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Practice */}
        {mode === "practice" && (
          <div className="para-card">
            <div className="para-card-title">Practice</div>
            <div className="para-card-sub">
              Read the paragraph above carefully, then hide it and write it from memory — or paraphrase it in your own words.
            </div>
            <div className="original-text">{paragraph}</div>
            <div className="divider">Now write your version below ↓</div>
            <textarea
              className="para-textarea"
              placeholder="Write your version here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={5}
            />
            <div className="para-actions">
              <button className="btn-secondary" onClick={() => setMode("analyze")}>← Back</button>
              <button
                className="btn-primary"
                onClick={submitPractice}
                disabled={!userAnswer.trim() || loading}
              >
                {loading ? "Evaluating..." : "Get Feedback →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Feedback */}
        {mode === "feedback" && (
          <div className="para-card">
            <div className="para-card-title">Feedback</div>
            <div className="two-col">
              <div>
                <div className="col-label">Original</div>
                <div className="original-text">{paragraph}</div>
              </div>
              <div>
                <div className="col-label">Your version</div>
                <div className="original-text user-version">{userAnswer}</div>
              </div>
            </div>
            <div className="analysis-box">
              <div className="analysis-label">AI Tutor Feedback</div>
              <div className="analysis-text">{feedback}</div>
            </div>
            <div className="para-actions">
              <button className="btn-secondary" onClick={() => { setUserAnswer(""); setMode("practice"); }}>
                Try again
              </button>
              <button className="btn-primary" onClick={reset}>New paragraph →</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}