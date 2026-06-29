# Awen — Setup & Run Instructions

**Repository:** https://github.com/etkaturan/Awen  
**Platform:** Windows (primary), Mac/Linux (manual setup)

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Check |
|---|---|---|
| Python | 3.10+ | `python --version` |
| Node.js | 18+ | `node --version` |
| Rust + Cargo | Latest | `cargo --version` |
| Tauri CLI | v2.0 | `cargo tauri --version` |
| ffmpeg | Any | `ffmpeg -version` |
| Git | Any | `git --version` |

If Tauri CLI is not installed:
```powershell
cargo install tauri-cli --version "^2.0"
```

If ffmpeg is not installed:
```powershell
winget install ffmpeg
```

---

## First-time setup

### 1. Clone the repository

```powershell
git clone https://github.com/etkaturan/Awen.git
cd Awen
```

### 2. Set up the Python backend

```powershell
cd backend
python -m venv .venv --without-pip
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
.venv\Scripts\python.exe get-pip.py
del get-pip.py
.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Create your environment file

Create a file called `.env` inside the `backend/` folder:

```
GROQ_API_KEY=your_groq_api_key_here
```

To get a free Groq API key:
1. Go to https://console.groq.com
2. Sign up for a free account
3. Click "API Keys" → "Create API Key"
4. Copy the key and paste it in your `.env` file

### 4. Set up the frontend

```powershell
cd ..\frontend
npm install
```

---

## Running the app

You have three options:

---

### Option 1 — Double-click launcher (recommended for daily use)

**Development mode:**  
Double-click `launch-dev.bat` in the `Awen/` root folder.

This opens 3 terminal windows automatically:
- Terminal 1: Python backend on port 8000
- Terminal 2: Vite frontend dev server on port 1420
- Terminal 3: Tauri desktop window

Wait about 15 seconds for everything to start. The desktop app window will open automatically.

**Production mode (after building):**  
Double-click `launch.vbs` in the `Awen/` root folder.

This runs silently — no terminal windows appear. The backend starts hidden and the compiled `.exe` opens.

> Note: Production mode requires a compiled build. See "Building for production" below.

---

### Option 2 — Manual terminals (for debugging)

Open 3 separate terminal tabs in VS Code and run each command:

**Terminal 1 — Backend:**
```powershell
cd C:\path\to\Awen\backend
.venv\Scripts\activate
python main.py
```

You should see:
```
INFO: Uvicorn running on http://127.0.0.1:8000
```

**Terminal 2 — Frontend dev server:**
```powershell
cd C:\path\to\Awen\frontend
npm run dev
```

You should see:
```
Local: http://localhost:1420/
```

**Terminal 3 — Tauri desktop window:**
```powershell
cd C:\path\to\Awen
cargo tauri dev
```

Wait for the desktop window to open (first time takes 2-5 minutes to compile Rust).

---

### Option 3 — Browser only (no Tauri needed)

If you just want to use the web version without the desktop app:

**Terminal 1 — Backend:**
```powershell
cd backend
.venv\Scripts\activate
python main.py
```

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm run dev
```

Then open your browser at: **http://localhost:1420**

---

## First run checklist

After the app opens, do this once:

1. Click the ⚙️ **Settings** icon in the left sidebar
2. Enter your Groq API key in the "Groq API Key" field
3. Click **Test** — you should see "✓ Connected successfully"
4. Select your preferred **Microphone** from the dropdown
5. Choose your preferred **Theme** (Light or Dark)
6. Click **Save Settings**

The key is saved to your browser's localStorage and will persist across sessions.

---

## Testing the backend manually

With the backend running, you can test endpoints from PowerShell:

**Health check:**
```powershell
Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:8000/health" -Method GET
```

**Test AI chat:**
```powershell
Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:8000/chat/message" -Method POST -ContentType "application/json" -Body '{"messages": [{"role": "user", "content": "Hallo!"}], "api_key": "your_key_here"}'
```

**List available voices:**
```powershell
Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:8000/speech/voices" -Method GET
```

**Test TTS:**
```powershell
Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:8000/speech/tts" -Method POST -ContentType "application/json" -Body '{"text": "Hallo, ich bin Awen!", "voice_key": "de_female_1", "speed": 1.0}'
```

---

## Building for production

To compile the desktop app into a native `.exe`:

```powershell
cd C:\path\to\Awen
cargo tauri build
```

This takes 5-15 minutes the first time. The compiled installer will be at:
```
src-tauri/target/release/bundle/nsis/Awen_1.1.0_x64-setup.exe
```

After building, `launch.vbs` will automatically use the compiled binary instead of `cargo tauri dev`.

---

## Project structure reference

```
Awen/
├── backend/                    ← Python FastAPI
│   ├── .venv/                  ← Python virtual environment (not in git)
│   ├── .env                    ← Your API key (not in git)
│   ├── main.py                 ← Start here
│   ├── requirements.txt        ← Python dependencies
│   ├── core/                   ← Config and database
│   ├── routers/                ← API endpoints
│   └── services/               ← LLM, TTS, STT logic
│
├── frontend/                   ← React + Vite
│   ├── src/
│   │   ├── App.tsx             ← Root layout + routing
│   │   ├── index.css           ← Design system (CSS variables)
│   │   └── components/         ← One file per tab
│   └── package.json
│
├── src-tauri/                  ← Rust Tauri shell
│   ├── src/main.rs             ← Rust entry point
│   └── tauri.conf.json         ← Window config, CSP
│
├── launch.vbs                  ← Silent production launcher
├── launch-dev.bat              ← Development launcher (3 terminals)
└── README.md
```

---

## Common issues

**Backend won't start — port already in use:**
```powershell
Get-Process python | Stop-Process -Force
python main.py
```

**Tauri window shows blank screen:**
Make sure the frontend dev server is running on port 1420 first, then run `cargo tauri dev`.

**Voice recording not working:**
- Go to Settings → select your correct microphone
- Make sure ffmpeg is installed: `ffmpeg -version`
- Speak for at least 3 seconds before releasing the mic button

**API key not working:**
- Make sure there are no spaces before/after the key
- Go to Settings → Test → should show green checkmark
- Check your Groq account at console.groq.com for quota

**node_modules missing:**
```powershell
cd frontend
npm install
```

**Python packages missing:**
```powershell
cd backend
.venv\Scripts\activate
pip install -r requirements.txt
```

---

## Ports used

| Service | Port | URL |
|---|---|---|
| Python backend | 8000 | http://127.0.0.1:8000 |
| Vite frontend | 1420 | http://localhost:1420 |
| Tauri window | — | Native desktop window |

---

*For questions or issues, open a GitHub issue at https://github.com/etkaturan/Awen*
