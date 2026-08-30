# 核心契约 RFC v0.1

## 1. 状态

- 状态：Draft；
- 目标：在技术栈选择前冻结跨模块概念和演进规则；
- 范围：模型、地图、场景、运行、指令、事件、快照和插件；
- 格式：示例使用 JSON/YAML，最终序列化方案由 Spike 决定。

## 2. 通用规则

所有持久化或跨边界对象必须包含：

- 稳定 ID；
- `schema_version`；
- 创建/更新元数据；
- 内容校验值；
- 明确单位；
- 未知字段处理策略；
- 向前/向后兼容声明。

破坏性变更必须提升主版本并提供迁移器；运行过程中不隐式迁移模型或场景。

## 3. ModelPackage

```yaml
schema_version: model-package/v1
id: example.scout
version: 1.0.0
display_name: Synthetic Scout
components:
  - type: transform/v1
  - type: route-mover/v1
    config_schema: schemas/route-mover.json
  - type: command-receiver/v1
assets:
  visual: assets/scout-symbol.svg
validation:
  scenarios:
    - tests/straight-line.yaml
compatibility:
  engine_api: ">=0.1 <0.2"
integrity:
  digest: pending
```

模型包不得包含外部绝对路径、隐式运行依赖或未声明的网络访问。

## 4. MapSpec

```yaml
schema_version: map/v1
id: synthetic-valley
version: 1.0.0
coordinate_system:
  type: local-cartesian
  unit: meter
  axis: right-handed
bounds:
  min: [0, 0]
  max: [10000, 10000]
layers:
  - id: road-network
    type: polyline
  - id: obstacles
    type: polygon
zones:
  - id: blue-spawn
    type: spawn
  - id: red-spawn
    type: spawn
```

地图只描述空间和环境资产，不包含阵营部署、行为和胜负规则。

## 5. ScenarioSpec

```yaml
schema_version: scenario/v1
id: synthetic-valley-demo
version: 0.1.0
map:
  id: synthetic-valley
  version: 1.0.0
simulation:
  start_time: 0
  end_time: 1800
  default_mode: paused
  seed: 20260830
factions:
  - id: blue
  - id: red
entities:
  - id: blue-scout-01
    faction: blue
    model: { id: example.scout, version: 1.0.0 }
    initial_state: { position_m: [1000, 2000] }
objectives:
  - type: synthetic-zone-entry/v1
    zone_id: center-zone
metrics:
  - command-completion/v1
  - zone-entry-time/v1
```

ScenarioSpec 在创建 RunManifest 前解析所有版本范围为精确版本。

## 6. SimulationCommand

```json
{
  "schema_version": "command/v1",
  "command_id": "cmd-000123",
  "issuer": { "type": "operator", "id": "local-user" },
  "target_id": "blue-scout-01",
  "command_type": "set-destination/v1",
  "issued_wall_time": "2026-08-30T10:00:00Z",
  "effective_sim_time": 42.0,
  "parameters": { "destination_m": [2400, 1800] },
  "preconditions": ["entity-active"],
  "expires_at_sim_time": 60.0,
  "correlation_id": "interaction-7788"
}
```

`issued_wall_time` 只用于审计，不参与结果计算。

## 7. EventEnvelope

```json
{
  "schema_version": "event-envelope/v1",
  "event_id": "evt-000987",
  "run_id": "run-001",
  "simulation_time": 42.0,
  "phase": "Command",
  "sequence_number": 987,
  "source_id": "command-gateway",
  "event_type": "command-status-changed/v1",
  "payload": {
    "command_id": "cmd-000123",
    "from": "Submitted",
    "to": "Scheduled"
  },
  "causation_id": "cmd-000123",
  "correlation_id": "interaction-7788"
}
```

事件一旦提交到权威日志不可修改；修正通过新事件表达。

## 8. StateDelta

StateDelta 面向态势投影，不替代领域事件：

```json
{
  "schema_version": "state-delta/v1",
  "run_id": "run-001",
  "simulation_time": 42.1,
  "entity_id": "blue-scout-01",
  "component": "transform/v1",
  "revision": 121,
  "changes": {
    "position_m": [1012.0, 2004.0],
    "heading_rad": 0.32
  }
}
```

UI 发现 revision 不连续时必须请求快照，不能猜测缺失状态。

## 9. RunManifest

```yaml
schema_version: run-manifest/v1
run_id: run-001
engine:
  version: 0.1.0
scenario:
  id: synthetic-valley-demo
  version: 0.1.0
  digest: pending
resolved_models:
  - id: example.scout
    version: 1.0.0
    digest: pending
randomness:
  master_seed: 20260830
execution:
  determinism_target: D2
  platform: pending
artifacts:
  event_log: events.bin
  snapshot_index: snapshots.json
  result_summary: summary.json
```

运行开始后 Manifest 的解析部分不可修改；操作性元数据可以写入单独的 RunRecord。

## 10. Snapshot

Snapshot 是内核内部兼容契约，不直接暴露给 UI。必须包含：

- Run ID、SimulationTime、事件序号；
- 完整实体组件状态；
- RNG 流；
- 待处理事件；
- 未完成指令；
- Schema 和引擎版本；
- 校验值。

快照迁移只支持明确列出的版本路径；无法迁移时必须拒绝恢复。

## 11. 插件清单

```yaml
schema_version: plugin-manifest/v1
id: example.alternate-mover
version: 0.1.0
plugin_type: mover
engine_api: ">=0.1 <0.2"
entrypoint: pending
capabilities:
  reads: [transform, route]
  writes: [transform]
  commands: [set-destination/v1, stop/v1]
permissions:
  filesystem: none
  network: none
failure_policy: stop-plugin
validation:
  scenarios: [tests/basic-route.yaml]
```

插件默认无网络、无任意文件系统访问、无动态下载能力。是否采用进程内、WASM 或子进程隔离由 Spike 决定。

## 12. 契约测试

每个契约必须提供：

- 正常夹具；
- 缺失字段；
- 未知字段；
- 旧版本迁移；
- 非法单位；
- 非法引用；
- 重复 ID；
- 校验值不匹配；
- 插件版本不兼容；
- 序列化往返一致性。

任何跨模块功能没有契约测试，不得进入主分支。
