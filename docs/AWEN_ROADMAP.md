# Awen — Product Roadmap & Architecture Document

**Version:** 1.1  
**Last updated:** May 2026  
**Repository:** https://github.com/etkaturan/Awen

---

## What Awen is

Awen is a desktop-first AI language tutor for German learners, built specifically around exam preparation (B2 Goethe / TestDaF). It combines speech recognition, text-to-speech, AI feedback, and structured exercises into a single native desktop application.

The core philosophy: **active production beats passive consumption**. Every feature forces the user to speak, write, listen, and recall — not just read.

---

## Current state — v1.1

### What works today

| Feature | Status | Notes |
|---|---|---|
| Speaking tab — voice mode | Partial | Recording works, STT transcription intermittent |
| Speaking tab — text mode | Working | Full AI feedback with scores |
| Topic dropdown + search | Working | 10 B2 topics including General |
| AI tutor feedback | Working | Fluency, Accuracy, Vocabulary scores |
| Edge TTS — German voices | Working | 5 voices (Katja, Conrad, Ingrid, Jonas, Leni) |
| Kokoro TTS — English voices | Working | 6 offline voices |
| Listening tab | Working | Generate, audio playback, Q&A, review |
| Vocabulary tab | Working | Flashcards, SQLite persistence, status tracking |
| Grammar tab | Working | 6 topics, reference tables, AI explain |
| Paragraph tab | Working | Upload/generate, analyze, practice, feedback |
| Settings tab | Working | API key, microphone selector, theme toggle |
| Light / Dark theme | Working | Warm light + Royal blue dark |
| VBS silent launcher | Working | Production launcher, no terminal |
| Dev bat launcher | Working | 3 terminals for debugging |
| SQLite database | Working | Vocabulary persists across sessions |
| GitHub versioning | Working | v0.1 through v1.1 tagged |

### What needs fixing

| Issue | Priority | Notes |
|---|---|---|
| Voice STT transcription | High | ffmpeg webm conversion failing intermittently |
| Microphone device selection | High | Settings selector built, needs end-to-end test |
| Health check log spam | Low | Polling too frequently in backend terminal |

---

## Session history & user progression — Architecture decision

### The problem
Right now nothing is remembered between sessions. A user can practice for weeks and have no record of their improvement, no history to review, and no way to know if they are actually getting better.

### Recommended architecture

**For the desktop app (current):** Local SQLite — no login needed.

Every session is saved automatically to `awen.db` on the user's machine. This includes:
- Session date, duration, topic, mode (voice/text)
- Average fluency, accuracy, vocabulary scores per session
- Individual exchanges (what the user said, what the AI responded)
- Vocabulary words encountered and their status changes

This means zero friction — no signup, no password, no internet required for history.

**For a future web version:** Supabase (PostgreSQL + Auth).

Each user gets an account. Their data is stored in the cloud and accessible from any device.

### What the session history enables

1. **Progress dashboard** — line chart of scores over time, per skill
2. **Weak area detection** — "You consistently score below 70% on Accuracy. Focus on grammar."
3. **Streak tracking** — daily practice streaks with visual rewards
4. **Vocabulary growth** — how many words moved from `new` → `learning` → `known`
5. **Topic history** — which topics practiced, last practiced date, best score per topic

### Examination / level assessment page

A dedicated Examination tab that simulates a real B2 speaking exam:

**Phase 1 — Monologue (2 minutes)**
- AI gives a topic card (same format as real B2 exam)
- User speaks for 2 minutes, recorded
- AI transcribes and evaluates against B2 criteria

**Phase 2 — Discussion (3 minutes)**
- AI asks follow-up questions like an examiner
- User responds, AI challenges and probes
- Full conversation recorded

**Phase 3 — Result report**
- Overall B2 readiness score (0–100%)
- Breakdown by: Grammar, Vocabulary, Fluency, Coherence, Pronunciation
- Specific weak areas with targeted exercises
- Comparison to previous exam attempts (progression)

This is the most valuable feature for exam preparation and completely differentiable from any other language app.

---

## Hosting strategy

### Recommended: Hybrid approach

**Web demo (portfolio + sharing)**
- Frontend: Vercel (free, instant)
- Backend: Railway.app (free tier, Python FastAPI)
- Users bring their own Groq key (entered in Settings)
- No Kokoro (server-side), Edge TTS works fine
- URL shareable, no install needed

**Desktop app (full features)**
- Compiled via `cargo tauri build`
- Distributed via GitHub Releases
- Windows `.exe` installer, Mac `.dmg`, Linux `.AppImage`
- Full features: Kokoro offline TTS, local SQLite, no cloud dependency

**Docker (for developers)**
- `docker compose up` starts backend + frontend
- For people who want to self-host or contribute
- No Tauri window — browser-based only

### API key management

