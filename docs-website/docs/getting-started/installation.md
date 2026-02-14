---
title: Installation
description: Complete installation guide for OpenFuse with Docker, npm, and pip.
slug: /getting-started/installation
---

# Installation

OpenFuse can be installed in multiple ways depending on your needs.

## Docker (Recommended)

The fastest way to get started is using Docker:

```bash
# Clone the repository
git clone https://github.com/your-username/openfuse.git
cd openfuse

# Copy environment file
cp apps/api/.env.example apps/api/.env

# Start all services
docker compose -f infra/docker/docker-compose.yml up --build
```

### Services Started

| Service | URL | Description |
|---------|-----|-------------|
| Web Dashboard | http://localhost:3000 | User interface |
| API Server | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | API documentation |
| PostgreSQL | localhost:5432 | Database |

## npm / Node.js

Install the OpenFuse web and API packages:

```bash
# Install dependencies
cd apps/web
npm install

cd ../api
pip install -e .
```

## Python pip

Install the Python SDK:

```bash
pip install openfuse
```

## Environment Variables

Configure the API by setting these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://openfuse:openfuse@localhost:5432/openfuse` |
| `API_KEY` | Authentication key | `your-api-key` |
| `LOG_LEVEL` | Logging verbosity | `INFO` |
| `NEXT_PUBLIC_API_URL` | Web to API URL | `http://localhost:8000` |

## Verify Installation

Check that all services are healthy:

```bash
# API health check
curl http://localhost:8000/api/v1/health

# List connectors
curl http://localhost:8000/api/v1/connectors
```

## Next Steps

- [Configuration](/docs/getting-started/configuration) - Fine-tune your setup
- [Quick Start](/docs/getting-started/quick-start) - Create your first pipeline
