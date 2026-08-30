# 0830 Research Lab

[![Validate](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml)
[![Deploy Pages](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml)

这是一个面向长期探索的研究型 monorepo。根 README 是所有研究的总入口；每个子项目独立记录问题、方法、实验、结论与展示地址；[GitHub Pages 门户](https://yydshly.github.io/0830_codex_project/)负责汇总可浏览成果。

## 重点能力项目：replicate-video-ad

本项目研究如何把优秀参考视频转成另一产品可执行的视频生产架构，而不是复制原作品或直接生成最终成片。

- **项目能力**：抽取视频证据，拆解广告机制，迁移镜头因果，并输出分段 Prompt、连续性约束和 A/B 评估基线。
- **技术原理**：参考片先进入一次性分析层；证据与真实产品事实进入可复用架构层；最终由视频模型和后期流程执行，生成阶段默认不再输入原片。
- **使用场景**：产品发布片、电商功能广告、系列化内容、创意提案与供应商交接、模型或工作流评测。
- **后期价值**：形成模型无关的生产中间层、参考片模式库、自动化脚手架和团队质量标准。

[查看完整研究记录](projects/replicate-video-ad-demo/README.md) · [打开在线交互案例](https://yydshly.github.io/0830_codex_project/demos/replicate-video-ad-demo/) · [查看上游仓库](https://github.com/Jingyi-Wu-Richael/replicate-video-ad)

## 研究项目索引

<!-- PROJECTS:START -->
| 项目 | 原项目库 | 状态 | 简介 | 标签 | 最近更新 | 展示 |
| --- | --- | --- | --- | --- | --- | --- |
| [replicate-video-ad 能力研究与热门广告结构迁移实验](projects/replicate-video-ad-demo/README.md) | [查看原库](https://github.com/Jingyi-Wu-Richael/replicate-video-ad) | 已完成 | 验证 replicate-video-ad 如何完成视频证据抽取、广告机制迁移与生成约束，输出可脱离原片执行的新产品视频生产架构；它本身不直接生成视频。 | `ai-skill`、`video-analysis`、`prompt-engineering`、`ecommerce-ad`、`real-world-case`、`creative-strategy` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/replicate-video-ad-demo/) |
| [Kid Papercraft 情绪价值内容方法研究](projects/kid-papercraft-demo/README.md) | [查看原库](https://github.com/kaomei/kid-papercraft) | 已完成 | 从儿童纸艺 Prompt Skill 出发，验证人物一致性与图生视频边界，并沉淀为面向亲子、伴侣、长辈、宠物与自我的个性化情绪价值内容方法。 | `ai-skill`、`emotional-value`、`relationship-content`、`personalized-media`、`prompt-engineering`、`creative-method` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/kid-papercraft-demo/) |
| [汉字拆字视频能力演示](projects/hanzi-chaizi-video-demo/README.md) | — | 已完成 | 用七条真实视频、六场景、配置工作台、姓名祝福 MVP，以及同一对 AI 虚构人物贯穿请帖、大屏和迎宾海报的婚礼完整样例，说明笔画底座如何扩展为诚实标注、可替换的视觉交付产品。 | `remotion`、`hanzi`、`video-generation`、`tts`、`product-research` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/hanzi-chaizi-video-demo/) |
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

仓库已包含 Pages 部署工作流，并使用 GitHub Actions 作为发布源。每次修改 `main` 上的项目、站点或索引脚本都会自动部署。
