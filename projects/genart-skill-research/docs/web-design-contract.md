# Web 交付设计契约

```text
Entry mode: Revision-led
Request revision: 8
Target user and context: 想判断 genart-skill 如何进入真实产品的创作者、品牌团队、产品设计师、游戏开发者、内容团队和 AI Skill 研究者
Desired first impression: 用户先诚实看懂当前画面只是一个极简线条/光带生成器，再看懂模型、genart-skill 与浏览器怎样共同把任何生成算法变成可复现、可验收、可交付的资产
Visual ambition: Immersive
Experience architecture: Hybrid Workspace
Visual constraints: 页面整体仍保留编辑型叙事，但多视角区必须成为深色全幅沉浸舞台；Canvas 是第一视觉焦点并占据主要空间；角色控制是舞台前景轨道而不是表格单元格；解释压缩成不超过三层的 HUD；允许 Canvas 光晕、加色混合和一次性场景转场，不使用外部字体/图片/CDN，不用持续干扰动画
Information constraints: 保留 Revision 1-7；品牌生产台必须在参数和对照之前说明当前线条画面的实际算法、库不提供固定画风、替换生成器后生产协议仍成立；不能把艺术效果与库能力混为一谈
Operation constraints: 保留既有操作；品牌案例新增品牌名、活动标题、主色、强调色、活动 ID 输入；参数变化实时更新主 Canvas；可运行 3 次有 Skill / 无 Skill 对照；可真实下载 PNG、SVG 和 Manifest JSON
State constraints: 保留既有状态；新增 brand pristine/edited、comparison idle/running/pass+drift、export ready/download、input validation、noCanvas comparison/export disabled
Environment constraints: 原生 HTML/CSS/ES modules；无后端、登录、钱包或真实链上调用；Chrome/Chromium；桌面 1440、平板 768、手机 390；页面可由 research_hub 复制到 Pages
Primary journey: 进入品牌产品案例 → 看见三渠道物料 → 理解“线条生成器 / genart-skill / 浏览器执行”三层原理 → 识别画风来源与能力边界 → 编辑品牌业务参数 → 运行稳定/漂移对照 → 下载资产
User-defined phases: 保留 Revision 1-7；把聊天中关于极简线条实现、库的真实原理、艺术能力来源和可替换生成器边界汇总进网页
Required artifacts: 保留 Revision 1-7；新增品牌生产台内的原理剖面、生成流程、可替换生成器说明，修订测试/契约/交付说明和桌面/手机证据
Autonomy authorization: 用户明确要求深入研究、创建 Web 引导、演示并在项目内转换成可直接使用能力；允许直接完成可逆的本地实现与验证
User-decision boundary: 不安装到全局 CODEX_HOME；不部署网站；不铸造 NFT；不连接钱包或付费平台；不修改 upstream 快照
Observable completion criteria: Revision 1-7 继续通过；品牌生产台首段明确写出当前效果由 seeded PRNG、贝塞尔曲线、径向渐变和字体排版组成；视觉流程区分模型/创作者写生成器、genart-skill 管理协议与验收、浏览器绘制与导出；明确“换粒子/版画/Shader/地形生成器，方法层仍成立”；桌面/手机/noCanvas 可读且不产生横向溢出；真实浏览器无错误；自动化与门户检查通过
```

## Revision 8 原理剖面

```text
Information order: 诚实结论 → 当前画面配方 → 三层协作流程 → 可替换生成器边界 → 原有参数/对照/导出
Primary visual: 使用一条非表格化的横向“生成器 → 方法层 → 运行时”管线；每层只保留负责人、输入/动作和输出
Preserved behavior: 原品牌参数、稳定/漂移对照、PNG/SVG/Manifest 下载和六产品切换全部保持
Mobile transformation: 三层流程改为纵向，连接箭头旋转；算法标签自动换行，不依赖 Canvas 才能理解
Fallback: noCanvas 下原理剖面完整可读，仍明确只有绘制、摘要和导出不可用
```

## Revision 7 品牌生产闭环

```text
Scene base: 继续使用产品 Canvas；品牌参数通过显式输入传入确定性渲染器
Scene persistence: 编辑参数、运行对照和导出期间主品牌 Canvas 始终可见或可快速返回
Foreground control model: 产品轨道 + 品牌参数表单 + 三方归属条 + 对照台 + 导出工具栏
State-to-scene mapping: pristine → 默认 AERO/MOVE BEYOND；edited → 画面/digest/manifest 同步；compare running → 两组运行；pass/drift → 摘要证据；noCanvas → 文本保留、绘制与导出禁用
Mobile transformation: 表单、对照和导出纵向排列；主 Canvas 保持可见；不使用弹窗
Fallback: 参数和能力归属可读；明确说明 Canvas、像素摘要和下载不可用
```

