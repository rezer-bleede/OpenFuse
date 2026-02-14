---
title: API Reference Overview
description: OpenFuse REST API documentation.
slug: /api-reference/overview
---

# API Reference Overview

The OpenFuse API provides programmatic access to all platform features.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Include your API key in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:8000/api/v1/health
```

## Endpoints

| Resource | Endpoints |
|----------|------------|
| Health | `GET /health` |
| Connectors | `GET /connectors`, `GET /connectors/:type/validate` |
| Pipelines | `GET/POST /pipelines`, `GET/PUT/DELETE /pipelines/:id` |
| Jobs | `GET /pipelines/:id/jobs`, `POST /pipelines/:id/run` |

## Response Format

All responses are JSON:

```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1
  }
}
```

## Error Handling

Errors return appropriate HTTP status codes:

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

## Related

- [Authentication](/docs/api-reference/authentication)
- [Pipelines API](/docs/api-reference/pipelines)
- [Connectors API](/docs/api-reference/connectors)
