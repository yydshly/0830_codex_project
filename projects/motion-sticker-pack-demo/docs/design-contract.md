# Motion Sticker Pack 能力展示设计契约

## 契约

- Entry mode：Revision-led；把既有“宠物单例 + 抽象能力表”升级为按业务场景阅读的能力图谱。
- Request revision：9。
- Target user and context：希望快速判断 Agent Skill 实际能力、技术组成与采用价值的 AI 创作者、研究者和产品设计者。
- Desired first impression：先直接看到我们的样例按照自身语义在动，并能沿着“项目生成提示词 → 用户驱动外部视频 → 仓库确定性去背与编码”的真实小龙结果理解完整闭环；随后再比较关键姿态、本地仿射降级与生成式视频三条路线的质量差异。
- Visual ambition：Editorial。
- Experience architecture：Editorial Flow。
- Visual constraints：延续 Research Lab 的证据导向，但采用独立的“透明贴纸工作台”视觉；避免套用现有项目页面；首屏必须直接展示输入、生产阶段与交付格式。
- Information constraints：明确区分我们的源图、透明静图、关键姿态语义动画、本地仿射降级、上游真实动画、流程样例、仓库作者主张与尚未执行的生成式视频能力；每个动态结果必须标出路线、关键姿态、帧数、时长、格式和动作边界。不得用 CSS 位移、整图仿射或静态贴图冒充案例级语义动画。
- Operation constraints：无后端、无登录、无新增前端依赖；本项目的用户侧能力止于“依据源图与动作意图生成可复制、可下载的视频提示词包”。网页不选择 Provider、不探测凭证、不生成执行命令，也不提交外部 API；用户自行把源图与提示词带到任意视频平台驱动生成。核心说明在 JavaScript 失效时仍可阅读。
- State constraints：场景图谱、动画证据、样例场景、流程阶段切换、能力筛选和边界提示必须具备清晰状态；支持鼠标、键盘、无 JavaScript 阅读和 `prefers-reduced-motion`。减少动态时以静态首帧替代新增动画，不隐藏解释信息。
- Environment constraints：原生 HTML/CSS/JavaScript；可由 `python -m http.server` 启动；可被 Research Hub 构建脚本复制到 Pages。
- Primary journey：进入页面 → 在六类场景中理解当前结果 → 在“视频提示词工作台”整理并复制提示词 → 用户自行前往视频平台驱动生成 → 把返回 MP4 交回项目 → 页面并排展示用户原始视频与仓库去背后的透明 WebP，并给出媒体参数、质检、警告和下载。
- User-defined phases：用网页整理库能力；用样例描述每类能力；选择适合我们的样例做真实演示；展示不止上游项目已有的效果；按更多业务场景补全样例并说明可扩展方向；明确“我的能力是生成提示词，由用户去驱动生成视频”。
- Required artifacts：保留现有能力图、语义关键姿态与降级证据；保留可复现的毛毡小龙提示词样例；接收用户提供的 MP4，记录原始媒体参数，生成 8fps 处理源与透明 WebP / GIF / PNG / ZIP / processing.json；网页在提示词工作台后新增真实回传结果区，清楚区分“用户在外部生成”和“仓库后处理”，并提供原始 MP4 与透明交付下载。
- Autonomy authorization：用户已明确授权新建子项目、获取仓库并实现首期能力展示；范围内可逆实现无需再次确认。
- User-decision boundary：用户选择外部视频平台、登录 / 付费、上传源图、粘贴提示词、调整平台参数并点击生成。项目不接触这些步骤，也不需要知道用户使用哪个 Provider。
- Observable completion criteria：保留修订 8 的提示词能力边界；新增结果区播放用户提供的 768×768、6.58 秒、24fps MP4，并播放仓库输出的 240×240、8fps、6.625 秒透明 WebP；真实交付含 GIF、PNG、ZIP 和 processing.json；页面如实显示 53 帧通过背景 / Alpha / 编码检查、GIF 预算通过和 `residual-hold-jitter` 警告；桌面、平板、390px 手机、无 JavaScript、reduced-motion 和媒体失败回退可读；自动检查、Pages 构建和浏览器终审通过。

