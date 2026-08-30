# 九类代表项目：原仓库核验报告

复核日期：2026-08-31

这份报告解决一个容易被目录页面掩盖的问题：Atlasnote 把不同项目都放在“Skills”目录里，但它们的真实形态可能是规则文件、Skill 集合、工作流、CLI、MCP、组件源码平台、检测器或完整知识工具链。采用方式、运行前置和风险因此完全不同。

## 证据边界

- **已证实**：当前官方仓库、仓库内文件或官方文档直接支持的事实。
- **未验证**：尚未用独立样例复现的效果、质量、稳定性或环境兼容性。
- **未运行**：本项目没有安装或执行下列第三方项目，也没有授予其本地或外部权限。
- GitHub 的提交数、版本和仓库结构只作为维护信号，不证明质量、适配性或安全性。
- Atlasnote 的标题和摘要用于确认“目录怎样介绍它”；项目类型、安装、权限和许可均回到官方来源核对。

## 九类结论总览

| 能力形态 | 代表项目 | 真实项目类型 | 主要采用判断 |
| --- | --- | --- | --- |
| 行为规则 | multica-ai/andrej-karpathy-skills | CLAUDE.md + 插件/rule/Skill 适配 | 借鉴四条工程底线，不当执行器 |
| Skill 集合 | mattpocock/skills | 小职责工程 Skill 集 + setup | 只选 1–3 项组合，不整套重复安装 |
| 路由与元技能 | qiaomu-goal-meta-skill | 目标编译 Meta Skill + Python linter | 作为执行前目标契约层 |
| 端到端工作流 | Deep-Research-skills | 多阶段研究 Skills + Agent + modules | 借阶段产物与人工检查点，再逐步启用并行 |
| 确定性执行器 | agent-browser | Rust 浏览器 CLI + Skill/MCP | 测试站点、临时会话、只读任务起步 |
| 外部连接器 | paper-search-mcp | Python MCP + CLI + Skill | 开放来源优先，先完成来源/凭证集成 |
| 模板与设计系统 | shadcn/ui | 组件源码 Registry + CLI + Skill | 兼容项目可直接用，但必须审查生成 diff |
| 评测与治理 | Impeccable | 设计 Skill + Node CLI + hook | 固定版本做辅助质量门，人工体验复核 |
| 知识系统 | SwarmVault | CLI/engine/viewer/MCP/桌面端 | 先用离线小库验证检索价值，再扩展 provider |

## 1. 行为规则：Karpathy 四原则

