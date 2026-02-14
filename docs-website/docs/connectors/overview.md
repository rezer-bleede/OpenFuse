---
title: Connectors Overview
description: Browse all available OpenFuse connectors for sources and destinations.
slug: /connectors/overview
---

# Connectors Overview

OpenFuse provides **30+ pre-built connectors** for popular data sources and destinations.

## Sources

Sources extract data from external systems into your data warehouse.

### Marketing & Sales

| Connector | Description | Sync Modes |
|-----------|-------------|-------------|
| [Stripe](/docs/connectors/sources/stripe) | Payment processing data | Full, Incremental |
| [Salesforce](/docs/connectors/sources/salesforce) | CRM data | Full, Incremental |
| [HubSpot](/docs/connectors/sources/hubspot) | Marketing automation | Full, Incremental |
| [Shopify](/docs/connectors/sources/shopify) | E-commerce data | Full, Incremental |
| [Mailchimp](/docs/connectors/sources/mailchimp) | Email marketing | Full |
| [Facebook Ads](/docs/connectors/sources/facebook-ads) | Ad performance | Full, Incremental |

### Communication

| Connector | Description | Sync Modes |
|-----------|-------------|-------------|
| [Slack](/docs/connectors/sources/slack) | Messages and channels | Full |
| [Intercom](/docs/connectors/sources/intercom) | Customer messaging | Full, Incremental |
| [Zendesk](/docs/connectors/sources/zendesk) | Support tickets | Full, Incremental |
| [Twilio](/docs/connectors/sources/twilio) | Communications data | Full |

### Project Management

| Connector | Description | Sync Modes |
|-----------|-------------|-------------|
| [Jira](/docs/connectors/sources/jira) | Project tracking | Full, Incremental |
| [Asana](/docs/connectors/sources/asana) | Task management | Full |
| [Trello](/docs/connectors/sources/asana) | Board management | Full |

### Analytics & Data

| Connector | Description | Sync Modes |
|-----------|-------------|-------------|
| [Google Analytics](/docs/connectors/sources/google-analytics) | Web analytics | Full, Incremental |
| [Google Sheets](/docs/connectors/sources/google-sheets) | Spreadsheet data | Full |
| [GitHub](/docs/connectors/sources/github) | Repository data | Full, Incremental |

### Accounting

| Connector | Description | Sync Modes |
|-----------|-------------|-------------|
| [QuickBooks](/docs/connectors/sources/quickbooks) | Financial data | Full, Incremental |

## Destinations

Destinations are data warehouses where you load the extracted data.

| Connector | Description | Supported Formats |
|-----------|-------------|-------------------|
| [PostgreSQL](/docs/connectors/destinations/postgres) | Open-source relational DB | JSON, Parquet |
| [MySQL](/docs/connectors/destinations/mysql) | MySQL database | JSON, Parquet |
| [Snowflake](/docs/connectors/destinations/snowflake) | Cloud data warehouse | JSON, Parquet |
| [BigQuery](/docs/connectors/destinations/bigquery) | Google data warehouse | JSON, Parquet |
| [Redshift](/docs/connectors/destinations/redshift) | AWS data warehouse | JSON, Parquet |
| [S3](/docs/connectors/destinations/s3) | AWS object storage | JSON, Parquet |
| [GCS](/docs/connectors/destinations/gcs) | Google Cloud Storage | JSON, Parquet |
| [MongoDB](/docs/connectors/destinations/mongodb) | NoSQL database | JSON |
| [SQL Server](/docs/connectors/destinations/sqlserver) | MS SQL database | JSON, Parquet |

## Adding Custom Connectors

OpenFuse is extensible. You can build custom connectors using our SDK:

```python
from openfuse import BaseConnector

class MyCustomConnector(BaseConnector):
    name = "my-custom-connector"
    
    def read(self, config):
        # Your data extraction logic
        pass
        
    def write(self, data, config):
        # Your data loading logic
        pass
```

See the [Extensibility Guide](/docs/guides/best-practices) for details.

## Next Steps

- [Quick Start](/docs/getting-started/quick-start) - Create your first pipeline
- [Pipeline Concepts](/docs/pipelines/concepts) - Understand how pipelines work
