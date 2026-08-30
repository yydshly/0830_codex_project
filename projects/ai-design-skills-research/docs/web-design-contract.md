# Web 演示设计契约

## Design contract

```text
Entry mode: Revision-led，研究子项目从文档扩展为可操作演示
Request revision: 2
Target user and context: 想快速判断 ai-design-skills 到底能做什么、是否值得采用或改造的 AI 编程使用者
Desired first impression: 像一间可信的设计规则观察台，而不是另一张宣传型落地页
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 单一主焦点；纸张与墨色为基底；蓝色表示规则介入，橙红表示风险；不用大型图片、连续动画或装饰性渐变
Information constraints: 仓库事实、演示样例和分析判断明确分层；不伪造转化数字、客户证言或使用数据
Operation constraints: 静态前端；鼠标、触摸和键盘可操作；不依赖后端和外部接口
State constraints: 视角切换、前后对照、状态模拟、场景选择、扩展路线、亮暗主题均需有明确选中与反馈
Environment constraints: 原生 HTML/CSS/JS；可用 Python 静态服务器运行；支持现代桌面与移动浏览器
Primary journey: 打开页面 → 理解“规则而非组件库” → 选择能力视角 → 操作一个样例 → 查看场景适配 → 查看扩展路线
User-defined phases: 能力样例；使用场景；可扩展方向；多角度演示
Required artifacts: web/index.html、研究观察台资源、web/showcase.html、特色场景资源、设计契约、浏览器验收记录、README 运行说明
Autonomy authorization: 用户已明确要求演示该库能力，可直接实现可逆的本地前端与验证材料
User-decision boundary: 不安装为全局 Skill，不调用真实业务接口，不发布到外部平台
Observable completion criteria: 研究观察台继续满足原验收；新增实际 SaaS 场景页，演示浮动岛式导航、汉堡到 X、全屏玻璃菜单、逐词滚动点亮和可操作审核状态；桌面/平板/390px、键盘、菜单焦点、reduced-motion 可用；浏览器无错误
```

## 设计方向

| 决策 | 选择 | 为什么 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- | --- |
| 信息层级 | 一个核心结论，之后进入能力实验 | 先解除“是不是特效库”的误解 | 首屏只保留一个主标题和一个主要入口 | 第一次扫描能读出“规则指导 AI 实现网页” |
| 视觉语言 | 编辑型实验记录 | 与研究项目身份一致 | 编号、注释、边线和大字号形成节奏 | 页面不像模板化 SaaS 官网 |
| 样例结构 | 同一虚构产品 Brief 的无 Skill / 有 Skill 对照 | 控制变量，便于理解规则影响 | 两侧内容使用同一个产品背景 | 对照差异可以被文字解释 |
| 交互 | 视角、状态、场景和扩展层级切换 | 让知识从长文变成可操作证据 | 所有切换有 aria 状态与可见焦点 | 鼠标、触摸和键盘均能完成主旅程 |
| 主题 | 亮色默认，支持深色 | 检查语义色与层级适应性 | 两个主题使用相同信息结构 | 切换前后文本、边框和状态清晰 |
| 动效 | 只解释状态变化 | 避免复刻上游的强制入场动效 | reduced-motion 下取消位移和过渡 | 关闭动效不丢内容和反馈 |

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 所需证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 能力样例 | 明确库的本质 | 首屏，亮色桌面 | 截图与 DOM 文本 | 2 | pass | `desktop-light.png` 与正文检查通过 |
| 能力样例 | 至少五个视角 | 能力实验台 | 浏览器点击与状态观察 | 5 | pass | 已实现六视角并验证键盘切换 |
| 能力样例 | 同 Brief 对照 | 无 Skill / 有 Skill | 截图与切换结果 | 5 | pass | 文案、结构、视觉三类对照通过 |
| 能力样例 | 交互状态演示 | loading/empty/error/success | 浏览器状态观察 | 6 | pass | 四状态可切换，错误状态含恢复动作 |
| 使用场景 | 多场景适配判断 | 场景选择器 | 点击结果与文本 | 5 | pass | 六场景适配与边界均可操作 |
| 可扩展方向 | 分层路线 | 扩展工作台 | 点击结果与结构检查 | 5 | pass | 四层扩展路径可切换 |
| 多角度演示 | 原理与边界 | 流程图、风险提示 | DOM 与截图 | 3 | pass | 工作链、事实和边界均可见 |
| 跨表面 | 主题 | 亮色/深色 | 双主题截图 | 7 | pass | 亮暗双主题浏览器截图通过 |
| 跨表面 | 响应式 | 1440/768/390 | 三种截图 | 7 | pass | 三视口无横向溢出 |
| 跨表面 | 键盘与焦点 | 主旅程 | Tab/方向键观察 | 7 | pass | Tablist 方向键与可见焦点通过 |
| 跨表面 | reduced-motion | 系统偏好 | CSS/浏览器观察 | 8 | pass | Chromium 返回动画时长 `1e-05s` |
| 交付 | 文档与运行说明 | README、验收记录 | 文件与命令输出 | 9 | pass | 运行说明、测试脚本和证据齐全 |

