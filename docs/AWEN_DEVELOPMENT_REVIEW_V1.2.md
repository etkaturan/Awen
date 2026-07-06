# Awen — Software Development Stage Review
## Architecture, Known Issues & Implementation Roadmap

**Document type:** Internal development review  
**Version reviewed:** v1.2  
**Date:** July 2026  
**Author:** Etka Turan  
**Repository:** https://github.com/etkaturan/Awen  
**Showcase:** https://etkaturan.github.io/Awen/

---

## 1. Project overview

Awen is a desktop-first AI language learning platform built for B2 German exam preparation, with a roadmap toward a universal multi-language learning system. It combines speech recognition, AI conversation, text-to-speech, vocabulary management, grammar reference, and listening comprehension into a single native desktop application.

The core philosophy is **active production over passive consumption** — every feature forces the learner to speak, write, listen, and recall rather than simply read or select answers.

---

## 2. Current architecture

### 2.1 Technology stack

| Layer | Technology | Version | Role |
|---|---|---|---|
| Desktop shell | Rust + Tauri | v2.0 | Native window, file system access, IPC bridge |
| Frontend | React + TypeScript + Vite | 18.x / 5.x | All UI components and state |
| Styling | Pure CSS with CSS variables | — | Design system, light/dark themes |
| Backend | Python + FastAPI | 3.12 / 0.111 | REST API, AI orchestration, audio processing |
| ASGI server | Uvicorn | 0.30 | Serves FastAPI application |
| LLM | Groq API (llama-3.3-70b-versatile) | — | AI tutor, evaluation, content generation |
| STT | Groq Whisper Large v3 Turbo | — | Speech-to-text transcription |
| TTS German | Edge TTS (Microsoft Neural) | 6.x | German voice narration, online |
| TTS English | Kokoro-82M | 0.9+ | English voice, local/offline |
| Audio conversion | ffmpeg + pydub | — | webm → mp3 for Whisper compatibility |
| Database | SQLite | — | Local vocabulary, sessions, user data |
| i18n | Custom TypeScript system | — | 9 interface languages |

### 2.2 Repository structure

```
Awen/
├── backend/                    ← Python FastAPI application
│   ├── main.py                 ← Entry point, router mounting, lifespan
│   ├── requirements.txt        ← Python dependencies
│   ├── .env                    ← API keys (gitignored)
│   ├── core/
│   │   ├── config.py           ← Pydantic settings, environment loading
│   │   └── database.py         ← SQLite connection, table initialisation
│   ├── routers/
│   │   ├── chat.py             ← /chat/message, /chat/evaluate
│   │   ├── speech.py           ← /speech/tts, /speech/transcribe, /speech/voices
│   │   │                          /speech/generate-listening, /speech/analyze-paragraph
│   │   ├── vocabulary.py       ← /vocabulary CRUD
│   │   ├── sessions.py         ← /sessions (stub — not implemented)
│   │   └── settings.py         ← /settings (stub — not implemented)
│   ├── services/
│   │   ├── tutor.py            ← System prompts, AI evaluation logic
│   │   ├── document_parser.py  ← PDF/DOCX text extraction (stub)
│   │   ├── llm/
│   │   │   ├── base.py         ← Abstract LLM interface
│   │   │   ├── groq_service.py ← Active Groq implementation
│   │   │   ├── openai_service.py ← Stub (future)
│   │   │   └── ollama_service.py ← Stub (future)
│   │   └── speech/
│   │       ├── tts.py          ← Edge TTS + Kokoro, lazy-loaded
│   │       └── stt.py          ← Whisper transcription via Groq
│   └── models/
│       ├── user.py, session.py, vocabulary.py ← Pydantic schemas
│
├── frontend/src/
│   ├── App.tsx                 ← Root layout, tab routing, theme, backend health
│   ├── index.css               ← Design tokens (CSS variables, light/dark)
│   ├── main.tsx                ← React entry, LanguageProvider wrapper
│   ├── context/
│   │   └── LanguageContext.tsx ← i18n context, app/learn language state
│   ├── i18n/
│   │   └── translations.ts     ← 9 language translations, language lists
│   └── components/
│       ├── WelcomeModal        ← 4-step onboarding
│       ├── DashboardTab        ← Home screen, quick actions, stats placeholder
│       ├── SpeakingTab         ← Voice/text practice, AI feedback, topic dropdown
│       ├── ListeningTab        ← Generated exercises, audio playback, Q&A, review
│       ├── VocabularyTab       ← Flashcards, SQLite-backed, status tracking
│       ├── GrammarTab          ← B2 reference tables, AI explain
│       ├── ParagraphTab        ← Upload/generate, analyze, practice, feedback
│       ├── TranslatorTab       ← Word lookup, meanings, synonyms, examples
│       ├── ProgressTab         ← Placeholder — awaiting session data
│       ├── HistoryTab          ← Placeholder — awaiting session data
│       ├── ExaminationTab      ← UI complete — engine not implemented
│       ├── AchievementsTab     ← UI complete — logic not implemented
│       └── SettingsTab         ← API key, microphone, theme, language selectors
│
├── src-tauri/                  ← Rust Tauri shell
├── docs/                       ← Project documentation
├── launch.vbs                  ← Silent Windows production launcher
├── launch-dev.bat              ← Development launcher (3 terminals)
└── index.html                  ← Portfolio showcase (portfolio-showcase branch only)
```

