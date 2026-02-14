---
title: Google Analytics Connector
description: Extract web analytics data from Google Analytics.
sidebar_position: 12
---

# Google Analytics Connector

The Google Analytics connector extracts reports and metrics.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `credentials_json` | string | Yes | Service account JSON |
| `property_id` | string | Yes | GA4 property ID |

```json
{
  "source": {
    "type": "google_analytics",
    "config": {
      "credentials_json": "${GA_CREDENTIALS}",
      "property_id": "${GA_PROPERTY_ID}"
    }
  }
}
```

## Supported Streams

- reports
- cohorts
- realtime

## Related

- [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
