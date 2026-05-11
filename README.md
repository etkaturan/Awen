# Awen — German AI Tutor Desktop App

A full-stack desktop application for learning German, built for B2 exam preparation. Awen combines AI-powered conversation, speech synthesis, listening comprehension, vocabulary management, and grammar reference into a single native desktop experience.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Components](#components)
- [API Reference](#api-reference)
- [Setup & Installation](#setup--installation)
- [Launching the App](#launching-the-app)
- [Versioning](#versioning)
- [Roadmap](#roadmap)

---

## Overview

Awen is designed around a single principle: learning a language requires active practice, not passive reading. Every feature is built to make the user produce German — speaking it, writing it, listening to it, and recalling it from memory.

The AI tutor evaluates every attempt in real time, giving structured feedback on fluency, accuracy, and vocabulary with specific corrections and B2-level tips.

---

## Architecture



┌─────────────────────────────────────────┐
│           Frontend — React + Vite        │
│  Speaking │ Listening │ Vocabulary       │
│  Grammar  │ Paragraph │ Settings         │
└──────────────────┬──────────────────────┘
│ HTTP REST (localhost:1420)
┌──────────────────▼──────────────────────┐
│         Rust Shell — Tauri v2            │
│  Native window · IPC bridge              │
│  Spawns Python backend on launch         │
└──────────────────┬──────────────────────┘
│ HTTP REST (localhost:8000)
┌──────────────────▼──────────────────────┐
│        Python Backend — FastAPI          │
│                                          │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │   LLM   │  │   TTS    │  │  DB    │ │
│  │ Service │  │ Service  │  │SQLite  │ │
│  └────┬────┘  └────┬─────┘  └────────┘ │
│       │            │                    │
│  ┌────▼────┐  ┌────▼──────────────┐    │
│  │  Groq   │  │ Edge TTS (German) │    │
│  │  API    │  │ Kokoro (English)  │    │
│  └─────────┘  └───────────────────┘    │
└─────────────────────────────────────────┘


### Data Flow

1. User interacts with React frontend (Tauri webview)
2. Frontend sends HTTP requests to Python backend on port 8000
3. Backend routes requests to the appropriate service (LLM, TTS, DB)
4. LLM service calls Groq API with structured prompts
5. TTS service synthesizes audio via Edge TTS or Kokoro locally
6. Response returns as JSON with audio as base64-encoded string
7. Frontend decodes and plays audio, renders feedback

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Desktop shell | Rust + Tauri | v2.0 | Native window, file system, IPC |
| Frontend | React + TypeScript | 18.x | UI components and state |
| Frontend build | Vite | 5.x | Dev server and bundler |
| Backend | Python + FastAPI | 3.12 / 0.111 | REST API, business logic |
| ASGI server | Uvicorn | 0.30 | Serves FastAPI application |
| LLM | Groq API | — | llama-3.3-70b-versatile |
| TTS German | Edge TTS | 6.x | Microsoft neural voices, free, online |
| TTS English | Kokoro-82M | 0.9+ | Open-weight local model, offline |
| Database | SQLite | — | Vocabulary, sessions, user data |
| State management | Zustand | — | Frontend global state |
| Launcher | VBScript + BAT | — | Windows quick-launch scripts |

---

## Project Structure


Awen/
│
├── backend/                        ← Python FastAPI application
│   ├── main.py                     ← App entry point, mounts all routers
│   ├── requirements.txt            ← Python dependencies
│   ├── .env                        ← API keys (not committed)
│   ├── .env.example                ← Template for environment setup
│   │
│   ├── core/
│   │   ├── config.py               ← Pydantic settings, loads .env
│   │   └── database.py             ← SQLite connection, table init
│   │
│   ├── routers/
│   │   ├── chat.py                 ← POST /chat/message, POST /chat/evaluate
│   │   ├── speech.py               ← POST /speech/tts, GET /speech/voices
│   │   │                             POST /speech/generate-listening
│   │   │                             POST /speech/analyze-paragraph
│   │   │                             POST /speech/practice-paragraph
│   │   ├── vocabulary.py           ← GET/POST /vocabulary, PATCH/DELETE /vocabulary/{id}
│   │   ├── sessions.py             ← Session history (v1.2)
│   │   └── settings.py             ← User settings (v1.3)
│   │
│   ├── services/
│   │   ├── tutor.py                ← System prompts, evaluate_speaking, tutor_chat
│   │   ├── document_parser.py      ← PDF/DOCX text extraction
│   │   │
│   │   ├── llm/
│   │   │   ├── base.py             ← Abstract BaseLLM interface
│   │   │   ├── groq_service.py     ← Groq implementation (active)
│   │   │   ├── openai_service.py   ← OpenAI stub (future)
│   │   │   └── ollama_service.py   ← Ollama local stub (future)
│   │   │
│   │   └── speech/
│   │       ├── tts.py              ← Edge TTS + Kokoro synthesis, voice registry
│   │       └── stt.py              ← Speech-to-text (Whisper, v1.1)
│   │
│   └── models/
│       ├── user.py                 ← User schema
│       ├── session.py              ← Session schema
│       └── vocabulary.py           ← Vocabulary schema
│
├── frontend/                       ← React + Vite + TypeScript
│   ├── index.html                  ← HTML entry point, Google Fonts
│   ├── vite.config.ts              ← Vite config, port 1420
│   ├── tsconfig.json               ← TypeScript config
│   ├── package.json                ← Node dependencies
│   │
│   └── src/
│       ├── main.tsx                ← React entry, mounts App
│       ├── App.tsx                 ← Root layout, tab routing, backend health check
│       ├── index.css               ← Global CSS variables and resets
│       ├── App.css                 ← Layout styles (topbar, sidebar, main)
│       │
│       └── components/
│           ├── SpeakingTab.tsx     ← Topic selector, AI chat, feedback chips
│           ├── SpeakingTab.css
│           ├── ListeningTab.tsx    ← Exercise generator, audio player, Q&A, review
│           ├── ListeningTab.css
│           ├── VocabularyTab.tsx   ← Flashcards, add/delete, status tracking
│           ├── VocabularyTab.css
│           ├── GrammarTab.tsx      ← Reference tables, AI explain button
│           ├── GrammarTab.css
│           ├── ParagraphTab.tsx    ← Upload/generate, analyze, practice, feedback
│           ├── ParagraphTab.css
│           ├── SettingsTab.tsx     ← API key input, test, save, model selector
│           └── SettingsTab.css
│
├── src-tauri/                      ← Rust Tauri shell
│   ├── src/
│   │   ├── main.rs                 ← App entry point
│   │   └── lib.rs                  ← Tauri builder, window config
│   ├── tauri.conf.json             ← Window size, CSP, bundle config
│   ├── Cargo.toml                  ← Rust dependencies
│   └── icons/                      ← App icons (PNG, ICO, ICNS)
│
├── launch.vbs                      ← Silent Windows launcher (production)
├── launch-dev.bat                  ← Dev launcher, opens 3 terminals
├── .gitignore                      ← Excludes .venv, node_modules, pycache, .db
└── README.md                       ← This file


---

## Components

### Speaking Tab
The core practice feature. Presents B2 exam topics, maintains a conversation history, and sends the user's German text to the AI tutor for evaluation. The tutor returns structured feedback including fluency, accuracy, and vocabulary scores (each 0–100), specific error corrections, and one B2-level improvement tip per response. Scores are parsed from the AI response with regex and displayed as color-coded chips (green ≥80, amber ≥60, red <60).

### Listening Tab
Generates a German listening exercise on a chosen topic and difficulty level. The flow has four phases:
1. **Setup** — choose topic, difficulty (A2–C1), narrator voice, and playback speed
2. **Listening** — AI generates a 3–4 sentence German paragraph, synthesizes audio via Edge TTS, player is shown, text is hidden, key vocabulary is visible
3. **Answering** — questions are shown in English, user answers without seeing the text
4. **Review** — full text revealed, answers compared to correct answers, score calculated per question, vocabulary listed

### Vocabulary Tab
SQLite-backed flashcard system. Words have three states: `new`, `learning`, `known` indicated by colored dots. Cards flip on click to reveal the English translation. Status buttons update the word's state via PATCH request. Words persist across sessions.

### Grammar Tab
Static reference content for six B2 grammar topics: Cases, Konjunktiv II, Konnektoren, Passiv, Wortstellung, and Genitiv. Each topic has a description, B2 exam tip, reference table, and example sentences. An "Ask AI tutor" button calls the backend to generate personalized tips and common mistakes for the selected topic.

### Paragraph Tab
Four-step practice flow: paste or AI-generate a German paragraph → AI analyzes vocabulary and grammar structures → user writes their version from memory → AI compares both versions and gives detailed feedback with scores.

### Settings Tab
API key management. Users enter their Groq API key, test it against the live backend, and save it to `localStorage`. The key persists across sessions and is passed with every API request. Includes model selector (Groq active, OpenAI and Ollama stubbed for future).

---

## API Reference

### Backend base URL
`http://127.0.0.1:8000`

### Endpoints

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/health` | — | `{status, version}` |
| POST | `/chat/message` | `{messages, api_key}` | `{response}` |
| POST | `/chat/evaluate` | `{text, topic, api_key}` | `{feedback, raw}` |
| GET | `/speech/voices` | — | `[{key, label, lang, engine}]` |
| POST | `/speech/tts` | `{text, voice_key, speed}` | `{audio (base64), format}` |
| POST | `/speech/generate-listening` | `{topic, difficulty, api_key}` | `{text, questions, vocabulary}` |
| POST | `/speech/analyze-paragraph` | `{text, api_key}` | `{analysis}` |
| POST | `/speech/practice-paragraph` | `{paragraph, user_answer, api_key}` | `{feedback}` |
| GET | `/vocabulary/` | — | `[{id, word_de, word_en, article, status}]` |
| POST | `/vocabulary/` | `{word_de, word_en, article}` | `{ok}` |
| PATCH | `/vocabulary/{id}` | `{status}` | `{ok}` |
| DELETE | `/vocabulary/{id}` | — | `{ok}` |

### TTS Voices

**Edge TTS — German (online, Microsoft neural)**
| Key | Voice | Accent |
|---|---|---|
| `de_female_1` | Katja | Germany |
| `de_male_1` | Conrad | Germany |
| `de_female_2` | Ingrid | Austria |
| `de_male_2` | Jonas | Austria |
| `de_female_3` | Leni | Switzerland |

**Edge TTS — English (online, Microsoft neural)**
| Key | Voice | Accent |
|---|---|---|
| `en_female_1` | Jenny | US |
| `en_male_1` | Guy | US |
| `en_female_2` | Sonia | GB |
| `en_male_2` | Ryan | GB |

**Kokoro — English (local, offline, open-weight)**
| Key | Voice | Style |
|---|---|---|
| `kokoro_af_heart` | Heart | Female, warm |
| `kokoro_af_bella` | Bella | Female, clear |
| `kokoro_am_adam` | Adam | Male, neutral |
| `kokoro_am_michael` | Michael | Male, deep |
| `kokoro_bf_emma` | Emma | GB Female |
| `kokoro_bm_george` | George | GB Male |

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Rust + Cargo
- Tauri CLI v2 (`cargo install tauri-cli --version "^2.0"`)

### 1. Clone

```bash
git clone https://github.com/etkaturan/Awen.git
cd Awen
```

### 2. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:



GROQ_API_KEY=your_key_here


### 3. Frontend

```bash
cd frontend
npm install
```

### 4. Get a Groq API Key

Go to [console.groq.com](https://console.groq.com), create a free account, generate an API key. Paste it in `backend/.env` or enter it in the app's Settings tab.

---

## Launching the App

### Development (recommended)

Double-click `launch-dev.bat` — opens three terminals:
- Terminal 1: Python backend on port 8000
- Terminal 2: Vite dev server on port 1420
- Terminal 3: Tauri desktop window

### Production (after `cargo tauri build`)

Double-click `launch.vbs` — silently starts backend, launches compiled `.exe`.

### Manual

```bash
# Terminal 1
cd backend && .venv\Scripts\activate && python main.py

# Terminal 2
cd frontend && npm run dev

# Terminal 3
cargo tauri dev
```

---

## Versioning

| Version | Description |
|---|---|
| v0.1 | Repo scaffold, .gitignore, README |
| v0.2 | FastAPI backend, Groq chat endpoint |
| v0.3 | Tauri shell, React frontend connected |
| v0.4 | Speaking tab, AI feedback, score chips |
| v0.5 | Settings tab, API key persistence |
| v0.6 | Vocabulary tab, SQLite flashcards |
| v0.7 | Grammar tab, reference tables, AI explain |
| v0.8 | VBS launcher, dev bat launcher |
| v0.9 | Paragraph upload, analyze, practice flow |
| v1.0 | Listening tab, Edge TTS, Kokoro voices |

---

## Roadmap

| Version | Feature |
|---|---|
| v1.1 | Microphone input — real speech-to-text via Whisper |
| v1.2 | Session history — save and review past sessions with scores |
| v1.3 | Multi-user profiles — separate progress, per-user API keys |
| v1.4 | Listening improvements — question count, text length controls |
| v1.5 | Production build — compiled `.exe`, silent launcher |
| v2.0 | OpenAI + Ollama LLM support, additional voice providers |

---

## License

MIT — © 2026 etkaturan

Save it, then push:


cd C:\Github\Awen
git add README.md
git commit -m "docs - comprehensive technical README"
git push origin main


