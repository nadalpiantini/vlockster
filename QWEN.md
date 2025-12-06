# VLOCKSTER Project Context

## Project Overview

VLOCKSTER is a comprehensive platform that combines Netflix-style streaming, Kickstarter-style crowdfunding, and Skool-style community features specifically for independent cinema. It's built with modern web technologies including Next.js 15, TypeScript 5, Supabase, Cloudflare Stream, and PayPal for payments.

### Key Features
- **Streaming (Netflix-like)**: On-demand video catalog with Cloudflare Stream integration, visibility controls, and analytics
- **Crowdfunding (Kickstarter-like)**: Project creation with goals, deadlines, and reward tiers using PayPal payments
- **Community (Skool-like)**: Discussion forums, posts, comments, and notifications
- **Role-based System**: Viewer, Creator, Moderator, and Admin roles with appropriate permissions

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Backend**: Supabase (Authentication, Database, Storage)
- **Video**: Cloudflare Stream
- **Payments**: PayPal (Checkout + Subscriptions)
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Vercel + Cloudflare

## Building and Running

### Prerequisites
- Node.js 20+
- pnpm 9+
- Supabase account
- Cloudflare account (for video)
- PayPal Developer account

### Setup Process
1. Install dependencies: `pnpm install`
2. Copy environment variables: `cp .env.example .env.local`
3. Configure your credentials in `.env.local`
4. Run Supabase migrations in order (00-08)
5. Generate TypeScript types: `pnpm supabase:types`
6. Start development server: `pnpm dev`

### Key Commands
- `pnpm dev` - Start development server (runs on port 3009)
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Check TypeScript types
- `pnpm format` - Format code with Prettier
- `pnpm test:all` - Run all tests with coverage
- `pnpm test:unit` - Run unit tests only
- `pnpm test` - Run E2E tests only
- `pnpm supabase:types` - Generate TypeScript types from Supabase

### Project Structure
```
vlockster/
├── app/                      # Next.js App Router
├── components/               # React components (including shadcn/ui)
├── lib/                      # Utility functions and Supabase clients
├── supabase/                 # SQL migration files
├── types/                    # TypeScript type definitions
├── public/                   # Static assets
├── docs/                     # Documentation
├── tests/                    # Test files
├── scripts/                  # Build/deployment scripts
└── specs/                    # Specification documents
```

## Development Conventions

### Code Quality
- Uses ESLint with Next.js recommended rules
- TypeScript strict mode enabled
- Prettier for code formatting
- 80%+ test coverage target (lines, functions, statements), 75%+ branches

### Testing Strategy
- Unit tests with Vitest and React Testing Library
- E2E tests with Playwright
- Comprehensive coverage with specific targets

### Database Schema
- Uses Supabase with Row Level Security (RLS)
- Migrations organized in numbered sequence (00-08)
- Roles and permissions defined in RLS policies
- Key tables: profiles, videos, projects, rewards, backings, communities, posts, comments

### BMAD-METHOD™ Integration
- Uses BMAD-METHOD™ (Breakthrough Method of Agile AI-driven Development)
- Multiple specialized AI agents available via @ mentions in Cursor
- Agents for development, product management, architecture, QA, UX, and more

## Security & Performance
- Content Security Policy (CSP) headers configured
- Rate limiting with Upstash Redis
- Secure authentication through Supabase
- React Strict Mode enabled
- Bundle analysis available with ANALYZE=true flag

## Key Files & Configuration
- `next.config.ts`: Next.js configuration with security headers and image optimization
- `tsconfig.json`: TypeScript configuration with path aliases
- `middleware.ts`: Authentication handled in server components rather than middleware
- `package.json`: Dependencies and scripts
- `AGENTS.md`: Complete directory of BMAD-METHOD™ agents
- Various SQL files in `supabase/` directory for database schema