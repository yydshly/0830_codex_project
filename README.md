# 0830 Research Lab

[![Validate](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml)
[![Deploy Pages](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml)

这是一个面向长期探索的研究型 monorepo。根 README 是所有研究的总入口；每个子项目独立记录问题、方法、实验、结论与展示地址；[GitHub Pages 门户](https://yydshly.github.io/0830_codex_project/)负责汇总可浏览成果。

## 研究项目索引

<!-- PROJECTS:START -->
| 项目 | 原项目库 | 状态 | 简介 | 标签 | 最近更新 | 展示 |
| --- | --- | --- | --- | --- | --- | --- |
| [Motion Sticker Pack 能力地图](projects/motion-sticker-pack-demo/README.md) | [查看原库](https://github.com/kobingogo/motion-sticker-pack) | 暂停 | 用语义关键姿态、视频提示词工作台和用户回传成片，展示从提示词到外部生成、透明去背、质检与动态贴纸交付的完整闭环。 | `ai-skill`、`animated-stickers`、`image-to-video`、`media-pipeline`、`agent-workflow`、`capability-audit` | 2026-08-31 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/motion-sticker-pack-demo/) |
| [genart-skill 线条生成艺术演示与研究](projects/genart-skill-research/README.md) | [查看原库](https://github.com/camilleroux/genart-skill) | 暂停 | 用一个可操作的线条艺术网页，演示 genart-skill 怎样指导 AI 编写生成器：换 seed 生成不同画面、用同一 seed 还原同一画面，并批量预览、检查和导出。线条效果由本项目实现，原库提供的是方法和工具。 | `ai-skill`、`generative-art`、`creative-coding`、`determinism`、`playwright` | 2026-08-31 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/genart-skill-research/) |
| [可组合红蓝仿真工作台](projects/composable-simulation-workbench/README.md) | — | 暂停 | 面向合成、封闭环境的双阵营多实体仿真产品前置设计：模型、地图、场景、指令、运动、态势显示、回放与插件扩展。 | `simulation-platform`、`architecture`、`scenario-editor`、`situation-display`、`deterministic-replay` | 2026-08-31 | — |
| [Atlasnote Skills 能力地图与落地工作台](projects/atlasnote-skills-page-analysis/README.md) | [查看原库](https://atlasnote.ai/zh-CN/skills) | 暂停 | 全量拆解 Atlasnote 81 项能力的领域、形态、链路和采用方式，以九类官方仓库核验建立采用边界，并把参考模式改造成个人 Codex Skill 草案。 | `capability-analysis`、`workflow-design`、`agent-skills`、`tooling`、`agent-evaluation`、`knowledge-systems` | 2026-08-31 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/atlasnote-skills-page-analysis/) |
| [Anthropic FDE 面试指南深度研究](projects/anthropic-fde-interview-guide-research/README.md) | — | 已完成 | 从 FDE 概念、企业 AI 交付原理与岗位能力出发，对 Chill Interview 指南做逐节核验，并形成面试路线与可验证实践方案。 | `fde`、`anthropic`、`agentic-ai`、`interview-research`、`enterprise-ai` | 2026-08-31 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/anthropic-fde-interview-guide-research/) |
| [Self Media Skills 内容工作流研究](projects/self-media-content-workflow-research/README.md) | [查看原库](https://github.com/yanhua1010/self-media-content-workflow) | 已完成 | 研究 9 个 Agent Skills 如何把想法组织成多平台可发布内容包，并用可替换的真实研究样例演示证据、质检、人工审核与精准返工闭环。 | `ai-skill`、`content-workflow`、`self-media`、`agent-architecture`、`human-in-the-loop` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/self-media-content-workflow-research/) |
| [replicate-video-ad 能力研究与热门广告结构迁移实验](projects/replicate-video-ad-demo/README.md) | [查看原库](https://github.com/Jingyi-Wu-Richael/replicate-video-ad) | 已完成 | 验证 replicate-video-ad 如何完成视频证据抽取、广告机制迁移与生成约束，输出可脱离原片执行的新产品视频生产架构；它本身不直接生成视频。 | `ai-skill`、`video-analysis`、`prompt-engineering`、`ecommerce-ad`、`real-world-case`、`creative-strategy` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/replicate-video-ad-demo/) |
| [Rembrandt 肖像能力工作台](projects/portrait-workbench-mvp/README.md) | [查看原库](https://github.com/okooo5km/rembrandt-portrait-lighting) | 已完成 | 用产品、探索与架构三种模式完整展示 Rembrandt Portrait Lighting 的操作闭环、研究证据、场景方向和系统边界。 | `ai-skill`、`portrait-workflow`、`product-prototype`、`quality-review`、`research-evidence`、`knowledge-workbench`、`frontend` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/portrait-workbench-mvp/) |
| [Kid Papercraft 情绪价值内容方法研究](projects/kid-papercraft-demo/README.md) | [查看原库](https://github.com/kaomei/kid-papercraft) | 已完成 | 从儿童纸艺 Prompt Skill 出发，验证人物一致性与图生视频边界，并沉淀为面向亲子、伴侣、长辈、宠物与自我的个性化情绪价值内容方法。 | `ai-skill`、`emotional-value`、`relationship-content`、`personalized-media`、`prompt-engineering`、`creative-method` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/kid-papercraft-demo/) |
| [汉字拆字视频能力演示](projects/hanzi-chaizi-video-demo/README.md) | [查看原库](https://github.com/Mr-funny/hbg-hanzi-chaizi-video) | 已完成 | 用七条真实视频、六场景、配置工作台、姓名祝福 MVP，以及同一对 AI 虚构人物贯穿请帖、大屏和迎宾海报的婚礼完整样例，说明笔画底座如何扩展为诚实标注、可替换的视觉交付产品。 | `remotion`、`hanzi`、`video-generation`、`tts`、`product-research` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/hanzi-chaizi-video-demo/) |
<!-- PROJECTS:END -->

## 归档专题：从 FDE 网页研究到可组合仿真产品探索

这条研究链已经阶段性完成并归档。起点是对 [Chill Interview 的 Anthropic FDE 面试指南](https://www.chillinterview.com/learn/interview-guides/anthropic-forward-deployed-engineer-fde-interview-guide)进行公开内容拆解，再用 Anthropic 官方职位和工程资料核验岗位、Agent、工具、上下文与 Evals；随后把“从业务结果反推最小系统”的方法应用到个人军工仿真经验，形成一个暂停实现的产品架构探索。

```text
第三方 FDE 指南
→ 官方资料核验与能力地图
→ FDE Field Guide 交互式 Web
→ 军工仿真重复建设问题
→ 可组合红蓝仿真工作台前置设计
→ 当前归档，按明确试点恢复
```

| 层级 | 当前状态 | 主要产物 | 入口 |
| --- | --- | --- | --- |
| 原网页理解 | 已完成 | FDE 概念、网页逐节解析、企业 Agent 原理、面试路线、来源证据 | [研究 README](projects/anthropic-fde-interview-guide-research/README.md) |
| Web 展示 | 已完成并接入 GitHub Pages | 角色关系、七步闭环、架构、样例、场景、军工专题、路线和自评 | [在线 FDE Field Guide](https://yydshly.github.io/0830_codex_project/demos/anthropic-fde-interview-guide-research/) |
| 研究归档 | 已完成 | 定稿理解、证据边界、下游关系、恢复条件 | [归档总结](projects/anthropic-fde-interview-guide-research/docs/07-archive-summary.md) |
| 落地探索 | 暂停 | 合成红蓝仿真产品 Charter、参考场景、语义、契约、架构 ADR 与技术 Spike | [可组合仿真工作台](projects/composable-simulation-workbench/README.md) |
| 后续实现 | 未开始 | 只有出现明确用户、试点场景、负责人和验收指标后才恢复 | [恢复说明](projects/composable-simulation-workbench/docs/07-archive-handoff.md) |

最重要的结论是：FDE 不是“更会写 Prompt”，而是对业务问题、生产实现、安全边界、评测、上线采用和产品复用形成闭环；仿真工作台则只是这套方法在一个候选领域中的应用。它当前是可恢复的产品与架构档案，不是已经实现或经过现实验证的软件。

## 暂时归档研究：genart-skill 线条生成艺术演示

### 一句话回顾

**在我们的演示里，它就是一个指导 AI 用代码制作线条艺术的 Skill。** 输入一个作品编号会生成一张线条图；换编号得到新图，再输入旧编号可以画回原图；还可以一次预览很多张、检查结果和下载文件。

> 需要特别分清：**线条效果是我们写的生成器画出来的，genart-skill 提供的是“怎么写生成器、怎么保证可以重画、怎么批量检查”的方法和工具。** 所以原库不只限于线条，只是我们选择线条作为最直观的演示。

[打开线条艺术演示](https://yydshly.github.io/0830_codex_project/demos/genart-skill-research/) · [查看完整研究](projects/genart-skill-research/README.md) · [阅读归档结论](projects/genart-skill-research/docs/archive-summary.md) · [访问原库](https://github.com/camilleroux/genart-skill)

### 它是怎么工作的

```text
输入作品编号（seed）
        ↓
我们编写的生成器画出线条、颜色和文字
        ↓
genart-skill 帮助 AI 检查同一编号能否画回同一张
        ↓
批量预览、发现异常、导出图片
```

### 能用在哪里

- **品牌视觉**：批量生成同一风格的海报、包装纹样和社交图片。
- **游戏内容**：生成地图、装备纹样、怪物外观，并根据编号恢复玩家遇到的画面。
- **数字艺术**：生成一组编号不同、但风格统一的作品。
- **数据视觉**：把不同数据变成不同的颜色、线条、密度或形状。
- **开发检查**：修改绘图代码后，检查原来的作品是否发生了意外变化。

### 对我们有什么意义

它能把“AI 临时画出一张效果图”变成“以后还能找到、重画、批量生产和检查的一套作品”。项目已经把这种做法整理成可复用的 Codex Skill；下次要做品牌系列、游戏生成内容或程序化视觉时，可以直接复用。

如果只是临时生成一张图片，不关心以后能否重画或批量管理，直接使用图像模型会更简单。当前研究已经回答核心问题，因此状态为**暂停**，需要真实项目时再恢复。

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
