# OpenFuse

OpenFuse is an open-core, modular data integration platform that lets you extract, transform, and load (ETL) data from dozens of sources into your analytics warehouse or data lake. This repository now provides an extensible monorepo scaffold that balances community-driven innovation with a commercial-friendly support model.

## Repository structure

```
.
├── apps/
│   ├── api/                # FastAPI application for core services
│   └── web/                # Next.js dashboard for operators and admins
├── docs/                   # Architecture references, RFCs, and governance
├── infra/                  # Deployments, IaC, container orchestration
├── packages/               # Reusable shared libraries (Python & TypeScript)
├── scripts/                # Developer tooling and automation scripts
└── README.md
```

Each area is designed for isolation and scalability so the community edition and enterprise extensions can coexist without code conflicts.

## Key features

- **Simple configuration-driven pipelines** so you can spin up repeatable workflows without writing boilerplate code.
- **Extensible connectors for popular APIs and databases** that make it easy to plug new sources and destinations into your data stack.
- **Incremental load and schema evolution support** to keep datasets up to date while gracefully handling changing source structures.
- **Fully open-source and community-driven** development that welcomes contributions from practitioners building modern data platforms.

## Getting started

1. Install dependencies for the backend and frontend:
   ```bash
   make install
   ```
2. Start the local development environment:
   ```bash
   docker compose -f infra/docker/docker-compose.yml up --build
   ```
3. Visit http://localhost:3000 to access the OpenFuse dashboard and http://localhost:8000/docs for the API explorer.

See the [`docs/architecture/overview.md`](docs/architecture/overview.md) document for more information about the platform layout and extensibility model.
