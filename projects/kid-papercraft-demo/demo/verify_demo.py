from pathlib import Path
import re
import sys


OUTPUT_PATH = Path(__file__).with_name("demo-output.md")
STYLE_ANCHOR = (
    "Warm organic lighting, tactile paper textures, gentle camera pan, "
    "soft pastel color palette, whimsical and cozy atmosphere."
)


def main() -> int:
    content = OUTPUT_PATH.read_text(encoding="utf-8")
    checks = {
        "three clip headings": len(re.findall(r"^### 🎬 Clip [123]:", content, re.MULTILINE)) == 3,
        "style anchor in every clip": content.count(STYLE_ANCHOR) == 3,
        "personalized Latin name": '"Happy Birthday Anan!"' in content,
        "personalized Chinese name and age": "安安" in content and "6 岁" in content,
        "child description included": "a cheerful six-year-old girl" in content,
        "no unresolved uppercase placeholders": re.search(r"\{[A-Z][A-Z0-9_]*\}", content) is None,
        "capability boundary disclosed": "尚未生成视频、音频或字幕文件" in content,
    }

    failed = False
    for label, passed in checks.items():
        marker = "PASS" if passed else "FAIL"
        print(f"[{marker}] {label}")
        failed = failed or not passed

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
