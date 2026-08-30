#!/usr/bin/env python3
"""Build reproducible local-loop animations for the scene capability demo.

The script stages three approved transparent stickers at a browser-sized width,
then invokes the frozen upstream `process_independent_stickers.py` unchanged.
It keeps the upstream numbered pack and adds semantic filenames plus an audit
manifest for the web demo.
"""

from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
UPSTREAM = ROOT / "upstream"
TARGET = WEB / "assets" / "animations"
FPS = 8
DURATION_SECONDS = 1.5
STAGED_WIDTH = 420

SOURCES = (
    {
        "id": "01",
        "source": WEB / "assets" / "scenes" / "felt-dragon-celebrate.webp",
        "staged": "01-dragon.webp",
        "stem": "felt-dragon-bounce",
        "recipe": "bounce",
        "meaning": "whole-sticker vertical bounce; no new limb pose is synthesized",
    },
    {
        "id": "02",
        "source": WEB / "assets" / "scenes" / "earbuds-live-translation.webp",
        "staged": "02-earbuds.webp",
        "stem": "earbuds-sway",
        "recipe": "sway",
        "meaning": "whole-sticker 2.5-degree sway; the product geometry does not articulate",
    },
    {
        "id": "03",
        "source": WEB / "assets" / "our-dog" / "dog-core.webp",
        "staged": "03-dog.webp",
        "stem": "dog-core-pulse",
        "recipe": "pulse",
        "meaning": "whole-sticker 3.5-percent pulse; the face and limbs do not articulate",
    },
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def media_metadata(path: Path) -> dict:
    with Image.open(path) as media:
        frames = int(getattr(media, "n_frames", 1))
        durations = []
        for frame_index in range(frames):
            media.seek(frame_index)
            durations.append(int(media.info.get("duration", 0)))
        media.seek(0)
        rgba = media.convert("RGBA")
        alpha_extrema = rgba.getchannel("A").getextrema()
        width, height = media.size
    duration_ms = sum(durations)
    if frames > 1 and duration_ms == 0:
        duration_ms = round(frames * 1000 / FPS)
    return {
        "bytes": path.stat().st_size,
        "sha256": sha256(path),
        "width": width,
        "height": height,
        "frames": frames,
        "duration_ms": duration_ms,
        "alpha_extrema_first_frame": list(alpha_extrema),
    }


def stage_source(source: Path, target: Path) -> None:
    with Image.open(source) as opened:
        rgba = opened.convert("RGBA")
        width = min(STAGED_WIDTH, rgba.width)
        height = max(1, round(rgba.height * width / rgba.width))
        resized = rgba.resize((width, height), Image.Resampling.LANCZOS)
        resized.save(target, format="WEBP", lossless=True, method=4)
        resized.close()
        rgba.close()


def main() -> int:
    for item in SOURCES:
        if not item["source"].is_file():
            raise FileNotFoundError(item["source"])

    TARGET.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="motion-scene-animation-") as temporary:
        temporary_root = Path(temporary)
        staged = temporary_root / "inputs"
        generated = temporary_root / "output"
        staged.mkdir()
        for item in SOURCES:
            stage_source(item["source"], staged / item["staged"])

        command = [
            sys.executable,
            str(UPSTREAM / "scripts" / "process_independent_stickers.py"),
            str(staged),
            str(generated),
            "--fps",
            str(FPS),
            "--duration",
            str(DURATION_SECONDS),
        ]
        completed = subprocess.run(command, check=True, capture_output=True, text=True)
        upstream_report = json.loads(completed.stdout)

        outputs = []
        for item in SOURCES:
            semantic = {"id": item["id"], "source": str(item["source"].relative_to(ROOT))}
            semantic.update({key: item[key] for key in ("recipe", "meaning")})
            semantic["media"] = {}
            for suffix in ("webp", "gif", "png"):
                source_media = generated / f"{item['id']}.{suffix}"
                output_name = f"{item['stem']}.{suffix}"
                output_media = TARGET / output_name
                shutil.copyfile(source_media, output_media)
                semantic["media"][suffix] = {"file": output_name, **media_metadata(output_media)}
            outputs.append(semantic)

        for source_name, target_name in (
            ("layout.json", "upstream-layout.json"),
            ("processing.json", "upstream-processing.json"),
            ("sticker-pack.zip", "sticker-pack.zip"),
        ):
            shutil.copyfile(generated / source_name, TARGET / target_name)

    report = {
        "version": 1,
        "generator": "frozen upstream scripts/process_independent_stickers.py",
        "upstream_commit": "6531b374c8a5c324a7d98067408832084a2182c9",
        "route": "independent-stickers / deterministic local affine fallback",
        "fps": FPS,
        "duration_seconds": DURATION_SECONDS,
        "frames_per_output": round(FPS * DURATION_SECONDS),
        "staged_width": STAGED_WIDTH,
        "upstream_warning": upstream_report["warnings"][0],
        "approval_basis": "User requested real animation for the already displayed scene samples on 2026-08-30.",
        "outputs": outputs,
    }
    (TARGET / "scene-animation.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
