# 演示素材说明

## 上游与生成素材

- `upstream/`：上游仓库固定提交快照，许可证见 `upstream/LICENSE`。
- `web/assets/hanzi-chaizi-demo.mp4`：本研究从上游源码实际渲染的“懒”字演示视频。
- `web/assets/poster.webp`：从“懒”字演示 4.2 秒处提取的海报帧。
- `demo/mang-video/`：本研究独立编写的“忙”字 Remotion 补充演示源码，不修改上游快照。
- `web/assets/mang-heart-direction.mp4`：从补充源码真实渲染的“忙”字视频。
- `web/assets/mang-poster.webp`：从“忙”字演示 4.2 秒处提取的海报帧。
- `demo/mang-video/src/EffectsLabVideo.tsx`：扩展效果实验室 Composition，真实使用“永”“明”“清”“情”“晴”“请”的笔画路径。
- `web/assets/hanzi-effects-lab.mp4`：31.595 秒扩展效果实验室视频，包含教学标注、三种材质、部件磁吸、字族比较、跟写界面概念和多输出形态概念。
- `web/assets/effects-poster.webp`：从效果实验室 12.6 秒部件动画章节提取的海报帧。
- `web/data/hanzi-workbench.json`：最小内容工作台与 Remotion Composition 共享的配置目录；包含 5 个字、4 类场景、3 套模板和“明”字默认样片 props。
- `demo/mang-video/src/ConfigurableHanziVideo.tsx`：配置驱动 Composition；真实载入“忙、永、明、清、安”的笔画路径，读取目录中的部件切分和模板 token。
- `web/assets/workbench-config-demo.mp4`：8.555 秒配置驱动“明”字真实样片，H.264、1080×1920、30fps、AAC 48kHz 双声道。
- `web/assets/workbench-poster.webp`：从配置驱动样片提取的海报帧。
- `web/data/name-blessing.json`：姓名祝福产品目录；包含生日、婚礼、新生、品牌四场景，三套绚丽风格和“沐阳”默认配置。
- `demo/mang-video/src/NameBlessingVideo.tsx`：双字姓名祝福 Composition；真实读取“沐、阳”13 笔路径，加入部件分色、程序化星光、组合高光、祝福和署名。
- `web/assets/name-blessing-muyang.mp4`：12.544 秒“沐阳”姓名祝福真实样片，H.264、1080×1920、30fps、AAC 48kHz 双声道。
- `web/assets/name-blessing-poster.webp`：从姓名祝福样片 9.2 秒处提取的海报帧。
- `web/data/wedding-zhangshuai-dong.json`：婚礼项目共享配置；用户提供张帅、董小姐、9 月 12 日与延安，另含独立 `DEMO_ONLY` 模拟姓名、时间、场地、地址、联系方式、着装、故事、三张 AI 虚构人物照片及 `mediaPolicy`。
- `web/data/wedding-sample-delivery.json`：R10 完整探索交付清单；记录虚构身份政策、三张故事素材、请帖／大屏／迎宾／本地 RSVP 四项交付和正式替换清单。
- `demo/mang-video/src/WeddingStoryVideo.tsx`：婚礼故事 Composition；真实读取“张、董”笔画路径，用红线与同心圆组织两姓相遇，并排版完整展示名、日期、地点与祝福。
- `web/assets/wedding-zhangshuai-dong.mp4`：20.000 秒婚礼故事竖版样片，600 帧、2,582,303 字节，H.264、1080×1920、30fps、AAC 48kHz 双声道。
- `web/assets/wedding-zhangshuai-dong-poster.webp`：从婚礼样片 17.2 秒祝福定格处提取的海报帧。
- `web/assets/wedding-ai/01-first-meet.png`、`02-together.png`、`03-promise.png`：内置图像生成模式创建的三张 1122×1402 源图；人物为同一对完全虚构的东亚成年情侣，没有使用真人照片或真实人物身份参考。
- `web/assets/wedding-ai/*.webp`：上述三张源图的 720×900 网页／Remotion 优化副本，分别为 96,594、71,550 和 39,314 字节。
- `demo/mang-video/public/wedding-ai/*.webp`：供 Remotion 静态资源加载的同一优化副本。
- `demo/mang-video/src/WeddingScreenVideo.tsx`：1920×1080 横版婚礼大屏 Composition；真实读取“张、董”路径，消费三张 AI 模拟照片，并常驻显示模拟资料与 AI 身份标识。
- `web/assets/wedding-zhangshuai-dong-screen.mp4`：25.000 秒照片版婚礼大屏真实样片，750 帧、3,796,034 字节，H.264、1920×1080、30fps、AAC 48kHz 双声道。
- `web/assets/wedding-zhangshuai-dong-screen-poster.webp`：从横版大屏片 22.5 秒处提取的 960×540 WebP 海报。
- `demo/mang-video/src/WeddingWelcomePoster.tsx`：4:5 迎宾海报 Still；使用“良辰约定”AI 模拟照片，文件内常驻 `SIMULATION / DEMO ONLY` 和非真人照片说明。
- `web/assets/wedding-welcome-demo.png`：1080×1350 可下载照片版迎宾海报，1,415,225 字节。
- `web/assets/wedding-welcome-demo.webp`：同一迎宾海报的 1080×1350 网页预览，76,466 字节。
- `web/assets/scenario-clips/`：从效果实验室重新编码的五条 540×960、30fps、H.264＋AAC 场景证据短片及 WebP 海报；用于在不支持 Range seek 的静态服务器中直接播放对应章节。
  - `scenario-lesson.mp4`：0–4.70 秒，笔顺教学。
  - `scenario-gift.mp4`：4.968–10.068 秒，材质风格能力证据。
  - `scenario-exhibit.mp4`：10.416–14.116 秒，“明”字部件动画。
  - `scenario-family.mp4`：14.472–18.472 秒，清、情、晴、请字族比较。
  - `scenario-practice.mp4`：18.864–24.464 秒，互动跟写界面概念。