## Revision 6 产品落地舞台架构

```text
Scene base: Canvas 2D 产品 mockup（确定性静帧）+ CSS 产品轨道与交付 HUD
Scene persistence: 六个产品案例切换期间保持同一 seed 和固定舞台；每个案例重构为不同的真实消费表面
Foreground control model: 顶部产品轨道；画面内产品标题、digest、渲染耗时与格式；底部重放/换 seed；画面下方三段业务桥梁
State-to-scene mapping: selected → 对应产品交付；product-entering → 短暂淡入；settled → 可读可操作；new-seed → 视觉与 digest 同步变化；noCanvas → 文本交付说明
Mobile transformation: 产品轨道横向滑动；Canvas 保持大幅；业务桥梁纵向排列；操作按钮保持可触达
Fallback: 隐藏 Canvas，但保留案例、业务输入、交付物、格式、价值和 seed 操作边界
```

## Revision 5 沉浸舞台架构

```text
Scene base: Canvas 2D（确定性静帧）+ CSS 前景层
Scene persistence: 六角色切换期间保持同一舞台位置和世界 seed；只更换视觉现实与 HUD 内容
Foreground control model: 左侧/顶部角色轨道、画面内标题与 digest、底部三步证据条、右下价值结论
State-to-scene mapping: selected → 对应视觉现实；scene-entering → 画面淡入与 HUD 位移；settled → 稳定可读；noCanvas → 语义 fallback
Mobile transformation: 角色轨道横向滑动；Canvas 保持首要；三步证据变为紧凑纵向详情，不把舞台拆成长表格
Fallback: 保留角色标题、关键问题、输入、证据、决策和边界；隐藏高成本 Canvas
```

## 设计方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 首屏层级 | 文案结论与 live canvas 组成 5:7 双栏 | 主标题先说明“同一个 hash 回到同一件作品”，Canvas 不替代文字 | 首屏同时看到定位、seed、重放和作品 |
| 阅读结构 | 问题 → 动手验证 → 系列视角 → 我们可直接使用 | 每节只回答一个问题，避免把源码研究平铺成文档 | 用户按滚动顺序能完成主旅程 |
| 类型角色 | 中文系统无衬线 + hash/数值等宽 | hash、像素摘要和命令明显区别于说明文字 | 长 hash 不撑破手机布局 |
| 主题 | Light/Dark 双主题，共享语义 token | pass/fail 不只靠颜色，状态同时有文字和图形 | 双向切换后文本、边框、按钮和 Canvas 面板可读 |
| 材质与深度 | 细线框、纸张/控制台对照、少量硬阴影 | 交互实验区明显高于阅读卡片，不使用模糊玻璃 | 控件归属清楚且无多余卡片嵌套 |
| 动效 | 只用于状态变化和新作品出现 | 无持续动画；reduced-motion 取消过渡 | 关闭动画后功能和反馈不丢失 |
| 高成本视觉 | Canvas 为增强层，文字与状态为基础层 | Canvas 不可用时显示清晰 fallback | 无 Canvas 仍能理解能力与运行命令 |

## 覆盖清单

### Revision 8：把原理放回网页

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 诚实结论 | 当前视觉是极简线条/光带生成器，不是库自带画风 | brand default/noCanvas | 标题、verdict、noCanvas DOM 实测 | Stage 2-3 | pass | 无 |
| 实现原理 | seeded PRNG、贝塞尔曲线、径向渐变、字体排版可见 | brand default | 四个算法 token + CSS mini-art | Stage 3 | pass | 无 |
| 库的原理 | 模型/创作者、genart-skill、浏览器三层职责与数据流 | brand default | `web-principle-anatomy.png` + 语义 snapshot | Stage 3 | pass | 无 |
| 能力边界 | 替换粒子/版画/Shader/地形后方法层仍成立 | brand default | 六种替换方向 + 明确边界结论 | Stage 3 | pass | 无 |
| 跨表面与交付 | 桌面/手机/noCanvas、原流程回归、文档更新 | 1440/390/fallback | 两张截图、390 overflow 0、smoke、hub check/build | Stage 7-9 | pass | 无 |