## Revision 2：特色实际场景

用户要求不再只解释基础能力，而是用最有辨识度的效果演示一个真实场景。保留原能力观察台不变，新增独立的“上线哨兵”发布审核 SaaS 场景页。

| 用户要求 | 要求或产物 | 表面 / 状态 | 所需证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 最有特色的效果 | 浮动岛式导航和汉堡变 X | 桌面/手机，打开/关闭 | 截图、aria、Escape 与焦点返回 | 4–7 | pass | `showcase-menu.png`；打开、焦点进入、Escape 关闭及焦点返回通过 |
| 最有特色的效果 | 全屏玻璃菜单和链接错峰进入 | 菜单打开态 | 截图与 computed style | 5–8 | pass | 前景覆盖层、链接进入和 reduced-motion 回退通过 |
| 最有特色的效果 | 逐词滚动点亮标语 | 正常/减少动态 | 滚动状态和截图 | 5–8 | pass | `showcase-tagline.png`；中段 7/12 词点亮，减少动态时 12/12 可见 |
| 实际场景效果 | 上线哨兵完整营销页 | Hero、收益、流程、FAQ、最终 CTA | DOM 与全页截图 | 2–7 | pass | `showcase-hero.png`、`showcase-desktop.png`；完整页面结构可见 |
| 实际场景效果 | 可运行审核样例 | 初始/分析/结果 | 点击、aria-live、结果文本 | 5–6 | pass | `showcase-review-result.png`；分析态与可恢复结果通过 |
| 邻接入口 | 从研究观察台进入场景页 | 首页 CTA | 点击与 URL | 5 | pass | 首页入口点击后到达 `/showcase.html` |
| 跨表面 | 响应式和键盘 | 1440/768/390 | 三视口、无溢出、键盘路径 | 7 | pass | 三视口无横向溢出，菜单键盘路径通过 |
| 交付 | 场景验收与证据 | 文档、测试、截图 | 文件与命令输出 | 9 | pass | 36 项 Chromium 检查、测试脚本与六张场景截图齐全 |

## Repair 3：场景演示入口发现性

```text
Entry mode: Repair-led
User goal: 在研究首页清楚看到并进入场景演示
Observed baseline: 桌面端入口混在普通 Hero 操作中；390px 下顶部导航整体隐藏，用户无法把现有文案识别为“场景演示”入口
Preserved behavior: 现有研究信息架构、主题切换、能力实验和场景页路径保持不变
Minimal intervention: 增加始终可见的高对比度 Header 入口，并把 Hero 主按钮明确命名为“进入场景演示：上线哨兵”
Affected surfaces: 桌面/平板/390px，亮色/深色，键盘焦点
Observable completion: Header 入口在桌面与 390px 首屏可见；标签明确包含“场景演示”；Hero 主按钮高对比；两处入口均到达 showcase.html；无横向溢出
Autonomy authorization: 用户报告已部署页面缺少关联入口，可直接实施局部可逆修复
```

| 覆盖项 | 表面 / 状态 | 所需证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- |
| 持久场景入口 | 1440/768/390，亮暗主题 | 可见性、标签、截图 | 2–7 | pass | `entry-desktop.png`、`entry-mobile.png`；滚动后仍可见 |
| 主旅程 | 鼠标与键盘 | 点击 URL、Tab 焦点 | 4–7 | pass | Header/Hero 入口明确，键盘焦点与 showcase 跳转通过 |
| 邻接回归 | Header、Hero、主题按钮 | 无溢出、无遮挡、主题切换 | 7 | pass | 能力观察台 36/36、场景页 36/36 通过 |
| 交付 | GitHub Pages | Actions 与线上 DOM | 9 | continue | 提交、部署并验证线上入口 |
