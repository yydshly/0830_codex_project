from __future__ import annotations

import csv
import json
import sys
import zipfile
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
README = PROJECT_ROOT / "README.md"
ARTIFACTS = PROJECT_ROOT / "artifacts"
OUTPUT = ARTIFACTS / "extractor-output"
PROMPT = ARTIFACTS / "视频复刻提示词.md"
WEB = PROJECT_ROOT / "web"
REAL_CASE_PROMPT = WEB / "downloads" / "real-case-replication-pack.md"
METHOD = PROJECT_ROOT / "docs" / "从参考视频到新产品视频架构.md"
METHOD_MIRROR = WEB / "downloads" / "understanding-and-methodology.md"
REUSE_GUIDE = PROJECT_ROOT / "docs" / "能力沉淀与复用指南.md"
UPSTREAM_NOTE = PROJECT_ROOT / "docs" / "上游依赖与获取.md"
REUSE_GUIDE_MIRRORS = [
    WEB / "downloads" / "capability-reuse-guide.md",
    WEB / "downloads" / "能力沉淀与复用指南.md",
]
TEMPLATE_MIRRORS = {
    PROJECT_ROOT / "templates" / "任务输入模板.md": [
        WEB / "templates" / "任务输入模板.md",
        WEB / "downloads" / "new-task-input-template.md",
    ],
    PROJECT_ROOT / "templates" / "视频生产架构模板.md": [
        WEB / "templates" / "视频生产架构模板.md",
        WEB / "downloads" / "video-production-architecture-template.md",
    ],
    PROJECT_ROOT / "templates" / "A-B评估模板.md": [
        WEB / "templates" / "A-B评估模板.md",
        WEB / "downloads" / "ab-evaluation-template.md",
    ],
}


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def main() -> int:
    errors: list[str] = []
    required_files = [
        README,
        ARTIFACTS / "synthetic-reference.mp4",
        OUTPUT / "storyboard.jpg",
        OUTPUT / "frames.zip",
        OUTPUT / "frame_manifest.json",
        OUTPUT / "frame_manifest.csv",
        OUTPUT / "audio.mp3",
        PROMPT,
        ARTIFACTS / "热门广告复刻案例.md",
        WEB / "index.html",
        WEB / "styles.css",
        WEB / "app.js",
        WEB / "downloads" / "source-frame-manifest.json",
        WEB / "downloads" / "real-case-source.json",
        REAL_CASE_PROMPT,
        METHOD,
        METHOD_MIRROR,
        REUSE_GUIDE,
        UPSTREAM_NOTE,
        WEB / "assets" / "source" / "sampled-storyboard.jpg",
        WEB / "assets" / "adaptation" / "translation-earbuds-storyboard.jpg",
    ]

    for path in required_files:
        require(path.is_file() and path.stat().st_size > 0, f"missing or empty: {path}", errors)
    for path in [*REUSE_GUIDE_MIRRORS, *TEMPLATE_MIRRORS, *(mirror for mirrors in TEMPLATE_MIRRORS.values() for mirror in mirrors)]:
        require(path.is_file() and path.stat().st_size > 0, f"missing or empty reusable asset: {path}", errors)

    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        return 1

    manifest = json.loads((OUTPUT / "frame_manifest.json").read_text(encoding="utf-8"))
    require(manifest["source"] == "artifacts/synthetic-reference.mp4", "manifest source should be repository-relative", errors)
    require(manifest["local_source"] == "artifacts/synthetic-reference.mp4", "manifest local source should not expose a workstation path", errors)
    require(manifest["duration_seconds"] == 15.0, "duration should be 15 seconds", errors)
    require((manifest["width"], manifest["height"]) == (540, 960), "source should be 540x960", errors)
    require(manifest["sample_fps"] == 2.0, "sample rate should be 2 fps", errors)
    require(manifest["sample_interval_seconds"] == 0.5, "sample interval should be 0.5 seconds", errors)
    require(manifest["frame_count"] == 30, "manifest should contain 30 frames", errors)
    require(len(manifest["storyboard_frame_numbers"]) == 12, "storyboard should select 12 frames", errors)

    frame_files = sorted((OUTPUT / "frames").glob("frame_*.jpg"))
    sheets = sorted((OUTPUT / "contact_sheets").glob("sheet_*.jpg"))
    require(len(frame_files) == 30, "frames directory should contain 30 JPEGs", errors)
    require(len(sheets) == 3, "contact_sheets should contain 3 pages", errors)

    with zipfile.ZipFile(OUTPUT / "frames.zip") as archive:
        archived_frames = [name for name in archive.namelist() if name.endswith(".jpg")]
        require(archive.testzip() is None, "frames.zip contains a corrupt member", errors)
        require(len(archived_frames) == 30, "frames.zip should contain 30 JPEGs", errors)

    with (OUTPUT / "frame_manifest.csv").open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    require(len(rows) == 30, "CSV manifest should contain 30 data rows", errors)

    prompt_text = PROMPT.read_text(encoding="utf-8")
    required_sections = [
        "## 1. Source Summary",
        "## 2. Shot Timeline",
        "## 3. Adaptation Logic",
        "## 4. Copy-Ready Master Prompt",
        "## 5. Post-Production Copy",
        "## 6. Segmented Generation Plan",
        "## 7. Handoff Note",
    ]
    for section in required_sections:
        require(section in prompt_text, f"prompt is missing section: {section}", errors)
    for placeholder in ["【品牌】", "【产品名】", "【核心卖点】", "【可验证效果】", "【优惠信息】"]:
        require(placeholder in prompt_text, f"prompt is missing placeholder: {placeholder}", errors)

    web_text = (WEB / "index.html").read_text(encoding="utf-8")
    require("wDgH0FECdJs" in web_text, "web page should link the official source video", errors)
    require("github.com/yydshly/0830_codex_project/tree/main/projects/replicate-video-ad-demo" in web_text, "web page should link back to the public project record", errors)
    require("yydshly.github.io/0830_codex_project/" in web_text, "web page should link back to the research portal", errors)
    require("630 万播放" in web_text, "web page should identify the popular real-world source", errors)
    require(web_text.count('class="beat-tab') == 6, "web page should expose six structure beats", errors)
    require("WITHOUT SKILL" in web_text and "WITH SKILL" in web_text, "web page should show the ablation comparison", errors)
    require('id="operating-model"' in web_text, "web page should expose the shared operating model", errors)
    require(web_text.count('class="layer-card') == 3, "web page should expose three operating layers", errors)
    for phrase in ["原片可以退出生成流程", "结构上：可以", "真实产品事实", "视频生成模型", "剪辑、声音与法务"]:
        require(phrase in web_text, f"web page is missing shared-understanding phrase: {phrase}", errors)

    real_case_text = REAL_CASE_PROMPT.read_text(encoding="utf-8")
    for section in ["## 0. How to Use This Pack", "## 1. Source Summary", "## 2. Shot Timeline", "## 3. Adaptation Logic", "## 4. Copy-Ready Master Prompt", "## 5. Post-Production Copy", "## 6. Segmented Generation Plan", "## 7. Negative Constraints", "## 8. Editing & Finishing Plan", "## 9. Handoff Note"]:
        require(section in real_case_text, f"real-case pack is missing section: {section}", errors)
    for placeholder in ["【支持语言数", "【端到端翻译延迟", "【上市日期"]:
        require(placeholder in real_case_text, f"real-case pack is missing claim placeholder: {placeholder}", errors)

    for index in range(1, 7):
        require((WEB / "assets" / "source" / f"beat-{index:02}.jpg").is_file(), f"missing source evidence for beat {index}", errors)
        require((WEB / "assets" / "adaptation" / f"beat-{index:02}.jpg").is_file(), f"missing adaptation image for beat {index}", errors)

    method_text = METHOD.read_text(encoding="utf-8")
    require(method_text == METHOD_MIRROR.read_text(encoding="utf-8"), "published methodology mirror should match the canonical document", errors)
    for section in ["## 一句话共识", "## 三层能力模型", "## “只用拆解后的能力构造视频”是否成立", "## 推荐的实际工作流", "## Skill 的研究价值", "## 能力边界"]:
        require(section in method_text, f"methodology is missing section: {section}", errors)
    for phrase in ["生成阶段原则上不需要继续把原片交给视频模型", "真实产品事实", "产品与品牌资产", "视频生成能力", "后期制作"]:
        require(phrase in method_text, f"methodology is missing production boundary: {phrase}", errors)

    reuse_text = REUSE_GUIDE.read_text(encoding="utf-8")
    for mirror in REUSE_GUIDE_MIRRORS:
        require(reuse_text == mirror.read_text(encoding="utf-8"), f"reuse-guide mirror should match canonical document: {mirror}", errors)
    for section in ["## 长期定位", "## 后续可以直接复用什么", "## 每个新任务必须重新提供什么", "## 推荐复用方式", "## 完成标准", "## 当前成熟度"]:
        require(section in reuse_text, f"reuse guide is missing section: {section}", errors)
    for canonical, mirrors in TEMPLATE_MIRRORS.items():
        canonical_text = canonical.read_text(encoding="utf-8")
        for mirror in mirrors:
            require(canonical_text == mirror.read_text(encoding="utf-8"), f"template mirror should match canonical document: {mirror}", errors)

    readme_text = README.read_text(encoding="utf-8")
    for section in ["## 项目能力", "## 技术原理", "## 使用场景", "## 后期价值", "## 项目与文档索引"]:
        require(section in readme_text, f"README is missing public section: {section}", errors)
    for phrase in ["不是视频生成模型", "结构冻结后", "可脱离原片执行", "当前成熟度", "上游依赖与获取"]:
        require(phrase in readme_text, f"README is missing public capability boundary: {phrase}", errors)
    for phrase in ["能力沉淀与复用指南", "任务输入模板", "视频生产架构模板", "A/B 评估模板", "在线交互案例"]:
        require(phrase in readme_text, f"README is missing reusable capability asset: {phrase}", errors)

    upstream_note_text = UPSTREAM_NOTE.read_text(encoding="utf-8")
    for phrase in ["e143d2a7bc0d7c684b8164291799fe1ff48ed7dc", "没有提供 `LICENSE` 文件", "不把上游源码快照提交到远端", "-ExtractorPath"]:
        require(phrase in upstream_note_text, f"upstream dependency note is missing: {phrase}", errors)

    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        return 1

    print("PASS: reference video exists (15s, 540x960)")
    print("PASS: 30 sampled frames at 2 fps, 3 contact sheets, 12-frame storyboard")
    print("PASS: frame archive and JSON/CSV manifests are internally consistent")
    print("PASS: extracted audio and seven-section replication prompt are present")
    print("PASS: real-world Apple source case has six evidence-to-adaptation beats")
    print("PASS: original storyboard, claim controls, ablation, and production pack are present")
    print("PASS: three-layer methodology is documented and its published mirror is identical")
    print("PASS: reusable capability guide and three future-task templates are mirrored for publishing")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
