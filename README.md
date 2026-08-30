# 0830 Research Lab

[![Validate](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/validate.yml)
[![Deploy Pages](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml/badge.svg)](https://github.com/yydshly/0830_codex_project/actions/workflows/pages.yml)

这是一个面向长期探索的研究型 monorepo。根 README 是所有研究的总入口；每个子项目独立记录问题、方法、实验、结论与展示地址；[GitHub Pages 门户](https://yydshly.github.io/0830_codex_project/)负责汇总可浏览成果。

## 研究项目索引

<!-- PROJECTS:START -->
| 项目 | 原项目库 | 状态 | 简介 | 标签 | 最近更新 | 展示 |
| --- | --- | --- | --- | --- | --- | --- |
| [Motion Sticker Pack 能力地图](projects/motion-sticker-pack-demo/README.md) | [查看原库](https://github.com/kobingogo/motion-sticker-pack) | 暂停 | 用语义关键姿态、视频提示词工作台和用户回传成片，展示从提示词到外部生成、透明去背、质检与动态贴纸交付的完整闭环。 | `ai-skill`、`animated-stickers`、`image-to-video`、`media-pipeline`、`agent-workflow`、`capability-audit` | 2026-08-31 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/motion-sticker-pack-demo/) |
| [genart-skill 能力研究](projects/genart-skill-research/README.md) | [查看原库](https://github.com/camilleroux/genart-skill) | 暂停 | 研究 genart-skill 如何以知识、作品协议和 Playwright 工具，把模型编写的 Canvas/WebGL 生成器变成可复现、可批量验收的系统；通过玩家事件、六产品、六场景和品牌生产闭环验证，并转为项目内 Codex Skill。 | `ai-skill`、`generative-art`、`creative-coding`、`determinism`、`playwright` | 2026-08-31 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/genart-skill-research/) |
| [Atlasnote Skills 能力地图与落地工作台](projects/atlasnote-skills-page-analysis/README.md) | [查看原库](https://atlasnote.ai/zh-CN/skills) | 暂停 | 全量拆解 Atlasnote 81 项能力的领域、形态、链路和采用方式，以九类官方仓库核验建立采用边界，并把参考模式改造成个人 Codex Skill 草案。 | `capability-analysis`、`workflow-design`、`agent-skills`、`tooling`、`agent-evaluation`、`knowledge-systems` | 2026-08-31 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/atlasnote-skills-page-analysis/) |
| [Self Media Skills 内容工作流研究](projects/self-media-content-workflow-research/README.md) | [查看原库](https://github.com/yanhua1010/self-media-content-workflow) | 已完成 | 研究 9 个 Agent Skills 如何把想法组织成多平台可发布内容包，并用可替换的真实研究样例演示证据、质检、人工审核与精准返工闭环。 | `ai-skill`、`content-workflow`、`self-media`、`agent-architecture`、`human-in-the-loop` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/self-media-content-workflow-research/) |
| [replicate-video-ad 能力研究与热门广告结构迁移实验](projects/replicate-video-ad-demo/README.md) | [查看原库](https://github.com/Jingyi-Wu-Richael/replicate-video-ad) | 已完成 | 验证 replicate-video-ad 如何完成视频证据抽取、广告机制迁移与生成约束，输出可脱离原片执行的新产品视频生产架构；它本身不直接生成视频。 | `ai-skill`、`video-analysis`、`prompt-engineering`、`ecommerce-ad`、`real-world-case`、`creative-strategy` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/replicate-video-ad-demo/) |
| [Rembrandt 肖像能力工作台](projects/portrait-workbench-mvp/README.md) | [查看原库](https://github.com/okooo5km/rembrandt-portrait-lighting) | 已完成 | 用产品、探索与架构三种模式完整展示 Rembrandt Portrait Lighting 的操作闭环、研究证据、场景方向和系统边界。 | `ai-skill`、`portrait-workflow`、`product-prototype`、`quality-review`、`research-evidence`、`knowledge-workbench`、`frontend` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/portrait-workbench-mvp/) |
| [Kid Papercraft 情绪价值内容方法研究](projects/kid-papercraft-demo/README.md) | [查看原库](https://github.com/kaomei/kid-papercraft) | 已完成 | 从儿童纸艺 Prompt Skill 出发，验证人物一致性与图生视频边界，并沉淀为面向亲子、伴侣、长辈、宠物与自我的个性化情绪价值内容方法。 | `ai-skill`、`emotional-value`、`relationship-content`、`personalized-media`、`prompt-engineering`、`creative-method` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/kid-papercraft-demo/) |
| [汉字拆字视频能力演示](projects/hanzi-chaizi-video-demo/README.md) | [查看原库](https://github.com/Mr-funny/hbg-hanzi-chaizi-video) | 已完成 | 用七条真实视频、六场景、配置工作台、姓名祝福 MVP，以及同一对 AI 虚构人物贯穿请帖、大屏和迎宾海报的婚礼完整样例，说明笔画底座如何扩展为诚实标注、可替换的视觉交付产品。 | `remotion`、`hanzi`、`video-generation`、`tts`、`product-research` | 2026-08-30 | [在线查看](https://yydshly.github.io/0830_codex_project/demos/hanzi-chaizi-video-demo/) |
<!-- PROJECTS:END -->

## 暂时归档研究：genart-skill 生成艺术方法与验收工具

[`camilleroux/genart-skill`](https://github.com/camilleroux/genart-skill) 不是图像生成模型、滤镜库或某一种线条风格，而是一套给 AI 编程代理使用的**生成艺术知识、作品接口约定与浏览器验收工具**。它帮助模型把 Canvas / WebGL 创意代码做成同一输入可复现、不同输入可批量探索、结果可自动检查和导出的作品系统。本研究已完成阶段性验证，现标记为**暂停**；保留可运行演示、固定上游快照、实验产物与项目内 Codex Skill。

[打开在线演示](https://yydshly.github.io/0830_codex_project/demos/genart-skill-research/) · [查看完整研究](projects/genart-skill-research/README.md) · [阅读归档结论](projects/genart-skill-research/docs/archive-summary.md) · [访问原库](https://github.com/camilleroux/genart-skill)

### 项目描述

生成艺术真正的视觉能力来自创作者或模型编写的算法：它决定画什么、如何构图、采用何种粒子、曲线、颜色、光影和交互。`genart-skill` 位于这层之上，承担类似“创意技术规范 + QA 工具箱”的角色：规定作品怎样接收 seed、怎样报告 feature、怎样声明完成，并用 Playwright 批量截图、比较输出和生成联系表。

本项目用一个完整的 AERO 视觉身份生产案例，以及玩家事件、游戏世界、数据叙事、品牌、数字藏品和创意编程 CI 等场景进行验证。演示里的极简线条并不是原库自带风格，而是我们为解释流程自行实现的生成器；其视觉原理只是 seeded PRNG、贝塞尔曲线、径向渐变和排版的组合。

### 工作原理

```text
创作者 / 模型编写 Canvas、SVG 或 WebGL 生成器
                     ↓
genart-skill 方法层
知识：随机性、构图、颜色、性能与变体设计
协议：?hash=seed、render(seed)、features、done
工具：Playwright 截图、像素 SHA、A-B-A 回放、联系表与特征统计
                     ↓
单张作品 → 系列探索 → 回归检查 → 可追溯交付
```

同一个 seed 应得到同一张图，因此 seed 不再只是“随机数”，也成为作品地址、问题复现坐标和回归测试样本；把不同模块分配到独立随机流，还能避免修改背景时意外改变主体。联系表与特征统计负责判断整个系列的分布，而不只是主观欣赏一张幸运样本。

### 使用场景

- **游戏与互动内容**：按 seed 生成地图、关卡、战利品、怪物外观、技能纹样或玩家事件纪念图，并能准确复现异常结果。
- **品牌与营销生产**：在固定品牌语法下批量生成海报、社交卡片、包装纹样、发布会视觉和多画幅素材，再用联系表审核系列一致性。
- **数字艺术与收藏发行**：让每件作品具有稳定标识、可查询特征、稀有度统计、批量导出和可验证重绘能力。
- **数据驱动叙事**：把传感器、城市、气候或业务数据映射成颜色、密度、路径和节奏，并保留输入到画面的追溯关系。
- **创意编程研发与 CI**：对算法修改执行固定 seed 的 A-B-A 回放、像素指纹、性能与完成状态检查，发现不可控漂移。

它不适合替代照片级图像模型，也不会凭空提供成熟艺术方向。若任务只是一次性出一张图，且不需要复现、系列管理或自动验收，引入整套协议的收益有限。

### 对我们的意义

1. **把“模型灵感”变成工程资产**：创意代码可以被寻址、复现、测试、批量比较和交付，而不再停留在一次运行的偶然结果。
2. **建立模型与渲染器无关的中间层**：未来可替换 Canvas、Three.js、shader 或其他生成器，只要遵循统一作品协议，现有验收工具仍可复用。
3. **形成系列生产与质量标准**：从挑一张好看的图，升级为检查整个种子空间的风格稳定性、特征分布、失败样本和性能边界。
4. **沉淀为可直接调用的能力**：研究成果已整理为项目内 Codex Skill，包含协议、自动化脚本、测试夹具和产物目录约定，可迁移到新的生成艺术项目。

当前归档不代表能力失效，而是阶段性问题已经回答。若后续出现真实品牌批量生产、游戏资产生成、链上发行、数据艺术或跨项目创意 CI 需求，可按[归档总结](projects/genart-skill-research/docs/archive-summary.md)中的恢复条件重新启动。

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
