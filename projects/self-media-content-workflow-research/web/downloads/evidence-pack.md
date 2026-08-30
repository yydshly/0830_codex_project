# 证据包

## 可安全引用的核心判断

`genart-skill` 不是图像生成模型，也不是完整的生成艺术应用。它由三层组成：领域知识、最小作品协议和 Playwright 可执行工具。编码 Agent 仍负责写作品代码，浏览器负责运行，创作者负责审美判断与发布决定。

## 已核验事实

| ID | 事实 | 证据位置 | 用法 |
| --- | --- | --- | --- |
| E01 | 研究固定上游提交 `3380ebc` | `projects/genart-skill-research/UPSTREAM.md` | 说明研究可追溯 |
| E02 | 正常 fixture 的重复性、差异性、A-B-A 全局状态和 features 稳定性检查均通过 | `docs/源码与实验研究报告.md` §6.2 | 证明检查器能在标准样例工作 |
| E03 | 将确定性随机流替换为 `Math.random` 后出现 4 项失败 | 同报告 §6.3 | 证明故障对照能被真实抓出 |
| E04 | 成功导出 800×800 单图和 9-seed 联系表 | `artifacts/single.png`、`artifacts/grid.png` | 视觉证明 |
| E05 | 500-seed census 得到 Palette 与 Density 的实测分布 | 同报告 §6.5 | 说明可从单图审美走向系列统计 |
| E06 | 同一 hash 在 400px / 1600px 输出时构图与 features 保持一致 | 同报告 §6.6 | 只证明上游 fixture 的该次观察 |
| E07 | 上游 v0.1.0 在本机 Windows 触发 `ERR_HTTP_HEADERS_SENT` | 同报告 §6.1 | 必须公开的工程边界 |

## 500-seed 可引用数据

| Trait | 值 | 目标权重 | 本次实测 |
| --- | --- | ---: | ---: |
| Palette | Ember | 45% | 44.4% |
| Palette | Ash | 30% | 33.6% |
| Palette | Verdant | 18% | 15.0% |
| Palette | Aurora | 7% | 7.0% |
| Density | Sparse | 25% | 24.2% |
| Density | Balanced | 55% | 54.6% |
| Density | Dense | 20% | 21.2% |

说明：目标权重来自 fixture；“目标 vs 实测”由研究项目人工整理。上游 census 本身不会读取目标表做统计拟合检验。

## 事实、判断、推断、建议

- 事实：仓库包含 Skill 资料、作品协议说明和 `check` / `render` 等脚本。
- 事实：故障对照出现 4 项失败。
- 判断：最贴切的角色是“生成艺术技术导演 + 质检台”。
- 推断：同样的协议思路可复用于可重现关卡、角色外观和程序化资产，但本次未对这些场景运行实验。
- 建议：评估 Agent Skill 时分别询问它增加了知识、协议、工具还是外部执行权限。

## 暂时不能说

- 不能说“安装后获得一种新的绘画模型”。
- 不能说“所有 Canvas、WebGL、Three.js 项目开箱即用”。
- 不能说“已经证明不同浏览器、不同 GPU 的像素完全一致”。
- 不能说“已自动部署到 Art Blocks 等平台”。
- 不能把合成演示数据写成真实账号表现。

## 视觉素材

- 主视觉：`web/assets/genart-seed-grid.png`
- 来源：`projects/genart-skill-research/artifacts/grid.png`
- 内容：9 个确定性 seed 的联系表，带 hash 片段与 Palette / Density 特征
- 使用约束：不得裁切掉全部底部标签后仍声称画面展示了 feature 信息；配文必须说明它是研究 fixture 的输出
