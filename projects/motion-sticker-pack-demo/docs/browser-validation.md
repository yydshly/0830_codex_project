# 浏览器验收记录

## 运行环境

- 时间：2026-08-30，Asia/Shanghai
- 页面：`http://127.0.0.1:48173/web/`
- 启动命令：`python -m http.server 48173 --bind 127.0.0.1 --directory .`
- 修订 4 实测页面：`http://127.0.0.1:8034/`（从 `web/` 作为根目录启动）
- 修订 5 实测页面：`http://127.0.0.1:8037/index.html`（从 `web/` 作为根目录启动）
- 修订 6 实测页面：`http://127.0.0.1:8040/index.html`（从 `web/` 作为根目录启动）
- 修订 7 实测页面：`http://127.0.0.1:8042/index.html`（从 `web/` 作为根目录启动）
- 修订 8 实测页面：`http://127.0.0.1:8042/index.html`（从 `web/` 作为根目录启动）
- 修订 9 实测页面：`http://127.0.0.1:8046/index.html#video-driver`（从 `web/` 作为根目录启动）
- 浏览器：Chromium；修订 1–3 由 `agent-browser 0.27.0` 驱动，修订 4 因 CLI 未进入 PATH，改用工作区已安装 Playwright 直接驱动同类 Chromium
- 支持主题：深色主题；本阶段没有声明浅色主题
- 页面架构：原生 HTML / CSS / JavaScript，无构建步骤、后端或远程数据依赖

## 验收结果

