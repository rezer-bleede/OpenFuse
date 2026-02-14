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
2. Copy the example environment file for the API service (Docker uses this file directly):
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
3. Start the local development environment:
   ```bash
   docker compose -f infra/docker/docker-compose.yml up --build
   ```
4. Visit http://localhost:3000 to access the OpenFuse dashboard and http://localhost:8000/docs for the API explorer.

### Smoke testing the stack

After containers are running you can confirm the MVP is healthy:

- `GET http://localhost:8000/api/v1/health` returns the API liveness probe.
- `GET http://localhost:8000/api/v1/connectors` lists every connector registered in the service registry.
- Use `POST http://localhost:8000/api/v1/connectors/example/validate` with a JSON payload such as
  ```json
  {
    "config": {
      "endpoint": "https://api.example.com"
    }
  }
  ```
  to validate an example connector configuration without executing a pipeline.

The web dashboard automatically reads from `NEXT_PUBLIC_API_URL` and renders the list of connectors exposed by the API. If the
variable is unset or the registry cannot be reached, the dashboard now falls back to a curated offline catalogue so local
development continues to work without noisy connection errors.

## Testing

### Frontend Tests

```bash
# Run all tests
cd apps/web
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Backend Tests

```bash
# Run all tests
cd apps/api
poetry run pytest

# Run with coverage
poetry run pytest --cov=app --cov-report=html

# Run specific test file
poetry run pytest tests/test_pipelines.py
```

### Docker Environment Testing

```bash
# Run tests in Docker
docker compose -f infra/docker/docker-compose.yml run --rm web npm test
docker compose -f infra/docker/docker-compose.yml run --rm api poetry run pytest
```

### Coverage Reports

- Frontend: `apps/web/coverage/index.html`
- Backend: `apps/api/htmlcov/index.html`

Coverage goals: **80%+ overall** (currently: 5.4%)

See [`docs/testing.md`](docs/testing.md) for comprehensive testing documentation.

### CI/CD

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Manual trigger via GitHub Actions

See `.github/workflows/test.yml` for CI/CD configuration.

### Testing

Run the frontend test suite (unit and integration coverage for the dashboard loader and page) with:

```bash
pnpm --filter openfuse-web test
```

See the [`docs/architecture/overview.md`](docs/architecture/overview.md) document for more information about the platform layout and extensibility model.
