# 0830 Research Lab

[![Validate](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml)
[![Deploy Pages](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml)

这是一个面向长期探索的研究型 monorepo。根 README 是所有研究的总入口；每个子项目独立记录问题、方法、实验、结论与展示地址；[GitHub Pages 门户](https://yydshly.github.io/0830_codex_project/)负责汇总可浏览成果。

## 研究项目索引

<!-- PROJECTS:START -->
| 项目 | 原项目库 | 状态 | 简介 | 标签 | 最近更新 | 展示 |
| --- | --- | --- | --- | --- | --- | --- |
| [Self Media Skills 内容工作流研究](projects/self-media-content-workflow-research/README.md) | [查看原库](https://github.com/yanhua1010/self-media-content-workflow) | 已完成 | 研究 9 个 Agent Skills 如何把想法组织成多平台可发布内容包，并用可替换的真实研究样例演示证据、质检、人工审核与精准返工闭环。 | `ai-skill`、`content-workflow`、`self-media`、`agent-architecture`、`human-in-the-loop` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/self-media-content-workflow-research/) |
| [replicate-video-ad 能力研究与热门广告结构迁移实验](projects/replicate-video-ad-demo/README.md) | [查看原库](https://github.com/Jingyi-Wu-Richael/replicate-video-ad) | 已完成 | 验证 replicate-video-ad 如何完成视频证据抽取、广告机制迁移与生成约束，输出可脱离原片执行的新产品视频生产架构；它本身不直接生成视频。 | `ai-skill`、`video-analysis`、`prompt-engineering`、`ecommerce-ad`、`real-world-case`、`creative-strategy` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/replicate-video-ad-demo/) |
| [Rembrandt 肖像能力工作台](projects/portrait-workbench-mvp/README.md) | [查看原库](https://github.com/okooo5km/rembrandt-portrait-lighting) | 已完成 | 用产品、探索与架构三种模式完整展示 Rembrandt Portrait Lighting 的操作闭环、研究证据、场景方向和系统边界。 | `ai-skill`、`portrait-workflow`、`product-prototype`、`quality-review`、`research-evidence`、`knowledge-workbench`、`frontend` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/portrait-workbench-mvp/) |
| [Kid Papercraft 情绪价值内容方法研究](projects/kid-papercraft-demo/README.md) | [查看原库](https://github.com/kaomei/kid-papercraft) | 已完成 | 从儿童纸艺 Prompt Skill 出发，验证人物一致性与图生视频边界，并沉淀为面向亲子、伴侣、长辈、宠物与自我的个性化情绪价值内容方法。 | `ai-skill`、`emotional-value`、`relationship-content`、`personalized-media`、`prompt-engineering`、`creative-method` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/kid-papercraft-demo/) |
| [汉字拆字视频能力演示](projects/hanzi-chaizi-video-demo/README.md) | [查看原库](https://github.com/Mr-funny/hbg-hanzi-chaizi-video) | 已完成 | 用七条真实视频、六场景、配置工作台、姓名祝福 MVP，以及同一对 AI 虚构人物贯穿请帖、大屏和迎宾海报的婚礼完整样例，说明笔画底座如何扩展为诚实标注、可替换的视觉交付产品。 | `remotion`、`hanzi`、`video-generation`、`tts`、`product-research` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/hanzi-chaizi-video-demo/) |
<!-- PROJECTS:END -->

## 新增完整研究：Self Media Skills 内容工作流

[`self-media-content-workflow`](https://github.com/yanhua1010/self-media-content-workflow) 的核心不是“自动写一篇文案”，而是把**想法、简报、证据、多平台原生表达、素材、质检、人工审核、发布包和复盘**组织成可续跑的 Agent 工作流。

- **核心能力**：把一个模糊想法推进成有证据、分平台、可审核、可返工的内容包。
- **完整样例**：使用 `genart-skill` 的真实源码与实验研究作为可替换内容原料，生成小红书、公众号和短视频三套平台稿。
- **人工边界**：9 / 9 阶段、主平台和 4 / 4 人工确认全部满足后才能批准；事实、素材、平台或合规问题会返回准确阶段并重新检查下游。
- **自动化边界**：仓库不自带图片/视频模型、真实平台账号或全平台群发能力；所有外部写入仍需工具和单独授权。

[打开研究概览](https://yydshly.github.io/0830_codex_project/demos/self-media-content-workflow-research/) · [运行完整案例](https://yydshly.github.io/0830_codex_project/demos/self-media-content-workflow-research/demo.html#scenario) · [查看项目研究与复现说明](projects/self-media-content-workflow-research/README.md) · [查看上游仓库](https://github.com/yanhua1010/self-media-content-workflow)

## 最新能力项目：Rembrandt 肖像能力工作台

这是对上游 [`okooo5km/rembrandt-portrait-lighting`](https://github.com/okooo5km/rembrandt-portrait-lighting) 的可运行产品化研究：它不是新的修图模型或单图滤镜，而是把**主体诊断、伦勃朗布光约束、身份与关系锁定、多画幅规划、失败判定和定向重试**编译成可审查的肖像生产任务。

- **产品模式**：操作家庭多人肖像与个人品牌套图的输入 → 计划 → 规则 → 质检 → 交付闭环。
- **探索模式**：查看 8 个研究阶段、人物/宠物/多人真实证据、9 个场景与 7 个产品方向。
- **架构模式**：区分上游 Skill、宿主图像模型和我们系统的职责，并展示检测、生成、自动 QA 与产品基础设施的扩展路线。
- **对我们的价值**：把一次性的提示词经验沉淀为模型可替换、结果可拒收、任务可回放、团队可复用的生产中间层。

[打开在线工作台](https://yydshly.github.io/0830_codex_project/demos/portrait-workbench-mvp/) · [查看完整研究与验证记录](projects/portrait-workbench-mvp/README.md) · [查看上游固定提交](https://github.com/okooo5km/rembrandt-portrait-lighting/tree/28fc5e579142a37179e2443fdb17d17fb90248d6)

> 能力边界：当前静态工作台不会在浏览器中执行人物检测、分割或模型推理；多人“分别制作”是建立独立生成任务，不是像素无损抠图。上游固定快照未包含独立 `LICENSE`，商用前须另行完成授权、肖像权、隐私和数据删除审查。

## 重点能力项目：replicate-video-ad

本项目研究如何把优秀参考视频转成另一产品可执行的视频生产架构，而不是复制原作品或直接生成最终成片。

- **项目能力**：抽取视频证据，拆解广告机制，迁移镜头因果，并输出分段 Prompt、连续性约束和 A/B 评估基线。
- **技术原理**：参考片先进入一次性分析层；证据与真实产品事实进入可复用架构层；最终由视频模型和后期流程执行，生成阶段默认不再输入原片。
- **使用场景**：产品发布片、电商功能广告、系列化内容、创意提案与供应商交接、模型或工作流评测。
- **后期价值**：形成模型无关的生产中间层、参考片模式库、自动化脚手架和团队质量标准。

[查看完整研究记录](projects/replicate-video-ad-demo/README.md) · [打开在线交互案例](https://yydshly.github.io/0830_codex_project/demos/replicate-video-ad-demo/) · [查看上游仓库](https://github.com/Jingyi-Wu-Richael/replicate-video-ad)

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
