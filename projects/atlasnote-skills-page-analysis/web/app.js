const rawCapabilities = [
  [0,"小而可改的工程 skill 集","mattpocock-skills","engineering","collection","method","把需求澄清、规格、TDD 和疑难 bug 诊断拆成小闭环。","适合日常编码；价值在小而能改，避免整套流程接管项目。"],
  [1,"写给编码代理的 Karpathy 四原则","andrej-karpathy-skills","engineering","rules","check","用短规则抑制猜测、过度设计、无关改动和无验收施工。","适合作为工程底线；它是行为纪律，不是执行工具。"],
  [2,"gstack：把 AI 编程变成一条完整交付流水线","gstack","engineering","workflow","deliver","把产品推演、实现、QA、安全、发布和复盘串成完整交付链。","适合真实产品交付；对小改动可能过重，应按阶段裁剪。"],
  [3,"shadcn/ui：把组件源码搬进你的项目","ui","engineering","assets","deliver","把组件源码带入仓库，形成可拥有、可修改的组件资产。","能力来自源码所有权，不是单纯的 Agent 提示。"],
  [4,"UI UX Pro Max：按需求生成整套设计系统","ui-ux-pro-max-skill","design","rules","method","从项目背景推导页面结构、风格、配色、字体和效果。","适合从需求建立视觉底座；仍需人工判断品牌差异与可用性。"],
  [5,"压缩输出：65% 是散文场景，不是全局","caveman","tools","rules","check","按多档强度压缩表达，并用实测区分聊天与编码收益。","适合控制冗长；不能把特定数据外推到所有任务。"],
  [6,"Open Design：本地跑的开源设计引擎","open-design","design","workflow","deliver","在本地完成需求、方向、生成、评审和交付。","适合数据不出本机的设计工作；需审查模板与插件边界。"],
  [7,"从 /spec 到 /ship 的 24 个 skill","agent-skills","engineering","collection","deliver","用命令覆盖规格、计划、施工、测试、评审、性能与发布。","自动触发需避免与现有工程规则发生冲突。"],
  [8,"Understand Anything：把代码库读成图","understand-anything","research","knowledge","learn","扫描代码或文档，建立可搜、可问、可点的知识图谱。","适合接手大型仓库；图谱正确性与增量更新需要验证。"],
  [9,"Taste Skill：治 AI 界面的样板感","taste-skill","design","collection","method","用版式、字体、间距、动效和参考方向减少 AI 模板感。","品味仍需结合品牌目标与真实用户人工选择。"],
  [10,"career-ops：投之前先筛掉不值得投的","career-ops","product","workflow","check","对职位匹配与真实招聘概率打分，过滤不值得投的岗位。","权重和招聘真实性判断只能辅助决策，不能视为事实。"],
  [11,"last30days：搜人，不搜编辑","last30days","research","connector","act","聚合近期多平台真实讨论并按互动与市场信号排序。","适合趋势与口碑研究；平台覆盖和数据权限会变化。"],
  [12,"Impeccable：59 条不用 LLM 的设计检测","impeccable","design","evaluator","check","用 59 条确定性规则扫描设计问题。","规则通过不等于体验优秀，适合作为交付前质量门。"],
  [13,"Remotion：用 React 写视频","remotion","design","executor","deliver","用 React 程序化描述并渲染视频。","框架与配套 Skills 需要分别理解和安装。"],
  [14,"PPT Master：把材料做成真正原生的 PowerPoint","ppt-master","docs","workflow","deliver","从资料构建叙事并生成可继续编辑的原生 PPTX。","需验证字体、图表和版式在目标 Office 环境的兼容性。"],
  [15,"Obsidian 的原生文件格式怎么写","obsidian-skills","research","collection","learn","直接生成 wikilink、Bases、Canvas 等原生知识库结构。","适合个人知识库自动化；应尊重现有目录与链接规范。"],
  [16,"49 条营销技能，共用一个产品底座","marketingskills","writing","collection","method","以统一产品、受众和定位上下文驱动多类营销动作。","最大参考价值是先共享产品底座，再让子技能分工。"],
  [17,"学术流水线：两道诚信门卡着","academic-research-skills","research","workflow","check","串联检索、写作、评审、修订，并设置两道诚信阻断门。","清单不能替代来源核验与作者责任。"],
  [18,"给 agent 用的浏览器 CLI","agent-browser","tools","executor","act","用确定性 CLI 和 CDP 驱动真实浏览器。","适合可复现网页操作；登录态、密钥与写操作需隔离。"],
  [19,"HyperFrames：写 HTML，渲染出 MP4","hyperframes","design","executor","deliver","将 HTML、CSS、媒体和动画确定性渲染为 MP4。","创意生成与最终渲染应分开，才能真正可重跑。"],
  [20,"158 条科研技能，别一次全装","scientific-agent-skills","research","collection","method","为多个科研领域与公共数据库提供专门方法和确定性访问。","不要全装，应按领域和数据库最小选择。"],
  [21,"Workspace 命令行：运行时读 API 定义","googleworkspace-cli","tools","executor","act","运行时读取 Google Discovery 定义并动态生成命令树。","属于非官方支持项目，必须控制凭据与写权限。"],
  [22,"Vercel 团队的九条前端技能","vercel-labs-agent-skills","engineering","collection","check","把 React 性能、UI、文档和账单审查规则按影响力组织。","适合前端评审；应选择与当前技术栈直接相关的子集。"],
  [23,"Emil：九条设计工程与动效技能","emilkowalski-skills","design","collection","method","把动效设计、审查、组件选择和原型比较编码成方法。","适合产品精修；需同时考虑性能和无障碍。"],
  [24,"Frontend Slides：给不会设计的人做网页幻灯","frontend-slides","docs","workflow","deliver","先生成可见方案供选择，再制作网页幻灯。","交付是网页，不等于原生 PPTX。"],
  [25,"PM 插件市场：9 个插件、68 条技能","pm-skills","product","router","route","用插件、技能和命令分层覆盖产品经理流程。","重点学习组合架构，不宜无差别启用全部插件。"],
  [26,"SuperClaude：30 条 sc: 前缀命令","superclaude-framework","tools","router","route","向 Claude Code 注入多种行为模式、命令和专门 Agent。","需核对命令前缀、生态兼容与上下文成本。"],
  [27,"歸藏网页 PPT：两套锁定的视觉系统","guizang-ppt-skill","docs","assets","deliver","按内容性质选择锁定视觉系统，生成单文件 HTML 演示。","视觉稳定但自由度和原生编辑能力有限。"],
  [28,"飞书官方 CLI：三层命令","larksuite-cli","tools","executor","act","从智能快捷命令到原始 API，分三层控制飞书。","优先 dry-run、最小权限和人工审批。"],
  [29,"Stop Slop：删掉文字里的 AI 痕迹","stop-slop","writing","evaluator","check","逐条删除 AI 常见短语、结构与节奏，并重新评分。","避免把作者自己的语气也一并抹平。"],
  [30,"Claude SEO：25 个子技能并行跑审计","claude-seo","writing","workflow","check","让多个专门 Agent 并行完成 SEO 审计并排列优先级。","搜索规则变化快，结论需结合站点真实数据。"],
  [31,"GSAP 官方的八条动画技能","gsap-skills","design","collection","method","按动画主题向 Agent 提供官方实现知识与索引。","仍需真实浏览器性能与交互测试。"],
  [32,"Kami：让文档像印出来的纸","kami","docs","assets","deliver","用排版设计系统约束文档视觉，减少每次生成漂移。","约束应允许内容密度变化，而不是机械套版。"],
  [33,"29 条技能加一条路由，每轮只选一条","dontbesilent-dbskill","tools","router","route","每轮只选择一条最相关技能，并显式决定下一步。","路由本身也需要用真实任务评测。"],
  [34,"小黑：给文章配一套手绘插画","ian-xiaohei-illustrations","design","assets","deliver","用固定构图、线条与三色批注生成系列文章插画。","风格写死，价值在系列一致性而非自由创作。"],
  [35,"给 agent 补上联网能力","web-access","tools","router","act","在搜索、抓取、curl 和浏览器之间选择合适访问方式。","需要遵守站点权限、隐私和敏感数据边界。"],
  [36,"HTML Anything：本地跑的 HTML 编辑器","html-anything","docs","executor","deliver","在本地把 Markdown 草稿加工成可发布 HTML。","需验证响应式、可访问性和导出质量。"],
  [37,"Stitch 设计技能：装前先接 MCP","stitch-skills","design","connector","act","通过 Stitch MCP 完成设计提取、生成与走查视频。","没有 MCP 前置时，这些技能基本不可执行。"],
  [38,"Waza：八条工程习惯，按阶段分工","waza","engineering","collection","method","用单触发、单结束条件的小 Skill 覆盖工程各阶段。","是跨 Agent 的最小职责设计样本。"],
  [39,"Trail of Bits 的 39 个安全插件","trailofbits-skills","engineering","collection","check","为智能合约、代码、恶意软件和逆向提供专门安全流程。","高风险分析需要沙箱和安全专家复核。"],
  [40,"Minimal Zine Poster：安静的纸张杂志海报","gc-minimal-zine-poster","design","assets","deliver","将内容压缩为单一视觉隐喻和受限杂志版式。","强风格适合系列，不适合信息密集任务。"],
  [41,"70 条产品经理技能，三层结构","product-manager-skills","product","collection","method","用工作流、交互提问和短时模板三层覆盖 PM 工作。","先选层级再选技能，避免流程过载。"],
  [42,"n8n 工作流的 14 条技能加一层 hook","n8n-skills","tools","connector","act","用常驻路由和 hooks 按时加载 n8n 操作能力。","没有 n8n-mcp 时几乎没有实际动作能力。"],
  [43,"Thermo-Nuclear Review：对结构性代码债零放水","thermo-nuclear-code-quality-review","engineering","evaluator","check","以删除复杂度为目标审查结构性代码债。","严苛标准需要与交付风险和改动预算平衡。"],
  [44,"BrowserAct：三种浏览器模式加人工接管","browser-act-skills","tools","executor","act","以本地登录态、隐私身份或固定身份运行浏览器自动化。","代理、指纹与账号使用必须符合规则和站点政策。"],
  [45,"IP as Logo：极简可爱的品牌角色","ip-as-logo","design","workflow","deliver","从产品概念推导角色方向，并生成小尺寸可识别候选。","最终方案仍需商标独特性与版权审查。"],
  [46,"SwiftUI 代码审查，不是代码生成","swiftui-agent-skill","engineering","evaluator","check","按 API、结构、数据流、导航、无障碍和性能分步审查。","规则需随 SwiftUI 与 SDK 版本更新。"],
  [47,"Photo Abstract Editorial：照片与抽象记忆面板","photo-abstract-editorial","design","assets","deliver","保留原照片并从空间、节奏和色彩提炼抽象面板。","核心约束是不套滤镜、不重画原照。"],
  [48,"Remotion 官方的 12 条视频技能","remotion-dev-skills","design","collection","deliver","覆盖建工程、Studio、字幕、地图、渲染与升级。","拿不准时先由伞形 best-practices 技能路由。"],
  [49,"34 套 HTML 幻灯模板与一份操作手册","beautiful-html-templates","docs","assets","deliver","用结构化元数据帮助 Agent 从 358 张幻灯中选模板。","它不是 Skill，本质是可检索的资产系统。"],
  [50,"目标循环加 28 条营销技能","notfair","writing","workflow","learn","将持续目标循环与广告、SEO 等执行技能结合。","必须为循环设置预算、真实指标和停止条件。"],
  [51,"把 Claude Design 搬到本地 agent 上","baoyu-design","design","router","route","探测运行环境并按工具映射与任务需要加载设计技能。","价值在多 Agent 适配层，不在新增运行时。"],
  [52,"AI 写作检测：一个真能跑分的引擎","avoid-ai-writing","writing","evaluator","check","用词表和 pattern 引擎对 AI 写作特征量化评分。","检测分数不能证明文本究竟由谁创作。"],
  [53,"Supabase 的两条技能","supabase-agent-skills","engineering","collection","method","提供 Supabase 操作与按影响力排序的 Postgres 最佳实践。","真实数据库迁移仍需备份和环境验证。"],
  [54,"论文检索 MCP：能下和不能下分得很清","paper-search-mcp","research","connector","act","多源并发检索、去重，并按来源能力回退下载。","能搜到不等于全文可以合法下载。"],
  [55,"写完代码顺手做一道练习","learning-opportunities","engineering","rules","learn","在完成架构工作后触发短练习，促进预测、追踪和讲解。","应保持可选，避免打断紧急交付。"],
  [56,"Logo Generator：SVG 标志与高端展示套件","logo-generator","design","workflow","deliver","生成真正不同的 SVG 方案、比较页和品牌展示。","最终 Logo 需做商标检索与小尺寸测试。"],
  [57,"大纲先行的深度调研","deep-research-skills","research","workflow","method","将大纲、补字段、并行检索和最终写报告分离。","JSON 中间产物有利于增量研究与协作。"],
  [58,"62 条技能：50 本书 + 12 条元技能","wondelai-skills","product","router","method","将书中框架做成领域技能，再用元技能编排创建与增长。","书本提炼不等于方法在当前业务已经有效。"],
  [59,"人味儿写作：只做减法","renwei-writing","writing","rules","check","只删除阻碍真实声音的部分，保留位置、经验和手迹。","比统一润色更能保留作者性。"],
  [60,"深度研究：四档模式，最长四十五分钟","claude-deep-research-skill","research","workflow","method","按时间和阶段在快速、标准、深度、超深模式间切换。","时间更长不自动等于证据质量更高。"],
  [61,"28 个思维模型，零个被证明有效","cc-thinking-skills","product","router","method","用路由选择或组合来自多种理论的思维模型。","听起来合理的模型不等于已经实证有效。"],
  [62,"把模糊需求写成一条 /goal 指令","qiaomu-goal-meta-skill","product","router","goal","把模糊需求转换为含结果、验证、边界和暂停条件的目标指令。","它只定义目标，不替代后续执行能力。"],
  [63,"SwarmVault：边带来源标签的知识图谱","swarmvault","research","knowledge","learn","摄入文件或仓库，生成带来源的 wiki 与知识图谱。","长期使用要处理更新、删除与来源权限。"],
  [64,"跨平台电商技能，数字得打个问号","ecommerce-skills","writing","collection","method","用纯 Markdown 覆盖多个电商平台的方法。","仓库数量自相矛盾，可信度需逐项核验。"],
  [65,"电商视觉文案：两道人工确认门","ecommerce-visual-copywriting-skill","writing","workflow","check","在视觉策划和图片脚本阶段分别设置人工确认门。","暂停等待确认是核心能力，不是自动化失败。"],
  [66,"103 条方法论技能，统一八段结构","claude-skills","tools","collection","method","用统一八段结构描述适用、输入、流程、失败和输出。","规模大，必须依赖路由和按需加载。"],
  [67,"风格试衣间：先挑方向再动手","qiaomu-design","design","workflow","route","先生成互斥迷你样稿，让用户选择后再实施。","把选方向变成可见决策，减少文字猜测。"],
  [68,"Photo Revival：把随手拍画成白纸小景","photo-revival","design","assets","deliver","从照片保留记忆锚点，重画为局部小尺寸手绘场景。","需要先明确要保留的主体与关键细节。"],
  [69,"不二设计系统：限制 AI 的自由度","esther-design-system","design","assets","method","只允许从既定布局、品牌色和组件中选择。","用创新空间换取品牌一致和规模化稳定。"],
  [70,"n8n 官方技能：先有实例才有用","n8n-io-skills","tools","connector","act","通过元技能路由 13 条 n8n 实例操作能力。","没有 2.2.0+ 实例与 MCP 就没有实际价值。"],
  [71,"TaiT CRT Interface：早期电脑界面插画","tait-crt-interface-skill","design","assets","deliver","把主题重新创作成早期电脑窗口与位图漫画。","它不是简单的照片像素滤镜。"],
  [72,"橙线插画：一个点缀色，人物极小","orange-line-illustration","design","assets","deliver","用唯一橙色、极小人物和无阴影白底维持系列风格。","明确反向约束可以抵消模型把人物画大的偏好。"],
  [73,"31 条数据分析技能，自带脚本","data-analytics-skills","research","collection","act","覆盖质量、分析、可视化、叙事、沟通和流程，并带脚本。","数据口径、运行环境与结果复核仍是前提。"],
  [74,"Skill Doctor：从真实对话诊断并改进 Agent Skills","skill-doctor","tools","evaluator","learn","从真实 Agent 会话找失败证据，提出小而具体的 Skill 改进。","隐私脱敏与样本代表性非常重要。"],
  [75,"视频剪辑流水线：三档渲染，四条判定","qiaomu-cut","design","workflow","deliver","以中间表示、时间轴和三档渲染推进，并设置交付判定。","中间表示是修改、排错与可复现的关键资产。"],
  [76,"Bloom：把一对一辅导的效应搬给 AI","bloom","research","workflow","learn","用一对一辅导式反馈与练习增强学习过程。","理论启发不等于工具效果真能达到两个标准差。"],
  [77,"AI 产品需求文档：11 章不许跳","qiaomu-ai-prd","product","assets","goal","用 11 章完整骨架产出 PRD 与开发交接。","防漏项有价值，但每章不必同等详细。"],
  [78,"IP Mini Illustration System：建立自己的系列角色","ip_illustration_for_yourself","design","assets","deliver","从参考提炼身份锚点和多视图，维持系列角色一致。","先建立角色基线，再批量生成。"],
  [79,"Heytea Doodle Poster：实物与儿童涂鸦海报","heytea-style","design","assets","deliver","保留真实物件并与儿童涂鸦、手写字组合。","有字版与无字版应视为不同构图任务。"],
  [80,"Keel：设计、评审并治理承重型架构","keel","engineering","evaluator","check","识别承重边界、权责、契约、恢复路径并治理迁移与删除。","强调与风险相称的证据，不应套用于所有小改动。"]
];

