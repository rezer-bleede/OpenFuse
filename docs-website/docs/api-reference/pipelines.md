---
title: Pipelines API
description: Create and manage pipelines programmatically.
slug: /api-reference/pipelines
---

# Pipelines API

Manage data pipelines via the REST API.

## List Pipelines

```bash
GET /api/v1/pipelines
```

## Create Pipeline

```bash
POST /api/v1/pipelines
{
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
}
```

## Get Pipeline

```bash
GET /api/v1/pipelines/:id
```

## Update Pipeline

```bash
PUT /api/v1/pipelines/:id
{
  "name": "updated-name",
  "sync_mode": "full"
}
```

## Delete Pipeline

```bash
DELETE /api/v1/pipelines/:id
```

## Run Pipeline

```bash
POST /api/v1/pipelines/:id/run
```

## Related

- [API Overview](/docs/api-reference/overview)
- [Jobs API](/docs/api-reference/jobs)
