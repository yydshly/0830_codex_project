# 研究协作指南

本仓库把每项研究视为一个可独立理解、复现和展示的子项目。提交代码之前，请确保读者无需依赖聊天记录也能理解你的研究过程。

## 新建项目

建议使用小写字母、数字和连字符组成目录名，例如 `rag-evaluation`。

```powershell
Copy-Item -Recurse templates/research-project projects/rag-evaluation
```

随后填写 `projects/rag-evaluation/project.json`：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `slug` | 是 | 与项目目录名完全一致 |
| `title` | 是 | 对外显示的项目名称 |
| `summary` | 是 | 一句话说明问题和研究价值 |
| `status` | 是 | `idea`、`active`、`paused` 或 `complete` |
| `tags` | 是 | 字符串数组，可为空 |
| `started_at` | 是 | `YYYY-MM-DD` |
| `updated_at` | 是 | `YYYY-MM-DD`，有实质进展时更新 |
| `demo_url` | 否 | 可公开访问的演示或报告地址 |

每个项目还必须包含 `README.md`。若项目需要独立依赖、工作流或许可证，请直接放在它自己的目录中。

## 项目生命周期

- `idea`：问题已经提出，但实验尚未开始。
- `active`：正在验证假设或构建原型。
- `paused`：暂时搁置，应在项目 README 中解释原因。
- `complete`：已形成有边界的结论；不表示永远不再更新。

## 同步和检查

项目元数据是索引与门户的唯一数据源。新增或修改项目后运行：

```powershell
python scripts/research_hub.py sync
python scripts/research_hub.py check
python scripts/research_hub.py build --output .tmp/research-site
```

`sync` 只改写根 README 中两个项目标记之间的内容。`check` 不写文件，适合 CI。`build` 生成可直接托管的静态站点。

## 提交建议

- 一次提交聚焦一个研究动作或基础设施变化。
- 数据文件应说明来源和许可；大文件优先使用外部可追溯存储。
- 不提交密钥、个人令牌、私有数据、构建产物和本机环境目录。
- 改变结论时保留旧结论的上下文，说明新证据为何改变了判断。

