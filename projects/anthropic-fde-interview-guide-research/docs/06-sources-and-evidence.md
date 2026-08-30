# 06｜来源与证据矩阵

## 1. 研究截止时间

本项目最后核对时间：**2026-08-30（Asia/Shanghai）**。

招聘页面、模型名称、技术文档和候选人政策可能变化。后续使用时应重新访问一手来源。

## 2. 核心来源

### A1｜Anthropic 当前 FDE 职位

- URL：[Forward Deployed Engineer](https://job-boards.greenhouse.io/anthropic/jobs/5302966008)
- 发布者：Anthropic（Greenhouse 招聘系统）
- 本项目用途：确认岗位存在、团队归属、职责、经验要求、技术产物和客户现场性质。
- 可支持的结论：客户嵌入、Claude 生产应用、MCP Server、子 Agent、Agent Skills、白手套部署、可复用模式和产品反馈。
- 不能支持的结论：固定面试轮次、具体面试题、各环节评分权重。

### A2｜Anthropic 候选人 AI 使用政策

- URL：[How to collaborate with Claude during our hiring process](https://www.anthropic.com/candidate-ai-guidance)
- 页面标注更新时间：2025-07-10；本项目于 2026-08-30 访问。
- 本项目用途：核对申请、Take-home、面试准备和现场面试是否允许使用 AI。
- 核心边界：准备面试可以使用 Claude；Take-home 和现场面试默认不允许，除非明确说明；申请第一稿应由候选人自己完成。

### A3｜Workflow 与 Agent 架构

- URL：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- 发布日期：2024-12-19；页面提醒部分工具生态已经变化。
- 本项目用途：定义 Workflow/Agent、架构选择顺序和常见模式。
- 核心结论：从简单方案开始；固定任务优先 Workflow；开放且不可预定义路径的任务才适合 Agent；复杂度必须通过效果证明。

### A4｜上下文工程

- URL：[Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- 发布日期：2025-09-29。
- 本项目用途：解释为什么 FDE 不能只掌握 Prompt Engineering。
- 核心结论：上下文包含指令、工具、MCP、外部数据、历史和状态；上下文是有限资源，应选择最小高信号信息并按需检索。

### A5｜Agent 工具设计

- URL：[Writing effective tools for agents — with agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- 发布日期：2025-09-11。
- 本项目用途：说明工具是确定性系统与非确定性 Agent 之间的契约。
- 核心结论：工具要职责清晰、输入明确、返回有意义且 Token 高效，并通过 Evals 迭代。

### A6｜Agent Evals

- URL：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- 发布日期：2026-01-09。
- 本项目用途：定义 Task、Trial、Grader、Trace、Outcome、Harness、Suite 和非确定性指标。
- 核心结论：结合代码、模型与人工评分；检查结果和必要轨迹；从真实任务与失败开始；评测环境本身也必须稳定。

### A7｜MCP 官方文档

- URL：[What is the Model Context Protocol?](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)
- 文档版本路径：2026-07-28；本项目于 2026-08-30 访问。
- 本项目用途：定义 MCP 的范围。
- 核心结论：MCP 是连接 AI 应用与外部数据、工具和工作流的开放标准；它降低集成复杂度，但不会自动解决权限、质量和安全。

### B1｜待研究的第三方页面

- URL：[Anthropic Forward Deployed Engineer (FDE) Interview Guide](https://www.chillinterview.com/learn/interview-guides/anthropic-forward-deployed-engineer-fde-interview-guide)
- 发布者：Chill Interview
- 本项目用途：研究对象、能力地图、可能题型和回答框架。
- 访问边界：无登录时正文在 Enterprise AI System Design 的十步框架后停止，后续需要注册或付费。
- 证据限制：可证明“页面如何描述面试”，不能单独证明“Anthropic 实际一定如此面试”。

## 3. 关键主张核验表

| 主张 | 页面来源 | 官方核验 | 判断 |
| --- | --- | --- | --- |
| FDE 进入战略客户环境构建 Claude 应用 | B1 | A1 明确确认 | 已确认 |
| FDE 交付 MCP、子 Agent、Skills | B1 | A1 明确确认 | 已确认 |
| FDE 需要 Python 和生产 LLM 经验 | B1 | A1 明确确认 | 已确认 |
| FDE 需要客户发现、高主动性和跨组织合作 | B1 | A1 明确确认 | 已确认 |
| Prompt 之外需要上下文、工具和 Evals | B1 | A3–A6 支持 | 已确认技术方向 |
| MCP 是连接外部系统的标准 | B1 | A7 支持 | 已确认 |
| 面试包含页面列出的全部轮次 | B1 | 无统一官方流程 | 未确认，只能作准备假设 |
| Coding 更偏 API/MCP/Eval 而非 DSA | B1 | 职责逻辑支持，但无官方题型 | 合理推断，未确认 |
| 具体题目是常见 Anthropic FDE 题 | B1 | 无官方题库 | 未确认 |
| 准备面试可用 Claude、现场默认不可用 | B1 | A2 明确确认 | 已确认，仍需遵循当次说明 |

## 4. 事实、推断与建议的区别

### 事实

可以从当前一手资料直接观察，例如官方职位列出 MCP Server、子 Agent 和 Agent Skills。

### 推断

从职责逻辑推导但没有官方面试说明，例如“实用 API 编码比纯 LeetCode 更贴近岗位”。这可以指导准备，但不能宣称为必考内容。

### 建议

本项目为了转化为行动而提出，例如四周计划、六区块系统设计和客服 Agent 作品规格。它们不来自页面原文，也不是 Anthropic 官方要求。

## 5. 时效性检查清单

每次使用本项目进行实际求职前重新确认：

- FDE 职位是否仍开放，目标地区和团队是什么；
- 工作地点、出差和现场办公要求；
- 年限、语言和行业经验要求；
- Claude 平台当前支持的 Agent、MCP 和 Skills 能力；
- Candidate AI Guidance 是否更新；
- Recruiter 给出的具体面试轮次、Take-home 和工具规则。

## 6. 版权与访问原则

本项目对第三方页面做分析和概括，没有复制其完整正文，也没有尝试绕过注册或付费限制。需要读取付费部分的读者应通过页面提供的正规方式获得访问，并继续把第三方材料与官方信息区分开。
