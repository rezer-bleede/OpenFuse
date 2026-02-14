---
title: Creating Pipelines
description: Step-by-step guide to creating data pipelines.
slug: /pipelines/creating
---

# Creating Pipelines

This guide walks through creating a pipeline in OpenFuse.

## Via Dashboard

1. Navigate to the **Pipelines** page
2. Click **New Pipeline**
3. Select a **Source** connector
4. Configure source credentials
5. Select a **Destination** connector
6. Configure destination credentials
7. Set sync mode (Full or Incremental)
8. Optionally set a schedule
9. Click **Create Pipeline**

## Via API

```bash
curl -X POST http://localhost:8000/api/v1/pipelines \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "stripe-to-snowflake",
    "source": {
      "type": "stripe",
      "config": {"api_key": "sk_..."}
    },
    "destination": {
      "type": "snowflake",
      "config": {"account": "..."}
    },
    "sync_mode": "incremental"
  }'
```

## Via Python SDK

```python
from openfuse import Pipeline

pipeline = Pipeline.create(
    name="stripe-to-snowflake",
    source={
        "type": "stripe",
        "config": {"api_key": "sk_..."}
    },
    destination={
        "type": "snowflake",
        "config": {"account": "..."}
    },
    sync_mode="incremental"
)
```

## Related

- [Pipeline Concepts](/docs/pipelines/concepts)
- [Scheduling](/docs/pipelines/scheduling)
