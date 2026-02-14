---
title: MongoDB Connector
description: Load data into MongoDB database.
sidebar_position: 8
---

# MongoDB Connector

The MongoDB destination connector writes data to MongoDB collections.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uri` | string | Yes | MongoDB connection URI |
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |

```json
{
  "destination": {
    "type": "mongodb",
    "config": {
      "uri": "${MONGODB_URI}",
      "database": "analytics",
      "collection": "events"
    }
  }
}
```

## Related

- [MongoDB Documentation](https://docs.mongodb.com/)
