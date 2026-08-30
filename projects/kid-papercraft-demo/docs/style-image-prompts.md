# 非纸艺视觉风格对照生成记录

## 生成方式与比较基线

- 模式：内置 `imagegen`，使用一张本地参考图生成十二个风格变体。
- 参考图：`web/assets/concepts/original-hero-world.webp`
- 参考图角色：短黑发、珊瑚发卡、薄荷卫衣、牛仔背带裤的原创女孩；橙色狐狸；薄荷小龙。
- 日期：2026-08-30
- 画幅：4:3（原始输出 1448×1086）
- 网站交付：WebP；常规图片质量 88，像素图无损压缩；原始 PNG 保留在生成缓存中。
- 共同约束：保留角色、配色和三角色向前行进的构图基线，只改变媒介；无文字、Logo、水印、商标或受版权保护的角色。

十二张图片用于横向比较视觉媒介。参考图提高了可识别特征的复用程度，但本次没有做多镜头视频身份一致性测试。

## 最终提示词集

以下十二条提示词共同使用参考图，并都包含同一组主体不变量。

### 1. 黏土定格

```text
Use case: stylized-concept
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as premium clay stop-motion.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls, round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: hand-sculpted plasticine claymation, miniature clay set, subtle fingerprints and sculpting marks, rounded tactile forms, stop-motion film quality.
Lighting/mood: warm cinematic studio light, joyful and safe.
Constraints: change the visual medium only; keep recognizable character colors and proportions; entirely original characters; no text, logos, watermark, trademarks, copyrighted characters, folded paper, origami, cardstock, or cut-paper surfaces.
```

### 2. 羊毛毡与织物

```text
Use case: stylized-concept
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a needle-felted wool and textile miniature.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls, round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: handmade needle-felted wool figures, visible soft fibers, embroidered facial details, stitched fabric clothing, plush textile forest and portal, refined stop-motion miniature quality.
Lighting/mood: warm diffused window light, comforting, gentle and safe.
Constraints: change the visual medium only; keep recognizable character colors and proportions; entirely original characters; no text, logos, watermark, trademarks, copyrighted characters, folded paper, origami, cardstock, or cut-paper surfaces.
```

### 3. 木偶与玩具微缩

```text
Use case: stylized-concept
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a premium carved wooden toy diorama.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls, round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: hand-carved wooden toy figures, softly painted natural wood grain, rounded jointed forms, crafted wooden forest and architectural portal, museum-quality miniature diorama.
Lighting/mood: warm directional gallery light, adventurous and wholesome.
Constraints: change the visual medium only; keep recognizable character colors and proportions; entirely original characters; no text, logos, watermark, trademarks, copyrighted characters, folded paper, origami, cardstock, or cut-paper surfaces.
```

### 4. 水彩与水粉绘本

```text
Use case: illustration-story
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a lyrical watercolor-and-gouache picture-book illustration.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls, round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: expressive watercolor washes, opaque gouache accents, soft hand-painted edges, visible brushwork, layered botanical shapes, premium contemporary children's book art; not a physical diorama.
Lighting/mood: luminous morning atmosphere, tender, imaginative and safe.
Constraints: change the visual medium only; keep recognizable character colors and proportions; entirely original characters; no text, logos, watermark, trademarks, copyrighted characters, origami, folded-paper objects, cardstock sculptures, or cut-paper collage.
```

### 5. 扁平二维动画

```text
Use case: illustration-story
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a modern flat 2D graphic animation keyframe.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls, round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: crisp flat geometric shapes, clean vector-like contours, simplified expressive faces, bold color blocking, limited shading, polished educational animation art direction.
Lighting/mood: bright cheerful palette, energetic, clear and safe.
Constraints: change the visual medium only; keep recognizable character colors and proportions; entirely original characters; no text, logos, watermark, trademarks, copyrighted characters, texture-heavy paper, origami, cardstock, or cut-paper collage.
```

### 6. 柔和三维动画

```text
Use case: stylized-concept
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a polished soft 3D animated-feature keyframe.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls, round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: high-quality stylized CGI, soft physically based fabric and fur materials, rounded expressive character modeling, lush dimensional forest, cinematic animated-feature rendering.
Lighting/mood: warm volumetric light, colorful depth, adventurous, joyful and safe.
Constraints: change the visual medium only; keep recognizable character colors and proportions; entirely original characters; no text, logos, watermark, trademarks, copyrighted characters, folded paper, origami, cardstock, or cut-paper surfaces.
```

### 7. 蜡笔儿童画

```text
Use case: illustration-story
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a polished wax-crayon children's illustration.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls and round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: richly layered wax crayon strokes, visible grain and hand pressure, bold imperfect outlines, playful childlike shapes refined by a professional children's illustrator, flat illustrated scene rather than a physical diorama.
Lighting/mood: sunny, spontaneous, joyful and safe.
Constraints: change the visual medium only; keep recognizable character colors and silhouette; entirely original characters; no text, logos, watermark, trademarks, copyrighted characters, origami, cardstock sculpture, or cut-paper collage.
```

### 8. 油画棒绘本

