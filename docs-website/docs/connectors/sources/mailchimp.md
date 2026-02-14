---
title: Mailchimp Connector
description: Extract email marketing data from Mailchimp.
sidebar_position: 6
---

# Mailchimp Connector

The Mailchimp connector extracts campaigns, lists, and members.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `api_key` | string | Yes | Mailchimp API key |

```json
{
  "source": {
    "type": "mailchimp",
    "config": {
      "api_key": "${MAILCHIMP_API_KEY}"
    }
  }
}
```

## Related

- [Mailchimp API](https://mailchimp.com/developer/marketing/api/)
