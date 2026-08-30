# 81 个模块逐项能力解读

## 阅读说明

本清单按页面当前顺序编号。这里的“能力本质”是对 Atlasnote 摘要的二次归纳；“形态”说明它靠什么生效；“使用与注意”用于判断是直接采用、组合使用，还是只借鉴设计模式。

Star 数未纳入判断，因为传播度不等于适配度、安全性或真实效果。涉及安装和执行时仍需回到原仓库核对版本、许可证、脚本、权限与依赖。

## 0—20

| # | 模块 | 能力本质 | 形态 | 使用与注意 |
| ---: | --- | --- | --- | --- |
| 0 | [小而可改的工程 skill 集](https://atlasnote.ai/zh-CN/skills/mattpocock-skills) | 把需求澄清、规格、TDD 和疑难 bug 诊断拆成小闭环 | Skill 集合 | 适合日常编码；价值在“小而能改”，避免整套流程接管项目 |
| 1 | [Karpathy 四原则](https://atlasnote.ai/zh-CN/skills/andrej-karpathy-skills) | 用短规则抑制猜测、过度设计、无关改动和无验收施工 | 行为规则 | 适合作为全局底线；它是纪律，不是执行工具 |
| 2 | [gstack](https://atlasnote.ai/zh-CN/skills/gstack) | 把产品推演、实现、QA、安全、发布和复盘串成完整交付链 | 端到端工作流 | 适合真实产品交付；对小改动可能过重，应按阶段裁剪 |
| 3 | [shadcn/ui](https://atlasnote.ai/zh-CN/skills/ui) | 把组件源码带入仓库，形成可拥有、可修改的组件资产 | 代码资产/组件系统 | 适合产品 UI；能力来自源码所有权，不是单纯 Agent 提示 |
| 4 | [UI UX Pro Max](https://atlasnote.ai/zh-CN/skills/ui-ux-pro-max-skill) | 从项目背景推导页面结构、风格、配色、字体和效果 | 设计推理 Skill | 适合从需求建立视觉底座；需人工判断品牌差异与可用性 |
| 5 | [压缩输出](https://atlasnote.ai/zh-CN/skills/caveman) | 按多档强度压缩表达，并用实测区分聊天与编码收益 | 行为规则/评测 | 适合控制冗长；不能把特定数据外推到所有任务 |
| 6 | [Open Design](https://atlasnote.ai/zh-CN/skills/open-design) | 本地完成需求、方向、生成、评审和交付 | 本地设计工作流 | 适合数据不出本机和可编辑设计；需审查其模板与插件边界 |
| 7 | [/spec 到 /ship](https://atlasnote.ai/zh-CN/skills/agent-skills) | 用命令覆盖规格、计划、施工、测试、评审、性能与发布 | 生命周期 Skill 集 | 适合标准化软件交付；自动触发需避免与现有规则冲突 |
| 8 | [Understand Anything](https://atlasnote.ai/zh-CN/skills/understand-anything) | 扫描代码或文档，建立可搜、可问、可点的知识图谱 | 多 Agent 应用/知识系统 | 适合接手大型仓库；图谱正确性和增量更新需验证 |
| 9 | [Taste Skill](https://atlasnote.ai/zh-CN/skills/taste-skill) | 用版式、字体、间距、动效和参考方向减少 AI 模板感 | 设计 Skill 集 | 适合前端精修；“品味”仍需结合品牌目标人工选择 |
| 10 | [career-ops](https://atlasnote.ai/zh-CN/skills/career-ops) | 对职位匹配与真实招聘概率打分，先过滤不值得投的岗位 | 决策评分工作流 | 适合求职漏斗前端；权重和招聘真实性判断不应视为事实 |
| 11 | [last30days](https://atlasnote.ai/zh-CN/skills/last30days) | 聚合近期多平台真实讨论并按互动与市场信号排序 | 联网研究工作流 | 适合趋势、口碑和人群语言；平台覆盖和数据权限会变化 |
| 12 | [Impeccable](https://atlasnote.ai/zh-CN/skills/impeccable) | 用 59 条确定性规则检查设计问题 | Skill + CLI + 扩展 + 规则引擎 | 适合交付前扫描；规则通过不等于体验一定优秀 |
| 13 | [Remotion](https://atlasnote.ai/zh-CN/skills/remotion) | 用 React 程序化描述并渲染视频 | 视频框架 + 配套 Skills | 适合数据驱动和批量视频；框架与 Skills 需要分别安装理解 |
| 14 | [PPT Master](https://atlasnote.ai/zh-CN/skills/ppt-master) | 从资料构建叙事并生成可继续编辑的原生 PPTX | 文档生成工作流/脚本 | 适合正式汇报；需验证字体、图表和版式在目标环境的兼容性 |
| 15 | [Obsidian 原生格式](https://atlasnote.ai/zh-CN/skills/obsidian-skills) | 直接生成 wikilink、Bases、Canvas 等原生知识库结构 | 格式 Skill + 官方 CLI | 适合个人知识库自动化；应尊重现有目录与链接规范 |
| 16 | [49 条营销技能](https://atlasnote.ai/zh-CN/skills/marketingskills) | 以统一产品/受众/定位上下文驱动多类营销动作 | 上下文底座 + Skill 集 | 适合持续营销；最大参考价值是“先读产品底座再动手” |
| 17 | [学术流水线](https://atlasnote.ai/zh-CN/skills/academic-research-skills) | 串联检索、写作、评审、修订，并设置两道诚信阻断门 | 研究工作流 + 质量门 | 适合论文与严肃报告；诚信清单不能替代来源核验与作者责任 |
| 18 | [Agent Browser](https://atlasnote.ai/zh-CN/skills/agent-browser) | 用确定性 CLI 和 CDP 驱动真实浏览器 | CLI/浏览器执行器 | 适合可复现网页操作与 QA；登录态、写操作和密钥需隔离 |
| 19 | [HyperFrames](https://atlasnote.ai/zh-CN/skills/hyperframes) | 将 HTML/CSS/媒体和动画确定性渲染为 MP4 | 渲染引擎 | 适合可定位、可重跑的视频；创意生成与最终渲染应分开 |
| 20 | [158 条科研技能](https://atlasnote.ai/zh-CN/skills/scientific-agent-skills) | 为多个科研领域和公共数据库提供专门方法与确定性访问 | 大型科研 Skill 集/数据连接 | 适合专业研究；不要全装，应按领域和数据库最小选择 |

## 21—40

| # | 模块 | 能力本质 | 形态 | 使用与注意 |
| ---: | --- | --- | --- | --- |
| 21 | [Workspace 命令行](https://atlasnote.ai/zh-CN/skills/googleworkspace-cli) | 运行时读取 Google Discovery 定义，动态生成命令树 | 动态 CLI/API 客户端 | 适合随 API 演进的自动化；属非官方支持项目，需控制凭据和写权限 |
| 22 | [Vercel 九条前端技能](https://atlasnote.ai/zh-CN/skills/vercel-labs-agent-skills) | 把 React 性能、UI、文档和账单审查规则按影响力组织 | 规则型 Skill 集 | 适合前端评审；应选择与当前栈相关的子集 |
| 23 | [Emil 设计工程技能](https://atlasnote.ai/zh-CN/skills/emilkowalski-skills) | 把动效设计、审查、组件选择和原型比较编码成方法 | 设计工程 Skill 集 | 适合产品动效与精修；需结合性能和无障碍约束 |
| 24 | [Frontend Slides](https://atlasnote.ai/zh-CN/skills/frontend-slides) | 先生成可见方案供选择，再制作网页幻灯 | 交互式设计工作流 | 适合难以用语言描述审美的人；交付是网页，不等于原生 PPTX |
| 25 | [PM 插件市场](https://atlasnote.ai/zh-CN/skills/pm-skills) | 用插件、技能和命令分层覆盖 PM 领域流程 | 插件市场/路由/工作流 | 适合产品团队；重点学习组合架构，不宜无差别启用全部插件 |
| 26 | [SuperClaude](https://atlasnote.ai/zh-CN/skills/superclaude-framework) | 注入多种行为模式、命令和专门 Agent | Agent 框架 | 适合重度 Claude Code 用户；命令前缀、生态兼容和上下文成本要核对 |
| 27 | [歸藏网页 PPT](https://atlasnote.ai/zh-CN/skills/guizang-ppt-skill) | 按内容性质选择锁定视觉系统，生成单文件 HTML 演示 | 模板化生成工作流 | 适合快速传播型演示；视觉稳定但自由度和原生编辑能力有限 |
| 28 | [飞书官方 CLI](https://atlasnote.ai/zh-CN/skills/larksuite-cli) | 从智能快捷命令到原始 API，分三层控制飞书 | 官方 CLI/API 执行器 | 适合组织自动化；优先 dry-run、最小权限和人工审批 |
| 29 | [Stop Slop](https://atlasnote.ai/zh-CN/skills/stop-slop) | 逐条删除 AI 常见短语、结构和节奏，并重新评分 | 写作检查 Skill | 适合终稿修订；避免把所有个人风格也一并抹平 |
| 30 | [Claude SEO](https://atlasnote.ai/zh-CN/skills/claude-seo) | 让多个专门 Agent 并行完成 SEO 审计并排优先级 | 多 Agent 审计工作流 | 适合大型站点诊断；搜索规则变化快，结论需结合官方数据 |
| 31 | [GSAP 八条动画技能](https://atlasnote.ai/zh-CN/skills/gsap-skills) | 按动画主题向 Agent 提供官方实现知识和索引 | 官方领域 Skill 集 | 适合 GSAP 开发；仍需真实浏览器性能与交互测试 |
| 32 | [Kami](https://atlasnote.ai/zh-CN/skills/kami) | 用排版设计系统约束文档视觉，减少每次生成漂移 | 文档设计系统 | 适合长期品牌文档；约束应允许少量内容密度变化 |
| 33 | [29 条技能 + 路由](https://atlasnote.ai/zh-CN/skills/dontbesilent-dbskill) | 每轮只选择一条最相关技能，并显式决定下一步 | 路由元技能 + Skill 集 | 适合解决技能过多的触发冲突；路由判断本身需要评测 |
| 34 | [小黑手绘插画](https://atlasnote.ai/zh-CN/skills/ian-xiaohei-illustrations) | 用固定构图、线条和三色批注生成系列文章插画 | Codex 图像 Skill/风格配方 | 适合统一内容配图；风格写死，重点是系列一致性而非自由创作 |
| 35 | [联网能力](https://atlasnote.ai/zh-CN/skills/web-access) | 在搜索、抓取、curl 和浏览器之间选择合适访问方式 | 工具路由 Skill | 适合给本地 Agent 补网页访问；需遵守站点权限与敏感数据边界 |
| 36 | [HTML Anything](https://atlasnote.ai/zh-CN/skills/html-anything) | 在本地把 Markdown 草稿加工成可发布 HTML | 本地应用/编辑工作流 | 适合文章、报告和单页交付；需验证响应式、可访问性和导出质量 |
| 37 | [Stitch 设计技能](https://atlasnote.ai/zh-CN/skills/stitch-skills) | 通过 Stitch MCP 完成设计提取、生成和走查视频 | Skill 集 + MCP | 适合设计与代码互转；没有 MCP 前置时这些技能基本不可执行 |
| 38 | [Waza](https://atlasnote.ai/zh-CN/skills/waza) | 用单触发、单结束条件的小 Skill 覆盖工程各阶段 | 小型工程 Skill 集 | 适合跨 Codex/Claude 复用；是“最小职责”设计样本 |
| 39 | [Trail of Bits 安全插件](https://atlasnote.ai/zh-CN/skills/trailofbits-skills) | 为智能合约、代码、恶意软件、逆向等提供专门安全流程 | 安全插件/Skill 大集 | 适合安全专业人员；高风险分析需沙箱和专家复核 |
| 40 | [Minimal Zine Poster](https://atlasnote.ai/zh-CN/skills/gc-minimal-zine-poster) | 将内容压缩为单一视觉隐喻和受限杂志版式 | 视觉风格 Skill | 适合观点海报；强风格适合系列，不适合信息密集任务 |

## 41—60

| # | 模块 | 能力本质 | 形态 | 使用与注意 |
| ---: | --- | --- | --- | --- |
| 41 | [70 条产品经理技能](https://atlasnote.ai/zh-CN/skills/product-manager-skills) | 用工作流、交互提问和短时模板三层覆盖 PM 工作 | 分层 Skill 集 | 适合产品团队 SOP；先选层级，再选技能，避免流程过载 |
| 42 | [n8n 14 条技能](https://atlasnote.ai/zh-CN/skills/n8n-skills) | 用常驻路由和 hooks 按时加载 n8n 操作能力 | Skill 集 + MCP + hooks | 适合自动化工作流；没有 n8n-mcp 时几乎没有实际动作能力 |
| 43 | [Thermo-Nuclear Review](https://atlasnote.ai/zh-CN/skills/thermo-nuclear-code-quality-review) | 以删除复杂度为目标审查结构性代码债 | 严格代码评审 Skill | 适合重构前诊断；严苛标准需与交付风险和改动预算平衡 |
| 44 | [BrowserAct](https://atlasnote.ai/zh-CN/skills/browser-act-skills) | 以本地登录态、隐私身份或固定身份运行浏览器自动化 | Python CLI/商业服务本地端 | 适合多身份网页任务；代理、指纹和账号使用要符合法规与站点政策 |
| 45 | [IP as Logo](https://atlasnote.ai/zh-CN/skills/ip-as-logo) | 从产品概念推导角色方向，并生成小尺寸可识别候选 | 品牌角色生成工作流 | 适合早期品牌探索；商标独特性和版权仍需人工审查 |
| 46 | [SwiftUI 代码审查](https://atlasnote.ai/zh-CN/skills/swiftui-agent-skill) | 按 API、结构、数据流、导航、无障碍和性能分步审查 | 专项代码审查 Skill | 适合 iOS PR；它不是代码生成器，版本规则需随 SDK 更新 |
| 47 | [Photo Abstract Editorial](https://atlasnote.ai/zh-CN/skills/photo-abstract-editorial) | 保留原照片并从其空间、节奏和色彩提炼抽象面板 | 图像编辑配方 | 适合摄影编辑作品；核心约束是“不重画原照” |
| 48 | [Remotion 官方 12 技能](https://atlasnote.ai/zh-CN/skills/remotion-dev-skills) | 覆盖建工程、Studio、字幕、地图、渲染与升级 | 官方视频 Skill 集 | 适合 Remotion 全流程；不确定时先由伞形技能路由 |
| 49 | [34 套 HTML 幻灯模板](https://atlasnote.ai/zh-CN/skills/beautiful-html-templates) | 用结构化元数据帮助 Agent 选择 358 张模板 | 模板库 + 操作手册 | 适合快速选型；它不是 Skill，本质是被 Agent 检索的资产系统 |
| 50 | [目标循环 + 营销技能](https://atlasnote.ai/zh-CN/skills/notfair) | 将持续目标循环与广告、SEO 等执行技能结合 | 本地应用 + 插件 | 适合持续增长实验；需为循环设置预算、停止条件和真实指标 |
| 51 | [本地 Claude Design](https://atlasnote.ai/zh-CN/skills/baoyu-design) | 探测运行环境并按工具映射、任务需要加载设计技能 | 纯 Markdown Skill 集 + 脚手架 | 适合多 Agent 环境；价值在适配层，不在新增运行时 |
| 52 | [AI 写作检测引擎](https://atlasnote.ai/zh-CN/skills/avoid-ai-writing) | 用词表和 pattern 引擎对 AI 写作特征量化评分 | 确定性检测引擎 | 适合修订辅助；检测分数不能证明文本由谁创作 |
| 53 | [Supabase 两条技能](https://atlasnote.ai/zh-CN/skills/supabase-agent-skills) | 提供 Supabase 操作与按影响力排序的 Postgres 最佳实践 | 官方领域 Skill | 适合数据库设计与审查；真实迁移仍需备份和环境验证 |
| 54 | [论文检索 MCP](https://atlasnote.ai/zh-CN/skills/paper-search-mcp) | 多源并发检索、去重，并按来源能力回退下载 | MCP 服务 | 适合文献发现与获取；“能搜到”不等于全文可合法下载 |
| 55 | [代码后练习](https://atlasnote.ai/zh-CN/skills/learning-opportunities) | 在完成架构工作后触发短练习，促进预测、追踪和讲解 | 学习反馈 Skill | 适合把编码变成能力积累；应保持可选，避免打断紧急交付 |
| 56 | [Logo Generator](https://atlasnote.ai/zh-CN/skills/logo-generator) | 生成真正不同的 SVG 方案、比较页和品牌展示 | 设计生成与导出工作流 | 适合方案发散；最终 Logo 需做商标检索和小尺寸测试 |
| 57 | [大纲先行的深度调研](https://atlasnote.ai/zh-CN/skills/deep-research-skills) | 将大纲、补字段、并行检索和最终写报告分离 | 命令式研究工作流 | 适合可追踪研究；JSON 中间产物利于增量和多人协作 |
| 58 | [50 本书 + 12 元技能](https://atlasnote.ai/zh-CN/skills/wondelai-skills) | 将书中框架做成领域技能，再用元技能编排创建和增长 | 方法论 Skill 库/元技能 | 适合寻找框架；书本提炼不等于方法在当前业务有效 |
| 59 | [人味儿写作](https://atlasnote.ai/zh-CN/skills/renwei-writing) | 只删除阻碍真实声音的部分，保留位置、经验和手迹 | 最小改写 Skill | 适合个人表达终修；比统一“润色得更好”更能保留作者性 |
| 60 | [四档深度研究](https://atlasnote.ai/zh-CN/skills/claude-deep-research-skill) | 按时间与阶段在快速、标准、深度和超深模式间切换 | 分级研究工作流 | 适合按风险分配研究成本；时间更长不自动等于证据更好 |

## 61—80

| # | 模块 | 能力本质 | 形态 | 使用与注意 |
| ---: | --- | --- | --- | --- |
| 61 | [28 个思维模型](https://atlasnote.ai/zh-CN/skills/cc-thinking-skills) | 用路由选择或组合来自多种理论的思维模型 | 路由元技能/方法库 | 适合换视角和结构化讨论；模型“听起来合理”不等于实证有效 |
| 62 | [/goal 元技能](https://atlasnote.ai/zh-CN/skills/qiaomu-goal-meta-skill) | 把模糊需求转换为含结果、验证、边界和暂停条件的目标指令 | 元技能/规格生成器 | 适合长任务启动；它只定义目标，不替代执行能力 |
| 63 | [SwarmVault](https://atlasnote.ai/zh-CN/skills/swarmvault) | 摄入文件或仓库，生成带来源的 wiki 与知识图谱 | CLI + MCP + 桌面知识系统 | 适合长期知识资产；需考虑更新、删除和来源权限 |
| 64 | [跨平台电商技能](https://atlasnote.ai/zh-CN/skills/ecommerce-skills) | 用纯 Markdown 覆盖多个电商平台的方法 | 大型领域 Skill 集 | 可作流程参考；仓库数量自相矛盾，可信度需逐项核验 |
| 65 | [电商视觉文案](https://atlasnote.ai/zh-CN/skills/ecommerce-visual-copywriting-skill) | 在视觉策划和图片脚本阶段分别设置人工确认门 | 人机协作工作流 | 适合高主观性的商业内容；“暂停等待确认”是核心能力 |
| 66 | [103 条方法论技能](https://atlasnote.ai/zh-CN/skills/claude-skills) | 用统一八段结构描述适用、输入、流程、失败和输出 | 规范化 Skill 库 | 适合学习 Skill 信息架构；规模大，必须靠路由和按需加载 |
| 67 | [风格试衣间](https://atlasnote.ai/zh-CN/skills/qiaomu-design) | 先生成互斥迷你样稿，让用户选择后再实施 | 交互选择工作流 | 适合模糊审美需求；把“选方向”变成可见决策而非文字猜测 |
| 68 | [Photo Revival](https://atlasnote.ai/zh-CN/skills/photo-revival) | 从照片保留记忆锚点，重画为局部小尺寸手绘场景 | 图像重创作配方 | 适合纪念性视觉；需明确保留哪些主体与细节 |
| 69 | [不二设计系统](https://atlasnote.ai/zh-CN/skills/esther-design-system) | 只允许从既定布局、品牌色和组件中选择 | 设计系统/强约束 | 适合品牌一致和规模化生成；创新空间被有意压缩 |
| 70 | [n8n 官方技能](https://atlasnote.ai/zh-CN/skills/n8n-io-skills) | 通过元技能路由 13 条实例操作能力 | 官方 Skill 集 + 实例 MCP | 适合 n8n 2.2.0+；没有开启实例级 MCP 就没有实际价值 |
| 71 | [TaiT CRT Interface](https://atlasnote.ai/zh-CN/skills/tait-crt-interface-skill) | 把主题重新创作成早期电脑窗口与位图漫画 | 视觉风格 Skill | 适合海报和内容封面；不是简单照片像素滤镜 |
| 72 | [橙线插画](https://atlasnote.ai/zh-CN/skills/orange-line-illustration) | 用唯一橙色、极小人物和无阴影白底维持系列风格 | 视觉约束 Skill | 适合文章插画；明确反向约束可抵消模型偏好 |
| 73 | [31 条数据分析技能](https://atlasnote.ai/zh-CN/skills/data-analytics-skills) | 覆盖质量、分析、可视化、叙事、沟通和流程，并带可运行脚本 | Skill 集 + Python 脚本 | 适合完整分析链；数据口径、环境和结果复核仍是前提 |
| 74 | [Skill Doctor](https://atlasnote.ai/zh-CN/skills/skill-doctor) | 从真实 Agent 会话找失败证据，提出小而具体的 Skill 改进 | 元评测/Skill 治理 | 适合持续优化自己的能力库；隐私脱敏和样本代表性很重要 |
| 75 | [视频剪辑流水线](https://atlasnote.ai/zh-CN/skills/qiaomu-cut) | 以中间表示、时间轴和三档渲染推进，并用四项条件判定交付 | CLI + Skill + 质量门 | 适合可复现剪辑；中间表示是修改与排错的关键资产 |
| 76 | [Bloom](https://atlasnote.ai/zh-CN/skills/bloom) | 用一对一辅导式反馈和练习增强学习过程 | 教学 Skill | 适合个性化学习；理论启发不等于工具效果达到两个标准差 |
| 77 | [AI 产品需求文档](https://atlasnote.ai/zh-CN/skills/qiaomu-ai-prd) | 强制以 11 章完整骨架产出 PRD 和开发交接 | 文档模板/工作流 | 适合防漏项；每章都出不等于每章都应同等详细 |
| 78 | [IP Mini Illustration System](https://atlasnote.ai/zh-CN/skills/ip_illustration_for_yourself) | 从参考提炼身份锚点和多视图，维持系列角色一致性 | 角色资产系统 | 适合持续内容 IP；先建角色基线再批量生成是核心 |
| 79 | [Heytea Doodle Poster](https://atlasnote.ai/zh-CN/skills/heytea-style) | 保留真实物件并与儿童涂鸦、手写字组合 | 图像编辑配方 | 适合生活方式海报；有字版与无字版应视为不同构图任务 |
| 80 | [Keel](https://atlasnote.ai/zh-CN/skills/keel) | 识别承重边界、权责、契约、恢复路径并治理迁移与删除 | 架构决策/评审/治理 Skill | 适合高风险架构；强调与风险相称的证据，不应套用于所有小改动 |

## 从 81 项中看到的七个高价值模式

1. **小技能优于大而全**：Matt Pocock、Waza 把触发和结束条件压小，便于替换和组合。
2. **先共享上下文，再执行分工**：营销技能的产品底座避免 49 个子技能各自猜产品。
3. **路由比继续堆技能更重要**：29+1、n8n、Remotion 都用伞形或元技能控制加载。
4. **确定性工具补足语言模型的不稳定**：CLI、脚本和渲染引擎让动作可复现。
5. **强约束能提升系列一致性**：不二、Kami、橙线插画用有限选择空间换稳定输出。
6. **人工确认不是自动化失败，而是能力的一部分**：风格试衣间、电商视觉文案在高主观节点主动暂停。
7. **评测能力最终会比生成能力更稀缺**：Impeccable、Skill Doctor、学术诚信门和 Keel 都在定义“什么才算完成”。
