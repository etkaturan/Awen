import "./AchievementsTab.css";

const BADGES = [
  { icon: "🎙", title: "First words",      desc: "Complete your first speaking session",    earned: false },
  { icon: "🔥", title: "3-day streak",     desc: "Practice 3 days in a row",                earned: false },
  { icon: "🔥", title: "7-day streak",     desc: "Practice 7 days in a row",                earned: false },
  { icon: "⭐", title: "High scorer",      desc: "Score above 90% in any session",          earned: false },
  { icon: "🃏", title: "Word collector",   desc: "Add 25 words to your vocabulary",         earned: false },
  { icon: "🎧", title: "Good listener",    desc: "Complete 5 listening exercises",           earned: false },
  { icon: "📝", title: "First exam",       desc: "Complete your first B2 simulation exam",  earned: false },
  { icon: "💯", title: "Perfect session",  desc: "Score 100% accuracy in a session",        earned: false },
  { icon: "📚", title: "Grammar master",   desc: "Study all 6 grammar topics",              earned: false },
  { icon: "🌍", title: "Topic explorer",   desc: "Practice all 10 speaking topics",         earned: false },
  { icon: "🏆", title: "B2 ready",         desc: "Reach 80% exam readiness score",          earned: false },
  { icon: "🌟", title: "Dedicated learner","desc": "Complete 30 practice sessions",         earned: false },
];

const MILESTONES = [
  { label: "Sessions completed", current: 0, target: 10,  unit: "sessions" },
  { label: "Words learned",      current: 0, target: 50,  unit: "words" },
  { label: "Day streak",         current: 0, target: 7,   unit: "days" },
  { label: "Avg score",          current: 0, target: 80,  unit: "%" },
];

export default function AchievementsTab() {
  const earned = BADGES.filter(b => b.earned).length;

  return (
    <div className="ach-root">
      <div className="ach-scroll">

        {/* Header */}
        <div className="ach-hero">
          <div className="ach-hero-left">
            <div className="ach-title">Achievements</div>
            <div className="ach-sub">Earn badges by practicing consistently and reaching milestones</div>
          </div>
          <div className="ach-hero-count">
            <div className="ahc-val">{earned}/{BADGES.length}</div>
            <div className="ahc-label">badges earned</div>
          </div>
        </div>

        {/* Milestones */}
        <div className="ach-section-title">Milestones</div>
        <div className="ach-milestones">
          {MILESTONES.map((m, i) => (
            <div key={i} className="ach-milestone">
              <div className="am-top">
                <span className="am-label">{m.label}</span>
                <span className="am-progress">{m.current} / {m.target} {m.unit}</span>
              </div>
              <div className="am-track">
                <div className="am-fill" style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="ach-section-title">Badges</div>
        <div className="ach-badges">
          {BADGES.map((b, i) => (
            <div key={i} className={`ach-badge ${b.earned ? "earned" : "locked"}`}>
              <div className="ab-icon">{b.earned ? b.icon : "🔒"}</div>
              <div className="ab-title">{b.title}</div>
              <div className="ab-desc">{b.desc}</div>
              {b.earned && <div className="ab-earned-tag">Earned</div>}
            </div>
          ))}
        </div>

        {/* Streak */}
        <div className="ach-section-title">Weekly streak</div>
        <div className="ach-streak-card">
          <div className="asc-days">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <div key={i} className="asc-day">
                <div className="asd-dot inactive" />
                <div className="asd-label">{d}</div>
              </div>
            ))}
          </div>
          <div className="asc-info">
            Current streak: <strong>0 days</strong> — Practice today to start your streak!
          </div>
        </div>

      </div>
    </div>
  );
}