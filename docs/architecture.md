# VLOCKSTER Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the VLOCKSTER codebase, including technical patterns, integrations, and real-world implementation details. It serves as a reference for AI agents working on enhancements and new features.

### Document Scope

Comprehensive documentation of entire system - a platform combining Netflix (streaming), Kickstarter (crowdfunding), and Skool (community) for independent cinema.

### Change Log

| Date   | Version | Description                 | Author    |
| ------ | ------- | --------------------------- | --------- |
| 2025-12-04 | 1.0     | Initial brownfield analysis | BMad Master |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `app/layout.tsx` - Root layout with metadata
- **Landing Page**: `app/page.tsx` - Main entry point
- **Configuration**: `next.config.ts`, `.env.local` (not in repo)
- **Middleware**: `middleware.ts` - Next.js middleware (currently minimal, auth handled in components)
- **Database Schema**: `supabase/vlockster_*.sql` - 9 migration files in sequence
- **Type Definitions**: `types/database.types.ts` - Generated from Supabase
- **Supabase Clients**: 
  - `lib/supabase/client.ts` - Browser client
  - `lib/supabase/server.ts` - Server client
  - `lib/supabase/middleware.ts` - Middleware client (if exists)
- **Styling**: `app/globals.css` - Global styles with CSS variables
- **Tailwind Config**: `tailwind.config.ts` - Theme configuration

## High Level Architecture

### Technical Summary

VLOCKSTER is a full-stack Next.js 15 application using the App Router pattern. It combines:
- **Streaming Platform**: Video content delivery via Cloudflare Stream
- **Crowdfunding**: Project creation and backing via PayPal integration
- **Community**: Forums, posts, comments, and engagement features
- **Role-Based Access**: Viewer, Creator, Moderator, Admin roles with RLS policies

### Actual Tech Stack

| Category | Technology | Version | Notes |
| --------- | ---------- | ------- | -------------------------- |
| Runtime | Node.js | 20.x | Required by engines |
| Framework | Next.js | 15.1.0 | App Router, React Server Components |
| React | React | 19.0.0 | Latest version |
| TypeScript | TypeScript | 5.x | Strict typing |
| Package Manager | pnpm | 9.15.0 | Required by engines |
| Styling | Tailwind CSS | 4.0.0 | Latest version |
| UI Components | shadcn/ui | - | Built on Radix UI |
| Database | Supabase (PostgreSQL) | - | Auth + Database + Storage |
| Video Streaming | Cloudflare Stream | - | React component integration |
| Payments | PayPal | - | Checkout + Subscriptions |
| Rate Limiting | Upstash Redis | - | API rate limiting |
| Testing | Playwright | 1.57.0 | E2E tests |
| Testing | Vitest | 4.0.15 | Unit tests |
| Form Handling | React Hook Form | 7.49.3 | With Zod validation |
| Validation | Zod | 3.22.4 | Schema validation |
| Icons | Lucide React | 0.555.0 | Icon library |
| Date Utils | date-fns | 3.0.6 | Date formatting |
| Sanitization | isomorphic-dompurify | 2.33.0 | XSS protection |

### Repository Structure Reality Check

- **Type**: Monorepo (single Next.js application)
- **Package Manager**: pnpm 9.15.0 (strict requirement)
- **Notable**: 
  - Uses Turbopack for dev (`next dev --turbopack`)
  - Custom port 3007 (not default 3000)
  - ESLint and TypeScript errors ignored during builds (see next.config.ts)

## Source Tree and Module Organization

### Project Structure (Actual)

