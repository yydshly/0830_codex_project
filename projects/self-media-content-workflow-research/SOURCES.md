# 来源索引与证据关系

本项目同时引用两个开源仓库，但它们承担完全不同的角色。这个文件是对外发布时的统一来源索引。

## 1. 研究对象：self-media-content-workflow

| 字段 | 内容 |
| --- | --- |
| 原始仓库 | [`yanhua1010/self-media-content-workflow`](https://github.com/yanhua1010/self-media-content-workflow) |
| 固定提交 | [`c4602993ee744e3ceae4a9bfb8760b92d9338aad`](https://github.com/yanhua1010/self-media-content-workflow/tree/c4602993ee744e3ceae4a9bfb8760b92d9338aad) |
| 分支 / 版本 | `main` / `0.1.0` |
| 许可证 | MIT；原文本保存在 `upstream/LICENSE` |
| 本地快照 | `upstream/`，只读研究证据 |
| 作用 | 本项目真正审计、解释和演示的内容工作流架构 |

它提供 9 个 Agent Skills，以及从想法、简报、证据、多平台创作、素材、质检、人工确认、发布包到复盘的流程规范。它是本研究所有“这个库能做什么”结论的对象。

更完整的获取记录见 [`UPSTREAM.md`](UPSTREAM.md)。

## 2. 可替换案例原料：genart-skill

| 字段 | 内容 |
| --- | --- |
| 原始仓库 | [`camilleroux/genart-skill`](https://github.com/camilleroux/genart-skill) |
| 案例固定提交 | [`3380ebc05d4d5b7e76554d410ecb56fc1b5812b0`](https://github.com/camilleroux/genart-skill/tree/3380ebc05d4d5b7e76554d410ecb56fc1b5812b0) |
| 版本 / 许可证 | `0.1.0` / MIT |
| 作用 | 为完整演示提供一个已有源码、实验、视觉和统计证据的真实内容主题 |
| 与研究对象的关系 | 不是依赖，不参与内容工作流运行，可以被其他主题替换 |

案例引用的材料包括固定源码、正常与故障对照、9-seed 网格图、500-seed census 和兼容性记录。网页使用的视觉副本保存在 `web/assets/genart-seed-grid.png`，内容事实集中在 `demo-case/evidence-pack.md`。

## 3. 我们的研究与交付层

| 类型 | 位置 | 用途 |
| --- | --- | --- |
| 能力、原理、场景与意义 | `docs/第一阶段研究报告.md` | 区分仓库能力、Agent 能力、条件能力和人工动作 |
| 研究概览页 | `web/index.html` | 图解 9 个 Skill、运行原理、使用场景、意义和边界 |
| 完整案例页 | `web/demo.html` | 演示单一场景、9 阶段、三平台内容、审核和精准返工 |
| 案例总报告 | `demo-case/case-report.md` | 汇总输入、决定、产物、状态分支、已证明与未证明结论 |
| 浏览器验收 | `docs/网页验收记录.md` | 记录源码页、构建态、多视口、主题、键盘和状态机证据 |

公开入口：

- [研究概览](https://yydshly.github.io/0830_codex_project/demos/self-media-content-workflow-research/)
- [完整案例](https://yydshly.github.io/0830_codex_project/demos/self-media-content-workflow-research/demo.html#scenario)
- [案例结论](https://yydshly.github.io/0830_codex_project/demos/self-media-content-workflow-research/demo.html#case-closure)

## 4. 不应混淆的结论

```text
self-media-content-workflow
被研究的工作流：负责把想法组织成可发布内容包
            │
            │ 处理
            ▼
genart-skill 实测
本次可替换的案例原料：提供真实证据和内容主题
            │
            ▼
三平台内容 + 质量门 + 人工审核 + 精准返工
我们的演示交付：尚未实际发布，外部写入为 0
```

- 不能把 `genart-skill` 的生成艺术能力说成 `self-media-content-workflow` 自带能力。
- 不能把案例中的三平台稿说成已在真实账号发布。
- 不能把 90 分钟演示计划说成真实生产效率或服务承诺。
- 可以把 `genart-skill` 换成产品测评、论文、项目复盘、行业研究或业务数据，继续使用同一内容工作流。
