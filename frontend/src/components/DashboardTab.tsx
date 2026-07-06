import "./DashboardTab.css";

interface Props {
  onNavigate: (tab: string) => void;
  apiKey: string;
}

const QUICK_ACTIONS = [
  { icon: "🎙", label: "Start speaking", sub: "Practice with AI tutor", tab: "speaking", color: "gold" },
  { icon: "🎧", label: "Listening exercise", sub: "Generate and listen", tab: "listening", color: "blue" },
  { icon: "🃏", label: "Vocabulary", sub: "Review flashcards", tab: "vocabulary", color: "green" },
  { icon: "📝", label: "Take exam", sub: "Test your level", tab: "examination", color: "red" },
];

const STATS = [
  { label: "Sessions", value: "0", sub: "total" },
  { label: "Avg score", value: "—", sub: "overall" },
  { label: "Words learned", value: "0", sub: "vocabulary" },
  { label: "Day streak", value: "0", sub: "days" },
];

const TIPS = [
  "Use Konjunktiv II to sound more natural: \"Es wäre besser, wenn...\"",
  "Vary your connectors — try 'deshalb', 'daher', 'folglich' instead of 'weil'",
  "The Genitiv case: 'wegen des Wetters', 'trotz der Schwierigkeiten'",
  "B2 tip: Use 'obwohl' + verb-at-end for contrast in speaking",
  "Practice the Passiv: 'Das Gesetz wird von der Regierung geändert'",
];

export default function DashboardTab({ onNavigate, apiKey }: Props) {
  const tip = TIPS[new Date().getDay() % TIPS.length];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 17 ? "Guten Tag" : "Guten Abend";

  return (
    <div className="dashboard-root">
      <div className="dashboard-scroll">

        {/* Hero greeting */}
        <div className="dash-hero">
          <div className="dash-hero-left">
            <div className="dash-greeting">{greeting} 👋</div>
            <div className="dash-tagline">Ready to practice your German today?</div>
            {!apiKey && (
              <div className="dash-warning" onClick={() => onNavigate("settings")}>
                ⚠️ No API key set — click to go to Settings
              </div>
            )}
          </div>
          <div className="dash-hero-badge">
            <div className="dhb-level">B2</div>
            <div className="dhb-label">Current level</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="dash-stats">
          {STATS.map((s, i) => (
            <div key={i} className="dash-stat-card">
              <div className="dsc-value">{s.value}</div>
              <div className="dsc-label">{s.label}</div>
              <div className="dsc-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="dash-section-title">Quick start</div>
        <div className="dash-actions">
          {QUICK_ACTIONS.map((a, i) => (
            <div key={i} className={`dash-action-card color-${a.color}`} onClick={() => onNavigate(a.tab)}>
              <div className="dac-icon">{a.icon}</div>
              <div className="dac-label">{a.label}</div>
              <div className="dac-sub">{a.sub}</div>
              <div className="dac-arrow">→</div>
            </div>
          ))}
        </div>

        {/* Daily tip */}
        <div className="dash-section-title">Daily tip</div>
        <div className="dash-tip">
          <div className="dt-icon">💡</div>
          <div className="dt-text">{tip}</div>
        </div>

        {/* Recent activity placeholder */}
        <div className="dash-section-title">Recent activity</div>
        <div className="dash-empty-state">
          <div className="des-icon">📊</div>
          <div className="des-title">No sessions yet</div>
          <div className="des-sub">Start practicing to see your activity here</div>
          <button className="des-btn" onClick={() => onNavigate("speaking")}>
            Start first session →
          </button>
        </div>

        {/* Navigation cards */}
        <div className="dash-section-title">Explore</div>
        <div className="dash-nav-grid">
          {[
            { icon: "📈", label: "Progress", sub: "Track your improvement", tab: "progress" },
            { icon: "🕓", label: "History", sub: "Review past sessions", tab: "history" },
            { icon: "🏆", label: "Achievements", sub: "Badges and milestones", tab: "achievements" },
            { icon: "📖", label: "Grammar", sub: "B2 reference tables", tab: "grammar" },
          ].map((n, i) => (
            <div key={i} className="dash-nav-card" onClick={() => onNavigate(n.tab)}>
              <div className="dnc-icon">{n.icon}</div>
              <div className="dnc-label">{n.label}</div>
              <div className="dnc-sub">{n.sub}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}