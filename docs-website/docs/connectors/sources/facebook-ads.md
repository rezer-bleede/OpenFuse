---
title: Facebook Ads Connector
description: Extract ad performance data from Facebook Ads.
sidebar_position: 7
---

# Facebook Ads Connector

The Facebook Ads connector extracts campaigns, adsets, and ads performance.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `access_token` | string | Yes | Facebook access token |
| `ad_account_id` | string | Yes | Ad account ID |

```json
{
  "source": {
    "type": "facebook_ads",
    "config": {
      "access_token": "${FACEBOOK_ACCESS_TOKEN}",
      "ad_account_id": "act_123456789"
    }
  }
}
```

## Related

- [Facebook Marketing API](https://developers.facebook.com/docs/marketing-api)
