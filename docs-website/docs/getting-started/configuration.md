---
title: Configuration
description: Configure OpenFuse for your environment.
slug: /getting-started/configuration
---

# Configuration

OpenFuse is configured through environment variables and configuration files.

## Environment Variables

### API Configuration

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `API_KEY` | Authentication key | Yes | - |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARNING, ERROR) | No | INFO |
| `CORS_ORIGINS` | Allowed CORS origins | No | * |

### Web Configuration

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | API server URL | Yes | http://localhost:8000 |
| `NEXT_PUBLIC_APP_URL` | Web app URL | No | http://localhost:3000 |

## Pipeline Configuration

Pipelines are defined in JSON format:

```json
{
  "name": "stripe-to-snowflake",
  "source": {
    "type": "stripe",
    "config": {
      "api_key": "${STRIPE_API_KEY}"
    }
  },
  "destination": {
    "type": "snowflake",
    "config": {
      "account": "${SNOWFLAKE_ACCOUNT}",
      "warehouse": "OPENFUSE_WH",
      "database": "ANALYTICS",
      "schema": "STRIPE"
    }
  },
  "schedule": "0 0 * * *",
  "sync_mode": "incremental"
}
```

## Connector Configuration

Each connector has its own configuration schema. See the [Connectors](/docs/connectors/overview) section for details.

## Secrets Management

Never commit secrets to version control. Use:

- Environment variables (shown above)
- Docker secrets
- External secret managers (AWS Secrets Manager, HashiCorp Vault)

## Performance Tuning

### Database Connections

Increase pool size for high throughput:

```bash
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10
```

### Worker Threads

Configure parallel processing:

```bash
OPENFUSE_WORKERS=4
```

## Next Steps

- [Connectors Overview](/docs/connectors/overview) - Available integrations
- [Pipelines](/docs/pipelines/concepts) - Pipeline concepts
