---
title: Shopify Connector
description: Extract e-commerce data from Shopify stores.
sidebar_position: 5
---

# Shopify Connector

The Shopify connector extracts orders, products, and customers.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `shop` | string | Yes | Your store name |
| `access_token` | string | Yes | Admin API access token |

```json
{
  "source": {
    "type": "shopify",
    "config": {
      "shop": "mystore",
      "access_token": "${SHOPIFY_ACCESS_TOKEN}"
    }
  }
}
```

## Supported Streams

- orders
- products
- customers
- inventory

## Related

- [Shopify Admin API](https://shopify.dev/docs/api/admin-rest)
