# Awesome Eve Agents [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

<img width="1200" height="630" alt="Awesome Eve Agents" src="./awesome-eve.png" />

<br>

> A curated collection of 21 open-source agents for Eve, covering engineering, product, analytics, support, marketing, finance, research, and more. Install an agent from the command line, explore its source in this repository, or browse its available integrations on [EveAgents](https://www.eveagents.dev).

**[Browse all Eve agents](https://www.eveagents.dev)**

## Install an Agent

Install any standalone agent by its slug:

```bash
npx eveagents install incident-response-commander
```

The CLI creates an `incident-response-commander/` directory containing the complete agent. Run Eve from inside it:

```bash
cd incident-response-commander
npx eve@latest
```

List every available slug:

```bash
npx eveagents list
```

Use `--dir` to choose a parent directory, or `--force` to replace an existing agent directory:

```bash
npx eveagents install meeting-action-planner --dir ./agents
npx eveagents install meeting-action-planner --force
```

The CLI never replaces an existing destination unless you explicitly pass `--force`.

## Eve Agents

### Engineering

- [**Incident Response Commander**](https://www.eveagents.dev/engineering/incident-response-commander) — Investigate incidents, coordinate responders, and turn evidence into a clear recovery plan.
- [**Bug Triage Coordinator**](https://www.eveagents.dev/engineering/bug-triage-coordinator) — Turn scattered bug reports and telemetry into prioritized, reproducible engineering work.
- [**Release Readiness Manager**](https://www.eveagents.dev/engineering/release-readiness-manager) — Assess release risk across open work, errors, adoption signals, documentation, and deployment state.
- [**API Reliability Investigator**](https://www.eveagents.dev/engineering/api-reliability-investigator) — Diagnose failing APIs by connecting requests, logs, traces, monitors, and application errors.
- [**MCP Server Operations Manager**](https://www.eveagents.dev/engineering/mcp-server-operations-manager) — Monitor MCP servers, investigate tool failures, and prepare safe operational remediations.
- [**Database Health Analyst**](https://www.eveagents.dev/engineering/database-health-analyst) — Investigate database performance, query behavior, capacity, and operational risk without making unsafe changes.

### Product

- [**Product Feedback Synthesizer**](https://www.eveagents.dev/product/product-feedback-synthesizer) — Turn qualitative feedback and product signals into evidence-backed themes and opportunities.
- [**Sprint Planning Facilitator**](https://www.eveagents.dev/product/sprint-planning-facilitator) — Build a realistic sprint proposal from priorities, capacity, dependencies, and delivery risk.

### Productivity

- [**Meeting Action Planner**](https://www.eveagents.dev/productivity/meeting-action-planner) — Turn rough meeting notes into decisions, owners, and clear next steps.

### Analytics

- [**Feature Adoption Analyst**](https://www.eveagents.dev/analytics/feature-adoption-analyst) — Explain feature adoption, drop-off, cohorts, and unexpected behavior without overstating causality.

### Knowledge

- [**Knowledge Base Curator**](https://www.eveagents.dev/knowledge/knowledge-base-curator) — Answer internal questions with sources and turn stale, conflicting knowledge into reviewable updates.

### Customer Support

- [**Customer Support Triage Agent**](https://www.eveagents.dev/customer-support/customer-support-triage-agent) — Classify support requests, find grounded answers, draft replies, and prepare clean escalations.

### Customer Success

- [**Customer Onboarding Concierge**](https://www.eveagents.dev/customer-success/customer-onboarding-concierge) — Guide customers through onboarding with contextual next steps, progress tracking, and timely follow-up.

### Marketing

- [**Content Publishing Manager**](https://www.eveagents.dev/marketing/content-publishing-manager) — Prepare, review, publish, and verify content and media across modern website platforms.
- [**SEO Growth Analyst**](https://www.eveagents.dev/marketing/seo-growth-analyst) — Find evidence-backed search opportunities and turn them into prioritized content and site recommendations.
- [**Campaign Operations Coordinator**](https://www.eveagents.dev/marketing/campaign-operations-coordinator) — Coordinate campaign records, assets, tracked links, approvals, and cross-tool automations.

### Finance

- [**Revenue Operations Analyst**](https://www.eveagents.dev/finance/revenue-operations-analyst) — Reconcile revenue, payment, expense, cash, and operational records into a decision-ready report.
- [**Payment Support Investigator**](https://www.eveagents.dev/finance/payment-support-investigator) — Investigate failed payments, refunds, settlements, and customer payment questions safely.

### Events

- [**Event Operations Coordinator**](https://www.eveagents.dev/events/event-operations-coordinator) — Coordinate attendees, tickets, schedules, tasks, and event communications from one operational plan.

### Research

- [**Nonprofit Grant Researcher**](https://www.eveagents.dev/research/nonprofit-grant-researcher) — Find aligned funders, assess eligibility, and maintain an evidence-backed grant opportunity pipeline.

### Education

- [**Learning Path Coach**](https://www.eveagents.dev/education/learning-path-coach) — Build practical learning plans from trusted resources, exercises, available time, and progress.

## Quick Start

1. Run `npx eveagents list` or [browse the agent catalog](https://www.eveagents.dev) to find an agent.
2. Install its standalone source with `npx eveagents install <slug>`.
3. Open the new agent directory and review its `README.md` and `SETUP.md` when present.
4. Run Eve from the agent directory:

```bash
npx eve@latest
```

Every standalone agent works with information supplied directly in the conversation. If you need Slack, GitHub, Linear, Notion, or another supported integration, open the agent on [EveAgents](https://www.eveagents.dev) and choose the relevant variant.

## What Is an Eve Agent?

An Eve agent is a self-contained folder that defines its identity, workflow, model, domain knowledge, and optional integrations. A typical standalone agent includes:

- `instructions.md` — role, operating workflow, tool policy, and safety guardrails
- `agent.ts` — model configuration through Eve
- `skills/<agent-slug>.md` — focused domain playbook and quality checks
- `examples/sample-input.md` — a representative request for verification
- `.env.example` — required environment variable names without secret values
- `README.md` and `SETUP.md` — usage, file inventory, and setup guidance

Integration variants preserve the reusable base agent and add a single channel or connection, such as Slack, GitHub, Linear, Notion, PostHog, Stripe, or Supabase.

## Repository Structure

The standalone source for every published agent is versioned in this repository and bundled with the npm package:

```text
agents/
├── incident-response-commander/
│   ├── .env.example
│   ├── README.md
│   ├── SETUP.md
│   ├── agent.ts
│   ├── examples/
│   ├── instructions.md
│   └── skills/
└── ...
bin/eveagents.js       # CLI entry point
lib/cli.js             # Install and list commands
registry.json          # Slugs, metadata, paths, and EveAgents URLs
```

`npx eveagents install <slug>` resolves the slug through `registry.json` and copies the bundled directory without changing its internal file structure.

## Maintainer Sync

The committed agent directories are exported from the published standalone agents on EveAgents. Maintainers with production Supabase credentials can refresh them with:

```bash
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SECRET_KEY=... npm run sync:agents
```

The sync validates every slug and file path, rejects storage-backed or binary files, and replaces `agents/` and `registry.json` only after a complete export succeeds.

## Contributing

Contributions are welcome. To propose a new agent:

1. Make sure it is a reusable agent built for the Eve framework.
2. Open an issue with its purpose, category, and source or public EveAgents URL.
3. For CLI or documentation changes, submit a pull request with tests where appropriate.

## Related Projects

- [Eve](https://vercel.com/eve) — the open-source framework for building and running agents
- [EveAgents](https://www.eveagents.dev) — the searchable catalog, source browser, and download experience

## License

[MIT License](LICENSE.md) &copy; Bergside.

Built and maintained by [Bergside](https://github.com/bergside).