### 2.3 Data flow

```
User (mic/keyboard)
      ↓
React frontend (port 1420)
      ↓ HTTP REST
Tauri IPC bridge
      ↓
Python FastAPI (port 8000)
      ↓                    ↓
  Groq API            Edge TTS / Kokoro
  (LLM + STT)         (audio synthesis)
      ↓                    ↓
  JSON response        base64 audio
      ↓
React frontend (render + audio playback)
```

---

## 3. Current state — v1.2

### 3.1 Working features

| Feature | Status | Notes |
|---|---|---|
| Speaking tab — text mode | ✅ Working | Full AI feedback with scores |
| Speaking tab — voice mode | ⚠️ Partial | Transcription intermittent, see §4.1 |
| Topic dropdown + search | ✅ Working | 10 topics including General |
| AI tutor feedback | ✅ Working | Fluency, Accuracy, Vocabulary scores |
| Edge TTS — German voices | ✅ Working | 5 voices (Katja, Conrad, Ingrid, Jonas, Leni) |
| Kokoro TTS — English | ✅ Working | 6 voices, lazy-loaded to avoid startup crash |
| Listening tab | ✅ Working | Generate, audio, Q&A, review |
| Vocabulary flashcards | ✅ Working | SQLite persistence, status tracking |
| Grammar tab | ✅ Working | 6 B2 topics, reference tables, AI explain |
| Paragraph tab | ✅ Working | Upload/generate, analyze, practice, feedback |
| Translator tab | ✅ Working | Word breakdown, synonyms, examples, add to vocab |
| Settings tab | ✅ Working | API key, microphone, theme, language selectors |
| Light/dark theme | ✅ Working | Warm light + Royal blue dark, persisted |
| Welcome onboarding | ✅ Working | 4-step modal, shows once, re-openable |
| i18n system | ⚠️ Partial | Translations built, only wired in Translator + Speaking |
| Dashboard | ✅ UI only | Stats are placeholders, navigation works |
| Progress tab | ✅ UI only | Awaiting session data |
| History tab | ✅ UI only | Awaiting session data |
| Examination tab | ✅ UI only | Engine not implemented |
| Achievements tab | ✅ UI only | Logic not implemented |
| VBS silent launcher | ✅ Working | Production launcher |
| Dev bat launcher | ✅ Working | 3-terminal development mode |
| GitHub versioning | ✅ Working | v0.1 through v1.2 tagged |
| Portfolio showcase | ✅ Live | https://etkaturan.github.io/Awen/ |

---

## 4. Known issues and technical debt

### 4.1 Voice STT — intermittent transcription failure

**Symptom:** Microphone records audio, but transcription returns empty or only captures last syllable ("Vielen Dank" instead of full paragraph).

**Root cause analysis:**
- Browser `MediaRecorder` produces `webm/opus` container
- ffmpeg conversion `webm → mp3` sometimes fails with EBML header error
- Recording duration too short (under 1000 bytes rejected)
- Wrong microphone device selected in settings

**Attempted fixes:** Added ffmpeg subprocess conversion, lazy pydub loading, minimum byte threshold, mime type negotiation.

**Recommended next steps:**
1. Add explicit recording timer — minimum 2 seconds before stop allowed
2. Save raw webm to disk and inspect with ffprobe before conversion
3. Test with `audio/ogg` fallback if webm fails
4. Add visual waveform so user knows mic is actually capturing

**Estimated effort:** 3-4 hours in a dedicated session.

### 4.2 AI response speed

**Symptom:** 2-4 second delay between sending text/audio and receiving AI response.

**Root cause:** Groq API network latency + full response generation before streaming.

**Recommended fixes:**
1. Implement streaming response from Groq — show text word-by-word as it generates
2. Reduce max_tokens from 1024 to 600 for speaking feedback (responses are too long anyway)
3. Simplify system prompt — current prompt requests too many things at once
4. Cache TTS audio for common AI phrases ("Sehr gut!", "Versuche...")

