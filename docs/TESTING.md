# Testing Guide - VLOCKSTER

This document provides comprehensive information about testing in the VLOCKSTER project.

## Overview

VLOCKSTER uses a dual testing strategy:
- **Unit/Integration Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright for end-to-end user flows

## Test Coverage Goals

### Current Thresholds (Epic 4)
- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 75%+
- **Statements**: 80%+

### Running Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View HTML report
open coverage/index.html
```

## Test Structure

### Unit Tests (Vitest)
- **Location**: `lib/**/*.test.ts`, `tests/components/**/*.test.tsx`
- **Framework**: Vitest with jsdom environment
- **Testing Library**: React Testing Library
- **Run**: `pnpm test:unit`
- **UI Mode**: `pnpm test:unit:ui`

### Integration Tests (Playwright)
- **Location**: `tests/api/**/*.spec.ts`
- **Framework**: Playwright
- **Run**: `pnpm test tests/api/`
- **Coverage**: API endpoints, validation, authentication

### E2E Tests (Playwright)
- **Location**: `tests/e2e/**/*.spec.ts`, `tests/**/*.spec.ts`
- **Framework**: Playwright
- **Run**: `pnpm test`
- **UI Mode**: `pnpm test:ui`
- **Coverage**: Complete user flows, accessibility, navigation

## Test Categories

### 1. Component Unit Tests
- **Admin Components**: `AdminUserActions`, `AdminReportActions`
- **Project Components**: `PayPalButton`, `ProjectBackingCard`, `Pagination`
- **UI Components**: `BrandHeader`, `CookieConsent`, `RecommendationsSection`, `WebVitals`

### 2. API Integration Tests
- **Admin APIs**: approve-request, reject-request, resolve-report, update-user-role
- **Project APIs**: projects/create
- **Payment APIs**: paypal/create-order, paypal/capture-order
- **Community APIs**: comments/create, posts/create
- **User APIs**: user/export, user/delete (GDPR)

### 3. E2E Flow Tests
- **Video Upload Flow**: Dashboard → Upload → Video Page
- **Project Creation Flow**: Dashboard → Create → Project Page
- **Backing Flow**: Project Page → Backing → Payment
- **Admin Moderation Flow**: Requests → Reports → Actions

## Running Tests

### All Tests
```bash
pnpm test:all  # Unit tests with coverage + E2E tests
```

### Unit Tests Only
```bash
pnpm test:unit          # Run unit tests
pnpm test:unit:ui       # Open Vitest UI
pnpm test:coverage      # Run with coverage report
```

### E2E Tests Only
```bash
pnpm test               # Run all E2E tests
pnpm test:ui            # Open Playwright UI
pnpm test:headed        # Run in headed mode
pnpm test:debug         # Debug mode with Playwright Inspector
```

### Specific Test Files
```bash
# Run specific test file
pnpm test tests/components/AdminUserActions.test.tsx

# Run specific E2E test
pnpm test tests/e2e/video-upload-flow.spec.ts
```

## CI/CD Integration

### GitHub Actions
The project includes a CI workflow (`.github/workflows/ci.yml`) that:
- Runs TypeScript type checking
- Runs ESLint
- Runs unit tests with coverage
- Uploads coverage to Codecov
- Runs E2E tests
- Builds the application

### Coverage Reports
Coverage reports are generated in multiple formats:
- **Text**: Console output
- **JSON**: `coverage/coverage-final.json`
- **HTML**: `coverage/index.html`
- **LCOV**: `coverage/lcov.info` (for CI integration)

## Test Best Practices

### Unit Tests
1. **Isolate Components**: Mock external dependencies
2. **Test Behavior**: Focus on user interactions, not implementation
3. **Accessibility**: Test ARIA labels, roles, keyboard navigation
4. **Edge Cases**: Test error states, empty states, loading states

### E2E Tests
1. **User Flows**: Test complete user journeys
2. **Accessibility**: Verify ARIA landmarks, keyboard navigation
3. **Error Handling**: Test error messages and recovery
4. **Cross-Browser**: Run tests in multiple browsers (CI)

## Test Data

### Mocking
- **Supabase Client**: Mocked in unit tests
- **PayPal SDK**: Mocked in component tests
- **Fetch API**: Mocked in API tests
- **Next.js Router**: Mocked in component tests

### Test Fixtures
- Test data is generated inline in tests
- No external fixture files required
- UUIDs use standard format: `00000000-0000-0000-0000-000000000000`

## Debugging Tests

### Vitest
```bash
# Run with debug output
pnpm test:unit --reporter=verbose

# Run specific test
pnpm test:unit --run tests/components/AdminUserActions.test.tsx
```

### Playwright
```bash
# Debug mode (opens Playwright Inspector)
pnpm test:debug

# Run with trace
pnpm test --trace on

# Run with UI mode
pnpm test:ui
```

## Coverage Exclusions

The following are excluded from coverage:
- Configuration files (`*.config.ts`)
- Type definitions (`*.d.ts`, `types/**`)
- Test files (`tests/**`)
- External files (`external/**`)
- Build artifacts (`.next/`, `dist/`)

## Future Improvements

1. **Increase Coverage**: Target 90%+ for critical paths
2. **Visual Regression**: Add screenshot comparison tests
3. **Performance Tests**: Add Lighthouse CI integration
4. **Accessibility Tests**: Expand automated a11y testing
5. **Load Tests**: Add API load testing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

