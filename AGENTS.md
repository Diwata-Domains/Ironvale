<!-- grain:workflow-instructions:start -->
## Grain Workflow

This repo uses [Grain](https://pypi.org/project/grain-kit/) for structured
task lifecycle management. All code changes must go through the workflow.

**Before modifying any code, run:**

```
grain workflow next --format json
```

This returns the current workflow state and next legal action. Feed the
output into your first prompt. Never skip straight to implementation or
work from chat context alone when no packet exists on disk.

If there is no active task packet yet, create or activate one through the
workflow before modifying code.

**Key commands:**

| Command | Purpose |
|---------|---------|
| `grain workflow next` | Current state + next action |
| `grain workflow run` | Activate the next ready task (auto-creates packet) |
| `grain task close --id TASK-#### --quick --summary "..."` | Close a completed task |
| `grain workflow reconcile --fix` | Repair drift across working docs |
| `grain phase close` | Seal a completed phase before advancing |

**Do not bypass the workflow.** Editing `docs/working/` files or task
packets directly without running `grain workflow run` first skips lifecycle
gates that enforce discipline and traceability.
<!-- grain:workflow-instructions:end -->
