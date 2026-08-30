# 语义关键姿态资产记录

## 生成方式与用途

- 模式：Codex 内置 `image_gen` 编辑；没有使用 CLI、API Key 或外部视频 Provider。
- 用途：为固定上游 `keypose-local` 路线提供每个贴纸 3 张有真实 Alpha 的有序关键姿态。
- 组帧：`demo/build_semantic_keypose_animations.py` 拆分并归一化姿态后，调用固定提交 `6531b374c8a5c324a7d98067408832084a2182c9` 的 `scripts/render_keypose_pack.py`。
- 时序：`0 → 1 → 2 → 1`，6fps，2 秒；WebP 编码器把连续相同帧合并为 4 个带 500ms 时长的媒体帧，GIF 保留 12 个时间线帧。

## 固定资产

| 主体 | 三姿态条带 | SHA-256 | 透明性 | 语义动作 |
| --- | --- | --- | --- | --- |
| 毛毡小龙 | `web/assets/keyposes/dragon-celebration-strip-v2.png` | `7FF17CE6ECA573A7157254B5443EAB038FB7141346319019A01F2D912C69A097` | Alpha 0–255 | 蓄力 → 闭眼举臂跳起 → 落地挥手 |
| 翻译耳机 | `web/assets/keyposes/earbuds-translation-strip-v2.png` | `0FDD2448BF1393B49747212F0FEE39FC9E557D236B83B2C7B48EEC5BEAAACF5F` | Alpha 0–255 | 左侧发声 → 中心翻译峰值 → 右侧接收 |
| 黑色长毛犬 | `web/assets/keyposes/dog-greeting-strip-v2.png` | `3AE837CE4965688529B9BDA042503752E42F0A7AAE4F6EFF931CEA59B58FD04F` | Alpha 0–255 | 睁眼端坐 → 闭眼抬爪 → 睁眼挥爪 |

逐姿态 PNG、媒体字节数、散列、帧数、时长、首帧 Alpha 与最大变化像素记录在 `web/assets/semantic-animations/semantic-animation.json`。

## 最终 Prompt 集

### 毛毡小龙三姿态

```text
Use case: identity-preserve
Asset type: transparent three-pose keyframe sprite sheet for a looping animated sticker
Input images: Image 1 is the exact character identity, material, color, lighting and scale reference.
Primary request: create one wide horizontal sprite sheet containing exactly three evenly spaced full-body poses of the same mint-green felt dragon performing one small celebration cycle, ordered left to right: (1) anticipation pose with knees bent, arms lowered slightly and eyes open; (2) action peak jumping upward with both arms raised, eyes happily squeezed shut and mouth smiling; (3) recovery pose landing with one arm still waving, eyes open and the same smile. The poses must visibly differ in limbs, eyes and body action, not merely move the whole image.
Style/medium: handcrafted needle-felt stop-motion character matching Image 1 exactly.
Composition/framing: three equal square cells in one row, same subject scale, fixed frontal camera, same body center and foot baseline per cell, generous separation so cells never overlap, each whole dragon fully visible.
Constraints: genuinely transparent background with preserved alpha; no checkerboard, scene, floor, text, labels, borders, panel dividers, logo or watermark; no extra character; preserve the exact round head, mint felt, cream belly, orange spikes, wings, proportions and friendly face; do not redesign or change lighting; output only the three-pose strip.
```

### 翻译耳机三状态

```text
Use case: product-mockup
Asset type: transparent three-pose keyframe sprite sheet for a looping product feature sticker
Input images: Image 1 is the exact product geometry, materials, lighting and color reference.
Primary request: create one wide horizontal sprite sheet containing exactly three evenly spaced views of the same pair of matte-black ear-hook translation earbuds, ordered left to right as one live-translation cycle: (1) the earbuds remain fixed while a compact cyan waveform begins near the left earbud and the left cyan indicator glows; (2) the earbuds remain in exactly the same position while the cyan-to-orange waveform travels through the center at its strongest amplitude and both indicators glow; (3) the earbuds remain fixed while the waveform reaches the right earbud and the right orange indicator glows. The internal waveform and indicators must visibly change; do not rotate, translate or scale the whole product image.
Style/medium: premium polished 3D product render matching Image 1 exactly.
Composition/framing: three equal square cells in one row, fixed frontal camera, identical earbud scale, geometry and position in all cells, generous separation, both earbuds fully visible.
Constraints: genuinely transparent background with preserved alpha; no black backdrop, checkerboard, text, labels, borders, panel dividers, logo or watermark; no charging case; preserve exact ear-hook shape, matte black material and cyan/orange lighting; output only the three-pose strip.
```

耳机第一次结果把灰白棋盘格烘进了不透明像素，因此拒收；仅针对背景执行一次修复：

```text
Use case: background-extraction
Asset type: corrected transparent three-pose product keyframe sprite sheet
Input images: Image 1 is the exact edit target.
Primary request: remove only the baked gray-and-white checkerboard background and replace it with genuine transparent alpha pixels.
Constraints: preserve all three earbud pairs, their exact geometry, position, scale, cyan/orange lighting, indicator states and waveform states pixel-faithfully; keep the three evenly spaced cells and wide horizontal composition unchanged; change only the background; no checkerboard, white plate, black plate, scene, floor, text, borders, logo or watermark; output a genuinely transparent PNG.
```

### 黑色长毛犬三姿态

```text
Use case: identity-preserve
Asset type: transparent three-pose keyframe sprite sheet for a looping animated pet sticker
Input images: Image 1 is the exact dog identity, coat, harness, tag, lighting and style reference.
Primary request: create one wide horizontal sprite sheet containing exactly three evenly spaced full-body poses of the same black long-haired dog performing one friendly greeting cycle, ordered left to right: (1) seated start pose with both brown eyes open, mouth smiling and both front paws on the ground; (2) anticipation pose with both eyes gently closed in a clear blink and the front paw on the viewer's right beginning to lift; (3) greeting peak with both eyes open and that same front paw clearly raised in a small wave while the other three paws stay planted. The eyes and paw must visibly articulate; do not merely move or resize the whole dog.
Style/medium: polished soft-3D realistic pet sticker matching Image 1 exactly.
Composition/framing: three equal square cells in one row, fixed frontal camera, identical dog scale, body center and foot baseline, generous separation, whole dog fully visible.
Constraints: genuinely transparent background with preserved alpha; no checkerboard, scene, floor, text, labels, borders, panel dividers, logo or watermark; preserve black curly fur, floppy ears, long muzzle, gray plaid harness, blue hanging tag and white sticker outline; no extra limbs, collar or props; output only the three-pose strip.
```

## 能力边界

- 关键姿态之间存在真实的眼睛、手臂 / 前爪、声波和指示灯变化，已经不是整张贴纸仿射运动。
- 固定上游脚本只做确定性阶梯组帧，没有光流、骨骼动画或视频模型插帧；姿态切换会比上游视频案例更离散。
- 小龙的毛毡细节、小狗的黑毛与耳机高光在不同关键图之间仍可能轻微漂移，视觉自然度属于人工验收项。
