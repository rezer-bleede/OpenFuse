---
title: Scheduling Pipelines
description: Schedule pipelines with cron expressions.
slug: /pipelines/scheduling
---

# Scheduling Pipelines

OpenFuse supports cron-based scheduling for automated pipeline runs.

## Cron Syntax

| Field | Values | Special Characters |
|-------|--------|-------------------|
| Minute | 0-59 | * , - |
| Hour | 0-23 | * , - |
| Day | 1-31 | * , - |
| Month | 1-12 | * , - |
| Weekday | 0-6 | * , - |

## Examples

| Cron | Description |
|------|-------------|
| `0 0 * * *` | Daily at midnight |
| `0 * * * *` | Every hour |
| `0 0 * * 0` | Weekly on Sunday |
| `0 0 1 * *` | First day of month |
| `*/15 * * * *` | Every 15 minutes |

## Enabling Schedule

```json
{
  "schedule": "0 0 * * *",
  "enabled": true
}
```

## Related

- [Pipeline Concepts](/docs/pipelines/concepts)
- [Creating Pipelines](/docs/pipelines/creating)