### Revision 7：品牌活动生产闭环

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 责任边界 | 清楚区分库、模型和浏览器 | brand default/fallback | 三方归属条 + noCanvas 文本 | Stage 2-3 | pass | 无 |
| 业务输入 | 五项品牌参数实时驱动画面 | pristine/edited/keyboard | 输入前后 digest、标题、颜色变化与 URL 状态 | Stage 4-6 | pass | 无 |
| 有无 Skill 对照 | 同 seed 稳定 3/3 vs Math.random 漂移 | idle/running/result | 两个 mini Canvas + 6 个摘要 + PASS/DRIFT | Stage 4-6 | pass | 无 |
| 真实 PNG | 下载当前多画幅品牌 Canvas | download | Playwright download + PNG 8-byte signature | Stage 5-6 | pass | 无 |
| 真实 SVG | 下载参数化桌面 KV | download | 可解析 SVG 含当前文案与两组颜色 | Stage 5-6 | pass | 无 |
| 真实 Manifest | 下载含 seed/输入/输出/digest 的 JSON | download | JSON parse；输入、3 输出、digest、deterministic 全断言 | Stage 5-6 | pass | 无 |
| 参数校验 | 空值/超长/非法颜色不会破坏画面 | input error/recovery | maxlength、color input 与统一 normalizeBrandInputs | Stage 6 | pass | 无 |
| 跨表面 | 品牌生产台响应式、双主题、键盘 | 1440/768/390 light/dark | 3 张截图、tab/input focus、overflow 0 | Stage 7 | pass | 无 |
| 能力降级 | noCanvas 仍能理解归属和输入，绘图/导出禁用 | no-canvas | 归属/表单可读；comparison/download disabled | Stage 8 | pass | 无 |
| 工程交付 | 测试、截图、说明和门户构建 | build | smoke/skill/hub/unit/构建产物验收 | Stage 9 | pass | 无 |

### Revision 6：从抽象效果到真实产品

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 产品桥梁 | 新增“从引擎到产品”视觉主舞台 | 1440 product default | 旧 Canvas 约 668×445；新产品 Canvas 约 1358×806，画面为第一焦点 | Stage 1-3 | pass | 无 |
| 游戏落地 | 显示真实关卡 HUD、角色、敌人、掉落和出口 | game selected/settled | `web-product-game.png` + 64 位 Canvas digest | Stage 3-6 | pass | 无 |
| 品牌落地 | 一个 campaign seed 生成桌面 KV、手机故事与商品卡 | brand selected/settled | `web-product-brand.png` 同时显示 16:9、9:16、1:1 | Stage 3-6 | pass | 无 |
| 个性商品 | 显示包装盒、标签、生产编号和可恢复订单 | product selected/settled | `web-product-mobile.png` + MIRA/042/order seed | Stage 3-6 | pass | 无 |
| 数据报告 | 指标映射成年度报告封面、图表和区域摘要 | data selected/settled | `web-product-data-dark.png` + Growth/Active/Regions/Risk | Stage 3-6 | pass | 无 |
| 媒体内容 | 显示播客、视频缩略图与栏目封面 | media selected/settled | 浏览器实时 Canvas + 播客/16:9/栏目资产 | Stage 3-6 | pass | 无 |
| UI 身份 | 显示头像、会员卡、徽章和主题 token | identity selected/settled | 768px 实测 CSS TOKENS/SVG BADGE/PROFILE JSON | Stage 3-6 | pass | 无 |
| 确定性操作 | 六案例切换、同 seed 重放、换 seed | mouse/keyboard/replay/new | 六 digest 不同；重放一致；换 seed 改变；ArrowRight/End 通过 | Stage 4-7 | pass | 无 |
| 状态反馈 | product-entering/settled 与 reduced-motion | normal/reduced | MutationObserver 捕获两态；reduced-motion transition 为 0s | Stage 6-8 | pass | 无 |
| 跨表面 | 产品舞台桌面/平板/手机与双主题 | 1440/768/390 light/dark | 四张最终截图；三视口 overflow 0；390 Canvas 345×343 | Stage 7 | pass | 无 |
| 能力降级 | noCanvas 仍能看懂六类最终交付 | no-canvas | 构建前实测 fallback 可见、按钮禁用、品牌格式和标题完整 | Stage 8 | pass | 无 |
| 性能 | 六产品切换无可感知卡顿 | six transitions | 1440 热渲染约 5–13ms；构建产物 47.1ms；自动门禁 <200ms | Stage 8 | pass | 无 |
| 工程交付 | 测试、说明、截图与 Pages 构建 | build | smoke/validator/scan/check/hub/unit/构建产物浏览器验收全部通过 | Stage 9 | pass | 无 |