**Estimated effort:** 2-3 hours.

### 4.3 i18n incomplete wiring

**Symptom:** Changing app language in Settings only affects Translator tab and Speaking tab mic hints. All other components show English regardless.

**Root cause:** `LanguageContext` and `t()` function are built correctly. Components simply haven't been updated to import and use `useLang()`.

**Files needing update:**
- `GrammarTab.tsx` — section titles, button labels
- `VocabularyTab.tsx` — filter labels, form placeholders
- `ListeningTab.tsx` — phase labels, button text
- `ParagraphTab.tsx` — step labels, button text
- `DashboardTab.tsx` — section headings, quick action labels
- `SettingsTab.tsx` — section labels (partially done)
- `WelcomeModal.tsx` — step titles and descriptions

**Estimated effort:** 2-3 hours mechanical work.

### 4.4 German level system not connected

**Symptom:** Level selector in Settings (A1–C1) saves the value but doesn't affect AI behavior, grammar content, or generated exercises.

**Root cause:** Level is stored in localStorage but never passed to the backend system prompt.

**Required changes:**
- `backend/services/tutor.py` — inject level into system prompt with level-specific instructions
- `backend/routers/chat.py` — accept `level` parameter in request body
- `frontend/src/components/SpeakingTab.tsx` — pass level from settings to API calls
- `frontend/src/components/GrammarTab.tsx` — filter/adapt content by level
- `frontend/src/components/ListeningTab.tsx` — pass level to generation prompt

**Estimated effort:** 2-3 hours.

### 4.5 Grammar tab — thin content

**Symptom:** Only 6 B2 topics, no content for A1/A2/B1/C1 levels.

**Required:**
- Expand to 12-15 grammar topics per level
- Each topic needs: description, B2 tip, reference table, 3 examples, common mistakes
- Content should be level-gated (A1 sees present tense, B2 sees Konjunktiv II)

**Recommended approach:** Generate content programmatically using AI, review and hardcode into component as static JSON. Better than live AI calls for reference material.

**Estimated effort:** 4-6 hours content work.

### 4.6 Session data not persisted

**Symptom:** Every app restart loses all practice session history. Dashboard and Progress tabs show no data.

**Root cause:** Session tracking backend exists in schema (`sessions` table in SQLite) but no router or service writes to it.

**Required implementation:**
- `backend/routers/sessions.py` — POST /sessions (create), GET /sessions (list), GET /sessions/{id}
- `backend/services/session_tracker.py` — auto-save after each chat exchange
- Frontend — call session API after each speaking/listening session
- `ProgressTab.tsx` — fetch and display real data
- `HistoryTab.tsx` — fetch and display session list

**Estimated effort:** 1 full session (6-8 hours).

---

## 5. Implementation roadmap

### Phase 1 — Core fixes (v1.3)
Priority: Fix what's broken before adding new features.

| Task | Effort | Impact |
|---|---|---|
| Fix voice STT transcription | 3-4h | High — core feature broken |
| AI response streaming | 2-3h | High — UX improvement |
| Complete i18n wiring | 2-3h | Medium — affects all users |
| Connect level system to prompts | 2-3h | High — core learning feature |
| Listening length + question count controls | 1-2h | Medium — user-requested |

### Phase 2 — Data layer (v1.4)
Priority: Make the app a real learning tracker.

| Task | Effort | Impact |
|---|---|---|
| Session history SQLite implementation | 6-8h | High — enables all analytics |
| Progress tab with real charts | 3-4h | High — motivation and tracking |
| History tab with session review | 3-4h | Medium |
| Dashboard real stats | 2h | Medium |
| Achievements logic | 3-4h | Low-medium |

**Local data architecture decision:**
For a desktop app, local SQLite is the correct choice. No GDPR concerns, no cloud costs, works offline, user owns their data. The schema already exists. When a web version is built, Supabase can mirror the same schema with user auth on top.

### Phase 3 — Content and curriculum (v1.5)
Priority: Make the app a real learning system, not just a practice tool.

| Task | Effort | Impact |
|---|---|---|
| Grammar content expansion (A1–C1) | 4-6h | High |
| Examination engine implementation | 6-8h | High — key differentiator |
| Daily lesson system | 4-5h | High — retention |
| Curriculum structure (A1 → B2 path) | 8-10h | Very high — transforms the app |
| Spaced repetition for vocabulary | 3-4h | High |

### Phase 4 — Platform (v2.0)
Priority: Make it accessible beyond Windows desktop.