| 表面 / 状态 | 证据 | 结果 |
| --- | --- | --- |
| 修订 9 原始视频 | Chromium 在 1440 / 768 / 390px 均读取 768×768、6.583333 秒 MP4，`readyState=4`；绿色原始帧作为 poster，视频保留原 AAC 音轨并默认静音 | 通过 |
| 修订 9 透明动画 | Normal 下 `currentSrc` 命中 240×240、53 帧 Animated WebP；Reduce + No-JS 下改选 240×240 透明首帧 PNG | 通过 |
| 修订 9 能力归属 | 结果区固定展示“项目提示词 → 用户外部生成 → 项目去背交付”三步，原始 MP4、WebP、GIF、ZIP、质检 JSON 共 5 个下载入口均存在 | 通过 |
| 修订 9 质检真值 | 页面显示 53 帧、6.625 秒、772KB / 1MiB PASS、实测键色 `#6FF280`，并保留 `residual-hold-jitter` 警告 | 通过 |
| 修订 9 响应式与回退 | 1440 / 768 / 390px 的 `scrollWidth` 均等于视口；390px No-JS + Reduce 保留原视频、静态透明结果、三步归属、警告和 5 个下载 | 通过 |
| 修订 9 控制台与资源 | 仅加载本次结果区资产的四状态终审无 console / page / HTTP 错误；浏览器按 `preload=metadata` 取消 MP4 剩余字节属于预期行为 | 通过 |
| 修订 8 能力边界 | 标题明确为“我生成提示词，你去生成视频”；DOM 中没有 Provider 选择、执行命令或提交按钮，存在动作编辑、正向提示词、负向约束、复制、JSON 下载与源图下载 | 通过 |
| 修订 8 提示词联动 | 切换到小狗后输入“眨眼、左前爪挥手两次、回到端坐”，选择 4 秒 / medium / 自由结束；正向提示词同步包含身份、动作、时长、幅度、镜头与尾帧要求，负向提示词同步加入肢体和漂移约束 | 通过 |
| 修订 8 复制与下载 | Chromium 剪贴板得到正向、负向和建议参数的完整文本；实际下载 JSON 为 `prompt-generation-only`，且样例、动作、4 秒、medium、free-ending 与界面完全一致 | 通过 |
| 修订 8 用户手动交接 | 页面固定展示“源图 → 提示词 → 自选平台上传粘贴 → 用户点击生成和评审”四步；三个视口的网络记录均为零外部请求 | 通过 |
| 修订 8 响应式 | 1440 / 768 / 390px 的 `scrollWidth` 分别等于视口宽度；工作台保持三列、两列 + 全宽输出、单列三种布局 | 通过 |
| 修订 8 无 JavaScript | 390px + Reduce + 禁用 JavaScript 时，默认动作、正向 / 负向提示词、四步交接与能力停止点仍可读；复制和动态下载保持禁用，页面无横向溢出 | 通过 |
| 修订 8 控制台与资源 | 三视口无 console / page / request / HTTP 错误；源图、参数控件、复制和下载均可操作，工作台锚点固定在顶栏下 72px | 通过 |
| 修订 7 默认视频任务 | 三个视口首次进入均选中毛毡小龙、Grok Build、6 秒、小幅、返回首帧；任务预览为 `image-to-video`、`allow_fallback=false`、`max_retries=0`、`external_request_made=false` | 通过 |
| 修订 7 用户参数驱动 | 切换 xAI Videos 后时长自动变为 3 秒；动作幅度和循环选项同步进入预览 JSON，安全命令不包含 `--execute` 或外部确认参数 | 通过 |
| 修订 7 样例与键盘 | 小龙按钮按 ArrowRight 进入小狗，End 进入耳机；焦点、选中态、源图、准备状态和任务 JSON 同步 | 通过 |
| 修订 7 JSON 导出 | Chromium 实际下载的 `dragon-image-to-video-task.json` 与当前 xAI / 3 秒 / medium / no-loop 表单完全一致；状态更新为 `EXPORTED · NOT SUBMITTED` | 通过 |
| 修订 7 外部调用边界 | 1440 / 768 / 390px 全程外部请求列表为空；生成按钮保持禁用；页面明确当前没有 Provider、没有上传、没有费用、没有 MP4 | 通过 |
| 修订 7 响应式 | 1440 / 768 / 390px 的 `scrollWidth` 分别等于视口宽度；三列驾驶舱在平板转为两列 + 全宽预览，在手机转为单列 | 通过 |
| 修订 7 无 JavaScript | 390px + Reduce + 禁用 JavaScript 时驾驶舱与 10 个表单 / 按钮元素仍可读，下载和生成保持禁用，停止说明可见且无横向溢出 | 通过 |
| 修订 7 控制台与资源 | 三视口无错误覆盖层、console / page / request / HTTP 错误；三张可切换源图正常加载 | 通过 |
| 修订 7 Pages 构建产物 | `.tmp/motion-sticker-video-driver-site` 成功生成，并从 Pages 子路径重复检查驾驶舱、JSON 下载、390px 和零外部请求 | 通过 |
| 修订 6 语义关键姿态 | Chromium 的 `currentSrc` 分别命中 `dragon-celebration-keypose.webp`、`earbuds-translation-keypose.webp`、`dog-greeting-keypose.webp`；Pages 构建产物四次截图相对首帧最大像素差为 68,165 / 42,112 / 53,400 | 通过，眼睛、肢体、声波和指示灯均真实换姿态 |
| 修订 6 媒体交付 | 三样例各有 3 个透明关键姿态、2 秒循环；WebP 为 4 个带时长媒体帧，GIF 保留 12 个 6fps 时间线帧，并附 PNG / ZIP / JSON / SHA-256 | 通过 |
| 修订 6 路线真值 | 页面 4 个动态位置均标为 `keypose-local`；主 HTML 不再引用旧 `bounce` / `sway` / `pulse`，并明确阶梯切换没有光流插帧 | 通过 |
| 修订 6 Reduced motion | 390px 下三主体 `currentSrc` 均切换到语义首帧 PNG；相隔 700ms 的截图完全一致，静态标签显示、动画标签隐藏 | 通过 |
| 修订 6 无 JavaScript | JavaScript 禁用且 Reduce 开启时，6 个场景面板与 4 个小狗效果面板全部展开；4 个语义媒体位置均使用 PNG，`scrollWidth = innerWidth = 390` | 通过 |
| 修订 6 响应式与键盘 | 1440 / 768 / 390px 的 `scrollWidth` 与视口相等；场景 ArrowRight 和小狗效果 End 均同步焦点、选中态与面板 | 通过 |
| 修订 6 控制台与资源 | 强制加载全部延迟图片后无破图；4 个语义媒体实例均为 420 × 420；无 console / page / request / HTTP 错误 | 通过 |
| 修订 6 全量媒体观察 | 强制加载全页延迟媒体时传输约 5.99 MB，其中三份语义 WebP 解码体积合计约 1.13 MB | 通过；审计 PNG、GIF 与 ZIP 不进入页面默认媒体请求 |
| 修订 6 Pages 构建产物 | `.tmp/motion-sticker-keypose-site` 成功生成，并从 Pages 子路径完成 390px 媒体、无溢出与零请求错误检查 | 通过 |
| 修订 5 真实动画媒体 | Chromium 的 `currentSrc` 分别命中 `felt-dragon-bounce.webp`、`earbuds-sway.webp`、`dog-core-pulse.webp`；三者均 12 帧，截图序列像素差分别为 35,613 / 16,479 / 86,201 | 通过，不是静态贴图或 CSS 位移 |
| 修订 5 媒体交付 | 三样例均有 Animated WebP、循环 GIF、首帧 PNG；同时保留 ZIP、处理 JSON、逐文件 SHA-256、时长和 Alpha 记录 | 通过 |
| 修订 5 动画边界 | 页面逐样例说明 `bounce` / `sway` / `pulse` 只对整张贴纸做确定性仿射变化，不声称合成眨眼、嘴型、声波流动或新肢体姿势 | 通过 |
| 修订 5 Reduced motion | `prefers-reduced-motion: reduce` 下，小龙 / 耳机 / 小狗 `currentSrc` 分别改为三个静态 WebP；小龙两组截图像素差为 0，状态显示 `STATIC FALLBACK` | 通过 |
| 修订 5 无 JavaScript | 禁用 JavaScript并模拟 reduced motion 后，6 个场景面板和 4 个小狗效果面板全部展开，动画位置选择静态源；390px `scrollWidth = innerWidth = 390` | 通过 |
| 修订 5 响应式与键盘 | 1440 / 768 / 390px 的 `scrollWidth` 与视口相等；场景 ArrowRight 与小狗效果 End 键均同步焦点、选中态和面板 | 通过 |
| 修订 5 控制台与资源 | 3 个 Animated WebP 均 `complete=true`、自然宽度 420；无 console / page / request error | 通过 |
| 修订 5 Pages 构建产物 | `.tmp/motion-sticker-animations-site` 成功生成；从 Pages 子路径打开后，390px 下三份动画均加载为 420px 宽且无错误或横向溢出 | 通过 |
| 六类场景能力图谱 | 品牌、个人、儿童、商品、教育、迁移 6 个 Tab 与 6 个面板均存在；每类都包含输入、路线、交付、验收和边界 | 通过 |
| 非宠物真实输出 | 毛毡小龙与翻译耳机两份透明 WebP 预览加载；原始 PNG 为 RGBA 且含透明像素 | 通过 |
| 场景交互 | 鼠标切到“商品营销”；聚焦后 ArrowRight 进入“教育知识”，焦点、`aria-selected`、可见面板与 `aria-live` 同步 | 通过 |
| 六项扩展路线 | 平台包、动作 DSL、时序 Alpha、自动 QC、品牌治理、成本路由均显示当前缺口、扩展模块、验证指标和价值场景 | 通过 |
| 修订 4 响应式 | 1440 / 768 / 390px 的 `scrollWidth` 分别等于 1440 / 768 / 390；场景面板、扩展卡片和原有内容无横向溢出 | 通过 |
| 修订 4 图片资源 | 逐一切换六个场景后，11 个场景图片实例全部 `complete=true` 且 `naturalWidth > 0`；无 4xx/5xx 响应 | 通过 |
| 修订 4 无 JavaScript | 禁用 JavaScript 后，6 个场景、3 个宠物效果、5 个输入样例和 6 个生产阶段全部展开可读；390px 无溢出 | 通过 |
| 修订 4 Reduced motion | `matchMedia` 为真，根滚动行为为 `auto`，场景 Tab 过渡为 `0.01ms` | 通过 |
| 修订 4 性能观察 | 新增小龙源图 / 输出约 339 KB；两份原始 RGBA PNG 共约 3.35 MB 不被网页引用；当前初始传输约 3.38 MB，三张上游 Animated WebP 仍是主要成本 | 通过 |
| Pages 构建产物 | `.tmp/motion-sticker-scenes-site` 成功生成；从 `http://127.0.0.1:8035/demos/motion-sticker-pack-demo/` 打开后 6 场景、6 扩展、商品面板和两张商品图片正常，无错误响应 | 通过 |
| 1440 × 1000 首屏与完整页面 | 页面标题、首屏主结论、三张 Animated WebP、六阶段、十能力、路由与边界全部渲染 | 通过 |
| 768 × 1000 平板 | 首屏改为单列；指标、贴纸控制台和三列阶段按钮无裁切 | 通过 |
| 390 × 844 手机 | 标题、双按钮、两列指标、两列阶段按钮和单列面板无横向溢出 | 通过 |
| 我们的源图与三种效果 | CC0 原图预览、身份贴纸、动势轨迹和睡眠氛围均加载；结果为 1254 × 1254 透明 WebP 预览，审计 PNG 保留在项目中 | 通过 |
| 专属样例交互 | 鼠标切到“动势轨迹”；键盘聚焦该 Tab 后按 ArrowRight 进入“睡眠氛围”，焦点、选中态、面板和 `aria-live` 同步 | 通过 |
| 专属样例响应式 | 1440px 原图/结果/说明并列；768px 原图双列、结果并列；390px 三入口横排、结果与说明单列，三者均无横向溢出 | 通过 |
| 图片资源 | 当前可见源图和效果预览均 `complete=true` 且 `naturalWidth > 0` | 通过 |
| 五类能力样例 | 角色参考图、静态图板、整板视频、独立贴纸、完全本地五类入口均可切换；每类都给出输入、步骤、交付物与边界 | 通过 |
| 样例键盘操作 | 聚焦“整板视频再切成单格”后按 ArrowDown，进入“独立贴纸批处理”，焦点、选中态与可见面板同步 | 通过 |
| 格式对照 | 固定上游同一格 `01` 的 WebP、GIF、PNG 均加载为 181 × 181；页面标明 814,608 / 565,218 / 38,859 bytes | 通过 |
| 阶段交互 | 点击切换到“质检交付”；键盘聚焦“能力路由”后按 ArrowRight 进入“媒体加工” | 通过 |
| 能力筛选 | 点击“媒体处理”后仅显示 2 张卡片，`aria-live` 同步反馈 | 通过 |
| 键盘和焦点 | Tab 控件使用原生按钮语义；阶段 Tablist 支持左右方向键、Home、End；全局存在 `:focus-visible` | 通过 |
| Reduced motion | 浏览器模拟 `prefers-reduced-motion: reduce`，按钮过渡降为 `0.01ms`，内容仍完整 | 通过 |
| 外部脚本缺失 | 新会话拦截 `app.js?v=20260830c` 后，HTML 不设置 `has-js`，3 个专属效果、5 个样例、6 个阶段和 10 个能力全部展开可读 | 通过 |
| 控制台与页面错误 | 无 console error；无 Next/Vite/Webpack 错误覆盖层 | 通过 |
| 性能观察 | 首版专属样例使初始资源达到约 5.37 MB；改用 WebP/缩略源图后为 2.95 MB，本地 `load` 117ms。新增专属首屏贡献约 531 KB，两张扩展效果延迟加载 | 通过，现有三张上游 Animated WebP 仍占约 2.33 MB |

