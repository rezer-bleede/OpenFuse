---
title: Jobs API
description: Monitor pipeline job execution.
slug: /api-reference/jobs
---

# Jobs API

Track pipeline execution and job status.

## List Jobs

```bash
GET /api/v1/pipelines/:id/jobs
```

## Get Job Details

```bash
GET /api/v1/jobs/:id
```

Response:

```json
{
  "id": "job_123",
  "pipeline_id": "pipe_456",
  "status": "completed",
  "records_synced": 1000,
  "started_at": "2024-01-15T10:00:00Z",
  "completed_at": "2024-01-15T10:05:00Z"
}
```

## Job Statuses

| Status | Description |
|--------|-------------|
| `pending` | Waiting to run |
| `running` | Currently executing |
| `completed` | Successfully finished |
| `failed` | Error occurred |

## Related

- [API Overview](/docs/api-reference/overview)
- [Pipelines API](/docs/api-reference/pipelines)