```
vlockster/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles with CSS variables
│   ├── login/               # Authentication pages
│   │   └── page.tsx
│   ├── signup/              # Registration
│   │   └── page.tsx
│   ├── dashboard/           # Role-adaptive dashboard
│   │   └── page.tsx
│   ├── apply/               # Creator application
│   │   └── page.tsx
│   ├── watch/               # Video catalog and player
│   │   ├── page.tsx         # Catalog
│   │   └── [id]/            # Video player
│   │       └── page.tsx
│   ├── projects/            # Crowdfunding projects
│   │   ├── page.tsx         # Project listing
│   │   ├── create/          # Create project
│   │   │   └── page.tsx
│   │   ├── my/               # User's projects
│   │   │   └── page.tsx
│   │   └── [id]/            # Project detail
│   │       └── page.tsx
│   ├── community/           # Forums and discussions
│   │   ├── page.tsx         # Community listing
│   │   ├── [slug]/          # Community detail
│   │   │   └── page.tsx
│   │   └── post/            # Post detail
│   │       └── [id]/
│   │           └── page.tsx
│   ├── admin/               # Admin panel
│   │   ├── requests/        # Approve creator requests
│   │   │   └── page.tsx
│   │   ├── users/           # User management
│   │   │   └── page.tsx
│   │   └── reports/         # Moderation reports
│   │       └── page.tsx
│   ├── upload/              # Video upload (pending)
│   │   └── page.tsx
│   ├── my-analytics/        # Creator analytics
│   │   └── page.tsx
│   ├── notifications/       # User notifications
│   │   └── page.tsx
│   ├── legal/               # Legal pages
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   ├── api/                 # API Route Handlers
│   │   ├── admin/
│   │   │   ├── approve-request/
│   │   │   │   └── route.ts
│   │   │   └── reject-request/
│   │   │       └── route.ts
│   │   ├── analytics/
│   │   │   └── route.ts
│   │   ├── comments/
│   │   │   └── create/
│   │   │       └── route.ts
│   │   ├── paypal/
│   │   │   ├── create-order/
│   │   │   │   └── route.ts
│   │   │   └── capture-order/
│   │   │       └── route.ts
│   │   ├── posts/
│   │   │   └── create/
│   │   │       └── route.ts
│   │   ├── projects/
│   │   │   └── create/
│   │   │       └── route.ts
│   │   ├── user/
│   │   │   ├── delete/
│   │   │   │   └── route.ts
│   │   │   └── export/
│   │   │       └── route.ts
│   │   └── videos/
│   │       └── upload/
│   │           └── route.ts
│   ├── robots.txt           # SEO robots file
│   └── sitemap.ts           # Dynamic sitemap
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   ├── feature/             # Feature components (empty?)
│   ├── layout/              # Layout components (empty?)
│   ├── PayPalButton.tsx     # PayPal integration component
│   ├── AdminRequestActions.tsx
│   ├── ProjectBackingCard.tsx
│   └── ProjectRewardCard.tsx
├── lib/
│   ├── supabase/            # Supabase clients
│   │   ├── client.ts         # Browser client (createBrowserClient)
│   │   ├── server.ts         # Server client (createServerClient)
│   │   └── middleware.ts    # Middleware client (if exists)
│   └── utils/                # Utilities
│       ├── cn.ts             # Tailwind class merger
│       ├── api-helpers.ts    # API helper functions
│       ├── rate-limit.ts    # Rate limiting utilities
│       ├── role-check.ts    # Role checking helpers
│       └── sanitize.ts      # Content sanitization
├── supabase/                # Database migrations (9 files)
│   ├── vlockster_00_schema.sql
│   ├── vlockster_01_auth_profiles.sql
│   ├── vlockster_02_creator_requests.sql
│   ├── vlockster_03_videos.sql
│   ├── vlockster_04_projects.sql
│   ├── vlockster_05_communities.sql
│   ├── vlockster_06_moderation.sql
│   ├── vlockster_07_rls_policies.sql
│   └── vlockster_08_triggers.sql
├── types/
│   └── database.types.ts    # Generated from Supabase
├── tests/                   # Test suites
│   ├── accessibility/
│   │   └── a11y.spec.ts
│   ├── api/                 # API route tests
│   │   ├── admin.spec.ts
│   │   ├── analytics.spec.ts
│   │   ├── comments.create.spec.ts
│   │   ├── paypal.spec.ts
│   │   ├── posts.create.spec.ts
│   │   ├── projects.create.spec.ts
│   │   ├── user.spec.ts
│   │   └── videos.upload.spec.ts
│   ├── components/          # Component tests
│   │   ├── button.test.tsx
│   │   └── card.test.tsx
│   ├── integration/
│   │   └── full-flow.spec.ts
│   ├── security/
│   │   └── xss.spec.ts
│   ├── landing.spec.ts
│   ├── user-journey.spec.ts
│   └── setup.ts
├── middleware.ts            # Next.js middleware (minimal)
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
├── playwright.config.ts     # Playwright configuration
└── package.json             # Dependencies and scripts
```

### Key Modules and Their Purpose

- **Authentication**: Handled via Supabase Auth, not in middleware (see middleware.ts comments)
- **Database Access**: 
  - Browser: `lib/supabase/client.ts` - Uses `createBrowserClient` from `@supabase/ssr`
  - Server: `lib/supabase/server.ts` - Uses `createServerClient` with Next.js cookies
