# 前端交付与浏览器验收

## 运行环境

- Canonical command：`python -m http.server 4190 --bind 127.0.0.1 --directory projects/portrait-workbench-mvp`
- Canonical URL：`http://127.0.0.1:4190/web/`
- 浏览器：Agent Browser `0.27.0` / Chromium
- 验收日期：`2026-08-30`
- 设计契约：`docs/design-contract.md` revision 2，Revision-led / Editorial / Hybrid Workspace
- 技术边界：静态 HTML/CSS/JS；本地 fixture JSON；无后端、账号、模型、检测、存储或外部运行时依赖。

## 交付结果

工作台用产品、探索与架构三种模式同时保留“可操作闭环”和“完整研究信息”，并把上游 Skill 的三个最有产品价值的部分变成可操作状态：

1. 主体几何、身份、年龄、服饰、关系和可见解剖锁。
2. 多人共享光向或单主体几何分支，以及用途驱动的画幅规则。
3. 命名失败项、保留部分通过、人工审批和一次定向重试语义。

底层像素生成没有被伪装成仓库能力。内置候选均来自相邻研究项目保存的真实资产；上传路径只做浏览器内存预览并输出 `detection: pending / generation: pending` 的任务说明。

## 主流程证据

| 路径 | 浏览器结果 | 结构化证据 |
| --- | --- | --- |
| 家庭 · 保留同画面 | 1 个 4:3 真实候选；主体数量、关系、共享 image-left 主光通过；身份/手部保留人工复核 | `plan=preserve`，1 个候选，5 个 QA 项 |
| 家庭 · 分别制作 | 2 个独立真实候选同屏；键盘选中分支后可继续规则、质检、批准与交付 | `plan=split`，`output_strategy=independent-generative-tasks-not-lossless-extraction`，2 份证据 |
| 品牌 · 四画幅 | 1:1、4:5、3:4、16:9 四个真实输出均进入缩略图轨；可查看一次被拒收重试 | 4 个交付面，5 个 QA 项，闭环签名和身份为 partial |
| 本地上传 | `FileReader` 生成 `data:image/...` 预览；确认按钮由 disabled 变为可用；进入质检时显示真实空状态，旧候选 DOM 为 0 | `uploaded_to_server=false`、`detection=pending`、`generation=pending`、`candidate_evidence=[]`、`scope=plan-confirmation-only` |
| 审批与交付 | 通过和拒收均有可读状态；交付 JSON 含输入、任务、Skill 规则、候选、QA、人工决定和边界 | 家庭分别制作批准记录验证为 `decision=approved`、`model invoked=false`、`evidence=2` |

## 视觉与响应式

| 视口 | 结果 | 证据摘要 |
| --- | --- | --- |
| 1440×900 | pass | `scrollWidth 1425 ≤ innerWidth 1440`；品牌质检显示 1 个当前候选、4 个可切换格式、5 个 QA 项；0 broken image |
| 768×1024 | pass | `scrollWidth 753 ≤ 768`；工作区宽约 707px，输入/舞台为 247/458px，决策区 705px 跨两列；0 broken image |
| 390×844 | pass | `scrollWidth 375 ≤ 390`；舞台与决策各 345px；完成输入后输入面板折叠；当前第 04 步自动定位在 106–238px 可视范围；0 broken image |

最初的手机检查显示“质检”步骤在横向步骤条视野外，且已完成的输入面板占据首屏。最小修复是让步骤条按当前状态定位，并在 `≤640px`、步骤 2–5 时折叠输入面板；点击步骤 1 后面板恢复且步骤条回到 `scrollLeft=0`。

## 交互、键盘与状态

- Fixture 标签采用 roving tabindex：聚焦家庭后按 `End` 选择上传，按 `Home` 返回家庭；焦点与 `aria-selected` 同步，焦点轮廓为 `solid`。
- 真实键盘路径通过：确认输入 → `ArrowDown` 选择家庭分别制作 → Enter 编译规则 → Enter 查看候选 → Enter 批准 → Enter 进入交付。
- 品牌缩略图状态逻辑验证：激活 `cover` 后主图切换为 `assets/brand-cover-16x9.jpg`。
- 主题按钮完成亮→暗和暗→亮切换；`aria-label` 与 `aria-pressed` 同步。
- `prefers-reduced-motion: reduce` 下状态面板动画和页面 transition 均为 `0.01ms`，根滚动行为为 `auto`，工作台仍可见。
- 阻断 fixture JSON 后显示加载错误、工作台隐藏、静态证据保留；阻断 `app.js` 的全新会话中 `.js=false`、工作台 `display:none`、两条静态案例与 8 张证据图仍在 DOM，页面无横向溢出。

