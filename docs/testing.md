# OpenFuse Testing Guide

## Quick Start

### Run All Tests
```bash
# Frontend tests
cd apps/web
npm test

# Backend tests
cd apps/api
poetry run pytest

# E2E tests
cd apps/web
npm run test:e2e
```

### Run Specific Test Suites
```bash
# Run only pipeline tests
cd apps/api && poetry run pytest tests/test_pipelines.py

# Run only E2E pipeline creation tests
cd apps/web && npm run test:e2e pipeline-creation

# Run tests matching a pattern
cd apps/web && npm test -- -t "pipeline creation"
```

### Watch Mode for Development
```bash
# Watch frontend tests
cd apps/web && npm run test:watch

# Watch backend tests
cd apps/api && poetry run pytest --watch
```

### Run with Coverage
```bash
# Frontend with coverage
cd apps/web && npm run test:coverage

# Backend with coverage
cd apps/api && poetry run pytest --cov=app --cov-report=html
```

## Test Structure

### Frontend Tests (`apps/web/`)
- `test/` - Unit and integration tests for components
- `e2e/` - End-to-end tests for user flows
- `test/fixtures/` - Test data and mocks
- `test/helpers/` - Reusable test utilities

### Backend Tests (`apps/api/`)
- `tests/` - Unit and integration tests
- `tests/conftest.py` - Pytest configuration and fixtures

## Writing Tests

### Frontend Test Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Backend Test Example
```python
import pytest
from fastapi.testclient import TestClient

def test_endpoint(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
```

## Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| Frontend | 80% | 24% → 75%+ |
| Backend | 80% | 2% → 70%+ |
| Overall | 80% | 5.4% → 80%+ |

## CI/CD

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Manual trigger via GitHub Actions

See `.github/workflows/test.yml` for details.

### CI Jobs
1. **test-api** - Backend unit and integration tests
2. **test-web** - Frontend unit tests
3. **test-e2e** - End-to-end tests with full stack
4. **lint** - ESLint for frontend
5. **type-check** - TypeScript type checking
6. **python-lint** - Ruff linting for backend

## Test Categories

### Unit Tests
- Test individual functions, components, or classes in isolation
- Mock external dependencies
- Fast execution
- High confidence in code correctness

### Integration Tests
- Test multiple components working together
- Use real database (test database)
- Test API-to-database interactions
- Medium execution time

### E2E Tests
- Test complete user workflows
- Simulate real user interactions
- Full stack testing (UI → API → DB)
- Slower execution but highest value

## Best Practices

### Frontend
- Use `@testing-library/react` for component testing
- Test user behavior, not implementation details
- Mock API calls using `vi.fn()`
- Clean up after each test with `afterEach`
- Use descriptive test names

### Backend
- Use pytest fixtures for setup/teardown
- Test both success and error cases
- Validate HTTP status codes and response bodies
- Test edge cases and boundary conditions
- Keep tests independent and isolated

## Running Tests Locally

### Prerequisites
1. Start PostgreSQL database:
   ```bash
   docker compose -f infra/docker/docker-compose.yml up postgres
   ```

2. Set environment variables:
   ```bash
   export DATABASE_URL=postgresql://openfuse:openfuse@localhost:5432/openfuse_test
   export API_URL=http://localhost:8000
   ```

3. Install dependencies:
   ```bash
   cd apps/web && npm install
   cd ../api && poetry install
   ```

### Running Tests
```bash
# All tests
make test-all

# Frontend only
cd apps/web && npm test

# Backend only
cd apps/api && poetry run pytest

# E2E only
cd apps/web && npm run test:e2e
```

## Troubleshooting

### Frontend Tests Fail
1. Clear cache: `rm -rf node_modules/.vite`
2. Reinstall: `npm install`
3. Check Node version: `node --version` (should be 20+)

### Backend Tests Fail
1. Check database connection: Ensure PostgreSQL is running
2. Verify dependencies: `poetry install`
3. Check Python version: `python --version` (should be 3.11)

### E2E Tests Fail
1. Ensure API server is running on port 8000
2. Check database is initialized
3. Verify environment variables are set

## Adding New Tests

### Frontend
1. Create test file in `test/` directory
2. Import necessary testing utilities
3. Write tests using Testing Library patterns
4. Run tests: `npm test`
5. Check coverage: `npm run test:coverage`

### Backend
1. Create test file in `tests/` directory
2. Use pytest decorators and fixtures
3. Write tests with assertions
4. Run tests: `poetry run pytest`
5. Check coverage: `poetry run pytest --cov=app`

## Coverage Reports

- Frontend: `apps/web/coverage/index.html`
- Backend: `apps/api/htmlcov/index.html`

Open these files in a browser to see detailed coverage reports.

## Continuous Improvement

1. Run tests before committing code
2. Ensure coverage increases or stays the same
3. Fix failing tests immediately
4. Review coverage reports for untested code
5. Add tests for critical paths
6. Keep tests fast and maintainable
