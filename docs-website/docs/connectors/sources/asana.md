---
title: Asana Connector
description: Extract task and project data from Asana.
sidebar_position: 15
---

# Asana Connector

The Asana connector extracts projects, tasks, and workspaces.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `access_token` | string | Yes | Asana personal access token |

```json
{
  "source": {
    "type": "asana",
    "config": {
      "access_token": "${ASANA_ACCESS_TOKEN}"
    }
  }
}
```

## Supported Streams

- workspaces
- projects
- tasks
- stories

## Related

- [Asana API](https://developers.asana.com/docs)
