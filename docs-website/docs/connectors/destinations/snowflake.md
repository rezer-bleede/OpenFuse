---
title: Snowflake Connector
description: Load data into Snowflake data warehouse.
sidebar_position: 3
---

# Snowflake Connector

The Snowflake destination connector writes data to Snowflake databases.

## Overview

| Feature | Description |
|---------|-------------|
| **Supported Actions** | Load data, create tables, upsert records |
| **Formats** | JSON, Parquet |
| **Stage** | Internal Snowflake stage |

## Configuration

### Connection Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account` | string | Yes | Snowflake account identifier |
| `warehouse` | string | Yes | Warehouse name |
| `database` | string | Yes | Database name |
| `schema` | string | Yes | Schema name |
| `username` | string | Yes | Username |
| `password` | string | Yes | Password |
| `role` | string | No | Role to use |

### Configuration Example

```json
{
  "destination": {
    "type": "snowflake",
    "config": {
      "account": "${SNOWFLAKE_ACCOUNT}",
      "warehouse": "OPENFUSE_WH",
      "database": "ANALYTICS",
      "schema": "PUBLIC",
      "username": "${SNOWFLAKE_USER}",
      "password": "${SNOWFLAKE_PASSWORD}"
    }
  }
}
```

## Related

- [Snowflake Documentation](https://docs.snowflake.com/)
