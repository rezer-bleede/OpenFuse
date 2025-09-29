# OpenFuse Architecture Overview

OpenFuse follows an open-core model that keeps foundational capabilities fully open-source while allowing the commercial team to build premium enterprise features on top. The repository is organized as a polyglot monorepo so shared contracts and tooling can be reused across editions without code duplication.

## Technology stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| API | [FastAPI](https://fastapi.tiangolo.com/) | High-performance Python web framework with async support |
| Worker runtime | [Celery](https://docs.celeryq.dev/) + [Redis](https://redis.io/) | Distributed task execution for pipelines |
| Data access | [SQLModel](https://sqlmodel.tiangolo.com/) | ORM built on SQLAlchemy with Pydantic models |
| Frontend | [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) | React-based dashboard with server-side rendering |
| Data store | [PostgreSQL](https://www.postgresql.org/) | Primary metadata database |
| Messaging | [Kafka](https://kafka.apache.org/) (optional) | High-throughput event streaming for change data capture |
| Infrastructure | Docker Compose, Terraform | Local development and multi-cloud provisioning |

These technologies provide a permissive licensing model (MIT, Apache 2.0, BSD) that aligns with an open-core strategy.

## Module boundaries

- **Community core (`apps/api`)** contains orchestrators, pipeline definitions, and REST/GraphQL interfaces.
- **Operator experience (`apps/web`)** hosts dashboards and administrative tools. Enterprise features can be packaged as optional Next.js routes or dynamic modules.
- **Shared libraries (`packages/`)** define language-specific SDKs, integration utilities, and API clients that both community and enterprise offerings can consume.
- **Infrastructure (`infra/`)** keeps deployment and observability tooling separate so managed offerings can extend Terraform modules and Docker images.

## Extension points

1. **Connectors**: Add new `Extractor`, `Transformer`, or `Loader` classes under `apps/api/app/services/connectors/`. The dynamic registry ensures that enterprise-only connectors can live in a private package without modifying open-source code.
2. **Policies & governance**: Implement attribute-based access control (ABAC) policies under `apps/api/app/services/policy/`. Enterprise SKUs can extend the policy engine by installing extra Python packages.
3. **UI plugins**: Drop self-contained Next.js routes into `apps/web/app/(enterprise)` and gate them behind license-aware feature flags loaded from the API.
4. **Observability**: Compose reusable Terraform modules in `infra/terraform/modules/` to integrate with vendor-specific logging or monitoring platforms.

## Deployment model

- **Local development** uses Docker Compose to provision PostgreSQL, Redis, the API service, the Celery worker, and the Next.js app.
- **Production** environments rely on Terraform for infrastructure provisioning (Kubernetes or serverless) and GitHub Actions for CI/CD. The open-core edition provides reference deployments while the commercial team can supply hardened modules.

Refer to the component-specific READMEs in each directory for setup instructions and contribution guidelines.
