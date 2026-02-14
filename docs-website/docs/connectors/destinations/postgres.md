---
title: PostgreSQL Connector
description: Load data into PostgreSQL database from any source.
sidebar_position: 1
---

# PostgreSQL Connector

The PostgreSQL destination connector writes data to PostgreSQL databases.

## Overview

| Feature | Description |
|---------|-------------|
| **Supported Actions** | Load data, create tables, upsert records |
| **Formats** | JSON, Parquet |
| **Batch Size** | 1,000 records |

## Configuration

### Connection Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `host` | string | Yes | Database host |
| `port` | integer | Yes | Database port (default: 5432) |
| `database` | string | Yes | Database name |
| `schema` | string | Yes | Database schema |
| `username` | string | Yes | Database user |
| `password` | string | Yes | Database password |

### Configuration Example

```json
{
  "destination": {
    "type": "postgres",
    "config": {
      "host": "${POSTGRES_HOST}",
      "port": 5432,
      "database": "analytics",
      "schema": "public",
      "username": "${POSTGRES_USER}",
      "password": "${POSTGRES_PASSWORD}"
    }
  }
}
```

## Load Strategies

| Strategy | Description |
|----------|-------------|
| `append` | Append new records |
| `upsert` | Insert or update on primary key |
| `replace` | Replace entire table |

## Data Types Mapping

| Source Type | PostgreSQL Type |
|-------------|-----------------|
| `string` | TEXT |
| `integer` | INTEGER |
| `number` | NUMERIC |
| `boolean` | BOOLEAN |
| `timestamp` | TIMESTAMP |
| `object` | JSONB |

## Troubleshooting

### Connection Refused

Verify the database server accepts connections from your OpenFuse instance.

### SSL Errors

Enable SSL in the configuration:

```json
{
  "ssl": true,
  "ssl_mode": "require"
}
```

## Related

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
