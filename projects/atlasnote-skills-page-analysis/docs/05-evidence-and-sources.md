# 证据、来源与研究边界

## 1. 观察环境

- 日期：2026-08-30 至 2026-08-31
- 目标：https://atlasnote.ai/zh-CN/skills
- 登录状态：未登录
- 桌面视口：1440×1000
- 移动视口：390×844
- 修改目标网站：无
- 外部安装或 GitHub 写操作：无

## 2. 截图证据

| 编号 | 文件 | 状态 | 用途 |
| ---: | --- | --- | --- |
| 00 | [目录完整长图](../evidence/screenshots/00-directory-full.png) | 已接受 | 检查完整列表密度与页面长度 |
| 01 | [桌面目录首屏](../evidence/screenshots/01-directory-top.png) | 已接受 | 页面定位、分类、搜索、卡片网格 |
| 02 | [设计与视频分类](../evidence/screenshots/02-category-design-video.png) | 已接受 | 分类选中与结果更新 |
| 03 | [PPT 搜索](../evidence/screenshots/03-search-ppt.png) | 已接受 | 搜索结果、焦点环、清除按钮 |
| 04 | [搜索空状态](../evidence/screenshots/04-search-empty.png) | 已接受 | 零结果文案与恢复建议 |
| 05 | [详情页首屏](../evidence/screenshots/05-detail-top.png) | 已接受 | 交付承诺、摘要、标签、GitHub CTA |
| 06 | [详情正文](../evidence/screenshots/06-detail-body.png) | 已接受 | 使用示例、元数据和同类技能 |
| 07 | [移动端目录](../evidence/screenshots/07-mobile-directory.png) | 已接受 | 响应式导航、分类、搜索与单列卡片 |
| 08 | [移动端菜单](../evidence/screenshots/08-mobile-menu.png) | 已接受 | 移动导航、登录与语言 |
| 09 | [更多筛选](../evidence/screenshots/09-more-filters.png) | 已接受 | 隐藏分类和按钮语义 |
| 10 | [移动端详情](../evidence/screenshots/10-mobile-detail.png) | 已接受 | 详情页移动重排与 CTA 可见性 |

## 3. 外部来源

### A 级：目标网站直接证据

- [Atlasnote Skills 目录](https://atlasnote.ai/zh-CN/skills)
- [小而可改的工程 skill 集详情页](https://atlasnote.ai/zh-CN/skills/mattpocock-skills)
- [Taste Skill 详情页](https://atlasnote.ai/zh-CN/skills/taste-skill)
- [SwarmVault 详情页](https://atlasnote.ai/zh-CN/skills/swarmvault)
- [关于 Atlasnote](https://atlasnote.ai/zh-CN/about)

### B 级：底层格式和平台机制

- [Agent Skills 开放规范与文档](https://github.com/agentskills/agentskills)
- [OpenAI Skills API 参考](https://developers.openai.com/api/reference/go/resources/skills)
- [Claude Skills 概览](https://claude.com/docs/skills/overview)

### C 级：被目录收录的原始项目示例

- [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [joeseesun/qiaomu-goal-meta-skill](https://github.com/joeseesun/qiaomu-goal-meta-skill)
- [Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills)
- [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)
- [openags/paper-search-mcp](https://github.com/openags/paper-search-mcp)
- [shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- [swarmclawai/swarmvault](https://github.com/swarmclawai/swarmvault)

九个代表项目的逐项事实、未验证边界和采用判断见[九类代表项目原仓库核验](12-representative-source-verification.md)。

## 4. 证据等级

| 等级 | 定义 | 本报告中的使用方式 |
| --- | --- | --- |
| O | 本次截图或页面结构直接观察 | 支撑布局、流程和交互结论 |
| S | Atlasnote 自身页面声明 | 说明其策展定位和内容主张 |
| P | Agent Skills 或平台官方资料 | 解释 Skill 运行机制和边界 |
| R | 原始 GitHub 仓库 | 核对项目形态、安装和作者说明 |
| I | 从 O/S/P/R 推导出的研究判断 | 明确作为建议或推断，不冒充事实 |

## 5. 已确认事实

- 目录在观察时显示 81 个条目。
- 页面提供分类、搜索、空结果、更多筛选、卡片和详情页。
- 详情页提供交付摘要、适用人群、用法、作者、Star、版本、标签和 GitHub 链接。
- 目录中存在多种项目形态，并非只有单一 `SKILL.md`。
- 页面在桌面和移动视口均可重排。
- 搜索结果即时更新，搜索框具有可见焦点环。
- 九种能力形态各选取一个代表条目，并已把 Atlasnote 详情页指向的原始仓库与项目身份逐项对齐。
- 九个代表并非同一种交付物：它们分别可能是行为规则、Skill 集、元技能、工作流、CLI/MCP、组件注册表、评测规则或知识系统。
- 目录摘要可能落后于原仓库；例如 Atlasnote 观察文本写 Impeccable 有 59 条规则，而 2026-08-31 原仓库 README 写 61 条。

## 6. 网站自身声明

- Atlasnote 将自己描述为独立 AI 研究与知识实践平台。
- 创建者称会持续研究并亲自验证 AI 工具、Agents、Skills 和工作流。
- 网站强调“真正有用、进入真实工作、沉淀为长期系统”。

这些是网站自己的定位说明，不等同于第三方认证。

## 7. 研究推断

- 分类数量大于总数是由于多标签重叠。
- 默认顺序视觉上与 Star 高低高度相关，但页面未明确声明排序算法。
- 登录可能计划用于账户、课程或个性化，但本次未验证登录后能力。
- Star 与版本可能来自源仓库快照，但页面未公开同步频率。
- “更多筛选 1”中的 1 表示一个隐藏分类，而非一个已应用条件。

## 8. 未验证范围

- 登录、收藏、订阅、课程购买和个性化推荐。
- 页面源代码、后端、数据库、同步任务和搜索算法。
- 除九个代表外，其余 72 个详情页与原始仓库的一致性。
- 九个代表项目均未在本项目中安装或运行，因此原仓库文档可支持“它声明如何工作”，不能支持“已在本机可用”。
- 每个外部仓库在用户环境中的实际安装成功率、安全性和 Codex 兼容性。
- 性能指标、慢网体验、图片懒加载和异常网络恢复。
- 键盘全流程、屏幕阅读器、对比度、200%/400% 缩放。
- GitHub 跳出后的安装成功率和用户留存。

## 9. 结论边界

本报告可以支持以下判断：

- 页面如何组织和解释项目；
- 公开浏览路径的主要优点与摩擦；
- 用户如何把目录用于发现和初筛；
- 哪些信息缺口阻碍安全安装决策；
- 九种形态的代表项目当前是什么项目类型、需要哪些前置和权限，以及哪些能力仍待运行核验；
- 产品下一阶段的合理扩展顺序。

本报告不能证明：

- Atlasnote 对所有条目完成了安全审计；
- 条目数量、Star 和版本始终实时；
- 任一第三方 Skill 在用户环境中一定有效；
- 九个代表项目已在本项目环境中安装、执行或通过安全审计；
- 页面达到完整 WCAG 合规；
- 登录后不存在本报告未见的功能。
