---
title: Webhooks
description: Receive real-time notifications for pipeline events.
slug: /api-reference/webhooks
---

# Webhooks

Configure webhooks to receive notifications when pipeline jobs complete.

## Configuring Webhooks

Add a webhook URL to your pipeline:

```json
{
  "name": "my-pipeline",
  "webhook_url": "https://your-server.com/webhook",
  "webhook_events": ["job.completed", "job.failed"]
}
```

## Event Types

| Event | Description |
|-------|-------------|
| `job.started` | Job began execution |
| `job.completed` | Job finished successfully |
| `job.failed` | Job encountered an error |

## Payload

```json
{
  "event": "job.completed",
  "job_id": "job_123",
  "pipeline_id": "pipe_456",
  "records_synced": 1000,
  "timestamp": "2024-01-15T10:05:00Z"
}
```

## Security

Verify webhook signatures:

```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

## Related

- [API Overview](/docs/api-reference/overview)
