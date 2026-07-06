import React from "react";
import "./HistoryTab.css";

const FILTERS = ["All", "Speaking", "Listening", "Paragraph", "Examination"];

export default function HistoryTab() {
  return (
    <div className="history-root">
      <div className="history-header">
        <div className="hist-title-row">
          <div>
            <div className="hist-title">Session History</div>
            <div className="hist-sub">Review all your past practice sessions</div>
          </div>
          <div className="hist-total">0 sessions total</div>
        </div>
        <div className="hist-filters">
          {FILTERS.map((f, i) => (
            <button key={i} className={`hist-filter ${i === 0 ? "active" : ""}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="history-body">
        <div className="hist-empty">
          <div className="he-icon">🕓</div>
          <div className="he-title">No sessions yet</div>
          <div className="he-sub">Your practice sessions will appear here once you start using the app. Each session is saved automatically with your scores, topic, and duration.</div>
          <div className="he-features">
            <div className="hef-item">📊 Score breakdown per session</div>
            <div className="hef-item">💬 Full conversation review</div>
            <div className="hef-item">📅 Date and duration tracking</div>
            <div className="hef-item">🔁 Replay any session</div>
          </div>
        </div>
      </div>
    </div>
  );
}