- **Video Management**: Cloudflare Stream integration via `@cloudflare/stream-react`
- **Payment Processing**: PayPal integration via `@paypal/react-paypal-js` and API routes
- **Role Management**: `lib/utils/role-check.ts` - Helper functions for role checking
- **Content Sanitization**: `lib/utils/sanitize.ts` - XSS protection using isomorphic-dompurify
- **Rate Limiting**: `lib/utils/rate-limit.ts` - Upstash Redis integration
- **Form Handling**: React Hook Form with Zod validation schemas

## Data Models and APIs

### Database Schema

The database is managed through 9 sequential migration files in `supabase/`:

1. **vlockster_00_schema.sql** - Base schema setup
2. **vlockster_01_auth_profiles.sql** - User profiles linked to auth
3. **vlockster_02_creator_requests.sql** - Creator application system
4. **vlockster_03_videos.sql** - Video catalog and metadata
5. **vlockster_04_projects.sql** - Crowdfunding projects and rewards
6. **vlockster_05_communities.sql** - Community/forum structure
7. **vlockster_06_moderation.sql** - Reporting and moderation
8. **vlockster_07_rls_policies.sql** - Row Level Security policies
9. **vlockster_08_triggers.sql** - Database triggers

**Type Generation**: Run `pnpm supabase:types` to regenerate `types/database.types.ts` from Supabase schema.

### API Route Handlers

All API routes are in `app/api/` following Next.js 15 App Router conventions:

- **Admin Routes** (`app/api/admin/`):
  - `approve-request/route.ts` - Approve creator applications
  - `reject-request/route.ts` - Reject creator applications

- **Analytics** (`app/api/analytics/route.ts`):
  - Video and engagement analytics

- **Comments** (`app/api/comments/create/route.ts`):
  - Create comments on posts

- **PayPal** (`app/api/paypal/`):
  - `create-order/route.ts` - Create PayPal order
  - `capture-order/route.ts` - Capture PayPal payment

- **Posts** (`app/api/posts/create/route.ts`):
  - Create community posts

- **Projects** (`app/api/projects/create/route.ts`):
  - Create crowdfunding projects

- **User** (`app/api/user/`):
  - `delete/route.ts` - Delete user account
  - `export/route.ts` - Export user data

- **Videos** (`app/api/videos/upload/route.ts`):
  - Upload video to Cloudflare Stream

### Data Models Reference

Instead of duplicating, reference actual schema files:
- **Database Types**: See `types/database.types.ts` (generated)
- **Schema Definitions**: See `supabase/vlockster_*.sql` files
- **Validation Schemas**: See `lib/validations/schemas.ts` (if exists)

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Middleware Authentication**: 
   - Currently minimal (see `middleware.ts` line 5-7)
   - Comments indicate Next.js 15 + Supabase recommends NOT authenticating from middleware
   - Authentication handled in Server Components and Route Handlers instead
   - **Impact**: May need refactoring if edge runtime authentication is required

2. **Build Configuration**:
   - ESLint errors ignored during builds (`eslint.ignoreDuringBuilds: true`)
   - TypeScript errors NOT ignored (`typescript.ignoreBuildErrors: false`)
   - **Impact**: Production builds may fail on type errors but not lint errors

3. **Port Configuration**:
   - Custom port 3007 hardcoded in scripts
   - **Impact**: Must remember to use port 3007, not default 3000

4. **Test Coverage**:
   - Unit tests exist but coverage percentage unknown
   - E2E tests exist but may not cover all flows
   - **Impact**: Some areas may lack test coverage

### Workarounds and Gotchas

- **Environment Variables**: Must set Supabase and Cloudflare credentials in `.env.local` (not in repo)
- **Database Migrations**: Must run in sequential order (00-08)
- **Type Generation**: Must run `pnpm supabase:types` after schema changes
- **Turbopack**: Dev server uses Turbopack (`--turbopack` flag), may have different behavior than webpack
- **Middleware**: Edge runtime limitations mean Supabase client cannot be used in middleware

## Integration Points and External Dependencies

### External Services

| Service | Purpose | Integration Type | Key Files |
| -------- | -------- | ---------------- | ------------------------------ |
| Supabase | Auth + Database + Storage | SDK (`@supabase/ssr`) | `lib/supabase/client.ts`, `lib/supabase/server.ts` |
| Cloudflare Stream | Video hosting and streaming | React Component (`@cloudflare/stream-react`) | Used in video player pages |
| PayPal | Payment processing | SDK (`@paypal/react-paypal-js`) + REST API | `components/PayPalButton.tsx`, `app/api/paypal/` |
| Upstash Redis | Rate limiting | SDK (`@upstash/redis`, `@upstash/ratelimit`) | `lib/utils/rate-limit.ts` |

