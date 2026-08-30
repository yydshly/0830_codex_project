---
name: capability-to-skill
description: "Turn a repeated workflow or an external capability pattern into a minimal, testable Codex skill. Use when the user wants to adapt an Agent Skill, SOP, checklist, tool workflow, or recurring task into their own skill; do not use merely to install or summarize a third-party skill."
---

# Capability To Skill

Convert a real repeated task into the smallest useful capability package. Preserve the user's task, authority, data boundaries, and existing workflow while adapting patterns.

## 1. Diagnose the missing capability

Start from one recent or recurring task, not from a skill catalog. Ask only for information that cannot be discovered safely. Identify the primary gap:

- **Method:** the work lacks reliable professional steps or decision criteria.
- **Tool:** the steps are known but the agent cannot perform the real action.
- **Constraint:** results drift because boundaries or allowed choices are vague.
- **Verification:** output exists but success cannot be demonstrated.
- **Routing:** several abilities overlap and the agent does not know which one to activate.
- **Memory:** useful context, sources, or lessons do not persist between runs.

Read [references/diagnostic-matrix.md](references/diagnostic-matrix.md) when the gap or adoption mode is unclear.

## 2. Define the skill contract

Write down these fields before creating files:

1. Repeated task and desired outcome.
2. Discriminating trigger: when this skill should and should not activate.
3. Required inputs and what can be discovered.
4. Smallest workflow that changes the outcome.
5. Deliverable and observable validation.
6. Permissions, external systems, destructive operations, and stop conditions.
7. One to six borrowed patterns and why each is relevant.

Do not copy a third-party skill's nontrivial text, code, or assets without compatible permission. Extract the capability pattern in original language and link the source for provenance.

When the draft borrows more than one pattern, includes a connector, or has uncertain fit with the primary gap, read [references/selection-audit.md](references/selection-audit.md) before choosing the package. The audit should remove overlap and identify prerequisites; it must not force every skill to cover the full delivery chain.

## 3. Choose the smallest package

Default to a concise `SKILL.md`. Add resources only when they improve reliability:

- `references/` for knowledge, schemas, decision matrices, or long examples loaded on demand.
- `scripts/` for deterministic, repetitive transformation or validation.
- `assets/` for templates or files copied into deliverables.
- MCP, CLI, or API integration only when the task requires changing an external system.
- `agents/openai.yaml` for discovery metadata and an explicit `$capability-to-skill` default prompt.

Avoid creating a broad collection when one narrow skill will solve the repeated task. If several responsibilities have distinct triggers or permissions, split them into separate skills and add a router only after overlap is observed.

## 4. Draft the skill

Use [references/blueprint-schema.md](references/blueprint-schema.md) as the field and section contract. Keep the frontmatter description discriminating enough for discovery. Put trigger information in `description`, not only in the body.

Order instructions by the user's actual journey:

```text
intake -> method or route -> action -> validation -> delivery -> learning
```

For risky or external actions, state preconditions, required authorization, preview or dry-run behavior, exact stop conditions, and recovery boundaries. Do not infer authority from the existence of a connector.

## 5. Place and validate

If the user supplied a target skill directory, create the skill there. If no target was supplied, produce a project-local draft and explain that global installation needs an explicit destination. Never silently write into a global skills directory.

Use the skill-creator initializer when available, then validate the finished directory with `quick_validate.py`. Inspect all referenced paths, remove placeholder files, and test at least one positive trigger and one near-miss trigger. Add deterministic or browser validation when the skill creates runnable artifacts.

## 6. Deliver the adoption decision

Report:

- what failure the skill addresses;
- whether the source pattern was used directly, composed, adapted, or requires integration;
- which files were created;
- how success was checked;
- what remains dependent on credentials, tools, licensing, or user authority.

Do not claim that a draft is installed, that an integration works without exercising it, or that a borrowed pattern has been validated on the user's task without evidence.
