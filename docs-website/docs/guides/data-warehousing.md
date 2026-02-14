---
title: Data Warehousing Guide
description: Build a modern data warehouse with OpenFuse.
slug: /guides/data-warehousing
---

# Data Warehousing Guide

This guide covers building a production data warehouse with OpenFuse.

## Architecture

```
Sources          OpenFuse           Warehouse
---------> [ Extract ] ---------> [ Load ] ---------> Snowflake/BigQuery
             Transform
```

## Step 1: Choose Your Warehouse

| Warehouse | Best For |
|-----------|----------|
| Snowflake | Cloud-native, pay-per-use |
| BigQuery | Google ecosystem, ML integration |
| Redshift | AWS migration |
| PostgreSQL | Simple needs |

## Step 2: Connect Sources

Start with key business data:

1. **Finance**: Stripe, QuickBooks
2. **CRM**: Salesforce, HubSpot
3. **Marketing**: Facebook Ads, Google Analytics
4. **Product**: MongoDB, PostgreSQL

## Step 3: Incremental Sync

Enable incremental sync for large datasets:

```json
{
  "sync_mode": "incremental",
  "cursor_field": "updated_at"
}
```

## Step 4: Data Modeling

Create a star schema:

- Fact tables: events, transactions
- Dimension tables: customers, products, dates

## Best Practices

- Schedule syncs during off-peak hours
- Monitor job success rates
- Use schema evolution for source changes
- Implement data quality checks

## Related

- [Connectors Overview](/docs/connectors/overview)
- [Best Practices](/docs/guides/best-practices)
