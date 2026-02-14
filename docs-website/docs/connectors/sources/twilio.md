---
title: Twilio Connector
description: Extract communications data from Twilio.
sidebar_position: 10
---

# Twilio Connector

The Twilio connector extracts call, message, and meeting data.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_sid` | string | Yes | Twilio account SID |
| `auth_token` | string | Yes | Twilio auth token |

```json
{
  "source": {
    "type": "twilio",
    "config": {
      "account_sid": "${TWILIO_ACCOUNT_SID}",
      "auth_token": "${TWILIO_AUTH_TOKEN}"
    }
  }
}
```

## Related

- [Twilio API](https://www.twilio.com/docs/usage/api)