## 浏览器精炼记录

### 从提示词交接升级为真实回传闭环

- Current stage：Stage 5 / 6 / 8 / 9，媒体处理、真值校准、回退与交付。
- User phase：用户已取得动画并将本地 MP4 交回项目。
- Coverage item：固定原始媒体证据，执行仓库绿幕去背与编码，并在网页上并排说明原视频、透明交付和三段能力归属。
- Observed evidence：原视频为 768×768、24fps、158 帧、6.583333 秒 H.264 + AAC；生成背景从要求的 `#00FF00` 漂移为实测 `#6FF280`。
- Root cause：修订 8 只证明项目可以生成提示词并交给用户，没有验证用户回传结果能否进入仓库后处理链。
- Minimal intervention：先确定性采样到最终 8fps，再调用固定上游 `process_emoji_grid.py` 逐帧去背；网页新增原始 MP4 / 透明 WebP 对照、三步归属、媒体参数、质检警告和五项下载。
- Adjacent regression surfaces：提示词工作台边界、1440 / 768 / 390px、No-JS、Reduced Motion、媒体元数据、下载与 Pages 子路径。
- Observed result：53 帧全部通过背景、Alpha 和编码检查；Animated WebP / GIF / PNG / ZIP / JSON 均已交付，GIF 771,943 bytes 低于 1MiB；四种浏览器状态无溢出或资源错误。
- Decision：pass；模型重建首姿、背景偏色和静止段低幅抖动均作为已知限制保留，未包装成完美生成。

