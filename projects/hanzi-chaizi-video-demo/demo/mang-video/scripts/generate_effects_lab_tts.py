#!/usr/bin/env python3
"""Generate narration, caption timing, and procedural BGM for the effects lab."""

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
RATE = "-5%"
LINES = [
    ("笔顺教学：数字、方向和田字格", "笔顺教学，可以加入数字、方向和田字格。"),
    ("书写质感：墨迹、粉笔与霓虹", "同一条笔画路径，可以叠加墨迹、粉笔或霓虹质感。"),
    ("结构动画：部件拆开，再磁吸组合", "部件可以拆开、着色，再磁吸组合。"),
    ("字族比较：相同声旁，不同形旁", "还可以把相同声旁的字族，放在一起比较。"),
    ("互动跟写：这是界面概念验证", "路径也能延伸成互动跟写界面，但识别系统还没有实现。"),
    ("多种输出：短视频、课件与透明素材", "最后，同一份数据可以适配短视频、课堂课件和透明素材。"),
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
        mp3 = PUBLIC_AUDIO / f"effects-segment-{index}.mp3"
        wav = PUBLIC_AUDIO / f"effects-segment-{index}.wav"
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
    fade_out = max(0.0, duration - 1.4)
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-f",
            "lavfi",
            "-i",
            f"sine=frequency=196:duration={duration:.3f}:sample_rate=48000",
            "-f",
            "lavfi",
            "-i",
            f"sine=frequency=246.94:duration={duration:.3f}:sample_rate=48000",
            "-f",
            "lavfi",
            "-i",
            f"sine=frequency=293.66:duration={duration:.3f}:sample_rate=48000",
            "-filter_complex",
            (
                "[0:a]volume=0.010[a0];[1:a]volume=0.007[a1];[2:a]volume=0.006[a2];"
                "[a0][a1][a2]amix=inputs=3:duration=longest,lowpass=f=1500,"
                f"afade=t=in:st=0:d=0.9,afade=t=out:st={fade_out:.3f}:d=1.4[out]"
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
        ],
        check=True,
    )


async def main() -> None:
    PUBLIC_AUDIO.mkdir(parents=True, exist_ok=True)
    SRC.mkdir(parents=True, exist_ok=True)
    segments = await generate_segments()
    narration = PUBLIC_AUDIO / "effects-narration.wav"
    concatenate_segments(segments, narration)

    durations = [probe_duration(segment) for segment in segments]
    total_duration = probe_duration(narration)
    cursor = 0.0
    captions = []
    for index, ((display_text, _), duration) in enumerate(zip(LINES, durations)):
        start_ms = round(cursor * 1000)
        cursor += duration
        captions.append(
            {
                "index": index,
                "text": display_text,
                "startMs": start_ms,
                "endMs": round(cursor * 1000),
            }
        )

    manifest = {
        "backend": "edge-tts",
        "voice": VOICE,
        "rate": RATE,
        "audioFile": "audio/effects-narration.wav",
        "bgmFile": "audio/effects-background.mp3",
        "audioDuration": total_duration,
        "videoDuration": total_duration,
        "segments": captions,
    }
    generate_bgm(PUBLIC_AUDIO / "effects-background.mp3", total_duration)
    (SRC / "generated-effects-captions.json").write_text(
        json.dumps(captions, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (SRC / "generated-effects-voiceover.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
