# 多场景样例资产与生成记录

## 证据分级

- `上游真实输出`：来自固定提交 `6531b374c8a5c324a7d98067408832084a2182c9` 的 `examples/black-cat/`。
- `工作区真实素材`：来自同一 Research Hub 中其他可复现子项目；本页复制一份用于静态站点交付，不改变原项目文件。
- `本轮真实扩展输出`：以工作区素材为输入，使用 Codex 内置 `image_gen` 编辑生成；它证明宿主图像编辑扩展可以接入管线，不是上游仓库直接生成。
- `管线路线演示`：用真实素材解释输入、审批、路由和后处理路径，不声称已完成该场景的整包动态生成。

## 工作区输入

| 页面文件 | 原始工作区文件 | 来源说明 | SHA-256 |
| --- | --- | --- | --- |
| `web/assets/scenes/source-felted-story.webp` | `projects/kid-papercraft-demo/web/assets/styles/felted-wool.webp` | 该项目内置 `image_gen` 生成的原创毛毡风格对照图；原始生成记录见其 `docs/style-image-prompts.md` | `0F7A22FD0A78C1877D4B3AA91676A44212382C3775DC42BA3FC837D83546477D` |
| `web/assets/scenes/source-earbuds-storyboard.jpg` | `projects/replicate-video-ad-demo/web/assets/adaptation/translation-earbuds-storyboard.jpg` | 该项目原创 AI 翻译运动耳机六镜头概念分镜，不使用 Apple 产品造型或名人肖像 | `E5A42674FD8E33157778368C23AF1027FED86D12CFC71FC313C12628BC63E2C2` |
| `web/assets/scenes/source-hanzi-mang.webp` | `projects/hanzi-chaizi-video-demo/web/assets/mang-poster.webp` | 该项目从真实渲染的“忙”字 Remotion 演示 4.2 秒处提取的海报帧 | `A1E789AD0B29205848B5D6C109A4985DE987043A5D0CBC8BB357E80FB481E2D0` |

黑色长毛犬输入与三份既有输出继续沿用 `docs/our-dog-source.json` 与 `docs/our-dog-demo.md` 的来源、生成和散列记录。

## 本轮内置图像编辑输出

### 1. 毛毡小龙庆祝贴纸

- 模式：Codex 内置 `image_gen`，本地参考图编辑，`identity-preserve`。
- 输入：`source-felted-story.webp`。
- 原始 PNG：`web/assets/scenes/felt-dragon-celebrate.png`，1,536,740 bytes，RGBA，真实透明像素；SHA-256 `23AF49C5F6F1D6A686F9DE19AF689E91E48D0315DA201CDD6E62F757DBB37427`。
- 网页预览：`web/assets/scenes/felt-dragon-celebrate.webp`，820×847，125,544 bytes；SHA-256 `E3585563FCCC2CBF9AD65C517D7E33C1C0A0C74A3A553F697BBFCB45C6F16DEE`。

最终 Prompt：

```text
Use case: identity-preserve
Asset type: transparent animated-sticker key art for a children’s story sticker pack
Input images: Image 1 is the character reference and edit target.
Primary request: create one clean sticker of the same small mint-green felt dragon from Image 1, now jumping with both arms raised in a joyful celebration pose.
Subject: preserve the dragon’s round head, large black eyes, tiny orange head spikes, mint-green felt body, cream belly, short limbs, friendly proportions and handmade needle-felt texture.
Style/medium: handcrafted felt stop-motion character, matching Image 1 exactly.
Composition/framing: single full-body character centered, readable silhouette, generous transparent padding, no crop.
Constraints: genuinely transparent background with preserved alpha; no scene, no ground, no border, no text, no logo, no watermark; do not add other characters; do not redesign the dragon.
```

### 2. 实时翻译耳机营销贴纸

- 模式：Codex 内置 `image_gen`，本地参考图编辑，`product-mockup`。
- 输入：`source-earbuds-storyboard.jpg`。
- 原始 PNG：`web/assets/scenes/earbuds-live-translation.png`，1,814,785 bytes，RGBA，真实透明像素；SHA-256 `638B3068713C8431D11627FC082465EF7762A05EB3AD2D9629381B0EC14EC8B2`。
- 网页预览：`web/assets/scenes/earbuds-live-translation.webp`，820×547，65,050 bytes；SHA-256 `894CF91162F9128CD1669BAE022A264C485DF86FF7535E19C3DE4DA21A072E8D`。

最终 Prompt：

