# 能力地图网页设计契约

```text
Entry mode: Revision-led，能力落地工作台继续补充九类代表项目的原仓库核验层
Request revision: 6
Target user and context: 想完整理解 Atlasnote 81 项能力、判断采用方式，并把可借鉴模式改造成个人 Codex Skill 的用户
Desired first impression: 这不是插件商店，也不只是研究报告；它是一张可分类、可选型、可生成个人 Skill 蓝图的能力系统地图
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 中文编辑型数据叙事；冷灰纸面配钴蓝、酸橙和暖橙语义色；结构线与编号比装饰更重要；不依赖外部字体、图片或持续动画
Information constraints: 必须覆盖能力定义、六种增量、运行原理、九种形态及其落地字典、七个领域、七段链路、四种采用方式、六类缺口诊断、Skill 五级成熟度、权限层级、81 项完整清单、九类代表项目的 Atlasnote 说法与原仓库证据对照、五类组合场景及其“输入—症状—缺口—形态—能力—证据—Skill”对应关系、个人任务的“工作对象 × 失败缺口”映射、个人起步栈、Skill 落地方法与扩展方向；界面审计不进入主叙事
Operation constraints: 可搜索 81 项；可按形态、领域、链路和采用方式筛选；可查看分类计数与九种形态详情；可在九类代表核验台按形态切换项目，并查看 Atlasnote 介绍、原仓库已证实事实、未验证项、真实项目类型、安装/运行前置、权限、许可证、维护信号、采用判断与官方来源；可将代表项目定位回 81 项清单；可从六类症状获得最小能力建议并带入筛选/Builder；可选择最多六项加入技能蓝图；实时显示职责覆盖、重复、依赖与主要缺口匹配；可填写真实任务并生成、复制、下载 SKILL.md 草案；可在个人场景映射器中选择五类工作对象、六类失败缺口并可选填写任务，动态查看起点场景、主要缺口、优先形态、最小能力组合、验证和避免事项；可从映射结果打开对应五步演示或把定制判断预填 Builder；可切换五类组合场景、逐步播放/后退/重置演示、查看每步动作/结果/证据，并把当前演示预填 Builder；可展开模块详情、切换主题并重置筛选
State constraints: 默认/搜索结果/组合筛选/零结果/模块详情；形态字典展开/收起；代表核验默认/九类切换/来源跳转/定位清单；缺口未选/已选；模块未选/已选/达到上限；组合体检空/匹配/缺口/重复/集成依赖；个人场景默认/对象切换/缺口切换/任务输入/映射更新/打开演示/带入 Builder；场景标签切换、演示未开始/进行中/完成/后退/重置/已带入 Builder；蓝图空/字段不完整/已生成/已复制/已下载；light/dark；focus-visible；reduced-motion；JavaScript 不可用时仍有核心解释
Environment constraints: 原生 HTML/CSS/JavaScript；无构建步骤、后端、登录和外部数据请求；由 Python 静态服务器运行；Chrome/Chromium；1440、768、390 视口
Primary journey: 首屏理解“能力不是插件数量” → 沿能力链理解原理 → 用四套分类全量辨认 81 项 → 展开形态字典理解机制与边界 → 用九类代表核验台区分网页介绍、原仓库事实和未验证能力 → 回到 81 项清单理解其余条目仍只是待核验样本 → 从重复症状诊断主要缺口 → 在个人场景映射器选择工作对象与失败类型 → 查看最小能力组合及其理由 → 打开对应五步演示 → 把定制映射带入 Builder并查看组合体检 → 改成自己的重复任务 → 生成并带走个人 SKILL.md 草案 → 对照成熟度阶梯继续验证
User-defined phases: 全量梳理 → 按类区分 → 指导理解 → 原仓库核验 → 诊断与选型 → 使用场景关系演示 → 映射自己的任务 → 将能力落地为个人技能 → 建立迭代路径
Required artifacts: web/index.html、web/styles.css、web/app.js、项目内 capability-to-skill 元技能及选型审计参考资料、分类与落地说明、场景演示说明、九类代表核验报告、设计契约、浏览器验收记录、README 运行说明更新
Autonomy authorization: 用户明确要求用网页整理现有研究；允许在现有子项目内直接完成可逆的静态网页实现与验证
User-decision boundary: 不部署公开网站；不安装或运行 Atlasnote 收录的第三方 Skills；不增加后台、账号或联网推荐器
Observable completion criteria: 81 个模块完整且链接对应原页面；领域/形态/链路计数合计均为 81；每项都有采用方式和权限判断；九种形态均说明机制、适用、最小落地物和风险；九类代表项目各自包含 Atlasnote 原说法、至少两项官方来源支持的事实、明确未验证项、项目类型、安装/运行前置、权限、许可证、维护信号、采用判断与复核日期；所有“已证实”只来自官方仓库/文档，未实际安装运行的项目不得声称可用；九类代表可切换并定位回清单；六类缺口均能给出最小建议并同步 Builder；搜索、四类筛选、链路快捷筛选、重置、详情和场景切换可用；五个场景均有真实输入、失败症状、主要缺口、优先形态、能力链、五步演示、产物和验证；个人场景映射器的 5 × 6 组合均可更新结果，推荐 3–5 项有效能力 id、至少一项直接匹配所选缺口，并解释验证与避免事项；打开演示应切换到所选工作对象；带入 Builder 应采用用户任务、所选缺口和最小组合且不超过六项；演示可前进、后退、重置，完成状态明确；当前场景可预填 Builder；可选择/取消最多六项；组合体检随选择与缺口更新并识别重复职责、外部依赖与匹配情况；缺字段给出可恢复提示；生成内容随真实任务和所选模式变化；复制和下载可用；项目内元技能及选型审计参考通过结构校验；零结果可恢复；1440/768/390 无横向溢出；两主题可读；核验台、映射器、场景标签和演示控件键盘可达、焦点可见；reduced-motion 不隐藏内容；无框架错误；仓库检查通过
```

