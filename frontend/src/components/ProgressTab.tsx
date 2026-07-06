import "./ProgressTab.css";

const MOCK_WEEKS = [
  { week: "Week 1", fluency: 0, accuracy: 0, vocabulary: 0 },
  { week: "Week 2", fluency: 0, accuracy: 0, vocabulary: 0 },
  { week: "Week 3", fluency: 0, accuracy: 0, vocabulary: 0 },
  { week: "Week 4", fluency: 0, accuracy: 0, vocabulary: 0 },
];

const SKILLS = [
  { label: "Fluency",    value: 0, icon: "🎙", desc: "How naturally you speak" },
  { label: "Accuracy",   value: 0, icon: "✅", desc: "Grammar correctness" },
  { label: "Vocabulary", value: 0, icon: "📚", desc: "Word range and richness" },
  { label: "Listening",  value: 0, icon: "🎧", desc: "Comprehension accuracy" },
];

export default function ProgressTab() {
  return (
    <div className="progress-root">
      <div className="progress-scroll">

        <div className="prog-header">
          <div className="prog-title">Your Progress</div>
          <div className="prog-sub">Track your improvement over time across all skills</div>
        </div>

        {/* Skill radar */}
        <div className="prog-skills-grid">
          {SKILLS.map((s, i) => (
            <div key={i} className="prog-skill-card">
              <div className="psc-top">
                <span className="psc-icon">{s.icon}</span>
                <span className="psc-label">{s.label}</span>
                <span className="psc-val">{s.value ? `${s.value}%` : "—"}</span>
              </div>
              <div className="psc-bar-track">
                <div className="psc-bar-fill" style={{ width: `${s.value}%` }} />
              </div>
              <div className="psc-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="prog-section-title">Score history</div>
        <div className="prog-chart-card">
          <div className="prog-chart-empty">
            <div className="pce-icon">📈</div>
            <div className="pce-title">No data yet</div>
            <div className="pce-sub">Complete practice sessions to see your score history chart here</div>
          </div>
          {/* Chart labels */}
          <div className="prog-chart-weeks">
            {MOCK_WEEKS.map((w, i) => (
              <div key={i} className="pcw-label">{w.week}</div>
            ))}
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="prog-section-title">Topic performance</div>
        <div className="prog-topics">
          {["Umwelt", "Digitalisierung", "Bildung", "Gesundheit", "Arbeitswelt", "Migration", "Medien"].map((t, i) => (
            <div key={i} className="prog-topic-row">
              <div className="ptr-name">{t}</div>
              <div className="ptr-bar-wrap">
                <div className="ptr-bar" style={{ width: "0%" }} />
              </div>
              <div className="ptr-val">—</div>
              <div className="ptr-sessions">0 sessions</div>
            </div>
          ))}
        </div>

        {/* Level assessment */}
        <div className="prog-section-title">Level assessment</div>
        <div className="prog-level-card">
          <div className="plc-left">
            <div className="plc-level">B2</div>
            <div className="plc-label">Current level</div>
          </div>
          <div className="plc-right">
            <div className="plc-readiness-label">Exam readiness</div>
            <div className="plc-readiness-val">—</div>
            <div className="plc-readiness-sub">Complete sessions to calculate readiness</div>
          </div>
        </div>

      </div>
    </div>
  );
}