# Awesome Eve Agents [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

<img width="1200" height="630" alt="Awesome Eve Agents" src="./awesome-eve.png" />

<br>

> A curated collection of 20 open-source agents for Eve, covering engineering, product, analytics, support, marketing, finance, research, and more. Explore every agent, its source files, and available integrations on [EveAgents](https://www.eveagents.dev).

**[Browse all Eve agents](https://www.eveagents.dev)**

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

1. [Browse the agent catalog](https://www.eveagents.dev) and open an agent that fits your workflow.
2. Choose the standalone agent or one of its channel and connection variants.
3. Sign in with GitHub or Google to inspect the source files and download the agent archive.
4. Keep the downloaded files together and run Eve from the agent folder:

```bash
npx eve@latest
```

Every standalone agent works with information supplied directly in the conversation. Integration variants add one supported channel or connection at a time, together with their setup instructions and environment variable requirements.

## What Is an Eve Agent?

An Eve agent is a self-contained folder that defines its identity, workflow, model, domain knowledge, and optional integrations. Every agent listed here includes:

- `instructions.md` — role, operating workflow, tool policy, and safety guardrails
- `agent.ts` — model configuration through Eve
- `skills/<agent-slug>.md` — focused domain playbook and quality checks
- `examples/sample-input.md` — a representative request for verification
- `.env.example` — required environment variable names without secret values
- `README.md` and `SETUP.md` — usage, file inventory, and setup guidance

Integration variants preserve the reusable base agent and add a single channel or connection, such as Slack, GitHub, Linear, Notion, PostHog, Stripe, or Supabase.

## Contributing

Contributions are welcome. To add an agent to this list:

1. Make sure the agent has a public page on [EveAgents](https://www.eveagents.dev).
2. Add it to the list with its canonical EveAgents URL, category, and concise summary.
3. Keep entries focused on reusable agents built for the Eve framework.
4. Submit a pull request with a short explanation of the agent and its use case.

## Related Projects

- [Eve](https://vercel.com/eve) — the open-source framework for building and running agents
- [EveAgents](https://www.eveagents.dev) — the searchable catalog, source browser, and download experience

Built and maintained by [Bergside](https://github.com/bergside).
