---
title: Transformations
description: Transform data during pipeline execution.
slug: /pipelines/transformations
---

# Transformations

OpenFuse supports data transformations within pipelines.

## Field Mapping

Rename fields during sync:

```json
{
  "mappings": [
    {"source": "stripe_id", "destination": "id"},
    {"source": "created_at", "destination": "created_date"}
  ]
}
```

## Type Casting

Convert data types:

```json
{
  "casts": {
    "amount": "integer",
    "is_active": "boolean",
    "created_at": "timestamp"
  }
}
```

## Filtering

Filter records based on conditions:

```json
{
  "filters": [
    {"field": "status", "operator": "eq", "value": "active"}
  ]
}
```

## Related

- [Pipeline Concepts](/docs/pipelines/concepts)
- [Best Practices](/docs/guides/best-practices)
