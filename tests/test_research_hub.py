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

    def test_build_site_refuses_output_outside_repository(self) -> None:
        config = research_hub.load_config()
        with tempfile.TemporaryDirectory() as outside:
            with self.assertRaisesRegex(research_hub.HubError, "必须位于当前仓库内"):
                research_hub.build_site([], config, Path(outside) / "site")


if __name__ == "__main__":
    unittest.main()
