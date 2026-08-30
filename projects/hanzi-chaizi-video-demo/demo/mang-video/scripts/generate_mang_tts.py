#!/usr/bin/env python3
"""Generate the voiceover, caption timing, and original placeholder BGM."""

from __future__ import annotations

import asyncio
import json
import subprocess
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_AUDIO = ROOT / "public" / "audio"
SRC = ROOT / "src"
VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-10%"
LINES = [
    ("趣味拆字里", "趣味拆字里。"),
    ("忙，可以看成竖心旁和一个“亡”", "忙，可以看成竖心旁和一个亡。"),
    ("事情再多，也别让心失去方向", "事情再多，也别让心失去方向。"),
    ("忙而不乱，才是真正的从容", "忙而不乱，才是真正的从容。"),
]


def probe_duration(path: Path) -> float:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return float(result.stdout.strip())


async def generate_segments() -> list[Path]:
    segment_wavs: list[Path] = []
    for index, (_, spoken_text) in enumerate(LINES):
        mp3 = PUBLIC_AUDIO / f"segment-{index}.mp3"
        wav = PUBLIC_AUDIO / f"segment-{index}.wav"
        await edge_tts.Communicate(spoken_text, VOICE, rate=RATE).save(str(mp3))
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                str(mp3),
                "-ar",
                "48000",
                "-ac",
                "2",
                "-c:a",
                "pcm_s16le",
                str(wav),
            ],
            check=True,
        )
        segment_wavs.append(wav)
    return segment_wavs


def concatenate_segments(segment_wavs: list[Path], output: Path) -> None:
    command = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
    for segment in segment_wavs:
        command.extend(["-i", str(segment)])
    inputs = "".join(f"[{index}:a]" for index in range(len(segment_wavs)))
    command.extend(
        [
            "-filter_complex",
            f"{inputs}concat=n={len(segment_wavs)}:v=0:a=1[out]",
            "-map",
            "[out]",
            "-ar",
            "48000",
            "-ac",
            "2",
            "-c:a",
            "pcm_s16le",
            str(output),
        ]
    )
    subprocess.run(command, check=True)


def generate_bgm(output: Path, duration: float) -> None:
    command = [
        "ffmpeg",
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-f",
        "lavfi",
        "-i",
        f"sine=frequency=220:duration={duration:.3f}:sample_rate=48000",
        "-f",
        "lavfi",
        "-i",
        f"sine=frequency=277.18:duration={duration:.3f}:sample_rate=48000",
        "-f",
        "lavfi",
        "-i",
        f"sine=frequency=329.63:duration={duration:.3f}:sample_rate=48000",
        "-filter_complex",
        (
            "[0:a]volume=0.012[a0];[1:a]volume=0.008[a1];[2:a]volume=0.007[a2];"
            f"[a0][a1][a2]amix=inputs=3:duration=longest,lowpass=f=1200,"
            f"afade=t=in:st=0:d=0.8,afade=t=out:st={max(0.0, duration - 1.2):.3f}:d=1.2[out]"
        ),
        "-map",
        "[out]",
        "-ac",
        "2",
        "-c:a",
        "libmp3lame",
        "-q:a",
        "4",
        str(output),
    ]
    subprocess.run(command, check=True)


async def main() -> None:
    PUBLIC_AUDIO.mkdir(parents=True, exist_ok=True)
    SRC.mkdir(parents=True, exist_ok=True)

    segments = await generate_segments()
    narration = PUBLIC_AUDIO / "narration.wav"
    concatenate_segments(segments, narration)

    durations = [probe_duration(segment) for segment in segments]
    total_duration = probe_duration(narration)
    starts_ms: list[int] = []
    cursor = 0.0
    for duration in durations:
        starts_ms.append(round(cursor * 1000))
        cursor += duration

    captions = []
    total_ms = round(total_duration * 1000)
    for index, (display_text, _) in enumerate(LINES):
        captions.append(
            {
                "text": display_text,
                "startMs": starts_ms[index],
                "endMs": starts_ms[index + 1] if index + 1 < len(starts_ms) else total_ms,
            }
        )

    manifest = {
        "backend": "edge-tts",
        "voice": VOICE,
        "rate": RATE,
        "audioFile": "audio/narration.wav",
        "bgmFile": "audio/background.mp3",
        "audioDuration": total_duration,
        "videoDuration": total_duration,
        "segments": captions,
    }

    generate_bgm(PUBLIC_AUDIO / "background.mp3", total_duration)
    (SRC / "generated-mang-captions.json").write_text(
        json.dumps(captions, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (SRC / "generated-mang-voiceover.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