const externalWriteIds = new Set([18, 21, 28, 35, 37, 42, 44, 70]);
const externalReadIds = new Set([11, 54]);

function adoptionFor(shape) {
  if (shape === "connector") return "integration";
  if (shape === "executor") return "direct";
  if (["workflow", "collection", "router"].includes(shape)) return "compose";
  return "adapt";
}

function permissionFor(id, shape) {
  if (externalWriteIds.has(id)) return "external-write";
  if (externalReadIds.has(id) || shape === "connector") return "external-read";
  if (shape === "executor" || id === 73) return "local-execute";
  return "instruction";
}

const capabilities = rawCapabilities.map(([id, title, slug, domain, shape, stage, essence, note]) => ({
  id, title, slug, domain, shape, stage, essence, note,
  adoption: adoptionFor(shape),
  permission: permissionFor(id, shape),
  url: `https://atlasnote.ai/zh-CN/skills/${slug}`
}));

const labels = {
  domains: {
    engineering: "工程开发",
    design: "设计与视频",
    product: "产品与项目",
    research: "研究与知识",
    writing: "写作与营销",
    docs: "文档与幻灯片",
    tools: "工具与元能力"
  },
  shapes: {
    rules: "行为规则",
    collection: "Skill 集合",
    router: "路由与元技能",
    workflow: "端到端工作流",
    executor: "确定性执行器",
    connector: "外部连接器",
    assets: "模板与设计系统",
    evaluator: "评测与治理",
    knowledge: "知识系统"
  },
  stages: {
    goal: "目标与边界",
    route: "路由与选择",
    method: "专业方法",
    act: "工具执行",
    check: "质量验证",
    deliver: "成果交付",
    learn: "记忆与改进"
  },
  adoptions: {
    direct: "直接采用",
    compose: "组合使用",
    adapt: "借鉴改造",
    integration: "先做集成"
  },
  permissions: {
    instruction: "说明与约束，不直接改变外部状态",
    "local-execute": "可执行本地脚本或写入已授权项目",
    "external-read": "依赖外部数据、实例或只读连接",
    "external-write": "可修改外部系统，需明确凭证、范围与恢复方式"
  }
};