## 设计方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 首屏层级 | 左侧核心判断，右侧“能力公式” | 第一眼先理解不是插件商店；公式说明能力由什么组成 | 1440 和 390 首屏都能读到核心判断和能力公式 |
| 阅读结构 | 定义 → 原理链 → 全量探索 → 组合 → 个人方案 | 每节只回答一个问题，81 项不淹没前置解释 | 滚动顺序能自然完成主旅程 |
| 数据探索 | 搜索 + 领域 + 形态 + 链路快捷筛选 | 所有筛选组合更新结果数，零结果给恢复动作 | 81 项可完整显示，每项可打开详情和原页面 |
| 全量分类 | 领域、形态、链路和采用方式四套视角 | 三组计数合计为 81；采用方式说明决策含义 | 用户能区分“它做什么”和“我怎样采用” |
| Skill 落地 | 最多六项选择 + 真实任务表单 + Markdown 预览 | 选择状态跨筛选保留；输出包含触发、流程、验证和停止条件 | 一条键盘可达旅程能生成、复制或下载 SKILL.md 草案 |
| 场景演示 | 五类场景共用“关系地图 + 五步演练 + 带入 Builder” | 输入、症状、缺口、形态、能力、动作、结果与证据在同一场景内对应 | 用户可从任一场景完成播放并获得可修改的 Skill 样例 |
| 个人映射 | 工作对象 × 主要缺口的动态诊断 | 对象决定上下文与起始演示，缺口决定优先机制和最小补充能力 | 30 种组合均返回可解释、可带入 Builder 的最小结果 |
| 原仓库核验 | 九类代表的网页说法、官方事实和未验证边界 | 不用 Star 或摘要替代真实项目类型、前置、权限、许可和运行证据 | 每类形成一张可追溯能力档案；只声明已被官方来源支持的事实 |
| 类型角色 | 中文系统无衬线 + 等宽编号/标签 | 标题、解释、数据和操作角色明显不同 | 长标题和标签在手机端不溢出 |
| 主题 | Light/Dark 双主题，共享语义 token | 主题切换不改变信息结构 | 双向切换后文字、边框、选中、警示状态可读 |
| 材质与深度 | 纸张面板、结构线、少量硬阴影 | 交互区高于阅读区，不使用模糊玻璃 | 控件归属清楚，卡片不无限嵌套 |
| 动效 | 只解释筛选、详情和场景切换 | 无持续动画；reduced-motion 取消过渡 | 关闭动画不损失状态和功能 |
| 无脚本基础层 | `noscript` 核心说明与研究链接 | JavaScript 是探索增强层 | 禁用脚本仍能理解结论并访问完整 Markdown 清单 |

