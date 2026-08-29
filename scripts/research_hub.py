#!/usr/bin/env python3
"""Validate research projects, sync the README index, and build the Pages portal."""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import sys
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
PROJECTS_DIR = ROOT / "projects"
SITE_DIR = ROOT / "site"
README_PATH = ROOT / "README.md"
CONFIG_PATH = ROOT / "hub.config.json"
INDEX_START = "<!-- PROJECTS:START -->"
INDEX_END = "<!-- PROJECTS:END -->"
ALLOWED_STATUSES = ("idea", "active", "paused", "complete")
STATUS_LABELS = {
    "idea": "构想",
    "active": "进行中",
    "paused": "暂停",
    "complete": "已完成",
}
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class HubError(Exception):
    """Raised when the repository does not meet the research hub contract."""


@dataclass(frozen=True)
class Project:
    slug: str
    title: str
    summary: str
    status: str
    tags: tuple[str, ...]
    started_at: str
    updated_at: str
    demo_url: str
    directory: Path


def read_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise HubError(f"缺少文件: {path.relative_to(ROOT)}") from exc
    except json.JSONDecodeError as exc:
        raise HubError(
            f"JSON 格式错误: {path.relative_to(ROOT)}:{exc.lineno}:{exc.colno} {exc.msg}"
        ) from exc
    if not isinstance(data, dict):
        raise HubError(f"JSON 顶层必须是对象: {path.relative_to(ROOT)}")
    return data


def required_text(data: dict[str, Any], field: str, source: Path) -> str:
    value = data.get(field)
    if not isinstance(value, str) or not value.strip():
        raise HubError(f"{source.relative_to(ROOT)}: `{field}` 必须是非空字符串")
    return value.strip()


def validate_date(value: str, field: str, source: Path) -> str:
    try:
        date.fromisoformat(value)
    except ValueError as exc:
        raise HubError(
            f"{source.relative_to(ROOT)}: `{field}` 必须使用 YYYY-MM-DD 格式"
        ) from exc
    return value


def validate_optional_url(value: Any, field: str, source: Path) -> str:
    if value in (None, ""):
        return ""
    if not isinstance(value, str):
        raise HubError(f"{source.relative_to(ROOT)}: `{field}` 必须是字符串")
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise HubError(f"{source.relative_to(ROOT)}: `{field}` 必须是完整的 HTTP(S) 地址")
    return value


def load_config() -> dict[str, str]:
    source = read_json(CONFIG_PATH)
    config: dict[str, str] = {}
    for field in ("title", "description", "repository_url", "pages_url"):
        config[field] = required_text(source, field, CONFIG_PATH)
    for field in ("repository_url", "pages_url"):
        config[field] = validate_optional_url(config[field], field, CONFIG_PATH)
    return config


def load_project(directory: Path) -> Project:
    source = directory / "project.json"
    data = read_json(source)
    slug = required_text(data, "slug", source)
    if not SLUG_PATTERN.fullmatch(slug):
        raise HubError(
            f"{source.relative_to(ROOT)}: `slug` 只能包含小写字母、数字和单个连字符"
        )
    if slug != directory.name:
        raise HubError(
            f"{source.relative_to(ROOT)}: `slug` ({slug}) 必须与目录名 ({directory.name}) 一致"
        )

    status = required_text(data, "status", source)
    if status not in ALLOWED_STATUSES:
        allowed = ", ".join(ALLOWED_STATUSES)
        raise HubError(f"{source.relative_to(ROOT)}: `status` 必须是 {allowed} 之一")

    tags_value = data.get("tags")
    if not isinstance(tags_value, list) or any(
        not isinstance(tag, str) or not tag.strip() for tag in tags_value
    ):
        raise HubError(f"{source.relative_to(ROOT)}: `tags` 必须是字符串数组")
    tags = tuple(dict.fromkeys(tag.strip() for tag in tags_value))

    started_at = validate_date(required_text(data, "started_at", source), "started_at", source)
    updated_at = validate_date(required_text(data, "updated_at", source), "updated_at", source)
    if updated_at < started_at:
        raise HubError(f"{source.relative_to(ROOT)}: `updated_at` 不能早于 `started_at`")
    if not (directory / "README.md").is_file():
        raise HubError(f"{directory.relative_to(ROOT)}: 缺少 README.md")

    return Project(
        slug=slug,
        title=required_text(data, "title", source),
        summary=required_text(data, "summary", source),
        status=status,
        tags=tags,
        started_at=started_at,
        updated_at=updated_at,
        demo_url=validate_optional_url(data.get("demo_url", ""), "demo_url", source),
        directory=directory,
    )


def load_projects() -> list[Project]:
    if not PROJECTS_DIR.is_dir():
        raise HubError("缺少 projects/ 目录")
    projects = [
        load_project(path)
        for path in PROJECTS_DIR.iterdir()
        if path.is_dir() and not path.name.startswith(".") and (path / "project.json").is_file()
    ]
    projects.sort(key=lambda item: (item.updated_at, item.slug), reverse=True)
    return projects


def markdown_cell(value: str) -> str:
    return value.replace("|", "\\|").replace("\n", " ")


