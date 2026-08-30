#!/usr/bin/env python3
"""Offline verification for the Portrait Workbench MVP."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parents[1]
WEB = PROJECT / "web"
MANIFEST = WEB / "data" / "workbench-fixtures.json"
PROVENANCE = WEB / "data" / "evidence-provenance.json"
SOURCE_PROJECT = ROOT / "projects" / "rembrandt-portrait-lighting-demo"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    project = load_json(PROJECT / "project.json")
    require(project["slug"] == PROJECT.name, "project slug must match directory")
    require(project["status"] in {"active", "complete"}, "project status is invalid")
    require(project["upstream_url"].endswith("rembrandt-portrait-lighting"), "upstream URL missing")

    data = load_json(MANIFEST)
    require(data["revision"] == 1, "fixture revision must be 1")
    require(data["product"] == "portrait-workbench-mvp", "fixture product mismatch")
    require(data["sourceSkill"]["name"] == "rembrandt-portrait-lighting", "source Skill mismatch")
    require(data["sourceSkill"]["upstreamCommit"] == "28fc5e579142a37179e2443fdb17d17fb90248d6", "upstream commit drifted")
    require(len(data["sourceSkill"]["responsibility"]) == 5, "Skill responsibilities must be explicit")
    require(len(data["sourceSkill"]["notIncluded"]) == 4, "system boundaries must be explicit")

    fixtures = {item["id"]: item for item in data["fixtures"]}
    require(set(fixtures) == {"family", "brand"}, "MVP must contain family and brand fixtures")
    family = fixtures["family"]
    brand = fixtures["brand"]
    require(len(family["subjects"]) == 2, "family fixture must record two subjects")
    require({plan["id"] for plan in family["plans"]} == {"preserve", "split"}, "family plan branches missing")
    require(len(family["plans"][0]["outputs"]) == 1, "family preserve must have one group output")
    require(len(family["plans"][1]["outputs"]) == 2, "family split must have two outputs")
    require(len(brand["subjects"]) == 1, "brand fixture must record one subject")
    brand_plan = brand["plans"][0]
    require(brand_plan["id"] == "kit", "brand kit plan missing")
    require([item["ratio"] for item in brand_plan["outputs"]] == ["1:1", "4:5", "3:4", "16:9"], "brand ratios must be 1:1, 4:5, 3:4 and 16:9")
    require("rejectedOutput" in brand_plan, "brand rejected retry evidence missing")

    evidence_assets: set[str] = set()
    for fixture in fixtures.values():
        evidence_assets.add(fixture["source"]["asset"])
        for subject in fixture["subjects"]:
            require(subject["locks"], f"{fixture['id']} subject locks missing")
        for plan in fixture["plans"]:
            require(len(plan["rules"]) == 4, f"{fixture['id']}/{plan['id']} must compile four rule groups")
            require({rule["origin"] for rule in plan["rules"]} == {"Skill", "Diagnostics", "Format", "Final check"}, f"{fixture['id']}/{plan['id']} rule origins drifted")
            require(plan["qa"], f"{fixture['id']}/{plan['id']} QA evidence missing")
            require(any(item["status"] == "partial" for item in plan["qa"]), f"{fixture['id']}/{plan['id']} must preserve manual-review boundaries")
            for output in plan["outputs"]:
                evidence_assets.add(output["asset"])
            rejected = plan.get("rejectedOutput")
            if rejected:
                evidence_assets.add(rejected["asset"])

    exploration_assets = {
        "assets/human-baseline.jpg",
        "assets/human-skill-guided.jpg",
        "assets/pet-source.jpg",
        "assets/pet-baseline.jpg",
        "assets/pet-skill-guided.jpg",
        "assets/pet-avatar-1x1.jpg",
    }
    evidence_assets.update(exploration_assets)

    for relative in evidence_assets:
        path = WEB / relative
        require(path.is_file() and path.stat().st_size > 10_000, f"missing or empty evidence asset: {relative}")

    provenance = load_json(PROVENANCE)
    require(provenance["upstream"] == project["upstream_url"], "provenance upstream URL drifted")
    require(provenance["upstreamCommit"] == data["sourceSkill"]["upstreamCommit"], "provenance commit drifted")
    recorded_hashes = provenance["assets"]
    require(set(recorded_hashes) == evidence_assets, "provenance asset inventory drifted")
    for relative, expected_hash in recorded_hashes.items():
        require(sha256(WEB / relative) == expected_hash, f"evidence hash changed: {relative}")

    source_pairs = {
        "assets/family-source.jpg": SOURCE_PROJECT / "web/assets/portrait-pair-original-web.jpg",
        "assets/family-group-4x3.jpg": SOURCE_PROJECT / "web/assets/effects/family-group-4x3-web.jpg",
        "assets/family-grandma.jpg": SOURCE_PROJECT / "web/assets/portrait-grandma-rembrandt.jpg",
        "assets/family-grandpa.jpg": SOURCE_PROJECT / "web/assets/portrait-grandpa-rembrandt.jpg",
        "assets/brand-source.jpg": SOURCE_PROJECT / "web/assets/case-study/human-signature/source-danni-koenig-web.jpg",
        "assets/brand-avatar-1x1.jpg": SOURCE_PROJECT / "web/assets/case-study/human-signature/avatar-1x1-web.jpg",
        "assets/brand-social-4x5.jpg": SOURCE_PROJECT / "web/assets/effects/human-social-4x5-web.jpg",
        "assets/brand-editorial-3x4.jpg": SOURCE_PROJECT / "web/assets/effects/human-editorial-3x4-web.jpg",
        "assets/brand-cover-16x9.jpg": SOURCE_PROJECT / "web/assets/case-study/human-signature/cover-16x9-web.jpg",
        "assets/brand-rejected-retry.jpg": SOURCE_PROJECT / "web/assets/case-study/human-signature/skill-guided-retry-web.jpg",
        "assets/human-baseline.jpg": SOURCE_PROJECT / "web/assets/case-study/human-signature/baseline-generic-web.jpg",
        "assets/human-skill-guided.jpg": SOURCE_PROJECT / "web/assets/case-study/human-signature/skill-guided-web.jpg",
        "assets/pet-source.jpg": SOURCE_PROJECT / "web/assets/case-study/source-black-longhair-dog-web.jpg",
        "assets/pet-baseline.jpg": SOURCE_PROJECT / "web/assets/case-study/baseline-generic-web.jpg",
        "assets/pet-skill-guided.jpg": SOURCE_PROJECT / "web/assets/case-study/skill-guided-web.jpg",
        "assets/pet-avatar-1x1.jpg": SOURCE_PROJECT / "web/assets/effects/pet-avatar-1x1-web.jpg",
    }
    if SOURCE_PROJECT.is_dir():
        for target_relative, source in source_pairs.items():
            target = WEB / target_relative
            require(source.is_file(), f"source evidence missing: {source.relative_to(ROOT)}")
            require(sha256(target) == sha256(source), f"copied evidence changed: {target_relative}")

    html = (WEB / "index.html").read_text(encoding="utf-8")
    css = (WEB / "styles.css").read_text(encoding="utf-8")
    js = (WEB / "app.js").read_text(encoding="utf-8")
    required_html = [
        'id="workbench"',
        'id="fixture-family"',
        'id="fixture-brand"',
        'id="fixture-upload"',
        'id="download-json"',
        'download="portrait-workbench-001.json"',
        "一个输入，两种任务结构",
        "一个身份锁，四个独立交付面",
        "不上传 · 不调用模型",
        'data-mode-target="product"',
        'data-mode-target="explore"',
        'data-mode-target="architecture"',
        "EXPLORATION LOG · REVISION 0—7",
        "9-SCENARIO EVIDENCE LAB",
        "7 PRODUCT DIRECTIONS",
        "SYSTEM RESPONSIBILITY MAP",
        "LIVE TASK PACKET",
        "RETRY 01 · REJECTED",
    ]
    for marker in required_html:
        require(marker in html, f"HTML marker missing: {marker}")
    require(html.count("data-research-panel=") == 8, "exploration timeline must preserve eight research stages")
    require(html.count("data-scenario-type=") == 9, "scenario lab must contain nine evidence-backed scenarios")
    require(html.count('class="direction-card"') == 7, "product map must contain seven directions")

    html_assets = set(re.findall(r'(?:src|href)="(assets/[^"?#]+)', html))
    require(html_assets <= evidence_assets, f"HTML has untracked assets: {sorted(html_assets - evidence_assets)}")
    for relative in html_assets:
        require((WEB / relative).is_file(), f"HTML asset missing: {relative}")

    required_js = [
        'fetch("data/workbench-fixtures.json"',
        'uploaded_to_server: false',
        'invoked_by_this_workbench: false',
        'detection_status: "pending"',
        'independent-generative-tasks-not-lossless-extraction',
        'candidate_evidence',
        'human_decision',
        'function setViewMode(',
        'function setResearchStage(',
        'function setScenarioFilter(',
        'function renderArchitecturePacket(',
    ]
    for marker in required_js:
        require(marker in js, f"JS boundary marker missing: {marker}")
    require(js.count("fetch(") == 1, "the static MVP may fetch only its local fixture manifest")

    required_css = [
        ':root[data-theme="dark"]',
        '.js .workbench',
        '@media (max-width: 820px)',
        '@media (max-width: 640px)',
        '@media (prefers-reduced-motion: reduce)',
        '.workbench:not([data-active-step="1"]) .input-panel',
        '.mode-switcher',
        '.exploration-workspace',
        '.scenario-grid',
        '.responsibility-pipeline',
    ]
    for marker in required_css:
        require(marker in css, f"CSS coverage marker missing: {marker}")

    print("PASS: portrait-workbench-mvp offline verification")
    print(f"  fixtures: {', '.join(fixtures)}")
    print(f"  evidence assets: {len(evidence_assets)} (all match the committed SHA-256 provenance manifest)")
    print("  modes: product workflow + eight-stage exploration + responsibility architecture")
    print("  preserved scope: 9 scenarios, 7 product directions, 3 evidence groups")
    print("  boundaries: no runtime detection, model call, automatic identity score or server upload")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
