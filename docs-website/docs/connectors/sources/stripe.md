---
title: Stripe Connector
description: Configure the Stripe connector to sync payment data to your warehouse.
sidebar_position: 1
---

# Stripe Connector

The Stripe connector allows you to extract payment and subscription data from your Stripe account.

## Overview

| Feature | Description |
|---------|-------------|
| **Supported Actions** | Extract charges, customers, subscriptions, invoices, products |
| **Sync Modes** | Full, Incremental |
| **Rate Limits** | 100 requests/second |

## Prerequisites

You need a Stripe account with API access. Generate API keys in the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).

## Configuration

### Connection Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `api_key` | string | Yes | Your Stripe secret key (sk_...) |
| `account_id` | string | No | Connected account ID for Stripe Connect |

### Configuration Example

```json
{
  "source": {
    "type": "stripe",
    "config": {
      "api_key": "${STRIPE_API_KEY}"
    }
  }
}
```

## Supported Streams

| Stream | Description | Incremental Support |
|--------|-------------|---------------------|
| `charges` | Payment charges | Yes (by created date) |
| `customers` | Customer records | Yes (by created date) |
| `subscriptions` | Subscription data | Yes (by created date) |
| `invoices` | Invoice records | Yes (by created date) |
| `products` | Product catalog | No |
| `coupons` | Discount codes | No |
| `invoice_items` | Invoice line items | Yes (by created date) |

## Incremental Sync

The Stripe connector uses Stripe's `created` timestamp for incremental syncs. On each sync, only records created after the last sync timestamp are fetched.

## Troubleshooting

### Invalid API Key

If you see an authentication error, verify your API key:

```bash
curl -H "Authorization: Bearer $STRIPE_API_KEY" https://api.stripe.com/v1/charges
```

### Rate Limiting

Stripe API has rate limits. The connector handles this automatically with exponential backoff.

## Related

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Pipelines Overview](/docs/pipelines/concepts)
- [API Reference](/docs/api-reference/pipelines)