### Revision 5：从表格工作台到沉浸式 seed 舞台

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 修复视觉退化 | 删除表格化六等分 tabs、左右白色说明栏和交接链 | 1440 boundary baseline | Canvas 从约 669×446 提升到 1358×788；`.lens-handoff` 已删除 | Stage 2-3 | pass | 无 |
| 眼前一亮效果 | 大幅生成场景成为第一焦点 | 1440 support/art/boundary | 三张最终截图；Canvas 明显大于底部 HUD | Stage 2-3 | pass | 无 |
| 同 seed 六现实 | 六幅明显不同但确定性的视觉效果 | six selected/settled | 六 digest 不同；同角色重放一致 | Stage 5-6 | pass | 无 |
| 前景操作 | 角色轨道、标题、digest、证据、价值同舞台 | mouse/keyboard/focus | 点击 + ArrowRight/End 实机通过，焦点跟随选中角色 | Stage 4-7 | pass | 无 |
| 状态反馈 | scene-entering / settled 与 reduced-motion | motion/reduced | MutationObserver 捕获两态；reduced-motion 为 `0s` | Stage 6-8 | pass | 无 |
| 跨表面 | 舞台桌面/平板/手机与双主题 | 1440/768/390 light/dark | 三张最终截图；桌面/平板/手机 overflow 0 | Stage 7 | pass | 无 |
| 能力降级 | noCanvas 仍能理解六种角色价值 | no-canvas | 构建产物实测 fallback 可见、Canvas 隐藏、状态 settled | Stage 8 | pass | 无 |
| 性能 | 切换渲染无可感知卡顿 | six transitions | 实机六场景约 1.4–10.9 ms；smoke 阈值 200 ms | Stage 8 | pass | 无 |
| 工程交付 | 测试、说明与 Pages 构建 | build | smoke/validator/scan/check/hub/unit/构建产物浏览器验收全部通过 | Stage 9 | pass | 无 |

### Revision 4：同一事件的多角色视角

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 多角度演示 | 玩家 / 客服视角 | support selected/rendered | 1 seed / 42 sec / ESCALATE 证据图 + 输入/决策 | Stage 3-6 | pass | 无 |
| 多角度演示 | 技术美术视角 | art selected/rendered | Ember Mine / Vault Moth / Cold Static 艺术锁定 | Stage 3-6 | pass | 无 |
| 多角度演示 | 游戏工程视角 | engineering selected/rendered | `web-role-lenses-engineering.png` + 1/4 子流变化 | Stage 3-6 | pass | 无 |
| 多角度演示 | QA / 数据视角 | qa selected/rendered | `web-role-lenses-qa-dark.png` + 3/3 + 809→0 | Stage 3-6 | pass | 无 |
| 多角度演示 | 制作 / 发行视角 | production selected/rendered | incident/candidate/review/audit/release 交付链 | Stage 3-6 | pass | 无 |
| 多角度演示 | 适用边界视角 | boundary selected/rendered | one-off/series × accountability 决策图 | Stage 3-6 | pass | 无 |
| 交互操作 | 六视角鼠标与键盘切换 | selected/rendered/focus | 六 digest 不同；同角色重放一致；ArrowRight/End 通过 | Stage 4-7 | pass | 无 |
| 跨表面 | 多视角区响应式与双主题 | 1440/768/390 light/dark | 3 张最终截图 + overflow 0 + 双向主题切换 | Stage 7 | pass | 无 |
| 能力降级 | Canvas 不可用仍能理解各角色 | no-canvas | fallback 可见；六 tab 仍可切换；输入/证据/决策可读 | Stage 8 | pass | 无 |
| 工程交付 | 测试、说明与 Pages 构建 | build | smoke/validator/scan/check/hub/unit/构建 demo 全部通过 | Stage 9 | pass | 无 |

### Revision 3：完整玩家事件闭环

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 完整场景说明 | 玩家坏地图事件与世界 seed | reported/blocked | `web-complete-case-release.png` + 事件卡 + 现场 Canvas | Stage 2-3 | pass | 无 |
| 能力解释 | world/enemy/loot/vfx 命名子流 | generated | 四个稳定身份 DOM + Canvas HUD | Stage 3-6 | pass | 无 |
| 能力演示 | 同 seed 三次重放 | replaying/pass | PASS 3/3 + 三个相同 SHA-256 摘要 | Stage 5-6 | pass | 无 |
| 对我们的意义 | 应用修复但保留怪物/掉落 | release/fixed | `web-complete-case-fixed.png` + route PASS + PRESERVED | Stage 5-6 | pass | 无 |
| 工程使用场景 | 10,000 seed 修复前后普查 | idle/running/result | release 809 / candidate 0 | Stage 5-6 | pass | 无 |
| 艺术效果意义 | 视觉不是固定风格而是系统输出 | readable | 艺术身份/高分辨率/系列一致性三层说明 | Stage 3 | pass | 无 |
| 跨表面 | 完整案例响应式、主题、键盘 | 1440/768/390 light/dark | 6 张案例截图 + overflow 0 + Enter | Stage 7 | pass | 无 |
| 能力降级 | 无 Canvas 仍能完成认知旅程 | no-canvas | 文本、步骤和边界可读；三操作禁用 | Stage 8 | pass | 无 |
| 工程交付 | 测试、文档、Pages 构建 | build | smoke/validator/scan/check/hub/unit/构建 demo 全部通过 | Stage 9 | pass | 无 |