- `docs/evidence/01-*.png` 至 `04-*.png`：“懒”字关键帧；`05-*.png` 至 `08-*.png`：“忙”字关键帧；`09-*.png` 至 `14-*.png`：效果实验室六章节关键帧；`15-workbench-config.png`：配置驱动“明”字工作台样片关键帧；`16-name-blessing.png`：“沐阳”双字祝福关键帧；`17-wedding-story.png`：婚礼竖版定格；`18-wedding-screen.png`：照片版横屏最终定格；`19-wedding-welcome.png`：照片版迎宾海报；`20-wedding-complete-web.png` 与 `21-wedding-complete-mobile.png`：R9 桌面和手机网页；`22-wedding-screen-ai-photos.png`：照片版大屏故事段；`23-wedding-ai-exploration-web.png` 与 `24-wedding-ai-exploration-mobile.png`：R10 素材探索桌面／手机实测截图。

## AI 婚礼素材生成记录

- 生成模式：内置 `image_gen`；每张图均无文字、Logo 或水印，网页与成片自行叠加可访问的 `AI SIMULATED` 标签。
- 身份锚点：一对完全虚构的东亚成年情侣，在延安风格秋日山谷相遇；暖白服装、酒红围巾、克制电影感、4:5 构图。
- 连续场景：以第一张为身份参考，保持人物、服装和色彩，让两人并肩走过金色黄土山路。
- 仪式高潮：以前两张为身份参考，保持同一人物，在酒红仪式背景前共同打开戒指盒。
- 使用边界：这些图片只验证视觉连续性和多端消费方法，不指向张帅、董小姐或任何真人；正式使用时必须替换新人授权照片，或取得新人明确同意继续采用虚构视觉。

## 音频

- “懒”字旁白由上游脚本通过 Edge TTS 生成，音色为 `zh-CN-YunjianNeural`、语速为 `-20%`。
- “忙”字旁白由 `demo/mang-video/scripts/generate_mang_tts.py` 分四段生成，音色为 `zh-CN-XiaoxiaoNeural`、语速为 `-10%`；同一脚本根据每段真实 WAV 时长生成字幕时间轴和原创程序化占位 BGM。
- 效果实验室旁白由 `demo/mang-video/scripts/generate_effects_lab_tts.py` 分六段生成，音色为 `zh-CN-XiaoxiaoNeural`、语速为 `-5%`；总旁白 31.512 秒，成片 31.595 秒。
- 配置驱动工作台样片使用 `demo/mang-video/public/audio/background.mp3` 的程序化占位背景音，不含旁白；成片和页面均明确其为配置能力验证，不将其表述为完整内容成片。
- 姓名祝福样片复用同一程序化 BGM，不含旁白；正式产品需替换为完成授权、响度校准并适配场景的音乐资产。
- 婚礼故事与横版大屏样片复用同一程序化 BGM，不含旁白；正式婚礼交付需要由新人确认曲目、现场播放授权、响度和卡点。
- 上游示例背景音乐未包含在仓库中。本研究使用 FFmpeg 的 `sine` 音源合成 C4、E4、G4 三个低振幅纯音并混合、低通、淡入淡出，作为仅用于能力验证的原创占位背景音。
- 七条演示的最终 MP4 均包含音轨；前三条包含旁白，配置样片、姓名祝福、婚礼故事与婚礼大屏仅包含程序化 BGM。旁白 Composition 保留生成脚本与时间轴清单，音频中间文件由 `.gitignore` 排除。

背景音复现命令见项目 README。
