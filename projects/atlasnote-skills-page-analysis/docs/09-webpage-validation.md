# 能力落地工作台浏览器验收

## 运行环境

```text
日期：2026-08-30 至 2026-08-31
Canonical runtime：http://127.0.0.1:4178/web/
启动命令：python -m http.server 4178 --bind 127.0.0.1
浏览器：本机 Chromium / agent-browser，session atlas-shot、atlasverify
技术边界：原生 HTML、CSS、JavaScript；无构建步骤、后端和远程运行时资产
```

## 最终视觉证据

| 表面 | 证据 |
| --- | --- |
| 1440×1000 深色首屏 | [desktop-dark-hero.png](../evidence/web/desktop-dark-hero.png) |
| 1440×1000 四套分类 | [desktop-classification.png](../evidence/web/desktop-classification.png) |
| 1440×1000 九种能力形态字典 | [desktop-field-guide.png](../evidence/web/desktop-field-guide.png) |
| 1440×1000 六类缺口诊断 | [desktop-gap-diagnosis.png](../evidence/web/desktop-gap-diagnosis.png) |
| 1440×1000 Builder 组合体检 | [desktop-selection-audit.png](../evidence/web/desktop-selection-audit.png) |
| 768×1024 深色能力字典 | [tablet-dark-field-guide.png](../evidence/web/tablet-dark-field-guide.png) |
| 390×844 展开的能力形态 | [mobile-shape-expanded.png](../evidence/web/mobile-shape-expanded.png) |
| 390×844 缺口诊断结果 | [mobile-gap-result.png](../evidence/web/mobile-gap-result.png) |
| 390×844 组合体检详情 | [mobile-selection-audit-detail.png](../evidence/web/mobile-selection-audit-detail.png) |
| 1440×1000 场景关系地图 | [desktop-scenario-map.png](../evidence/web/desktop-scenario-map.png) |
| 1440×1000 五步场景演示 | [desktop-scenario-demo.png](../evidence/web/desktop-scenario-demo.png) |
| 768×1024 深色场景关系 | [tablet-dark-scenario-map.png](../evidence/web/tablet-dark-scenario-map.png) |
| 390×844 手机场景演示 | [mobile-scenario-demo.png](../evidence/web/mobile-scenario-demo.png) |
| 1440×1000 个人场景映射器 | [desktop-personal-mapper.png](../evidence/web/desktop-personal-mapper.png) |
| 768×1024 深色个人映射器 | [tablet-dark-personal-mapper.png](../evidence/web/tablet-dark-personal-mapper.png) |
| 390×844 手机映射结果 | [mobile-personal-mapper-result.png](../evidence/web/mobile-personal-mapper-result.png) |
| 1440×1000 九类核验详情 | [desktop-verification-detail.png](../evidence/web/desktop-verification-detail.png) |
| 768×1024 深色核验台 | [tablet-dark-verification-lab.png](../evidence/web/tablet-dark-verification-lab.png) |
| 390×844 手机核验详情 | [mobile-verification-detail.png](../evidence/web/mobile-verification-detail.png) |
| GitHub Pages 构建路径归档预览 | [archive-pages-preview.png](../evidence/web/archive-pages-preview.png) |

## 浏览器证据

### 启动与主结构

- 页面标题为“Agent 能力落地工作台｜Atlasnote 81 项研究”。
- 交互快照可识别首屏、能力原理、七段工作链、四套分类、九种形态字典、六类缺口诊断、探索器、组合体检、Skill Builder、成熟度、个人路线，以及带七段对应关系和五步演示的组合实验室。
- 页面正文非空，错误覆盖层检查为 `OK`；`agent-browser errors` 和 `console` 均无输出。

### 数据完整性

- 默认结果总数显示 81，首屏只渲染前 18 张卡片以控制初始密度。
- 点击“显示全部 81 项”后，DOM 中存在 81 张卡片，最后一项 `data-module-id="80"`。
- 静态验证确认 81 个 id 连续、slug 唯一，并与 Markdown 清单的 81 个原页面链接完全一致。
- 数据被编码为 7 个领域、9 种能力形态、7 个工作链角色和 4 种采用方式。
- 领域、形态和链路计数各自合计为 81；采用方式为直接采用 7、组合使用 41、借鉴改造 28、先做集成 5。

