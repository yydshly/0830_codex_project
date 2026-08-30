#!/usr/bin/env python3
"""Verify the self-media workflow research page without third-party packages."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "web" / "styles.css").read_text(encoding="utf-8")
    javascript = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    demo_html = (ROOT / "web" / "demo.html").read_text(encoding="utf-8")
    demo_css = (ROOT / "web" / "demo.css").read_text(encoding="utf-8")
    demo_javascript = (ROOT / "web" / "demo.js").read_text(encoding="utf-8")
    project = json.loads((ROOT / "project.json").read_text(encoding="utf-8"))

    for section_id in ("capabilities", "principle", "example", "meaning", "sources"):
        require(f'id="{section_id}"' in html, f"缺少页面章节：{section_id}")

    require(html.count("data-skill=") == 9, "能力地图必须包含 9 个 Skill")
    require(html.count("data-sample-tab=") == 3, "必须包含三个平台样例标签")
    require(html.count("data-sample-panel=") == 3, "必须包含三个平台样例面板")

    for marker in (
        'id="theme-toggle"',
        'class="system-orbit"',
        'class="value-loop"',
        'role="tablist"',
        "真实研究材料",
        "终稿确认不等于发布授权",
        'class="source-register"',
        "两个上游",
        "演示原料只负责",
    ):
        require(marker in html, f"展示页缺少关键标记：{marker}")

    require('@media (max-width: 760px)' in css, "缺少 390px 手机适配断点")
    require('prefers-reduced-motion' in css, "缺少 reduced-motion 支持")
    require('html[data-theme="dark"]' in css, "缺少深色主题")

    for function_name in ("applySkill", "activateSample", "applyTheme"):
        require(f"function {function_name}" in javascript, f"缺少交互函数：{function_name}")

    require('href="demo.html"' in html, "研究概览缺少完整演示入口")
    require(demo_html.count("data-stage=") == 9, "完整演示必须包含 9 个阶段")
    require(demo_html.count("data-stage-panel=") == 9, "完整演示必须包含 9 个阶段面板")
    require(demo_html.count("data-output=") == 3, "完整演示必须包含三个平台成稿标签")
    require(demo_html.count("data-output-panel=") == 3, "完整演示必须包含三个平台成稿面板")

    for marker in (
        "真实研究证据、平台稿未实际发布",
        "AWAITING_USER",
        "以下全部是合成演示数据，不是实际发布表现",
        'src="assets/genart-seed-grid.png"',
        'id="artifact-index"',
        'id="next-stage"',
        'id="scenario"',
        'class="scenario-timeline"',
        'class="input-lineage"',
        'class="responsibility-map"',
        "计划预算，不是效率承诺",
        'id="approval"',
        'id="approval-form"',
        'id="decision-receipt"',
        'id="revision-route"',
        'id="run-event-log"',
        'id="restart-demo"',
        'id="case-closure"',
        'class="closure-branch"',
        'class="closure-proof"',
        "这个案例证明了",
        "这个案例没有证明",
        'class="case-kpis"',
        'class="case-position"',
        'class="provenance-grid"',
        "演示的是内容工作流",
        "不是工作流依赖",
        'class="aba-diagram"',
        'class="trait-bars"',
        'class="platform-matrix table-scroll"',
        'id="stage-announcer"',
        'loading="lazy"',
    ):
        require(marker in demo_html, f"完整演示缺少关键标记：{marker}")

    for marker in (
        'html[data-theme="dark"]',
        "@media (max-width: 600px)",
        "prefers-reduced-motion",
    ):
        require(marker in demo_css, f"完整演示样式缺少：{marker}")

    for function_name in ("activateStage", "activateOutput", "applyTheme", "startRevision", "markRevisionReady"):
        require(f"function {function_name}" in demo_javascript, f"完整演示缺少交互函数：{function_name}")
    require("function restoreAnchor" in demo_javascript, "完整演示缺少深链接锚点恢复")
    require("function updateApprovalEligibility" in demo_javascript, "完整演示缺少人工审核门槛")
    require("function issueDecision" in demo_javascript, "完整演示缺少本地决策回执")
    require("function appendRunEvent" in demo_javascript, "完整演示缺少会话事件日志")
    require("function restartDemo" in demo_javascript, "完整演示缺少整套重启")
    require("READY_FOR_DRAFT_HANDOFF" in demo_javascript, "完整演示缺少批准后的本地交接状态")
    require("REVISION_IN_PROGRESS" in demo_javascript, "完整演示缺少返工进行中状态")
    require("REVISION_READY_FOR_REVIEW" in demo_javascript, "完整演示缺少返工重新待审事件")
    require("stageButtons.length - visitedStages.size" in demo_javascript, "批准门槛没有纳入 9 / 9 阶段检查")
    require('addEventListener("hashchange"' in demo_javascript, "完整演示缺少阶段深链接状态同步")
    require(demo_html.count("data-approval-check") == 4, "人工审核必须包含 4 项确认")
    require(demo_html.count('name="primary-platform"') == 3, "人工审核必须包含 3 个主平台选项")

    demo_files = (
        "README.md",
        "scenario.md",
        "content-task.md",
        "evidence-pack.md",
        "quality-gate.md",
        "publishing-package.md",
        "analytics-demo.md",
        "approval-record.md",
        "case-report.md",
        "platforms/xiaohongshu.md",
        "platforms/wechat.md",
        "platforms/short-video.md",
    )
    for relative_path in demo_files:
        source = ROOT / "demo-case" / relative_path
        download = ROOT / "web" / "downloads" / relative_path
        require(source.exists() and source.stat().st_size > 0, f"缺少演示源文件：{relative_path}")
        require(download.exists(), f"缺少网页下载文件：{relative_path}")
        require(source.read_bytes() == download.read_bytes(), f"网页下载文件与源文件不一致：{relative_path}")

    visual = ROOT / "web" / "assets" / "genart-seed-grid.png"
    require(visual.exists() and visual.stat().st_size > 100_000, "完整演示缺少真实 9-seed 视觉证据")

    require(
        project["demo_url"].endswith("/demos/self-media-content-workflow-research/"),
        "project.json 尚未配置 Research Hub 展示地址",
    )
    require(
        project.get("upstream_url") == "https://github.com/yanhua1010/self-media-content-workflow",
        "project.json 尚未配置真实上游仓库索引",
    )
    require((ROOT / "SOURCES.md").exists(), "缺少研究对象与案例原料来源索引")
    require("../docs/" not in html and "../README.md" not in html, "公开概览仍包含部署后失效的本地相对文档链接")
    require("TODO" not in html + css + javascript + demo_html + demo_css + demo_javascript, "网页交付物仍包含 TODO")

    print("Self Media Skills 研究页静态验证通过：核心总结、两级来源索引、单一业务场景、9 阶段案例、三平台成稿、11 个交付文件、精准返工与发布边界完整。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
