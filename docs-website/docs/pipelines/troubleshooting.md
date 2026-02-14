---
title: Troubleshooting
description: Common issues and solutions.
slug: /pipelines/troubleshooting
---

# Troubleshooting

Solutions for common pipeline issues.

## Connection Failures

### Invalid Credentials

Verify your credentials are correct:

```bash
# Test API connection
curl -H "Authorization: Bearer $API_KEY" $API_ENDPOINT
```

### Network Issues

Ensure your network allows outbound connections to the connector's API.

## Sync Failures

### Rate Limiting

Many APIs have rate limits. The connector implements automatic retry with exponential backoff.

### Schema Changes

If source schema changes, you may need to update your mappings or recreate the pipeline.

## Performance Issues

### Slow Syncs

- Increase batch size
- Enable incremental sync
- Schedule during off-peak hours

### Memory Issues

Reduce batch size in pipeline config:

```json
{
  "batch_size": 500
}
```

## Getting Help

- [GitHub Discussions](https://github.com/your-username/openfuse/discussions)
- [Discord](https://discord.gg/openfuse)
