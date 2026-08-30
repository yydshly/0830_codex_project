# 总体架构与 ADR v0.1

## 1. 架构目标

1. 保证仿真时间、事件顺序和状态修改只有一个权威来源。
2. 允许模型、运动、行为、指标和显示图层独立扩展。
3. 支持从配置完成第二个场景，而非复制第一个 Demo。
4. UI 与内核通过命令、查询、快照和事件解耦。
5. 单机离线即可运行，后续保留远程控制面和多实例可能性。
6. 所有运行可记录、重建、比较和回放。

## 2. 系统上下文

```text
模型制作人员 ─┐
场景制作人员 ─┼─→ Simulation Workbench
仿真控制人员 ─┤       │
观察分析人员 ─┘       ├─→ 本地模型/地图/场景资产库
扩展开发人员 ───────→ Plugin SDK
                        │
                        └─→ 合成仿真运行与结果制品
```

第一版没有外部现实系统参与者。

## 3. 容器划分

### 3.1 Workbench UI

职责：模型/地图/场景最小编辑、运行控制、指令交互、态势显示、时间轴和结果比较。

禁止：直接修改仿真状态、持有内核插件、推断缺失事件。

### 3.2 Control API

职责：资产 CRUD、Schema 校验、运行创建、指令提交、快照查询、结果索引和本地身份权限。

它是 UI 与内核之间的防腐层，不承担仿真计算。

### 3.3 Simulation Host

职责：加载精确版本资产、创建内核实例、推进时间、处理事件、执行模型、生成日志和快照。

MVP 每个 Host 同时运行一个仿真实例；并行运行后续通过多个 Host 进程实现。

### 3.4 Asset Registry

职责：管理模型包、地图、场景、插件和 Schema；解析版本、依赖和校验值。

MVP 可以使用本地目录和索引数据库，但必须通过 Registry 接口访问，不能让模块扫描任意目录。

### 3.5 Run Artifact Store

职责：保存 RunManifest、事件日志、快照、结果摘要和诊断信息。MVP 使用本地可迁移目录。

### 3.6 Projection/Replay Service

职责：把事件和状态增量投影为 UI 读模型，提供快照、时间跳转和离线回放。MVP 可以与 Simulation Host 同进程部署，但代码边界独立。

## 4. Simulation Host 组件

```text
SimulationHost
├─ RunLoader
├─ SimulationClock
├─ EventScheduler
├─ CommandGateway
├─ EntityRepository
├─ ComponentRuntime
├─ RandomStreamRegistry
├─ InteractionRuntime
├─ MetricRuntime
├─ SnapshotManager
├─ EventJournal
└─ ProjectionPublisher
```

### 4.1 EntityRepository

实体只保存稳定 ID、阵营和组件实例。组件使用组合而非深继承。组件访问其他状态必须经过显式只读接口或事件。

### 4.2 CommandGateway

负责幂等、Schema、权限、目标能力、前置条件和生效时间检查；验证后只向 EventScheduler 提交事件。

### 4.3 EventScheduler

唯一推进领域事件的调度器。不得由网络线程、UI 线程或插件线程直接调用组件更新。

### 4.4 ProjectionPublisher

按配置频率发布 UI 所需状态增量；领域事件不能为了 UI 帧率而改变处理频率。

## 5. 运行数据流

```text
资产选择
→ Registry 解析精确版本和校验值
→ 生成 RunManifest
→ Simulation Host 加载场景与插件
→ 初始快照
→ 仿真事件循环
→ EventJournal + StateDelta
→ Projection/Replay
→ Workbench UI
→ 结束摘要和制品封存
```

## 6. 指令数据流

```text
UI / BehaviorPlugin
→ SimulationCommand
→ Control API（身份与请求校验）
→ CommandGateway（仿真语义校验）
→ EventScheduler
→ CommandHandlerPlugin
→ 状态变化与领域事件
→ CommandStatusChanged
→ UI 状态反馈与审计
```

任何“快捷操作”也必须走这条路径。

## 7. 态势显示架构

态势显示采用 CQRS 风格读模型：

- `WorldProjection`：当前实体位置和可视状态；
- `CommandProjection`：指令生命周期；
- `TimelineProjection`：关键事件和书签；
- `MetricProjection`：阵营和场景指标；
- `AssetProjection`：模型、地图和场景元数据。

UI 首次连接获取投影快照，随后消费带 revision 的增量。revision 断裂时重新取快照。

