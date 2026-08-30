# 用户驱动的视频提示词样例

这个目录证明的能力是 **生成 Image-to-Video 提示词**，不是调用视频模型。

## 项目负责什么

1. 选择一张源图并记录其 SHA-256。
2. 把动作意图、幅度与回环要求整理成逐格动作计划。
3. 调用固定上游的 `prompt_compiler.py` 生成镜头、身份、布局、动作和背景约束。
4. 额外输出适合直接复制的正向提示词、负向约束和建议参数。

默认毛毡小龙样例位于 [`dragon-celebration/`](dragon-celebration/)；`prompt-bundle.json` 是面向用户的交接文件，`prompts.json` 是固定上游编译器的原始输出。

## 重新生成

```powershell
python demo/prepare_video_prompt_bundle.py
```

也可以更换预设并覆盖动作：

```powershell
python demo/prepare_video_prompt_bundle.py --sample dog --duration 4 --amplitude medium --action "先眨眼，再抬起左前爪挥手两次，最后回到端坐姿势"
```

命令只写本地 JSON，不探测凭证、不连接 Provider、不上传图片，也不生成视频。

## 用户接手什么

1. 自行选择视频生成平台。
2. 上传 `source_image` 指向的源图。
3. 粘贴 `positive_prompt`，并在平台支持时填写 `negative_prompt`。
4. 按 `suggested_settings` 设置时长、镜头与背景，然后由用户点击生成、评审和决定是否重试。

项目在提示词包生成后停止；外部平台、账号、费用、上传、生成结果与重试都不属于这里的自动化能力。

## 用户结果回传

用户已经用默认小龙提示词在外部平台生成视频，并将 MP4 放回 [`dragon-celebration/user-result/`](dragon-celebration/user-result/)。该目录保留：

- 原始 768 × 768、24fps、6.58 秒 MP4；
- 面向最终 8fps 贴纸交付的 53 帧处理源；
- 实测背景键色与生产设置快照；
- 透明 WebP、GIF、PNG、3 秒派生版、ZIP 和 processing JSON；
- [`user-video-result.json`](dragon-celebration/user-result/user-video-result.json) 中的 SHA-256、能力归属、视觉评审和警告。

这不会改变能力边界：视频仍由用户生成；项目在视频回传后执行确定性去背、编码、质检和装包。
