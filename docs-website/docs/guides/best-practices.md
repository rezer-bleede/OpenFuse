---
title: Best Practices
description: Recommended patterns for OpenFuse pipelines.
slug: /guides/best-practices
---

# Best Practices

Guidelines for building reliable, performant pipelines.

## Pipeline Design

### Use Incremental Sync

Always prefer incremental sync when supported:

```json
{
  "sync_mode": "incremental",
  "cursor_field": "updated_at"
}
```

### Batch Size Tuning

Start with default batch size, adjust based on performance:

```json
{
  "batch_size": 1000
}
```

## Error Handling

### Retry Configuration

Configure automatic retries:

```json
{
  "retry": {
    "max_attempts": 3,
    "backoff_seconds": 60
  }
}
```

### Alerts

Set up alerts for job failures:

```json
{
  "alerts": {
    "on_failure": true,
    "webhook_url": "https://..."
  }
}
```

## Performance

### Parallel Jobs

Run multiple pipelines concurrently:

- Use separate pipelines for independent data
- Monitor resource usage

### Scheduling

- Space out pipeline runs
- Avoid peak hours
- Monitor execution times

## Monitoring

- Track success rates
- Monitor latency
- Set up dashboards

## Related

- [Troubleshooting](/docs/pipelines/troubleshooting)
- [Security](/docs/guides/security)
