---
title: Slack Connector
description: Extract messages and channel data from Slack workspace.
sidebar_position: 2
---

# Slack Connector

The Slack connector extracts messages, channels, and user data from your Slack workspace.

## Overview

| Feature | Description |
|---------|-------------|
| **Supported Actions** | Extract messages, channels, users, threads |
| **Sync Modes** | Full |
| **Rate Limits** | 50 requests/minute (Slack API) |

## Prerequisites

1. Create a Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable the following OAuth scopes:
   - `channels:read`
   - `channels:history`
   - `users:read`
   - `chat:read`
3. Install the app to your workspace

## Configuration

### Connection Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `access_token` | string | Yes | OAuth access token (xoxb-...) |
| `team_id` | string | No | Specific workspace ID |

### Configuration Example

```json
{
  "source": {
    "type": "slack",
    "config": {
      "access_token": "${SLACK_ACCESS_TOKEN}"
    }
  }
}
```

## Supported Streams

| Stream | Description |
|--------|-------------` | Public and|
| `channels private channels |
| `messages` | Messages from channels |
| `users` | Workspace users |
| `threads` | Thread replies |

## Troubleshooting

### Missing Channels

Ensure your app has access to the private channels you want to sync.

### Rate Limiting

Slack has strict rate limits. The connector implements automatic retry with backoff.

## Related

- [Slack API Documentation](https://api.slack.com/docs)