### 搜索、筛选与恢复

- 搜索“浏览器”得到 4 项。
- 在该结果上叠加“设计与视频”领域得到 1 项，证明筛选为组合关系。
- 搜索不存在字符串时，结果为 0、卡片网格隐藏、空状态显示。
- 点击空状态恢复按钮后，搜索清空、结果回到 81、初始渲染回到 18 项。
- 点击工作链的“验证”按钮得到 15 项，并设置 `aria-pressed="true"`。
- 点击“直接采用”得到 7 项，筛选器值同步为 `direct`，分类按钮设置 `aria-pressed="true"`。
- 在选择第 0 项后切换到设计领域，结果变为 24 但选择仍为 `1 / 6`；重置筛选后该卡片仍显示“已加入”。

### Skill 蓝图与生成

- 每张卡片和详情 dialog 都可加入或移除技能蓝图，选择状态跨筛选保留。
- 连续加入第六项后计数为 `6 / 6`；尝试第七项不会改变选择，浮动状态提示“已达上限，先移除一项”。
- 空表单提交后状态提示补全必填项，`skill-name` 设置 `aria-invalid="true"` 并获得焦点。
- 填写名称、真实任务、触发边界、交付物和验证后成功生成草案；回归状态为“草案已生成”，Builder 状态明确提醒检查触发、权限和验证。
- 生成结果包含有效 frontmatter、Intake、Workflow、Validation、Safety and stop conditions、Adapted patterns 和 Supporting resources；所选模式按工作链排序并保留来源。
- 复制后状态为“已复制”；下载后反馈文件名 `weekly-research-brief-SKILL.md`，并明确草案不代表已安装。
- 在详情 dialog 内加入模块后按 Escape，焦点返回重新渲染后的对应详情按钮，避免动态卡片造成焦点丢失。

### 详情与组合场景

- 打开第 0 项后，原生 dialog 显示正确标题、领域、形态、能力本质、注意点、工作链角色和 Atlasnote 原链接。
- dialog 打开后焦点落在关闭按钮；按 Escape 后关闭，并把焦点返回 `data-open-detail="0"` 的原触发按钮。
- 点击“深度研究”标签后显示研究组合；在标签上按 ArrowRight 会切换到“视觉内容”，对应标题更新为“品牌视觉与内容生产”。

### 使用场景关系与演示

- 软件交付、深度研究、视觉内容、产品推进和知识学习五个场景均显示真实示例输入、失败症状、主要缺口、优先能力形态、五角色组合、完成证据、演示产物和 Skill 样例字段。
- 每个场景包含五步演示，共 25 个步骤；“下一步”从定义推进到验收，最后显示“演示完成 ✓”并禁用继续按钮。
- “上一步”从验收返回执行；“重置”回到第一步；五个进度按钮可直接跳转，`aria-pressed` 与当前步骤同步。
- 场景切换会重置演示。软件场景从“把需求改写成可观察结果”开始；研究场景从“先固定研究问题和证据边界”开始。
- 键盘聚焦软件标签后按 ArrowRight 可进入深度研究；聚焦“下一步”按 Enter 后进入“先建清单和中间产物”；直接跳到第四步显示“在写报告前过诚信门”。
- 在研究场景点击“用此示例预填 Builder”后，名称为 `evidence-led-capability-research`、主要缺口为 `verification`、已选能力为 `5 / 6`，体检识别外部检索前置并显示“先核对依赖”。
- 预填后的五个必填字段可直接生成草案；状态为“草案已生成”，输出包含研究任务、来源型交付物、质量验证标准、五项借鉴模式和外部只读依赖说明。
- 演示没有调用第三方能力；它只展示对应关系并把原创样例写入本地 Builder。

### 个人场景映射器

