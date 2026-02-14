---
title: Pipeline Concepts
description: Understand how OpenFuse pipelines work.
slug: /pipelines/concepts
---

# Pipeline Concepts

A pipeline is the core abstraction in OpenFuse. It defines how data flows from a source to a destination.

## Pipeline Structure

```json
{
  "name": "pipeline-name",
  "source": {
    "type": "connector-type",
    "config": { ... }
  },
  "destination": {
    "type": "connector-type", 
    "config": { ... }
  },
  "sync_mode": "incremental",
  "schedule": "0 0 * * *"
}
```

## Sync Modes

| Mode | Description |
|------|-------------|
| `full` | Complete refresh every run |
| `incremental` | Only new/updated records |

## Scheduling

Pipelines can be scheduled using cron expressions:

| Expression | Schedule |
|------------|----------|
| `0 0 * * *` | Daily at midnight |
| `0 * * * *` | Every hour |
| `0 0 * * 0` | Weekly on Sunday |

## Related

- [Creating Pipelines](/docs/pipelines/creating)
- [Scheduling](/docs/pipelines/scheduling)
- [Transformations](/docs/pipelines/transformations)