## 8. 扩展点

| 扩展点 | 输入 | 输出 | 首版示例 |
| --- | --- | --- | --- |
| MoverPlugin | 时间、路线、Transform | 新 Transform、运动事件 | RouteMover |
| BehaviorPlugin | 受限观察、目标、状态 | SimulationCommand | SimpleStateMachine |
| CommandHandlerPlugin | Command、实体状态 | 状态变化、事件 | SetDestinationHandler |
| InteractionPlugin | 合成实体和区域状态 | 抽象交互事件 | ZoneContact |
| MetricPlugin | 事件流 | 指标状态和摘要 | ZoneEntryTime |
| VisualizationLayerPlugin | 读模型 | UI 图层描述 | RouteLayer |
| EngineAdapter | 外部授权引擎契约 | 标准事件/运行制品 | MVP 不实现 |

插件只能使用 Capability API，不能链接或反射访问内部对象。

## 9. 部署拓扑

### MVP

```text
Desktop / Localhost
├─ Workbench UI
├─ Control API
├─ Simulation Host
├─ Projection/Replay
└─ Local Asset & Run Stores
```

默认不访问互联网，安装包携带全部运行依赖和合成样例。

### 后续候选

- UI 与 Host 分进程；
- 多 Run Host 池；
- 远程只读观察端；
- 批量实验调度；
- 授权的联合仿真适配。

这些都不进入 MVP 承诺。

## 10. 安全与供应链

- 插件、模型包和场景都需要校验值；
- 默认禁止插件网络和任意文件访问；
- 导入包先解压到隔离临时区并校验路径穿越；
- 所有指令记录 issuer、目标、时间和状态；
- 资产目录不允许执行未声明脚本；
- 日志不得保存外部敏感数据；
- 示例资产全部原创和合成；
- 发布包生成 SBOM、版本清单和离线安装说明。

## 11. ADR 清单

### ADR-001：模块化单体优先

- 状态：Accepted；
- 决策：内核首版为单进程模块化单体；UI/API 可独立进程；
- 原因：先保证确定性、调试和回放，再讨论分布式；
- 复审触发：单 Host 无法满足经过实测的并行或隔离需求。

### ADR-002：命令与事件是唯一跨边界写入路径

- 状态：Accepted；
- 决策：外部只提交 Command，内部状态变化以 Event 记录；
- 原因：审计、复现和 UI 解耦；
- 代价：需要设计 Schema 和幂等。

### ADR-003：地图与场景分离

- 状态：Accepted；
- 决策：地图描述空间，场景描述实体、阵营、规则和指标；
- 原因：同图复用与独立版本演进。

### ADR-004：组合优于实体继承层级

- 状态：Accepted；
- 决策：Entity + Components；
- 原因：支持不同运动、行为和显示组合；
- 风险：组件写入冲突，需要所有权规则。

### ADR-005：事件调度 + Mover 时间步

- 状态：Proposed；
- 决策：全局离散事件，运动组件按显式步长推进；
- 验证：Determinism Spike。

### ADR-006：事件日志 + 周期快照

- 状态：Proposed；
- 决策：领域事件不可变，快照加速恢复和跳转；
- 验证：Replay Spike 的存储与跳转时间。

### ADR-007：插件隔离方式

- 状态：Open；
- 候选：进程内 ABI、稳定 C API、WASM、子进程 RPC；
- 选择标准：性能、崩溃隔离、跨语言、离线供应链和调试体验；
- 下一动作：Plugin Spike。

### ADR-008：内核技术栈

- 状态：Open；
- 候选：C++、Rust、JVM/.NET 或其他成熟运行时；
- 不以偏好选择；用事件吞吐、确定性、插件、调试、团队能力和打包 Spike 决定。

### ADR-009：地图渲染技术

- 状态：Open；
- 候选：Canvas/WebGL/现有地图库；
- 选择标准：合成本地坐标支持、数十到目标规模实体刷新、图层插件、离线资源和拾取交互。

## 12. 架构评审门槛

1. 每个跨模块写操作都有明确命令或事件；
2. 每项状态有唯一权威所有者；
3. UI 断开不会改变仿真结果；
4. 新 Mover 和新图层无需修改核心；
5. 相同 Manifest 可达到 D2；
6. 快照可以恢复 RNG、队列和未完成指令；
7. 第二场景复用现有契约；
8. 所有开放 ADR 都有对应 Spike，不能凭会议结论伪装为已验证。
