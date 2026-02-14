---
title: HubSpot Connector
description: Extract marketing and CRM data from HubSpot.
sidebar_position: 4
---

# HubSpot Connector

The HubSpot connector extracts contacts, companies, and marketing data.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `access_token` | string | Yes | HubSpot private app token |

```json
{
  "source": {
    "type": "hubspot",
    "config": {
      "access_token": "${HUBSPOT_ACCESS_TOKEN}"
    }
  }
}
```

## Supported Streams

- contacts
- companies
- deals
- emails
- tickets

## Related

- [HubSpot API Docs](https://developers.hubspot.com/docs/api/overview)
