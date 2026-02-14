---
title: GCS Connector
description: Load data into Google Cloud Storage.
sidebar_position: 7
---

# GCS Connector

The GCS destination connector writes data to Google Cloud Storage buckets.

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bucket` | string | Yes | GCS bucket name |
| `credentials_json` | string | Yes | Service account JSON |
| `path_prefix` | string | No | Path prefix |

```json
{
  "destination": {
    "type": "gcs",
    "config": {
      "bucket": "my-data-lake",
      "credentials_json": "${GCP_CREDENTIALS}",
      "path_prefix": "openfuse"
    }
  }
}
```

## Related

- [GCS Documentation](https://cloud.google.com/storage/docs)