### 从 Provider 驾驶舱纠偏为提示词工作台

- Current stage：Stage 6 / State and feedback calibration。
- User phase：明确“我的能力是生成提示词，由我去驱动生成视频”。
- Coverage item：页面只能承诺提示词生成；平台选择、登录、上传、点击生成和结果评审必须归于用户。
- Browser environment：`http://127.0.0.1:8042/index.html`，Chromium，1440 × 1000 / 768 × 1000 / 390 × 844，深色主题，2026-08-30。
- Observed evidence：修订前基线标题为“任务由系统整理，提交由你决定”，并存在 Provider 下拉框、执行命令和禁用提交按钮；没有动作编辑框和复制提示词按钮。
- Root cause：把上游仓库具备的 Provider 路由能力误放进了本项目面向用户的能力入口，导致“提示词生成”与“视频执行”职责混淆。
- Minimal intervention：保留三样例和参数布局，移除 Provider、凭证、命令与提交状态；新增动作编辑、正向 / 负向提示词、复制、JSON / 源图下载和四步手动交接；离线资产改为 `prompt-trial`。
- Adjacent regression surfaces：三样例键盘切换、参数联动、复制、下载、1440 / 768 / 390px、无 JavaScript、Reduced Motion、Pages 子路径和网络请求。
- Observed result：三个视口均无溢出；自定义小狗动作准确进入剪贴板和 JSON；页面不存在执行控件；No-JS 保留默认提示词与交接说明；所有浏览器会话外部请求为 0。
- Decision：pass。

