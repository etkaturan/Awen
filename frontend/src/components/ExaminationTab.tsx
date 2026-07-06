import { useState } from "react";
import "./ExaminationTab.css";

const EXAM_PHASES = [
  {
    phase: "01",
    title: "Monologue",
    duration: "2 min",
    icon: "🎙",
    desc: "You receive a topic card and speak continuously for 2 minutes. Demonstrate B2 vocabulary, grammar, and coherent argumentation.",
    tips: ["Use Konjunktiv II", "Connect ideas with Konnektoren", "Give examples and opinions"],
  },
  {
    phase: "02",
    title: "Discussion",
    duration: "3 min",
    icon: "💬",
    desc: "The AI examiner asks follow-up questions and challenges your arguments. Respond naturally and defend your position.",
    tips: ["React to questions directly", "Use 'Einerseits... Andererseits'", "Don't be afraid to disagree"],
  },
  {
    phase: "03",
    title: "Result Report",
    duration: "Instant",
    icon: "📊",
    desc: "Receive a detailed B2 readiness score across all CEFR criteria: Grammar, Vocabulary, Fluency, Coherence, and Pronunciation.",
    tips: ["Compare to previous attempts", "See your weak areas", "Get targeted exercises"],
  },
];

const CRITERIA = [
  { label: "Grammar",       icon: "📐", desc: "Correct use of B2 structures" },
  { label: "Vocabulary",    icon: "📚", desc: "Range and appropriateness" },
  { label: "Fluency",       icon: "🎙", desc: "Natural speech and pacing" },
  { label: "Coherence",     icon: "🔗", desc: "Logical structure and connectors" },
  { label: "Pronunciation", icon: "🔊", desc: "Clarity and German phonetics" },
];

export default function ExaminationTab({ apiKey }: { apiKey: string }) {
  const [ready, setReady] = useState(false);

  return (
    <div className="exam-root">
      <div className="exam-scroll">

        {/* Header */}
        <div className="exam-hero">
          <div className="exam-hero-left">
            <div className="exam-badge">B2 SIMULATION</div>
            <div className="exam-title">Speaking Examination</div>
            <div className="exam-sub">A realistic B2 Goethe-style speaking exam simulated by AI. Test your readiness before the real thing.</div>
          </div>
          <div className="exam-hero-meta">
            <div className="ehm-item"><span className="ehm-val">~5</span><span className="ehm-label">minutes</span></div>
            <div className="ehm-divider" />
            <div className="ehm-item"><span className="ehm-val">3</span><span className="ehm-label">phases</span></div>
            <div className="ehm-divider" />
            <div className="ehm-item"><span className="ehm-val">5</span><span className="ehm-label">criteria</span></div>
          </div>
        </div>

        {/* Phases */}
        <div className="exam-section-title">Exam structure</div>
        <div className="exam-phases">
          {EXAM_PHASES.map((p, i) => (
            <div key={i} className="exam-phase-card">
              <div className="epc-header">
                <div className="epc-phase">Phase {p.phase}</div>
                <div className="epc-duration">{p.duration}</div>
              </div>
              <div className="epc-title">{p.icon} {p.title}</div>
              <div className="epc-desc">{p.desc}</div>
              <div className="epc-tips">
                {p.tips.map((t, j) => (
                  <div key={j} className="epc-tip">✓ {t}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Criteria */}
        <div className="exam-section-title">Scoring criteria</div>
        <div className="exam-criteria">
          {CRITERIA.map((c, i) => (
            <div key={i} className="exam-criterion">
              <div className="ec-icon">{c.icon}</div>
              <div className="ec-label">{c.label}</div>
              <div className="ec-desc">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Previous results */}
        <div className="exam-section-title">Previous attempts</div>
        <div className="exam-no-results">
          <div className="enr-icon">📝</div>
          <div className="enr-title">No exam attempts yet</div>
          <div className="enr-sub">Take your first exam to see your B2 readiness score and track your improvement over time.</div>
        </div>

        {/* Start button */}
        {!apiKey ? (
          <div className="exam-no-key">⚠️ Set your Groq API key in Settings before taking the exam</div>
        ) : (
          <div className="exam-start-area">
            <div className="exam-start-note">
              Make sure you are in a quiet environment and your microphone is working correctly before starting.
            </div>
            <button className="exam-start-btn" onClick={() => setReady(true)}>
              {ready ? "⏳ Coming in v1.6..." : "Start Examination →"}
            </button>
            {ready && (
              <div className="exam-coming-soon">
                The examination engine is coming in v1.6. The interface and scoring system are ready — we are currently building the timed recording and AI examiner logic.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}