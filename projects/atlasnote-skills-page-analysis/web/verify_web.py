from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
META_SKILL = ROOT / "skills" / "capability-to-skill"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"FAIL: {message}")


def main() -> None:
    html = (WEB / "index.html").read_text(encoding="utf-8")
    css = (WEB / "styles.css").read_text(encoding="utf-8")
    js = (WEB / "app.js").read_text(encoding="utf-8")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    inventory = (ROOT / "docs" / "06-capability-inventory-81.md").read_text(encoding="utf-8")
    verification_report = ROOT / "docs" / "12-representative-source-verification.md"

    rows = re.findall(
        r'^\s*\[(\d+),"([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)"',
        js,
        flags=re.MULTILINE,
    )
    require(len(rows) == 81, f"expected 81 capability records, found {len(rows)}")

    ids = [int(row[0]) for row in rows]
    slugs = [row[2] for row in rows]
    domains = {row[3] for row in rows}
    shapes = {row[4] for row in rows}
    stages = {row[5] for row in rows}
    require(ids == list(range(81)), "capability ids must be continuous from 0 through 80")
    require(len(set(slugs)) == 81, "capability slugs must be unique")
    require(len(domains) == 7, f"expected 7 domains, found {sorted(domains)}")
    require(len(shapes) == 9, f"expected 9 capability shapes, found {sorted(shapes)}")
    require(len(stages) == 7, f"expected 7 work-chain stages, found {sorted(stages)}")

    adoption_by_shape = {
        "connector": "integration",
        "executor": "direct",
        "workflow": "compose",
        "collection": "compose",
        "router": "compose",
        "rules": "adapt",
        "assets": "adapt",
        "evaluator": "adapt",
        "knowledge": "adapt",
    }
    adoption_counts = {mode: 0 for mode in ("direct", "compose", "adapt", "integration")}
    for row in rows:
        adoption_counts[adoption_by_shape[row[4]]] += 1
    require(sum(adoption_counts.values()) == 81, "adoption-mode classification must cover all records")
    require(all(adoption_counts.values()), f"each adoption mode needs records: {adoption_counts}")

    inventory_slugs = re.findall(r"https://atlasnote\.ai/zh-CN/skills/([^)]+)", inventory)
    require(len(inventory_slugs) == 81, "Markdown inventory must retain 81 source links")
    require(set(inventory_slugs) == set(slugs), "web data and Markdown inventory slugs differ")

    required_ids = {
        "main",
        "model",
        "classify",
        "field-guide",
        "shape-guide-grid",
        "gap-recommendation",
        "gap-code",
        "gap-result-title",
        "gap-result-summary",
        "gap-result-shapes",
        "gap-result-artifact",
        "gap-result-evidence",
        "gap-result-avoid",
        "apply-gap-builder",
        "filter-gap-shape",
        "explorer",
        "verification-lab",
        "verification-list",
        "verification-detail",
        "verify-tab-rules",
        "verify-tab-collection",
        "verify-tab-router",
        "verify-tab-workflow",
        "verify-tab-executor",
        "verify-tab-connector",
        "verify-tab-assets",
        "verify-tab-evaluator",
        "verify-tab-knowledge",
        "builder",
        "compose",
        "scenario-panel",
        "scenario-mapper",
        "scenario-mapper-title",
        "mapper-task",
        "mapper-status-line",
        "mapper-result-title",
        "mapper-result-summary",
        "mapper-gap-result",
        "mapper-shapes",
        "mapper-artifact",
        "mapper-evidence",
        "mapper-avoid",
        "mapper-capabilities",
        "open-mapped-demo",
        "apply-mapped-builder",
        "mapper-live",
        "tab-engineering",
        "tab-research",
        "tab-visual",
        "tab-product",
        "tab-knowledge",
        "personal",
        "search-input",
        "domain-filter",
        "shape-filter",
        "adoption-filter",
        "reset-filters",
        "capability-grid",
        "empty-state",
        "detail-dialog",
        "theme-toggle",
        "domain-counts",
        "shape-counts",
        "stage-counts",
        "adoption-grid",
        "selected-patterns",
        "selection-audit",
        "audit-state",
        "audit-role-count",
        "audit-overlap-count",
        "audit-integration-count",
        "audit-summary",
        "audit-signals",
        "audit-suggestion",
        "skill-form",
        "skill-name",
        "skill-task",
        "skill-trigger",
        "skill-output",
        "skill-validation",
        "skill-preview",
        "copy-skill",
        "download-skill",
    }
    html_ids = set(re.findall(r'id="([^"]+)"', html))
    require(required_ids <= html_ids, f"missing required DOM ids: {sorted(required_ids - html_ids)}")

    require("@media (max-width: 820px)" in css, "tablet breakpoint is missing")
    require("@media (max-width: 540px)" in css, "mobile breakpoint is missing")
    require("prefers-reduced-motion: reduce" in css, "reduced-motion fallback is missing")
    require(":focus-visible" in css, "visible keyboard focus styling is missing")
    require("<noscript>" in html, "no-script fallback is missing")
    require(not re.search(r'<(?:script|link)[^>]+(?:src|href)="https?://', html), "remote runtime asset found")

    for token in (
        "data-toggle-select",
        "data-adoption-filter",
        "buildSkillDraft",
        "normalizeSkillName",
        "navigator.clipboard",
        "new Blob",
        "state.selectedIds.size >= 6",
        "shapeGuides",
        "gapProfiles",
        "renderShapeGuide",
        "renderGapProfile",
        "analyzeSelection",
        "renderSelectionAudit",
        "data-guide-filter",
        "data-gap-select",
        "applyScenarioToBuilder",
        "data-demo-reset",
        "data-demo-prev",
        "data-demo-next",
        "data-demo-step",
        "data-apply-scenario",
        "aria-live=\"polite\"",
        "mappedCapabilities",
        "renderScenarioMapper",
        "openMappedScenarioDemo",
        "applyMappedScenarioToBuilder",
        "data-mapper-scenario",
        "data-mapper-gap",
        "verificationRecords",
        "renderVerificationLab",
        "locateVerifiedCapability",
        "data-verification-shape",
        "data-locate-verified",
    ):
        require(token in js, f"missing capability-to-skill behavior: {token}")

    verification_section = js.split("const verificationRecords = [", 1)[1].split("const shapeGuides = {", 1)[0]
    verification_shapes = re.findall(
        r'^\s{4}shape: "(rules|collection|router|workflow|executor|connector|assets|evaluator|knowledge)"',
        verification_section,
        flags=re.MULTILINE,
    )
    verification_item_ids = [
        int(value)
        for value in re.findall(r"^\s{4}itemId: (\d+)", verification_section, flags=re.MULTILINE)
    ]
    require(
        set(verification_shapes) == shapes and len(verification_shapes) == 9,
        f"expected one source-verification record per shape, found {verification_shapes}",
    )
    require(len(set(verification_item_ids)) == 9, "source-verification representatives must be unique")
    require(set(verification_item_ids) <= set(ids), "source-verification record references an unknown capability id")
    require(verification_section.count("verifiedFacts: [") == 9, "each verification record needs verified facts")
    require(verification_section.count("unverified:") == 9, "each verification record needs an unverified boundary")
    require(verification_section.count('reviewed: "2026-08-31"') == 9, "all verification records need a review date")
    require(verification_section.count('label: "官方仓库"') == 9, "each verification record needs an official repository source")
    require(verification_report.exists(), "representative source-verification report is missing")
    verification_text = verification_report.read_text(encoding="utf-8")
    require("未运行" in verification_text, "verification report must preserve the not-run boundary")
    require("docs/12-representative-source-verification.md" in readme, "README must link the source-verification report")

    require("scenario-logic" in html, "scenario relationship model is missing")
    mapper_scenarios = set(re.findall(r'data-mapper-scenario="([^"]+)"', html))
    mapper_gaps = set(re.findall(r'data-mapper-gap="([^"]+)"', html))
    require(mapper_scenarios == {"engineering", "research", "visual", "product", "knowledge"}, f"unexpected mapper scenarios: {sorted(mapper_scenarios)}")
    require(mapper_gaps == {"method", "tool", "constraint", "verification", "routing", "memory"}, f"unexpected mapper gaps: {sorted(mapper_gaps)}")
    scenario_doc = ROOT / "docs" / "11-scenario-relationship-demos.md"
    require(scenario_doc.exists(), "scenario relationship and demo guide is missing")
    require("docs/11-scenario-relationship-demos.md" in readme, "README must link the scenario demo guide")
    scenario_capability_sets = re.findall(r"capabilityIds:\s*\[([^\]]+)\]", js)
    scenario_demo_steps = re.findall(r"\{\s*phase:\s*\"", js)
    require(len(scenario_capability_sets) == 5, f"expected 5 scenario capability sets, found {len(scenario_capability_sets)}")
    require(len(scenario_demo_steps) == 25, f"expected 25 guided demo steps, found {len(scenario_demo_steps)}")
    for index, raw_set in enumerate(scenario_capability_sets, start=1):
        selected_ids = [int(value.strip()) for value in raw_set.split(",")]
        require(1 <= len(selected_ids) <= 6, f"scenario {index} must select between 1 and 6 capabilities")
        require(set(selected_ids) <= set(ids), f"scenario {index} references an unknown capability id")

    shape_guide_section = js.split("const shapeGuides = {", 1)[1].split("const gapProfiles = {", 1)[0]
    gap_profile_section = js.split("const gapProfiles = {", 1)[1].split("const scenarios = {", 1)[0]
    shape_guide_keys = re.findall(
        r'^\s{2}(rules|collection|router|workflow|executor|connector|assets|evaluator|knowledge):\s*\{',
        shape_guide_section,
        flags=re.MULTILINE,
    )
    gap_profile_keys = re.findall(
        r'^\s{2}(method|tool|constraint|verification|routing|memory):\s*\{',
        gap_profile_section,
        flags=re.MULTILINE,
    )
    require(len(shape_guide_keys) == 9, f"expected 9 shape field guides, found {shape_guide_keys}")
    require(len(gap_profile_keys) == 6, f"expected 6 gap profiles, found {gap_profile_keys}")

    skill_file = META_SKILL / "SKILL.md"
    openai_file = META_SKILL / "agents" / "openai.yaml"
    diagnostic_file = META_SKILL / "references" / "diagnostic-matrix.md"
    schema_file = META_SKILL / "references" / "blueprint-schema.md"
    selection_audit_file = META_SKILL / "references" / "selection-audit.md"
    for path in (skill_file, openai_file, diagnostic_file, schema_file, selection_audit_file):
        require(path.exists(), f"missing project-local meta-skill artifact: {path.relative_to(ROOT)}")
    skill_text = skill_file.read_text(encoding="utf-8")
    openai_text = openai_file.read_text(encoding="utf-8")
    require("name: capability-to-skill" in skill_text, "meta-skill name is missing")
    require("$capability-to-skill" in openai_text, "meta-skill default prompt must name the skill")
    require("references/selection-audit.md" in skill_text, "meta-skill must route complex selections to its audit reference")

    print("PASS: 81 unique capabilities, 7 domains, 9 shapes, 7 work-chain stages")
    print(f"PASS: 4 adoption modes cover all 81 records: {adoption_counts}")
    print("PASS: web data matches all 81 Markdown inventory source links")
    print("PASS: classification, selection, Skill generation, copy and download hooks exist")
    print("PASS: 9 shape field guides, 6 gap profiles and live selection-audit hooks exist")
    print("PASS: 5 scenario mappings contain 25 guided demo steps and valid Builder selections")
    print("PASS: personal mapper exposes 5 work contexts x 6 primary gaps with demo and Builder actions")
    print("PASS: 9 representative source-verification records cover all capability shapes with evidence boundaries")
    print("PASS: project-local capability-to-skill package is complete")
    print("PASS: required controls, responsive breakpoints, focus and reduced-motion fallbacks exist")
    print("PASS: no remote runtime assets")


if __name__ == "__main__":
    main()
