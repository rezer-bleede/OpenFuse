---
title: Authentication
description: Secure your API requests.
slug: /api-reference/authentication
---

# Authentication

OpenFuse uses API key authentication.

## Getting Your API Key

1. Navigate to Settings in the dashboard
2. Click API Keys
3. Generate a new key

## Using the API Key

Include the key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer sk_openfuse_xxxxx" \
  http://localhost:8000/api/v1/connectors
```

## Environment Variables

Store your API key securely:

```bash
export OPENFUSE_API_KEY=sk_openfuse_xxxxx
```

## Rate Limits

| Plan | Requests/minute |
|------|-----------------|
| Free | 60 |
| Pro | 300 |

## Related

- [API Overview](/docs/api-reference/overview)
- [Pipelines API](/docs/api-reference/pipelines)
