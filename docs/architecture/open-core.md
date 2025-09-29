# Open-Core Strategy

OpenFuse maintains a clean separation between community and enterprise capabilities:

- **Community Edition**: Contains foundational pipeline orchestration, connectors, and monitoring endpoints. All code lives in this repository under permissive licensing.
- **Enterprise Edition**: Distributed as proprietary packages that plug into the extension points documented in [`overview.md`](overview.md). These packages are versioned to align with community releases and rely on public interfaces only.

## Packaging guidelines

1. Keep public interfaces stable by documenting them in the `docs/` directory and applying semantic versioning.
2. Load optional features using dynamic imports or entry points so enterprise modules can be installed independently.
3. Provide fallbacks and feature flag checks in community code to avoid referencing closed-source modules at runtime.
4. Offer migration scripts and Terraform modules in `infra/` that are production-ready while advanced observability/security features ship separately.
