"""
KrishiCash Demo Video - AI Voiceover Script
===========================================
Adds a professional female AI voiceover (via Google TTS)
to the existing screen recording using moviepy.
"""

import os
import sys
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
VIDEO_IN  = r"C:\Users\Swati\Videos\Captures\frontend and 2 more pages - Personal - Microsoft\u00bf Edge 2026-07-15 23-47-29.mp4"
VIDEO_OUT = r"C:\Users\Swati\Videos\Captures\KrishiCash_Demo_Final.mp4"
AUDIO_TMP = r"C:\Users\Swati\.gemini\antigravity\scratch\KrishiCash\voiceover.mp3"

# ── Full voiceover script ─────────────────────────────────────────────────────
SCRIPT = """
Welcome to KrishiCash, our AI risk oracle for rural micro-finance. 
87 million rural households lack formal credit. We solve this using alternative data.

On our Loan Officer Dashboard, Ramesh Kumar gets a Low Risk score of 78 based on Satellite crop health and weather forecasts.
However, Vijayalakshmi shows a High Risk score of 31 due to severe crop stress, triggering automatic alerts.

KrishiCash delivers inclusive credit decisions, expanding rural finance safely. Thank you!
"""

def main():
    # ── Step 1: Generate voiceover audio ──────────────────────────────────────
    print("Generating female AI voiceover with Google TTS...")
    try:
        from gtts import gTTS
    except ImportError:
        print("ERROR: gTTS not installed. Run: pip install gTTS")
        sys.exit(1)

    tts = gTTS(text=SCRIPT.strip(), lang='en', tld='com.au', slow=False)
    # tld='com.au' uses Australian English female voice (clearer & professional)
    tts.save(AUDIO_TMP)
    print(f"Voiceover saved: {AUDIO_TMP}")

    # ── Step 2: Merge audio with video ────────────────────────────────────────
    print("Merging voiceover with video...")
    try:
        from moviepy import VideoFileClip, AudioFileClip, CompositeAudioClip
    except ImportError:
        try:
            from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip
        except ImportError:
            print("ERROR: moviepy not installed. Run: pip install moviepy")
            sys.exit(1)

    # Find video file (handle special char in filename)
    captures_dir = Path(r"C:\Users\Swati\Videos\Captures")
    video_files = list(captures_dir.glob("frontend*Edge*2026-07-15*.mp4"))
    if not video_files:
        print("ERROR: Video file not found. Check the path.")
        sys.exit(1)
    video_path = str(video_files[0])


    video = VideoFileClip(video_path)
    voiceover = AudioFileClip(AUDIO_TMP)

    video_duration = video.duration
    voice_duration = voiceover.duration
    print(f"Video duration : {video_duration:.1f}s")
    print(f"Voice duration : {voice_duration:.1f}s")

    # Trim voiceover if longer than video, or loop video if needed
    if voice_duration > video_duration:
        print(f"Trimming voiceover to match video length ({video_duration:.1f}s)")
        voiceover = voiceover.subclipped(0, video_duration)
    
    # Lower original audio volume and mix with voiceover
    original_audio = video.audio
    if original_audio:
        original_audio = original_audio.with_volume_scaled(0.08)
        mixed_audio = CompositeAudioClip([original_audio, voiceover])
    else:
        mixed_audio = voiceover

    final_video = video.with_audio(mixed_audio)

    print(f"Writing final video to: {VIDEO_OUT}")
    final_video.write_videofile(
        VIDEO_OUT,
        codec='libx264',
        audio_codec='aac',
        temp_audiofile='temp_audio.m4a',
        remove_temp=True,
        logger=None
    )

    # Cleanup
    video.close()
    voiceover.close()
    if os.path.exists(AUDIO_TMP):
        os.remove(AUDIO_TMP)

    print(f"\nDone! Final video saved at:\n    {VIDEO_OUT}")
    print("\nNext step: Upload this file to YouTube (Unlisted) or Google Drive to get your demo link!")

if __name__ == "__main__":
    main()
