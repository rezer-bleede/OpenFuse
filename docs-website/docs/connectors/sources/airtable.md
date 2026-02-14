---
title: Airtable Connector
description: Extract data from Airtable bases.
sidebar_position: 14
---

# Airtable Connector

The Airtable connector extracts records from Airtable bases.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `api_key` | string | Yes | Airtable API key |
| `base_id` | string | Yes | Airtable base ID |
| `table_name` | string | Yes | Table name |

```json
{
  "source": {
    "type": "airtable",
    "config": {
      "api_key": "${AIRTABLE_API_KEY}",
      "base_id": "appXXXXXXXXXXXXXX",
      "table_name": "Contacts"
    }
  }
}
```

## Related

- [Airtable API](https://airtable.com/api)