### 历史基线：从“解释 Image-to-Video”升级为用户驱动任务（修订 8 已撤销执行入口）

- Current stage：Stage 6 / State and feedback calibration。
- User phase：尝试并整理一次由用户驱动的视频生成。
- Coverage item：用户能看见源图、动作、Provider、时长、循环、任务 JSON、当前能力和费用 / 上传停止点；网页不得擅自提交。
- Observed evidence：修订 6 只解释 Provider 路线，没有可操作任务，也没有把“准备完成”和“真正生成”做成不同状态。
- Root cause：静态能力地图缺少用户输入到上游 `video-task.json` 的可视化映射；当前环境也没有可调用视频工具或凭证。
- Minimal intervention：选择毛毡小龙，生成哈希审批、动作计划、Prompt、Provider、任务、能力和路由文件；新增三样例预设、参数表单、JSON 预览 / 下载和安全命令；真实提交继续保留在显式 CLI 确认门后。
- Adjacent regression surfaces：六场景、现有动画、导航、1440 / 768 / 390px、键盘、无 JavaScript、Reduced Motion、下载、Pages 子路径和外部网络请求。
- Observed result：三个视口表单与导出一致、无溢出；键盘切换同步；No-JS 保留停止说明；所有浏览器会话外部请求为 0，生成按钮始终禁用。
- Decision：pass；真实 Provider 生成仍是用户决策边界，不属于本轮已完成媒体。

