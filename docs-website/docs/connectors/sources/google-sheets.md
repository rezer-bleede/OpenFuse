---
title: Google Sheets Connector
description: Extract data from Google Sheets.
sidebar_position: 16
---

# Google Sheets Connector

The Google Sheets connector extracts data from spreadsheet files.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `credentials_json` | string | Yes | Service account JSON |
| `spreadsheet_id` | string | Yes | Spreadsheet ID |

```json
{
  "source": {
    "type": "google_sheets",
    "config": {
      "credentials_json": "${GOOGLE_CREDENTIALS}",
      "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
    }
  }
}
```

## Related

- [Google Sheets API](https://developers.google.com/sheets/api)
