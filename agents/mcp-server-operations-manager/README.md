# MCP Server Operations Manager

Monitor MCP servers, investigate tool failures, and prepare safe operational remediations.

## Run the standalone agent

Keep this directory intact and run Eve from the directory root:

```bash
npx eve@latest
```

The standalone agent works with information supplied in conversation. Integration variants add one channel or connection at a time without duplicating the base instructions.

## Available integration variants

slack, teams, github, manufact, datadog, honeycomb, sentry

## Source files

- `instructions.md` defines the role, workflow, tool policy, and guardrails.
- `agent.ts` selects the model through Eve.
- `skills/mcp-server-operations-manager.md` contains the domain playbook.
- `examples/sample-input.md` provides a verification prompt.
- `.env.example` is replaced with integration-specific setup guidance in each variant.
- `SETUP.md` explains how to run the downloaded directory.

## License

MIT
