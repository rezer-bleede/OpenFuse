---
title: Salesforce Connector
description: Sync CRM data from Salesforce to your data warehouse.
sidebar_position: 3
---

# Salesforce Connector

The Salesforce connector extracts objects from your Salesforce CRM.

## Overview

| Feature | Description |
|---------|-------------|
| **Supported Actions** | Extract standard and custom objects |
| **Sync Modes** | Full, Incremental |
| **API Version** | v57.0 |

## Prerequisites

1. Create a Connected App in Salesforce Setup
2. Enable OAuth Settings with scopes:
   - `api`
   - `refresh_token`
3. Note your `Consumer Key` and `Consumer Secret`

## Configuration

### Connection Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `instance_url` | string | Yes | Your Salesforce instance URL |
| `access_token` | string | Yes | OAuth access token |
| `refresh_token` | string | Yes | OAuth refresh token |
| `client_id` | string | Yes | Connected app consumer key |
| `client_secret` | string | Yes | Connected app consumer secret |

### Configuration Example

```json
{
  "source": {
    "type": "salesforce",
    "config": {
      "instance_url": "https://yourcompany.salesforce.com",
      "client_id": "${SALESFORCE_CLIENT_ID}",
      "client_secret": "${SALESFORCE_CLIENT_SECRET}",
      "refresh_token": "${SALESFORCE_REFRESH_TOKEN}"
    }
  }
}
```

## Supported Streams

| Stream | Description |
|--------|-------------|
| `accounts` | Account records |
| `contacts` | Contact records |
| `opportunities` | Sales opportunities |
| `leads` | Lead records |
| `campaigns` | Marketing campaigns |
| `cases` | Support cases |

## Related

- [Salesforce API Documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)