### 从整图仿射动画纠偏到语义关键姿态

- Current stage：Stage 6 / State and feedback calibration。
- User phase：指出动画场景与案例不一致，并要求优化实现目标效果。
- Coverage item：小龙必须真正庆祝，耳机必须表达翻译传递，小狗必须眨眼抬爪；整图 bounce / sway / pulse 只能作为最后兜底。
- Observed evidence：修订 5 的媒体确实推进 12 帧，但主体内部完全不变，动作只来自整张贴纸的平移、旋转或缩放。
- Root cause：当时执行的是上游 `transform-local` 降级路线；它验证了媒体加工，却不具备案例所需的语义动作合成能力。
- Minimal intervention：为三类主体各生成 3 个透明关键姿态，调用固定上游 `render_keypose_pack.py` 按 `[0, 1, 2, 1]` 阶梯序列编码，并把三个主场景与小狗语义循环切换到新媒体。
- Adjacent regression surfaces：身份 / 产品结构、透明 Alpha、动画帧推进、Reduced Motion、无 JavaScript、1440 / 768 / 390px、键盘、媒体体积和 Pages 子路径。
- Observed result：Pages 构建产物中的最大截图差为 68,165 / 42,112 / 53,400；三视口无溢出，Reduce 静态、No-JS 展开、全部延迟媒体无破图，页面不再引用旧仿射主效果。
- Decision：pass。

### 从“贴图提取”纠偏到真实动画交付

- Current stage：Stage 6 / State and feedback calibration。
- User phase：确认页面是否只演示了提取贴图能力。
- Coverage item：我们的角色、商品和宠物样例必须包含实际推进帧的媒体，并和静图、CSS 动效、生成式视频明确分层。
- Observed evidence：修订 4 的小龙、耳机和小狗场景输出 `currentSrc` 都指向静态 WebP；相隔 800ms 的局部截图像素差为 0，只有上游黑猫样例在播放。
- Root cause：页面讲清了动画路线，但新场景的可视证据停在透明静图，没有执行上游 `transform-local` 交付链。
- Minimal intervention：用固定上游的独立贴纸处理脚本分别执行 `bounce`、`sway`、`pulse`，交付 WebP / GIF / PNG / ZIP；场景输出直接播放媒体并显示动作、帧数、时长、下载和边界。
- Adjacent regression surfaces：六场景切换、小狗效果 Tab、Reduced motion、无 JavaScript、1440 / 768 / 390px、媒体体积、Pages 子路径和审计文档。
- Observed result：三份 Animated WebP 的截图序列像素差为 35,613 / 16,479 / 86,201；Reduce 下三图改选静态源且像素差为 0；全部回归表面通过。
- Decision：pass。

### 从宠物单例升级为六类业务场景

- Current stage：Stage 3 / Information and layout calibration。
- User phase：根据场景补全示例，不止小狗类型效果。
- Coverage item：个人表达、品牌互动、儿童内容、商品营销、教育知识和资产迁移形成一套可比较的场景能力图谱。
- Observed evidence：修订 3 基线有一个宠物实测、五个输入类型样例和抽象能力表；用户仍需自行推断品牌、商品、教育等业务用法。
- Root cause：页面按素材入口和宠物效果组织，缺少“目标 → 输入 → 路线 → 交付 → 验收 → 边界”的业务映射。
- Minimal intervention：在宠物实测前新增六场景 Tab；每个面板使用同一结构描述业务目标和能力归属，并复用上游真实输出、工作区素材或本轮扩展结果。
- Adjacent regression surfaces：首屏 CTA、导航、宠物 Tab、五输入样例、六阶段、桌面 / 平板 / 手机和无脚本阅读。
- Observed result：六场景鼠标与方向键切换同步；1440 / 768 / 390px 无溢出；原有宠物、输入类型、阶段和筛选交互全部回归通过。
- Decision：pass。

