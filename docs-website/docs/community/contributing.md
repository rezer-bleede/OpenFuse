---
title: Contributing Guide
description: Contribute to OpenFuse development.
slug: /community/contributing
---

# Contributing Guide

Thank you for your interest in contributing to OpenFuse!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch

## Development Setup

```bash
# Install dependencies
make install

# Start development environment
docker compose -f infra/docker/docker-compose.yml up
```

## Making Changes

1. Write your code
2. Add tests (80%+ coverage required)
3. Run linting
4. Submit a pull request

## Code Style

- **Python**: Follow PEP 8, use Ruff
- **TypeScript**: Follow ESLint, use Prettier

## Commit Messages

Use conventional commits:

```
feat: add new connector
fix: resolve sync issue
docs: update documentation
```

## Pull Request Process

1. Update documentation
2. Add tests for changes
3. Ensure CI passes
4. Request review

## Community

- [Discord](https://discord.gg/openfuse)
- [GitHub Discussions](https://github.com/your-username/openfuse/discussions)

## Related

- [Roadmap](/docs/community/roadmap)
- [Support](/docs/community/support)