const verificationRecords = [
  {
    shape: "rules",
    itemId: 1,
    title: "Karpathy 四原则",
    repository: "multica-ai/andrej-karpathy-skills",
    atlasClaim: "用四条短规则抑制错误假设、过度设计、无关改动和缺少验收的施工。",
    actualType: "以 CLAUDE.md 为核心的行为规则仓库，同时提供 Claude Code 插件、Cursor rule 和可复用 Skill 版本；不是执行器。",
    verifiedFacts: [
      "官方 README 将内容明确收敛为 Think Before Coding、Simplicity First、Surgical Changes、Goal-Driven Execution 四条原则。",
      "官方仓库支持插件安装或把 CLAUDE.md 合并进项目；作者明确建议与项目规则合并，而不是替代项目规则。",
      "许可证为 MIT。"
    ],
    unverified: "没有在本项目安装，也没有用对照任务验证这四条规则能降低多少返工；“Karpathy 启发”不等于 Karpathy 官方发布或背书。",
    install: "Claude Code 可用官方 README 所列插件流程；也可把 CLAUDE.md 合并到单个项目。安装前先检查仓库内仍保留的旧所有者路径。",
    prerequisites: "需要支持项目指令、插件或 Agent Skills 的编码 Agent；无独立运行时。",
    permission: "主要改变 Agent 的长期行为边界；本身不调用外部系统，但若作为全局规则启用，会影响所有后续编码任务。",
    license: "MIT",
    maintenance: "官方仓库页列出 28 次提交；提交页当前显示最近一次合并在 2026-04-20。热度不能替代规则适配测试。",
    decision: "借鉴改造：把四条底线合并进自己的项目规则，并用真实 diff/测试比较前后表现；不要把它当成新增执行能力。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/andrej-karpathy-skills" },
      { label: "官方仓库", url: "https://github.com/multica-ai/andrej-karpathy-skills" },
      { label: "官方可复用 Skill", url: "https://github.com/multica-ai/andrej-karpathy-skills/tree/main/skills/karpathy-guidelines" }
    ]
  },
  {
    shape: "collection",
    itemId: 0,
    title: "Matt Pocock Skills",
    repository: "mattpocock/skills",
    atlasClaim: "把需求澄清、规格、工单、TDD、架构检查和疑难 bug 诊断拆成小而可组合的工程闭环。",
    actualType: "多项可独立选择的工程 Skill 集合，带一次性仓库设置流程和少量脚本；不是必须整套接管项目的框架。",
    verifiedFacts: [
      "官方 README 明确把这些 Skill 定义为 small、easy to adapt、composable，并允许只选择需要的子集。",
      "Codex 等 Agent 可用 npx skills@latest add 安装；安装后需在每个仓库运行 setup-matt-pocock-skills，配置 issue tracker、标签和文档路径。",
      "官方警告不要同时安装 Claude 插件版和可编辑文件版，否则每项 Skill 会重复出现。"
    ],
    unverified: "没有逐项审查所有子 Skill 和脚本，也没有在当前仓库运行 setup；具体写入范围取决于所选 Skill 和仓库配置。",
    install: "Codex/其他 Agent：npx skills@latest add mattpocock/skills，并只选需要的 Skill；Claude Code 也可选托管插件，但不要两种方式并装。",
    prerequisites: "支持 Agent Skills 的编码环境；通过 npx 安装时需要 Node.js/npm。仓库设置会要求选择 issue tracker 与文档位置。",
    permission: "从纯指令到本地文件、测试和工单操作不等；必须按子 Skill 逐项检查。setup 会读取并记录仓库级工作方式。",
    license: "MIT",
    maintenance: "官方仓库页列出 457 次提交，并提供更新命令与变更记录；这说明维护面较大，也意味着升级前需要复核差异。",
    decision: "组合使用：先挑 1–3 项与你高频返工点直接对应的 Skill；优先借鉴“小职责 + 可编辑 + 仓库设置”结构。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/mattpocock-skills" },
      { label: "官方仓库", url: "https://github.com/mattpocock/skills" },
      { label: "官方 Skills 目录", url: "https://github.com/mattpocock/skills/tree/main/skills" }
    ]
  },
  {
    shape: "router",
    itemId: 62,
    title: "qiaomu-goal-meta-skill",
    repository: "joeseesun/qiaomu-goal-meta-skill",
    atlasClaim: "把一句模糊需求转换成可复制的 /goal，并补全验证、约束、边界、迭代、完成与暂停条件。",
    actualType: "单一目标编译型 Meta Skill，附带一个本地 Python linter；它生成目标契约，但不执行目标本身。",
    verifiedFacts: [
      "官方 README 给出的输出包含结果、验证、约束、边界、迭代策略、完成条件和暂停条件，并提供中英文兼容标签。",
      "仓库附带 lint_goal_command.py，可拦截占位符、空洞验证和无限重试等问题。",
      "官方边界明确写明：只创建 /goal 指令，不默认执行目标。"
    ],
    unverified: "没有在本项目运行 linter，也没有验证自动选择的保守默认值是否适合你的全部任务；高风险领域仍需要人工和官方资料。",
    install: "npx skills add joeseesun/qiaomu-goal-meta-skill；安装后确认目标 Agent 能读取对应 skills 目录。",
    prerequisites: "支持 Agent Skills 的运行环境；Node.js 与 npx 用于安装；运行 linter 还需要 Python 3。",
    permission: "主要生成文本目标；本地 linter 读取 goal 文本。后续 /goal 可能请求更高权限，但那属于目标执行阶段，需另行授权。",
    license: "MIT",
    maintenance: "官方仓库页当前仅列出 1 次提交。功能边界清楚，但历史样本少，采用前应自己保留回归任务。",
    decision: "借鉴改造：非常适合沉淀你的“目标契约”字段和暂停条件；先作为 Builder 前置步骤，不要误认为它能完成后续工作。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/qiaomu-goal-meta-skill" },
      { label: "官方仓库", url: "https://github.com/joeseesun/qiaomu-goal-meta-skill" },
      { label: "官方 linter", url: "https://github.com/joeseesun/qiaomu-goal-meta-skill/blob/main/scripts/lint_goal_command.py" }
    ]
  },
  {
    shape: "workflow",
    itemId: 57,
    title: "Deep Research Skills",
    repository: "Weizhena/Deep-Research-skills",
    atlasClaim: "把可扩展大纲、补项目/字段、并行深挖和最终报告分开，用 JSON 中间产物支持增量研究。",
    actualType: "面向 Claude Code、OpenCode 与 Codex 的多阶段研究 Skill 套件，包含检索 Agent、来源模块、脚本和测试。",
    verifiedFacts: [
      "官方 README 将流程分为 outline、add items/fields、deep research、report 四类命令，并保留人在回路的阶段控制。",
      "Codex 安装除 Skills 外还需复制 web-researcher Agent 与检索模块、安装 PyYAML，并启用 multi_agent 配置。",
      "官方 research-report Skill 从 JSON 结果生成 Markdown，并要求跳过 uncertain 值。"
    ],
    unverified: "没有运行多 Agent 检索，也没有验证搜索覆盖率、引用正确性、成本和并发稳定性；报告质量仍取决于来源和字段设计。",
    install: "克隆官方仓库，按目标 Agent 复制对应 skills/agents/modules；Codex 可用官方 install-codex.sh 或手动配置。",
    prerequisites: "Python 与 PyYAML、可联网检索的 Agent、Codex 多 Agent 功能及相应配置；不同宿主安装路径不同。",
    permission: "会访问互联网、启动研究子 Agent，并在工作区写入 outline、字段定义、JSON 结果和 report.md。",
    license: "MIT",
    maintenance: "官方仓库页列出 49 次提交，包含 tests 与 Codex 专用适配；仍需把上游变化纳入本地回归。",
    decision: "组合使用：最值得借的是“中间产物分阶段 + 人工检查点”；等最小研究样例通过后再启用并行。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/deep-research-skills" },
      { label: "官方仓库", url: "https://github.com/Weizhena/Deep-Research-skills" },
      { label: "官方报告 Skill", url: "https://github.com/Weizhena/Deep-Research-skills/blob/master/skills/research-en/research-report/SKILL.md" }
    ]
  },
  {
    shape: "executor",
    itemId: 18,
    title: "agent-browser",
    repository: "vercel-labs/agent-browser",
    atlasClaim: "用确定性 CLI 与 CDP 驱动真实浏览器，让 Agent 可以重放导航、点击、填写、截图和读取。",
    actualType: "原生 Rust 浏览器自动化 CLI，附带 Agent Skill、MCP 和多种运行环境适配；真正能力来自可执行程序。",
    verifiedFacts: [
      "官方安装流程先安装 agent-browser，再运行 agent-browser install 下载 Chrome for Testing；常规运行不要求 Node 或 Playwright daemon。",
      "CLI 提供 accessibility snapshot、click/fill、截图、cookies/storage、网络拦截、CDP 连接和本地文件访问等命令。",
      "从源码构建才需要 Node.js 24+、pnpm 11+ 和 Rust；许可证为 Apache-2.0。"
    ],
    unverified: "没有用本项目重新安装官方当前版本，也没有验证登录、验证码、站点条款、下载和外部写操作；本页浏览器验收不构成该项目版本认证。",
    install: "npm install -g agent-browser 后运行 agent-browser install；项目也可固定依赖版本。Linux 可能需要 --with-deps。",
    prerequisites: "Chrome/Chromium；只有从源码构建才需要 Node.js 24+、pnpm 11+、Rust。远程浏览器供应商可能另需密钥。",
    permission: "可读取和修改网页、cookies、localStorage、文件上传与下载；启用 file access、CDP 或持久会话会扩大敏感数据范围。",
    license: "Apache-2.0",
    maintenance: "官方仓库页列出 646 次提交，包含 benchmarks、evals、tests 和 changelog；能力面广，升级需特别检查安全相关命令。",
    decision: "直接采用但先隔离：先在测试站点和临时会话做只读任务，再为登录态、文件和外部写入增加逐步授权。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/agent-browser" },
      { label: "官方仓库", url: "https://github.com/vercel-labs/agent-browser" },
      { label: "官方 Skill 目录", url: "https://github.com/vercel-labs/agent-browser/tree/main/skills/agent-browser" }
    ]
  },
  {
    shape: "connector",
    itemId: 54,
    title: "Paper Search MCP",
    repository: "openags/paper-search-mcp",
    atlasClaim: "多源并发搜索与去重，并明确区分各来源能搜索、下载或读取到什么，按开放来源回退。",
    actualType: "Python 学术检索库 + MCP server + CLI + Claude Code Skill，连接多个外部论文元数据与开放获取来源。",
    verifiedFacts: [
      "官方 README 明确采用 free-first、source transparency，并给出各来源 Search/Download/Read 能力矩阵。",
      "高层 search_papers 负责多源并发和去重；download_with_fallback 优先走来源原生与开放获取链路。",
      "多数密钥可选；Unpaywall 需要邮箱，Google Scholar、SSRN 等来源受限，Sci-Hub 仅为可选且由用户承担法律与政策风险。"
    ],
    unverified: "没有调用任何实时论文 API，也没有验证当前地区的来源可用性、速率限制、PDF 合法下载权或结果去重质量。",
    install: "可用 uv tool install paper-search-mcp，再安装相应 Skill；也可按官方 README 配成 MCP、npx、Docker 或源码运行。",
    prerequisites: "Python 工具链或容器/MCP 宿主；联网；按来源可选配置邮箱、API key 或代理。",
    permission: "向多个学术服务发送查询，并可把 PDF/文本写到本地。密钥、代理地址和下载内容都应按敏感数据与许可边界管理。",
    license: "MIT",
    maintenance: "官方仓库页列出 50 次提交，包含 tests、uv lock 与能力矩阵；上游 API 波动仍是运行风险。",
    decision: "先做集成：从 arXiv/OpenAlex/Crossref 等开放来源和只读检索开始，默认关闭法律边界不清的下载回退。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/paper-search-mcp" },
      { label: "官方仓库", url: "https://github.com/openags/paper-search-mcp" },
      { label: "官方 README / 能力矩阵", url: "https://github.com/openags/paper-search-mcp/blob/main/README.md" },
      { label: "官方许可证", url: "https://github.com/openags/paper-search-mcp/blob/main/LICENSE" }
    ]
  },
  {
    shape: "assets",
    itemId: 3,
    title: "shadcn/ui",
    repository: "shadcn-ui/ui",
    atlasClaim: "把组件源码搬进自己的项目，形成可拥有、可修改的组件资产，而不是只依赖黑盒组件包。",
    actualType: "开放组件源码、Registry 与 shadcn CLI 组成的代码分发平台，仓库还提供 Agent Skill；本质不只是提示词。",
    verifiedFacts: [
      "官方 README 的定位是 Open Source、Open Code，并明确用于建立自己的组件库。",
      "官方 CLI 的 init 会安装依赖并配置基础工具；add 会把组件文件和所需依赖写入项目。",
      "官方仓库当前包含 shadcn Skill，说明它会通过 CLI 管理组件、registry、preset 和 components.json。"
    ],
    unverified: "没有在当前项目运行 init/add，也没有验证目标框架、Tailwind、React 版本、主题覆盖和组件可访问性；组件源码进入仓库后维护责任由使用者承担。",
    install: "在兼容前端项目中按官方文档运行 npx shadcn init，再按需 npx shadcn add [component]；所有写入先看 diff。",
    prerequisites: "受支持的前端项目、包管理器和对应样式/组件依赖；具体要求随官方 CLI 与目标 framework 变化。",
    permission: "CLI 会写入组件源码、components.json、样式/变量并安装依赖；apply preset 还可能重写配置和已检测组件。",
    license: "MIT",
    maintenance: "官方仓库页列出 2,416 次提交；官方 package.json 当前显示 shadcn 4.16.2。版本变化快，应固定版本并审查生成 diff。",
    decision: "借鉴改造或兼容项目中直接采用：核心价值是源码所有权和 registry 模式；不是所有项目都需要整套组件体系。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/ui" },
      { label: "官方仓库", url: "https://github.com/shadcn-ui/ui" },
      { label: "官方 CLI 说明", url: "https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/README.md" },
      { label: "官方许可证", url: "https://github.com/shadcn-ui/ui/blob/main/LICENSE.md" }
    ]
  },
  {
    shape: "evaluator",
    itemId: 12,
    title: "Impeccable",
    repository: "pbakaus/impeccable",
    atlasClaim: "用不依赖 LLM 的确定性规则扫描 AI 界面常见问题，适合作为交付前质量门。",
    actualType: "跨 Agent 的设计 Skill + 23 类命令 + Node CLI + 项目 hook + 浏览器迭代工具，不只是静态检查表。",
    verifiedFacts: [
      "官方 CLI 可扫描目录、HTML 文件或 URL，并输出适合 CI 的 JSON；URL 扫描涉及浏览器运行。",
      "官方当前 README 已列出 61 条确定性问题，不是 Atlasnote 收录时的 59 条，说明规则数量会变化。",
      "安装时可选择项目 hook；Codex 还需要在 /hooks 中批准项目 hook。"
    ],
    unverified: "没有在本项目安装或执行 detector，也没有评估误报、漏报和自动修复质量；通过规则不代表真实用户体验优秀。",
    install: "npx impeccable install；需要时再运行 npx impeccable detect。安装/更新时仔细选择是否启用项目 hook。",
    prerequisites: "官方 package.json 要求 Node.js >=22.18.0；扫描 URL 时需要可用浏览器/Puppeteer 路径。",
    permission: "detector 主要读取源码/DOM，但 Skill 命令可编辑 UI；安装会写入 skill、hook 与 .impeccable 配置/运行产物。",
    license: "Apache-2.0；NOTICE 还列出第三方来源说明。",
    maintenance: "官方仓库页列出 1,733 次提交，当前规则数已从 Atlasnote 的 59 增至 61；采用时应记录规则版本。",
    decision: "直接采用为辅助质量门：固定版本、先跑报告模式、保留规则豁免理由，并始终加人工体验审查。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/impeccable" },
      { label: "官方仓库", url: "https://github.com/pbakaus/impeccable" },
      { label: "官方 package.json", url: "https://github.com/pbakaus/impeccable/blob/main/package.json" },
      { label: "官方第三方声明", url: "https://github.com/pbakaus/impeccable/blob/main/NOTICE.md" }
    ]
  },
  {
    shape: "knowledge",
    itemId: 63,
    title: "SwarmVault",
    repository: "swarmclawai/swarmvault",
    atlasClaim: "摄入文件或仓库，生成带来源的 Wiki 与知识图谱，并区分抽取、推断和存疑关系。",
    actualType: "本地优先的 CLI/engine/viewer/MCP 知识工具链，另有桌面应用；包含一个 Agent Skill，但整体远大于 Skill 文档。",
    verifiedFacts: [
      "官方 quickstart 会初始化 vault、摄入来源、编译 wiki/graph 并打开本地查看器；首跑 heuristic provider 不需要 API key。",
      "官方说明每条边可标为 extracted、inferred 或 ambiguous，并有冲突检测、候选审批和带省略说明的 context pack。",
      "代码在本地解析且不发送源码内容；文档/文本在配置云模型后会发送给相应 provider，默认 heuristic 模式完全离线。"
    ],
    unverified: "没有安装 CLI 或桌面端，也没有验证大规模摄入、图谱正确率、删除传播、provider 隐私和长期索引稳定性。",
    install: "CLI 需要 Node.js >=24，可 npm install -g @swarmvaultai/cli；桌面端自带运行时。首轮建议用 heuristic 小样本 quickstart。",
    prerequisites: "CLI 路径需要 Node.js >=24；桌面端需受支持的 Windows/macOS/Linux。云模型、语义检索与 rerank 可能另需 provider/key。",
    permission: "读取本地文件/仓库并写入 raw、wiki、state 和索引；选择云 provider 后，非代码内容可能外发。git commit/自动化参数会扩大写入范围。",
    license: "MIT",
    maintenance: "官方仓库页列出 199 次提交，含 smoke fixtures、validation、worked examples、stability 和 changelog。能力面广，适合分阶段采用。",
    decision: "先借结构再集成：先用来源、状态和删除规则管理一个小型研究库；只有检索价值被证明后再启用模型和自动化。",
    reviewed: "2026-08-31",
    sources: [
      { label: "Atlasnote 介绍", url: "https://atlasnote.ai/zh-CN/skills/swarmvault" },
      { label: "官方仓库", url: "https://github.com/swarmclawai/swarmvault" },
      { label: "官方 Providers 文档", url: "https://www.swarmvault.ai/docs/providers" },
      { label: "官方桌面端", url: "https://github.com/swarmclawai/swarmvault-desktop" }
    ]
  }
];

const shapeGuides = {
  rules: {
    mechanism: "用明确的允许、禁止、顺序和停止条件约束模型行为。",
    bestFor: "输出容易漂移、某些错误必须避免，但不需要真实工具执行的任务。",
    artifact: "一份边界窄、含正反例和触发条件的 SKILL.md。",
    risk: "把个人偏好写成全局规则，或约束太多导致正常任务也受限。"
  },
  collection: {
    mechanism: "把多个相邻领域 Skill 放在同一套目录或产品上下文中。",
    bestFor: "同一团队或产品线有一组稳定且可分开的重复任务。",
    artifact: "若干职责独立的 Skill；只有出现误路由时再增加索引或路由器。",
    risk: "数量看起来丰富，但触发重叠、维护成本和上下文一起膨胀。"
  },
  router: {
    mechanism: "先比较任务信号，再决定加载哪项方法、工作流或工具能力。",
    bestFor: "已有多个相近 Skill，错误选择比缺少能力更常发生。",
    artifact: "带正向触发、近似反例和冲突处理的决策表。",
    risk: "在只有一两项能力时过早加路由层，制造不必要的复杂度。"
  },
  workflow: {
    mechanism: "把目标、阶段、分支、人工确认和交付串成可重复路径。",
    bestFor: "研究、交付、设计、产品推进等需要多个阶段才能完成的任务。",
    artifact: "一个最小端到端 SKILL.md，复杂分支再放入 references/。",
    risk: "把流程写得过长、不可跳过，或与另一个全流程 Skill 重复。"
  },
  executor: {
    mechanism: "用脚本、CLI 或确定性运行时把输入转成真实文件或系统动作。",
    bestFor: "步骤已知，但需要可重跑、可观察、少靠模型临场发挥的执行。",
    artifact: "窄职责 Skill + scripts/，并提供预览、失败码和结果检查。",
    risk: "把“能运行”误当作“结果正确”，或未限制写入范围与破坏性参数。"
  },
  connector: {
    mechanism: "通过 MCP、API、实例或凭证访问模型原本碰不到的外部系统。",
    bestFor: "必须读取远程数据或把结果写入真实协作、自动化和内容平台。",
    artifact: "集成说明、认证与版本前置、最小权限、只读或 dry-run 路径。",
    risk: "没有实例或权限时只有说明价值；外部写入可能造成不可逆影响。"
  },
  assets: {
    mechanism: "用模板、组件、设计 token、骨架或参考资产减少自由度。",
    bestFor: "需要长期保持品牌、格式、角色或交付结构一致的任务。",
    artifact: "SKILL.md + 有权复用的 assets/；说明可变与不可变部分。",
    risk: "直接复制受许可限制的资产，或把模板当成适用于所有场景的答案。"
  },
  evaluator: {
    mechanism: "用测试、规则、检查表、阻断条件或人工确认判断是否合格。",
    bestFor: "输出已经能生成，但返工高、完成声明不可信或风险需要分级。",
    artifact: "可复现检查 + 至少一个应失败样例和一个应通过样例。",
    risk: "只检查易量化指标，忽略真正影响用户和业务的质量。"
  },
  knowledge: {
    mechanism: "保存带来源的上下文，并按当前任务检索、更新和删除。",
    bestFor: "同一资料、决策或失败经验需要跨任务复用且必须可追溯。",
    artifact: "references/ 或知识库 schema，包含来源、更新、保留和删除规则。",
    risk: "只会导入不会更新，或长期把全部资料塞进上下文造成污染。"
  }
};