### 非宠物样例与证据分级

- Current stage：Stage 6 / State and feedback calibration。
- User phase：更多补全场景和示例。
- Coverage item：至少两类非宠物主体可视化，同时不把宿主扩展、工作区输入或流程图冒充上游成品。
- Observed evidence：工作区已有原创毛毡故事角色、原创翻译耳机分镜和真实渲染的“忙”字海报；上游只提供黑猫动态包。
- Root cause：继续复制上游宠物形态不能证明角色 IP、商品卖点或知识步骤的适配价值。
- Minimal intervention：用内置图像编辑器生成毛毡小龙庆祝贴纸和耳机卖点贴纸；教育场景只使用真实知识海报解释路线。标签分别标明“真实扩展输出”“工作区真实素材”“管线路线演示”。
- Adjacent regression surfaces：Alpha、WebP 透明预览、来源记录、替代文本、真值表和性能。
- Observed result：两份 PNG 均为 RGBA 且有真实透明像素；两份 WebP 在三种视口加载；完整 Prompt、散列、源文件映射记录在 `scene-assets.md`。
- Decision：pass。

### 扩展路线从愿望清单变成验收合同

- Current stage：Stage 3 / Information calibration。
- User phase：说明可扩展方向。
- Coverage item：扩展方向能回答当前缺口、要增加的模块、适用场景和怎样判断完成。
- Observed evidence：修订前边界只提到 Telegram WebM、Discord APNG 等计划项，没有优先级或可验证完成标准。
- Root cause：按 Provider 名称扩展无法直接提高交付可靠性，也难判断投入是否生效。
- Minimal intervention：按近期、工程、产品三层增加平台包、动作 DSL、时序 Alpha、自动 QC、品牌治理、成本路由六张卡，每张固定展示验证指标。
- Adjacent regression surfaces：能力分层、路由降级、边界表和手机长页密度。
- Observed result：六卡在 1440px 为三列、768px 为两列、390px 为单列；文案与当前边界不矛盾。
- Decision：pass。

### 从上游成品升级为我们的素材实测

- Current stage：Stage 3 / Information and layout calibration。
- User phase：选择一个适合我们的样例进行演示。
- Coverage item：页面先展示工作区自有样例的原图、真实结果、身份锚点和能力归属。
- Observed evidence：修订前基线中没有 `#our-sample`，页面只有上游黑猫成品和五类抽象任务；DOM 文本长度 4583。
- Root cause：已有案例可以解释仓库，但不能证明工作区素材如何进入这条生产线。
- Minimal intervention：固定 CC0 黑色长毛犬源图，在五场景前新增原图/结果实验台，并以六个可见锚点解释选择理由。
- Adjacent regression surfaces：首屏 CTA、章节导航、五场景样例、生产阶段、平板与手机阅读顺序。
- Observed result：桌面、768px 和 390px 均显示专属实验台且无横向溢出；原有五场景与“媒体处理”筛选继续通过。
- Decision：pass。

### 扩展效果与能力归属

- Current stage：Stage 6 / State and feedback calibration。
- User phase：展示不止上游项目已有的效果。
- Coverage item：三种效果可切换，且不把扩展提示层冒充上游内置能力。
- Observed evidence：身份贴纸化、动势轨迹、睡眠氛围三份结果均为本轮真实生成；前两张首次即为 ARGB，睡眠初稿为 24-bit RGB 假棋盘。
- Root cause：图像生成器可能把“透明棋盘”理解为画面内容；效果来源也可能在视觉上被误读为仓库自带。
- Minimal intervention：拒收睡眠初稿，只重做透明要求；页面分别标注“对应仓库静图阶段”和“仓库外创意扩展”，并保留本轮停止点。
- Adjacent regression surfaces：图片 Alpha、棋盘背景、替代文本、真值表、无 JavaScript 回退。
- Observed result：三份最终 PNG 左上角 Alpha 均为 0；WebP 预览含 Alpha；鼠标和键盘切换后状态、图片与文案同步。
- Decision：pass。

