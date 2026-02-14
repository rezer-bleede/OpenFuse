---
title: Intercom Connector
description: Extract customer messaging data from Intercom.
sidebar_position: 8
---

# Intercom Connector

The Intercom connector extracts conversations, users, and leads.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `access_token` | string | Yes | Intercom access token |

```json
{
  "source": {
    "type": "intercom",
    "config": {
      "access_token": "${INTERCOM_ACCESS_TOKEN}"
    }
  }
}
```

## Related

- [Intercom API](https://developers.intercom.com/docs/references/rest-api)