## 可访问性

- axe-core `4.10.3`：亮色品牌质检 `0 violations / 42 passes`；暗色品牌质检 `0 violations / 42 passes`。
- `color-contrast` 有 32 个 `incomplete`，原因是图片、渐变与混合背景无法自动确定底色；没有被计为 violation。
- 手工语义 token 对比：亮色正文 `16.07:1`、muted `6.67:1`、muted-2 `6.37:1`、强调 `6.09:1`、partial 状态 `5.37:1`；暗色正文 `14.59:1`、muted `8.13:1`、muted-2 `5.01:1`、强调 `7.06:1`、核心职责序号 `6.66:1`。
- 初次扫描发现无角色 div 的 ARIA、嵌套 complementary landmark 和小字号弱化文字对比问题；补充 list/group/region 语义、去除不合适的 aside，并调整浅色 token 后 violations 清零。

## 性能与降级

- 最初页面等 fixture JSON 到达后才显示整个工作台，产生 `CLS 0.23`。
- 工作台现在在 `.js` 模式首屏预留空间，加载期间使用 `inert + aria-busy`，数据就绪后再启用操作；无脚本时 CSS 隐藏工作台并保留静态证据。
- 修复后本地冷加载：TTFB `1.3ms`、FCP `92ms`、LCP `92ms`（H1）、CLS `0.02`。数字只用于排除本地明显阻塞，不代表公网 Pages 性能。
- 页面没有外部运行时依赖；10 个网页证据资产合计约 1.85 MB，折下静态图使用 lazy loading，重复 URL 由浏览器缓存复用。

## 下载验证延期

任务 JSON 的可见内容、`blob:` href、`download=portrait-workbench-001.json` 文件名和复制权限失败反馈均已验证。自动化落盘仍记为 `defer`：

- 已尝试 Blob 临时链接立即释放、延迟释放、直接 data URL 下载链接、持续 Blob URL 下载链接，以及绝对/相对目标路径。
- Agent Browser 的 Windows 会话均未返回可捕获下载文件；data URL 路径还会把自动化标签页带到 `about:blank`，而普通 DOM 下载语义保持正确。
- 缺失能力：当前自动化环境对本地 `data:` / `blob:` 下载的落盘捕获。
- 复测触发：在交互式 Chrome 手动点击下载，或产品接入服务端导出端点后用真实 HTTP 下载再次自动化。
- 非阻塞替代：交付页同时展示完整 JSON，并提供 Clipboard API + `execCommand` 回退的复制操作。

## 精炼记录

| 阶段 | 观察 | 最小干预 | 相邻复查 | 决定 |
| --- | --- | --- | --- | --- |
| 2–3 | 三栏布局在 1440px 清晰，768px 决策区需要完整宽度 | 1240px 以下让决策区跨两列 | 390px 改为单列 | pass |
| 5–6 | 上传路径切换后隐藏的旧候选节点仍在 DOM | 每次渲染舞台先清空 output grid | fixture 候选重新进入仍正常 | pass |
| 7 | 390px 当前步骤不可见、输入面板重复占首屏 | 当前步骤自动横向定位；完成输入后折叠输入面板 | 返回步骤 1 恢复输入和 scrollLeft | pass |
| 7 | axe 发现 ARIA、landmark、contrast 问题 | 调整角色、容器语义和色彩 token | 亮/暗品牌质检重扫 | pass |
| 8 | fixture 加载后整块插入导致 CLS 0.23 | `.js` 首屏预留 + inert/aria-busy | 无 JS 与 JSON 失败回退 | pass |
| 8 | 自动化无法捕获 blob/data 下载 | 改为直接持续 Blob download 链接并保留可见/复制 JSON | 五种下载路径均尝试 | defer |

## Revision 2：三模式补全与优化

### 信息架构

