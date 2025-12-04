# Documentación de Código - VLOCKSTER

> Aplicando técnicas de Context7 para documentación actualizada y semántica

## Visión General

Este documento proporciona documentación semántica del código, generada usando técnicas de Context7 para mantener documentación actualizada y accesible.

## Estructura del Proyecto

### App Router (Next.js 15)

```
app/
├── page.tsx              # Landing page principal
├── layout.tsx            # Layout raíz con metadata
├── globals.css           # Estilos globales
├── login/                # Autenticación
├── signup/               # Registro
├── dashboard/            # Dashboard adaptativo por rol
├── watch/                # Catálogo y reproductor de videos
├── projects/             # Crowdfunding
├── community/            # Foros y discusiones
└── admin/                # Panel administrativo
```

### Componentes

```
components/
├── ui/                   # Componentes shadcn/ui
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
└── PayPalButton.tsx      # Integración PayPal
```

### Librerías

```
lib/
├── supabase/             # Clientes Supabase
│   ├── client.ts         # Cliente browser
│   ├── server.ts         # Cliente server
│   └── middleware.ts     # Middleware de sesión
└── utils/                # Utilidades
    ├── cn.ts             # Tailwind class merger
    └── role-check.ts     # Helpers de roles
```

## Páginas Principales

### Landing Page (`app/page.tsx`)

**Propósito**: Página de entrada principal que presenta la plataforma.

**Características**:
- Hero section con CTAs principales
- Sección de características (Streaming, Crowdfunding, Comunidad)
- CTA para creators
- Metadata SEO optimizada

**Rutas**:
- `/login` - Iniciar sesión
- `/signup` - Registrarse
- `/watch` - Explorar contenido
- `/apply` - Solicitar acceso como creator

**Metadata SEO**:
```typescript
export const metadata: Metadata = {
  title: 'VLOCKSTER - El futuro del cine independiente',
  description: 'Streaming, crowdfunding y comunidad...',
  keywords: ['cine independiente', 'streaming', ...],
  openGraph: { ... },
  twitter: { ... },
}
```

### Watch Page (`app/watch/page.tsx`)

**Propósito**: Catálogo público de videos.

**Funcionalidad**:
- Lista videos públicos desde Supabase
- Muestra thumbnails, títulos, descripciones
- Links a reproductor individual
- Estado vacío cuando no hay videos

**Query Supabase**:
```typescript
.from('videos')
.select('*, profiles:uploader_id (name, public_profile_slug)')
.eq('visibility', 'public')
.order('created_at', { ascending: false })
.limit(20)
```

## Autenticación

### Cliente Browser (`lib/supabase/client.ts`)

**Uso**: Componentes client-side que necesitan Supabase.

```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

### Cliente Server (`lib/supabase/server.ts`)

**Uso**: Server Components y API routes.

```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### Middleware (`lib/supabase/middleware.ts`)

**Uso**: Next.js middleware para manejo de sesiones.

## Testing

### Playwright E2E Tests

**Configuración**: `playwright.config.ts`

**Tests disponibles**:
- `tests/landing.spec.ts` - Tests de landing page

**Comandos**:
```bash
pnpm test              # Ejecutar todos los tests
pnpm test:ui           # UI mode
pnpm test:headed       # Con navegador visible
pnpm test:debug        # Modo debug
```

**Cobertura**:
- ✅ Landing page carga correctamente
- ✅ Metadata SEO presente
- ✅ Links funcionan
- ✅ Responsive design
- ✅ Semantic HTML
- ✅ Sin links rotos

## Base de Datos

### Tablas Principales

**profiles**: Perfiles de usuario con roles
- `id` (UUID, FK a auth.users)
- `name` (text)
- `role` (enum: viewer, creator, moderator, admin)

**videos**: Videos alojados en Cloudflare Stream
- `id` (UUID)
- `title` (text)
- `description` (text)
- `cloudflare_stream_id` (text)
- `visibility` (enum: public, members, backers)
- `uploader_id` (UUID, FK a profiles)

**projects**: Proyectos de crowdfunding
- `id` (UUID)
- `title` (text)
- `description` (text)
- `goal_amount` (numeric)
- `current_amount` (numeric)
- `status` (enum: draft, active, completed, cancelled)
- `creator_id` (UUID, FK a profiles)

**communities**: Comunidades / foros
- `id` (UUID)
- `name` (text)
- `slug` (text, unique)
- `description` (text)
- `is_private` (boolean)

Ver `supabase/` para esquemas completos.

## Integraciones

### Cloudflare Stream

**Uso**: Almacenamiento y streaming de videos.

**Configuración**:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

**Componente**: `@cloudflare/stream-react`

### PayPal

**Uso**: Pagos para crowdfunding.

**Configuración**:
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_MODE` (sandbox/live)

**Componente**: `components/PayPalButton.tsx`

## Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_PROJECT_ID=

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox

# App
NEXT_PUBLIC_APP_URL=http://localhost:3007
```

## Scripts Disponibles

```bash
pnpm dev              # Desarrollo (puerto 3007)
pnpm build            # Build producción
pnpm start            # Producción (puerto 3007)
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm format           # Prettier
pnpm test             # Playwright tests
pnpm supabase:types   # Generar tipos de Supabase
```

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Backend**: Supabase (Auth + Database + Storage)
- **Video**: Cloudflare Stream
- **Pagos**: PayPal
- **Testing**: Playwright
- **Package Manager**: pnpm 9.15.0

## Convenciones de Código

### Naming

- **Componentes**: PascalCase (`HomePage.tsx`)
- **Utilidades**: camelCase (`cn.ts`, `role-check.ts`)
- **Rutas**: kebab-case en URLs, PascalCase en archivos

### Estructura de Archivos

- **Server Components**: Por defecto (sin 'use client')
- **Client Components**: Marcar con 'use client'
- **API Routes**: `app/api/[route]/route.ts`

### TypeScript

- Usar tipos de Supabase generados: `types/database.types.ts`
- Evitar `any`, usar tipos específicos
- Tipar props de componentes

## Debugging

Ver `.knowledge/DEBUGGING-LANDING.md` para proceso de debugging sistemático aplicado.

**Técnicas usadas**:
- Systematic Debugging (Superpowers)
- Root Cause Investigation
- Pattern Analysis
- Verification Before Completion

## Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Playwright Docs](https://playwright.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Última actualización**: 2025-01-27  
**Método**: Context7-style documentation  
**Mantenimiento**: Actualizar cuando cambie estructura del código

