# 后续研究交接单

更新时间：2026-08-30
项目状态：`complete`，当前阶段归档，等待后续重新研究。

## 快速入口

- GitHub Pages：<https://yydshly.github.io/0830_codex_project/demos/hanzi-chaizi-video-demo/>
- 本地展示页：`web/index.html`
- 项目总说明：`README.md`
- 上游来源：`UPSTREAM.md`
- 资产来源与尺寸：`docs/assets.md`
- 浏览器验收：`docs/browser-validation.md`
- 需求与完成矩阵：`docs/design-contract.md`
- 自动检查：`python demo/verify_demo.py`

## 事实、假设与模拟资料

### 用户实际提供

- 新郎展示名：张帅
- 新娘称谓：董小姐
- 日期：9 月 12 日，未提供年份
- 地点：延安

### 为产品探索模拟

- 年份：2026
- 新娘完整姓名：董雅宁
- 时间：11:58
- 场地：延安 · 山河礼宴厅（演示场地）
- 地址：宝塔区婚礼演示地址（请替换）
- 联系方式：138 **** 0912
- 着装色：暖金／酒红
- 三段相识故事、誓言与现场信息均为演示内容

以上模拟值集中在 `web/data/wedding-zhangshuai-dong.json` 的 `simulation` 对象中，状态固定为 `DEMO_ONLY`。正式使用前必须逐项向新人确认。

## AI 图片身份边界

- 三张婚礼故事图均为内置图像生成模式创建的完全虚构成年人物。
- 未使用张帅、董小姐或其他真人照片，也未使用真实人物身份参考。
- 图片不代表或冒充新人本人；网页、配置、横屏成片和迎宾海报均保留 `AI SIMULATED`／`DEMO` 标识。
- 正式发布时应替换为新人授权照片，或取得新人明确同意继续采用虚构视觉。
- 生成意图依次为：延安风格秋日初见；保持身份与服装并肩同行；保持身份进入戒指约定场景。

源图位于 `web/assets/wedding-ai/*.png`，网页／Remotion 优化图位于同目录及 `demo/mang-video/public/wedding-ai/*.webp`。

## 当前已经跑通

- 上游“懒”字固定提交的离线复现。
- “忙”字迁移实验、六章效果实验室与五条场景短片。
- 五字配置工作台和“明”字配置驱动成片。
- “沐阳”姓名祝福 MVP 与真实双字路径样片。
- “张／董”真实笔画婚礼故事、网页五幕、9:16 竖版样片。
- 同一组 AI 模拟照片进入动态请帖、25 秒 1920×1080 大屏片和 1080×1350 迎宾海报。
- 本地 RSVP 原型、资料／媒体／图片错误回退、键盘和 reduced-motion。
- 七条主 MP4、五条场景短片、九项图片检查和 24 份视觉证据通过自动验证。

## 仍未实现

- 任意汉字自动部件切分、自动排版和长尾姓名真实逐笔覆盖。
- 在线 Remotion 渲染 API、任务队列、账号、订单和支付。
- 真人照片上传、授权记录、裁切、删除期限和隐私管理。
- 真实 RSVP 接收端、消息通知、导航和日历提醒。
- 酒店 LED 参数适配、现场联调、印刷出血／CMYK 和正式音乐授权。
- 可信字源数据库、来源版本和专家审核。

## 恢复研究的最短路径

环境：Node.js 22、Python 3.10+、FFmpeg／ffprobe。

```powershell
cd projects/hanzi-chaizi-video-demo/demo/mang-video
npm ci
npm run typecheck

cd ../..
python demo/verify_demo.py
python -m http.server 52731 --bind 127.0.0.1 --directory web
```

浏览器打开 <http://127.0.0.1:52731/#wedding-asset-exploration>。

若修改横屏或迎宾 Composition：

```powershell
cd demo/mang-video
npm run render:wedding-screen
npm run render:wedding-poster
```

## 后续研究建议顺序

1. 先补 JSON Schema、字符／部件来源和自动布局校验，降低逐字手工成本。
2. 再用一组获得授权的真实婚礼资料测试“信息收集—审核—三端导出—现场播放”。
3. 验证用户是否愿意为姓名祝福或婚礼套装分享、付费，再决定是否建设在线渲染与订单系统。
4. 教育方向放在可信数据和跟写识别具备之后，避免把当前视觉样片误当完整课程产品。

## 关键结论

该仓库证明的是“真实汉字笔画路径可以成为内容和视觉产品底座”，不是任意汉字的一键生成器。婚礼方向的商业价值也不只是笔画效果，而是姓名专属感、照片故事、资料审核、多端输出和现场保障组成的交付闭环。
