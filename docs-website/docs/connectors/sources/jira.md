---
title: Jira Connector
description: Extract project and issue data from Jira.
sidebar_position: 6
---

# Jira Connector

The Jira connector extracts projects, issues, and sprint data.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `domain` | string | Yes | Your Atlassian domain |
| `email` | string | Yes | Your email |
| `api_token` | string | Yes | API token |

```json
{
  "source": {
    "type": "jira",
    "config": {
      "domain": "yourcompany.atlassian.net",
      "email": "you@company.com",
      "api_token": "${JIRA_API_TOKEN}"
    }
  }
}
```

## Supported Streams

- projects
- issues
- sprints
- boards

## Related

- [Jira API](https://developer.atlassian.com/cloud/jira/platform/rest/)
