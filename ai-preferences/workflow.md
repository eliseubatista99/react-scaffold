# Implementation Workflow

1. Inspect the relevant code, tests, and project conventions before proposing or making changes.
2. Identify the root cause and the intended behavior; clarify consequential ambiguity rather than making a risky assumption.
3. Implement a focused solution that covers the relevant public surfaces and preserves unrelated work.
4. Add or update tests for the changed behavior and run the applicable validation commands.
5. Summarize the changes and verification results, including any known limitations.

Version control actions are governed by [version-control.md](./version-control.md).

## Agent Collaboration

- When the task benefits from parallel specialist work, organize agents as one orchestrator plus as many specialist agents as needed.
- The orchestrator owns coordination, task decomposition, dependencies, integration, and final verification.
- Give each specialist agent a clearly bounded task aligned with a distinct technical or knowledge area.
- Keep work independent where possible, and have the orchestrator reconcile results and ensure the complete solution is consistent.
- Do not add agents when the task is small, sequential, or does not benefit from specialization.
