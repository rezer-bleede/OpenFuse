---
title: Zendesk Connector
description: Extract support ticket data from Zendesk.
sidebar_position: 9
---

# Zendesk Connector

The Zendesk connector extracts tickets, users, and organizations.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `email` | string | Yes | Your email |
| `api_token` | string | Yes | API token |

```json
{
  "source": {
    "type": "zendesk",
    "config": {
      "subdomain": "yourcompany",
      "email": "you@company.com",
      "api_token": "${ZENDESK_API_TOKEN}"
    }
  }
}
```

## Related

- [Zendesk API](https://developer.zendesk.com/api-reference)