## 覆盖清单

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 网页整理 | 首屏定位与能力公式 | 1440 dark / 768 / 390 light | 截图 + DOM | Stage 2-3 | pass | 三视口首屏均呈现核心判断与能力公式 |
| 网页整理 | 能力原理链 | 默认 + 快捷筛选 | 交互 + 结果数 | Stage 4-6 | pass | 点击“验证”得到 15 项且按钮状态为 pressed |
| 网页整理 | 81 项完整清单 | populated | 数据计数 + DOM | Stage 5-6 | pass | 初始 18 项；展开后 81 项且最后 id 为 80 |
| 网页整理 | 搜索、领域、形态组合 | filtered | 多组交互 | Stage 5-6 | pass | “浏览器”得 4 项，叠加设计领域得 1 项 |
| 网页整理 | 零结果恢复 | empty | DOM + reset | Stage 6 | pass | 零结果显示恢复按钮；重置回到 81 / 初始 18 项 |
| 网页整理 | 模块详情 | dialog open/close | 点击、Escape、焦点返回 | Stage 5-7 | pass | 原生 dialog 打开；Escape 关闭并把焦点还给原按钮 |
| 网页整理 | 场景组合 | 五个 tabs | 键盘/点击 + DOM | Stage 5-7 | pass | 点击研究，再用 ArrowRight 切到视觉内容 |
| 网页整理 | 个人起步栈 | desktop/mobile | 截图 + DOM | Stage 3-7 | pass | 五槽位与六条缺口诊断完整呈现 |
| 跨表面 | 响应式 | 1440/768/390 | 截图 + overflow | Stage 7 | pass | 三视口 `scrollWidth == innerWidth` |
| 跨表面 | 双主题 | light/dark | 切换 + computed state | Stage 7 | pass | dark 为 `rgb(17,19,25)` / `rgb(242,241,235)`，可切回 light |
| 跨表面 | 键盘与焦点 | keyboard | 快捷键、Arrow、Escape、焦点返回 | Stage 7 | pass | Ctrl/Cmd+K、tabs、dialog 旅程通过，focus-visible 可见 |
| 跨表面 | reduced motion | reduced | media emulation/样式检查 | Stage 7-8 | pass | media 匹配为 true；过渡为 `1e-05s`；JS 滚动改用 auto |
| 工程交付 | 静态文件和研究门户 | files/check | 验证脚本 + research_hub | Stage 9 | pass | 静态验证、语法检查和研究门户检查通过 |
| 工程交付 | 浏览器验收与交接 | 文档 | 最终证据记录 | Stage 9 | pass | 验收记录与五张最终截图已保存 |
| 指导理解 | 分类总览与采用方式 | populated / adoption filtered | DOM 计数 + 交互 | Stage 3-6 | pass | 三套计数各合计 81；四种采用方式为 7 / 41 / 28 / 5，点击直接采用得到 7 项 |
| 能力落地 | 选择能力模式 | unselected / selected / max-six | 点击 + 键盘 + 状态提示 | Stage 5-7 | pass | 选择跨领域筛选保留；第七项被阻止并显示上限；卡片、详情和选择标签均可取消 |
| 能力落地 | Skill 蓝图输入 | empty / incomplete / complete | 表单验证 + focus | Stage 5-7 | pass | 空提交标记必填字段并聚焦名称；完整值可提交，Tab 顺序与视觉一致 |
| 能力落地 | 生成个人 SKILL.md | generated | 预览内容 + DOM | Stage 5-7 | pass | 名称规范；输出含 frontmatter、工作流、验证、停止、资源与来源模式 |
| 能力落地 | 带走草案 | copied / downloaded | Clipboard/下载回退 + 状态 | Stage 6-7 | pass | 复制显示已复制；下载反馈 weekly-research-brief-SKILL.md 并说明未安装 |
| 工程交付 | capability-to-skill 元技能 | project-local files | quick_validate + 文件检查 | Stage 5-9 | pass | SKILL.md、agents/openai.yaml、诊断矩阵和蓝图结构存在且 quick_validate 通过 |
| 跨表面修订 | 新增分类和蓝图布局 | 1440/768/390 light/dark | 截图 + overflow | Stage 7-8 | pass | 三视口 `scrollWidth == innerWidth`；浅色与深色分类、选中和 Builder 状态可读 |
| 跨表面修订 | 键盘、对话框与 reduced motion 回归 | keyboard / dialog / reduced | 浏览器交互 | Stage 7-8 | pass | Escape 返回重渲染后的详情按钮；Builder 键盘顺序通过；reduced media 匹配为 true |
| 工程交付修订 | 静态验证、研究门户和文档 | files/check | 自动化检查 + 验收记录 | Stage 9 | pass | 静态验证、语法、Skill、研究门户、单元测试和 diff 检查均通过；新证据已记录 |
| 指导理解补充 | 九种能力形态字典 | collapsed / expanded | DOM + details 键盘交互 | Stage 3-7 | pass | 九种形态均显示机制、适用任务、最小落地物和主要风险；原生 details 的点击与 Enter 开合通过 |
| 诊断与选型 | 六类能力缺口诊断 | default / selected / applied | 点击 + Builder/select 同步 | Stage 4-7 | pass | 质量验证症状给出最小建议；评测形态筛选得到 7 项，缺口同步为 verification |
| 能力落地补充 | 已选组合实时体检 | empty / fit / missing / overlap / integration | DOM 状态 + 多组选择 | Stage 5-7 | pass | 实测需要补缺、组合聚焦、先核对依赖和重叠计数；每次只给一个最小补缺方向 |
| 迭代路径 | Skill 五级成熟度与个人三步路线 | desktop/mobile | 截图 + DOM | Stage 3-7 | pass | L0–L4 与网页分析、研究转网页、能力转 Skill 三项起步资产均已呈现 |
| Skill 资产补充 | selection-audit 参考与元技能路由 | project-local files | quick_validate + 链接检查 | Stage 5-9 | pass | 新参考存在并由 SKILL.md 条件路由；审计只做补缺、删重与依赖识别，quick_validate 通过 |
| 跨表面修订 3 | 新字典、诊断和体检 | 1440/768/390 light/dark/keyboard | 截图 + overflow + 交互 | Stage 7-8 | pass | 三档截图无裁切和横向溢出；details 键盘可达；深浅主题与 reduced-motion 状态可读 |
| 工程交付修订 3 | 自动化、文档与最终证据 | files/check | 静态验证 + 浏览器验收 | Stage 9 | pass | 验证脚本覆盖新 DOM/逻辑；研究文档、精简证据、仓库检查和单元测试均已更新并通过 |
| 场景关系补充 | 五类场景对应关系 | default / switched | DOM + 标签切换 | Stage 3-6 | pass | 五个场景均显示示例输入、失败症状、主要缺口、优先形态、五角色能力链、产物和验证；点击与方向键切换通过 |
| 场景演示补充 | 五步演示控制 | initial / progressed / completed / previous / reset | 点击 + aria-live + DOM | Stage 4-7 | pass | 实测下一步至演示完成、上一步返回、重置回到第一步、进度按钮直达；动作、结果、证据与按钮状态同步 |
| 场景转 Skill | 演示预填 Builder | applied | DOM + selection audit + form values | Stage 5-7 | pass | 研究场景写入 verification、5 项能力和五个表单字段；体检识别外部依赖，随后成功生成完整草案 |
| 跨表面修订 4 | 场景关系与演示台 | 1440/768/390 light/dark/keyboard | 截图 + overflow + 交互 | Stage 7-8 | pass | 三视口横向溢出均为 0；深浅主题截图可读；标签、下一步、进度和应用按钮键盘路径通过；reduced-motion 为 1e-05s |
| 工程交付修订 4 | 自动化、场景说明与最终证据 | files/check | 静态验证 + 浏览器验收 | Stage 9 | pass | 验证覆盖 5 个样例、25 个步骤和有效能力 id；README、场景说明、四张证据、仓库检查和单元测试均通过 |
| 个人映射补充 | 五类工作对象 × 六类失败缺口 | default / scenario / gap / task | 点击、输入 + DOM | Stage 3-6 | pass | 页面内遍历 30 种组合，无无效结果；均返回 3–5 项已知能力且至少一项匹配主要缺口，形态、产物、验证和避免事项同步 |
| 映射到演示 | 从诊断结果打开对应场景 | mapped / opened | 点击 + tab/panel 同步 | Stage 5-7 | pass | 视觉、产品和知识三组实测均切换正确 tab、回到第一步并滚动到场景面板；键盘 Enter 路径通过 |
| 映射到 Skill | 定制结果预填 Builder | mapped / applied / generated | DOM + selection audit + form values | Stage 5-7 | pass | 定制视觉任务写入 task；constraint、4 项最小组合和五字段同步；体检为组合聚焦并成功生成草案 |
| 跨表面修订 5 | 个人场景映射器 | 1440/768/390 light/dark/keyboard | 截图 + overflow + 交互 | Stage 7-8 | pass | 三档横向溢出均为 0；深浅主题截图可读；11 个选择、输入和双动作键盘可达，焦点 3px；reduced-motion 使用 auto |
| 工程交付修订 5 | 自动化、说明与最终证据 | files/check | 静态验证 + 浏览器验收 | Stage 9 | pass | 验证覆盖 5 × 6 控件和映射函数；README、场景说明、三张证据、研究门户同步、8 项单元测试和 diff 检查均通过 |
| 原仓库核验补充 | 九类代表项目档案 | 9 selected states | 官方来源 + 文档 | Stage 3-6 | pass | 九类均有 Atlasnote 说法、≥3 项官方事实、未验证项、真实类型、前置、权限、许可、维护信号、采用判断和 2026-08-31 复核日期 |
| 核验台交互 | 九类代表切换与定位清单 | default / selected / located | 点击、键盘 + DOM | Stage 4-7 | pass | Impeccable 点击切换、ArrowRight 到 SwarmVault；定位后清单只剩 id 63 且焦点落到详情按钮 |
| 证据边界 | 已证实 / 未验证 / 未运行 | all records | 文档审阅 + DOM | Stage 3-7 | pass | 页面与核验报告明确解释三种状态；所有第三方代表均声明未在本项目安装运行 |
| 跨表面修订 6 | 九类代表核验台 | 1440/768/390 light/dark/keyboard | 截图 + overflow + 交互 | Stage 7-8 | pass | 三档横向溢出为 0；深浅主题可读；tabs、来源和定位可达；reduced-motion 详情可见且过渡为 1e-05s |
| 工程交付修订 6 | 核验报告、自动化与最终证据 | files/check | 静态验证 + 浏览器验收 | Stage 9 | pass | 核验报告、README、三张证据和验收记录已更新；验证脚本覆盖 9 类、来源、边界和复核日期；全部仓库检查通过 |