const gapProfiles = {
  method: {
    code: "METHOD GAP",
    title: "主要缺口：专业方法",
    summary: "先固定一个足够小的专业过程和关键判断点，让相同任务不再每次临场重来。",
    shapes: ["workflow", "rules", "collection"],
    primaryShape: "workflow",
    artifact: "窄职责工作流；复杂决策再放入 references/。",
    evidence: "同类任务能重复经过相同步骤，并正确处理一个已知分支。",
    avoid: "同时安装多个同类全流程合集。",
    stages: ["method"]
  },
  tool: {
    code: "TOOL GAP",
    title: "主要缺口：执行工具",
    summary: "方法已经清楚，下一步是获得一个可观察、可重跑且权限受控的真实执行路径。",
    shapes: ["executor", "connector"],
    primaryShape: "executor",
    artifact: "脚本或 CLI 优先；外部系统再增加集成说明和 dry-run。",
    evidence: "预览或只读路径成功，授权后的动作产生可检查结果。",
    avoid: "用更长提示词模拟本应确定执行的动作。",
    stages: ["act"]
  },
  constraint: {
    code: "CONSTRAINT GAP",
    title: "主要缺口：边界约束",
    summary: "把允许选择、禁止漂移和必须保持的部分写清，减少模型过度发挥。",
    shapes: ["rules", "assets"],
    primaryShape: "rules",
    artifact: "行为规则、设计 token 或有权复用的模板资产。",
    evidence: "已知违规样例会被拒绝，合格任务仍能完整完成。",
    avoid: "把一次偏好上升为所有任务的绝对规则。",
    stages: ["method", "check"]
  },
  verification: {
    code: "VERIFICATION GAP",
    title: "主要缺口：质量验证",
    summary: "先定义成功证据和失败条件，再让生成过程工作到质量门真正通过。",
    shapes: ["evaluator", "rules"],
    primaryShape: "evaluator",
    artifact: "检查器、测试、阻断清单或明确的人工确认门。",
    evidence: "一个失败样例稳定失败，一个合格样例稳定通过。",
    avoid: "只检查格式，却忽略事实、可用性或真实任务结果。",
    stages: ["check"]
  },
  routing: {
    code: "ROUTING GAP",
    title: "主要缺口：能力路由",
    summary: "先收紧各 Skill 的描述；只有真实出现重叠和误触发时才增加路由层。",
    shapes: ["router"],
    primaryShape: "router",
    artifact: "正向触发、近似反例、冲突优先级和停止条件对照表。",
    evidence: "正向任务选择正确能力，近似任务不会误触发。",
    avoid: "能力还很少时先建设复杂编排系统。",
    stages: ["route"]
  },
  memory: {
    code: "MEMORY GAP",
    title: "主要缺口：记忆与复盘",
    summary: "保存来源、失败证据和更新规则，让下次只加载与当前任务相关的可靠片段。",
    shapes: ["knowledge", "evaluator"],
    primaryShape: "knowledge",
    artifact: "带来源字段的 references/ 或知识 schema，加上更新与删除规则。",
    evidence: "信息可按来源检索、修订和删除，失败模式能转成小幅 Skill 更新。",
    avoid: "只追加不删除，或把所有历史永久塞进上下文。",
    stages: ["learn"]
  }
};

const scenarios = {
  engineering: {
    domain: "engineering",
    title: "软件功能从需求到发布",
    summary: "先把需求写成可检查契约，再选择一个最小工程流程，用真实浏览器和结构审查完成闭环。",
    principle: "gstack 已覆盖多阶段；采用它时，不要再叠加多个同类全流程套件。",
    example: {
      prompt: "在现有能力地图中新增可交互的场景演练台，保持原生成器可用，并通过桌面、平板和手机验收。",
      symptom: "如果直接开始改代码，容易只补静态界面，漏掉演示状态、键盘路径和相邻功能回归。",
      gap: "method",
      gapLabel: "专业方法",
      shapes: "目标路由 + 小型工程闭环 + 浏览器执行器 + 质量治理",
      output: "可运行的场景演练台、交互状态和三视口浏览器证据",
      validation: "五类场景可切换；演示可前进、后退、重置；Builder 回归通过；1440 / 768 / 390 无横向溢出。",
      skillName: "frontend-scenario-demonstrator",
      task: "为已有研究型网页增加可操作的使用场景演示，并保持原有交互不回归",
      trigger: "需要把抽象能力关系变成网页中的逐步演示时使用；只改一段静态文案时不要使用",
      capabilityIds: [62, 0, 18, 80, 74],
      demo: [
        { phase: "定义", title: "把需求改写成可观察结果", action: "锁定五类场景、七段对应关系、五步演示和 Builder 预填，不扩展后台或联网能力。", result: "得到一份边界明确的修订契约。", evidence: "每个要求都有对应 DOM 状态、浏览器动作或文件检查。" },
        { phase: "诊断", title: "识别主要缺口是方法而不是工具", action: "对照现状：已有 tabs 和数据，但缺少把输入、缺口、动作、证据串起来的演示方法。", result: "优先补小型交互流程，不更换技术栈。", evidence: "基线能切场景，却只能读到静态组合清单。" },
        { phase: "组合", title: "让五类能力各担一职", action: "用目标路由锁范围、小型工程 Skill 管步骤、浏览器 CLI 验证、Keel 检查结构、Skill Doctor 记录失败。", result: "组合覆盖定义、实现、验证与改进，没有第二套全流程。", evidence: "所选能力分布在五个不同工作链角色。" },
        { phase: "执行", title: "实现并走完整交互路径", action: "先完成桌面关系地图和演示控制，再适配平板、手机、键盘与深色主题。", result: "用户可切换场景并逐步看到动作、结果和证据。", evidence: "浏览器中按钮状态、aria-live 内容和 Builder 表单同步变化。" },
        { phase: "验收", title: "用证据关闭任务", action: "回归原 Skill 生成器，检查三视口溢出、键盘路径、主题、控制台和自动验证。", result: "形成可交付网页和可复现验收记录。", evidence: "所有覆盖行均为 pass，且无浏览器错误。" }
      ]
    },
    steps: [
      ["/goal 或规格 Skill", "结果、边界与验收", "目标"],
      ["Matt Pocock / Waza", "选择一个小型工程闭环", "方法"],
      ["领域能力按需加入", "shadcn、Supabase、GSAP 等", "执行"],
      ["Agent Browser", "真实浏览器 QA", "验证"],
      ["Keel / Skill Doctor", "结构治理与失败复盘", "改进"]
    ]
  },
  research: {
    domain: "research",
    title: "深度研究到可交付报告",
    summary: "把搜索、综合、写作与排版拆开，以中间产物保存来源和未决问题。",
    principle: "边搜边写最容易造成来源漂移；最后一步才生成报告。",
    example: {
      prompt: "分析一个 AI 产品网页的真实能力、运行原理、使用场景和扩展方向，逐项保留来源与未验证边界。",
      symptom: "一边搜索一边写结论，模块数量和说法不断变化，最后无法说明每个判断来自哪里。",
      gap: "verification",
      gapLabel: "质量验证",
      shapes: "目标路由 + 研究工作流 + 外部检索连接器 + 诚信质量门 + 来源知识库",
      output: "能力清单、分类模型、证据表和带来源的综合报告",
      validation: "每个能力判断可追到页面或原仓库；目录数量闭合；推断与已验证事实明确分开。",
      skillName: "evidence-led-capability-research",
      task: "把产品网页和相关来源研究成可追溯的能力模型与使用场景报告",
      trigger: "需要理解产品背后的能力、机制和证据，而不是概括页面文案时使用",
      capabilityIds: [62, 57, 11, 17, 63],
      demo: [
        { phase: "定义", title: "先固定研究问题和证据边界", action: "列出能力、机制、场景、扩展、个人意义五个问题，并标明哪些必须逐项核对。", result: "研究不再被网页视觉或热门条目带偏。", evidence: "大纲中每个结论槽位都有对应来源字段。" },
        { phase: "建模", title: "先建清单和中间产物", action: "抓取全部条目，保留标题、链接、摘要，再编码领域、形态、链路与采用方式。", result: "综合写作前已有结构化事实底座。", evidence: "id 连续、链接唯一、各分类计数闭合。" },
        { phase: "检索", title: "只为未决问题调用外部来源", action: "用近期讨论补使用反馈，用论文或原仓库补技术原理，不把搜索结果摘要直接当事实。", result: "不同来源各自回答适合的问题。", evidence: "每条外部结论保留来源类型、时间和访问边界。" },
        { phase: "验证", title: "在写报告前过诚信门", action: "检查无来源断言、数量矛盾、许可推断和无法执行的连接器声明。", result: "事实、编辑摘要和分析推断被明确分层。", evidence: "失败项会阻断最终报告，而不是只显示提醒。" },
        { phase: "交付", title: "最后才生成阅读与决策界面", action: "把稳定中间产物转成报告或交互网页，并保留来源关系和复核日期。", result: "读者既能看结论，也能回到证据。", evidence: "报告、网页数据和来源清单的条目集合一致。" }
      ]
    },
    steps: [
      ["/goal", "研究问题、来源边界和完成条件", "目标"],
      ["大纲先行调研", "建立 JSON 中间产物", "方法"],
      ["last30days / 论文 MCP", "获取人群讨论与学术来源", "执行"],
      ["学术诚信门", "检查来源与未证实断言", "验证"],
      ["PPT / HTML / SwarmVault", "交付并保存来源关系", "交付"]
    ]
  },
  visual: {
    domain: "design",
    title: "品牌视觉与内容生产",
    summary: "先用真实小样选择方向，再用设计系统维持系列一致，最后检查可用性和品牌风险。",
    principle: "视觉任务最关键的能力，常常是低成本选方向和长期一致，而不是一次生成。",
    example: {
      prompt: "为一篇 Agent 能力研究报告制作三张系列插画：封面、能力链和安全边界，要求同一视觉语言且手机端可读。",
      symptom: "直接让模型生成三张图时，每张都好看但不像同一系列，文字、比例和信息密度也无法用于真实版面。",
      gap: "constraint",
      gapLabel: "边界约束",
      shapes: "方向选择工作流 + 设计系统资产 + 可编辑生产流程 + 确定性评测",
      output: "三张同系列、尺寸正确、可编辑并经过检查的视觉资产",
      validation: "颜色、构图语法和主体锚点一致；缩小后仍可辨认；不存在品牌、版权或文字可读性阻断项。",
      skillName: "research-visual-series",
      task: "把研究内容转成一组视觉语言一致且可用于真实版面的系列资产",
      trigger: "同一内容需要两张以上系列视觉并且一致性比单张惊艳更重要时使用",
      capabilityIds: [67, 69, 56, 12],
      demo: [
        { phase: "澄清", title: "先定义使用位置而不是先选风格", action: "确认封面、正文图和手机卡片的尺寸、文字区、主体和不可改变的信息。", result: "视觉判断有真实版面约束。", evidence: "每张图都有目标尺寸、最小字号和内容职责。" },
        { phase: "选向", title: "用互斥小样降低选择成本", action: "先做三到四个低成本方向，只比较构图、色彩和气质，不制作最终细节。", result: "用户在真实视觉上选择一条方向。", evidence: "被选方向和淘汰原因被记录，后续不混搭。" },
        { phase: "约束", title: "把方向固化成小型设计系统", action: "定义颜色数量、线条、留白、人物比例、文字区和允许的变化范围。", result: "三张图共享同一视觉语法。", evidence: "资产可以用同一组 token 和构图规则重建。" },
        { phase: "生产", title: "把创意和最终交付分开", action: "先生成或绘制主体，再在可编辑画布中完成尺寸、文字和导出。", result: "修改某一张不会迫使整套重新生成。", evidence: "存在可编辑源文件与目标格式导出。" },
        { phase: "检查", title: "确定性检查后再做人工品牌判断", action: "扫描尺寸、对齐、对比、文字安全区，再人工检查品牌独特性和版权风险。", result: "技术问题与审美判断被分开处理。", evidence: "检查清单通过，人工阻断项有明确签字或记录。" }
      ]
    },
    steps: [
      ["品牌上下文", "对象、受众与应用场景", "目标"],
      ["风格试衣间", "四个互斥方向供人工选择", "路由"],
      ["Taste / 不二设计系统", "建立风格与组件约束", "方法"],
      ["Logo / IP / Remotion", "生产可编辑视觉资产", "执行"],
      ["Impeccable + 人工审查", "质量、尺寸与品牌判断", "验证"]
    ]
  },
  product: {
    domain: "product",
    title: "产品管理与项目推进",
    summary: "把讨论转成可检查的决策、依赖、验收和协作系统状态，而不是只生成更多文档。",
    principle: "文档只是中间产物；真正价值是决策被记录、任务被推进、结果可验收。",
    example: {
      prompt: "把一次关于‘能力落地工作台’的讨论整理成可开发范围、依赖、验收和协作任务，并同步到团队系统。",
      symptom: "会议后生成了很长的 PRD，但优先级、未决问题和负责人没有进入真实工作系统，下一次仍从头讨论。",
      gap: "routing",
      gapLabel: "能力路由",
      shapes: "目标路由 + 产品方法集合 + 任务路由 + 协作执行器 + 质量治理",
      output: "决策记录、最小 PRD、依赖表、可执行工作项和验收状态",
      validation: "每个工作项有负责人、依赖和完成证据；未决问题不会伪装成已确定需求；写入前有 dry-run。",
      skillName: "decision-to-delivery",
      task: "把产品讨论转成可执行、可追踪、可验收的团队工作项",
      trigger: "会议或访谈已经产生决策，但还没有形成真实负责人、依赖和验收状态时使用",
      capabilityIds: [62, 41, 25, 28, 80],
      demo: [
        { phase: "定义", title: "区分问题、决定和假设", action: "把讨论拆成已决定、待验证、明确不做和需要负责人四类。", result: "未决内容不会被 PRD 语气伪装成事实。", evidence: "每条记录有状态、来源和决策人。" },
        { phase: "成形", title: "只写支撑推进的最小文档", action: "为目标用户、范围、关键流程、约束和验收建立结构化中间产物。", result: "文档足够交接，但不会用篇幅代替决定。", evidence: "每个章节都能映射到一个后续动作或验收。" },
        { phase: "路由", title: "把不同问题交给正确角色", action: "风险进入评审，技术未知进入 spike，设计未知进入原型，已确定需求进入实施。", result: "同一模板不再处理所有问题。", evidence: "每个工作项有类型、负责人和下一状态。" },
        { phase: "写入", title: "先预览再更新真实协作系统", action: "通过 CLI 生成 dry-run 变更计划，人工确认后创建任务和关联依赖。", result: "文档信息变成团队可见的系统状态。", evidence: "保存变更预览、创建结果和失败恢复路径。" },
        { phase: "验收", title: "用阶段证据推进而不是口头完成", action: "评审依赖、验收、风险和实际产物，更新状态并记录返工原因。", result: "完成状态可以被团队复核。", evidence: "关闭任务前，约定验收项与真实产物一一对应。" }
      ]
    },
    steps: [
      ["访谈与需求澄清", "确认问题而不是先写方案", "目标"],
      ["PRD / PM 工作流", "形成结构化中间产物", "方法"],
      ["风险、依赖与验收", "转成可执行工作项", "路由"],
      ["飞书 CLI（dry-run）", "写入真实协作系统", "执行"],
      ["阶段评审与复盘", "更新模板和路由规则", "改进"]
    ]
  },
  knowledge: {
    domain: "research",
    title: "个人知识与学习系统",
    summary: "知识库的价值不是第一次导入，而是让来源、更新、删除和针对任务的检索长期成立。",
    principle: "不要把全部资料长期塞进上下文；只在当前任务需要时检索可追溯片段。",
    example: {
      prompt: "把这个能力研究项目变成以后分析其他产品时可检索、可更新、可删除的个人知识底座。",
      symptom: "资料保存很多，但下一次任务仍靠全文搜索和记忆；过期结论、重复文件和来源不明的笔记越来越多。",
      gap: "memory",
      gapLabel: "记忆与复盘",
      shapes: "原生知识格式 + 来源知识图谱 + 按任务检索规则 + 练习反馈 + 会话改进",
      output: "带来源、版本、更新和删除规则的可检索知识库",
      validation: "能回答一个真实问题并返回来源；替换原材料后索引可更新；删除来源后相关结论不再被检索。",
      skillName: "traceable-research-memory",
      task: "把研究项目沉淀为可按任务检索并能持续更新和删除的个人知识资产",
      trigger: "同类研究已经重复出现，旧材料需要被复用但来源和时效必须可追踪时使用",
      capabilityIds: [62, 15, 8, 55, 74],
      demo: [
        { phase: "摄入", title: "保留原文件和来源身份", action: "按项目、日期、来源和许可摄入文档，不把所有内容合并成一篇无来源总结。", result: "每个知识片段都能回到原始材料。", evidence: "记录 source、captured_at、scope 和可删除标识。" },
        { phase: "建模", title: "只建立任务需要的关系", action: "围绕能力、机制、场景、风险和来源建立链接，不追求一次画出完整世界模型。", result: "知识结构服务于后续查询。", evidence: "一个真实问题能沿关系找到相关材料。" },
        { phase: "检索", title: "按当前任务加载最小上下文", action: "先明确问题，再检索相关片段、来源和冲突版本，避免把整个知识库塞进上下文。", result: "回答更短、更相关且可追溯。", evidence: "检索结果包含命中原因和来源链接。" },
        { phase: "学习", title: "用短练习检查是否真正理解", action: "完成一次分析后做预测、追踪或解释练习，暴露只会复制结论的假理解。", result: "知识从收藏转成可调用判断。", evidence: "练习答案能引用规则，并处理一个新例子。" },
        { phase: "改进", title: "从失败会话更新而不是只追加", action: "定期找误检索、过期结论和重复片段，修改触发、索引或删除规则。", result: "知识库随任务变得更小而可靠。", evidence: "每次修改有失败样本、变更原因和回归问题。" }
      ]
    },
    steps: [
      ["Obsidian / SwarmVault", "摄入文件并保留来源", "执行"],
      ["链接、标签与图谱", "建立可查询知识结构", "方法"],
      ["按任务检索", "只加载当前需要的内容", "路由"],
      ["代码后短练习", "预测、追踪与讲解", "学习"],
      ["Skill Doctor", "从会话失败更新能力", "改进"]
    ]
  }
};