- 映射器提供软件与网页、研究与分析、视觉与内容、产品与协作、知识与学习五类工作对象，以及方法、工具、约束、验证、路由、记忆六类主要缺口。
- 默认状态为“研究与分析 × 质量验证”；结果说明工作对象决定案例上下文，质量验证决定本次优先能力机制。
- 对 5 × 6 共 30 种组合执行页面内检查，所有组合均返回 3～5 个已知能力 id，且至少一项直接覆盖所选缺口；无无效组合。
- 选择“视觉与内容 × 边界约束”后，结果推荐 4 项：评测器和设计系统标为“补主要缺口”，方向选择与交付工作流标为“场景支撑”。
- 输入“为我的研究报告制作三张同系列插画并保证手机端可读”后，动态摘要使用该任务；带入 Builder 后名称为 `visual-constraint-workflow`、缺口为 `constraint`、选择 `4 / 6`，组合体检为“组合聚焦”。
- 映射结果成功生成草案；预览状态为“草案已生成”，Builder 反馈使用 4 项能力模式。
- “知识与学习 × 执行工具”跨常规组合返回 5 项有效能力，证明场景没有与单一缺口硬绑定。
- 点击“打开对应五步演示”后，所选场景 tab 变为 `aria-selected="true"`、演示回到第一步并滚动至面板。
- 键盘选择“产品与协作 × 能力路由”后结果同步；聚焦“打开对应五步演示”时可见焦点轮廓为 3px，按 Enter 后进入产品场景。

### 形态字典、缺口诊断与组合体检

- 九种能力形态都可展开查看生效机制、适用任务、最小落地物和主要风险；桌面为三列、平板两列、手机单列。
- 原生 `details/summary` 可用鼠标和 Enter 键开合；点击“筛选此形态”会同步探索器的形态筛选和结果数。例如“行为规则”得到 5 项。
- 六类缺口症状均使用可感知的 `aria-pressed` 状态。选择“质量验证”后，诊断结果推荐“评测与治理 / 行为规则”，并列出最小产物、证据和避免事项。
- 点击“带入 Skill Builder”后，主要缺口同步为 `verification`；点击“查看优先形态”后探索器显示 7 项评测与治理能力。
- 只选择不覆盖主要缺口的模块时，体检显示“需要补缺”并只给一个最小形态建议；增加评测模块后变为“组合聚焦”。
- 增加外部连接器后，体检变为“先核对依赖”并显示 1 项外部依赖；同角色增加第二个模块后，重叠计数变为 1。
- 体检不要求强行覆盖七段工作链，只检查主要缺口、职责分散、同角色重叠和真实外部依赖。

### 九类代表项目原仓库核验

- 九种能力形态各有一条代表档案；静态检查确认九个 shape 恰好覆盖完整形态集合、九个代表 id 唯一且都存在于 81 项清单中。
- 每条档案同时显示 Atlasnote 说法、官方来源支持的至少三项事实、明确未验证项、真实项目类型、安装方式、运行前置、权限与数据、许可证、维护信号、采用判断和 2026-08-31 复核日期。
- 点击“评测与治理”后标题为 `Impeccable`，官方事实区域可读到当前 README 的 61 条规则；这与 Atlasnote 观察文本的 59 条形成可见漂移证据。
- 聚焦该标签后按 ArrowRight，可切换到 `SwarmVault`；活动标签和焦点都更新为 knowledge，四个来源链接均为 HTTPS。
- 点击 SwarmVault 的“在 81 项中定位”后，搜索值变为其完整条目名，清单只剩一张 `data-module-id="63"` 卡片，焦点落在该卡片的详情按钮。
- 三状态图例把“官方来源已证实”“尚未独立复现”和“本项目未安装运行”分开；页面没有把仓库 README 主张写成当前环境运行成功。
- 手机端 `Paper Search MCP` 档案保持 352px 单列宽度；长前置、来源矩阵和风险文本均可自然换行。

### 主题、键盘与动态效果

