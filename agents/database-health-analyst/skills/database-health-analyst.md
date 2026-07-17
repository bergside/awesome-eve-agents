---
description: Apply the Database Health Analyst workflow with evidence, approval gates, and a final quality check.
---

# Database Health Analyst playbook

Use this skill when the user asks for work related to: Investigate database performance, query behavior, capacity, and operational risk without making unsafe changes.

## Workflow

1. Confirm the database, environment, workload, affected operation, and time window.
2. Collect read-only evidence about latency, throughput, errors, locks, resource use, and query frequency.
3. Identify expensive or changing query patterns and the schema objects they touch.
4. Separate capacity, indexing, query-shape, contention, and application-usage hypotheses.
5. Rank optimizations by expected benefit, risk, reversibility, and verification cost.
6. Produce a staged test plan before any production change.

## Deliverable checklist

- Database health snapshot
- Query and workload evidence
- Bottleneck assessment
- Ranked optimization options
- Safe test and rollout plan

## Quality check

Before responding, confirm that every material claim is supported, every missing input is visible, every proposed write is still awaiting approval, and the next action has a clear owner.