- Atlasnote 条目：[写给编码代理的 Karpathy 四原则](https://atlasnote.ai/zh-CN/skills/andrej-karpathy-skills)
- 官方仓库：[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)
- 官方 Skill 目录：[skills/karpathy-guidelines](https://github.com/multica-ai/andrej-karpathy-skills/tree/main/skills/karpathy-guidelines)

Atlasnote 的说法：用短规则抑制错误假设、过度设计、无关改动和缺少验收的施工。

官方来源可确认：

1. README 将方法收敛为 Think Before Coding、Simplicity First、Surgical Changes、Goal-Driven Execution 四条原则。
2. 它可以作为 Claude Code 插件、项目 CLAUDE.md、Cursor rule 或 Skill 使用。
3. 作者建议与项目规则合并，不是替代项目规则；许可证为 MIT。

真实类型与前置：这是行为规则仓库，没有独立执行运行时。安装后改变的是 Agent 的长期行为上下文。

权限：不直接调用外部系统，但如果作为全局规则启用，会影响所有后续编码任务。官方 README 当前仍出现旧所有者路径，安装前需核对。

维护信号：官方仓库页列出 28 次提交；提交页当前显示最近一次合并在 2026-04-20。

未验证：本项目没有安装，也没有用对照任务测量返工变化。“Karpathy 启发”不等于 Karpathy 官方发布或背书。

采用判断：把四条原则改成自己的项目底线，用同一组小任务比较 diff 范围、澄清次数和测试证据；不要把它当成执行器。

## 2. Skill 集合：Matt Pocock Skills

- Atlasnote 条目：[小而可改的工程 skill 集](https://atlasnote.ai/zh-CN/skills/mattpocock-skills)
- 官方仓库：[mattpocock/skills](https://github.com/mattpocock/skills)
- 官方 Skills 目录：[skills/](https://github.com/mattpocock/skills/tree/main/skills)

Atlasnote 的说法：把需求澄清、规格、工单、TDD、架构检查和 bug 诊断拆成可组合的小闭环。

官方来源可确认：

1. README 明确把这些 Skills 定义为 small、easy to adapt、composable，允许只选择需要的子集。
2. Codex 等 Agent 可用 `npx skills@latest add mattpocock/skills` 安装。
3. 每个仓库需要运行一次 setup，选择 issue tracker、标签和文档路径；官方警告不要同时安装托管插件版与可编辑文件版。

真实类型与前置：多项小职责工程 Skill、setup 流程和少量脚本。通过 npx 安装需要 Node.js/npm 与支持 Agent Skills 的环境。

权限：随子 Skill 变化，可能读取/写入仓库文件、测试、文档或工单。不能用集合级介绍代替逐项脚本检查。

许可与维护：MIT；官方仓库页列出 457 次提交，并提供变更记录与更新流程。

未验证：没有逐项审查全部子 Skill，也没有在当前仓库运行 setup。

采用判断：只选择与你高频返工点直接对应的 1–3 项。最值得复用的是“小职责、可编辑、先配置仓库上下文”的组织方法。

## 3. 路由与元技能：qiaomu-goal-meta-skill

- Atlasnote 条目：[把模糊需求写成一条 /goal 指令](https://atlasnote.ai/zh-CN/skills/qiaomu-goal-meta-skill)
- 官方仓库：[joeseesun/qiaomu-goal-meta-skill](https://github.com/joeseesun/qiaomu-goal-meta-skill)
- 官方 linter：[lint_goal_command.py](https://github.com/joeseesun/qiaomu-goal-meta-skill/blob/main/scripts/lint_goal_command.py)

Atlasnote 的说法：把模糊需求转成包含结果、验证、约束、边界、迭代、完成和暂停条件的 `/goal`。

官方来源可确认：

1. README 给出上述七段目标契约和中英文兼容标签。
2. 仓库附带 Python linter，检查占位符、空洞验证和无限重试等问题。
3. 官方边界明确写明：只创建 `/goal`，不默认执行目标。

真实类型与前置：单一 Meta Skill + 本地 linter。通过 npx 安装需要 Node.js；执行 linter 需要 Python 3。

权限：主要生成文本目标；linter 读取目标文件。后续 `/goal` 可能请求更高权限，但那属于另一个执行阶段。

许可与维护：MIT；官方仓库页当前仅列出 1 次提交，历史样本较少。

未验证：没有运行 linter，也没有验证其默认选择是否适合所有任务，高风险领域仍需人工与官方资料。

采用判断：适合变成当前网页 Builder 的前置目标契约层。它解决“要做什么、做到何处”，不解决“谁来执行”。

## 4. 端到端工作流：Deep Research Skills

- Atlasnote 条目：[大纲先行的深度调研](https://atlasnote.ai/zh-CN/skills/deep-research-skills)
- 官方仓库：[Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills)
- 官方报告 Skill：[research-report/SKILL.md](https://github.com/Weizhena/Deep-Research-skills/blob/master/skills/research-en/research-report/SKILL.md)

Atlasnote 的说法：把大纲、补项目/字段、并行深挖和最终报告分开，用 JSON 中间产物支持增量研究。

官方来源可确认：

1. README 提供 outline、add items/fields、deep research 和 report 四类命令。
2. Codex 安装不只复制 Skills，还需安装 web-researcher Agent、检索模块、PyYAML 并启用 multi-agent 配置。
3. report Skill 从 JSON 结果生成 Markdown，并跳过 uncertain 值。

真实类型与前置：多阶段 Skills + 检索 Agent + 来源模块 + 脚本 + 测试。需要 Python/PyYAML、联网检索和宿主的多 Agent 能力。

权限：访问互联网、启动研究子 Agent，并在工作区写入 outline、字段定义、JSON 和 report.md。

许可与维护：MIT；官方仓库页列出 49 次提交，包含 tests 和 Codex 适配。

未验证：本项目没有运行并行检索，也没有验证引用正确性、覆盖率、成本或并发稳定性。

采用判断：先借“中间产物分阶段 + 人工检查点”，用一个小研究主题跑通后再启用并行。

## 5. 确定性执行器：agent-browser

- Atlasnote 条目：[给 agent 用的浏览器 CLI](https://atlasnote.ai/zh-CN/skills/agent-browser)
- 官方仓库：[vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)
- 官方 Skill 目录：[skills/agent-browser](https://github.com/vercel-labs/agent-browser/tree/main/skills/agent-browser)

Atlasnote 的说法：用确定性 CLI 与 CDP 驱动真实浏览器。

官方来源可确认：

1. 常规安装后还需运行 `agent-browser install` 下载 Chrome for Testing。
2. CLI 提供 accessibility snapshot、click/fill、截图、cookies/storage、网络拦截、CDP 与本地文件访问。
3. 只有从源码构建才需要 Node.js 24+、pnpm 11+ 和 Rust；许可证为 Apache-2.0。

真实类型与前置：Rust 原生浏览器 CLI，附带 Skill、MCP 和运行环境适配。真正执行能力来自 CLI。

权限：可读取/修改网页、cookies、storage、上传和下载；file access、CDP 与持久会话会扩大敏感数据范围。

维护信号：官方仓库页列出 646 次提交，含 benchmarks、evals、tests 与 changelog。

未验证：没有重新安装官方当前版本，也没有验证登录、验证码、站点条款和外部写操作；本项目用浏览器做页面验收不构成该项目版本认证。

采用判断：先在测试站点、临时会话、只读任务中使用；登录态、文件和外部写入逐步单独授权。

## 6. 外部连接器：Paper Search MCP

- Atlasnote 条目：[论文检索 MCP](https://atlasnote.ai/zh-CN/skills/paper-search-mcp)
- 官方仓库：[openags/paper-search-mcp](https://github.com/openags/paper-search-mcp)
- 官方能力矩阵：[README](https://github.com/openags/paper-search-mcp/blob/main/README.md)
- 官方许可证：[LICENSE](https://github.com/openags/paper-search-mcp/blob/main/LICENSE)

Atlasnote 的说法：多源并发搜索、去重，并明确分开“能搜、能下、能读”。

官方来源可确认：

1. 项目遵循 free-first 和 source transparency，并为每个来源列出 Search/Download/Read 能力矩阵。
2. `search_papers` 做多源并发与去重，`download_with_fallback` 优先开放获取链路。
3. 多数密钥可选；Unpaywall 需要邮箱；Google Scholar、SSRN 等存在上游限制；Sci-Hub 仅为可选且风险由用户承担。

真实类型与前置：Python 库 + MCP + CLI + Claude Code Skill。需要联网和 Python/uv、容器或 MCP 宿主之一。

权限：向多个学术服务发送查询并可能写入 PDF/文本；密钥、代理地址与下载内容都要按敏感数据和许可管理。

许可与维护：MIT；官方仓库页列出 50 次提交，包含 tests 与锁文件。

未验证：本项目没有调用实时论文 API，没有确认地区可用性、速率、去重质量或全文下载权。

采用判断：从 arXiv、OpenAlex、Crossref 等开放来源和只读检索开始，默认关闭法律边界不清的下载回退。

## 7. 模板与设计系统：shadcn/ui

- Atlasnote 条目：[shadcn/ui](https://atlasnote.ai/zh-CN/skills/ui)
- 官方仓库：[shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- 官方 CLI README：[packages/shadcn/README.md](https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/README.md)
- 官方许可证：[LICENSE.md](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)

Atlasnote 的说法：把组件源码搬进自己的项目，形成可拥有、可修改的组件资产。

官方来源可确认：

1. 官方定位是 Open Source、Open Code，并明确用于建立自己的组件库。
2. CLI 的 init 会配置项目与依赖，add 会把组件文件和依赖写入项目。
3. 官方仓库还提供 shadcn Agent Skill，围绕 CLI、registry、preset 与 components.json 工作。

真实类型与前置：组件源码 Registry + CLI + Skill。需要兼容前端项目、包管理器和相应框架/样式依赖。

权限：会写入源码、components.json、样式/变量并安装依赖；apply preset 可能重写配置与已检测组件。

许可与维护：MIT；官方仓库页列出 2,416 次提交，官方 package.json 当前显示 shadcn 4.16.2。

未验证：没有在当前项目运行 init/add，也没有验证框架版本、主题覆盖和可访问性。

采用判断：兼容项目可直接采用，但要固定版本并审查生成 diff。对个人 Skill 最值得借鉴的是“来源资产进入仓库，由你负责维护”的模式。

## 8. 评测与治理：Impeccable

- Atlasnote 条目：[Impeccable](https://atlasnote.ai/zh-CN/skills/impeccable)
- 官方仓库：[pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- 官方 package.json：[运行时与许可](https://github.com/pbakaus/impeccable/blob/main/package.json)
- 官方第三方声明：[NOTICE.md](https://github.com/pbakaus/impeccable/blob/main/NOTICE.md)

Atlasnote 的说法：用 59 条不依赖 LLM 的确定性规则扫描设计问题。

官方来源可确认：

1. CLI 可扫描目录、HTML 或 URL，并输出 CI 友好的 JSON。
2. 官方当前 README 已列出 61 条确定性问题，不是 Atlasnote 收录时的 59 条，说明规则数会变化。
3. 安装可加入项目 hook；Codex 还需要在 `/hooks` 中批准 hook。

真实类型与前置：设计 Skill + 命令集 + Node CLI + hook + 浏览器迭代工具。package.json 要求 Node.js >=22.18.0。

权限：detector 主要读取源码/DOM，但 Skill 命令可编辑 UI；安装会写入 Skill、hook 与 `.impeccable` 状态/配置。

许可与维护：Apache-2.0，NOTICE 列出第三方来源；官方仓库页列出 1,733 次提交。

未验证：没有运行 detector，也没有评估误报、漏报和自动修复；规则通过不等于体验优秀。

采用判断：固定版本、先只生成报告、为豁免记录理由，并始终保留人工体验与业务目标审查。

## 9. 知识系统：SwarmVault

- Atlasnote 条目：[SwarmVault](https://atlasnote.ai/zh-CN/skills/swarmvault)
- 官方仓库：[swarmclawai/swarmvault](https://github.com/swarmclawai/swarmvault)
- 官方 Providers 文档：[providers](https://www.swarmvault.ai/docs/providers)
- 官方桌面端：[swarmvault-desktop](https://github.com/swarmclawai/swarmvault-desktop)

Atlasnote 的说法：摄入文件或仓库，生成带来源的 Wiki 和知识图谱，并区分抽取、推断与存疑关系。

官方来源可确认：

1. quickstart 会初始化 vault、摄入来源、编译 wiki/graph 并打开本地查看器；heuristic 首跑不需要 API key。
2. 关系可标为 extracted、inferred、ambiguous，并有冲突检测、候选审批与带省略说明的 context pack。
3. 源代码在本地解析且不外发；配置云 provider 后，非代码文本可能发送给相应服务；heuristic 默认完全离线。

真实类型与前置：CLI/engine/viewer/MCP/桌面端完整工具链，附带 Agent Skill。CLI 要求 Node.js >=24，桌面端自带运行时。

权限：读取本地文件/仓库，写入 raw、wiki、state 与索引；云 provider、git commit 与自动化参数会扩大数据或写入范围。

许可与维护：MIT；官方仓库页列出 199 次提交，并包含 smoke、validation、worked examples、stability 和 changelog。

未验证：没有安装或验证大规模摄入、图谱正确率、删除传播、provider 隐私和长期索引稳定性。

采用判断：先用离线 heuristic 为一个小研究库建立来源、状态与删除规则；只有真实查询证明有价值后再启用模型和自动化。

## 对其余 72 项的含义

九类抽样证明，目录标题只适合做**发现入口**。其余条目在原仓库核验前，应保留为“Atlasnote 编辑摘要支持的能力线索”，不能自动推断：

- 它一定是一个标准 SKILL.md；
- 它无需额外运行时、凭证或实例；
- 它能在 Codex 中直接运行；
- 它的许可允许复制代码、资产或指令；
- 它在本机、当前版本和你的真实任务上已经有效。

下一步最小做法不是核完 81 个再开始，而是：从个人场景映射器选出 3–5 项候选，只核对准备实际采用的项目，并把核验结果与一个真实任务的运行证据一起保存。
