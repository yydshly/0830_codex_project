# Genart Lab Web 交付记录

## 交付结果

`web/` 是一套无外部运行时依赖的静态能力引导。它先用一件完整的玩家坏地图事件，把外部 seed、命名随机流、艺术输出、故障重放、局部修复、身份保持和系列普查串成端到端故事；再用六个角色视角解释同一事件怎样分别支持客服、美术、工程、QA、制作和产品选型；随后用“从引擎到产品”舞台，把同一方法直接渲染成游戏关卡、品牌物料、个性包装、数据报告、媒体资产和 UI 身份六种真实产品表面。品牌案例继续向下展开为一条真实生产闭环：五项业务参数、库/模型/浏览器责任归属、有无 Skill 三次对照，以及 PNG/SVG/Manifest 下载。`skills/genart-studio/` 则把相同原则封装为项目内 Codex Skill、starter 与验证工具。

## 真实浏览器证据

| 旅程 / 表面 | 结果 |
| --- | --- |
| 玩家坏地图事件 | release / v1.4.2 稳定恢复第 7 房间封路现场 |
| 同 seed 事件重放 | PASS 3/3；三个 Canvas SHA-256 摘要一致 |
| 候选修复与身份保持 | route PASS；enemy / loot 均为 PRESERVED |
| 10,000 seed 发布普查 | release 发现 809 个 BLOCKED；candidate 为 0 |
| 六个角色视角 | 六个不同 Canvas、六套输入/证据/决策和量化收益或边界 |
| 角色视角确定性 | 同角色同 seed 摘要一致；六角色摘要彼此不同 |
| 角色视角键盘操作 | 左右方向键、Home、End 切换并保持焦点 |
| 沉浸式视觉层级 | 1440px 下 Canvas 约 1358×788，角色轨道与说明成为画面前景 HUD |
| 场景转场 | scene-entering → is-settled；reduced-motion 下 transition 为 0s |
| 场景切换性能 | 本机六幅 1280×760 Canvas 单次绘制约 2–11ms；自动门禁上限 200ms |
| 六个产品落地案例 | 游戏、品牌、商品、数据、媒体、UI 六幅 1280×760 实时 Canvas mockup |
| 产品案例确定性 | 六个 digest 彼此不同；同案例同 seed 重放一致；换 seed 后结果变化 |
| 产品业务桥梁 | 每个案例同时显示业务输入、最终交付、产品价值和三种导出格式 |
| 产品案例键盘操作 | 左右方向键、Home、End 切换并保持焦点；产品画面与说明同步变化 |
| 产品舞台性能 | 1440px 手动观察约 4–12ms，首次冷启动仍低于 200ms 自动门禁 |
| 能力责任归属 | 三列明确区分：库负责 seed/streams/replay/audit；模型负责构图/颜色/规则/代码；浏览器负责绘制/digest/export |
| 原理剖面 | 首段明确当前 AERO 只是 seeded PRNG + 贝塞尔曲线 + 径向渐变 + 字体排版；三层流程区分生成器、Skill 方法与浏览器运行时 |
| 可替换生成器边界 | 页面列出粒子、拼贴、版画、字体、Shader、地形六个方向，并明确艺术变化不改变方法层 |
| 品牌业务输入 | 品牌名、活动标题、活动 ID、主色、强调色实时改变 Canvas；URL 保存非默认参数 |
| 品牌有无 Skill 对照 | seeded stream 连续 3 次为 PASS / 1 个摘要；Math.random 为 DRIFT / 多个摘要 |
| 品牌 PNG 下载 | Playwright 捕获真实 `.png`；文件头为标准 PNG 8-byte signature |
| 品牌 SVG 下载 | 文件包含当前标题、主色和强调色，可继续进入设计/印刷链路 |
| 品牌 Manifest 下载 | JSON 可解析，包含 seed、五项输入、三项渠道输出、当前 pixel digest 与 deterministic 标记 |
| deterministic 同 seed 运行 3 次 | PASS；像素与 features 一致 |
| broken `Math.random` 运行 3 次 | FAIL；三个 SHA-256 摘要不同 |
| 系列视图 | 12 个实时 Canvas 作品 |
| feature census | 浏览器内完成 5,000 seed，渲染 3 组 trait 图表 |
| 六种使用场景 | 六个不同 Canvas、六组内容说明和 18 个实时 traits |
| 场景确定性 | 同场景同 seed 摘要一致；换 seed 后摘要变化 |
| 场景隔离 | 同一 seed 在六个命名子流中得到六个不同领域结果 |
| 场景键盘操作 | 左右方向键、Home、End 切换 tabs 并保留焦点 |
| 主题 | light / dark 均可读 |
| 视口 | 1440 / 768 / 390 的横向 overflow 均不大于 1px |
| 键盘 | 首个 Tab 到 skip link；Enter 可进入正文并运行检查 |
| reduced motion | 匹配媒体查询，滚动行为变为 `auto` |
| Canvas fallback | 说明仍可阅读；像素检查与下载明确禁用 |
| 控制台 | 所有验收旅程均无页面错误 |

