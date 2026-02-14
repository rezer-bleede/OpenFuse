---
title: QuickBooks Connector
description: Extract financial data from QuickBooks.
sidebar_position: 17
---

# QuickBooks Connector

The QuickBooks connector extracts invoices, payments, and financial reports.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `realm_id` | string | Yes | QuickBooks company ID |
| `access_token` | string | Yes | OAuth access token |
| `refresh_token` | string | Yes | OAuth refresh token |
| `client_id` | string | Yes | OAuth client ID |
| `client_secret` | string | Yes | OAuth client secret |

```json
{
  "source": {
    "type": "quickbooks",
    "config": {
      "realm_id": "${QUICKBOOKS_REALM_ID}",
      "access_token": "${QB_ACCESS_TOKEN}",
      "refresh_token": "${QB_REFRESH_TOKEN}",
      "client_id": "${QB_CLIENT_ID}",
      "client_secret": "${QB_CLIENT_SECRET}"
    }
  }
}
```

## Related

- [QuickBooks API](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities)
