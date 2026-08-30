from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from scripts import research_hub


class ResearchHubTests(unittest.TestCase):
    def make_project(self, slug: str = "sample-study", **overrides: object) -> Path:
        temp_root = Path(tempfile.mkdtemp(dir=research_hub.ROOT / ".tmp"))
        self.addCleanup(lambda: __import__("shutil").rmtree(temp_root, ignore_errors=True))
        project_dir = temp_root / slug
        project_dir.mkdir()
        data: dict[str, object] = {
            "slug": slug,
            "title": "Sample Study",
            "summary": "A reproducible sample.",
            "status": "active",
            "tags": ["testing", "python"],
            "started_at": "2026-08-01",
            "updated_at": "2026-08-29",
            "upstream_url": "https://github.com/example/original-project",
            "demo_url": "https://example.com/demo",
        }
        data.update(overrides)
        (project_dir / "project.json").write_text(
            json.dumps(data), encoding="utf-8", newline="\n"
        )
        (project_dir / "README.md").write_text("# Sample\n", encoding="utf-8", newline="\n")
        return project_dir

    @classmethod
    def setUpClass(cls) -> None:
        (research_hub.ROOT / ".tmp").mkdir(exist_ok=True)

    def test_load_project_accepts_valid_metadata(self) -> None:
        project = research_hub.load_project(self.make_project())

        self.assertEqual(project.slug, "sample-study")
        self.assertEqual(project.status, "active")
        self.assertEqual(project.tags, ("testing", "python"))
        self.assertEqual(
            project.upstream_url, "https://github.com/example/original-project"
        )

    def test_load_project_rejects_directory_slug_mismatch(self) -> None:
        directory = self.make_project(slug="directory-name")
        data = json.loads((directory / "project.json").read_text(encoding="utf-8"))
        data["slug"] = "different-name"
        (directory / "project.json").write_text(json.dumps(data), encoding="utf-8")

        with self.assertRaisesRegex(research_hub.HubError, "必须与目录名"):
            research_hub.load_project(directory)

    def test_render_readme_index_escapes_table_delimiter(self) -> None:
        project = research_hub.load_project(
            self.make_project(title="A | B", summary="Compare X | Y")
        )

        rendered = research_hub.render_readme_index([project])

        self.assertIn("A \\| B", rendered)
        self.assertIn("Compare X \\| Y", rendered)
        self.assertIn("| 项目 | 原项目库 | 状态 |", rendered)
        self.assertIn(
            "[查看原库](https://github.com/example/original-project)", rendered
        )

    def test_upstream_url_is_optional(self) -> None:
        directory = self.make_project()
        data = json.loads((directory / "project.json").read_text(encoding="utf-8"))
        data.pop("upstream_url")
        (directory / "project.json").write_text(json.dumps(data), encoding="utf-8")

        project = research_hub.load_project(directory)

        self.assertEqual(project.upstream_url, "")
        self.assertIn("—", research_hub.render_readme_index([project]))
        self.assertNotIn(
            ">原项目库</a>",
            research_hub.render_project_card(
                project, "https://github.com/example/research-hub"
            ),
        )

    def test_upstream_url_rejects_non_http_value(self) -> None:
        directory = self.make_project(upstream_url="github.com/example/original")

        with self.assertRaisesRegex(research_hub.HubError, "upstream_url"):
            research_hub.load_project(directory)

    def test_project_card_links_to_upstream_repository(self) -> None:
        project = research_hub.load_project(self.make_project())

        rendered = research_hub.render_project_card(
            project, "https://github.com/example/research-hub"
        )

        self.assertIn('>原项目库</a>', rendered)
        self.assertIn('href="https://github.com/example/original-project"', rendered)
        self.assertIn('target="_blank" rel="noreferrer"', rendered)

    def test_build_site_refuses_output_outside_repository(self) -> None:
        config = research_hub.load_config()
        with tempfile.TemporaryDirectory() as outside:
            with self.assertRaisesRegex(research_hub.HubError, "必须位于当前仓库内"):
                research_hub.build_site([], config, Path(outside) / "site")

    def test_copy_project_demos_copies_optional_static_site(self) -> None:
        temp_root = Path(tempfile.mkdtemp(dir=research_hub.ROOT / ".tmp"))
        self.addCleanup(lambda: __import__("shutil").rmtree(temp_root, ignore_errors=True))
        projects_dir = temp_root / "projects"
        output = temp_root / "output"
        project_dir = self.make_project(slug="demo-study")
        demo_dir = project_dir / "web"
        demo_dir.mkdir()
        (demo_dir / "index.html").write_text("<h1>Demo</h1>", encoding="utf-8")
        output.mkdir()

        project = research_hub.load_project(project_dir)
        research_hub.copy_project_demos(
            [project], output, projects_dir=project_dir.parent
        )

        copied = output / "demos" / "demo-study" / "index.html"
        self.assertEqual(copied.read_text(encoding="utf-8"), "<h1>Demo</h1>")


if __name__ == "__main__":
    unittest.main()