自动化入口：

```powershell
npm run test:web
npm run skill:validate
npm run skill:scan
npm run skill:check
```

## 浏览器迭代中发现并修复的问题

初版用 `[data-mode]` 收集模式按钮，同时 `<body>` 也带有 `data-mode` 状态。真实鼠标点击会冒泡到 body，误触发一次模式重渲染，把刚完成的 PASS / FAIL 结果清空。直接脚本调用元素 `.click()` 不容易暴露这一问题。

最终把绑定范围收紧为 `button[data-mode]`，并使用真实鼠标、键盘和 Chromium smoke 重新验证。这个缺陷也说明：生成艺术检查器本身仍然需要交互层验收，不能只验证绘图函数。

Revision 2 首版在场景渲染期间禁用了全部 tab，导致方向键切换后焦点落回页面。最终只锁定“重放”和“换 seed”，保留 tab 焦点和 roving `tabindex`，再用 ArrowRight / End 完成键盘复验。

Revision 3 不再用六个彼此独立的能力切片解释价值，而是新增玩家事件主线。交互顺序被刻意锁定为“重放 → 修复 → 普查”：没有确定性证据不能应用修复，没有候选版本不能运行发布普查。这样页面表达的不只是“能画什么”，而是“团队怎样对随机视觉负责”。

Revision 4 没有再造六个无关案例，而是让六个角色观察同一个 GA-2048 事件。每个 tab 强制呈现“输入 → 三条证据 → 决策 → 收益/边界”，并配一张角色专属的确定性 Canvas 证据图。这样用户可以区分机制、艺术、协作、测试、交付和选型价值。

Revision 5 的真实浏览器基线显示 Canvas 只有约 669×446，而六等分 tab 和 569px 白色说明栏占据更强视觉权重，用户正确地感知为“退化成表格”。最终移除六等分表头与交接表，把 Canvas 扩展到约 1358×788；角色控制改为舞台轨道，说明改为底部 HUD，并新增发光粒子、加色轨道、艺术流体、seed 星体、批量扫描和发行画廊六类 cinematic 静帧。画面仍由固定 seed 确定生成，不伪装成库自带画风。

Revision 6 继续解决“虽然能介绍，但看不到如何进入实际场景”的问题。旧场景图谱基线仍是约 668×445 Canvas + 右侧说明 + 下方矩阵，主要在讲用途。新舞台将产品结果提升到约 1358×806，并由 `application-core.js` 实时生成六个可识别消费表面：游戏 HUD、品牌三画幅、可生产包装、年度报告、媒体栏目和 UI 身份。说明被压缩成画面下方的“业务输入 → 最终交付 → 产品价值”桥梁，格式标签明确指出下游系统会消费 Tilemap/JSON/SVG/PDF/CSS tokens 等什么内容。

