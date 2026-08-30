# Minimal capability selection audit

Use this audit when adapting multiple patterns, including an external connector, or deciding whether the selected patterns actually address the repeated failure.

## 1. Check primary-gap fit

Choose one primary gap and look for at least one matching capability. Do not require every category.

| Primary gap | Useful evidence in the selected pattern | Typical minimal shape |
| --- | --- | --- |
| Method | Professional steps or decision points change the outcome | Narrow workflow or rules |
| Tool | Deterministic execution reaches the real target | Executor; connector only when remote access is required |
| Constraint | Allowed, forbidden, or fixed elements reduce drift | Rules or owned assets |
| Verification | Failure and success can be distinguished reproducibly | Evaluator, test, or explicit quality gate |
| Routing | Similar tasks select different capabilities reliably | Discriminating descriptions; router after overlap is observed |
| Memory | Sources and decisions can be retrieved, updated, and deleted | Knowledge schema or provenance workflow |

If no selected pattern matches the primary gap, recommend one smallest missing shape. Do not compensate by adding several adjacent collections.

## 2. Remove role overlap

Group patterns by the work-chain role they primarily serve. Two patterns in the same role are acceptable only when they have distinct triggers, tools, audiences, or validation responsibilities.

Prefer removal when:

- multiple broad workflows claim the same start-to-finish task;
- a collection duplicates a narrow skill already selected;
- two rule sets impose conflicting defaults;
- a router exists only to manage abilities that could have discriminating descriptions.

The target is a coherent minimum, not maximum stage coverage.

## 3. Identify real prerequisites

For every script, CLI, API, MCP, database, browser identity, or remote instance, record:

- availability and required version;
- authentication and credential owner;
- read versus write scope;
- preview, dry-run, or read-only path;
- expected failure signal and recovery boundary;
- license or policy constraints on code, content, and assets.

An unavailable prerequisite makes the integration unverified. It does not make the instruction-only parts unusable, and it does not grant authority to install or connect anything.

## 4. Check maturity honestly

Use these levels as evidence labels, not as mandatory milestones:

- **L0 — Prompt:** one-off instruction only.
- **L1 — Repeatable:** trigger, input, steps, and output are stable.
- **L2 — Executable:** authorized tools change a real artifact or system.
- **L3 — Verifiable:** failing and passing outcomes are distinguishable.
- **L4 — Improving:** sourced failure evidence drives narrow updates.

Most useful personal skills can stop at L1 or L2. Advance only when the user's task needs the additional capability and the evidence is available.

## 5. Report the decision

Return four concise findings:

1. primary gap and whether it is covered;
2. distinct roles retained and overlaps removed;
3. external prerequisites and current verification state;
4. one next validation task.

Do not turn the audit into a generic architecture review or broaden the user's requested workflow.