const mapperScenarioLabels = {
  engineering: "软件与网页",
  research: "研究与分析",
  visual: "视觉与内容",
  product: "产品与协作",
  knowledge: "知识与学习"
};

const state = {
  query: "",
  domain: "all",
  shape: "all",
  stage: "all",
  adoption: "all",
  diagnosticGap: null,
  activeVerification: "rules",
  activeScenario: "engineering",
  demoStep: 0,
  mapperScenario: "research",
  mapperGap: "verification",
  selectedIds: new Set(),
  showAll: false
};

const grid = document.querySelector("#capability-grid");
const searchInput = document.querySelector("#search-input");
const domainFilter = document.querySelector("#domain-filter");
const shapeFilter = document.querySelector("#shape-filter");
const adoptionFilter = document.querySelector("#adoption-filter");
const resultCount = document.querySelector("#result-count");
const filterSummary = document.querySelector("#filter-summary");
const showAllButton = document.querySelector("#show-all");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#detail-dialog");
const selectedPatterns = document.querySelector("#selected-patterns");
const selectedCount = document.querySelector("#selected-count");
const selectionFab = document.querySelector("#selection-fab");
const shapeGuideGrid = document.querySelector("#shape-guide-grid");
const gapRecommendation = document.querySelector("#gap-recommendation");
const verificationList = document.querySelector("#verification-list");
const verificationDetail = document.querySelector("#verification-detail");
const scenarioPanel = document.querySelector("#scenario-panel");
const scenarioMapper = document.querySelector("#scenario-mapper");
const mapperTask = document.querySelector("#mapper-task");
const skillForm = document.querySelector("#skill-form");
const skillPreview = document.querySelector("#skill-preview");
const builderStatus = document.querySelector("#builder-status");
const copySkillButton = document.querySelector("#copy-skill");
const downloadSkillButton = document.querySelector("#download-skill");
let dialogTrigger = null;
let activeDialogItem = null;
let generatedSkill = "";
let generatedSkillName = "";

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function filteredCapabilities() {
  const query = state.query.trim().toLocaleLowerCase("zh-CN");
  return capabilities.filter(item => {
    const haystack = `${item.title} ${item.essence} ${item.note} ${labels.domains[item.domain]} ${labels.shapes[item.shape]} ${labels.stages[item.stage]} ${labels.adoptions[item.adoption]} ${labels.permissions[item.permission]}`.toLocaleLowerCase("zh-CN");
    return (!query || haystack.includes(query))
      && (state.domain === "all" || item.domain === state.domain)
      && (state.shape === "all" || item.shape === state.shape)
      && (state.stage === "all" || item.stage === state.stage)
      && (state.adoption === "all" || item.adoption === state.adoption);
  });
}