- 浅色切到深色后，body 背景为 `rgb(17, 19, 25)`、文字为 `rgb(242, 241, 235)`、按钮 `aria-pressed="true"`；可正常切回浅色。
- Ctrl/Cmd+K 将焦点移到 `search-input`。
- 原生按钮、搜索、select、tabs、dialog 和链接都出现在语义交互快照中；`:focus-visible` 使用独立暖橙色轮廓。
- Builder 键盘顺序从 `skill-name` 依次进入 `skill-gap`、`skill-task`，与视觉顺序一致。
- 模拟 `prefers-reduced-motion: reduce` 后媒体查询为 true，过渡时间为 `1e-05s`；工作链跳转由 smooth 自动改为 auto。
- 平板深色模式中的能力字典保持对比度和层级；能力形态开合图标同样服从 reduced-motion。
- 场景 tabs、演示进度、前进/后退/重置和 Builder 应用按钮均为原生按钮；动态步骤结果使用 `aria-live="polite"`。
- 映射器的 11 个选择按钮、可选任务输入和两个结果动作均为原生控件；更新摘要另有 `aria-live="polite"` 文本反馈。
- 核验台九个纵向 tabs 支持点击、Arrow、Home/End 语义；动态详情是带 `aria-labelledby` 的 tabpanel，来源和定位动作均为原生链接或按钮。
- 核验台在 `prefers-reduced-motion: reduce` 下仍显示完整详情，媒体查询为 true，标签过渡为 `1e-05s`。

### 响应式

| 视口 | `innerWidth` | `scrollWidth` | 横向溢出 |
| --- | ---: | ---: | --- |
| Desktop | 1440 | 1440 | 无 |
| Tablet | 768 | 768 | 无 |
| Mobile | 390 | 390 | 无 |

手机端导航收敛为品牌与主题按钮；分类阅读顺序、计数板、采用方式、筛选器、能力卡片、Builder 表单与预览均改为单列。个人映射器的输入与结果上下排列，选择按钮保持两列，诊断字段、能力列表和双动作改为单列。场景对应关系改为两列，关系详情和演示内容改为单列，五步进度保持一行且不溢出。核验台标签和详情依次单列，事实、未验证项、规格和来源链接继续纵向堆叠。新增卡片操作和浮动选择入口不造成横向溢出。平板端 Builder 由左右栏改为上下布局，个人映射器、核验台与场景摘要、关系、能力链和演示依次堆叠。

## 工程验证

```text
python web/verify_web.py
PASS: 81 unique capabilities, 7 domains, 9 shapes, 7 work-chain stages
PASS: 4 adoption modes cover all 81 records: {'direct': 7, 'compose': 41, 'adapt': 28, 'integration': 5}
PASS: web data matches all 81 Markdown inventory source links
PASS: classification, selection, Skill generation, copy and download hooks exist
PASS: 9 shape field guides, 6 gap profiles and live selection-audit hooks exist
PASS: 5 scenario mappings contain 25 guided demo steps and valid Builder selections
PASS: personal mapper exposes 5 work contexts x 6 primary gaps with demo and Builder actions
PASS: 9 representative source-verification records cover all capability shapes with evidence boundaries
PASS: project-local capability-to-skill package is complete
PASS: required controls, responsive breakpoints, focus and reduced-motion fallbacks exist
PASS: no remote runtime assets

node --check web/app.js
PASS

python C:\Users\yun68\.codex\skills\.system\skill-creator\scripts\quick_validate.py skills/capability-to-skill
Skill is valid!

python scripts/research_hub.py check
PASS: 12 research projects

python -m unittest tests.test_research_hub
Ran 8 tests
OK
```

## 终审

- 设计契约要求的文件全部存在。
- 所有覆盖行均为 `pass`，没有 `continue`、`defer` 或 `blocked`。
- 网页没有安装或执行 Atlasnote 收录的第三方项目；它只组织本研究形成的能力理解并链接公开来源。
- 项目内 `capability-to-skill` 是原创元技能草案；网页下载结果也只是一份草案，不写入全局 Skills 目录。
- GitHub Pages 构建产物已在 `/demos/atlasnote-skills-page-analysis/` 路径验收：HTML、CSS、JavaScript 均返回 200，正文非空、无错误覆盖层或控制台错误、横向溢出为 0，并显示 GitHub README 与 Atlasnote 原网页入口。
