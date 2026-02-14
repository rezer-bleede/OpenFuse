---
title: Connectors API
description: List and validate connectors.
slug: /api-reference/connectors
---

# Connectors API

Programmatically access connector information.

## List Connectors

```bash
GET /api/v1/connectors
```

Response:

```json
{
  "data": [
    {"name": "stripe", "type": "source"},
    {"name": "snowflake", "type": "destination"}
  ]
}
```

## Validate Connector

Test connector configuration without creating a pipeline:

```bash
POST /api/v1/connectors/stripe/validate
{
  "config": {
    "api_key": "sk_test_..."
  }
}
```

Response:

```json
{
  "valid": true,
  "message": "Connection successful"
}
```

## Describe Connector

Get connector schema and capabilities:

```bash
GET /api/v1/connectors/stripe
```

## Related

- [API Overview](/docs/api-reference/overview)
- [Connectors Overview](/docs/connectors/overview)
