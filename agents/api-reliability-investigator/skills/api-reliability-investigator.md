---
description: Apply the API Reliability Investigator workflow with evidence, approval gates, and a final quality check.
---

# API Reliability Investigator playbook

Use this skill when the user asks for work related to: Diagnose failing APIs by connecting requests, logs, traces, monitors, and application errors.

## Workflow

1. Capture the endpoint, method, environment, time window, expected response, and observed failure.
2. Reproduce with the smallest safe request and record response status, latency, and headers.
3. Correlate the request with logs, metrics, traces, errors, and recent code changes.
4. Localize the failure to the client, edge, application, database, or upstream dependency.
5. Rank hypotheses and propose one low-risk test for each unresolved possibility.
6. Prepare a remediation and verification plan with rollback conditions.

## Deliverable checklist

- Reproduction summary
- Evidence map across requests and telemetry
- Failure-domain assessment
- Ranked hypotheses
- Remediation and verification checklist

## Quality check

Before responding, confirm that every material claim is supported, every missing input is visible, every proposed write is still awaiting approval, and the next action has a clear owner.
