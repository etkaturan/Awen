import asyncio
import edge_tts
import base64

# ── Edge TTS voices ────────────────────────────────────────────────────────
EDGE_VOICES = {
    "de_female_1": {"id": "de-DE-KatjaNeural",  "lang": "de", "label": "Katja (DE Female)"},
    "de_male_1":   {"id": "de-DE-ConradNeural", "lang": "de", "label": "Conrad (DE Male)"},
    "de_female_2": {"id": "de-AT-IngridNeural", "lang": "de", "label": "Ingrid (AT Female)"},
    "de_male_2":   {"id": "de-AT-JonasNeural",  "lang": "de", "label": "Jonas (AT Male)"},
    "de_female_3": {"id": "de-CH-LeniNeural",   "lang": "de", "label": "Leni (CH Female)"},
    "en_female_1": {"id": "en-US-JennyNeural",  "lang": "en", "label": "Jenny (EN Female)"},
    "en_male_1":   {"id": "en-US-GuyNeural",    "lang": "en", "label": "Guy (EN Male)"},
    "en_female_2": {"id": "en-GB-SoniaNeural",  "lang": "en", "label": "Sonia (EN-GB Female)"},
    "en_male_2":   {"id": "en-GB-RyanNeural",   "lang": "en", "label": "Ryan (EN-GB Male)"},
}

# ── Kokoro voices ──────────────────────────────────────────────────────────
KOKORO_VOICES = {
    "kokoro_af_heart":   {"id": "af_heart",   "lang": "en", "label": "Heart (EN Female)"},
    "kokoro_af_bella":   {"id": "af_bella",   "lang": "en", "label": "Bella (EN Female)"},
    "kokoro_am_adam":    {"id": "am_adam",    "lang": "en", "label": "Adam (EN Male)"},
    "kokoro_am_michael": {"id": "am_michael", "lang": "en", "label": "Michael (EN Male)"},
    "kokoro_bf_emma":    {"id": "bf_emma",    "lang": "en", "label": "Emma (EN-GB Female)"},
    "kokoro_bm_george":  {"id": "bm_george", "lang": "en", "label": "George (EN-GB Male)"},
}

ALL_VOICES = {**EDGE_VOICES, **KOKORO_VOICES}

# ── Kokoro lazy loader ─────────────────────────────────────────────────────
_kokoro_pipeline = None

def get_kokoro_pipeline():
    global _kokoro_pipeline
    if _kokoro_pipeline is None:
        try:
            from kokoro import KPipeline
            _kokoro_pipeline = KPipeline(lang_code="a")
        except Exception as e:
            print(f"Kokoro unavailable: {e}")
            return None
    return _kokoro_pipeline

# ── Edge TTS ───────────────────────────────────────────────────────────────
async def synthesize_edge(text: str, voice_key: str, speed: float = 1.0) -> str:
    voice_id = EDGE_VOICES[voice_key]["id"]
    rate = f"+{int((speed - 1) * 100)}%" if speed >= 1 else f"{int((speed - 1) * 100)}%"
    communicate = edge_tts.Communicate(text, voice_id, rate=rate)
    audio_bytes = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes += chunk["data"]
    return base64.b64encode(audio_bytes).decode("utf-8")

# ── Kokoro TTS ─────────────────────────────────────────────────────────────
def synthesize_kokoro(text: str, voice_key: str, speed: float = 1.0) -> str:
    try:
        import soundfile as sf
        import numpy as np
        import io
        pipeline = get_kokoro_pipeline()
        if not pipeline:
            return ""
        voice_id = KOKORO_VOICES[voice_key]["id"]
        audio_chunks = []
        for _, _, audio in pipeline(text, voice=voice_id, speed=speed):
            audio_chunks.append(audio)
        if not audio_chunks:
            return ""
        combined = np.concatenate(audio_chunks)
        buf = io.BytesIO()
        sf.write(buf, combined, 24000, format="WAV")
        buf.seek(0)
        return base64.b64encode(buf.read()).decode("utf-8")
    except Exception as e:
        print(f"Kokoro synthesis error: {e}")
        return ""

# ── Unified synthesize ─────────────────────────────────────────────────────
async def synthesize(text: str, voice_key: str, speed: float = 1.0) -> dict:
    if voice_key in KOKORO_VOICES:
        audio_b64 = synthesize_kokoro(text, voice_key, speed)
        fmt = "wav"
    elif voice_key in EDGE_VOICES:
        audio_b64 = await synthesize_edge(text, voice_key, speed)
        fmt = "mp3"
    else:
        raise ValueError(f"Unknown voice: {voice_key}")
    return {"audio": audio_b64, "format": fmt, "voice": voice_key}

def get_all_voices() -> list:
    voices = []
    for key, v in EDGE_VOICES.items():
        voices.append({"key": key, "label": v["label"], "lang": v["lang"], "engine": "Edge TTS"})
    for key, v in KOKORO_VOICES.items():
        voices.append({"key": key, "label": v["label"], "lang": v["lang"], "engine": "Kokoro"})
    return voices