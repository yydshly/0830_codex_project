#!/usr/bin/env python3
"""Compile an auditable Image-to-Video prompt bundle without calling a video service."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
UPSTREAM_SCRIPTS = ROOT / "upstream" / "scripts"
WEB = ROOT / "web"
PROMPT_ROOT = ROOT / "prompt-trial"
KEY_COLOR = "#00FF00"

SAMPLES = {
    "dragon": {
        "slug": "dragon-celebration",
        "name": "毛毡小龙庆祝",
        "source": "web/assets/scenes/felt-dragon-celebrate.png",
        "action": "先轻微屈膝蓄力，再原地小幅跳起并举起双臂庆祝，落地后挥手一次",
        "identity": "严格保持毛毡小龙的绿色毛毡材质、圆角轮廓、橙色腹部、短角、五官、四肢比例和中心构图",
    },
    "dog": {
        "slug": "dog-greeting",
        "name": "黑色长毛犬挥爪",
        "source": "web/assets/our-dog/dog-core.png",
        "action": "先眨眼，再抬起左前爪轻轻挥手一次，最后回到端坐姿势",
        "identity": "严格保持黑色长卷毛、垂耳、长吻部、灰色格纹胸背、蓝色挂饰、身体比例和端坐构图",
    },
    "earbuds": {
        "slug": "earbuds-translation",
        "name": "翻译耳机声波传递",
        "source": "web/assets/scenes/earbuds-live-translation.png",
        "action": "产品完全固定，仅让青色声波经过中心转为橙色并到达右侧",
        "identity": "严格锁定耳机、充电盒的几何结构、尺寸比例、材质、颜色、开合角度和原始位置",
    },
}


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def compile_upstream_prompt(output_dir: Path, action: str, amplitude: str, loop: bool) -> dict:
    layout = {
        "source_type": "user-selected-prompt-reference",
        "detected_layout": {
            "columns": 1,
            "rows": 1,
            "count": 1,
            "confidence": 1.0,
            "detection_mode": "confirmed-single-sticker",
        },
    }
    tile_plan = {
        "version": 1,
        "tiles": [
            {
                "id": "01",
                "motion": action,
                "amplitude": amplitude,
                "loop": "return-to-start" if loop else "free-ending",
            }
        ],
    }
    write_json(output_dir / "layout.json", layout)
    write_json(output_dir / "tile-plan.json", tile_plan)
    subprocess.run(
        [
            sys.executable,
            str(UPSTREAM_SCRIPTS / "prompt_compiler.py"),
            "--layout",
            str(output_dir / "layout.json"),
            "--tile-plan",
            str(output_dir / "tile-plan.json"),
            "--key-color",
            KEY_COLOR,
            "--output",
            str(output_dir / "prompts.json"),
        ],
        check=True,
    )
    return json.loads((output_dir / "prompts.json").read_text(encoding="utf-8"))


def build_positive(sample: dict, action: str, duration: int, amplitude: str, loop: bool) -> str:
    amplitude_text = "动作幅度小而克制" if amplitude == "small" else "动作幅度中等但不过度夸张"
    ending = (
        "动作完成后自然回到与首帧一致的起始姿态，使首尾可以平滑衔接"
        if loop
        else "动作完成后自然停在结束姿态，不强求首尾回环"
    )
    return (
        f"{sample['identity']}。以所附源图作为唯一主体参考，不改变原有造型。{action}。"
        f"{amplitude_text}，在 {duration} 秒内只完成这一组动作；{ending}。"
        "镜头完全固定，禁止推近、拉远、平移、旋转、倾斜和抖动；"
        "主体身体中心、脚底基线和整体构图保持稳定。动作自然、简洁、适合聊天贴纸。"
        f"若平台不能输出真实透明通道，统一使用纯色 {KEY_COLOR} 背景，无阴影、渐变或纹理。"
    )


def build_negative(sample_id: str, sample: dict) -> str:
    subject_rule = (
        "不要弯曲、融化、重组或复制任何产品部件；"
        if sample_id == "earbuds"
        else "不要增加肢体、重复配件或改变五官；"
    )
    return (
        f"{subject_rule}不要改变{sample['name']}的身份、颜色、材质、比例和现有配件；"
        "不要增加角色、物体、文字、字幕、边框、阴影或背景元素；"
        "不要出现镜头运动、主体持续漂移、缩放、变形、闪烁或越出画面；"
        "不要用棋盘格模拟透明，不要产生白边、黑边或半透明脏边。"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sample", choices=tuple(SAMPLES), default="dragon")
    parser.add_argument("--action")
    parser.add_argument("--duration", type=int, choices=(3, 4, 6, 10), default=6)
    parser.add_argument("--amplitude", choices=("small", "medium"), default="small")
    parser.add_argument("--no-loop", action="store_true")
    args = parser.parse_args()

    sample = SAMPLES[args.sample]
    action = args.action or sample["action"]
    loop = not args.no_loop
    source = ROOT / sample["source"]
    if not source.is_file():
        raise FileNotFoundError(source)

    output_dir = PROMPT_ROOT / sample["slug"]
    compiled = compile_upstream_prompt(output_dir, action, args.amplitude, loop)
    bundle = {
        "version": 2,
        "kind": "user-driven-video-prompt-bundle",
        "capability": "prompt-generation-only",
        "sample": args.sample,
        "sample_name": sample["name"],
        "source_image": sample["source"].replace("web/", ""),
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "motion_intent": action,
        "duration_seconds": args.duration,
        "amplitude": args.amplitude,
        "loop": "return-to-start" if loop else "free-ending",
        "positive_prompt": build_positive(sample, action, args.duration, args.amplitude, loop),
        "negative_prompt": build_negative(args.sample, sample),
        "upstream_compiled_prompt": compiled["grid_video_prompt"],
        "suggested_settings": {
            "mode": "image-to-video",
            "camera": "locked",
            "background": f"transparent-if-supported-otherwise-{KEY_COLOR}",
        },
        "manual_handoff": [
            "保留或下载源图",
            "复制正向提示词与负向约束",
            "在用户选择的视频平台上传源图并粘贴提示词",
            "由用户设置平台参数、点击生成并评审结果",
        ],
        "external_request_made": False,
        "video_generated_here": False,
    }
    write_json(output_dir / "prompt-bundle.json", bundle)

    portable = {
        "version": 2,
        "kind": "video-prompt-workbench-defaults",
        "capability": "prompt-generation-only",
        "default_sample": "dragon",
        "samples": {
            sample_id: {
                "name": item["name"],
                "source": item["source"].replace("web/", ""),
                "action": item["action"],
                "identity_constraint": item["identity"],
            }
            for sample_id, item in SAMPLES.items()
        },
        "default_prompt_bundle": bundle,
        "boundary": "This project generates prompt text only. The user selects a video platform, uploads the source, submits generation, and reviews the result.",
        "external_request_made": False,
        "video_generated_here": False,
    }
    write_json(WEB / "downloads" / "video-prompt-default.json", portable)
    print(json.dumps(bundle, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
