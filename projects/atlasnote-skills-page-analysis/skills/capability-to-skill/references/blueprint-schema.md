# Skill blueprint schema

Complete these fields before generating a skill draft.

| Field | Required | Purpose |
| --- | --- | --- |
| `name` | yes | Lowercase, digits, and hyphens; describes the task rather than the source catalog |
| `repeated_task` | yes | The concrete recurring work or failure |
| `trigger` | yes | Distinguishes when to use the skill and near-miss situations |
| `outcome` | yes | The deliverable or changed state |
| `validation` | yes | Observable evidence that the outcome is acceptable |
| `primary_gap` | yes | Method, tool, constraint, verification, routing, or memory |
| `inputs` | situational | Information that cannot be safely discovered |
| `permissions` | situational | Local or external read/write authority and credential boundary |
| `patterns` | optional | One to six source patterns and the role each contributes |
| `resources` | derived | References, scripts, assets, or integrations justified by the workflow |

## Draft structure

```markdown
---
name: task-specific-name
description: "Do the repeated task and produce the outcome. Use when ...; do not use when ..."
---

# Task-specific title

State the outcome and preserved boundaries.

## Intake

- Discover safe context first.
- Ask only for missing information that materially changes the result.

## Workflow

1. Confirm the target, scope, and completion evidence.
2. Apply the minimum method or route.
3. Perform only authorized local or external actions.
4. Validate the result against the declared evidence.
5. Deliver the artifact and record actionable learning.

## Validation

Name reproducible checks and failing conditions.

## Safety and stop conditions

Name new authority, destructive operations, credential boundaries, failure recovery, and when to stop.

## Adapted patterns

List source patterns, their limited role, and provenance links. Do not paste source instructions.
```

## Resource decision

Add a resource only when the main file would become noisy or the task needs deterministic execution:

- `references/`: long domain knowledge, schemas, matrices, or examples.
- `scripts/`: repeatable parsing, transformation, generation, or validation.
- `assets/`: stable templates or deliverable inputs.
- Integration notes: required instance, version, authentication, read/write scope, preview path, and recovery behavior.

If none is justified, ship only `SKILL.md` and discovery metadata.
