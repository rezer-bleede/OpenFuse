---
title: Quick Start
description: Get OpenFuse running in 5 minutes with this quick start guide.
slug: /getting-started/quick-start
---

# Quick Start

This guide will have you running OpenFuse in under 5 minutes.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) installed

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/openfuse.git
cd openfuse
```

## Step 2: Start the Services

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

This command starts:

- **API Server** on `http://localhost:8000`
- **Web Dashboard** on `http://localhost:3000`

## Step 3: Access the Dashboard

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the OpenFuse dashboard with the connector overview.

## Step 4: Create Your First Pipeline

1. Click **New Pipeline** on the dashboard
2. Select a **Source** connector (e.g., Stripe)
3. Configure the source credentials
4. Select a **Destination** connector (e.g., PostgreSQL)
5. Configure the destination connection
6. Click **Create Pipeline**

## Step 5: Run the Pipeline

1. Find your pipeline in the list
2. Click **Run Now**
3. Monitor the job progress in the Jobs tab

## What's Next?

- [Explore Connectors](/docs/connectors/overview) - See all available integrations
- [Configure Connectors](/docs/connectors/sources/stripe) - Detailed connector setup
- [API Reference](/docs/api-reference/overview) - Programmatic access