## 视觉方向

| 层 | 选择 | 可验证结果 |
| --- | --- | --- |
| Composition | 首屏生产控制台 + 样例实验台 + 分层证据流 | 首屏定位后立即以样例回答“能做什么” |
| Focal hierarchy | “不是模型，是生产管线”为主结论；真实样例是第二焦点 | 主标题之后先看案例，再看抽象能力表 |
| Typography | 大号中文结论、窄体技术标签、等宽数据 | 技术信息与解释文本角色清晰 |
| Palette | 深墨色、透明棋盘格、荧光黄绿与柔和珊瑚 | 透明、运行中、风险三类语义不混淆 |
| Material | 半透明面板、细描边、无重阴影堆叠 | 模块边界清楚且保持研究页克制感 |
| Motion | 真实 Animated WebP 用于展示本地循环能力，界面动效只辅助状态反馈 | reduced-motion 下改选静态透明源，解释信息与下载入口保持可用 |

## 覆盖清单

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 负责阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 新建子项目 | 独立项目结构和元数据 | 文件系统 | `project.json`、README、docs、demo、web | Stage 0/9 | pass | 已完成 |
| 获取上游库 | 固定 main 提交源码快照 | `upstream/` | 提交 `6531b37`、498 文件、无 `.git` | Stage 1 | pass | 已完成 |
| 梳理能力 | 能力、原理、输入输出、边界有证据 | README / Web | Skill、脚本、Schema、测试与审计交叉检查 | Stage 3 | pass | 已完成 |
| 展示能力 | 首屏定位和阶段浏览 | Desktop 1440px | Chromium 截图、DOM 与资源检查 | Stage 2/5 | pass | 已完成 |
| 展示能力 | 响应式阅读路径 | Tablet 768px / Mobile 390px | 浏览器截图、尺寸与溢出检查 | Stage 7 | pass | 已完成 |
| 展示能力 | 流程阶段切换 | 鼠标 / 键盘 | click、ArrowRight 与 aria 状态 | Stage 4/5/7 | pass | 已完成 |
| 展示能力 | 无 JS / reduced-motion 回退 | 能力回退状态 | 网络拦截外部脚本；浏览器媒体模拟 | Stage 6/8 | pass | 已完成 |
| 项目接入 | 根 README 与 Pages 门户 | 构建产物 | sync、check、5 项基础设施测试、Pages build | Stage 9 | pass | 已完成 |
| 交接 | 复现和验收记录 | 文档 | `browser-validation.md` 与最小运行命令 | Stage 9 | pass | 已完成 |
| 用网页整理能力 | 样例成为首屏后的第一主段 | Desktop / Tablet / Mobile | 修订前后浏览器截图与阅读顺序 | Stage 2/3/7 | pass | 已完成 |
| 用样例描述能力 | 五类输入场景可切换 | 鼠标 / 键盘 / 无 JS | 交互、ARIA、脚本拦截证据 | Stage 4/5/8 | pass | 已完成 |
| 用样例描述能力 | 同一贴纸三种格式对照 | WebP / GIF / PNG | 媒体加载、标签和尺寸证据 | Stage 3/8 | pass | 已完成 |
| 用样例描述能力 | 真实输出与流程示例不混淆 | 标签 / 文案 / 来源链接 | DOM 与视觉检查 | Stage 3/6 | pass | 已完成 |
| 修订交付 | 文档、验证、Pages 构建更新 | 工程与交付 | verify、tests、build、browser | Stage 9 | pass | 已完成 |
| 选择我们的样例 | 工作区样例许可清楚且适合验证贴纸能力 | 源图 / 来源记录 | 原图检查、许可、尺寸与选择理由 | Stage 0/1 | pass | 已完成 |
| 用我们的样例演示 | 原图到贴纸结果的对比路径 | Desktop / Tablet / Mobile | 浏览器截图、DOM 与资源加载 | Stage 2/3/7 | pass | 已完成 |
| 不止上游效果 | 至少三种视觉结果并区分能力归属 | 贴纸资产 / 标签 | 生成文件、提示记录、视觉与文案检查 | Stage 3/6 | pass | 已完成 |
| 保留原有能力地图 | 五场景、格式、阶段与能力仍可用 | 鼠标 / 键盘 / 无 JS | 交互、ARIA、脚本拦截证据 | Stage 4/5/8 | pass | 已完成 |
| 修订 3 交付 | 文档、验证、Pages 构建再次更新 | 工程与交付 | verify、tests、build、browser | Stage 9 | pass | 已完成 |
| 场景化重构 | 六类业务场景替代“只有宠物效果”的主阅读路径 | Desktop / Tablet / Mobile | 6 Tab / 6 面板；1440 / 768 / 390px Chromium 检查无溢出 | Stage 2/3/7 | pass | 六场景鼠标与方向键切换通过 |
| 更多主体样例 | 至少三类不同主体有代表性输入或输出 | 角色 / 商品 / 知识内容 | 宠物、小龙、耳机有真实透明输出；毛毡故事与汉字海报有来源记录 | Stage 1/3/8 | pass | 两份新增 PNG、WebP、Prompt 与散列已固定 |
| 场景解释完整 | 每类都含目标、输入、路线、交付物、证据与边界 | 场景详情状态 | 六面板 DOM、视觉检查、逐图加载与无 JS 6 面板展开 | Stage 3/5/8 | pass | 证据等级与能力边界分开标注 |
| 可扩展方向 | 当前缺口、模块、价值和验证指标可对照 | 近期 / 工程 / 产品层 | 6 卡在桌面三列、平板两列、手机单列；文案边界审计 | Stage 3/6/7 | pass | 六项扩展均给出可验证完成标准 |
| 修订 4 交付 | 文档、验证、Pages 构建再次更新 | 工程与交付 | verify、tests、build、browser | Stage 9 | pass | 离线验证、根测试、Pages 构建和浏览器终审通过 |
| 动画能力纠偏 | 页面不能只用我们的样例证明透明贴图提取 | 场景图谱 / 动态结果 | 小龙 / 耳机 / 小狗浏览器像素差分别为 35,613 / 16,479 / 86,201 | Stage 1/2/3 | pass | 三份真实媒体均推进帧 |
| 非宠物动态样例 | 小龙和耳机均交付 Animated WebP / GIF / 静态首帧 | 媒体文件 / 页面 | 两组均为 12 帧、8fps、1.5 秒；Alpha、字节数与 SHA-256 固定 | Stage 3/5/8 | pass | WebP / GIF / PNG / ZIP 已交付 |
| 动画真值边界 | 本地仿射循环与生成式视频不混淆 | 标签 / 文案 / 能力地图 | 页面逐样例标出整图动作和未合成的语义动作；JSON 记录上游路线 | Stage 3/6 | pass | 无生成式视频完成声明 |
| 动态降级 | reduced-motion 使用静态图；无 JS 仍能播放或显示回退 | Normal / Reduce / No-JS | Reduce 下三图 `currentSrc` 均改为静态源且像素差为 0；No-JS 展开 6 / 4 面板 | Stage 7/8 | pass | `<picture>` 与可见状态标签通过 |
| 修订 5 交付 | 文档、验证、Pages 构建再次更新 | 工程与交付 | verify、tests、build、browser | Stage 9 | pass | 离线媒体检查、回归测试、构建与浏览器终审通过 |
| 语义动作纠偏 | 当前整图 bounce / sway / pulse 不能冒充案例级动作 | 品牌 / 商品 / 宠物动态结果 | 基线截图、媒体帧检查、路线对照 | Stage 1/3/6 | pass | 三个主结果均已改为 `keypose-local`，旧仿射媒体仅保留为兜底证据 |
| 三类关键姿态 | 小龙庆祝、耳机声波、小狗眨眼抬爪均有可核验姿态 | 透明关键姿态资产 | 图像检查、Alpha、身份 / 产品结构锚点 | Stage 3/6/8 | pass | 三组各 3 个透明关键姿态；眼睛、肢体、声波和指示灯均有真实变化 |
| 语义媒体交付 | 三类语义动作均编码 WebP / GIF / PNG 与审计 JSON | 动画文件 / 页面 | 帧数、时长、散列、浏览器帧推进 | Stage 3/5/8 | pass | WebP 4 媒体帧、GIF 12 时间线帧、2 秒循环及 ZIP / JSON 均已交付 |
| 路线真值层级 | keypose-local、transform-local、Provider 能力不混淆 | 标签 / 文案 / 能力地图 | DOM、页面截图、文案审计 | Stage 3/6 | pass | 页面逐例说明关键姿态阶梯切换、仿射兜底与 Provider 连续视频的差异 |
| 修订 6 跨表面 | Normal / Reduce / No-JS / 1440 / 768 / 390 / Keyboard | 页面状态 | Chromium 媒体源、像素差、截图与交互 | Stage 7/8 | pass | 三视口无溢出；键盘同步；Reduce 静态；No-JS 展开 6 / 4 面板 |
| 修订 6 交付 | 文档、验证、Pages 构建更新 | 工程与交付 | verify、tests、build、browser | Stage 9 | pass | 离线媒体审计、根测试、Pages 子路径与浏览器终审通过 |
| 提示词能力纠偏 | 用户侧能力从 Provider 执行改为提示词生成 | 文案 / 状态 / 数据合同 | 基线 DOM、代码与提示词包审计 | Stage 0/3/6 | pass | Provider、凭证、命令和提交入口均已移除 |
| 提示词工作台 | 样例、动作、时长、幅度与回环生成正向 / 负向提示词 | Desktop / Tablet / Mobile / Keyboard | 浏览器交互、复制与下载 JSON | Stage 4/5/7 | pass | 三视口联动、剪贴板和实际下载内容一致 |
| 用户手动交接 | 明确上传源图、粘贴提示词、设置参数、点击生成均由用户完成 | Normal / No-JS | 页面四步说明与无外部请求记录 | Stage 6/8 | pass | 四步交接与默认提示词在无脚本状态仍可读，外部请求为 0 |
| 修订 8 交付 | README、能力地图、验证记录与 Pages 构建同步 | 工程与交付 | verify、tests、build、browser | Stage 9 | pass | 离线验证、8 项根测试、Pages 构建和本地 Chromium 终审通过 |
| 用户生成视频回传 | 固定用户提供的 MP4、来源路径和媒体参数 | 原始视频 / 审计记录 | FFprobe、SHA-256、联系表 | Stage 0/1/6 | pass | 768×768、24fps、158 帧、6.583333 秒媒体与 SHA-256 已固定 |
| 视频后处理实跑 | 绿幕去背并交付透明 WebP / GIF / PNG / ZIP | 6.625 秒完整版本 / 3 秒派生版本 | processing.json、Alpha、帧数、预算和警告 | Stage 5/6/8 | pass | 53 帧通过；GIF 771,943 bytes；保留 `residual-hold-jitter` 警告 |
| 真实结果展示 | 原始 MP4 与透明 WebP 并排解释能力归属 | Desktop / Tablet / Mobile / No-JS / Reduce | 浏览器媒体、截图、DOM、回退和下载 | Stage 2/3/7/8 | pass | 四状态 Chromium 终审通过，三步归属与五项下载完整 |
| 修订 9 交付 | README、能力地图、验证记录与 Pages 构建同步 | 工程与交付 | verify、tests、build、browser | Stage 9 | pass | 离线审计、浏览器终审、Pages 构建与根测试通过 |
