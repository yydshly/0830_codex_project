# 用户驱动视频回传与后处理

## 输入

- 用户提供文件：`video_1788105533581.mp4`
- 项目内固定副本：`prompt-trial/dragon-celebration/user-result/dragon-celebration-user-generated.mp4`
- SHA-256：`6008157915ca9fef73aaa53e3bc9e21a25f30428237e75884cf5daad9a2e4d36`
- 媒体：768 × 768、24fps、158 帧、6.583333 秒、H.264 + AAC、707,900 bytes。

这段视频不是项目自动调用 Provider 得到的。项目生成提示词，用户自行在外部平台上传源图并生成，然后把 MP4 交回项目。

## 可见结果

小龙完成了“蓄力 → 双臂举起跳跃 → 落地 → 挥手一次 → 回到站姿”。绿色毛毡、橙色背刺、奶油色腹部、大眼睛、翅膀和尾巴在整段视频中基本保持一致。模型没有保留源图本身的腾空动作作为首帧，而是重建了一个站立起始姿势；静止段仍有轻微身体抖动。

## 后处理

原始视频最终交付只需要 8fps，因此先确定性采样为 53 帧、6.625 秒的处理源，再调用固定上游 `scripts/process_emoji_grid.py`：

```powershell
python upstream/scripts/process_emoji_grid.py `
  prompt-trial/dragon-celebration/user-result/processing-source-8fps.mp4 `
  prompt-trial/dragon-celebration/user-result/trial-output `
  --layout prompt-trial/dragon-celebration/layout.json `
  --settings prompt-trial/dragon-celebration/user-result/sticker-production.json `
  --trial --background-mode edge-color --supersample 1 --overwrite
```

视频平台没有严格保留提示词要求的 `#00FF00`，实际角落中位背景为 `#6FF280`。本次设置快照明确记录了该实测键色；53 帧全部通过背景检查，没有无效帧、实例合并或边界接触。

## 交付与质检

| 交付 | 参数 | 结果 |
| --- | --- | --- |
| Animated WebP | 240 × 240、8fps、53 帧、6.625 秒 | 2,258,092 bytes，透明边界通过 |
| GIF | 240 × 240、8fps、53 帧 | 771,943 bytes，低于 1 MiB 预算 |
| PNG | 第一帧透明源 | 57,655 bytes，Alpha 范围 0–255 |
| ZIP | 完整版 + 3 秒派生版 + JSON | 4,593,270 bytes |

唯一质检警告是 `residual-hold-jitter`：静止段质心仍有低幅移动。它来自视频模型的时间稳定性，不是去背或编码失败。完整机器记录见 [`user-video-result.json`](../prompt-trial/dragon-celebration/user-result/user-video-result.json) 与 [`processing.json`](../prompt-trial/dragon-celebration/user-result/trial-output/processing.json)。