### 专属媒体加载成本

- Current stage：Stage 8 / Performance and fallback。
- User phase：专属样例可直接浏览。
- Coverage item：新增高分辨率效果不应把全部审计文件压到首屏。
- Observed evidence：首次接入原始 JPG 与 `dog-core.png` 后初始编码资源约 5.37 MB；我们的两份扩展 PNG虽为 lazy，但首个效果仍增加约 2.95 MB。
- Root cause：审计资产与网页预览复用同一高分辨率文件。
- Minimal intervention：保留原始 JPG / PNG，另生成 1086 × 1448 源图预览和三份透明 WebP；扩展效果继续 lazy load。
- Adjacent regression surfaces：透明边缘、图片尺寸、桌面/手机显示、离线校验和无脚本回退。
- Observed result：初始编码资源降至约 2.95 MB；专属样例首屏只增加约 531 KB，所有可见图片完整加载。
- Decision：pass。

### 从抽象能力表改为样例优先

- Current stage：Stage 3 / Information architecture。
- User phase：用样例理解能力。
- Coverage item：首屏后先看到可操作的输入场景，而不是先阅读抽象流程。
- Observed evidence：修订前基线中，首屏真实产物之后直接进入六阶段生产流程；用户仍需自行把能力映射到自己的输入。
- Root cause：页面按仓库实现结构组织，缺少“我手里有什么素材”这一任务入口。
- Minimal intervention：在流程前新增五场景样例实验台，并固定每个面板为“示例输入 → 三步执行链 → 交付物 → 能力边界”。
- Adjacent regression surfaces：导航顺序、桌面/平板/手机排版、阶段 Tab 与能力筛选。
- Observed result：五个入口均可点击和键盘切换；1440 / 768 / 390px 均无横向溢出，手机端入口为两列、内容为单列。
- Decision：pass。

### 真实产物与流程示意分层

- Current stage：Stage 6 / Truthfulness。
- User phase：判断示例可信度。
- Coverage item：不把未实际调用 Provider 的流程图伪装成生成结果。
- Observed evidence：角色包和独立文件场景使用固定上游 `examples/black-cat/` 产物；静态图板、整板视频和本地降级只能由源码与 Schema 证明流程。
- Root cause：能力展示同时包含可直接检查的媒体产物与尚未在本项目执行的外部生成路径。
- Minimal intervention：真实媒体统一标为“上游真实输出”，其余统一标为“流程示意”；每个场景另列能力边界。
- Adjacent regression surfaces：样例文案、图片替代文本、格式对照、来源说明。
- Observed result：页面标签和视觉材质明确区分两类证据；同一 `01` 贴纸的 WebP / GIF / PNG 直接对照且全部加载成功。
- Decision：pass。

### 外部 JavaScript 失败回退

- Current stage：Stage 8 / Performance and fallback
- User phase：展示能力
- Coverage item：无 JavaScript / 脚本加载失败时核心信息可读
- Observed evidence：初版在外部 `app.js` 加载失败但头部内联增强标记仍执行时，只显示第一个阶段。
- Root cause：`has-js` 在外部脚本之前由内联脚本无条件添加。
- Minimal intervention：移除头部内联标记，把 `document.documentElement.classList.add("has-js")` 放到 `app.js` 首行。
- Adjacent regression surfaces：普通脚本加载、阶段切换、能力筛选、390px 布局。
- Observed result：拦截外部脚本后 3 个专属效果、5 个场景、6 个阶段和 10 个能力全部展开；普通模式仍只显示当前面板并保持交互。
- Decision：pass。

## 证据保留策略

桌面、平板、手机和局部阶段截图仅作为本轮浏览器检查的临时证据，保存在系统临时目录，没有写入产品仓库。项目内保留可复现命令、视口、状态和观测结果。
