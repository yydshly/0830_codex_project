# Motion Sticker Pack 能力地图

展示网页：<https://yydshly.github.io/0830_codex_project/demos/motion-sticker-pack-demo/>

> 归档状态：本研究已于 2026-08-31 暂停归档。在线网页、固定源码快照、真实样例和复现脚本继续保留；需要比较新视频模型、开发平台专用交付包或改进时序抠像时再恢复。

## 研究问题

[`kobingogo/motion-sticker-pack`](https://github.com/kobingogo/motion-sticker-pack) 究竟是一套提示词、一组媒体脚本，还是可以完成动态贴纸交付的 Agent 生产流水线？它的能力分别由 Agent、生成模型和确定性程序中的哪一层提供？

## 阶段结论

它是一套 **Agent Skill + 状态合同 + Provider 路由 + 确定性媒体后处理**，不是自研图片或视频模型。与只交付 Prompt 的 Skill 不同，它定义了从角色输入、静图审批、动画路由到 WebP/GIF/PNG/ZIP 的完整交付闭环；但最终视觉质量仍依赖宿主生图/视频能力和人工复核。

研究已完成源码固定、能力梳理、可视化展示和一条真实媒体闭环。修订 3–4 用我们的素材补充宠物、角色、商品、教育等场景；修订 5–6 分别实跑 `transform-local` 仿射降级和 `keypose-local` 语义关键姿态；修订 8 建立只生成提示词、不替用户选择平台的工作台；修订 9 接收用户在外部平台生成的小龙 MP4，再由固定上游脚本完成 53 帧绿幕去背、质检和 WebP/GIF/PNG/ZIP 交付。本项目自身没有提交外部 Provider 请求或接触账号密钥。

## 归档结论

| 问题 | 当前理解 |
| --- | --- |
| 能力是什么 | 把角色/贴纸输入组织成带审批、路由、降级、质检和多格式交付的动态贴纸生产流程。 |
| 原理是什么 | Agent 管理解和状态合同，宿主或外部模型生成像素，确定性脚本负责检测、切格、色键去背、编码、报告和装包。 |
| 适合哪里 | 品牌吉祥物、宠物表情、儿童角色、商品卖点、教育步骤和存量贴纸资产迁移。 |
| 如何扩展 | 平台专用包、动作语义 DSL、时序 Alpha/边缘修复、身份与循环自动 QC、角色版本治理、质量/隐私/成本路由。 |
| 对我们的意义 | 它提供了“生成中间层”范式：模型可以替换，但审批状态、失败降级、质量证据和交付合同可以复用。 |

完整的能力、原理、证据、边界、扩展优先级和恢复条件见 [`docs/archive-summary.md`](docs/archive-summary.md)。

## 上游快照

- 仓库：<https://github.com/kobingogo/motion-sticker-pack>
- 分支：`main`
- 固定提交：`6531b374c8a5c324a7d98067408832084a2182c9`
- 版本：`0.2.0`
- 获取日期：`2026-08-30`
- 许可证：MIT
- 快照：`upstream/`，共 498 个 Git 跟踪文件，不包含嵌套 `.git`

来源元数据见 [`docs/upstream-source.json`](docs/upstream-source.json)。

## 能力分层

| 层 | 上游实际提供 | 不应误解为 |
| --- | --- | --- |
| Agent 合同 | 角色特征提取、信息确认、提示词编译、静图审批、路由顺序和交付规则 | 自己训练的生成模型 |
| 静图生成 | 调用宿主中可接收参考图的图像工具；主路径要求真实 Alpha | 仓库内部的生图引擎 |
| 视频生成 | 当前 Agent 原生工具，或 xAI/Kling/Seedance/Wan/FAL Adapter | 本地自带通用视频模型 |
| 本地后处理 | 网格检测、裁切、边缘连通色键、循环编码、报告和 ZIP | 专业视频抠像与生成式插帧 |
| 状态与安全 | SHA-256 审批绑定、Schema 校验、单次路由执行、凭证环境白名单 | 完全隔离的安全沙箱 |

## 完整工作流

1. 识别入口：角色参考图、文字角色、现成图板、整板视频或独立贴纸。
2. 编译静态提示词，调用当前宿主的图像工具生成透明图板。
3. 检测模型实际生成的网格；低置信度时要求人工确认或覆盖。
4. 展示静态图板。只有用户批准该图板后，才允许进入动画阶段。
5. 把批准状态与图片、布局哈希绑定，为每格编译独立动作提示词。
6. 探测当前运行时和已配置 Provider，按能力、优先级和费用边界选择一条路线。
7. 执行原生/外部视频生成，或退化为关键姿态、本地仿射动画、Prompt-only。
8. 切格、去背、编码 WebP/GIF/PNG，输出处理报告并打包 ZIP。

机器可读的梳理结果见 [`web/downloads/capability-map.json`](web/downloads/capability-map.json)。

## 六类业务场景

页面现在先回答“为什么做”，再回答“输入怎么走”。六类场景共享输入识别、身份 / 布局合同、静图审批、能力路由和确定性交付，但语义、风险与验收指标不同：

| 场景 | 代表样例 | 推荐路线 | 核心验收 |
| --- | --- | --- | --- |
| 品牌互动 | 原创毛毡小龙庆祝贴纸 | 吉祥物 → 静图审批 → 反应语义 → 动态包 | 轮廓、品牌色、语义可读 |
| 个人表达 | CC0 黑色长毛犬 | 身份锚点 → 单张锁版 → 表情扩展 | 毛色、五官、配饰、透明边缘 |
| 儿童内容 | 原创女孩、狐狸与小龙故事世界 | 分角色静图 → 亲子审批 → 温和循环 | 角色一致、动作安全、节奏柔和 |
| 商品营销 | 翻译耳机产品分镜与透明卖点贴纸 | 抠出商品 → 卖点符号 → 图生视频 / 本地循环 | 产品结构、材质、品牌合规 |
| 教育知识 | “忙 = 忄 + 亡”知识海报 | 独立步骤图 → 审批 → 本地时序合成 | 知识正确、顺序明确、文字不变形 |
| 资产迁移 | 上游图板、视频与独立贴纸 | 探测 → 人工覆盖 → 裁切 → 透明 → 编码 | 裁切、Alpha、循环、体积 |

小龙与耳机先由内置图像编辑器生成真实透明静图，再与小狗一起生成三组语义关键姿态：小龙蓄力 / 闭眼举臂 / 落地挥手，耳机左侧发声 / 中心翻译 / 右侧接收，小狗睁眼 / 闭眼抬爪 / 睁眼挥爪。固定上游 `keypose-local` 路线把它们实际编码为 Animated WebP、GIF 和首帧 PNG。儿童整包与知识贴纸仍只展示真实工作区输入和管线路线，没有冒充已完成的动态包。资产、散列与完整记录见 [`docs/scene-assets.md`](docs/scene-assets.md)。

## 网页怎样用样例解释能力

展示页把抽象功能改写为五个可切换任务：

| 示例请求 | 重点展示的能力 | 证据类型 |
| --- | --- | --- |
| 用角色图做完整动态包 | 身份提取、透明静图、审批、视频路由和完整 ZIP | 上游真实黑猫 WebP + 流程示例 |
| 动画化用户提供的 4×3 图板 | 实际网格检测、跳过重复审批、逐格动作计划 | 流程示例，数值明确标注为示例 |
| 把整板 MP4 切成单格 | 抽代表帧、布局检测、裁切、去背和循环编码 | 基于可执行脚本的流程示例 |
| 批处理多张独立贴纸 | 不伪造 1×1 网格，逐张处理并统一装包 | 上游真实贴纸文件 + 流程示例 |
| 禁止外部 API、完全本地 | 路由排除、`transform-local` 和诚实降级说明 | 流程示例，没有执行 Provider |

页面还把同一个 `examples/black-cat/01` 的 Animated WebP、GIF 和首帧 PNG 并排展示，说明三种格式不是三次生成，而是同一贴纸面向不同平台能力的三种交付。

## 我们的样例实测

为了避免能力页只展示上游已经做好的黑猫，本项目从工作区另一项研究复用了许可清楚的 CC0 黑色长毛犬原图。选择它不是因为容易，而是因为它提供了六个可核验身份锚点：黑色卷毛、垂耳、长吻部、张口笑、灰色格纹胸背和蓝色挂饰；复杂毛发也会放大透明边缘和暗部层次问题。

本轮用同一原图生成三份 1254 × 1254 透明 PNG：

| 结果 | 证明什么 | 能力归属 |
| --- | --- | --- |
| 身份贴纸化 | 从生活照抽出主体并保留可辨认锚点，形成可审批静图 | 图像编辑器生成像素；仓库可承接身份合同、审批和路由 |
| 动势轨迹 | 用前探姿态、青绿速度弧线和冲击火花让单帧先具有动作方向 | 本项目新增创意提示层，不是上游内置滤镜 |
| 睡眠氛围 | 用蜷卧姿态、紫蓝光环、星点和月牙表达“困困”语义 | 本项目新增创意提示层，不是上游标准动作 |

三份结果左上角 Alpha 均为 0。第一次睡眠氛围结果把棋盘格烘进 RGB 图片，因此被拒收并做了一次只针对真实透明的返修。完整来源、最终提示、散列和拒收记录见 [`docs/our-dog-demo.md`](docs/our-dog-demo.md)。其中身份贴纸随后扩展为睁眼、闭眼抬爪和睁眼挥爪三张关键姿态；动势轨迹和睡眠氛围两张仍是静态扩展图，没有冒充语义动画。

## 我们的动画实跑

页面中的小龙、耳机和小狗不再使用整张图片 bounce / sway / pulse 作为代表效果。`demo/build_semantic_keypose_animations.py` 直接调用固定提交里的 `scripts/render_keypose_pack.py`，在无需视频 Provider 的条件下执行语义关键姿态路线：

| 样例 | 可见动作 | 实际媒体 | 说明 |
| --- | --- | --- | --- |
| 毛毡小龙 | 蓄力 → 闭眼举臂跳起 → 落地挥手 | 3 关键姿态、6fps、2 秒 Animated WebP / GIF | 眼睛、手臂与腿部姿态真实改变 |
| 翻译耳机 | 左侧发声 → 中心翻译峰值 → 右侧接收 | 3 关键姿态、6fps、2 秒 Animated WebP / GIF | 主体基本固定，声波和指示灯改变 |
| 黑色长毛犬 | 睁眼端坐 → 闭眼抬爪 → 睁眼挥爪 | 3 关键姿态、6fps、2 秒 Animated WebP / GIF | 眼睛和前爪真实改变 |

WebP 编码器把连续相同帧合并为 4 个带时长的媒体帧，GIF 保留 12 个时间线帧。关键姿态有真实的主体内部变化，但时间仍是确定性阶梯切换，没有光流或视频模型插帧。旧 `transform-local` 媒体继续保留在 `assets/animations/` 作为最末级降级证据。完整 Prompt、SHA-256、帧数、Alpha 和上游处理报告见 [`docs/keypose-animation-assets.md`](docs/keypose-animation-assets.md) 与 [`web/assets/semantic-animations/semantic-animation.json`](web/assets/semantic-animations/semantic-animation.json)。

## 用户驱动的视频提示词工作台

页面新增“视频提示词工作台”，并把能力边界定为：**项目生成提示词，用户生成视频**。用户可以切换小龙、小狗、耳机三个预设，直接编辑动作意图，调整目标时长、动作幅度和首尾回环；页面实时生成正向提示词、负向约束和建议参数。

默认样例位于 [`prompt-trial/dragon-celebration/`](prompt-trial/dragon-celebration/)：源图 SHA-256、动作计划、固定上游 `prompt_compiler.py` 的原始结果，以及面向用户的 `prompt-bundle.json` 都可离线检查。网页可以复制完整提示词、下载 JSON 和源图。

项目不会选择视频平台、探测凭证、生成执行命令或提交任务。用户接手四步：保留源图 → 复制提示词 → 在自选平台上传和粘贴 → 自行设置参数、点击生成并评审。完整说明见 [`prompt-trial/README.md`](prompt-trial/README.md)。

## 用户生成视频已经回传

用户随后提供了 `video_1788105533581.mp4`，完成了从提示词到真实视频的手动生成环节。固定副本为 [`prompt-trial/dragon-celebration/user-result/dragon-celebration-user-generated.mp4`](prompt-trial/dragon-celebration/user-result/dragon-celebration-user-generated.mp4)：768 × 768、24fps、158 帧、6.583333 秒，包含 H.264 视频与 AAC 音轨。

本项目没有生成这段 MP4；它负责接收用户结果并调用固定上游 `process_emoji_grid.py` 做后处理。为了匹配最终 8fps 交付，先确定性采样为 53 帧处理源，再以实测绿幕 `#6FF280` 去背并输出 240 × 240 Animated WebP、GIF、首帧 PNG、3 秒派生版、processing JSON 和 ZIP。53 帧均通过背景、Alpha 与编码检查，GIF 为 771,943 bytes、低于 1MiB 预算；唯一警告是 `residual-hold-jitter`，说明静止段仍有生成模型带来的低幅抖动。

完整媒体来源、SHA-256、能力归属、视觉评审和交付记录见 [`docs/user-generated-video.md`](docs/user-generated-video.md) 与 [`prompt-trial/dragon-celebration/user-result/user-video-result.json`](prompt-trial/dragon-celebration/user-result/user-video-result.json)。页面在提示词工作台后并排展示原始 MP4 与去背后的透明 WebP。

## 本次检查到的工程证据

- `SKILL.md` 明确了入口、不可跳过的审批门、路由顺序和交付合同。
- `scripts/` 包含 28 个 Python 脚本和 1 个 Node Gateway。
- `package.json` 锁定五类外部视频 Provider 适配依赖。
- `tests/` 有 13 个 Python 测试文件，`tests-node/` 有 1 个 Gateway 合同测试文件。
- `examples/black-cat/` 保存了九格 WebP、GIF 和首帧 PNG；展示页复用了其中三份 Animated WebP 作为真实输出样例。
- `docs/adversarial-audit.md` 记录了审批陈旧、Provider 报告注入、凭证继承、旧文件混包和伪 Alpha 等已修复问题，也明确远程付费质量尚未验证。

## 项目结构

```text
motion-sticker-pack-demo/
├─ upstream/                     # 固定提交的完整源码快照
├─ demo/
│  ├─ build_scene_animations.py  # 复现三组上游本地动画交付
│  ├─ build_semantic_keypose_animations.py # 复现三组语义关键姿态动画
│  ├─ prepare_video_prompt_bundle.py # 编译视频提示词包，不连接视频平台
│  └─ verify_demo.py             # 离线检查快照、页面、媒体和能力数据
├─ docs/
│  ├─ design-contract.md         # 页面设计与验收契约
│  ├─ upstream-source.json       # 上游来源与提交
│  ├─ browser-validation.md      # 真实浏览器验收记录
│  ├─ user-generated-video.md    # 用户回传 MP4、后处理与质检证据
│  ├─ our-dog-source.json        # 工作区样例来源与许可
│  ├─ our-dog-demo.md            # 宠物样例提示、资产散列与边界
│  ├─ keypose-animation-assets.md # 三组关键姿态 Prompt、散列与拒收记录
│  └─ scene-assets.md             # 多场景来源、Prompt、散列与证据分级
├─ web/
│  ├─ index.html
│  ├─ styles.css
│  ├─ app.js
│  ├─ assets/stickers/           # 上游真实 Animated WebP 样例
│  ├─ assets/our-dog/            # 我们的源图、三份透明 PNG 与 WebP 预览
│  ├─ assets/scenes/             # 角色、商品、知识输入与两份透明扩展输出
│  ├─ assets/animations/         # 三组 Animated WebP / GIF / PNG、ZIP 与审计报告
│  ├─ assets/keyposes/           # 三组生成条带与拆分后的透明关键姿态
│  ├─ assets/semantic-animations/# keypose-local 媒体、ZIP 与审计报告
│  ├─ assets/user-video/         # 用户生成 MP4 与透明 WebP/GIF/PNG/ZIP
│  ├─ downloads/capability-map.json
│  └─ downloads/video-prompt-default.json # 网页可下载的默认提示词包
├─ prompt-trial/
│  ├─ README.md                   # 提示词能力与用户手动交接边界
│  └─ dragon-celebration/         # 提示词 JSON 与用户回传视频后处理结果
├─ project.json
└─ README.md
```

## 运行与复现

不需要安装前端依赖：

```powershell
cd projects/motion-sticker-pack-demo
python demo/verify_demo.py
python -m http.server 48173 --bind 127.0.0.1 --directory .
```

打开 <http://127.0.0.1:48173/web/>。

需要重新组帧三组语义动画时运行：

```powershell
python demo/build_semantic_keypose_animations.py
```

重新生成默认视频提示词包时运行：

```powershell
python demo/prepare_video_prompt_bundle.py
```

该命令只写本地 JSON，不连接视频平台。用户可以在网页复制提示词，再自行去任意支持参考图的视频工具驱动生成。

这里没有要求安装上游的 Provider 依赖。若以后要运行其完整媒体测试，需要 Python 3.10+、Pillow、NumPy、FFmpeg 和 FFprobe；若要执行 Node Provider Gateway，还需要 Node 22+ 和 `npm ci`。

## 实验记录

| 日期 | 实验 / 变更 | 结果 | 判断 |
| --- | --- | --- | --- |
| 2026-08-30 | 固定上游 `main` 提交并导出完整源码 | 498 个跟踪文件，未保留嵌套 Git 元数据 | 可离线审计 |
| 2026-08-30 | 阅读 Skill、路由、输出、配置和对抗审计合同 | 能力可分为 Agent、生成、路由、媒体、QC 五层 | 它是生产编排系统，不是生成模型 |
| 2026-08-30 | 建立交互能力地图和真实样例展示 | 页面提供阶段浏览、能力筛选、降级路线与明确边界 | 首期展示覆盖核心定位 |
| 2026-08-30 | 使用真实 Chromium 验收页面 | 1440/768/390px 无横向溢出；阶段键盘切换、能力筛选、reduced-motion 与脚本缺失回退通过 | 页面可作为首期能力展示交付 |
| 2026-08-30 | 将能力说明改为五场景样例实验台 | 增加角色图、现成图板、整板视频、独立贴纸和完全本地五种任务，并对照同一贴纸的三种格式 | 页面从抽象能力表升级为样例驱动阅读 |
| 2026-08-30 | 用工作区 CC0 黑色长毛犬生成专属贴纸演示 | 产出身份贴纸、动势轨迹、睡眠氛围三份真实透明 PNG；拒收并返修一份假透明结果 | 能力页从“上游样例说明”升级为“我们的素材实测”，扩展效果与上游能力分开标注 |
| 2026-08-30 | 增加六类业务场景能力图谱 | 品牌、个人、儿童、商品、教育、迁移六类场景都给出输入、路线、交付、验收和边界 | 页面不再把宠物效果当作唯一理解入口 |
| 2026-08-30 | 用毛毡小龙与翻译耳机补充非宠物真实输出 | 生成两份带真实 Alpha 的 PNG，并压缩为透明 WebP 预览；完整 Prompt 与散列已记录 | 证明角色 IP 与商品营销都可接入同一静图审批入口 |
| 2026-08-30 | 实跑固定上游的本地动画路线 | 小龙 `bounce`、耳机 `sway`、小狗 `pulse` 均生成 12 帧 Animated WebP / GIF / PNG，并打包 ZIP | 页面证明了真实媒体动画能力，同时明确它是整图仿射降级而非语义动作生成 |
| 2026-08-30 | 用 `keypose-local` 纠正整图动作与案例不一致 | 为小龙、耳机、小狗生成三组透明关键姿态，并编码语义 WebP / GIF / PNG / ZIP | 主场景现在展示眼睛、肢体、声波和指示灯变化；整图仿射只保留为兜底 |
| 2026-08-30 | 建立用户驱动的视频提示词工作台 | 为小龙、小狗、耳机整理可编辑动作、身份约束、正向提示词、负向约束与建议参数 | 项目止于提示词交付；平台选择、上传、点击生成和结果评审由用户完成 |
| 2026-08-31 | 接收用户生成的小龙 MP4 并实跑仓库后处理 | 53 帧绿幕去背与编码全部通过，交付透明 WebP / GIF / PNG / ZIP；记录静止段轻微抖动 | 完整证明“项目提示词 → 用户生成 → 项目确定性交付”的闭环 |
| 2026-08-30 | 建立六项扩展路线图 | 平台包、动作 DSL、时序 Alpha、自动 QC、品牌治理、成本路由均配验证指标 | 扩展从“多接模型”转向可验收的可靠性交付 |

## 当前边界

- 本阶段已验证内置图像编辑器能为五份 PNG 返回真实 Alpha；这不等于验证某个外部 GPT-image API 型号、价格或账号配额。
- 没有授权或执行任何付费图生视频请求；三份主场景结果走 `keypose-local` 语义姿态路线，其他扩展图仍是静态 PNG。
- 视频提示词工作台只生成文本和 JSON，不选择或连接视频平台；网页没有提交入口，真实视频由用户在外部工具中生成。
- 用户已回传一段真实生成视频，但外部平台与具体生成模型仍由用户操作；项目只声明提示词与后处理两段能力。
- 展示页中的黑猫 Animated WebP 来自上游 `examples/`，用于证明仓库包含可播放的交付样例；它们不是本研究重新生成的结果。
- 仓库的自动测试能验证合同和媒体处理，不等于验证远程模型的账号权限、配额、价格和生成质量。
- 整板视频仍可能发生跨格污染；复杂毛发、运动模糊和阴影需要更专业的时序抠像。
- Telegram WebM、Discord APNG 等平台投稿规格仍属于上游计划，不是当前能力。

## 下一步

- [x] 在不调用外部 API 的条件下运行 `transform-local` 完整交付实验。
- [x] 在不调用视频 Provider 的条件下运行 `keypose-local` 语义姿态交付实验。
- [x] 整理毛毡小龙、小狗和耳机的视频提示词工作台与用户手动交接路径。
- [x] 接收用户生成的小龙 MP4，完成透明 WebP / GIF / PNG / ZIP 后处理与页面回传展示。
- [ ] 使用原创角色执行一次 GPT-image 静图、审批哈希和网格检测实验。
- [ ] 用户在自选平台生成视频后，可把结果带回本项目做身份保持、循环质量和透明边缘评审。
- [ ] 对比整板视频与逐格视频的返工率和成本。