| Approach | Verdict |
|---|---|
| User brings own Groq key | Recommended — free for users, zero cost to you |
| You host a shared key | Risky — can be abused, costs money at scale |
| Auto-generate in-app | Not possible — Groq has no key generation API |

**Best UX:** A welcome onboarding screen that appears on first launch, walks the user through getting a Groq key in 3 steps, with a direct link to console.groq.com. Takes 30 seconds.

---

## Multi-level language support

### How level adaptation works

The AI adapts **entirely through the system prompt** in `backend/services/tutor.py`. No model changes needed.

```
A1 — Beginner
  Generate simple 1-2 sentence texts. Use only present tense.
  Correct only critical errors. Explain everything in English.
  Praise heavily. Vocabulary at 500-word level.

A2 — Elementary
  Short paragraphs. Present + past tense. Basic connectors.
  Gentle corrections. Mix English and German explanations.

B1 — Intermediate
  3-4 sentence paragraphs. Modal verbs, subordinate clauses.
  Correct grammar and vocabulary. Introduce Konnektoren.
  Explain in German with English support.

B2 — Upper Intermediate (current)
  Full paragraph practice. Konjunktiv II, Passiv, Genitiv.
  Strict evaluation. B2 exam-specific tips. German explanations.

C1 — Advanced
  Complex texts. Idiomatic expressions, register variation.
  Very precise corrections. Academic and formal German.
  Evaluate coherence and sophistication.
```

This is extremely effective. The LLM understands the CEFR framework and adapts naturally. Generated texts, vocabulary suggestions, question difficulty, and feedback tone all shift appropriately.

---

## Versioning roadmap

| Version | Feature | Status |
|---|---|---|
| v0.1 | Repo scaffold, structure | Done |
| v0.2 | FastAPI + Groq backend | Done |
| v0.3 | Tauri + React shell | Done |
| v0.4 | Speaking tab, AI feedback | Done |
| v0.5 | Settings, API key persistence | Done |
| v0.6 | Vocabulary flashcards, SQLite | Done |
| v0.7 | Grammar reference, AI explain | Done |
| v0.8 | VBS launcher, dev bat | Done |
| v0.9 | Paragraph upload and practice | Done |
| v1.0 | Listening tab, Edge TTS, Kokoro | Done |
| v1.1 | UI redesign, light/dark theme, voice mode | Done |
| **v1.2** | **Fix voice STT, microphone selector** | Next |
| **v1.3** | **Session history, SQLite tracking** | Planned |
| **v1.4** | **Progress dashboard, stats charts** | Planned |
| **v1.5** | **Multi-level support (A1–C1)** | Planned |
| **v1.6** | **Examination mode, B2 simulation** | Planned |
| **v1.7** | **Web deployment (Vercel + Railway)** | Planned |
| **v1.8** | **Docker compose setup** | Planned |
| **v2.0** | **Production desktop build, GitHub Releases** | Planned |
| **v2.1** | **Onboarding screen, welcome flow** | Planned |
| **v2.2** | **OpenAI + Ollama LLM support** | Planned |
| **v2.3** | **Additional languages (French, Spanish)** | Planned |

---

## Future feature ideas (backlog)

### High impact
- **Daily challenge** — one exercise per day, completable in 5 minutes
- **Shadow mode** — AI reads a sentence, you repeat it, comparison feedback
- **Dictation mode** — AI speaks German text, you type what you hear
- **News mode** — pull current German news via RSS, auto-generate exercises
- **Exam simulation** — full timed B2 speaking exam with examiner AI

### Medium impact
- **Spaced repetition** — vocabulary and topics come back at optimal intervals
- **Mistake database** — tracks recurring errors, builds targeted exercises
- **Phrase bank** — curated B2 exam phrases organized by function
- **Book/article import** — paste any German text for custom practice

### Nice to have
- **Streak system** — daily practice streaks
- **XP and levels** — gamification layer
- **Friend challenges** — share exercises with others
- **Mobile companion** — React Native version for vocabulary on the go
- **Pronunciation scoring** — phoneme-level feedback
- **VS Code style command palette** — keyboard-first navigation

---

## Tech stack summary

| Layer | Technology | Version |
|---|---|---|
| Desktop shell | Rust + Tauri | v2.0 |
| Frontend | React + TypeScript + Vite | 18.x / 5.x |
| Backend | Python + FastAPI | 3.12 / 0.111 |
| LLM | Groq (llama-3.3-70b-versatile) | — |
| STT | Groq Whisper Large v3 Turbo | — |
| TTS German | Edge TTS | 6.x |
| TTS English | Kokoro-82M | 0.9+ |
| Audio conversion | ffmpeg + pydub | — |
| Database | SQLite | — |
| Styling | Pure CSS with CSS variables | — |

---

*Document maintained by etkaturan — update with each version release.*
