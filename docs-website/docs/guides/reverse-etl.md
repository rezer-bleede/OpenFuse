---
title: Reverse ETL
description: Sync warehouse data back to operational tools.
slug: /guides/reverse-etl
---

# Reverse ETL

Reverse ETL pushes data from your warehouse to operational systems.

## Use Cases

| Use Case | Destination |
|----------|-------------|
| Lead scoring | Salesforce, HubSpot |
| Customer support | Zendesk, Intercom |
| Marketing personalization | Braze, Mailchimp |

## Configuration

```json
{
  "source": {
    "type": "snowflake",
    "config": { ... }
  },
  "destination": {
    "type": "hubspot",
    "config": { ... }
  }
}
```

## Data Flow

1. Transform data in warehouse
2. Create reverse ETL pipeline
3. Sync to operational tool

## Best Practices

- Use unique identifiers for matching
- Batch updates for rate limits
- Monitor sync results

## Related

- [Data Warehousing](/docs/guides/data-warehousing)
- [HubSpot Connector](/docs/connectors/sources/hubspot)