function renderCapabilities() {
  const filtered = filteredCapabilities();
  const hasFilters = state.query || state.domain !== "all" || state.shape !== "all" || state.stage !== "all" || state.adoption !== "all";
  const visible = state.showAll || hasFilters ? filtered : filtered.slice(0, 18);

  resultCount.textContent = String(filtered.length);
  const summaries = [];
  if (state.query) summaries.push(`搜索“${state.query}”`);
  if (state.domain !== "all") summaries.push(labels.domains[state.domain]);
  if (state.shape !== "all") summaries.push(labels.shapes[state.shape]);
  if (state.stage !== "all") summaries.push(labels.stages[state.stage]);
  if (state.adoption !== "all") summaries.push(labels.adoptions[state.adoption]);
  filterSummary.textContent = summaries.length ? `· ${summaries.join(" / ")}` : "· 当前显示全部能力";

  showAllButton.hidden = hasFilters || filtered.length <= 18;
  showAllButton.textContent = state.showAll ? "收起到前 18 项" : "显示全部 81 项";
  showAllButton.setAttribute("aria-pressed", String(state.showAll));
  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;

  grid.innerHTML = visible.map(item => `
    <article class="capability-card${state.selectedIds.has(item.id) ? " is-selected" : ""}" data-module-id="${item.id}">
      <div class="card-topline">
        <span class="card-index">#${String(item.id).padStart(2, "0")}</span>
        <span class="card-stage">${escapeHTML(labels.stages[item.stage])}</span>
      </div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.essence)}</p>
      <div class="card-footer">
        <div class="card-tags"><span>${escapeHTML(labels.domains[item.domain])}</span><span>${escapeHTML(labels.shapes[item.shape])}</span><span class="adoption-tag">${escapeHTML(labels.adoptions[item.adoption])}</span></div>
        <div class="card-actions">
          <button class="card-select" type="button" data-toggle-select="${item.id}" aria-pressed="${state.selectedIds.has(item.id)}">${state.selectedIds.has(item.id) ? "已加入" : "加入蓝图"}</button>
          <button class="card-detail" type="button" data-open-detail="${item.id}" aria-label="查看 ${escapeHTML(item.title)} 的能力详情">↗</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderVerificationLab(shape = state.activeVerification) {
  const record = verificationRecords.find(candidate => candidate.shape === shape) || verificationRecords[0];
  state.activeVerification = record.shape;

  verificationList.querySelectorAll("[data-verification-shape]").forEach(tab => {
    const selected = tab.dataset.verificationShape === record.shape;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  verificationDetail.setAttribute("aria-labelledby", `verify-tab-${record.shape}`);
  verificationDetail.innerHTML = `
    <header class="verification-record-heading">
      <div>
        <p class="micro-label">${escapeHTML(labels.shapes[record.shape])} / #${String(record.itemId).padStart(2, "0")}</p>
        <h3>${escapeHTML(record.title)}</h3>
        <p class="verification-repository">${escapeHTML(record.repository)}</p>
      </div>
      <div class="verification-boundary" aria-label="当前证据状态">
        <span data-evidence="verified">官方来源支持</span>
        <span data-evidence="unrun">未在本项目运行</span>
        <time datetime="${escapeHTML(record.reviewed)}">复核 ${escapeHTML(record.reviewed)}</time>
      </div>
    </header>

    <div class="verification-claim">
      <p class="micro-label">ATLASNOTE SAYS</p>
      <p>${escapeHTML(record.atlasClaim)}</p>
    </div>

    <div class="verification-fact-layout">
      <section>
        <p class="micro-label">OFFICIAL SOURCES CONFIRM</p>
        <h4>原仓库能确认什么</h4>
        <ul>${record.verifiedFacts.map(fact => `<li>${escapeHTML(fact)}</li>`).join("")}</ul>
      </section>
      <section class="verification-unverified">
        <p class="micro-label">NOT VERIFIED HERE</p>
        <h4>还不能据此声称什么</h4>
        <p>${escapeHTML(record.unverified)}</p>
      </section>
    </div>

    <dl class="verification-specs">
      <div><dt>真实项目类型</dt><dd>${escapeHTML(record.actualType)}</dd></div>
      <div><dt>安装方式</dt><dd>${escapeHTML(record.install)}</dd></div>
      <div><dt>运行前置</dt><dd>${escapeHTML(record.prerequisites)}</dd></div>
      <div><dt>权限与数据</dt><dd>${escapeHTML(record.permission)}</dd></div>
      <div><dt>许可证</dt><dd>${escapeHTML(record.license)}</dd></div>
      <div><dt>维护信号</dt><dd>${escapeHTML(record.maintenance)}</dd></div>
    </dl>

    <div class="verification-decision">
      <div><p class="micro-label">ADOPTION DECISION</p><strong>对你的落地建议</strong></div>
      <p>${escapeHTML(record.decision)}</p>
    </div>

    <footer class="verification-record-footer">
      <div class="verification-sources" aria-label="核验来源">
        ${record.sources.map(source => `<a href="${escapeHTML(source.url)}" target="_blank" rel="noreferrer">${escapeHTML(source.label)} <span aria-hidden="true">↗</span></a>`).join("")}
      </div>
      <button type="button" data-locate-verified="${record.itemId}">在 81 项中定位</button>
    </footer>
  `;
}

function locateVerifiedCapability(itemId) {
  const item = capabilities.find(candidate => candidate.id === itemId);
  if (!item) return;
  resetFilters();
  state.query = item.title;
  searchInput.value = item.title;
  renderCapabilities();
  document.querySelector("#explorer").scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
  requestAnimationFrame(() => {
    const target = document.querySelector(`[data-module-id="${item.id}"] [data-open-detail]`);
    if (target) target.focus({ preventScroll: true });
  });
}

function countBy(key) {
  return capabilities.reduce((counts, item) => {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
    return counts;
  }, {});
}

function renderTaxonomy() {
  const groups = [
    ["domain-counts", "domain", labels.domains],
    ["shape-counts", "shape", labels.shapes],
    ["stage-counts", "stage", labels.stages]
  ];

  groups.forEach(([targetId, key, labelMap]) => {
    const counts = countBy(key);
    document.querySelector(`#${targetId}`).innerHTML = Object.entries(labelMap).map(([value, label]) => `
      <div class="count-row"><span>${escapeHTML(label)}</span><strong>${counts[value] || 0}</strong></div>
    `).join("");
  });

  const adoptionCounts = countBy("adoption");
  document.querySelectorAll("[data-adoption-count]").forEach(node => {
    node.textContent = String(adoptionCounts[node.dataset.adoptionCount] || 0);
  });
}

function renderShapeGuide() {
  const counts = countBy("shape");
  shapeGuideGrid.innerHTML = Object.entries(labels.shapes).map(([shape, label], index) => {
    const guide = shapeGuides[shape];
    return `
      <details class="shape-guide" data-shape-guide="${shape}">
        <summary>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><strong>${escapeHTML(label)}</strong><small>${counts[shape] || 0} 项 · ${escapeHTML(guide.mechanism)}</small></div>
          <i aria-hidden="true">＋</i>
        </summary>
        <div class="shape-guide-body">
          <dl>
            <div><dt>适合</dt><dd>${escapeHTML(guide.bestFor)}</dd></div>
            <div><dt>最小落地物</dt><dd>${escapeHTML(guide.artifact)}</dd></div>
            <div><dt>主要风险</dt><dd>${escapeHTML(guide.risk)}</dd></div>
          </dl>
          <button type="button" data-guide-filter="${shape}">查看 ${counts[shape] || 0} 项${escapeHTML(label)} <span aria-hidden="true">→</span></button>
        </div>
      </details>
    `;
  }).join("");
}

function renderGapProfile(gap) {
  const profile = gapProfiles[gap];
  if (!profile) return;
  state.diagnosticGap = gap;
  document.querySelectorAll("[data-gap-select]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.gapSelect === gap));
  });
  document.querySelector("#gap-code").textContent = profile.code;
  document.querySelector("#gap-result-title").textContent = profile.title;
  document.querySelector("#gap-result-summary").textContent = profile.summary;
  document.querySelector("#gap-result-shapes").textContent = profile.shapes.map(shape => labels.shapes[shape]).join(" / ");
  document.querySelector("#gap-result-artifact").textContent = profile.artifact;
  document.querySelector("#gap-result-evidence").textContent = profile.evidence;
  document.querySelector("#gap-result-avoid").textContent = profile.avoid;
  document.querySelector("#apply-gap-builder").disabled = false;
  document.querySelector("#filter-gap-shape").disabled = false;
  gapRecommendation.dataset.activeGap = gap;
}

function applyShapeFilter(shape) {
  state.query = "";
  state.domain = "all";
  state.shape = shape;
  state.stage = "all";
  state.adoption = "all";
  state.showAll = true;
  searchInput.value = "";
  domainFilter.value = "all";
  shapeFilter.value = shape;
  adoptionFilter.value = "all";
  document.querySelectorAll("[data-stage-filter], [data-adoption-filter]").forEach(button => button.setAttribute("aria-pressed", "false"));
  renderCapabilities();
  document.querySelector("#explorer").scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
}

function markBlueprintStale(message = "选择已变化，请重新生成草案。") {
  if (!generatedSkill) return;
  generatedSkill = "";
  generatedSkillName = "";
  copySkillButton.disabled = true;
  downloadSkillButton.disabled = true;
  document.querySelector("#preview-state").textContent = "需要重新生成";
  builderStatus.textContent = message;
  builderStatus.className = "form-status";
}

function analyzeSelection(items, gap) {
  const profile = gapProfiles[gap];
  const stageCounts = items.reduce((counts, item) => {
    counts[item.stage] = (counts[item.stage] || 0) + 1;
    return counts;
  }, {});
  const overlap = Object.values(stageCounts).reduce((total, count) => total + Math.max(0, count - 1), 0);
  const integrations = items.filter(item => ["external-read", "external-write"].includes(item.permission));
  const matchesGap = items.some(item => profile.shapes.includes(item.shape) || profile.stages.includes(item.stage));
  const broadWorkflows = items.filter(item => ["collection", "workflow"].includes(item.shape)).length;
  return {
    roles: Object.keys(stageCounts).length,
    overlap,
    integrations: integrations.length,
    matchesGap,
    broadWorkflows,
    suggestion: profile.primaryShape
  };
}

function renderSelectionAudit() {
  const items = capabilities.filter(item => state.selectedIds.has(item.id));
  const gap = document.querySelector("#skill-gap").value;
  const audit = analyzeSelection(items, gap);
  const stateNode = document.querySelector("#audit-state");
  const summaryNode = document.querySelector("#audit-summary");
  const signalsNode = document.querySelector("#audit-signals");
  const suggestionButton = document.querySelector("#audit-suggestion");

  document.querySelector("#audit-role-count").textContent = String(audit.roles);
  document.querySelector("#audit-overlap-count").textContent = String(audit.overlap);
  document.querySelector("#audit-integration-count").textContent = String(audit.integrations);

  if (!items.length) {
    stateNode.textContent = "等待选择";
    stateNode.dataset.tone = "neutral";
    summaryNode.textContent = "先选择一项能力模式。体检只判断与主要缺口的匹配、职责是否集中和是否存在外部依赖，不要求凑齐整条七段链。";
    signalsNode.innerHTML = "";
    suggestionButton.hidden = true;
    return;
  }

  const signals = [
    audit.matchesGap ? `<span data-tone="good">✓ 匹配${labelsForGap(gap)}</span>` : `<span data-tone="warn">! 未覆盖${labelsForGap(gap)}</span>`,
    `<span>${audit.roles} 个不同工作链角色</span>`
  ];
  if (audit.overlap) signals.push(`<span data-tone="warn">${audit.overlap} 项同阶段重复</span>`);
  if (audit.integrations) signals.push(`<span data-tone="risk">${audit.integrations} 项需要外部读写前置</span>`);
  if (audit.broadWorkflows >= 3) signals.push(`<span data-tone="risk">大工作流偏多</span>`);
  signalsNode.innerHTML = signals.join("");

  if (!audit.matchesGap) {
    stateNode.textContent = "需要补缺";
    stateNode.dataset.tone = "warn";
    summaryNode.textContent = `当前选择没有直接覆盖“${labelsForGap(gap)}”。最小补充方向是 ${labels.shapes[audit.suggestion]}；先筛选这一类，不需要继续增加其他大合集。`;
    suggestionButton.hidden = false;
    suggestionButton.dataset.auditShape = audit.suggestion;
    suggestionButton.textContent = `筛选 ${labels.shapes[audit.suggestion]}`;
  } else if (audit.broadWorkflows >= 3 || audit.overlap >= 3) {
    stateNode.textContent = "职责集中";
    stateNode.dataset.tone = "risk";
    summaryNode.textContent = "当前选择已经覆盖主要缺口，但多个模块承担相近阶段。优先删除职责最相似的一项，再考虑增加新能力。";
    suggestionButton.hidden = true;
  } else if (audit.integrations) {
    stateNode.textContent = "先核对依赖";
    stateNode.dataset.tone = "warn";
    summaryNode.textContent = "组合方向可用，但包含外部读写能力。生成 Skill 前先确认实例、版本、凭证、权限和只读或 dry-run 路径。";
    suggestionButton.hidden = true;
  } else {
    stateNode.textContent = "组合聚焦";
    stateNode.dataset.tone = "good";
    summaryNode.textContent = "当前选择覆盖主要缺口，且职责没有明显堆叠。先用一个真实任务验证，不要为了“完整”继续添加模块。";
    suggestionButton.hidden = true;
  }
}

function renderSelection() {
  const selected = capabilities.filter(item => state.selectedIds.has(item.id));
  selectedCount.textContent = `${selected.length} / 6`;
  selectedPatterns.innerHTML = selected.length ? selected.map(item => `
    <span class="selected-chip"><span>#${String(item.id).padStart(2, "0")} ${escapeHTML(item.title)}</span><button type="button" data-remove-selected="${item.id}" aria-label="移除 ${escapeHTML(item.title)}">×</button></span>
  `).join("") : "";
  document.querySelector("#selection-help").hidden = selected.length > 0;
  document.querySelector("#clear-selection").disabled = selected.length === 0;
  selectionFab.hidden = selected.length === 0;
  selectionFab.querySelector("strong").textContent = `${selected.length} / 6`;
  selectionFab.querySelector("span").textContent = "去生成我的 Skill";
  if (activeDialogItem) {
    const selectedInDialog = state.selectedIds.has(activeDialogItem.id);
    const dialogSelect = document.querySelector("#dialog-select");
    dialogSelect.textContent = selectedInDialog ? "从技能蓝图移除" : "加入技能蓝图";
    dialogSelect.setAttribute("aria-pressed", String(selectedInDialog));
  }
  renderSelectionAudit();
}

function setBuilderStatus(message, kind = "") {
  builderStatus.textContent = message;
  builderStatus.className = `form-status${kind ? ` is-${kind}` : ""}`;
}

function toggleSelection(id) {
  if (state.selectedIds.has(id)) {
    state.selectedIds.delete(id);
    markBlueprintStale();
  } else if (state.selectedIds.size >= 6) {
    setBuilderStatus("最多选择六项。先移除职责重复的模式，再加入新的能力。", "error");
    selectionFab.querySelector("span").textContent = "已达上限，先移除一项";
    return false;
  } else {
    state.selectedIds.add(id);
    markBlueprintStale();
  }
  renderSelection();
  renderCapabilities();
  return true;
}

function resetFilters({ focus = false } = {}) {
  state.query = "";
  state.domain = "all";
  state.shape = "all";
  state.stage = "all";
  state.adoption = "all";
  state.showAll = false;
  searchInput.value = "";
  domainFilter.value = "all";
  shapeFilter.value = "all";
  adoptionFilter.value = "all";
  document.querySelectorAll("[data-stage-filter]").forEach(button => button.setAttribute("aria-pressed", "false"));
  document.querySelectorAll("[data-adoption-filter]").forEach(button => button.setAttribute("aria-pressed", "false"));
  renderCapabilities();
  if (focus) searchInput.focus();
}

function preferredScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function openDetail(item, trigger) {
  dialogTrigger = trigger;
  activeDialogItem = item;
  document.querySelector("#dialog-index").textContent = `#${String(item.id).padStart(2, "0")}`;
  document.querySelector("#dialog-domain").textContent = labels.domains[item.domain];
  document.querySelector("#dialog-shape").textContent = labels.shapes[item.shape];
  document.querySelector("#dialog-title").textContent = item.title;
  document.querySelector("#dialog-essence").textContent = item.essence;
  document.querySelector("#dialog-note").textContent = item.note;
  document.querySelector("#dialog-stage").textContent = labels.stages[item.stage];
  document.querySelector("#dialog-adoption").textContent = `${labels.adoptions[item.adoption]}。${{
    direct: "边界较清楚，可以先在低风险任务中独立试用。",
    compose: "它主要承担工作链的一段，需要目标、执行或验证角色补齐闭环。",
    adapt: "最有价值的是结构和约束，应按你的任务重写而不是原样搬运。",
    integration: "真实价值依赖外部环境，先核对实例、版本、凭证和权限。"
  }[item.adoption]}`;
  document.querySelector("#dialog-permission").textContent = labels.permissions[item.permission];
  document.querySelector("#dialog-source").href = item.url;
  renderSelection();
  dialog.showModal();
  document.querySelector(".dialog-close").focus();
}

function closeDialog() {
  if (!dialog.open) return;
  const replacementTrigger = activeDialogItem ? document.querySelector(`[data-open-detail="${activeDialogItem.id}"]`) : null;
  dialog.close();
  activeDialogItem = null;
  (replacementTrigger || dialogTrigger)?.focus();
}

function renderScenario(key, requestedStep = null) {
  const scenario = scenarios[key];
  const example = scenario.example;
  state.activeScenario = key;
  if (Number.isInteger(requestedStep)) {
    state.demoStep = Math.max(0, Math.min(example.demo.length - 1, requestedStep));
  }
  const activeDemo = example.demo[state.demoStep];
  const demoComplete = state.demoStep === example.demo.length - 1;
  const activeTab = document.querySelector(`[data-scenario="${key}"]`);
  document.querySelectorAll("[role=tab]").forEach(tab => {
    const active = tab === activeTab;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  scenarioPanel.setAttribute("aria-labelledby", activeTab.id);
  scenarioPanel.innerHTML = `
    <div class="scenario-summary">
      <p class="micro-label">${escapeHTML(key.toUpperCase())} STACK</p>
      <h3>${escapeHTML(scenario.title)}</h3>
      <p>${escapeHTML(scenario.summary)}</p>
      <div class="scenario-request">
        <span>演示输入</span>
        <p>“${escapeHTML(example.prompt)}”</p>
      </div>
      <p class="scenario-principle">${escapeHTML(scenario.principle)}</p>
    </div>
    <div class="scenario-system">
      <dl class="scenario-relationship" aria-label="当前场景的使用关系">
        <div><dt>失败症状</dt><dd>${escapeHTML(example.symptom)}</dd></div>
        <div><dt>主要缺口</dt><dd>${escapeHTML(example.gapLabel)}</dd></div>
        <div><dt>优先形态</dt><dd>${escapeHTML(example.shapes)}</dd></div>
        <div><dt>完成证据</dt><dd>${escapeHTML(example.validation)}</dd></div>
      </dl>
      <ol class="scenario-flow" aria-label="当前场景的能力组合">
        ${scenario.steps.map((step, index) => `
          <li class="${index === state.demoStep ? "is-active" : index < state.demoStep ? "is-complete" : ""}"${index === state.demoStep ? ' aria-current="step"' : ""}><span class="step-index">${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHTML(step[0])}</strong><small>${escapeHTML(step[1])}</small></div><span class="step-role">${escapeHTML(step[2])}</span></li>
        `).join("")}
      </ol>
    </div>
    <div class="scenario-demo" aria-labelledby="scenario-demo-title">
      <header class="demo-header">
        <div><p class="micro-label">GUIDED DEMONSTRATION</p><h4 id="scenario-demo-title">跟着这个案例走一遍</h4></div>
        <div class="demo-controls">
          <button type="button" data-demo-reset ${state.demoStep === 0 ? "disabled" : ""}>重置</button>
          <button type="button" data-demo-prev ${state.demoStep === 0 ? "disabled" : ""}>上一步</button>
          <button class="demo-next" type="button" data-demo-next ${demoComplete ? "disabled" : ""}>${demoComplete ? "演示完成 ✓" : `下一步：${escapeHTML(example.demo[state.demoStep + 1].phase)}`}</button>
        </div>
      </header>
      <div class="demo-progress" role="group" aria-label="选择演示步骤">
        ${example.demo.map((step, index) => `<button type="button" data-demo-step="${index}" aria-pressed="${index === state.demoStep}" aria-label="第 ${index + 1} 步：${escapeHTML(step.phase)}"><span>${String(index + 1).padStart(2, "0")}</span><small>${escapeHTML(step.phase)}</small></button>`).join("")}
      </div>
      <div class="demo-stage" aria-live="polite" aria-atomic="true">
        <div class="demo-stage-copy"><span>STEP ${String(state.demoStep + 1).padStart(2, "0")} / ${String(example.demo.length).padStart(2, "0")}</span><h5>${escapeHTML(activeDemo.title)}</h5></div>
        <dl>
          <div><dt>这一步做什么</dt><dd>${escapeHTML(activeDemo.action)}</dd></div>
          <div><dt>会得到什么</dt><dd>${escapeHTML(activeDemo.result)}</dd></div>
          <div><dt>拿什么证明</dt><dd>${escapeHTML(activeDemo.evidence)}</dd></div>
        </dl>
      </div>
      <footer class="demo-to-skill">
        <div><span>演示交付物</span><strong>${escapeHTML(example.output)}</strong><small>这只是可修改样例；带入后请换成你的任务、权限和验收。</small></div>
        <button type="button" data-apply-scenario>用此示例预填 Builder <span aria-hidden="true">→</span></button>
      </footer>
    </div>
  `;
}

function applyScenarioToBuilder(key) {
  const scenario = scenarios[key];
  const example = scenario.example;
  markBlueprintStale("已载入新的场景样例，请重新生成草案。");
  state.selectedIds = new Set(example.capabilityIds.slice(0, 6));
  renderGapProfile(example.gap);
  document.querySelector("#skill-gap").value = example.gap;
  document.querySelector("#skill-name").value = example.skillName;
  document.querySelector("#skill-task").value = example.task;
  document.querySelector("#skill-trigger").value = example.trigger;
  document.querySelector("#skill-output").value = example.output;
  document.querySelector("#skill-validation").value = example.validation;
  skillForm.querySelectorAll("[aria-invalid]").forEach(field => field.removeAttribute("aria-invalid"));
  renderSelection();
  renderCapabilities();
  setBuilderStatus(`已载入“${scenario.title}”演示：${example.capabilityIds.length} 项能力模式、${example.gapLabel}缺口和完整样例字段。请按你的真实任务修改后再生成。`, "success");
  document.querySelector("#builder").scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
}

function matchesGapProfile(item, profile) {
  return profile.shapes.includes(item.shape) || profile.stages.includes(item.stage);
}

function mappedCapabilities(scenarioKey, gapKey) {
  const scenario = scenarios[scenarioKey];
  const profile = gapProfiles[gapKey];
  const baseItems = scenario.example.capabilityIds.map(id => capabilities.find(item => item.id === id)).filter(Boolean);
  const matching = capabilities
    .filter(item => matchesGapProfile(item, profile))
    .sort((a, b) => {
      const aBase = scenario.example.capabilityIds.includes(a.id) ? 1 : 0;
      const bBase = scenario.example.capabilityIds.includes(b.id) ? 1 : 0;
      const aDomain = a.domain === scenario.domain ? 1 : 0;
      const bDomain = b.domain === scenario.domain ? 1 : 0;
      const aPrimary = a.shape === profile.primaryShape ? 1 : 0;
      const bPrimary = b.shape === profile.primaryShape ? 1 : 0;
      return (bBase - aBase) || (bDomain - aDomain) || (bPrimary - aPrimary) || (a.id - b.id);
    });
  const chosen = [];
  const chosenIds = new Set();
  const usedStages = new Set();
  const add = item => {
    if (!item || chosenIds.has(item.id) || chosen.length >= 5) return;
    chosen.push(item);
    chosenIds.add(item.id);
    usedStages.add(item.stage);
  };

  add(matching[0]);
  baseItems.forEach(item => {
    if (!usedStages.has(item.stage)) add(item);
  });
  baseItems.forEach(add);
  matching.filter(item => item.domain === scenario.domain).forEach(item => {
    if (chosen.length < 3) add(item);
  });
  return chosen.slice(0, 5);
}

function renderScenarioMapper() {
  const scenario = scenarios[state.mapperScenario];
  const profile = gapProfiles[state.mapperGap];
  const selected = mappedCapabilities(state.mapperScenario, state.mapperGap);
  const task = mapperTask.value.trim() || scenario.example.prompt;

  document.querySelectorAll("[data-mapper-scenario]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.mapperScenario === state.mapperScenario));
  });
  document.querySelectorAll("[data-mapper-gap]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.mapperGap === state.mapperGap));
  });
  document.querySelector("#mapper-status-line").textContent = `${mapperScenarioLabels[state.mapperScenario]} × ${labelsForGap(state.mapperGap)}`;
  document.querySelector("#mapper-result-title").textContent = `从“${scenario.title}”开始，优先补${labelsForGap(state.mapperGap)}`;
  document.querySelector("#mapper-result-summary").textContent = `当前任务：${task}。工作对象决定案例上下文；“${labelsForGap(state.mapperGap)}”决定本次优先加载的能力机制。`;
  document.querySelector("#mapper-gap-result").textContent = profile.title.replace("主要缺口：", "");
  document.querySelector("#mapper-shapes").textContent = profile.shapes.map(shape => labels.shapes[shape]).join(" / ");
  document.querySelector("#mapper-artifact").textContent = profile.artifact;
  document.querySelector("#mapper-evidence").textContent = profile.evidence;
  document.querySelector("#mapper-avoid").textContent = profile.avoid;
  document.querySelector("#mapper-capabilities").innerHTML = selected.map(item => `
    <li><span>#${String(item.id).padStart(2, "0")}</span><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(labels.stages[item.stage])} · ${escapeHTML(labels.shapes[item.shape])}</small></div>${matchesGapProfile(item, profile) ? '<em>补主要缺口</em>' : '<em>场景支撑</em>'}</li>
  `).join("");
  document.querySelector("#mapper-live").textContent = `映射已更新：${mapperScenarioLabels[state.mapperScenario]}，${labelsForGap(state.mapperGap)}，推荐 ${selected.length} 项能力模式。`;
}

function openMappedScenarioDemo() {
  renderScenario(state.mapperScenario, 0);
  document.querySelector(".scenario-tabs").scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
}

function applyMappedScenarioToBuilder() {
  const scenario = scenarios[state.mapperScenario];
  const profile = gapProfiles[state.mapperGap];
  const selected = mappedCapabilities(state.mapperScenario, state.mapperGap);
  const customTask = mapperTask.value.trim();
  const skillPrefix = {
    engineering: "software",
    research: "research",
    visual: "visual",
    product: "product",
    knowledge: "knowledge"
  }[state.mapperScenario];

  markBlueprintStale("已载入新的个人场景映射，请重新生成草案。");
  state.selectedIds = new Set(selected.map(item => item.id));
  renderGapProfile(state.mapperGap);
  document.querySelector("#skill-gap").value = state.mapperGap;
  document.querySelector("#skill-name").value = `${skillPrefix}-${state.mapperGap}-workflow`;
  document.querySelector("#skill-task").value = customTask || scenario.example.task;
  document.querySelector("#skill-trigger").value = scenario.example.trigger;
  document.querySelector("#skill-output").value = scenario.example.output;
  document.querySelector("#skill-validation").value = `${profile.evidence}；场景验收：${scenario.example.validation}`;
  skillForm.querySelectorAll("[aria-invalid]").forEach(field => field.removeAttribute("aria-invalid"));
  renderSelection();
  renderCapabilities();
  setBuilderStatus(`已载入“${mapperScenarioLabels[state.mapperScenario]} × ${labelsForGap(state.mapperGap)}”：${selected.length} 项最小能力模式。请把样例触发和交付改成你的真实边界。`, "success");
  document.querySelector("#builder").scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
}

const gapGuidance = {
  method: "选择一套明确的专业方法，并写出哪些判断会改变后续路径。",
  tool: "先确认工具可用性和权限，再使用最小且可重复的执行路径。",
  constraint: "列出允许的选择、禁止的漂移，以及必须保持不变的边界。",
  verification: "先定义证据；在全部必要检查通过或遇到真实阻塞前继续处理。",
  routing: "比较候选能力的触发条件，只激活与当前任务匹配且职责最窄的一项。",
  memory: "保存来源、决策、更新和删除规则，让后续任务只检索相关上下文。"
};

function normalizeSkillName(value) {
  return value.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 63)
    .replace(/-+$/g, "");
}

