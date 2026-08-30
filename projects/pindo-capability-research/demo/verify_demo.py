#!/usr/bin/env python3
"""Verify the Pindo research artifact without third-party dependencies."""

from __future__ import annotations

import json
import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def sha256_text(path: Path) -> str:
    normalized = path.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def main() -> int:
    evidence = json.loads(
        (ROOT / "evidence" / "upstream-verification.json").read_text(encoding="utf-8")
    )
    sample_evidence = json.loads(
        (ROOT / "evidence" / "sample-cases.json").read_text(encoding="utf-8")
    )
    project_manifest = json.loads((ROOT / "project.json").read_text(encoding="utf-8"))
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    product_map = (ROOT / "docs" / "product-opportunity-map.md").read_text(encoding="utf-8")
    html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "web" / "styles.css").read_text(encoding="utf-8")
    javascript = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    require(len(evidence["commit"]) == 40, "上游提交号必须是完整 SHA")
    require(evidence["verification"]["tests"]["tests_passed"] == 13, "测试证据不完整")
    require(evidence["verification"]["build"]["exit_code"] == 0, "构建证据未通过")
    require(evidence["license_file_present"] is False, "许可证记录与研究结论不一致")
    require(evidence["source_snapshot_included"] is False, "不应再分发无明确许可证的源码")
    require(sample_evidence["upstream_commit"] == evidence["commit"], "样例与上游证据提交号不一致")
    require(
        all(name in project_manifest["summary"] for name in ("One", "Nine", "Constellation")),
        "项目摘要缺少 Rev15 三种记忆灯氛围",
    )
    require(len(sample_evidence["cases"]) == 4, "目标场景样例必须覆盖四类")
    scenario_names = {case["scenario"] for case in sample_evidence["cases"]}
    require(
        scenario_names == {"头像定制接单", "亲子一小时挂件", "工作坊复刻旧图", "大图分批续做"},
        "样例必须按四个真实任务组织",
    )
    for case in sample_evidence["cases"]:
        for field in ("user", "job", "constraint", "done_definition"):
            require(case.get(field), f"场景 {case['scenario']} 缺少任务字段：{field}")

    sample_inputs = {
        "portrait-gradient.svg": "d5f6ac2fca761a67afad3a537ee4cd9f873f4a3da7937aeeb7b58564ac87f02e",
        "pixel-mascot.svg": "f7c13836de8c20bc803c7480b2c68a0277c0ddfa5f89fb9a9736c0f1fd85c468",
        "grid-heart.svg": "adce513a1fc8b5137d1d164eecf78a89843073a3741cba2e67d15423808cd81d",
        "grid-heart-skewed.svg": "f2f35f1a064e69b7ec0c3179b4f0fc67dac2149f96aee8950a551de055d90743",
    }
    sample_outputs = {
        "portrait-fine-35.png": "28501d622e593c96cb8253bae887d7a1e2fd94a6f4b46caa38a471b3368865ed",
        "portrait-rough-35.png": "d948f1e04ec3d0389e1e3b59033bed681d9f5c2c3d2b2b3166d3284363aba5b5",
        "portrait-simple-35.png": "34704751a3914d98acc2b88ac6e7f1e86e12ce66ccfbfeb86e27d81cf8ffba2d",
        "pixel-mascot-simple-16.png": "1692871fceeba86bb3bb51b57266393a9f16496b704171c05cfc485d0a2b6046",
        "grid-heart-auto-13.png": "54fbe75b3e9e3fe3d2e5f8144f6cd53eb1968199f1d9db4b8d0c11947d65380d",
        "grid-heart-skewed-manual-12.png": "d42b6ea31bb6c86fd8441d7d9d870092fc0180911085048aa83aa1e525f4b019",
    }
    material_concepts = {
        "flower-mosaic.webp": "ef8e74b5b4e71cc421bc7cc1704183e2ccb2067353246ca1992d07379932813d",
        "fruit-mosaic.webp": "004c41cdc5cc05b3548b9ece78bc74f5e18714c614ceff21a371792f6e48aaff",
        "leaf-mosaic.webp": "c8c505532d823004181e157927803ad8cb986e3f708946608e0a883bdc6bff50",
        "tile-mosaic.webp": "e3395d734d47508003c63ccf041d3856518e8c740627d19e32f578c513f1d085",
        "light-mosaic.webp": "da15686bb6409f72a241f298b296c1579c479745e99e9ffb2dc092cc108a4931",
        "button-mosaic.webp": "1037989f9f9fe30ef1106019b69bb75a432f190ef4929b9bbf9abb57ab109ea4",
    }
    emotion_product_concepts = {
        "daily-ritual.webp": "c3da115144ef2bcbff3beccf14a0cc4382e4ee1d9ce2ff0dae6c2fd7fa170e91",
        "relationship-light.webp": "729bfbf00c1dd31d3d328c97a8f5dca2f0b57d4b886e804f5ee9a6f45dd1dd3e",
        "tactile-expression.webp": "17d04f3ed7e8e37f51f2e20c7ee7dde859095cd0680fa90f7a0044c5c1ae53b5",
        "memory-reuse.webp": "1ea7979f49be6bafd6e696f21dae2f43f784391e8dbb0ef6cfdf9dbcbaed42e9",
    }
    life_product_line_concepts = {
        "creator-platform.webp": "6e4f37e495373f69f053869f0266021b880a4af7aabe6ad57351eeb4bade811d",
        "emotional-gift.webp": "6de5a539634c65ff8af0619eaab3563fff1c8e859b77e46ea1f3cfa85e306be1",
        "life-ceremony.webp": "798332922b4fc4c967be55748fa1d06f4e33cd77c60b69a293433578e4385c84",
        "parent-child-growth.webp": "0e3227c68488641639c8ed806c6d284339b25cce7c21fdbc5c13b23d7afa748b",
        "pet-companion.webp": "46cf97a1045f444ebc606f01313718c9e2a58541f8e6f4bd930bac00b858ff41",
        "scent-memory.webp": "31bdaa7d42685a65d089da320a26f79cdb0b50cf2b2cf335104d0d6ad505eda3",
        "space-experience.webp": "d5b0ff3f281fe12bd306584024784fe7d8f8cb201bd41f150670bdd09121c60e",
        "voice-memory.webp": "6ebaedf51180a05ca9e098d7ba0bf9e1dfe13080b78ac8c8071ee1d1dbd5166b",
    }
    memory_lamp_concepts = {
        "nine-memory-lamp.webp": "9a9dfd9520f5ac4bf998a337c810af407e4d03b5f0d525c978119f7af2d11500",
        "nine-memory-lamp-content.webp": "5411d41cdbca1b22fc6ba2873c2d27a4f97654dba983e57bf9cd085beb80c4ea",
        "demo-couple-memory.webp": "ac614e66d1ffca970754407335e4a33b570dad192833c9f0ac57ce3628542ad4",
    }
    memory_atmosphere_concepts = {
        "memory-atmosphere-single.webp": "c9aa940328a39c7856889022ecabed74de7e1e072df9af92b579d1264f04d85b",
        "memory-atmosphere-nine.webp": "40a9c5f5e7a4985d87c93376bd02f99f95bb2c7e158524f2b57284fa893bdabf",
        "memory-atmosphere-constellation.webp": "7f963cb38e0712cd778d4b3cc81c2aea89489da06dfb9fa1d17c5fe1fed93077",
    }

    for filename, expected_hash in sample_inputs.items():
        canonical = ROOT / "samples" / "inputs" / filename
        deployed = ROOT / "web" / "assets" / "samples" / filename
        require(canonical.is_file(), f"缺少原创样例输入：{filename}")
        require(sha256_text(canonical) == expected_hash, f"原创样例输入哈希变化：{filename}")
        require(deployed.is_file() and sha256_text(deployed) == expected_hash, f"页面样例输入副本不一致：{filename}")

    for filename, expected_hash in sample_outputs.items():
        canonical = ROOT / "samples" / "outputs" / filename
        deployed = ROOT / "web" / "assets" / "samples" / filename
        require(canonical.is_file(), f"缺少 Pindo 实测输出：{filename}")
        require(canonical.read_bytes().startswith(b"\x89PNG\r\n\x1a\n"), f"输出不是 PNG：{filename}")
        require(canonical.stat().st_size > 4_000, f"输出图异常小：{filename}")
        require(sha256(canonical) == expected_hash, f"实测输出哈希变化：{filename}")
        require(deployed.is_file() and sha256(deployed) == expected_hash, f"页面样例输出副本不一致：{filename}")

    for filename, expected_hash in material_concepts.items():
        concept = ROOT / "web" / "assets" / "materials" / filename
        require(concept.is_file(), f"缺少跨材料概念素材：{filename}")
        require(concept.stat().st_size > 50_000, f"跨材料概念素材异常小：{filename}")
        require(concept.read_bytes()[:4] == b"RIFF" and concept.read_bytes()[8:12] == b"WEBP", f"素材不是 WebP：{filename}")
        require(sha256(concept) == expected_hash, f"跨材料概念素材哈希变化：{filename}")

    for filename, expected_hash in emotion_product_concepts.items():
        concept = ROOT / "web" / "assets" / "emotion-products" / filename
        require(concept.is_file(), f"缺少日常情绪产品概念素材：{filename}")
        require(concept.stat().st_size > 50_000, f"日常情绪产品概念素材异常小：{filename}")
        require(concept.read_bytes()[:4] == b"RIFF" and concept.read_bytes()[8:12] == b"WEBP", f"素材不是 WebP：{filename}")
        require(sha256(concept) == expected_hash, f"日常情绪产品概念素材哈希变化：{filename}")

    for filename, expected_hash in life_product_line_concepts.items():
        concept = ROOT / "web" / "assets" / "product-lines" / filename
        require(concept.is_file(), f"缺少生活产品线概念素材：{filename}")
        require(concept.stat().st_size > 50_000, f"生活产品线概念素材异常小：{filename}")
        require(concept.read_bytes()[:4] == b"RIFF" and concept.read_bytes()[8:12] == b"WEBP", f"素材不是 WebP：{filename}")
        require(sha256(concept) == expected_hash, f"生活产品线概念素材哈希变化：{filename}")

    for filename, expected_hash in memory_lamp_concepts.items():
        concept = ROOT / "web" / "assets" / "memory-lamp" / filename
        require(concept.is_file(), f"缺少九豆记忆灯概念素材：{filename}")
        require(concept.stat().st_size > 40_000, f"九豆记忆灯概念素材异常小：{filename}")
        require(concept.read_bytes()[:4] == b"RIFF" and concept.read_bytes()[8:12] == b"WEBP", f"素材不是 WebP：{filename}")
        require(sha256(concept) == expected_hash, f"九豆记忆灯概念素材哈希变化：{filename}")

    for filename, expected_hash in memory_atmosphere_concepts.items():
        concept = ROOT / "web" / "assets" / "memory-lamp" / filename
        require(concept.is_file(), f"缺少记忆灯氛围效果图：{filename}")
        require(concept.stat().st_size > 25_000, f"记忆灯氛围效果图异常小：{filename}")
        require(concept.read_bytes()[:4] == b"RIFF" and concept.read_bytes()[8:12] == b"WEBP", f"氛围效果图不是 WebP：{filename}")
        require(sha256(concept) == expected_hash, f"记忆灯氛围效果图哈希变化：{filename}")

    for heading in (
        "什么是拼豆",
        "研究问题",
        "原理",
        "场景样例实测",
        "已观察事实",
        "局限与风险",
        "对本研究仓库的意义",
    ):
        require(heading in readme, f"README 缺少章节：{heading}")

    for marker in (
        'id="bead-board"',
        'data-pattern="cat"',
        'data-pattern="heart"',
        'data-pattern="flower"',
        'data-mode="fine"',
        'data-mode="rough"',
        'data-mode="simple"',
        'id="usage-list"',
        'id="mode-note"',
        'role="tablist"',
        'data-sample-case="portrait"',
        'data-sample-case="pixel"',
        'data-sample-case="recognize"',
        'data-sample-case="focus"',
        'id="scenario-journey"',
        'id="scenario-user"',
        'id="scenario-job"',
        'id="scenario-constraint"',
        'id="scenario-done"',
        'id="focus-progress-demo"',
        'id="product-directions"',
        'id="quality-lab"',
        'data-quality-pass="structure"',
        'data-quality-pass="palette"',
        'data-quality-pass="grid"',
        'data-quality-pass="repair"',
        'id="quality-stack"',
        'id="quality-metric"',
        'id="element-world"',
        'data-material-world="flower"',
        'data-material-world="fruit"',
        'data-material-world="leaf"',
        'data-material-world="tile"',
        'data-material-world="light"',
        'data-material-world="button"',
        'class="material-rules"',
        'id="material-capabilities"',
        'id="material-product"',
        'id="product-matrix"',
        'class="platform-layers business-questions"',
        'data-product-line="creator"',
        'data-product-line="merchant"',
        'data-product-line="workshop"',
        'data-product-line="projects"',
        'data-product-line="platform"',
        'id="product-line-loop"',
        'id="product-line-modules"',
        'id="product-line-payer"',
        'id="product-line-alternative"',
        'id="product-line-business"',
        'id="product-line-channel"',
        'id="product-line-dependency"',
        'class="business-ladder"',
        'data-revenue-stage="tool"',
        'data-revenue-stage="commerce"',
        'data-revenue-stage="saas"',
        'data-revenue-stage="solution"',
        'data-revenue-stage="platform"',
        'class="matrix-roadmap business-roadmap"',
        'id="emotion-products"',
        'data-emotion-group="ritual"',
        'data-emotion-group="together"',
        'data-emotion-group="comfort"',
        'data-emotion-group="memory"',
        'id="emotion-image"',
        'id="emotion-product-cards"',
        'class="emotion-engine"',
        'class="emotion-roadmap"',
        'id="life-product-lines"',
        'class="memory-lamp-lab"',
        'class="memory-atmosphere-family"',
        'class="memory-atmosphere-tabs" role="tablist"',
        'data-memory-atmosphere="single"',
        'data-memory-atmosphere="nine"',
        'data-memory-atmosphere="constellation"',
        'id="memory-atmosphere-panel" role="tabpanel"',
        'id="memory-atmosphere-windows"',
        'id="memory-atmosphere-rhythm"',
        'id="memory-atmosphere-space"',
        'id="memory-atmosphere-role"',
        'assets/memory-lamp/memory-atmosphere-single.webp',
        'assets/memory-lamp/memory-atmosphere-nine.webp',
        'assets/memory-lamp/memory-atmosphere-constellation.webp',
        'data-memory-bean="0"',
        'data-memory-bean="8"',
        'id="memory-lamp-count"',
        'id="memory-bean-form"',
        'id="memory-bean-content-type"',
        'id="memory-bean-display-text"',
        'id="memory-bean-attachment"',
        'id="memory-load-demo"',
        'id="memory-clear-current"',
        'id="memory-cycle-title"',
        'id="memory-cycle-status" role="status" aria-live="polite"',
        'data-memory-cycle-mode="sequence"',
        'data-memory-cycle-mode="random"',
        'id="memory-cycle-interval"',
        'id="memory-cycle-toggle"',
        'id="memory-cycle-next"',
        'id="memory-cycle-phase-label"',
        'id="memory-run-showcase"',
        'id="memory-showcase-lock"',
        'aria-controls="memory-bean-grid"',
        'class="memory-lamp-architecture"',
        'class="memory-lamp-build-route"',
        'data-demand-target="memory-gift"',
        'data-demand-target="memory-reuse"',
        'data-demand-target="together"',
        'id="demand-target-panel"',
        'id="demand-target-job"',
        'id="demand-target-alternative"',
        'id="demand-target-delivery"',
        'id="demand-target-trigger"',
        'id="demand-target-validation"',
        'id="demand-target-source"',
        'data-life-line="ritual"',
        'data-life-line="family"',
        'data-life-line="voice"',
        'data-life-line="scent"',
        'data-life-line="kids"',
        'data-life-line="pet"',
        'data-life-line="moments"',
        'data-life-line="gift"',
        'data-life-line="spaces"',
        'data-life-line="studio"',
        'id="life-line-panel"',
        'id="life-line-image"',
        'id="life-line-personality"',
        'id="life-line-value"',
        'id="life-line-business"',
        'class="life-portfolio-system"',
        'data-product-goal="edit"',
        'data-product-goal="material"',
        'data-product-goal="make"',
        'data-product-goal="grow"',
        'id="product-impact-meter"',
        'id="roadmap-title"',
    ):
        require(marker in html, f"展示页缺少交互标记：{marker}")

    require("@media (max-width: 760px)" in css, "缺少手机断点")
    require("prefers-reduced-motion" in css, "缺少减少动态效果支持")
    require(".sample-stage" in css, "缺少样例对照布局")
    require(".scenario-brief" in css, "缺少真实任务卡布局")
    require(".scenario-journey" in css, "缺少场景任务链布局")
    require(".quality-workbench" in css, "缺少质量优化工作台布局")
    require(".quality-delta" in css, "缺少当前实测与增强目标对比")
    require(".material-workbench" in css, "缺少万物拼装工作台布局")
    require(".material-rules" in css, "缺少材料语法布局")
    require(".material-capabilities" in css, "缺少跨材料能力布局")
    require(".platform-matrix" in css, "缺少平台产品矩阵布局")
    require(".platform-layers" in css, "缺少四层平台结构")
    require(".product-line-lab" in css, "缺少近期产品线比较布局")
    require(".business-product-brief" in css, "缺少产品客户与付费定义布局")
    require(".business-ladder" in css, "缺少收入模式阶梯布局")
    require(".matrix-roadmap" in css, "缺少平台优先级路线")
    require(".emotion-products" in css, "缺少日常情绪产品实验室布局")
    require(".emotion-product-cards" in css, "缺少情绪产品卡片布局")
    require(".emotion-engine" in css, "缺少情绪价值转译机制布局")
    require(".life-product-lines" in css, "缺少十条生活产品线视觉展布局")
    require(".memory-lamp-lab" in css, "缺少九豆记忆灯概念与写入实验室")
    require(".memory-atmosphere-family" in css, "缺少三种记忆灯氛围的产品族布局")
    require(".memory-atmosphere-tabs" in css and '.memory-atmosphere-tabs button[aria-selected="true"]' in css, "缺少三张效果图同屏语义标签页样式")
    require(".memory-atmosphere-panel" in css, "缺少记忆灯氛围详情面板布局")
    require(".memory-bean-grid" in css, "缺少九颗记忆豆交互布局")
    require(".memory-write-panel" in css, "缺少记忆写入表单布局")
    require(".memory-cycle-controller" in css, "缺少九豆记忆灯自动循环控制布局")
    require('button[data-previewing="true"]' in css, "缺少当前展示豆的独立视觉状态")
    require('button[data-reveal-state="revealed"]' in css, "缺少灯内记忆显影状态")
    require('button[data-showcase-revealed="true"]' in css, "缺少 Nine 临时多窗显影的独立视觉状态")
    require('[data-cycle-phase="glow"]' in css, "缺少记忆退回柔光的视觉状态")
    require(".memory-showcase-lock" in css, "缺少临时展演的数据安全说明")
    require(".memory-lamp-architecture" in css, "缺少九豆记忆灯实现架构")
    require(".demand-truths" in css, "缺少市场事实、产品假设与付费验证分层")
    require(".demand-target-showcase" in css, "缺少可验证产品目标工作台")
    require(".demand-mvp-flow" in css, "缺少最小可售产品流程")
    require(".demand-validation" in css, "缺少产品目标付费验证门槛")
    require(".life-line-tabs" in css, "缺少生活产品线选择入口")
    require(".life-line-brief" in css, "缺少生活产品线价值与交付定义布局")
    require(".life-portfolio-system" in css, "缺少产品组合与优先级说明")
    require(".cap-status.partial" in css, "缺少未接通能力状态")
    require(".product-decision-shell" in css, "缺少产品方向决策台布局")
    require(".product-roadmap" in css, "缺少产品路线布局")
    require("renderBoard" in javascript, "缺少底板渲染逻辑")
    require("updateUsage" in javascript, "缺少用量统计逻辑")
    require("SAMPLE_CASES" in javascript, "缺少目标场景数据")
    require("renderSample" in javascript, "缺少目标场景渲染逻辑")
    require("scenarioJourney" in javascript, "缺少场景任务链渲染逻辑")
    require("QUALITY_PASSES" in javascript, "缺少质量优化能力数据")
    require("renderQualityPass" in javascript, "缺少质量优化状态渲染逻辑")
    require("MATERIAL_WORLDS" in javascript, "缺少万物拼装材料数据")
    require("renderMaterialWorld" in javascript, "缺少万物拼装状态渲染逻辑")
    require("PRODUCT_LINES" in javascript, "缺少近期产品线数据")
    require("renderProductLine" in javascript, "缺少近期产品线渲染逻辑")
    require("EMOTION_PRODUCT_GROUPS" in javascript, "缺少日常情绪产品数据")
    require("renderEmotionProductGroup" in javascript, "缺少日常情绪产品渲染逻辑")
    require("MEMORY_ATMOSPHERES" in javascript and "renderMemoryAtmosphere" in javascript, "缺少 One、Nine 与 Constellation 三种氛围的共享渲染逻辑")
    atmosphere_start = javascript.index("const MEMORY_ATMOSPHERES")
    atmosphere_end = javascript.index("const MEMORY_LAMP_STORAGE_KEY")
    atmosphere_code = javascript[atmosphere_start:atmosphere_end]
    require(all(name in atmosphere_code for name in ("single", "nine", "constellation")), "记忆灯氛围数据必须覆盖单灯、九灯与自由星群")
    require(all(key in atmosphere_code for key in ("ArrowRight", "ArrowLeft", "Home", "End")), "记忆灯氛围标签页缺少完整键盘切换")
    require('renderMemoryAtmosphere("nine")' in atmosphere_code, "记忆灯产品族应默认选择 Nine，以衔接九灯实验台")
    require("LIFE_PRODUCT_LINES" in javascript, "缺少十条生活产品线数据")
    require("renderLifeProductLine" in javascript, "缺少生活产品线效果图与价值信息渲染逻辑")
    require("DEMAND_TARGETS" in javascript, "缺少真实需求产品目标数据")
    require("renderDemandTarget" in javascript, "缺少真实需求产品目标渲染逻辑")
    require("MEMORY_BEAN_ROLES" in javascript, "缺少九种关系记忆能力数据")
    require("renderMemoryLamp" in javascript, "缺少九豆记忆灯状态渲染逻辑")
    require("MEMORY_LAMP_STORAGE_KEY" in javascript and "localStorage" in javascript, "缺少九豆记忆本地写入与持久化")
    require("createMemoryImagePreview" in javascript, "缺少灯内照片本地预览能力")
    require("MEMORY_CYCLE_PREFS_KEY" in javascript, "缺少独立的情绪循环偏好存储")
    require("presentedMemoryBean" in javascript and "selectedMemoryBean" in javascript, "展示态与编辑选择态没有分离")
    require("renderMemoryPresentation" in javascript, "缺少不重置表单的灯内展示渲染")
    require("startMemoryCycle" in javascript and "pauseMemoryCycle" in javascript, "缺少情绪循环开始与暂停逻辑")
    require("getNextPresentedMemoryBean" in javascript and "resetMemoryRandomQueue" in javascript, "缺少顺序与随机轮换逻辑")
    require('document.addEventListener("visibilitychange"' in javascript, "缺少后台页面自动停表")
    require("window.setTimeout" in javascript and "clearMemoryCycleTimer" in javascript, "缺少单计时器循环调度")
    require("MEMORY_SHOWCASE_DURATION" in javascript and "MEMORY_SHOWCASE_INTERVAL" in javascript, "缺少 30 秒展演时长与节奏")
    require("memoryCyclePhase" in javascript and 'memoryCyclePhase === "reveal"' in javascript, "缺少显影与柔光两阶段状态机")
    require("startMemoryShowcase" in javascript and "endMemoryShowcase" in javascript, "缺少临时展演启动与恢复逻辑")
    require("setMemoryShowcaseFormLock" in javascript and "syncForm: false" in javascript, "展演没有保护未提交表单")
    require("memoryShowcaseRevealIndices" in javascript and "refreshMemoryShowcaseRevealIndices" in javascript, "缺少 Nine 展演临时多窗集合")
    require("preferredCount ?? (1 + Math.floor(Math.random() * 3))" in javascript, "Nine 展演没有把随机显影数量限制为 1–3 窗")
    require("memoryShowcaseRevealIndices.includes(index)" in javascript and "button.dataset.showcaseRevealed" in javascript, "Nine 展演的临时随机窗口没有进入灯窗渲染状态")
    require("refreshMemoryShowcaseRevealIndices(3)" in javascript and "memoryShowcaseRevealIndices = []" in javascript, "Nine 展演没有初始化三窗效果或在退出时清理临时集合")
    require('get("demo") === "emotion"' in javascript, "缺少可直接打开的情绪展演链接")
    require("PRODUCT_DIRECTIONS" in javascript, "缺少产品方向数据")
    require("renderProductDirection" in javascript, "缺少产品方向渲染逻辑")
    require("ArrowRight" in javascript and "ArrowLeft" in javascript, "样例标签页缺少键盘导航")
    for heading in ("四类质量优化能力", "从“拼豆”到“万物拼装”", "从创意扩展到产品扩展", "五条产品扩展方向", "五层收入模式", "产品化推荐顺序", "日常情绪价值产品", "三个可验证产品目标", "记忆灯产品族", "十条生活产品线视觉版图", "四条产品方向", "推荐版本路线", "为什么 P0 不是", "需要继续验证的假设"):
        require(heading in product_map, f"产品机会文档缺少章节：{heading}")
    require("P0" in readme and "库存与成本规划" in readme and "万物拼装引擎" in readme, "README 缺少产品路线摘要")
    require(all(name in readme for name in ("Pindo Creator", "Pindo Merchant", "Pindo Workshop", "Pindo Projects", "Pindo Platform")), "README 缺少五条产品扩展方向")
    require(all(name in readme for name in ("情绪日历", "情绪氛围灯", "关系留言板", "触觉减压物", "记忆相框")), "README 缺少日常情绪产品摘要")
    require(all(name in readme for name in ("Pindo Ritual", "Pindo Together", "Pindo Voice", "Pindo Scent", "Pindo Kids", "Pindo Pet", "Pindo Moments", "Pindo Gift", "Pindo Spaces", "Pindo Studio")), "README 缺少十条生活产品线摘要")
    require(all(name in readme and name in product_map for name in ("Pindo One", "Pindo Nine", "Pindo Constellation")), "README 或产品机会图缺少三种记忆灯氛围")
    require("同屏语义标签页" in readme and "1–3" in readme and "1–3" in product_map, "Rev15 说明缺少三图同屏或 Nine 的 1–3 窗随机显影规则")
    for scenario in scenario_names:
        require(scenario in html and scenario in readme, f"页面或 README 缺少场景：{scenario}")
    require("TODO" not in readme + product_map + html + css + javascript, "交付物仍含 TODO")

    print("Pindo 研究子项目验证通过：4 个真实任务、4 类质量优化、6 种创意材料、5 条商业产品线、3 个真实需求产品目标、One / Nine / Constellation 三种记忆灯氛围、九窗常亮与 1–3 窗随机显影展演、8 个情绪产品方向和 10 条生活产品线机会库存完整。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
