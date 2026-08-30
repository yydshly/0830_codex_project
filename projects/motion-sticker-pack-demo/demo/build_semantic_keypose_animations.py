#!/usr/bin/env python3
"""Build semantic key-pose loops with the frozen upstream keypose-local route.

The three approved sprite strips are generated once with the built-in image
editor, then this script deterministically splits and normalizes their poses,
hash-binds each approved source image, invokes the frozen upstream
`render_keypose_pack.py`, and records the resulting delivery evidence.
"""

from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

from PIL import Image, ImageChops, ImageOps


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
UPSTREAM = ROOT / "upstream"
POSE_ROOT = WEB / "assets" / "keyposes"
TARGET = WEB / "assets" / "semantic-animations"
FPS = 6
HOLD_FRAMES = 3
POSE_COUNT = 3
OUTPUT_FRAMES = 12
CANVAS_SIZE = 420

SUBJECTS = (
    {
        "id": "dragon",
        "strip": POSE_ROOT / "dragon-celebration-strip-v2.png",
        "approved_image": WEB / "assets" / "scenes" / "felt-dragon-celebrate.png",
        "stem": "dragon-celebration-keypose",
        "action": "anticipate -> jump with eyes closed and arms raised -> land while waving",
        "pose_labels": ["anticipation", "celebration peak", "wave recovery"],
        "identity_lock": "mint felt, cream belly, orange spikes, wings and round friendly face",
    },
    {
        "id": "earbuds",
        "strip": POSE_ROOT / "earbuds-translation-strip-v2.png",
        "approved_image": WEB / "assets" / "scenes" / "earbuds-live-translation.png",
        "stem": "earbuds-translation-keypose",
        "action": "cyan waveform begins left -> peaks through center -> reaches orange receiver",
        "pose_labels": ["left signal", "center translation peak", "right signal"],
        "identity_lock": "fixed matte-black ear-hook geometry with cyan and orange indicators",
    },
    {
        "id": "dog",
        "strip": POSE_ROOT / "dog-greeting-strip-v2.png",
        "approved_image": WEB / "assets" / "our-dog" / "dog-core.png",
        "stem": "dog-greeting-keypose",
        "action": "eyes open and paws down -> blink while paw lifts -> eyes open with paw waving",
        "pose_labels": ["open-eye start", "blink anticipation", "raised-paw greeting"],
        "identity_lock": "black curly fur, floppy ears, gray plaid harness and blue hanging tag",
    },
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("key-pose cell is fully transparent")
    return bbox


def split_and_normalize(strip_path: Path, output: Path) -> list[dict]:
    output.mkdir(parents=True, exist_ok=True)
    with Image.open(strip_path) as opened:
        strip = opened.convert("RGBA")
    bounds = [round(index * strip.width / POSE_COUNT) for index in range(POSE_COUNT + 1)]
    cells = [strip.crop((bounds[index], 0, bounds[index + 1], strip.height)) for index in range(POSE_COUNT)]
    trimmed = [cell.crop(alpha_bbox(cell)) for cell in cells]
    max_width = max(image.width for image in trimmed)
    max_height = max(image.height for image in trimmed)
    records = []
    for index, image in enumerate(trimmed, start=1):
        common = Image.new("RGBA", (max_width, max_height))
        common.alpha_composite(image, ((max_width - image.width) // 2, max_height - image.height))
        contained = ImageOps.contain(
            common,
            (round(CANVAS_SIZE * 0.90), round(CANVAS_SIZE * 0.90)),
            Image.Resampling.LANCZOS,
        )
        canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE))
        canvas.alpha_composite(
            contained,
            ((CANVAS_SIZE - contained.width) // 2, CANVAS_SIZE - contained.height - round(CANVAS_SIZE * 0.05)),
        )
        target = output / f"pose-{index:02d}.png"
        canvas.save(target, optimize=True)
        records.append(
            {
                "file": str(target.relative_to(WEB)).replace("\\", "/"),
                "bytes": target.stat().st_size,
                "sha256": sha256(target),
                "alpha_extrema": list(canvas.getchannel("A").getextrema()),
            }
        )
        canvas.close()
        contained.close()
        common.close()
        image.close()
    for cell in cells:
        cell.close()
    strip.close()
    return records


def media_metadata(path: Path) -> dict:
    with Image.open(path) as media:
        frames = int(getattr(media, "n_frames", 1))
        durations = []
        first = None
        peak_difference = 0
        for frame_index in range(frames):
            media.seek(frame_index)
            rgba = media.convert("RGBA")
            durations.append(int(media.info.get("duration", 0)))
            if first is None:
                first = rgba.copy()
            else:
                difference = ImageChops.difference(first, rgba)
                peak_difference = max(peak_difference, sum(1 for value in difference.getdata() if value != (0, 0, 0, 0)))
            rgba.close()
        assert first is not None
        alpha_extrema = list(first.getchannel("A").getextrema())
        first.close()
        width, height = media.size
    return {
        "bytes": path.stat().st_size,
        "sha256": sha256(path),
        "width": width,
        "height": height,
        "frames": frames,
        "duration_ms": sum(durations),
        "alpha_extrema_first_frame": alpha_extrema,
        "max_changed_pixels_vs_first": peak_difference,
    }


def run(command: list[str]) -> dict:
    completed = subprocess.run(command, check=True, capture_output=True, text=True)
    return json.loads(completed.stdout)


def main() -> int:
    for subject in SUBJECTS:
        for required in (subject["strip"], subject["approved_image"]):
            if not required.is_file():
                raise FileNotFoundError(required)
    TARGET.mkdir(parents=True, exist_ok=True)
    report_outputs = []
    package_files: list[Path] = []

    for subject in SUBJECTS:
        subject_pose_root = POSE_ROOT / subject["id"]
        numbered_pose_dir = subject_pose_root / "01"
        poses = split_and_normalize(subject["strip"], numbered_pose_dir)
        with tempfile.TemporaryDirectory(prefix=f"motion-keypose-{subject['id']}-") as temporary:
            temporary_root = Path(temporary)
            generated = temporary_root / "output"
            layout = temporary_root / "layout.json"
            state = temporary_root / "job-state.json"
            layout.write_text(
                json.dumps(
                    {
                        "source_type": "user-approved-workspace-sticker",
                        "detected_layout": {
                            "columns": 1,
                            "rows": 1,
                            "count": 1,
                            "confidence": 1.0,
                            "detection_mode": "confirmed-single-sticker",
                        },
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            run(
                [
                    sys.executable,
                    str(UPSTREAM / "scripts" / "manage_job_state.py"),
                    "create",
                    "--image",
                    str(subject["approved_image"]),
                    "--layout",
                    str(layout),
                    "--source-type",
                    "user-supplied",
                    "--output",
                    str(state),
                ]
            )
            upstream_report = run(
                [
                    sys.executable,
                    str(UPSTREAM / "scripts" / "render_keypose_pack.py"),
                    str(subject_pose_root),
                    str(generated),
                    "--fps",
                    str(FPS),
                    "--hold-frames",
                    str(HOLD_FRAMES),
                    "--layout",
                    str(layout),
                    "--image",
                    str(subject["approved_image"]),
                    "--state",
                    str(state),
                ]
            )
            media = {}
            for suffix in ("webp", "gif", "png"):
                filename = f"{subject['stem']}.{suffix}"
                target = TARGET / filename
                shutil.copyfile(generated / f"01.{suffix}", target)
                media[suffix] = {"file": filename, **media_metadata(target)}
                package_files.append(target)
            for source, suffix in (
                (state, "job-state.json"),
                (layout, "layout.json"),
                (generated / "processing.json", "processing.json"),
            ):
                target = TARGET / f"{subject['id']}-{suffix}"
                shutil.copyfile(source, target)
                package_files.append(target)
        report_outputs.append(
            {
                "id": subject["id"],
                "route": upstream_report["mode"],
                "strip": str(subject["strip"].relative_to(WEB)).replace("\\", "/"),
                "strip_sha256": sha256(subject["strip"]),
                "approved_image": str(subject["approved_image"].relative_to(WEB)).replace("\\", "/"),
                "action": subject["action"],
                "pose_labels": subject["pose_labels"],
                "identity_lock": subject["identity_lock"],
                "poses": poses,
                "sequence": upstream_report["cells"][0]["sequence"],
                "media": media,
            }
        )

    report = {
        "version": 1,
        "generator": "frozen upstream scripts/render_keypose_pack.py",
        "upstream_commit": "6531b374c8a5c324a7d98067408832084a2182c9",
        "route": "keypose-local / generated semantic poses + deterministic stepped sequencing",
        "fps": FPS,
        "hold_frames": HOLD_FRAMES,
        "keyposes_per_output": POSE_COUNT,
        "timeline_frames_per_output": OUTPUT_FRAMES,
        "duration_seconds": OUTPUT_FRAMES / FPS,
        "approval_basis": "User explicitly requested optimization to achieve case-like semantic motion on 2026-08-30.",
        "warning": "key poses change subject parts and expression, but use stepped timing without optical-flow or video-model interpolation",
        "outputs": report_outputs,
    }
    manifest = TARGET / "semantic-animation.json"
    manifest.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    package = TARGET / "semantic-sticker-pack.zip"
    with zipfile.ZipFile(package, "w", zipfile.ZIP_DEFLATED) as bundle:
        for path in package_files + [manifest]:
            bundle.write(path, arcname=path.name)
    print(json.dumps(report, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
