---
title: GitHub Connector
description: Extract repository and code data from GitHub.
sidebar_position: 13
---

# GitHub Connector

The GitHub connector extracts repositories, issues, pull requests, and more.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `access_token` | string | Yes | GitHub personal access token |

```json
{
  "source": {
    "type": "github",
    "config": {
      "access_token": "${GITHUB_ACCESS_TOKEN}"
    }
  }
}
```

## Supported Streams

- repositories
- issues
- pull_requests
- commits

## Related

- [GitHub REST API](https://docs.github.com/en/rest)
