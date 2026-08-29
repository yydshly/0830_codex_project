# 0830 Research Lab

[![Validate](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml)
[![Deploy Pages](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml)

这是一个面向长期探索的研究型 monorepo。根 README 是所有研究的总入口；每个子项目独立记录问题、方法、实验、结论与展示地址；[GitHub Pages 门户](https://yydshly.github.io/0830_codex_project/)负责汇总可浏览成果。

## 研究项目索引

<!-- PROJECTS:START -->
_尚未创建研究项目。复制 `templates/research-project/` 即可开始第一个实验。_
<!-- PROJECTS:END -->

## 仓库结构

```text
.
├─ projects/                     # 真实研究项目，一项研究一个目录
├─ templates/research-project/   # 新项目模板
├─ scripts/research_hub.py       # 校验元数据、同步索引、生成展示门户
├─ site/                         # GitHub Pages 门户模板与静态资源
├─ .github/workflows/            # 持续校验和 Pages 部署
└─ README.md                     # 仓库总入口与自动生成的项目索引
```

## 开始一项研究

1. 将 `templates/research-project/` 复制到 `projects/<project-slug>/`。
2. 修改项目目录中的 `project.json`；其中 `slug` 必须与目录名一致。
3. 在项目 README 中写明研究问题、可复现实验、发现与局限。
4. 同步根目录索引并进行本地检查：

   ```powershell
   python scripts/research_hub.py sync
   python scripts/research_hub.py check
   ```

5. 推送到 `main`。校验工作流会检查所有项目，Pages 工作流会更新展示门户。

完整约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 研究约定

- 问题先行：每个项目首先陈述待验证的问题，而不是先堆实现。
- 过程可复现：记录环境、输入、命令、数据来源与关键决策。
- 结论有边界：同时写清证据、失败尝试、限制和下一步。
- 子项目独立：项目自行管理依赖、测试和运行方式，避免相互污染。
- 展示可追溯：演示页面必须能回到对应源码与研究记录。

## GitHub Pages

仓库已包含 Pages 部署工作流。首次推送后，请在仓库 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。之后每次修改 `main` 上的项目、站点或索引脚本都会自动部署。

