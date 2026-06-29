import groq
import tempfile
import os
import subprocess

async def transcribe_audio(audio_bytes: bytes, api_key: str, language: str = "de") -> str:
    client = groq.Groq(api_key=api_key)

    # Save as webm
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(audio_bytes)
        webm_path = f.name

    mp3_path = webm_path.replace(".webm", ".mp3")

    try:
        # Convert using ffmpeg directly via subprocess
        result = subprocess.run([
            "ffmpeg", "-y",
            "-i", webm_path,
            "-ar", "16000",
            "-ac", "1",
            "-b:a", "64k",
            mp3_path
        ], capture_output=True, text=True)

        if result.returncode != 0:
            print(f"ffmpeg error: {result.stderr[-500:]}")
            return ""

        with open(mp3_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=("audio.mp3", audio_file, "audio/mpeg"),
                model="whisper-large-v3-turbo",
                language=language,
                response_format="text"
            )
        return str(transcription).strip()

    except Exception as e:
        print(f"Transcription error: {e}")
        return ""
    finally:
        for path in [webm_path, mp3_path]:
            try:
                os.unlink(path)
            except:
                pass