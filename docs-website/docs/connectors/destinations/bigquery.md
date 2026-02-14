---
title: BigQuery Connector
description: Load data into Google BigQuery data warehouse.
sidebar_position: 4
---

# BigQuery Connector

The BigQuery destination connector writes data to BigQuery datasets.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project_id` | string | Yes | GCP project ID |
| `dataset` | string | Yes | BigQuery dataset |
| `credentials_json` | string | Yes | Service account JSON |

```json
{
  "destination": {
    "type": "bigquery",
    "config": {
      "project_id": "${GCP_PROJECT_ID}",
      "dataset": "analytics",
      "credentials_json": "${GCP_CREDENTIALS}"
    }
  }
}
```

## Related

- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
