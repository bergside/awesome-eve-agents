# Meeting Action Planner

An Eve agent that turns meeting notes into a decision log and owner-based action plan.

## Run it

Keep this directory intact, then run it with the Eve CLI from the directory root.

```bash
npx eve@latest
```

Paste a transcript or a set of rough notes and ask the agent to create the meeting record.

## Files

- `instructions.md` defines the agent's role, workflow, output, and guardrails.
- `agent.ts` selects the model through Eve's agent configuration.
- `skills/meeting-analysis.md` adds a focused extraction playbook.
- `examples/weekly-product-sync.md` is a short test input.

## License

MIT