### Internal Integration Points

- **Frontend-Backend**: Next.js App Router with Server Components and Route Handlers
- **Authentication Flow**: Supabase Auth → Server Components check session → Route Handlers validate
- **Video Upload**: API route → Cloudflare Stream API → Store metadata in Supabase
- **Payment Flow**: Frontend PayPal component → API route → PayPal API → Update project in Supabase
- **Role-Based Access**: RLS policies in Supabase + `lib/utils/role-check.ts` helpers

## Development and Deployment

### Local Development Setup

1. **Prerequisites**:
   - Node.js 20.x (strict requirement)
   - pnpm 9.15.0+ (strict requirement)
   - Supabase project with migrations applied
   - Cloudflare account for video streaming
   - PayPal Developer account

2. **Installation**:
   ```bash
   pnpm install
   ```

3. **Environment Variables** (create `.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_PROJECT_ID=your_project_id
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_MODE=sandbox  # or 'live'
   ```

4. **Database Setup**:
   ```bash
   # Link to Supabase project
   supabase link --project-ref your-project-id
   
   # Apply migrations in order
   supabase db push --file supabase/vlockster_00_schema.sql
   # ... repeat for all 9 files
   
   # Generate TypeScript types
   pnpm supabase:types
   ```

5. **Start Development Server**:
   ```bash
   pnpm dev
   # Server runs on http://localhost:3007 (not 3000!)
   ```

### Build and Deployment Process

- **Build Command**: `pnpm build`
- **Start Production**: `pnpm start` (runs on port 3007)
- **Deployment**: 
  - Scripts exist: `deploy:prod` and `deploy:prod:bash`
  - Likely deployed to Vercel (Next.js platform)
  - Cloudflare for video CDN
- **Environments**: Dev (local), Production (Vercel)

### Testing

- **Unit Tests**: `pnpm test:unit` (Vitest)
- **E2E Tests**: `pnpm test` (Playwright)
- **Test UI**: `pnpm test:ui` (Vitest UI) or `pnpm test:unit:ui`
- **Coverage**: `pnpm test:coverage`
- **All Tests**: `pnpm test:all`

## Testing Reality

### Current Test Coverage

- **Unit Tests**: Vitest with jsdom, testing library components
- **E2E Tests**: Playwright tests for user journeys and API routes
- **Test Files**: Located in `tests/` directory
- **Coverage**: Coverage reports generated (see `coverage/` directory)

### Running Tests

```bash
pnpm test:unit          # Run unit tests
pnpm test               # Run E2E tests (Playwright)
pnpm test:ui            # Run tests with UI
pnpm test:coverage      # Run with coverage report
pnpm test:all           # Run all tests with coverage
```

## Code Patterns and Conventions

### React Patterns

- **Server Components**: Default in App Router
- **Client Components**: Marked with `'use client'` directive
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS variables for theming
- **Icons**: Lucide React icons

### TypeScript Patterns

- **Strict Typing**: TypeScript 5 with strict mode
- **Database Types**: Generated from Supabase schema
- **Type Safety**: Zod schemas for runtime validation

### File Organization

- **App Router**: All routes in `app/` directory
- **API Routes**: Route handlers in `app/api/`
- **Components**: Reusable components in `components/`
- **Utilities**: Helper functions in `lib/utils/`
- **Types**: Type definitions in `types/`

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
pnpm dev              # Start development server (port 3007)
pnpm build            # Production build
pnpm start            # Start production server (port 3007)
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking
pnpm format           # Format code with Prettier
pnpm supabase:types   # Generate Supabase TypeScript types
pnpm test:unit        # Run unit tests
pnpm test             # Run E2E tests
pnpm test:all         # Run all tests with coverage
```

### Debugging and Troubleshooting

- **Logs**: Check browser console and server logs
- **Type Errors**: Run `pnpm typecheck` to see TypeScript errors
- **Database**: Use Supabase dashboard for database inspection
- **Environment**: Verify `.env.local` has all required variables

### Common Issues

1. **Port Already in Use**: Change port in `package.json` scripts or kill process on 3007
2. **Supabase Connection**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Type Errors**: Run `pnpm supabase:types` after schema changes
4. **Build Errors**: Check TypeScript errors (ESLint errors are ignored)

---

**Document Status**: Complete initial brownfield analysis
**Last Updated**: 2025-12-04
**Next Steps**: This document can be sharded using `@po` agent with `*shard-doc` command if needed for focused development
