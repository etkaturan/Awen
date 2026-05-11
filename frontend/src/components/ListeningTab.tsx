import { useState, useEffect, useRef } from "react";
import "./ListeningTab.css";

const TOPICS = [
  "Klimawandel und Umweltschutz",
  "Digitalisierung und Gesellschaft",
  "Bildung und Schulsystem",
  "Gesundheit und Lebensstil",
  "Arbeitswelt und Homeoffice",
  "Migration und Integration",
  "Medien und Fake News",
  "Wohnungsnot in Städten",
];

interface Question {
  question: string;
  answer: string;
}

interface VocabItem {
  de: string;
  en: string;
}

interface ListeningExercise {
  text: string;
  questions: Question[];
  vocabulary: VocabItem[];
}

interface Voice {
  key: string;
  label: string;
  lang: string;
  engine: string;
}

type Phase = "setup" | "loading" | "listening" | "answering" | "review";

interface Props {
  apiKey: string;
}

export default function ListeningTab({ apiKey }: Props) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("B2");
  const [exercise, setExercise] = useState<ListeningExercise | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("de_female_1");
  const [speed, setSpeed] = useState(1.0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showText, setShowText] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/speech/voices")
      .then((r) => r.json())
      .then(setVoices)
      .catch(console.error);
  }, []);

  const generateExercise = async () => {
    setPhase("loading");
    setShowText(false);
    setAudioUrl(null);
    setScores([]);
    const t = customTopic.trim() || topic;
    try {
      const res = await fetch("http://127.0.0.1:8000/speech/generate-listening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t, difficulty, api_key: apiKey }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExercise(data);
      setUserAnswers(new Array(data.questions.length).fill(""));
      await generateAudio(data.text);
      setPhase("listening");
    } catch (e) {
      console.error(e);
      setPhase("setup");
    }
  };

  const generateAudio = async (text: string) => {
    setLoadingAudio(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/speech/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice_key: selectedVoice, speed }),
      });
      const data = await res.json();
      const mime = data.format === "wav" ? "audio/wav" : "audio/mpeg";
      const blob = new Blob(
        [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
        { type: mime }
      );
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    }
    setLoadingAudio(false);
  };

  const submitAnswers = () => {
    if (!exercise) return;
    const sc = exercise.questions.map((q, i) => {
      const ua = userAnswers[i].trim().toLowerCase();
      const ca = q.answer.toLowerCase();
      const words = ca.split(" ").filter((w) => w.length > 3);
      const matches = words.filter((w) => ua.includes(w)).length;
      return words.length > 0 ? Math.round((matches / words.length) * 100) : 0;
    });
    setScores(sc);
    setPhase("review");
    setShowText(true);
  };

  const reset = () => {
    setPhase("setup");
    setExercise(null);
    setAudioUrl(null);
    setUserAnswers([]);
    setScores([]);
    setShowText(false);
  };

  const deVoices = voices.filter((v) => v.lang === "de");
  const enVoices = voices.filter((v) => v.lang === "en");

  return (
    <div className="listening-root">

      {/* ── Phase indicator ── */}
      <div className="listening-phases">
        {(["setup", "listening", "answering", "review"] as Phase[]).map((p, i) => (
          <div key={p} className={`lphase ${phase === p ? "active" : ["listening","answering","review"].indexOf(phase) > ["setup","listening","answering","review"].indexOf(p) - 1 && phase !== "setup" && i < ["setup","listening","answering","review"].indexOf(phase) ? "done" : ""}`}>
            <span className="lphase-num">{i + 1}</span>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </div>
        ))}
      </div>

      <div className="listening-body">

        {/* ── SETUP ── */}
        {phase === "setup" && (
          <div className="listening-card">
            <div className="lcard-title">Listening Exercise</div>
            <div className="lcard-sub">The AI will generate a German text, read it aloud, then you answer questions without seeing the text.</div>

            <div className="lfield">
              <label className="lfield-label">Topic</label>
              <select className="lfield-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="lfield">
              <label className="lfield-label">Or enter your own topic</label>
              <input className="lfield-input" placeholder="e.g. Öffentlicher Nahverkehr..." value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} />
            </div>

            <div className="lfield-row">
              <div className="lfield" style={{ flex: 1 }}>
                <label className="lfield-label">Difficulty</label>
                <select className="lfield-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option>A2</option><option>B1</option><option>B2</option><option>C1</option>
                </select>
              </div>
              <div className="lfield" style={{ flex: 1 }}>
                <label className="lfield-label">Speed</label>
                <select className="lfield-input" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}>
                  <option value={0.7}>0.7x — Slow</option>
                  <option value={0.85}>0.85x — Relaxed</option>
                  <option value={1.0}>1.0x — Normal</option>
                  <option value={1.15}>1.15x — Fast</option>
                  <option value={1.3}>1.3x — Challenge</option>
                </select>
              </div>
            </div>

            <div className="lfield">
              <label className="lfield-label">German narrator voice</label>
              <div className="voice-grid">
                {deVoices.map((v) => (
                  <div key={v.key} className={`voice-chip ${selectedVoice === v.key ? "active" : ""}`} onClick={() => setSelectedVoice(v.key)}>
                    <span className="vc-engine">{v.engine}</span>
                    <span className="vc-label">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-generate" onClick={generateExercise} disabled={!apiKey}>
              {!apiKey ? "⚠ Set API key in Settings first" : "Generate & Listen →"}
            </button>
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className="listening-card center">
            <div className="loading-spinner" />
            <div className="lcard-title">Generating exercise...</div>
            <div className="lcard-sub">AI is writing the text and preparing audio</div>
          </div>
        )}

        {/* ── LISTENING ── */}
        {phase === "listening" && exercise && (
          <div className="listening-card">
            <div className="lcard-title">Listen carefully</div>
            <div className="lcard-sub">Play the audio as many times as you need. The text is hidden. When ready, move to questions.</div>

            <div className="audio-player">
              {loadingAudio ? (
                <div className="audio-loading">Preparing audio...</div>
              ) : audioUrl ? (
                <>
                  <audio ref={audioRef} controls src={audioUrl} className="audio-el" />
                  <div className="audio-meta">
                    <span>{voices.find((v) => v.key === selectedVoice)?.label}</span>
                    <span>{speed}x speed</span>
                  </div>
                </>
              ) : (
                <div className="audio-loading">Audio unavailable</div>
              )}
            </div>

            <div className="vocab-preview">
              <div className="vp-label">Key vocabulary (visible during listening)</div>
              <div className="vp-chips">
                {exercise.vocabulary.map((v, i) => (
                  <div key={i} className="vp-chip">
                    <span className="vp-de">{v.de}</span>
                    <span className="vp-en">{v.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lactions">
              <button className="btn-secondary" onClick={reset}>← Start over</button>
              <button className="btn-primary" onClick={() => setPhase("answering")}>
                Ready to answer →
              </button>
            </div>
          </div>
        )}

        {/* ── ANSWERING ── */}
        {phase === "answering" && exercise && (
          <div className="listening-card">
            <div className="lcard-title">Answer the questions</div>
            <div className="lcard-sub">Answer in English. The text is still hidden.</div>

            <div className="questions-list">
              {exercise.questions.map((q, i) => (
                <div key={i} className="question-item">
                  <div className="q-num">Q{i + 1}</div>
                  <div className="q-body">
                    <div className="q-text">{q.question}</div>
                    <textarea
                      className="q-input"
                      placeholder="Your answer..."
                      value={userAnswers[i]}
                      onChange={(e) => {
                        const next = [...userAnswers];
                        next[i] = e.target.value;
                        setUserAnswers(next);
                      }}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="lactions">
              <button className="btn-secondary" onClick={() => setPhase("listening")}>← Listen again</button>
              <button className="btn-primary" onClick={submitAnswers}>
                Submit & Review →
              </button>
            </div>
          </div>
        )}

        {/* ── REVIEW ── */}
        {phase === "review" && exercise && (
          <div className="listening-card">
            <div className="lcard-title">Review</div>

            {/* Score summary */}
            <div className="score-summary">
              <div className="ss-label">Your score</div>
              <div className="ss-value">
                {scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0}%
              </div>
            </div>

            {/* Full text revealed */}
            <div className="revealed-text">
              <div className="rt-label">📄 Full text (now revealed)</div>
              <div className="rt-content">{exercise.text}</div>
            </div>

            {/* Q&A review */}
            <div className="qa-review">
              {exercise.questions.map((q, i) => (
                <div key={i} className={`qa-item ${scores[i] >= 60 ? "correct" : "incorrect"}`}>
                  <div className="qa-q">{q.question}</div>
                  <div className="qa-row">
                    <div className="qa-col">
                      <div className="qa-col-label">Your answer</div>
                      <div className="qa-answer user">{userAnswers[i] || "—"}</div>
                    </div>
                    <div className="qa-col">
                      <div className="qa-col-label">Correct answer</div>
                      <div className="qa-answer correct-ans">{q.answer}</div>
                    </div>
                  </div>
                  <div className={`qa-score ${scores[i] >= 60 ? "good" : "bad"}`}>
                    {scores[i]}%
                  </div>
                </div>
              ))}
            </div>

            {/* Vocab review */}
            <div className="vocab-review">
              <div className="vr-label">Vocabulary from this exercise</div>
              <div className="vp-chips">
                {exercise.vocabulary.map((v, i) => (
                  <div key={i} className="vp-chip">
                    <span className="vp-de">{v.de}</span>
                    <span className="vp-en">{v.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lactions">
              <button className="btn-secondary" onClick={reset}>New exercise</button>
              <button className="btn-primary" onClick={() => { setPhase("listening"); setShowText(false); }}>
                Listen again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}