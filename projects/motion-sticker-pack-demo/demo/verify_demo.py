#!/usr/bin/env python3
"""Offline structural verification for the Motion Sticker Pack capability demo."""

from __future__ import annotations

import json
import hashlib
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
UPSTREAM = ROOT / "upstream"
WEB = ROOT / "web"
EXPECTED_COMMIT = "6531b374c8a5c324a7d98067408832084a2182c9"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def main() -> None:
    source = json.loads((ROOT / "docs" / "upstream-source.json").read_text(encoding="utf-8"))
    our_source = json.loads((ROOT / "docs" / "our-dog-source.json").read_text(encoding="utf-8"))
    animation_manifest = json.loads(
        (WEB / "assets" / "animations" / "scene-animation.json").read_text(encoding="utf-8")
    )
    semantic_manifest = json.loads(
        (WEB / "assets" / "semantic-animations" / "semantic-animation.json").read_text(
            encoding="utf-8"
        )
    )
    capability_map = json.loads(
        (WEB / "downloads" / "capability-map.json").read_text(encoding="utf-8")
    )
    prompt_trial = ROOT / "prompt-trial" / "dragon-celebration"
    prompt_bundle = json.loads((prompt_trial / "prompt-bundle.json").read_text(encoding="utf-8"))
    compiled_prompts = json.loads((prompt_trial / "prompts.json").read_text(encoding="utf-8"))
    portable_prompt_bundle = json.loads(
        (WEB / "downloads" / "video-prompt-default.json").read_text(encoding="utf-8")
    )
    user_result_root = prompt_trial / "user-result"
    user_video_result = json.loads(
        (user_result_root / "user-video-result.json").read_text(encoding="utf-8")
    )
    user_processing = json.loads(
        (WEB / "assets" / "user-video" / "dragon-user-generated-processing.json").read_text(
            encoding="utf-8"
        )
    )
    project = json.loads((ROOT / "project.json").read_text(encoding="utf-8"))
    html = (WEB / "index.html").read_text(encoding="utf-8")
    css = (WEB / "styles.css").read_text(encoding="utf-8")
    js = (WEB / "app.js").read_text(encoding="utf-8")

    require(source["commit"] == EXPECTED_COMMIT, "upstream commit is not fixed")
    require(source["tracked_files"] == 498, "unexpected tracked-file contract")
    require(project["slug"] == ROOT.name, "project slug must match its directory")
    require(project["status"] == "paused", "archived research must be paused")
    require(
        project["upstream_url"] == "https://github.com/kobingogo/motion-sticker-pack",
        "project metadata must link the upstream repository",
    )

    upstream_files = [
        path
        for path in UPSTREAM.rglob("*")
        if path.is_file() and "__pycache__" not in path.parts and path.suffix != ".pyc"
    ]
    require(len(upstream_files) == 498, f"expected 498 upstream files, found {len(upstream_files)}")
    require(not (UPSTREAM / ".git").exists(), "nested Git metadata must not be committed")
    for relative in (
        "SKILL.md",
        "README.md",
        "LICENSE",
        "package-lock.json",
        "scripts/process_emoji_grid.py",
        "scripts/video_gateway.mjs",
        "references/runtime-routing.md",
        "docs/adversarial-audit.md",
    ):
        require((UPSTREAM / relative).is_file(), f"missing upstream evidence: {relative}")

    require(len(capability_map["entry_modes"]) == 5, "entry mode map is incomplete")
    require(len(capability_map["workflow"]) == 8, "workflow map is incomplete")
    require(
        len(capability_map["bundled_external_video_providers"]) == 5,
        "provider map is incomplete",
    )
    require(len(capability_map["scene_atlas"]) == 6, "business scene map is incomplete")
    require(len(capability_map["extension_roadmap"]) == 6, "extension roadmap is incomplete")
    require(capability_map["research_archive"]["status"] == "paused", "archive status is missing")
    require(
        capability_map["user_driven_video_prompt_workbench"]["capability"]
        == "prompt-generation-only",
        "capability map must define the workbench as prompt-only",
    )

    required_prompt_files = (
        "layout.json",
        "tile-plan.json",
        "prompts.json",
        "prompt-bundle.json",
    )
    for filename in required_prompt_files:
        require((prompt_trial / filename).is_file(), f"missing video prompt artifact: {filename}")
    require(
        prompt_bundle["source_sha256"].upper()
        == sha256(WEB / "assets" / "scenes" / "felt-dragon-celebrate.png"),
        "prompt bundle is not bound to the dragon source",
    )
    require(compiled_prompts["detected_layout"]["count"] == 1, "prompt sample must be a 1x1 sticker")
    require("原地小幅跳起" in compiled_prompts["grid_video_prompt"], "compiled motion prompt is missing")
    require(prompt_bundle["capability"] == "prompt-generation-only", "prompt capability boundary is wrong")
    require(prompt_bundle["video_generated_here"] is False, "prompt bundle must not claim a generated video")
    require(prompt_bundle["external_request_made"] is False, "prompt generation must stay local")
    require("镜头完全固定" in prompt_bundle["positive_prompt"], "positive prompt lacks camera lock")
    require("不要增加肢体" in prompt_bundle["negative_prompt"], "negative prompt lacks identity constraints")
    require(len(prompt_bundle["manual_handoff"]) == 4, "manual user handoff must contain four steps")
    require(portable_prompt_bundle["capability"] == "prompt-generation-only", "portable bundle boundary is wrong")
    require(portable_prompt_bundle["default_sample"] == "dragon", "portable prompts must recommend the dragon")
    require(len(portable_prompt_bundle["samples"]) == 3, "prompt workbench must explain three sample choices")
    require(not (ROOT / "video-trial").exists(), "obsolete Provider trial directory must be removed")

    require(user_video_result["status"] == "processed", "user video result is not processed")
    source_media = user_video_result["source"]
    require(source_media["original_name"] == "video_1788105533581.mp4", "unexpected user video")
    require(source_media["width"] == 768 and source_media["height"] == 768, "unexpected user video dimensions")
    require(source_media["video_frames"] == 158 and source_media["video_fps"] == 24, "unexpected user video timeline")
    require(abs(source_media["duration_seconds"] - 6.583333) < 0.001, "unexpected user video duration")
    require(
        sha256(WEB / "assets" / "user-video" / "dragon-user-generated.mp4").lower()
        == source_media["sha256"].lower(),
        "user video hash differs from the audit",
    )
    processing = user_video_result["processing"]
    require(processing["native_frames_analyzed"] == 53, "unexpected matte frame count")
    require(processing["invalid_frames"] == 0 and processing["failed_cells"] == 0, "matte QC failed")
    require(processing["observed_key_color"] == "#6FF280", "observed green key is not fixed")
    require(processing["warning"] == "residual-hold-jitter", "video warning must stay visible")
    require(processing["gif_bytes"] < processing["gif_budget_bytes"], "GIF exceeds the declared budget")
    require(user_processing["status"] == "succeeded", "upstream processing report did not succeed")
    require(user_processing["source_frames_analyzed"] == 53, "processing report frame count differs")
    require(user_processing["warnings"] == ["01:residual-hold-jitter"], "processing warning differs")

    user_delivery_assets = {
        "dragon-user-generated-transparent.webp": "animated_webp",
        "dragon-user-generated-transparent.gif": "gif",
        "dragon-user-generated-first-frame.png": "first_frame_png",
        "dragon-user-generated-pack.zip": "zip",
        "dragon-user-generated-processing.json": "processing_report",
    }
    for filename, delivery_key in user_delivery_assets.items():
        delivery = user_video_result["deliveries"][delivery_key]
        path = WEB / "assets" / "user-video" / filename
        require(path.stat().st_size == delivery["bytes"], f"user delivery size differs: {filename}")
        require(sha256(path).lower() == delivery["sha256"].lower(), f"user delivery hash differs: {filename}")
    require(
        (WEB / "assets" / "user-video" / "dragon-user-generated-green-frame.png").stat().st_size > 400_000,
        "raw green-frame poster is missing",
    )
    for filename in ("dragon-user-generated-transparent.webp", "dragon-user-generated-transparent.gif"):
        with Image.open(WEB / "assets" / "user-video" / filename) as image:
            require(getattr(image, "is_animated", False), f"user delivery is not animated: {filename}")
            require(getattr(image, "n_frames", 1) == 53, f"user delivery must contain 53 frames: {filename}")
    with Image.open(WEB / "assets" / "user-video" / "dragon-user-generated-first-frame.png") as image:
        require(image.size == (240, 240), "transparent first frame must be 240px")
        require(image.convert("RGBA").getchannel("A").getextrema() == (0, 255), "transparent first frame needs real alpha")

    for asset in (
        "assets/stickers/black-cat-01.webp",
        "assets/stickers/black-cat-05.webp",
        "assets/stickers/black-cat-09.webp",
    ):
        require((WEB / asset).stat().st_size > 500_000, f"sample asset missing or truncated: {asset}")

    exact_assets = {
        "assets/stickers/black-cat-01.gif": 565_218,
        "assets/stickers/black-cat-01.png": 38_859,
    }
    for asset, expected_size in exact_assets.items():
        require((WEB / asset).stat().st_size == expected_size, f"unexpected format sample: {asset}")

    require(
        sha256(WEB / "assets/our-dog/source-black-longhair-dog.jpg") == our_source["sha256"],
        "our workspace sample does not match its fixed CC0 source",
    )
    our_generated_assets = {
        "assets/our-dog/dog-core.png": (
            1_905_161,
            "B50E61DCF16B2DA5FC75F68C11671A486ABA2E00C10574BF55189D9916172AE7",
        ),
        "assets/our-dog/dog-kinetic.png": (
            2_124_122,
            "327992C981A5CB2789456B2FD1846B4BFA5908BDA835578B3CC5C2C9FCF170CE",
        ),
        "assets/our-dog/dog-dream.png": (
            1_793_507,
            "8DDF0AD69486CC9B528B3A8CE9EA65E4D228F89C5201AD5684F91E797C16F1F1",
        ),
    }
    for asset, (expected_size, expected_hash) in our_generated_assets.items():
        path = WEB / asset
        require(path.stat().st_size == expected_size, f"unexpected generated sample size: {asset}")
        require(sha256(path) == expected_hash, f"unexpected generated sample hash: {asset}")
        require(path.read_bytes()[25] == 6, f"generated sample must use RGBA PNG color type: {asset}")

    web_preview_assets = {
        "assets/our-dog/source-black-longhair-dog-web.jpg": 263_056,
        "assets/our-dog/dog-core.webp": 281_050,
        "assets/our-dog/dog-kinetic.webp": 416_832,
        "assets/our-dog/dog-dream.webp": 357_418,
    }
    for asset, expected_size in web_preview_assets.items():
        require((WEB / asset).stat().st_size == expected_size, f"unexpected web preview: {asset}")
        require(asset in html, f"web preview is not referenced: {asset}")

    scene_source_assets = {
        "assets/scenes/source-felted-story.webp": (
            213_574,
            "0F7A22FD0A78C1877D4B3AA91676A44212382C3775DC42BA3FC837D83546477D",
        ),
        "assets/scenes/source-earbuds-storyboard.jpg": (
            222_491,
            "E5A42674FD8E33157778368C23AF1027FED86D12CFC71FC313C12628BC63E2C2",
        ),
        "assets/scenes/source-hanzi-mang.webp": (
            42_258,
            "A1E789AD0B29205848B5D6C109A4985DE987043A5D0CBC8BB357E80FB481E2D0",
        ),
    }
    scene_generated_assets = {
        "assets/scenes/felt-dragon-celebrate.png": (
            1_536_740,
            "23AF49C5F6F1D6A686F9DE19AF689E91E48D0315DA201CDD6E62F757DBB37427",
        ),
        "assets/scenes/earbuds-live-translation.png": (
            1_814_785,
            "638B3068713C8431D11627FC082465EF7762A05EB3AD2D9629381B0EC14EC8B2",
        ),
    }
    scene_preview_assets = {
        "assets/scenes/felt-dragon-celebrate.webp": 125_544,
        "assets/scenes/earbuds-live-translation.webp": 65_050,
    }
    for asset, (expected_size, expected_hash) in (
        scene_source_assets | scene_generated_assets
    ).items():
        path = WEB / asset
        require(path.stat().st_size == expected_size, f"unexpected scene asset size: {asset}")
        require(sha256(path) == expected_hash, f"unexpected scene asset hash: {asset}")
    for asset in scene_generated_assets:
        require((WEB / asset).read_bytes()[25] == 6, f"scene output must use RGBA PNG: {asset}")
    for asset, expected_size in scene_preview_assets.items():
        require((WEB / asset).stat().st_size == expected_size, f"unexpected scene preview: {asset}")

    require(
        animation_manifest["upstream_commit"] == EXPECTED_COMMIT,
        "animation evidence is not bound to the frozen upstream commit",
    )
    require(
        animation_manifest["generator"]
        == "frozen upstream scripts/process_independent_stickers.py",
        "animation evidence must name the executable upstream route",
    )
    require(animation_manifest["frames_per_output"] == 12, "unexpected animation frame contract")
    require(animation_manifest["duration_seconds"] == 1.5, "unexpected animation duration")
    require(len(animation_manifest["outputs"]) == 3, "three local animation examples are required")
    require(
        [output["recipe"] for output in animation_manifest["outputs"]]
        == ["bounce", "sway", "pulse"],
        "unexpected local animation recipes",
    )
    manifest_media = {
        record["file"]: record
        for output in animation_manifest["outputs"]
        for record in output["media"].values()
    }
    animation_assets = (
        "felt-dragon-bounce.webp",
        "felt-dragon-bounce.gif",
        "earbuds-sway.webp",
        "earbuds-sway.gif",
        "dog-core-pulse.webp",
        "dog-core-pulse.gif",
    )
    for filename in animation_assets:
        expected = manifest_media[filename]
        path = WEB / "assets" / "animations" / filename
        require(path.stat().st_size == expected["bytes"], f"animation size differs from audit: {filename}")
        require(sha256(path) == expected["sha256"], f"animation hash differs from audit: {filename}")
        with Image.open(path) as image:
            require(getattr(image, "is_animated", False), f"media is not animated: {filename}")
            require(getattr(image, "n_frames", 1) == 12, f"animation must contain 12 frames: {filename}")
    require(
        semantic_manifest["upstream_commit"] == EXPECTED_COMMIT,
        "semantic animation evidence is not bound to the frozen upstream commit",
    )
    require(
        semantic_manifest["generator"] == "frozen upstream scripts/render_keypose_pack.py",
        "semantic animation must use the upstream keypose-local route",
    )
    require(semantic_manifest["keyposes_per_output"] == 3, "unexpected key-pose contract")
    require(semantic_manifest["timeline_frames_per_output"] == 12, "unexpected key-pose timeline")
    require(semantic_manifest["duration_seconds"] == 2.0, "unexpected semantic duration")
    require(len(semantic_manifest["outputs"]) == 3, "three semantic subjects are required")
    require(
        [output["id"] for output in semantic_manifest["outputs"]]
        == ["dragon", "earbuds", "dog"],
        "unexpected semantic subject order",
    )
    for output in semantic_manifest["outputs"]:
        strip = WEB / output["strip"]
        require(sha256(strip) == output["strip_sha256"], f"key-pose strip hash differs: {output['id']}")
        require(len(output["poses"]) == 3, f"three poses are required: {output['id']}")
        require(output["sequence"] == [0, 1, 2, 1], f"unexpected pose loop: {output['id']}")
        for pose in output["poses"]:
            path = WEB / pose["file"]
            require(path.stat().st_size == pose["bytes"], f"pose size differs: {pose['file']}")
            require(sha256(path) == pose["sha256"], f"pose hash differs: {pose['file']}")
            with Image.open(path) as image:
                require(image.size == (420, 420), f"pose canvas must be 420px: {pose['file']}")
                require(image.convert("RGBA").getchannel("A").getextrema() == (0, 255), f"pose needs real alpha: {pose['file']}")
        for media_type, expected_frames in (("webp", 4), ("gif", 12), ("png", 1)):
            media = output["media"][media_type]
            path = WEB / "assets" / "semantic-animations" / media["file"]
            require(path.stat().st_size == media["bytes"], f"semantic media size differs: {media['file']}")
            require(sha256(path) == media["sha256"], f"semantic media hash differs: {media['file']}")
            with Image.open(path) as image:
                require(getattr(image, "n_frames", 1) == expected_frames, f"semantic frame count differs: {media['file']}")
            require(media["max_changed_pixels_vs_first"] > 20_000 or media_type == "png", f"semantic poses do not visibly differ: {media['file']}")
            require(media["file"] in html, f"semantic delivery is not linked from the page: {media['file']}")
    require(
        all(filename not in html for filename in ("felt-dragon-bounce.webp", "earbuds-sway.webp", "dog-core-pulse.webp")),
        "affine fallback must not remain the primary scene media",
    )

    for section_id in (
        "scenes",
        "video-driver",
        "our-sample",
        "examples",
        "extensions",
        "pipeline",
        "capabilities",
        "routing",
        "boundary",
    ):
        require(f'id="{section_id}"' in html, f"missing page section: {section_id}")
    require(
        len(re.findall(r'class="scene-tab(?:\s|\")', html)) == 6,
        "scene atlas must expose six business scenarios",
    )
    require(html.count('data-scene-panel=') == 6, "scene atlas must expose six panels")
    require(
        len(re.findall(r'class="our-effect-tab(?:\s|\")', html)) == 4,
        "our demo must expose four effect tabs",
    )
    require(html.count('data-our-effect-panel=') == 4, "our demo must expose four effect panels")
    require(html.count('data-motion-media="animated-webp"') == 4, "four live animation surfaces are required")
    require(html.count('data-motion-route="keypose-local"') == 4, "all live demo surfaces must use keypose-local")
    require(html.count('class="motion-static-stamp"') == 3, "scene motion fallbacks must be labelled")
    require(html.count('class="video-sample-button') == 3, "prompt workbench must expose three sample presets")
    require("downloads/video-prompt-default.json" in html, "default video prompt bundle is not linked")
    require("我生成提示词" in html and "你去生成视频" in html, "prompt/user responsibility is unclear")
    require("PROMPT ONLY" in html and "能力停止点" in html, "prompt-only stop state is not visible")
    require("PROJECT PAUSED · 2026-08-31" in html, "archive notice is missing")
    require(html.count("https://github.com/kobingogo/motion-sticker-pack") >= 3, "upstream links are incomplete")
    require('class="user-video-result"' in html, "user video result section is missing")
    require("dragon-user-generated-green-frame.png" in html, "raw user-video poster is missing")
    require("dragon-user-generated.mp4" in html, "user-generated MP4 is not shown")
    require("dragon-user-generated-transparent.webp" in html, "processed transparent WebP is not shown")
    require(html.count("assets/user-video/") == 9, "user video result links are incomplete")
    require(
        len(re.findall(r"<li><span>0[123]</span><b>(?:项目|用户)</b>", html)) == 3,
        "capability ownership must have three explicit steps",
    )
    require("由用户在外部平台生成" in html and "仓库后处理实跑" in html, "video ownership boundary is unclear")
    result_map = capability_map["user_generated_video_result"]
    require(result_map["source_media"]["frames"] == 158, "capability map source timeline differs")
    require(result_map["project_postprocessing"]["frames_analyzed"] == 53, "capability map processing differs")
    require(result_map["project_postprocessing"]["gif_budget_passed"] is True, "capability map GIF budget failed")
    for control_id in (
        "video-action-intent",
        "video-positive-prompt",
        "video-negative-prompt",
        "video-copy-prompt",
        "video-download-task",
        "video-source-download",
    ):
        require(f'id="{control_id}"' in html, f"missing prompt workbench control: {control_id}")
    for obsolete_id in ("video-provider", "video-submit-button", "video-command", "video-copy-command"):
        require(f'id="{obsolete_id}"' not in html, f"obsolete execution control remains: {obsolete_id}")
    require(
        len(re.findall(r'class="example-tab(?:\s|\")', html)) == 5,
        "example lab must expose five scenarios",
    )
    require(html.count('data-example-panel=') == 5, "example lab must expose five panels")
    require(html.count('class="format-card"') == 3, "format proof must compare three deliveries")
    require(html.count('class="extension-card"') == 6, "extension roadmap must expose six directions")
    require(
        len(re.findall(r'class="stage-tab(?:\s|\")', html)) == 6,
        "stage explorer must expose six tabs",
    )
    require(html.count('class="capability-card"') == 10, "capability grid must expose ten cards")
    require("aria-live=\"polite\"" in html, "interactive updates need a live region")
    require("prefers-reduced-motion" in css, "reduced-motion fallback is missing")
    require("focus-visible" in css, "visible keyboard focus is missing")
    require(
        all(key in js for key in ("ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp")),
        "tab keyboard navigation is incomplete",
    )
    require("user-driven-video-prompt-bundle" in js, "video prompt bundle logic is missing")
    require("prompt-generation-only" in js, "prompt-only capability boundary is missing")
    require("manual_handoff" in js and "video_generated_here" in js, "manual generation handoff is missing")
    require(not re.search(r"XAI_API_KEY|grok-build-local|--execute|user_video_driver", js), "browser still contains Provider execution logic")
    require(not re.search(r"\{\{[A-Z_]+\}\}", html), "unresolved template marker in HTML")

    print("Motion Sticker Pack demo verification passed.")
    print(f"- upstream commit: {EXPECTED_COMMIT}")
    print(f"- upstream files: {len(upstream_files)}")
    print("- page: 6 business scenes, 1 video prompt workbench, 3 semantic key-pose subjects")
    print("- semantic route: 3 poses per subject, stepped 0-1-2-1 loop, no video-provider claim")
    print("- video handoff: user returned a 6.58s MP4; the project delivered a 53-frame transparent sticker")
    print("- retained: affine fallback evidence, 4 dog effects, 5 input routes, 3 format proofs")


if __name__ == "__main__":
    main()