```text
Use case: illustration-story
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a premium oil-pastel and colored-pencil picture-book illustration.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls and round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: dense velvety oil pastel pigment, soft smudged color transitions, colored-pencil contour details, expressive botanical marks, contemporary gallery-quality children's book illustration, not a physical diorama.
Lighting/mood: warm afternoon glow, intimate, imaginative and safe.
Constraints: change the visual medium only; keep recognizable character colors and proportions; entirely original characters; no text, logos, watermark, trademarks, copyrighted characters, origami, cardstock sculpture, or cut-paper collage.
```

### 9. 水墨动画

```text
Use case: illustration-story
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as an original Chinese ink-wash animation keyframe.
Subject invariants: keep the same original six-year-old girl with short black bob, coral hair clip, mint hoodie, denim overalls and round face, plus the same small orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: flowing black ink brushwork, expressive dry-brush edges, soft ink washes, restrained mineral color accents preserving coral, mint, orange and denim blue, atmospheric mist, elegant contemporary ink-animation design; painted image, not a physical craft.
Lighting/mood: luminous mist, poetic movement, adventurous and child-friendly.
Constraints: change the visual medium only; preserve recognizable silhouettes and color accents; entirely original characters; respectful original visual language; no text, calligraphy, seals, logos, watermark, trademarks, copyrighted characters, origami, or cut-paper collage.
```

### 10. 皮影与剪影剧场

```text
Use case: stylized-concept
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as an original translucent shadow-puppet theatre performance.
Subject invariants: keep recognizable silhouette cues for the same original girl—short bob, coral butterfly hair clip, mint hoodie shape, denim overall shape—plus the same orange fox and tiny mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: articulated translucent leather shadow puppets, hand-cut decorative perforations, visible joint pins, glowing backlit silk screen, deep colored silhouettes, layered theatrical scenery, authentic handcrafted stage language.
Lighting/mood: warm lantern backlight, magical, graphic and safe.
Constraints: change the visual medium only; entirely original puppet designs; no text, logos, watermark, trademarks, copyrighted characters, folded paper, origami, cardstock, or cut-paper collage.
```

### 11. 像素冒险游戏

```text
Use case: stylized-concept
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a polished pixel-art game key visual.
Subject invariants: keep the same original girl with short black bob, coral hair clip, mint hoodie and denim overalls, plus the same orange fox and mint dragon; retain the three-character forward adventure composition and star-portal setting.
Style/medium: crisp handcrafted pixel art, coherent 32-bit-era palette, readable character sprites with expressive faces, layered parallax forest and castle, carefully designed clusters and edges, premium family adventure game art.
Composition/framing: 4:3 game scene without interface; characters large enough to recognize.
Lighting/mood: bright golden-hour pixel lighting, energetic, adventurous and safe.
Constraints: change the visual medium only; preserve character palette and silhouettes; entirely original characters; no text, UI, logos, watermark, trademarks, copyrighted characters, 3D rendering, origami, or cut-paper collage.
```

### 12. 实景微缩与电影合成

```text
Use case: photorealistic-natural
Asset type: 4:3 website style-comparison still
Input image: Image 1 is the subject, identity, palette, and composition reference.
Primary request: Recreate the same original children's adventure scene as a cinematic live-action fantasy still using a fictional child performer and a practical miniature environment.
Subject invariants: a fictional six-year-old East Asian girl not based on any real person, with the same short black bob, coral hair clip, mint hoodie and denim overalls, accompanied by the same original small orange fox creature and tiny mint dragon creature; retain the three-character forward adventure composition and star-portal setting.
Style/medium: photoreal live-action cinematography, practical miniature forest and stone portal, believable fabric, skin, fur and creature materials, subtle visual-effects integration, macro miniature depth cues, natural imperfections.
Lighting/mood: warm late-afternoon cinematic light, wondrous, wholesome and safe.
Constraints: no resemblance to a real identifiable child; preserve costume colors and group composition; entirely original creatures; no text, logos, watermark, trademarks, copyrighted characters, papercraft, origami, cardstock, or cut-paper surfaces.
```

## 网站素材映射

| 风格 | 网站文件 |
| --- | --- |
| 黏土定格 | `web/assets/styles/clay-stop-motion.webp` |
| 羊毛毡与织物 | `web/assets/styles/felted-wool.webp` |
| 木偶与玩具微缩 | `web/assets/styles/wooden-toy-diorama.webp` |
| 水彩与水粉绘本 | `web/assets/styles/watercolor-picture-book.webp` |
| 扁平二维动画 | `web/assets/styles/flat-2d-animation.webp` |
| 柔和三维动画 | `web/assets/styles/soft-3d-cgi.webp` |
| 蜡笔儿童画 | `web/assets/styles/wax-crayon.webp` |
| 油画棒绘本 | `web/assets/styles/oil-pastel.webp` |
| 水墨动画 | `web/assets/styles/ink-wash-animation.webp` |
| 皮影与剪影剧场 | `web/assets/styles/shadow-puppet.webp` |
| 像素冒险游戏 | `web/assets/styles/pixel-art-game-q95.webp` |
| 实景微缩与电影合成 | `web/assets/styles/live-action-miniature.webp` |
