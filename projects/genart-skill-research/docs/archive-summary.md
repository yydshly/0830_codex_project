# genart-skill 暂时归档总结

归档日期：2026-08-31

项目状态：`paused`（研究快照完整，可按条件恢复）

原仓库：[`camilleroux/genart-skill`](https://github.com/camilleroux/genart-skill)

固定上游：提交 `3380ebc`，详见 [`UPSTREAM.md`](../UPSTREAM.md)

在线演示：<https://yydshly.github.io/0830_codex_project/demos/genart-skill-research/>

## 一句话结论

在本项目里，可以先把 genart-skill 理解成“教 AI 用代码制作生成艺术，并检查结果有没有乱变的 Skill”。我们用它做了一个线条艺术网页：换一个作品编号会得到新画面，同一个编号可以画回原图，还能批量预览和导出。线条效果是我们写的示例，原库提供的是制作方法和检查工具。

## 它怎样生效

```text
创作者 / 模型定义艺术算法
  └─ 构图、颜色、粒子、纹理、Shader、地形或其他规则
                    ↓
genart-skill 提供方法与作品协议
  └─ hash 播种、命名子流、render、features、完成信号、工作清单
                    ↓
浏览器与 Playwright 执行验收
  └─ 真实像素、SHA-256、同 seed 重放、A-B-A、联系表、census、PNG
```

艺术风格属于第一层。genart-skill 的核心价值位于第二层和第三层；更换生成器会改变视觉效果，但不改变可复现和批量验收方法。

## 已验证的能力

- 正常 fixture 同一 hash 多次像素一致，不同 hash 结果不同。
- A-B-A 在同一浏览器页面中回到相同 A，能够发现全局随机状态污染。
- 把确定性随机流替换为 `Math.random` 后，检查器稳定报告像素与 features 漂移。
- 可以导出单图、9-seed 联系表、批量 PNG，并对 500/5,000 个 seed 做 traits census。
- 完整玩家事件证明坏地图可由 seed 恢复、局部修复且保留怪物/掉落身份，10,000 seed 普查把封路从 809 降到 0。
- Web 覆盖六角色、六产品、六使用场景、品牌参数生产、稳定/漂移对照和 PNG/SVG/Manifest 交付。
- 项目内 [`genart-studio`](../skills/genart-studio/SKILL.md) 已通过 validator、静态扫描和真实 Chromium 检查。

## 适合的使用场景

| 场景 | 为什么需要这套方法 |
| --- | --- |
| 游戏地图、掉落与怪物组合 | 玩家只需提交 seed 即可恢复现场；子流让地图修复不重抽怪物和掉落。 |
| 品牌系列与多渠道视觉 | 同一 campaign seed 可以稳定派生不同画幅，并保存生成坐标与审查证据。 |
| 数字艺术发行 | 发行前需要观察整个 seed 空间、traits 分布和稀有组合，而不是只挑英雄图。 |
| 数据驱动内容 | 数据、规则与视觉输出需要可追溯，版本变更需要可比较。 |
| 创意代码 CI / QA | 固定 fixture、像素摘要、features diff 和批量不变量可以进入 PR 与发布门禁。 |

一次性图片、纯提示词灵感或无需重放的视觉任务通常不值得引入这套工程层。

## 对我们的意义

1. **故障可以转交。** seed 同时是作品地址、问题复现句柄和回滚坐标。
2. **艺术系统可以局部演进。** 命名子流把世界、角色、掉落、VFX 等随机域隔离。
3. **系列质量可以被测量。** 联系表与 census 防止用一张精选图代表整个生成空间。
4. **模型输出可以成为工程资产。** 模型负责写生成器，但验收不再依赖模型“觉得看起来不错”。
5. **能力可以复用。** 研究结果已转成项目内 Codex Skill、starter 和检查工具，而非只保留聊天结论。

## 已知边界

- 上游 `v0.1.0` 在本机 Windows 路径下会触发 `ERR_HTTP_HEADERS_SENT`；研究副本包含最小兼容实验，但没有改动固定上游快照。
- 固定 Chromium 的像素一致不等于跨浏览器、跨 GPU 的 WebGL 字节一致。
- Art Blocks、Three.js、p5.js 等主要由知识资料覆盖，并非已经完成的框架适配器。
- 工具会执行目标 sketch 的 JavaScript；未知项目仍应按不可信代码隔离。
- 当前 AERO 极简线条视觉由本研究实现，只用于解释生产链，不是上游库能力或默认画风。

## 归档证据与复现

```powershell
cd projects/genart-skill-research
npm install
npm run test:web
npm run skill:validate
npm run skill:scan
npm run skill:check
```

仓库级检查与 Pages 构建：

```powershell
python scripts/research_hub.py check
python scripts/research_hub.py build --output .tmp/research-site
```

## 恢复项目的触发条件

- 上游发布影响作品协议或脚本行为的新版本。
- 有真实 Three.js、React Three Fiber、p5.js 或 WebGL 项目需要接入。
- 团队需要跨浏览器、感知差异、离线安全或 CI 发布门禁。
- traits 与稀有度进入真实商业发行，需要统计置信与组合风险模型。

在这些条件出现前，当前快照已经足以回答项目能力、原理、使用场景、意义和边界，不再通过增加演示特效扩张范围。