### Revision 2：使用场景图谱

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 按使用场景设计示例 | 游戏地图 | selected/rendered | `web-scenarios-desktop.png` + 3 traits | Stage 3-6 | pass | 无 |
| 按使用场景设计示例 | 装备掉落 | selected/rendered | 装备卡 Canvas + rarity/archetype/affix | Stage 3-6 | pass | 无 |
| 按使用场景设计示例 | 怪物外观 | selected/rendered | 怪物轮廓 Canvas + 3 traits | Stage 3-6 | pass | 无 |
| 按使用场景设计示例 | 品牌视觉 | selected/rendered | 品牌海报 Canvas + 渠道 traits | Stage 3-6 | pass | 无 |
| 按使用场景设计示例 | 数字艺术发行 | selected/rendered | `web-scenarios-dark.png` + edition traits | Stage 3-6 | pass | 无 |
| 按使用场景设计示例 | 系统质检 | selected/rendered | 基线/候选 Canvas + REVIEW 状态 | Stage 3-6 | pass | 无 |
| 从多角度整理 | 场景比较矩阵 | desktop/mobile | 输入、输出、验证、价值、扩展、边界 | Stage 3 | pass | 无 |
| 场景交互 | 场景切换、重放、新 seed | mouse/keyboard | 六 digest 不同；同 seed 重放一致；ArrowRight/End 通过 | Stage 4-6 | pass | 无 |
| 跨表面 | 场景区响应式与主题 | 1440/768/390 light/dark | 3 张最终截图 + overflow 0 | Stage 7 | pass | 无 |
| 能力降级 | 无 Canvas 时仍可理解场景 | no-canvas | 768 fallback 可见、tabs 可切换、渲染控件禁用 | Stage 8 | pass | 无 |
| 工程交付 | 文档、测试、Pages | build | smoke/validator/check/hub/unit 全部通过 | Stage 9 | pass | 无 |

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 以 Web 引导 | 首屏定位与阅读路径 | 1440 light | `web-desktop-light.png` + DOM | Stage 2-3 | pass | 无 |
| 展示能力及效果 | 同 seed 可重放 | deterministic | 3 个相同 SHA-256 摘要 | Stage 5-6 | pass | 无 |
| 展示能力及效果 | 故障模式可观察 | broken | `web-proof-dark.png` + 3 个不同摘要 | Stage 5-6 | pass | 无 |
| 演示能力 | 12-seed 联系表 | populated | 12 个实时 `.edition-card` | Stage 5 | pass | 无 |
| 演示能力 | 5000-seed census | idle/running/result | 3 组 trait 图表，状态含 5,000 | Stage 5-6 | pass | 无 |
| 演示能力 | PNG 下载 | deterministic | 可用下载控件与 Canvas data URL | Stage 5 | pass | 无 |
| 转成直接使用能力 | Codex Skill | 文件 + validator | `Skill is valid!` | Stage 9 | pass | 无 |
| 转成直接使用能力 | 脚手架与检查脚本 | Windows/Node | scaffold smoke + 全部检查通过 | Stage 9 | pass | 无 |
| 跨表面 | 响应式 | 1440/768/390 | 截图 + overflow 0 | Stage 7 | pass | 无 |
| 跨表面 | 双主题 | light/dark | 两张主题截图 + DOM state | Stage 7 | pass | 无 |
| 跨表面 | 键盘与焦点 | keyboard | skip link + Enter 触发真实检查 | Stage 7 | pass | 无 |
| 跨表面 | reduced motion | reduced | media emulation，scroll behavior 为 auto | Stage 7-8 | pass | 无 |
| 跨表面 | Canvas fallback | no-canvas | fallback 可见，渲染控件禁用 | Stage 8 | pass | 无 |
| 工程交付 | 研究门户和 README | build | research_hub check/build | Stage 9 | pass | 无 |
| 工程交付 | 浏览器验收和交接 | 文档 | `web-delivery.md` | Stage 9 | pass | 无 |
