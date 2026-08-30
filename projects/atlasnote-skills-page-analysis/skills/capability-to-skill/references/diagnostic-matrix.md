# Capability diagnosis matrix

Use this matrix to move from a repeated failure to a minimal skill form. Pick one primary gap; supporting gaps can become validation or resources inside the same skill.

| Observed failure | Primary gap | Minimal skill form | Useful supporting resource | Evidence of improvement |
| --- | --- | --- | --- | --- |
| The agent improvises a different professional process each time | Method | Narrow workflow in `SKILL.md` | Decision table in `references/` | Same task follows the intended stages and handles a known branch |
| The agent knows what to do but cannot affect the real system | Tool | Tool-specific skill with preconditions and safety gates | Small deterministic script or MCP/CLI reference | A read-only or preview path succeeds before an authorized write |
| Output style, scope, or choices drift | Constraint | Rules plus allowed/forbidden examples | Template or design tokens in `assets/` | Known violations are rejected without reducing required content |
| Work is declared complete without proof | Verification | Evaluator or explicit quality gate | Test script, checklist, or browser route | A failing fixture fails and a valid fixture passes |
| Similar skills activate together or the wrong one is chosen | Routing | Discriminating descriptions first; router only if needed | Comparison table in `references/` | Positive and near-miss prompts select different paths |
| Sources, decisions, or lessons are lost between runs | Memory | Retrieval/update workflow with provenance | Schema and retention rules in `references/` | Stored context can be retrieved, updated, and deleted by source |

## Adoption modes

Classify each external pattern before adapting it:

| Mode | Meaning | Typical shape | What to do |
| --- | --- | --- | --- |
| Direct use | The package already matches the task, environment, and validation need | Deterministic executor or narrow rules | Install or copy only after checking source, license, dependencies, and target scope |
| Compose | The pattern covers one stage and needs complementary roles | Workflow, collection, or router | Keep responsibilities distinct; avoid overlapping full-stack collections |
| Adapt | The structure is valuable but the instructions or assets are domain-specific | Rules, evaluator, assets, or knowledge | Rewrite around the user's task and preserve provenance instead of copying text |
| Integration required | Real value depends on an instance, credentials, API, MCP, or write permission | Connector or external executor | Verify prerequisites and start with read-only, preview, or dry-run behavior |

## Permission tiers

- **Instruction only:** changes model behavior but not external state.
- **Local execution:** may create or edit files in an authorized project.
- **External read:** accesses remote data or a connected system without mutation.
- **External write:** changes a remote system or communicates externally; require explicit scope and recovery behavior.

The source catalog's label does not grant permission. The user's request and the current environment determine authority.