def render_readme_index(projects: list[Project]) -> str:
    if not projects:
        return "_尚未创建研究项目。复制 `templates/research-project/` 即可开始第一个实验。_"

    rows = [
        "| 项目 | 状态 | 简介 | 标签 | 最近更新 | 展示 |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for project in projects:
        project_link = f"[{markdown_cell(project.title)}](projects/{project.slug}/README.md)"
        tags = "、".join(f"`{markdown_cell(tag)}`" for tag in project.tags) or "—"
        demo = f"[在线查看]({project.demo_url})" if project.demo_url else "—"
        rows.append(
            "| "
            + " | ".join(
                (
                    project_link,
                    STATUS_LABELS[project.status],
                    markdown_cell(project.summary),
                    tags,
                    project.updated_at,
                    demo,
                )
            )
            + " |"
        )
    return "\n".join(rows)


def expected_readme(projects: list[Project]) -> str:
    content = README_PATH.read_text(encoding="utf-8")
    if content.count(INDEX_START) != 1 or content.count(INDEX_END) != 1:
        raise HubError("README.md 必须各包含一个 PROJECTS:START 和 PROJECTS:END 标记")
    before, remainder = content.split(INDEX_START, 1)
    _, after = remainder.split(INDEX_END, 1)
    return f"{before}{INDEX_START}\n{render_readme_index(projects)}\n{INDEX_END}{after}"


def sync_readme(projects: list[Project]) -> bool:
    current = README_PATH.read_text(encoding="utf-8")
    expected = expected_readme(projects)
    if current == expected:
        return False
    README_PATH.write_text(expected, encoding="utf-8", newline="\n")
    return True


def render_project_card(project: Project, repository_url: str) -> str:
    tags = "".join(f"<li>{html.escape(tag)}</li>" for tag in project.tags)
    if not tags:
        tags = "<li>未分类</li>"
    source_url = f"{repository_url}/tree/main/projects/{project.slug}"
    demo_link = (
        f'<a class="button button-primary" href="{html.escape(project.demo_url, quote=True)}">查看展示</a>'
        if project.demo_url
        else ""
    )
    return f"""
      <article class="project-card" data-status="{project.status}" data-search="{html.escape(' '.join((project.title, project.summary, *project.tags)).lower(), quote=True)}">
        <div class="card-topline">
          <span class="status status-{project.status}">{STATUS_LABELS[project.status]}</span>
          <time datetime="{project.updated_at}">更新于 {project.updated_at}</time>
        </div>
        <h2>{html.escape(project.title)}</h2>
        <p>{html.escape(project.summary)}</p>
        <ul class="tags" aria-label="标签">{tags}</ul>
        <div class="card-actions">
          {demo_link}
          <a class="button" href="{html.escape(source_url, quote=True)}">研究记录与源码</a>
        </div>
      </article>""".strip()


def build_site(projects: list[Project], config: dict[str, str], output: Path) -> None:
    output = output.resolve()
    try:
        output.relative_to(ROOT.resolve())
    except ValueError as exc:
        raise HubError("站点输出目录必须位于当前仓库内") from exc
    if output == ROOT.resolve():
        raise HubError("拒绝将站点输出到仓库根目录")
    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(SITE_DIR, output)

    template_path = output / "index.html"
    template = template_path.read_text(encoding="utf-8")
    cards = "\n".join(render_project_card(item, config["repository_url"]) for item in projects)
    empty_state = "" if projects else """
      <div class="empty-state">
        <p class="eyebrow">Ready for the first question</p>
        <h2>第一项研究，从一个可验证的问题开始。</h2>
        <p>仓库骨架、索引校验和自动部署已经就绪。复制项目模板即可开始记录。</p>
      </div>""".strip()
    counts = {status: sum(project.status == status for project in projects) for status in ALLOWED_STATUSES}
    replacements = {
        "{{TITLE}}": html.escape(config["title"]),
        "{{DESCRIPTION}}": html.escape(config["description"]),
        "{{REPOSITORY_URL}}": html.escape(config["repository_url"], quote=True),
        "{{PROJECT_CARDS}}": cards,
        "{{EMPTY_STATE}}": empty_state,
        "{{PROJECT_COUNT}}": str(len(projects)),
        "{{ACTIVE_COUNT}}": str(counts["active"]),
        "{{COMPLETE_COUNT}}": str(counts["complete"]),
        "{{GENERATED_AT}}": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
    }
    for marker, value in replacements.items():
        template = template.replace(marker, value)
    unresolved = sorted(set(re.findall(r"{{[A-Z_]+}}", template)))
    if unresolved:
        raise HubError(f"站点模板仍有未解析标记: {', '.join(unresolved)}")
    template_path.write_text(template, encoding="utf-8", newline="\n")
    (output / ".nojekyll").write_text("", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("sync", help="根据项目元数据同步根 README 索引")
    subparsers.add_parser("check", help="校验项目元数据和 README 索引，不写入文件")
    build_parser = subparsers.add_parser("build", help="生成可部署的静态门户")
    build_parser.add_argument("--output", type=Path, default=ROOT / "_site")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        config = load_config()
        projects = load_projects()
        if args.command == "sync":
            changed = sync_readme(projects)
            print("README 项目索引已更新。" if changed else "README 项目索引无需更新。")
        elif args.command == "check":
            current = README_PATH.read_text(encoding="utf-8")
            if current != expected_readme(projects):
                raise HubError("README 项目索引不是最新状态；请运行 `python scripts/research_hub.py sync`")
            print(f"校验通过：{len(projects)} 个研究项目。")
        elif args.command == "build":
            output = args.output if args.output.is_absolute() else ROOT / args.output
            build_site(projects, config, output)
            print(f"门户已生成：{output.resolve()}")
    except (HubError, OSError) as exc:
        print(f"错误：{exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
