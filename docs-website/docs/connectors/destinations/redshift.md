---
title: Redshift Connector
description: Load data into Amazon Redshift data warehouse.
sidebar_position: 5
---

# Redshift Connector

The Redshift destination connector writes data to Amazon Redshift clusters.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `host` | string | Yes | Redshift host |
| `port` | integer | Yes | Port (default: 5439) |
| `database` | string | Yes | Database name |
| `username` | string | Yes | Username |
| `password` | string | Yes | Password |

```json
{
  "destination": {
    "type": "redshift",
    "config": {
      "host": "${REDSHIFT_HOST}",
      "port": 5439,
      "database": "analytics",
      "username": "${REDSHIFT_USER}",
      "password": "${REDSHIFT_PASSWORD}"
    }
  }
}
```

## Related

- [Redshift Documentation](https://docs.aws.amazon.com/redshift/)
