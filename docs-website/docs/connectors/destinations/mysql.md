---
title: MySQL Connector
description: Load data into MySQL database.
sidebar_position: 2
---

# MySQL Connector

The MySQL destination connector writes data to MySQL databases.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `host` | string | Yes | Database host |
| `port` | integer | Yes | Port (default: 3306) |
| `database` | string | Yes | Database name |
| `username` | string | Yes | Username |
| `password` | string | Yes | Password |

```json
{
  "destination": {
    "type": "mysql",
    "config": {
      "host": "${MYSQL_HOST}",
      "port": 3306,
      "database": "analytics",
      "username": "${MYSQL_USER}",
      "password": "${MYSQL_PASSWORD}"
    }
  }
}
```

## Related

- [MySQL Documentation](https://dev.mysql.com/doc/)
