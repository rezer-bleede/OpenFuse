# Infrastructure

The `infra/` directory contains deployment tooling that works for both community users and commercial customers.

- `docker/`: Local developer experience with Docker Compose and language-specific Dockerfiles.
- `terraform/`: Infrastructure as code with environment overlays and reusable modules.

Enterprise customers can layer additional modules (e.g., security hardening, observability) without diverging from the open-core baseline by referencing the same module interfaces.