- **产品模式**保留 revision 1 的输入 → 计划 → 规则 → 质检 → 交付闭环，默认仍是最短操作路径。
- **探索模式**恢复完整研究链：8 个阶段、人物/宠物/多人三组核心证据、9 个真实场景、7 个产品方向和三档成熟度。
- **架构模式**呈现五步责任链、能力矩阵、当前任务包、H1/H2/H3 路线、对我们的价值与来源台账。
- 三种模式共享顶部上下文；产品模式更换家庭、品牌或上传计划后，架构包同步主体数、任务数、布光分支、候选、QA 和人工决定。

探索信息没有用新的模型结果填充。新增到当前项目的 6 份人物/宠物 A/B 资产全部从相邻研究项目逐字节复制；配合原有 10 份家庭/品牌资产，共 16 份可追溯网页证据。

### 浏览器证据

| 表面 / 状态 | 结果 | 证据摘要 |
| --- | --- | --- |
| 1440×900 产品 | pass | 三模式切换器不抢夺任务层级；产品工作流仍在首屏下半部开始；`scrollWidth 1425 ≤ 1440` |
| 1440×900 探索 | pass | 8 段时间线为左侧持续导航 + 右侧证据舞台；End 键从 00 到 07；当前只有一个 research panel 可见 |
| 1440×900 架构 | pass | 五步责任链、能力表、实时任务包和三阶段路线均可读；家庭与品牌任务同步通过 |
| 768×1024 探索 / 架构 | pass | 标题、五步链和三模式选择重排；`scrollWidth 753 ≤ 768` |
| 390×844 探索 | pass | 模式与时间线使用局部横向滚动；研究指标、证据与场景变单列；`scrollWidth 375 ≤ 390` |
| 品牌产品闭环 | pass | 品牌 fixture → 规则 → 4 份真实候选 → 人工批准 → 任务 JSON；架构包显示 `1 subjects · 4 task(s)` |
| 场景过滤 | pass | 全部 / 图像 / 过程 / 框架四种筛选保持场景证据类型，不改变内容来源 |
| 深色与 reduced-motion | pass | 手机深色层级可读；`transitionDuration=1e-05s`、`scrollBehavior=auto` |
| 脚本失败回退 | pass | 精确阻断 revision 2 的 `app.js` 请求后 html class 数为 0；8 个 research panel、9 个 scenario card、7 个 direction card 均在 DOM；`375 ≤ 390` |
| 性能观察 | pass | 本地产品冷加载 TTFB `3.2ms`、FCP/LCP `1524ms`（H1）、CLS `0`；新增探索图片均 lazy loading |

### 可访问性修复与扫描

首次 axe-core `4.13.0` 扫描发现两类问题：`article role=tabpanel` 的角色组合不允许，以及深色强调面上的 8px 标签和责任链序号对比不足。研究面板改为允许 `tabpanel` 的通用容器，标签与 Skill/共享序号改用 `accent-strong` 后重扫：

- 亮色探索模式：`0 violations / 44 passes / 2 incomplete`。
- 亮色架构模式：`0 violations / 42 passes / 2 incomplete`。
- 深色架构模式：`0 violations / 42 passes / 2 incomplete`。
- 深色产品模式：`0 violations / 42 passes / 1 incomplete`。

`incomplete` 为图片/混合背景等需要人工判断的对比项目；真实截图和主题切换已人工检查。模式和研究时间线都采用 roving tabindex，Home/End/方向键与 `aria-selected` 同步。

## 终端审计与交接

1. 项目与阶段：Rembrandt Portrait Lighting 多模式能力工作台，revision 2 Stage 9 交付关闭。
2. 已完成：原产品闭环、8 阶段探索、3 组核心证据、9 场景、7 产品方向、五步责任链、实时架构包、三阶段路线、双主题、三视口、键盘、脚本失败回退、离线验证器与研究中心同步。
3. 剩余或延期：仅自动化环境的本地 Blob 下载落盘捕获沿用严格 `defer`；真实检测、模型、自动相似度、账号与存储属于下一产品阶段，不是本次信息补全未完成项。
4. 证据：16 个逐字节同源资产、fixture manifest、三模式与三视口浏览器记录、品牌交付闭环、家庭/品牌架构同步、axe 0 violations、脚本失败回退、reduced-motion 和性能观察。
5. 下一会话优先项：若继续真实产品开发，先实现 H1 的检测/人工确认与一个图像模型适配器；保持当前规则包、任务 JSON、人工 QA 和完整研究证据作为可追溯接口。
