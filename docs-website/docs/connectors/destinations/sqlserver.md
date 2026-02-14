---
title: SQL Server Connector
description: Load data into Microsoft SQL Server.
sidebar_position: 9
---

# SQL Server Connector

The SQL Server destination connector writes data to MS SQL Server databases.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `host` | string | Yes | Server host |
| `port` | integer | Yes | Port (default: 1433) |
| `database` | string | Yes | Database name |
| `username` | string | Yes | Username |
| `password` | string | Yes | Password |

```json
{
  "destination": {
    "type": "sqlserver",
    "config": {
      "host": "${SQLSERVER_HOST}",
      "port": 1433,
      "database": "analytics",
      "username": "${SQLSERVER_USER}",
      "password": "${SQLSERVER_PASSWORD}"
    }
  }
}
```

## Related

- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/)