```text
Use case: product-mockup
Asset type: transparent product-launch sticker for a social campaign
Input images: Image 1 is the product and visual-language reference.
Primary request: create a clean hero sticker of the same pair of matte-black ear-hook translation earbuds from the lower-right panel of Image 1, with one compact cyan-and-orange audio waveform curling between them to suggest live translation.
Subject: preserve the black ear-hook form, soft matte material, small cyan light accent and premium technical character of the referenced product.
Style/medium: polished premium 3D product render suitable for a sticker pack.
Composition/framing: both earbuds fully visible in a balanced diagonal composition, crisp silhouette, generous transparent padding, no crop.
Lighting/mood: controlled cyan rim light with a subtle warm counterlight.
Constraints: genuinely transparent background with preserved alpha; no platform, no shadow rectangle, no people, no text, no logo, no watermark; do not add a charging case; keep the waveform secondary to the product.
```

## 网页压缩

两份透明 PNG 原件完整保留；网页使用 Sharp 生成的透明 WebP 预览，宽度限制为 820px，质量 84，Alpha 质量 100。这样首屏场景切换只加载约 191KB 新输出预览，原始 PNG 仍可用于后续审批或媒体处理。

## 本地仿射降级实跑与交付

修订 5 没有把静态贴图伪装成动画，而是调用固定上游快照中的 `scripts/process_independent_stickers.py`，对三份已展示、已获用户要求演示的透明贴图执行确定性本地路线。可复现实验脚本为 `demo/build_scene_animations.py`：它先把输入等比缩到 420px 宽，再以 8fps、1.5 秒、12 帧编码 Animated WebP、循环 GIF、首帧 PNG 和 ZIP。

```powershell
python demo/build_scene_animations.py
```

| 样例 | 上游动作配方 | 实际交付 | 媒体事实 | 能力边界 |
| --- | --- | --- | --- | --- |
| 毛毡小龙 | `bounce` | `felt-dragon-bounce.webp` / `.gif` / `.png` | 420×434，12 帧，WebP 1.5 秒 | 整张贴纸上下位移，不会新增挥手、眨眼或肢体姿态 |
| 翻译耳机 | `sway` | `earbuds-sway.webp` / `.gif` / `.png` | 420×280，12 帧，WebP 1.5 秒 | 整张贴纸约 ±2.5° 摆动，耳机结构和声波不会独立形变 |
| 黑色长毛犬 | `pulse` | `dog-core-pulse.webp` / `.gif` / `.png` | 420×420，12 帧，WebP 1.5 秒 | 整体约 3.5% 缩放，不会生成嘴型、眼睛或四肢动作 |

逐文件字节数、SHA-256、帧数、时长和首帧 Alpha 极值记录在 `web/assets/animations/scene-animation.json`；`upstream-processing.json` 和 `upstream-layout.json` 保留上游原始处理报告。修订 6 不再把这些媒体作为三个主场景的代表动画，只把它们保留为 `transform-local` 最末级降级证据。

## 语义关键姿态实跑与交付

修订 6 针对“整图动作与案例不一致”的问题，调用内置图像编辑器为小龙、耳机和小狗分别生成 3 个有序透明关键姿态，再由固定上游 `scripts/render_keypose_pack.py` 按 `0 → 1 → 2 → 1` 组帧。

```powershell
python demo/build_semantic_keypose_animations.py
```

| 样例 | 三个关键姿态 | 主交付 | 实际编码 | 动作证据 |
| --- | --- | --- | --- | --- |
| 毛毡小龙 | 蓄力 / 闭眼举臂跳起 / 落地挥手 | `dragon-celebration-keypose.webp` / `.gif` / `.png` | WebP 4 个合并媒体帧；GIF 12 个时间线帧；2 秒 | 浏览器姿态序列相对首帧最多变化 54,653 像素 |
| 翻译耳机 | 左侧发声 / 中心翻译峰值 / 右侧接收 | `earbuds-translation-keypose.webp` / `.gif` / `.png` | WebP 4 个合并媒体帧；GIF 12 个时间线帧；2 秒 | 耳机主体基本固定，波形与指示灯相对首帧最多变化 31,192 像素 |
| 黑色长毛犬 | 睁眼端坐 / 闭眼抬爪 / 睁眼挥爪 | `dog-greeting-keypose.webp` / `.gif` / `.png` | WebP 4 个合并媒体帧；GIF 12 个时间线帧；2 秒 | 浏览器姿态序列相对首帧最多变化 95,359 像素 |

完整生成 Prompt、拒收的耳机假透明首稿、关键姿态散列和路线说明见 `docs/keypose-animation-assets.md`；媒体审计见 `web/assets/semantic-animations/semantic-animation.json`。

## 能力边界

- 小龙、耳机和小狗现在都有真实内部状态变化；它们使用关键姿态阶梯时序，不等于光流插帧或生成式视频，也没有执行外部付费 Provider。
- `transform-local` 的整图 bounce / sway / pulse 仍保留，但明确降为最后兜底，不能代表仓库案例的语义动画质量。
- 小龙和小狗的毛发 / 毛毡细节、耳机高光与几何在不同关键图之间仍需人工验收；关键姿态生成不会自动保证视频级时序一致性。
- 儿童与教育场景只展示可进入管线的输入与路线；页面没有声称完成整套儿童动画或知识正确性自动验证。