| Task | Effort | Impact |
|---|---|---|
| Web deployment (Railway + Vercel) | 4-6h | High — portfolio + sharing |
| Docker compose setup | 2-3h | Medium — developer-friendly |
| Production desktop build (.exe) | 2-3h | High — distributable |
| OpenAI LLM support | 2-3h | Medium |
| Ollama local LLM support | 3-4h | Medium |
| Multi-language learning (French, Spanish) | 3-4h | High — market expansion |

### Phase 5 — Advanced features (v2.x backlog)
Items validated as valuable but not yet scheduled:

- Shadow mode (repeat after AI, pronunciation comparison)
- Dictation mode (type what you hear)
- News import (Deutsche Welle RSS → auto exercises)
- Conversation scenarios (restaurant, job interview, doctor)
- Error pattern detection (AI notices recurring mistakes)
- Pronunciation phoneme scoring
- Streak system and gamification
- Friend challenges and leaderboard
- Mobile companion app (React Native)

---

## 6. Architecture decisions log

| Decision | Choice | Rationale |
|---|---|---|
| Desktop shell | Tauri v2 (Rust) | Native performance, small bundle, cross-platform |
| LLM provider | Groq | Fastest inference, generous free tier, Whisper included |
| TTS German | Edge TTS | Free, unlimited, neural quality, no API key |
| TTS English | Kokoro-82M | Fully local, offline, open-weight, Apache license |
| Database | SQLite | Zero config, local, user owns data, no cloud dependency |
| i18n approach | Static TypeScript JSON | No build-time tooling needed, easy to extend |
| Level system | Prompt injection | LLM adapts naturally to CEFR levels via system prompt |
| Audio format | webm → ffmpeg → mp3 | Whisper requires specific formats; browser outputs webm |
| LLM abstraction | Abstract base class | Swap Groq → OpenAI → Ollama without changing routers |
| Kokoro loading | Lazy initialization | Prevents startup crash from transformers conflict |
| API key storage | localStorage (frontend) | Never sent to a server, user controls it |

---

## 7. Development environment

### Requirements
- Python 3.10+
- Node.js 18+
- Rust + Cargo (latest stable)
- Tauri CLI v2 (`cargo install tauri-cli --version "^2.0"`)
- ffmpeg (for audio conversion)

### Running in development
```bash
# Terminal 1 — Backend
cd backend && .venv\Scripts\activate && python main.py

# Terminal 2 — Frontend
cd frontend && npm run dev

# Terminal 3 — Tauri
cargo tauri dev
```

Or double-click `launch-dev.bat` for all three at once.

### Environment variables
```
# backend/.env
GROQ_API_KEY=gsk_...
```

### Key ports
- Backend API: `http://127.0.0.1:8000`
- Frontend dev server: `http://localhost:1420`

---

## 8. Version history

| Version | Description | Date |
|---|---|---|
| v0.1 | Repo scaffold, structure, .gitignore | May 2026 |
| v0.2 | FastAPI backend, Groq chat endpoint working | May 2026 |
| v0.3 | Tauri desktop window, React frontend connected | May 2026 |
| v0.4 | Speaking tab, AI feedback, score chips | May 2026 |
| v0.5 | Settings tab, API key persistence | May 2026 |
| v0.6 | Vocabulary flashcards, SQLite | May 2026 |
| v0.7 | Grammar reference, AI explain button | May 2026 |
| v0.8 | VBS silent launcher, dev bat | May 2026 |
| v0.9 | Paragraph upload and practice flow | May 2026 |
| v1.0 | Listening tab, Edge TTS, Kokoro | May 2026 |
| v1.1 | Full UI redesign, light/dark theme, voice mode, topic dropdown | May 2026 |
| v1.2 | Dashboard, Progress, History, Examination, Achievements, Welcome modal, Translator, i18n, portfolio showcase | July 2026 |

---

## 9. Portfolio notes

This project demonstrates proficiency in:

- **Full-stack desktop development** — Rust + React + Python in a single cohesive app
- **AI integration** — LLM orchestration, STT, TTS pipelines, prompt engineering
- **Component architecture** — modular, reusable, independently debuggable components
- **Database design** — SQLite schema design with migration-ready structure
- **i18n system design** — extensible translation architecture supporting 9 languages
- **API design** — RESTful FastAPI with proper separation of concerns (routers / services / models)
- **DevOps basics** — GitHub versioning, branch strategy, GitHub Pages deployment
- **UI/UX design** — custom design system with CSS variables, light/dark themes, responsive layout
- **Audio engineering** — real-time recording, format conversion, streaming TTS playback

**Live showcase:** https://etkaturan.github.io/Awen/  
**Repository:** https://github.com/etkaturan/Awen

---

*Document maintained by Etka Turan — update with each major version release.*