Revision 7 回答“这些效果到底来自库，还是模型自己发挥，以及怎样进入实际工作”。页面先把责任拆成库、模型和浏览器三方，明确上游库不附赠 AERO 画风；再把品牌案例接成可编辑生产台。五项参数同时驱动 Canvas、SVG 和 Manifest；并排实验让 seeded stream 与 `Math.random` 各跑三次，把“可重放”从说明变成六个真实像素摘要。自动化还实际接收三个 download 事件，检查 PNG 文件头、SVG 当前文案/颜色和 Manifest 字段。浏览器验收期间发现 `media` 仍以旧参数调用共享 `campaignArtwork`，导致产品切换停在 calculating；最终由共享函数统一规范化品牌输入，六产品回归恢复通过。

Revision 8 把聊天中最关键的原理放回了网页。品牌生产台不再直接从下载标题跳到参数和对比，而是先给出“线条是画面，Skill 是方法”的结论；随后用非表格化三层管线说明模型/创作者负责生成器，genart-skill 负责可复现协议与验收，浏览器负责像素、摘要和文件。桌面为横向流程，390px 转为纵向并实测 overflow 为 0；noCanvas 状态下完整原理仍可读。原有六产品、品牌编辑、稳定/漂移对照和三个下载通过全量 smoke 回归。

## 最终截图

- `artifacts/web-desktop-light.png`：桌面浅色首屏。
- `artifacts/web-proof-dark.png`：深色故障模式 FAIL 证据。
- `artifacts/web-mobile-light.png`：390px 中文首屏。
- `artifacts/web-scenarios-desktop.png`：六场景工作台桌面浅色地图案例。
- `artifacts/web-scenarios-dark.png`：深色数字发行案例。
- `artifacts/web-scenarios-mobile.png`：390px 场景导航和工作台入口。
- `artifacts/web-complete-case-release.png`：玩家坏地图事件与 BLOCKED 现场。
- `artifacts/web-complete-case-fixed.png`：候选修复、route PASS 与身份保持。
- `artifacts/web-complete-case-audit.png`：10,000 seed 修复前后普查结果。
- `artifacts/web-complete-case-dark.png`：完整案例深色主题。
- `artifacts/web-complete-case-mobile.png`：390px 完整案例叙事入口。
- `artifacts/web-complete-case-mobile-workbench.png`：390px 案例画布、顺序控件与状态台。
- `artifacts/web-role-lenses-engineering.png`：全幅子流轨道与前景工程 HUD。
- `artifacts/web-role-lenses-qa-dark.png`：深色主题批量 seed 扫描舞台。
- `artifacts/web-role-lenses-mobile.png`：390px 方形艺术流体舞台与横向角色轨道。
- `artifacts/web-product-game.png`：可玩关卡、实体、掉落、出口和重放句柄。
- `artifacts/web-product-brand.png`：同一个 campaign seed 的桌面 KV、9:16 Story 与商品卡。
- `artifacts/web-product-data-dark.png`：深色主题年度报告封面、指标和趋势图。
- `artifacts/web-product-mobile.png`：390px 个性商品、重放/换 seed 与业务桥梁。
- `artifacts/web-brand-comparison.png`：品牌主画面、三方责任归属、下载入口和生产台衔接。
- `artifacts/web-brand-production.png`：桌面有 Skill / 无 Skill 三次摘要对照结果。
- `artifacts/web-brand-production-mobile.png`：390px 品牌参数与 PASS 结果。
- `artifacts/web-principle-anatomy.png`：桌面生成器 / genart-skill / 浏览器三层原理剖面。
- `artifacts/web-principle-anatomy-mobile.png`：390px 纵向原理流程与极简画面配方。
- `artifacts/starter-grid.png`：项目内 Skill starter 的系列联系表。

## 能力边界

- 页面证明固定 Chromium 环境中的复现，不承诺跨 GPU 的 WebGL 字节一致。
- 页面没有钱包、NFT 铸造、平台发布或后端任务队列。
- `scan.mjs` 是高价值启发式扫描，不是 JavaScript 语义证明器。
- 工具会执行目标 sketch；未知项目应继续按不可信代码隔离运行。
