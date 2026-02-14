# OpenFuse Testing & Quality Assurance Backlog

## 🚨 Critical Issues (Fix Immediately)

### [BUG-001] Database Tables Not Created Automatically
- **Priority**: P0 - Critical
- **Status**: ✅ Fixed (Added `create_db_and_tables()` to startup)
- **Impact**: Application crashes on first pipeline creation
- **Solution**: Added database initialization in `app/main.py`

### [BUG-002] CORS Configuration Missing
- **Priority**: P0 - Critical
- **Status**: ✅ Fixed (Added CORSMiddleware)
- **Impact**: Frontend cannot communicate with API in development
- **Solution**: Added CORS with origins `localhost:3000` and `host.docker.internal:3000`

### [BUG-003] Wrong Field Names in Pipeline Creation
- **Priority**: P1 - High
- **Status**: ✅ Fixed (Changed `source`/`destination` to `source_connector`/`destination_connector`)
- **Impact**: 422 Unprocessable Entity error when creating pipelines
- **Solution**: Updated frontend to use correct API schema field names

## 📋 High Priority Issues

### [TEST-001] No E2E Test Coverage
- **Priority**: P1 - High
- **Status**: 🔄 In Progress
- **Impact**: Cannot test full user flows, critical bugs may reach production
- **Solution**: Implement E2E tests using Vitest + Playwright
- **Estimated Effort**: 1 week
- **Assigned To**: Phase 1

### [TEST-002] Backend Test Coverage ~2%
- **Priority**: P1 - High
- **Status**: ⏳ Pending
- **Impact**: High risk of regressions, low confidence in changes
- **Solution**: Write unit tests for all API endpoints, models, and services
- **Estimated Effort**: 1 week
- **Assigned To**: Phase 2

### [TEST-003] Frontend Test Coverage ~24%
- **Priority**: P1 - High
- **Status**: ⏳ Pending
- **Impact**: UI bugs may go undetected
- **Solution**: Write tests for all pages and components
- **Estimated Effort**: 3-4 days
- **Assigned To**: Phase 3

## 🔍 Medium Priority Issues

### [INFRA-001] No CI/CD Pipeline
- **Priority**: P2 - Medium
- **Status**: ⏳ Pending
- **Impact**: Tests must be run manually, no automated checks on PRs
- **Solution**: Set up GitHub Actions workflow
- **Estimated Effort**: 2-3 days
- **Assigned To**: Phase 5

### [TEST-004] No Test Fixtures/Factories
- **Priority**: P2 - Medium
- **Status**: ⏳ Pending
- **Impact**: Test code is verbose and hard to maintain
- **Solution**: Create factory methods for test data generation
- **Estimated Effort**: 1-2 days
- **Assigned To**: Phase 2

### [TEST-005] No Integration Tests
- **Priority**: P2 - Medium
- **Status**: ⏳ Pending
- **Impact**: Cannot test API-database or frontend-backend interactions
- **Solution**: Write integration tests for critical paths
- **Estimated Effort**: 3-4 days
- **Assigned To**: Phase 4

## 📝 Low Priority Issues

### [QUAL-001] No Test Coverage Reporting
- **Priority**: P3 - Low
- **Status**: ⏳ Pending
- **Impact**: Cannot track coverage improvement over time
- **Solution**: Configure coverage reporting with thresholds
- **Estimated Effort**: 1 day
- **Assigned To**: Phase 5

### [QUAL-002] No API Contract Tests
- **Priority**: P3 - Low
- **Status**: ⏳ Pending
- **Impact**: API changes may break frontend without detection
- **Solution**: Validate OpenAPI schemas against tests
- **Estimated Effort**: 2 days
- **Assigned To**: Phase 6

## 🎯 Completed Items

✅ [BUG-001] Database Tables Not Created Automatically
✅ [BUG-002] CORS Configuration Missing
✅ [BUG-003] Wrong Field Names in Pipeline Creation

## 📊 Coverage Progress

| Component | Target | Current | Status |
|-----------|--------|---------|--------|
| Frontend (Web) | 80% | 24% | ⏳ Phase 3 |
| Backend (API) | 80% | 2% | ⏳ Phase 2 |
| Integration Tests | 80% | 0% | ⏳ Phase 4 |
| E2E Tests | N/A | 0% | 🔄 Phase 1 |
| **Overall** | **80%** | **5.4%** | ⏳ Phase 1-4 |

## 🔄 Workflow

1. Issues are added as discovered during testing
2. Each issue tagged with priority (P0=Critical, P1=High, P2=Medium, P3=Low)
3. Work on issues in priority order
4. Mark as "In Progress" when started
5. Mark as "Fixed" when completed with PR/commit reference
6. Move to "Completed Items" section
7. Update coverage progress weekly

---

Last Updated: 2026-02-14