function compact(value) {
  return value.trim().replace(/\s+/g, " ");
}

function resourceRecommendations(items) {
  const recommendations = new Set();
  items.forEach(item => {
    if (item.shape === "executor") recommendations.add("`scripts/`：放置可重复的确定性执行或验证脚本。");
    if (item.shape === "connector") recommendations.add("`references/integration.md`：记录实例、版本、认证、读写范围、预览和恢复路径。");
    if (item.shape === "assets") recommendations.add("`assets/`：只保存你有权复用的模板、组件或交付物输入。");
    if (item.shape === "knowledge") recommendations.add("`references/`：保存来源、更新、删除和检索规则。");
    if (item.shape === "evaluator") recommendations.add("验证器或检查清单：至少包含一个失败样例和一个通过样例。");
    if (item.shape === "router") recommendations.add("路由对照表：写清正向触发、近似但不应触发的任务和冲突处理。");
  });
  if (!recommendations.size) recommendations.add("先只保留 `SKILL.md`；真实任务证明需要后再增加资源。");
  return [...recommendations];
}

function strongestPermission(items) {
  const order = ["instruction", "local-execute", "external-read", "external-write"];
  return items.reduce((current, item) => order.indexOf(item.permission) > order.indexOf(current) ? item.permission : current, "instruction");
}

