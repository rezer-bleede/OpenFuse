# OpenFuse

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Test Coverage](https://img.shields.io/badge/coverage-80%25%2B-brightgreen)](https://github.com/your-username/openfuse/actions)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](https://github.com/your-username/openfuse/actions)
[![Python](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Connectors](https://img.shields.io/badge/connectors-30%2B-purple)](https://openfuse.io/docs/connectors/overview)

OpenFuse is an open-source data integration platform that lets you extract, transform, and load (ETL) data from 30+ sources into your analytics warehouse or data lake. Built with a modern polyglot architecture (Python + TypeScript), OpenFuse provides a scalable foundation for both community and enterprise data teams.

## ✨ Key Features

- **30+ Pre-built Connectors** - Support for popular databases (PostgreSQL, MySQL, Snowflake, BigQuery), SaaS platforms (Stripe, Salesforce, Shopify, HubSpot), and cloud storage (S3, GCS)
- **Configuration-Driven Pipelines** - Define and manage data pipelines without writing boilerplate code
- **Incremental Load & Schema Evolution** - Keep datasets up-to-date while gracefully handling changing source structures
- **Async Architecture** - FastAPI backend with Celery workers for high-performance pipeline execution
- **Modern Dashboard** - React/Next.js UI for managing connectors, pipelines, and monitoring jobs
- **Comprehensive Testing** - 80%+ test coverage with 170+ tests across unit, integration, and E2E
- **Extensible Design** - Easy to add custom connectors and transformations

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Python 3.11+
- pnpm (for frontend)
- Poetry (for backend)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/openfuse.git
   cd openfuse
   ```

2. Install dependencies:
   ```bash
   make install
   ```

3. Configure environment:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

4. Start all services:
   ```bash
   docker compose -f infra/docker/docker-compose.yml up --build
   ```

5. Access the platform:
   - Dashboard: http://localhost:3000
   - API Docs: http://localhost:8000/docs
   - API Health: http://localhost:8000/api/v1/health

### Verify Installation

```bash
# Check API health
curl http://localhost:8000/api/v1/health

# List available connectors
curl http://localhost:8000/api/v1/connectors
```

## 📁 Repository Structure

```
.
├── apps/
│   ├── api/                # FastAPI backend (Python)
│   │   ├── app/
│   │   │   ├── api/        # API endpoints
│   │   │   ├── db/         # Database models
│   │   │   ├── services/   # Connectors, workflows, policies
│   │   │   └── core/       # Configuration
│   │   └── tests/          # Backend tests
│   └── web/                # Next.js dashboard (TypeScript)
│       ├── app/            # React pages & components
│       ├── test/           # Frontend tests
│       └── e2e/            # E2E test suites
├── docs/                   # Architecture docs & RFCs
├── docs-website/           # Docusaurus documentation site
├── infra/                  # Docker & Terraform configs
├── packages/               # Shared libraries
│   ├── js/                 # TypeScript packages
│   └── python/             # Python packages
├── scripts/                # Development utilities
└── .github/workflows/      # CI/CD pipelines
```

## 🧪 Testing

OpenFuse maintains 80%+ test coverage with 170+ tests across all layers.

### Frontend Tests

```bash
# Run all unit tests
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

### Run All Tests

```bash
# Run everything via Make
make test
```

### Coverage Reports

- Frontend: `apps/web/coverage/index.html`
- Backend: `apps/api/htmlcov/index.html`

See [`docs/testing.md`](docs/testing.md) for comprehensive testing documentation.

## 🔄 CI/CD

Automated testing runs on every push and pull request:

- **test-api** - Backend tests with PostgreSQL
- **test-web** - Frontend unit tests
- **test-e2e** - Full-stack E2E tests
- **lint** - ESLint for frontend
- **type-check** - TypeScript validation
- **python-lint** - Ruff for backend

View pipeline status: [`.github/workflows/test.yml`](.github/workflows/test.yml)

## 🔧 Development

### Useful Commands

```bash
# Install all dependencies
make install

# Format code
make format

# Lint code
make lint

# Run tests
make test

# Start dev environment
docker compose -f infra/docker/docker-compose.yml up
```

### Adding a New Connector

1. Create connector in `apps/api/app/services/connectors/`
2. Define config schema and tags
3. Implement extract/load methods
4. Generate frontend catalog:
   ```bash
   python3 scripts/generate_connector_catalog.py
   ```

### Managing Pipelines

- Create pipelines via UI at http://localhost:3000/pipelines/new
- Or use API: `POST http://localhost:8000/api/v1/pipelines`
- Monitor jobs at http://localhost:3000/jobs

## 📚 Documentation

Comprehensive documentation is available at:

- **Full Documentation**: [docs.openfuse.io](https://your-username.github.io/openfuse)
- **Getting Started Guide**: [Quick Start](https://your-username.github.io/openfuse/docs/getting-started/quick-start)
- **Connector Reference**: [30+ Connectors](https://your-username.github.io/openfuse/docs/connectors/overview)
- **API Reference**: [API Docs](https://your-username.github.io/openfuse/docs/api-reference/overview)
- **Architecture**: [System Overview](docs/architecture/overview.md)

### Local Documentation

```bash
cd docs-website
pnpm install
pnpm start  # Runs at http://localhost:3000
```

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **API** | FastAPI 0.110+ | High-performance async web framework |
| **Worker** | Celery + Redis | Distributed task execution |
| **Database** | SQLModel + PostgreSQL | ORM and metadata store |
| **Frontend** | Next.js 14+ + React 18 | Modern dashboard with SSR |
| **Testing** | Vitest + Pytest | Unit, integration, and E2E tests |
| **Docs** | Docusaurus 3.9 | Static documentation site |
| **Infrastructure** | Docker Compose, Terraform | Local dev and cloud deployments |

### Open-Core Model

OpenFuse follows an open-core model:
- **Community Core**: Fully open-source (Apache 2.0) - connectors, orchestration, UI
- **Enterprise Extensions**: Premium features on top of community foundation

## 🔌 Available Connectors

### Sources (17)
- **Databases**: PostgreSQL, MySQL, MongoDB, SQL Server, BigQuery, Snowflake, Redshift
- **SaaS**: Stripe, Salesforce, Shopify, HubSpot, Mailchimp, Slack, Jira, Asana, Intercom, GitHub, Facebook Ads, Google Analytics
- **Storage**: S3, GCS, Google Sheets, Airtable

### Destinations (13)
- **Data Warehouses**: Snowflake, BigQuery, Redshift
- **Databases**: PostgreSQL, MySQL, MongoDB, SQL Server
- **Cloud Storage**: S3, GCS
- **SaaS**: Salesforce, Slack, Google Sheets, Airtable

[View all connectors](https://your-username.github.io/openfuse/docs/connectors/overview)

## 🤝 Contributing

We welcome contributions! Please see [Contributing Guide](https://your-username.github.io/openfuse/docs/community/contributing) for details.

- Fork the repository
- Create a feature branch
- Add tests for new functionality
- Ensure all tests pass
- Submit a pull request

## 📜 License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.

## 🗺️ Roadmap

View our [roadmap](https://your-username.github.io/openfuse/docs/community/roadmap) for upcoming features and releases.

## 💬 Community

- **GitHub Discussions**: [Discussions](https://github.com/your-username/openfuse/discussions)
- **Discord**: [Join Discord](https://discord.gg/openfuse)
- **Issues**: [Report Bugs](https://github.com/your-username/openfuse/issues)
- **Twitter**: [@openfuse](https://twitter.com/openfuse)

## 🌟 Acknowledgments

Built with:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework
- [SQLModel](https://sqlmodel.tiangolo.com/) - SQLAlchemy + Pydantic
- [Celery](https://docs.celeryq.dev/) - Distributed task queue
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**Made with ❤️ by the OpenFuse community**
