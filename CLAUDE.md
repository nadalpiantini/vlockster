# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VLOCKSTER is a full-stack platform combining Netflix-style streaming, Kickstarter-style crowdfunding, and Skool-style community features for independent cinema. Built with Next.js 15 (App Router), React 19, TypeScript 5, Supabase, Cloudflare Stream, and PayPal integration.

## Development Commands

### Core Development
```bash
pnpm dev              # Start dev server on port 3007 with Turbopack
pnpm build            # Production build
pnpm start            # Start production server on port 3007
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking (always run before commits)
pnpm format           # Format code with Prettier
```

### Testing
```bash
# Playwright (E2E tests)
pnpm test             # Run all E2E tests
pnpm test:ui          # Open Playwright UI
pnpm test:headed      # Run tests in headed mode
pnpm test:debug       # Debug mode with Playwright Inspector

# Vitest (Unit tests)
pnpm test:unit        # Run unit tests
pnpm test:unit:ui     # Open Vitest UI
pnpm test:coverage    # Generate coverage report

# Run both test suites
pnpm test:all         # Vitest with coverage + Playwright
```

### Supabase
```bash
# Generate TypeScript types from database schema
pnpm supabase:types   # Updates types/database.types.ts
```

### Deployment
```bash
pnpm deploy:prod      # TypeScript deployment script
pnpm deploy:prod:bash # Bash deployment script
```

## Architecture & Key Patterns

### Supabase Client Architecture

**Critical**: This project uses two separate Supabase clients that MUST NOT be mixed:

1. **Browser Client** (`lib/supabase/client.ts`):
   - Use in Client Components
   - Import with: `import { createClient } from '@/lib/supabase/client'`

2. **Server Client** (`lib/supabase/server.ts`):
   - Use in Server Components, Route Handlers, and Server Actions
   - Import with: `import { createClient } from '@/lib/supabase/server'`
   - ALWAYS await: `const supabase = await createClient()`

**Never** import the wrong client for your context. Server Components cannot use the browser client and vice versa.

### Authentication & Authorization

**Current State**: Authentication is temporarily DISABLED via `DISABLE_AUTH = true` in `lib/utils/role-check.ts`. All protected routes return a mock guest user. To re-enable auth, set `DISABLE_AUTH = false`.

**Role System**:
- `viewer`: Basic user (default)
- `creator`: Can upload videos and create crowdfunding projects
- `moderator`: Can moderate community content
- `admin`: Full platform access

**Role Check Utilities** (`lib/utils/role-check.ts`):
```typescript
await requireAuth()                    // Require any authenticated user
await requireRole(['creator', 'admin']) // Require specific roles
await checkIsCreator()                 // Returns boolean
await checkIsAdmin()                   // Returns boolean
```

### Middleware Pattern

**Important**: `middleware.ts` is intentionally minimal and does NOT perform Supabase authentication. Next.js 15 + Supabase SSR best practice is to handle auth in Server Components and Route Handlers, not in Edge middleware.

### Database Migrations

Supabase migrations are numbered and MUST be applied in order:
1. `vlockster_00_schema.sql` - Base schema
2. `vlockster_01_auth_profiles.sql` - User profiles and roles
3. `vlockster_02_creator_requests.sql` - Creator application system
4. `vlockster_03_videos.sql` - Video streaming tables
5. `vlockster_04_projects.sql` - Crowdfunding projects
6. `vlockster_05_communities.sql` - Community forums
7. `vlockster_06_moderation.sql` - Moderation system
8. `vlockster_07_rls_policies.sql` - Row Level Security policies
9. `vlockster_08_triggers.sql` - Database triggers

After schema changes, always regenerate types: `pnpm supabase:types`

### Testing Strategy

**Two Test Frameworks**:

1. **Vitest** (Unit/Integration tests):
   - Located in: `lib/**/*.test.ts`, `tests/components/**/*.test.tsx`
   - Config: `vitest.config.ts`
   - Coverage thresholds: 100% lines/functions/statements, 75% branches
   - Test files: `**/*.{test,spec}.{ts,tsx}` (excluding Playwright specs)

2. **Playwright** (E2E tests):
   - Located in: `tests/**/*.spec.ts`
   - Config: `playwright.config.ts`
   - Base URL: `http://localhost:3007`
   - Auto-starts dev server before tests
   - Test files: `*.spec.ts` in tests directory

**Never mix test frameworks**: Use `.test.ts` for Vitest, `.spec.ts` for Playwright.

### API Route Handlers

API routes follow Next.js 15 App Router conventions in `app/api/`:
- Must export named functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Return `NextResponse` objects
- Use server-side Supabase client
- Handle errors with proper HTTP status codes

Structure:
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  // ... implementation
  return NextResponse.json(data)
}
```

### Import Aliases

The project uses `@/` for absolute imports (configured in `tsconfig.json`):
- `@/app/*` - App Router pages and layouts
- `@/components/*` - React components
- `@/lib/*` - Utilities, Supabase clients, hooks
- `@/types/*` - TypeScript type definitions

### UI Components

Using **shadcn/ui** components built on Radix UI + Tailwind CSS:
- Located in: `components/ui/`
- Minimal set: button, card, input, label, textarea
- Follow shadcn/ui patterns for adding new components
- Icons: Use `lucide-react` package

### Development Port

**Always use port 3007** for local development. This is hardcoded in:
- `package.json` scripts (`-p 3007`)
- `playwright.config.ts` base URL
- Environment variable examples

## Critical Files to Check Before Changes

1. **Database Schema**: Check `types/database.types.ts` for type-safe Supabase queries
2. **Role Permissions**: Review `lib/utils/role-check.ts` for auth logic
3. **Environment Variables**: Verify `.env.local` has all required keys from `.env.example`
4. **Test Coverage**: Run `pnpm test:coverage` to ensure >100% for critical code

## BMAD-METHOD Integration

This project uses BMAD-METHOD™ for agent-driven development. See `AGENTS.md` for available agents. Common agents:
- `@dev` - Development and implementation
- `@pm` - Product management
- `@qa` - Quality assurance
- `@architect` - System architecture

Documentation in `.bmad-core/user-guide.md` and `docs/` directory.

## Common Gotchas

1. **Server vs Client Supabase**: Always use the correct client for your context
2. **Async Server Client**: Server Supabase client returns a Promise - always await it
3. **Auth Disabled**: Remember authentication is currently disabled in `role-check.ts`
4. **Port 3007**: Development server runs on 3007, not standard 3000
5. **Test File Naming**: `.test.ts` for Vitest, `.spec.ts` for Playwright
6. **Type Generation**: Run `pnpm supabase:types` after any database schema changes