function buildSkillDraft(values, items) {
  const stageOrder = ["goal", "route", "method", "act", "check", "deliver", "learn"];
  const ordered = [...items].sort((a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage));
  const resources = resourceRecommendations(items);
  const permission = strongestPermission(items);
  const description = `${values.task}，并产出${values.output}。Use when ${values.trigger}`;
  const patternLines = ordered.map(item => `- **${item.title}**（${labels.stages[item.stage]} / ${labels.adoptions[item.adoption]}）：借鉴“${item.essence}”这一结构。来源：${item.url}`);

  return `---
name: ${values.name}
description: ${JSON.stringify(description)}
---

# ${values.name}

完成这项重复任务：${values.task}

保留用户给出的目标、范围、权限和既有工作流；借鉴下列能力模式的结构，不复制第三方指令、代码或资产。

## Intake

- 确认目标交付物：${values.output}
- 触发边界：${values.trigger}
- 先发现可以安全获得的上下文，只询问会实质改变结果的缺失信息。

## Workflow

1. 把本次任务、范围和完成证据写成一个可检查的任务契约。
2. 主要缺口是“${labelsForGap(values.gap)}”。${gapGuidance[values.gap]}
3. 按需采用下列模式，各模式只承担标注的工作链角色；删除职责重叠的步骤。
4. 只执行用户已授权的本地或外部操作；存在凭证、写操作或不可恢复影响时，先展示计划或预览。
5. 对照验证标准检查结果；失败时修正可执行问题，不以“已经生成内容”代替完成。
6. 交付 ${values.output}，并记录只对下次任务有用的失败证据或改进项。

## Validation

- 必须满足：${values.validation}
- 至少用一个有效样例验证完整旅程；若加入脚本或评测器，再增加一个应失败的样例。
- 无法执行外部依赖时，明确标为未验证，不声称集成可用。

## Safety and stop conditions

- 当前最高权限层级：${labels.permissions[permission]}
- 第三方模块的存在不授予安装、联网、凭证或写入权限。
- 需要新的目标选择、外部写入授权、敏感凭证或不可逆操作时停止并请求明确指示。
- 采用前核对原仓库许可证、版本、依赖与数据边界。

## Adapted patterns

${patternLines.join("\n")}

## Supporting resources

${resources.map(item => `- ${item}`).join("\n")}
`;
}

function labelsForGap(gap) {
  return {
    method: "专业方法",
    tool: "执行工具",
    constraint: "边界约束",
    verification: "质量验证",
    routing: "能力路由",
    memory: "记忆与复盘"
  }[gap];
}

function validateBlueprint() {
  let firstInvalid = null;
  skillForm.querySelectorAll("[required]").forEach(field => {
    const invalid = !field.value.trim();
    field.setAttribute("aria-invalid", String(invalid));
    if (invalid && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    setBuilderStatus("请先补全标出的必填项，再生成草案。", "error");
    return null;
  }
  if (!state.selectedIds.size) {
    setBuilderStatus("至少选择一项能力模式。回到 81 项清单点击“加入蓝图”。", "error");
    return null;
  }

  const name = normalizeSkillName(document.querySelector("#skill-name").value);
  if (!name) {
    document.querySelector("#skill-name").setAttribute("aria-invalid", "true");
    document.querySelector("#skill-name").focus();
    setBuilderStatus("Skill 名称需要包含英文字母或数字，例如 weekly-research-brief。", "error");
    return null;
  }

  return {
    name,
    task: compact(document.querySelector("#skill-task").value),
    trigger: compact(document.querySelector("#skill-trigger").value),
    output: compact(document.querySelector("#skill-output").value),
    validation: compact(document.querySelector("#skill-validation").value),
    gap: document.querySelector("#skill-gap").value
  };
}

function resetBlueprint() {
  skillForm.reset();
  skillForm.querySelectorAll("[aria-invalid]").forEach(field => field.removeAttribute("aria-invalid"));
  generatedSkill = "";
  generatedSkillName = "";
  skillPreview.textContent = "# 你的技能蓝图会出现在这里\n\n它将包含：\n- 可发现的触发描述\n- 最小工作流\n- 验证标准\n- 权限与停止条件\n- 借鉴模式及来源";
  document.querySelector("#preview-state").textContent = "等待生成";
  copySkillButton.disabled = true;
  downloadSkillButton.disabled = true;
  renderSelectionAudit();
  setBuilderStatus("表单已重置；已选能力模式仍然保留。", "");
}

async function copyGeneratedSkill() {
  if (!generatedSkill) return;
  try {
    await navigator.clipboard.writeText(generatedSkill);
  } catch (_) {
    const fallback = document.createElement("textarea");
    fallback.value = generatedSkill;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.appendChild(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();
  }
  document.querySelector("#preview-state").textContent = "已复制";
  setBuilderStatus("Markdown 已复制。下一步可交给 $capability-to-skill 继续实现和验证。", "success");
}

function downloadGeneratedSkill() {
  if (!generatedSkill) return;
  const blob = new Blob([generatedSkill], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${generatedSkillName}-SKILL.md`;
  link.click();
  URL.revokeObjectURL(url);
  document.querySelector("#preview-state").textContent = "已下载";
  setBuilderStatus(`已下载 ${generatedSkillName}-SKILL.md；它是草案，不代表已安装。`, "success");
}

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  const toggle = document.querySelector("#theme-toggle");
  toggle.setAttribute("aria-pressed", String(dark));
  toggle.setAttribute("aria-label", dark ? "切换到浅色主题" : "切换到深色主题");
  toggle.querySelector(".theme-label").textContent = dark ? "浅色" : "深色";
  try { localStorage.setItem("capability-atlas-theme", theme); } catch (_) { /* storage is optional */ }
}

function preferredTheme() {
  try {
    const saved = localStorage.getItem("capability-atlas-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (_) { /* storage is optional */ }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

shapeGuideGrid.addEventListener("click", event => {
  const trigger = event.target.closest("[data-guide-filter]");
  if (trigger) applyShapeFilter(trigger.dataset.guideFilter);
});

verificationList.addEventListener("click", event => {
  const tab = event.target.closest("[data-verification-shape]");
  if (tab) renderVerificationLab(tab.dataset.verificationShape);
});

verificationList.addEventListener("keydown", event => {
  const tab = event.target.closest("[data-verification-shape]");
  if (!tab || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...verificationList.querySelectorAll("[data-verification-shape]")];
  const current = tabs.indexOf(tab);
  const forward = ["ArrowRight", "ArrowDown"].includes(event.key);
  const backward = ["ArrowLeft", "ArrowUp"].includes(event.key);
  let next = current;
  if (forward) next = (current + 1) % tabs.length;
  if (backward) next = (current - 1 + tabs.length) % tabs.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = tabs.length - 1;
  tabs[next].focus();
  renderVerificationLab(tabs[next].dataset.verificationShape);
});

verificationDetail.addEventListener("click", event => {
  const trigger = event.target.closest("[data-locate-verified]");
  if (trigger) locateVerifiedCapability(Number(trigger.dataset.locateVerified));
});

document.querySelectorAll("[data-gap-select]").forEach(button => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => renderGapProfile(button.dataset.gapSelect));
});

document.querySelector("#apply-gap-builder").addEventListener("click", () => {
  if (!state.diagnosticGap) return;
  document.querySelector("#skill-gap").value = state.diagnosticGap;
  markBlueprintStale("主要缺口已更新，请重新生成草案。");
  renderSelectionAudit();
  document.querySelector("#builder").scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
});

document.querySelector("#filter-gap-shape").addEventListener("click", () => {
  if (state.diagnosticGap) applyShapeFilter(gapProfiles[state.diagnosticGap].primaryShape);
});

document.querySelector("#audit-suggestion").addEventListener("click", event => {
  const shape = event.currentTarget.dataset.auditShape;
  if (shape) applyShapeFilter(shape);
});

searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  renderCapabilities();
});

domainFilter.addEventListener("change", event => {
  state.domain = event.target.value;
  renderCapabilities();
});

shapeFilter.addEventListener("change", event => {
  state.shape = event.target.value;
  renderCapabilities();
});

adoptionFilter.addEventListener("change", event => {
  state.adoption = event.target.value;
  document.querySelectorAll("[data-adoption-filter]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.adoptionFilter === state.adoption));
  });
  renderCapabilities();
});

document.querySelector("#reset-filters").addEventListener("click", () => resetFilters({ focus: true }));
document.querySelector("#empty-reset").addEventListener("click", () => resetFilters({ focus: true }));
showAllButton.addEventListener("click", () => {
  state.showAll = !state.showAll;
  renderCapabilities();
});

document.querySelectorAll("[data-stage-filter]").forEach(button => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const next = button.dataset.stageFilter;
    const isActive = state.stage === next;
    state.stage = isActive ? "all" : next;
    document.querySelectorAll("[data-stage-filter]").forEach(candidate => {
      candidate.setAttribute("aria-pressed", String(!isActive && candidate === button));
    });
    renderCapabilities();
    document.querySelector("#explorer").scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
  });
});

document.querySelectorAll("[data-adoption-filter]").forEach(button => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const next = button.dataset.adoptionFilter;
    const isActive = state.adoption === next;
    state.adoption = isActive ? "all" : next;
    adoptionFilter.value = state.adoption;
    document.querySelectorAll("[data-adoption-filter]").forEach(candidate => {
      candidate.setAttribute("aria-pressed", String(!isActive && candidate === button));
    });
    renderCapabilities();
    document.querySelector("#explorer").scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
  });
});

grid.addEventListener("click", event => {
  const selectTrigger = event.target.closest("[data-toggle-select]");
  if (selectTrigger) {
    toggleSelection(Number(selectTrigger.dataset.toggleSelect));
    return;
  }
  const detailTrigger = event.target.closest("[data-open-detail]");
  if (!detailTrigger) return;
  const item = capabilities.find(candidate => candidate.id === Number(detailTrigger.dataset.openDetail));
  if (item) openDetail(item, detailTrigger);
});

document.querySelector("#dialog-select").addEventListener("click", () => {
  if (!activeDialogItem) return;
  if (toggleSelection(activeDialogItem.id)) renderSelection();
});

document.querySelector(".dialog-close").addEventListener("click", closeDialog);
dialog.addEventListener("click", event => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener("cancel", event => {
  event.preventDefault();
  closeDialog();
});

selectedPatterns.addEventListener("click", event => {
  const trigger = event.target.closest("[data-remove-selected]");
  if (trigger) toggleSelection(Number(trigger.dataset.removeSelected));
});

document.querySelector("#clear-selection").addEventListener("click", () => {
  state.selectedIds.clear();
  markBlueprintStale("选择已清空。重新选择能力模式后再生成草案。");
  renderSelection();
  renderCapabilities();
});

skillForm.addEventListener("input", event => {
  if (event.target.matches("[required]") && event.target.value.trim()) event.target.removeAttribute("aria-invalid");
  markBlueprintStale("表单内容已变化，请重新生成草案。");
  renderSelectionAudit();
});

skillForm.addEventListener("submit", event => {
  event.preventDefault();
  const values = validateBlueprint();
  if (!values) return;
  const items = capabilities.filter(item => state.selectedIds.has(item.id));
  generatedSkill = buildSkillDraft(values, items);
  generatedSkillName = values.name;
  document.querySelector("#skill-name").value = values.name;
  skillPreview.textContent = generatedSkill;
  document.querySelector("#preview-state").textContent = "草案已生成";
  copySkillButton.disabled = false;
  downloadSkillButton.disabled = false;
  const audit = analyzeSelection(items, values.gap);
  if (audit.matchesGap) {
    setBuilderStatus(`已用 ${items.length} 项能力模式生成草案。请先检查触发、权限和验证，再安装或执行。`, "success");
  } else {
    setBuilderStatus(`草案已生成，但所选模式尚未直接覆盖“${labelsForGap(values.gap)}”。先查看组合体检的最小补缺建议。`, "error");
  }
});

document.querySelector("#reset-blueprint").addEventListener("click", resetBlueprint);
copySkillButton.addEventListener("click", copyGeneratedSkill);
downloadSkillButton.addEventListener("click", downloadGeneratedSkill);

document.querySelectorAll(".scenario-tabs [role=tab]").forEach(tab => {
  tab.addEventListener("click", () => renderScenario(tab.dataset.scenario, 0));
  tab.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll(".scenario-tabs [role=tab]")];
    const current = tabs.indexOf(tab);
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    tabs[next].focus();
    renderScenario(tabs[next].dataset.scenario, 0);
  });
});

scenarioPanel.addEventListener("click", event => {
  const directStep = event.target.closest("[data-demo-step]");
  if (directStep) {
    renderScenario(state.activeScenario, Number(directStep.dataset.demoStep));
    return;
  }
  if (event.target.closest("[data-demo-reset]")) {
    renderScenario(state.activeScenario, 0);
    return;
  }
  if (event.target.closest("[data-demo-prev]")) {
    renderScenario(state.activeScenario, state.demoStep - 1);
    return;
  }
  if (event.target.closest("[data-demo-next]")) {
    renderScenario(state.activeScenario, state.demoStep + 1);
    return;
  }
  if (event.target.closest("[data-apply-scenario]")) applyScenarioToBuilder(state.activeScenario);
});

scenarioMapper.addEventListener("click", event => {
  const scenarioChoice = event.target.closest("[data-mapper-scenario]");
  if (scenarioChoice) {
    state.mapperScenario = scenarioChoice.dataset.mapperScenario;
    renderScenarioMapper();
    return;
  }
  const gapChoice = event.target.closest("[data-mapper-gap]");
  if (gapChoice) {
    state.mapperGap = gapChoice.dataset.mapperGap;
    renderScenarioMapper();
    return;
  }
  if (event.target.closest("#open-mapped-demo")) {
    openMappedScenarioDemo();
    return;
  }
  if (event.target.closest("#apply-mapped-builder")) applyMappedScenarioToBuilder();
});

mapperTask.addEventListener("input", renderScenarioMapper);

document.querySelector("#theme-toggle").addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

document.addEventListener("keydown", event => {
  const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
  if (!shortcut) return;
  event.preventDefault();
  searchInput.focus();
});

applyTheme(preferredTheme());
renderTaxonomy();
renderShapeGuide();
renderCapabilities();
renderVerificationLab();
renderSelection();
renderScenarioMapper();
renderScenario("engineering", 0);
