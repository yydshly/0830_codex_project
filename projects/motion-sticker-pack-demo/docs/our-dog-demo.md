# 我们的黑色长毛犬贴纸演示

## 为什么选择这个样例

源图是工作区另一项研究已经固定过的 CC0 黑色长毛犬照片。它同时提供六个容易核验的身份锚点：黑色卷毛、垂耳、长吻部、张口笑、灰色格纹胸背和蓝色挂饰。复杂毛发也会主动暴露透明边缘、暗部层次和风格漂移问题，比复用上游已经做好的黑猫成品更适合验证“我们的素材能不能用”。

- 来源：KANABAIS / Wikimedia Commons / CC0 1.0
- 原图：`web/assets/our-dog/source-black-longhair-dog.jpg`
- 尺寸：1920 × 2560
- SHA-256：`0C696D150B3644941AA5DADD2CE32950AEAB098B1C72735DB57EA656D1DE3279`
- 完整来源元数据：`docs/our-dog-source.json`

## 本轮真实执行了什么

使用 Codex 内置图像生成/编辑工具，以源图作为身份参考，分别生成三张 1254 × 1254 PNG。三张文件均为 32-bit ARGB，左上角 Alpha 为 0；网页上的棋盘格来自 CSS，用来检查透明区域，不是烘进图片的假透明。

| 文件 | 目的 | Alpha | SHA-256 |
| --- | --- | --- | --- |
| `dog-core.png` | 身份贴纸化、静图审批候选 | 真实透明 | `B50E61DCF16B2DA5FC75F68C11671A486ABA2E00C10574BF55189D9916172AE7` |
| `dog-kinetic.png` | 动势轨迹扩展 | 真实透明 | `327992C981A5CB2789456B2FD1846B4BFA5908BDA835578B3CC5C2C9FCF170CE` |
| `dog-dream.png` | 睡眠氛围扩展 | 真实透明 | `8DDF0AD69486CC9B528B3A8CE9EA65E4D228F89C5201AD5684F91E797C16F1F1` |

第一次睡眠氛围结果把透明棋盘格烘进了 24-bit RGB 图片，因此被拒收，没有复制进项目。第二次只针对透明要求返修，输出改为真实 ARGB。

网页不直接加载 1.8–2.1 MB 的审计 PNG，而是使用 FFmpeg 确定性转换出的透明 WebP 预览：`dog-core.webp` 281,050 bytes、`dog-kinetic.webp` 416,832 bytes、`dog-dream.webp` 357,418 bytes。源图也使用 1086 × 1448、263,056 bytes 的网页预览；原始 JPG 与三份 PNG 均继续保留作为可复核证据。

## 最终提示词集合

### 01 · 身份贴纸化

```text
Use case: identity-preserve
Asset type: transparent messaging sticker, core pipeline result
Input images: Image 1 is the edit target and identity anchor.
Primary request: Transform the same black long-haired dog into a polished soft-3D character sticker in a cheerful ready pose, facing the viewer with its recognizable open-mouth smile.
Subject invariants: preserve one dog only; dense black curly fur; floppy ears; long dark muzzle; small bright eyes; gray plaid harness; small blue hanging tag; recognizable proportions and personality.
Style/medium: premium soft 3D animated-character render with tactile fur, clean sticker silhouette, subtle white keyline.
Composition/framing: centered full body, square composition, generous transparent padding, all paws visible.
Lighting/mood: soft studio rim light that separates the black curls without recoloring the fur.
Constraints: genuinely transparent background with alpha; no scene; no leash; no text; no watermark; no logo; no duplicate limbs; do not redesign the dog.
```

### 02 · 动势轨迹扩展

```text
Use case: identity-preserve
Asset type: transparent messaging sticker, extended kinetic effect
Input images: Image 1 is the edit target and identity anchor.
Primary request: Create the same black long-haired dog as a dynamic soft-3D sticker leaping forward with playful energy, front paws leading and an excited open-mouth expression.
Subject invariants: preserve one dog only; dense black curly fur; floppy ears; long dark muzzle; small bright eyes; gray plaid harness; small blue hanging tag; recognizable identity and proportions.
Extended visual effect: add a compact cyan-to-lime curved speed trail, small star-shaped impact sparks and a light comic bounce smear around the silhouette; keep effects behind and around the dog, never covering the face or harness.
Composition/framing: centered diagonal action pose, full body inside a square with transparent padding.
Constraints: genuinely transparent background with alpha; no environment; no text; no watermark; no logo; no extra character; no duplicate limbs; do not recolor the dog.
```

### 03 · 睡眠氛围扩展（返修后）

```text
Use case: identity-preserve
Asset type: transparent messaging sticker, extended mood effect
Input images: Image 1 is the edit target and identity anchor.
Primary request: Create the same black long-haired dog as a cozy soft-3D sticker curled into a sleepy resting pose, eyes gently closed.
Subject invariants: preserve one dog only; dense black curly fur; floppy ears; long dark muzzle; gray plaid harness visibly wrapped around the torso; small blue hanging tag; recognizable identity and proportions.
Extended visual effect: a restrained lavender-blue halo ring, five tiny soft glow particles and one compact crescent-shaped light accent floating around the dog.
Composition/framing: centered compact curled pose, square composition, generous empty transparent padding.
Transparency requirement: output must contain genuine transparent alpha pixels. The area outside the dog and effects must be fully transparent. Do not render a checkerboard pattern, white background, colored background, floor, room, landscape or backdrop of any kind.
Constraints: no text; no watermark; no logo; no extra character; no duplicate limbs; subtle sticker-safe effect; do not redesign or recolor the dog.
```

## 能力归属与边界

- 三张静图来自内置图像编辑器，不是上游仓库内部模型生成的结果。
- 上游仓库能为这些结果提供角色合同、静图审批、哈希绑定、视频路由、媒体处理和打包框架。
- 速度轨迹、冲击火花、氛围光环与月牙属于本项目新增的创意提示层，不是上游自带滤镜或标准动作。
- 本轮没有调用任何视频 Provider，也没有把静态 PNG 宣称为动态 WebP/GIF；页面清楚保留这一停止点。
