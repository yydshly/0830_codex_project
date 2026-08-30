#!/usr/bin/env python3
"""Verify the rendered media and the static capability report."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
UPSTREAM_VIDEO = PROJECT / "web" / "assets" / "hanzi-chaizi-demo.mp4"
UPSTREAM_POSTER = PROJECT / "web" / "assets" / "poster.webp"
MANG_VIDEO = PROJECT / "web" / "assets" / "mang-heart-direction.mp4"
MANG_POSTER = PROJECT / "web" / "assets" / "mang-poster.webp"
MANG_COMPOSITION = PROJECT / "demo" / "mang-video" / "src" / "MangHeartDirectionVideo.tsx"
MANG_VOICEOVER = PROJECT / "demo" / "mang-video" / "src" / "generated-mang-voiceover.json"
EFFECTS_VIDEO = PROJECT / "web" / "assets" / "hanzi-effects-lab.mp4"
EFFECTS_POSTER = PROJECT / "web" / "assets" / "effects-poster.webp"
EFFECTS_COMPOSITION = PROJECT / "demo" / "mang-video" / "src" / "EffectsLabVideo.tsx"
EFFECTS_VOICEOVER = PROJECT / "demo" / "mang-video" / "src" / "generated-effects-voiceover.json"
WORKBENCH_VIDEO = PROJECT / "web" / "assets" / "workbench-config-demo.mp4"
WORKBENCH_POSTER = PROJECT / "web" / "assets" / "workbench-poster.webp"
WORKBENCH_CATALOG = PROJECT / "web" / "data" / "hanzi-workbench.json"
WORKBENCH_COMPOSITION = PROJECT / "demo" / "mang-video" / "src" / "ConfigurableHanziVideo.tsx"
NAME_BLESSING_VIDEO = PROJECT / "web" / "assets" / "name-blessing-muyang.mp4"
NAME_BLESSING_POSTER = PROJECT / "web" / "assets" / "name-blessing-poster.webp"
NAME_BLESSING_CATALOG = PROJECT / "web" / "data" / "name-blessing.json"
NAME_BLESSING_COMPOSITION = PROJECT / "demo" / "mang-video" / "src" / "NameBlessingVideo.tsx"
WEDDING_VIDEO = PROJECT / "web" / "assets" / "wedding-zhangshuai-dong.mp4"
WEDDING_POSTER = PROJECT / "web" / "assets" / "wedding-zhangshuai-dong-poster.webp"
WEDDING_CATALOG = PROJECT / "web" / "data" / "wedding-zhangshuai-dong.json"
WEDDING_COMPOSITION = PROJECT / "demo" / "mang-video" / "src" / "WeddingStoryVideo.tsx"
WEDDING_SCREEN_VIDEO = PROJECT / "web" / "assets" / "wedding-zhangshuai-dong-screen.mp4"
WEDDING_SCREEN_POSTER = PROJECT / "web" / "assets" / "wedding-zhangshuai-dong-screen-poster.webp"
WEDDING_SCREEN_COMPOSITION = PROJECT / "demo" / "mang-video" / "src" / "WeddingScreenVideo.tsx"
WEDDING_WELCOME_PNG = PROJECT / "web" / "assets" / "wedding-welcome-demo.png"
WEDDING_WELCOME_WEBP = PROJECT / "web" / "assets" / "wedding-welcome-demo.webp"
WEDDING_WELCOME_COMPOSITION = PROJECT / "demo" / "mang-video" / "src" / "WeddingWelcomePoster.tsx"
WEDDING_SAMPLE_DELIVERY = PROJECT / "web" / "data" / "wedding-sample-delivery.json"
WEDDING_AI_SOURCE_IMAGES = tuple(
    PROJECT / "web" / "assets" / "wedding-ai" / name
    for name in ("01-first-meet.png", "02-together.png", "03-promise.png")
)
WEDDING_AI_WEB_IMAGES = tuple(
    PROJECT / "web" / "assets" / "wedding-ai" / name
    for name in ("01-first-meet.webp", "02-together.webp", "03-promise.webp")
)
REMOTION_ROOT = PROJECT / "demo" / "mang-video" / "src" / "Root.tsx"
PAGE = PROJECT / "web" / "index.html"
APP = PROJECT / "web" / "app.js"
SCENARIO_CLIPS = {
    "lesson": ((4.6, 4.8), PROJECT / "web" / "assets" / "scenario-clips" / "scenario-lesson.mp4"),
    "gift": ((5.0, 5.2), PROJECT / "web" / "assets" / "scenario-clips" / "scenario-gift.mp4"),
    "exhibit": ((3.6, 3.9), PROJECT / "web" / "assets" / "scenario-clips" / "scenario-exhibit.mp4"),
    "family": ((3.9, 4.2), PROJECT / "web" / "assets" / "scenario-clips" / "scenario-family.mp4"),
    "practice": ((5.5, 5.8), PROJECT / "web" / "assets" / "scenario-clips" / "scenario-practice.mp4"),
}
UPSTREAM_COMPOSITION = (
    PROJECT / "upstream" / "src" / "LanYunjianTransformComposition.tsx"
)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def probe_video(path: Path) -> dict:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            (
                "format=duration,size:"
                "stream=index,codec_name,codec_type,width,height,r_frame_rate,"
                "sample_rate,channels"
            ),
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def verify_media(
    path: Path,
    duration_range: tuple[float, float],
    minimum_size: int = 1_000_000,
    dimensions: tuple[int, int] = (1080, 1920),
) -> dict:
    probe = probe_video(path)
    video_streams = [
        stream for stream in probe["streams"] if stream.get("codec_type") == "video"
    ]
    audio_streams = [
        stream for stream in probe["streams"] if stream.get("codec_type") == "audio"
    ]
    require(len(video_streams) == 1, f"Expected one video stream in {path.name}")
    require(len(audio_streams) == 1, f"Expected one audio stream in {path.name}")

    video = video_streams[0]
    audio = audio_streams[0]
    duration = float(probe["format"]["duration"])
    size = int(probe["format"]["size"])
    require(video.get("codec_name") == "h264", f"Expected H.264 video in {path.name}")
    require(
        (video.get("width"), video.get("height")) == dimensions,
        f"Expected {dimensions[0]}x{dimensions[1]} in {path.name}",
    )
    require(video.get("r_frame_rate") == "30/1", f"Expected 30 fps in {path.name}")
    require(audio.get("codec_name") == "aac", f"Expected AAC audio in {path.name}")
    require(audio.get("sample_rate") == "48000", f"Expected 48 kHz audio in {path.name}")
    require(audio.get("channels") == 2, f"Expected stereo audio in {path.name}")
    require(
        duration_range[0] <= duration <= duration_range[1],
        f"Unexpected duration in {path.name}: {duration}",
    )
    require(size > minimum_size, f"Rendered video is unexpectedly small: {path.name} ({size})")
    return {
        "codec": video["codec_name"],
        "dimensions": f'{video["width"]}x{video["height"]}',
        "fps": video["r_frame_rate"],
        "duration_seconds": duration,
        "size_bytes": size,
        "audio": {
            "codec": audio["codec_name"],
            "sample_rate": audio["sample_rate"],
            "channels": audio["channels"],
        },
    }


def verify_image(path: Path, dimensions: tuple[int, int], minimum_size: int) -> dict:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=codec_name,width,height",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    stream = json.loads(result.stdout)["streams"][0]
    size = path.stat().st_size
    require((stream.get("width"), stream.get("height")) == dimensions, f"Unexpected image dimensions: {path.name}")
    require(size > minimum_size, f"Image is unexpectedly small: {path.name} ({size})")
    return {"codec": stream.get("codec_name"), "dimensions": f"{dimensions[0]}x{dimensions[1]}", "size_bytes": size}


def verify_scenario_clip(path: Path, duration_range: tuple[float, float]) -> dict:
    probe = probe_video(path)
    video = next(stream for stream in probe["streams"] if stream.get("codec_type") == "video")
    audio = next(stream for stream in probe["streams"] if stream.get("codec_type") == "audio")
    duration = float(probe["format"]["duration"])
    size = int(probe["format"]["size"])
    require(video.get("codec_name") == "h264", f"Expected H.264 video in {path.name}")
    require((video.get("width"), video.get("height")) == (540, 960), f"Expected 9:16 preview in {path.name}")
    require(video.get("r_frame_rate") == "30/1", f"Expected 30 fps in {path.name}")
    require(audio.get("codec_name") == "aac", f"Expected AAC audio in {path.name}")
    require(duration_range[0] <= duration <= duration_range[1], f"Unexpected duration in {path.name}: {duration}")
    require(size > 80_000, f"Scenario clip is unexpectedly small: {path.name} ({size})")
    return {"dimensions": "540x960", "duration_seconds": duration, "size_bytes": size}


def main() -> None:
    for path in (
        UPSTREAM_VIDEO,
        UPSTREAM_POSTER,
        MANG_VIDEO,
        MANG_POSTER,
        MANG_COMPOSITION,
        MANG_VOICEOVER,
        EFFECTS_VIDEO,
        EFFECTS_POSTER,
        EFFECTS_COMPOSITION,
        EFFECTS_VOICEOVER,
        WORKBENCH_VIDEO,
        WORKBENCH_POSTER,
        WORKBENCH_CATALOG,
        WORKBENCH_COMPOSITION,
        NAME_BLESSING_VIDEO,
        NAME_BLESSING_POSTER,
        NAME_BLESSING_CATALOG,
        NAME_BLESSING_COMPOSITION,
        WEDDING_VIDEO,
        WEDDING_POSTER,
        WEDDING_CATALOG,
        WEDDING_COMPOSITION,
        WEDDING_SCREEN_VIDEO,
        WEDDING_SCREEN_POSTER,
        WEDDING_SCREEN_COMPOSITION,
        WEDDING_WELCOME_PNG,
        WEDDING_WELCOME_WEBP,
        WEDDING_WELCOME_COMPOSITION,
        WEDDING_SAMPLE_DELIVERY,
        *WEDDING_AI_SOURCE_IMAGES,
        *WEDDING_AI_WEB_IMAGES,
        REMOTION_ROOT,
        PAGE,
        APP,
        UPSTREAM_COMPOSITION,
    ):
        require(path.is_file(), f"Missing required artifact: {path.relative_to(PROJECT)}")
    for scenario, (_, clip) in SCENARIO_CLIPS.items():
        require(clip.is_file(), f"Missing scenario clip: {scenario}")
        require(clip.with_suffix(".webp").is_file(), f"Missing scenario poster: {scenario}")

    page = PAGE.read_text(encoding="utf-8")
    page_text = re.sub(r"<[^>]+>", "", page)
    page_sections = (
        "overview",
        "our-demo",
        "capability",
        "scenarios",
        "scenario-lab",
        "workbench",
        "name-blessing",
        "wedding-case",
        "wedding-complete-pack",
        "wedding-asset-exploration",
        "effects-lab",
        "extension",
        "products",
        "decision",
    )
    for section_id in page_sections:
        require(f'id="{section_id}"' in page, f"Missing page section: {section_id}")
    for statement in (
        "先用五个判断，看清这个库。",
        "最适合它的，是“一字一条”文化短视频。",
        "先用姓名祝福验证分享与付费，再把工作台升级为生产底座。",
        "把“姓名祝福”扩展成一套婚礼叙事，而不是只换两行名字。",
        "把缺失资料补成一份可替换的完整请帖",
        "从一对虚构人物，探索一套一致的婚礼素材链",
    ):
        require(statement in page_text, f"Missing positioning statement: {statement}")
    require(
        "它是做透的“懒”字模板，不是输入任意汉字就能自动出片的平台。" in page,
        "The page must retain the central capability-boundary statement",
    )
    require("assets/hanzi-chaizi-demo.mp4" in page, "Missing upstream video source")
    require("assets/mang-heart-direction.mp4" in page, "Missing our demo video source")
    require("assets/hanzi-effects-lab.mp4" in page, "Missing effects-lab video source")
    require("assets/workbench-config-demo.mp4" in page, "Missing workbench video source")
    require("data/hanzi-workbench.json?v=1" in page, "Missing workbench catalog retry source")
    require("assets/name-blessing-muyang.mp4" in page, "Missing name-blessing video source")
    require("data/name-blessing.json?v=1" in page, "Missing name-blessing catalog retry source")
    require("不是展示“会写字”，而是让一个名字拥有专属的高光时刻。" in page_text, "Missing name-product positioning")
    require("assets/wedding-zhangshuai-dong.mp4" in page, "Missing wedding-story video source")
    require("assets/wedding-zhangshuai-dong-screen.mp4" in page, "Missing wedding-screen video source")
    require("assets/wedding-welcome-demo.webp" in page, "Missing wedding welcome preview")
    require("assets/wedding-welcome-demo.png" in page, "Missing wedding welcome download")
    require("data/wedding-zhangshuai-dong.json?v=3" in page, "Missing wedding-project catalog source")
    require("data/wedding-sample-delivery.json" in page, "Missing complete sample delivery manifest")
    for image_name in ("01-first-meet", "02-together", "03-promise"):
        require(f"assets/wedding-ai/{image_name}.webp" in page, f"Missing wedding AI web image: {image_name}")
        require(f"assets/wedding-ai/{image_name}.png" in page, f"Missing wedding AI source download: {image_name}")
    require("同一对虚构成年人的 AI 生成素材" in page_text, "Missing explicit fictional AI identity label")
    for wedding_fact in ("张帅", "董小姐", "2026.09.12", "延安", "两姓成礼 · 一字一生"):
        require(wedding_fact in page_text, f"Missing wedding case fact: {wedding_fact}")
    require("02 个字已跑通" in page, "Missing second-demo evidence statement")
    for maturity in ("已演示", "概念验证", "待产品化"):
        require(maturity in page, f"Missing effects maturity label: {maturity}")
    for scenario in ("culture", "lesson", "gift", "exhibit", "family", "practice"):
        require(f'data-scenario="{scenario}"' in page, f"Missing scenario tab: {scenario}")
    require(page.count('class="scenario-card reveal"') == 6, "Expected six scenario summary cards")

    app = APP.read_text(encoding="utf-8")
    for scenario in SCENARIO_CLIPS:
        require(f"scenario-{scenario}.mp4" in app, f"Missing scenario clip mapping: {scenario}")
    require("ArrowRight" in app and "ArrowLeft" in app, "Missing keyboard scenario navigation")
    require("scenarioProofVideo.play()" in app, "Missing scenario proof playback")
    for workbench_behavior in (
        "loadWorkbenchCatalog",
        "renderWorkbenchPreview",
        "download-workbench-config",
        "workbenchVideo.play()",
    ):
        require(workbench_behavior in app or workbench_behavior in page, f"Missing workbench behavior: {workbench_behavior}")
    for name_product_behavior in (
        "loadNameProductCatalog",
        "renderNameProductPreview",
        "replayNamePreview",
        "download-name-product",
        "name-blessing-video",
    ):
        require(name_product_behavior in app or name_product_behavior in page, f"Missing name-product behavior: {name_product_behavior}")
    for wedding_behavior in (
        "loadWeddingProject",
        "renderWeddingStage",
        "playWeddingStoryboard",
        "download-wedding-project",
        "wedding-story-video",
        "wedding-screen-video",
        "wedding-rsvp",
        "仅本页模拟，未发送或保存。",
        "AI SIMULATED PHOTO 01",
    ):
        require(wedding_behavior in app or wedding_behavior in page, f"Missing wedding-project behavior: {wedding_behavior}")

    composition = UPSTREAM_COMPOSITION.read_text(encoding="utf-8")
    require('hanzi-writer-data/懒.json' in composition, "Missing 懒 stroke data import")
    require('id="LanYunjianTransform"' in composition, "Missing Remotion composition")
    require("durationInFrames={DURATION}" in composition, "Video is not audio-duration driven")

    mang_composition = MANG_COMPOSITION.read_text(encoding="utf-8")
    require('hanzi-writer-data/忙.json' in mang_composition, "Missing 忙 stroke data import")
    require('index < 3 ? ("heart" as const)' in mang_composition, "Missing manual 忙 component mapping")
    require("趣味联想 · 不等于历史字源" in mang_composition, "Missing content-boundary label")
    mang_voiceover = json.loads(MANG_VOICEOVER.read_text(encoding="utf-8"))
    require(mang_voiceover["voice"] == "zh-CN-XiaoxiaoNeural", "Unexpected 忙 voice")

    effects_composition = EFFECTS_COMPOSITION.read_text(encoding="utf-8")
    for character in ("永", "明", "清", "情", "晴", "请"):
        require(
            f'hanzi-writer-data/{character}.json' in effects_composition,
            f"Missing effects-lab stroke data import: {character}",
        )
    require("界面概念验证" in effects_composition, "Missing interaction capability boundary")
    effects_voiceover = json.loads(EFFECTS_VOICEOVER.read_text(encoding="utf-8"))
    require(effects_voiceover["voice"] == "zh-CN-XiaoxiaoNeural", "Unexpected effects voice")
    require(len(effects_voiceover["segments"]) == 6, "Expected six effects-lab segments")

    catalog = json.loads(WORKBENCH_CATALOG.read_text(encoding="utf-8"))
    require(catalog.get("version") == 1, "Unexpected workbench catalog version")
    require(len(catalog.get("catalog", [])) == 5, "Expected five workbench characters")
    require(len(catalog.get("scenes", [])) == 4, "Expected four workbench scenes")
    require(len(catalog.get("templates", [])) == 3, "Expected three workbench templates")
    require(catalog.get("sample", {}).get("character") == "明", "Expected 明 workbench sample")
    require(
        {item["character"] for item in catalog["catalog"]} == {"忙", "永", "明", "清", "安"},
        "Unexpected workbench character catalog",
    )

    workbench_composition = WORKBENCH_COMPOSITION.read_text(encoding="utf-8")
    for character in ("忙", "永", "明", "清", "安"):
        require(
            f'hanzi-writer-data/{character}.json' in workbench_composition,
            f"Missing configurable stroke data import: {character}",
        )
    for prop in ("character", "scene", "template", "title", "caption", "accent"):
        require(prop in workbench_composition, f"Missing configurable video prop: {prop}")
    require("../../../web/data/hanzi-workbench.json" in workbench_composition, "Composition does not read the shared catalog")
    remotion_root = REMOTION_ROOT.read_text(encoding="utf-8")
    require('id="ConfigurableHanzi"' in remotion_root, "Missing configurable Remotion composition")

    name_catalog = json.loads(NAME_BLESSING_CATALOG.read_text(encoding="utf-8"))
    require(name_catalog.get("version") == 1, "Unexpected name-blessing catalog version")
    require(len(name_catalog.get("occasions", [])) == 4, "Expected four blessing occasions")
    require(len(name_catalog.get("styles", [])) == 3, "Expected three blessing styles")
    require(name_catalog.get("supportedCharacters") == ["沐", "阳"], "Unexpected real-render character coverage")
    require(name_catalog.get("sample", {}).get("name") == "沐阳", "Expected 沐阳 blessing sample")

    name_composition = NAME_BLESSING_COMPOSITION.read_text(encoding="utf-8")
    for character in ("沐", "阳"):
        require(
            f'hanzi-writer-data/{character}.json' in name_composition,
            f"Missing name-blessing stroke data import: {character}",
        )
    for prop in ("name", "occasion", "style", "blessing", "signature", "date", "accent"):
        require(prop in name_composition, f"Missing name-blessing video prop: {prop}")
    require("../../../web/data/name-blessing.json" in name_composition, "Name composition does not read the shared catalog")
    require('id="NameBlessing"' in remotion_root, "Missing name-blessing Remotion composition")

    wedding_catalog = json.loads(WEDDING_CATALOG.read_text(encoding="utf-8"))
    require(wedding_catalog.get("version") == 1, "Unexpected wedding-project version")
    require(wedding_catalog.get("couple", {}).get("groomDisplayName") == "张帅", "Unexpected groom display name")
    require(wedding_catalog.get("couple", {}).get("brideDisplayName") == "董小姐", "Unexpected bride display name")
    require(wedding_catalog.get("couple", {}).get("strokeCharacters") == ["张", "董"], "Unexpected wedding stroke coverage")
    require(wedding_catalog.get("date", {}).get("display") == "2026.09.12", "Unexpected wedding date")
    require(wedding_catalog.get("location") == "延安", "Unexpected wedding location")
    require(len(wedding_catalog.get("stages", [])) == 5, "Expected five wedding story stages")
    require(len(wedding_catalog.get("formats", [])) == 3, "Expected three wedding delivery formats")
    require(len(wedding_catalog.get("assumptions", [])) == 3, "Expected explicit wedding assumptions")
    simulation = wedding_catalog.get("simulation", {})
    require(simulation.get("status") == "DEMO_ONLY", "Simulated wedding data must be marked DEMO_ONLY")
    require(simulation.get("brideFullName") == "董雅宁", "Unexpected simulated bride full name")
    require(simulation.get("ceremonyTime") == "11:58", "Unexpected simulated ceremony time")
    require("演示场地" in simulation.get("venue", ""), "Simulated venue must identify itself")
    require("请替换" in simulation.get("address", ""), "Simulated address must request replacement")
    require(len(simulation.get("timeline", [])) == 3, "Expected three simulated timeline entries")
    require(len(simulation.get("photoScenes", [])) == 3, "Expected three simulated photo scenes")
    media_policy = simulation.get("mediaPolicy", {})
    require(media_policy.get("fictionalIdentity") is True, "AI sample must use a fictional identity")
    require(media_policy.get("aiGenerated") is True, "AI sample must declare generated media")
    require(media_policy.get("realPersonReferenceUsed") is False, "AI sample must not claim a real-person reference")
    for index, scene in enumerate(simulation["photoScenes"], start=1):
        require(scene.get("eyebrow") == f"AI SIMULATED PHOTO 0{index}", f"Missing AI label for photo scene {index}")
        require(scene.get("asset", "").endswith(".webp"), f"Missing web image for photo scene {index}")
        require(scene.get("sourceAsset", "").endswith(".png"), f"Missing source image for photo scene {index}")
        require(scene.get("renderAsset", "").startswith("wedding-ai/"), f"Missing render image for photo scene {index}")
        require(bool(scene.get("alt")), f"Missing alt text for photo scene {index}")

    sample_delivery = json.loads(WEDDING_SAMPLE_DELIVERY.read_text(encoding="utf-8"))
    require(sample_delivery.get("status") == "EXPLORATION_SAMPLE", "Unexpected complete sample status")
    require(sample_delivery.get("identityPolicy", {}).get("coupleIsFictionalVisual") is True, "Sample manifest must declare a fictional couple visual")
    require(sample_delivery.get("identityPolicy", {}).get("realPersonReferenceUsed") is False, "Sample manifest must reject real-person reference use")
    require(len(sample_delivery.get("storyAssets", [])) == 3, "Expected three story assets in the sample manifest")
    require(len(sample_delivery.get("deliverables", [])) == 4, "Expected four sample deliverables")
    require(len(sample_delivery.get("formalReplacementChecklist", [])) >= 5, "Formal replacement checklist is incomplete")

    wedding_composition = WEDDING_COMPOSITION.read_text(encoding="utf-8")
    for character in ("张", "董"):
        require(
            f'hanzi-writer-data/{character}.json' in wedding_composition,
            f"Missing wedding stroke data import: {character}",
        )
    for prop in ("groomDisplayName", "brideDisplayName", "date", "location", "vow", "closing"):
        require(prop in wedding_composition, f"Missing wedding video prop: {prop}")
    require("../../../web/data/wedding-zhangshuai-dong.json" in wedding_composition, "Wedding composition does not read the shared project")
    require('id="WeddingStory"' in remotion_root, "Missing wedding-story Remotion composition")

    wedding_screen_composition = WEDDING_SCREEN_COMPOSITION.read_text(encoding="utf-8")
    for character in ("张", "董"):
        require(
            f'hanzi-writer-data/{character}.json' in wedding_screen_composition,
            f"Missing wedding-screen stroke data import: {character}",
        )
    require("DEMO CONTENT · 模拟资料" in wedding_screen_composition, "Missing permanent screen-video simulation label")
    require("AI SIMULATED PHOTO 0" in wedding_screen_composition, "Missing screen-video AI photo labels")
    require('id="WeddingScreen"' in remotion_root, "Missing wedding-screen Remotion composition")
    require("width={1920}" in remotion_root and "height={1080}" in remotion_root, "Wedding screen is not 1920x1080")

    wedding_welcome_composition = WEDDING_WELCOME_COMPOSITION.read_text(encoding="utf-8")
    require("SIMULATION / DEMO ONLY" in wedding_welcome_composition, "Missing welcome-poster simulation label")
    require("AI SIMULATED PHOTO · 非真人照片" in wedding_welcome_composition, "Missing welcome-poster AI photo label")
    require('id="WeddingWelcomePoster"' in remotion_root, "Missing wedding welcome Still")

    videos = {
        "upstream_lan": verify_media(UPSTREAM_VIDEO, (10.4, 10.6)),
        "our_mang": verify_media(MANG_VIDEO, (12.7, 12.9)),
        "effects_lab": verify_media(EFFECTS_VIDEO, (31.5, 31.7)),
        "workbench_config": verify_media(WORKBENCH_VIDEO, (8.5, 8.7), minimum_size=800_000),
        "name_blessing": verify_media(NAME_BLESSING_VIDEO, (12.5, 12.6)),
        "wedding_story": verify_media(WEDDING_VIDEO, (19.9, 20.1)),
        "wedding_screen": verify_media(WEDDING_SCREEN_VIDEO, (24.9, 25.1), minimum_size=2_000_000, dimensions=(1920, 1080)),
    }
    images = {
        "wedding_screen_poster": verify_image(WEDDING_SCREEN_POSTER, (960, 540), 10_000),
        "wedding_welcome_png": verify_image(WEDDING_WELCOME_PNG, (1080, 1350), 500_000),
        "wedding_welcome_webp": verify_image(WEDDING_WELCOME_WEBP, (1080, 1350), 40_000),
        **{
            f"wedding_ai_source_{index}": verify_image(path, (1122, 1402), 1_500_000)
            for index, path in enumerate(WEDDING_AI_SOURCE_IMAGES, start=1)
        },
        **{
            f"wedding_ai_web_{index}": verify_image(path, (720, 900), 30_000)
            for index, path in enumerate(WEDDING_AI_WEB_IMAGES, start=1)
        },
    }
    scenario_clips = {
        scenario: verify_scenario_clip(clip, duration_range)
        for scenario, (duration_range, clip) in SCENARIO_CLIPS.items()
    }

    evidence_frames = sorted((PROJECT / "docs" / "evidence").glob("*.png"))
    require(len(evidence_frames) == 24, "Expected twenty-four retained evidence frames")

    print(
        json.dumps(
            {
                "status": "pass",
                "videos": videos,
                "scenario_clips": scenario_clips,
                "images": images,
                "page_sections": list(page_sections),
                "evidence_frames": [frame.name for frame in evidence_frames],
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
