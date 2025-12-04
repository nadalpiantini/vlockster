# 🎬 VLOCKSTER

**Netflix + Kickstarter + Skool para cine independiente**

Plataforma completa que une streaming de contenido, crowdfunding de proyectos creativos y comunidad educativa en un solo lugar.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Backend**: Supabase (Auth + Database + Storage)
- **Video**: Cloudflare Stream
- **Pagos**: PayPal (Checkout + Subscriptions)
- **Deploy**: Vercel + Cloudflare

## ✨ Funcionalidades Principales

### 🎥 Streaming (tipo Netflix)
- Catálogo de videos on-demand
- Player con Cloudflare Stream
- Control de visibilidad (público/miembros/backers)
- Analytics de visualización
- Búsqueda y filtros

### 💰 Crowdfunding (tipo Kickstarter)
- Crear proyectos con metas y deadline
- Sistema de recompensas (tiers)
- Backings con PayPal
- Progreso en tiempo real
- Dashboard de creators

### 👥 Comunidad (tipo Skool)
- Foros de discusión
- Posts y comentarios
- Likes y engagement
- Notificaciones en tiempo real
- Comunidades públicas y privadas

### 🔐 Sistema de Roles
- **Viewer**: Usuario básico
- **Creator**: Puede crear proyectos y subir videos
- **Moderator**: Modera contenido en comunidades
- **Admin**: Control total de la plataforma

## 📦 Instalación

### Requisitos
- Node.js 20+
- pnpm 9+
- Cuenta de Supabase
- Cuenta de Cloudflare (para video)
- Cuenta de PayPal Developer

### Setup

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/vlockster.git
cd vlockster
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales
```

4. **Ejecutar migraciones de Supabase**
```bash
# Conectar a tu proyecto Supabase
supabase link --project-ref your-project-id

# Ejecutar migraciones en orden
supabase db push --file supabase/vlockster_00_schema.sql
supabase db push --file supabase/vlockster_01_auth_profiles.sql
supabase db push --file supabase/vlockster_02_creator_requests.sql
supabase db push --file supabase/vlockster_03_videos.sql
supabase db push --file supabase/vlockster_04_projects.sql
supabase db push --file supabase/vlockster_05_communities.sql
supabase db push --file supabase/vlockster_06_moderation.sql
supabase db push --file supabase/vlockster_07_rls_policies.sql
supabase db push --file supabase/vlockster_08_triggers.sql
```

5. **Generar tipos de TypeScript**
```bash
pnpm supabase:types
```

6. **Iniciar servidor de desarrollo**
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
vlockster/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Estilos globales
│   ├── login/               # Página de login
│   ├── signup/              # Página de registro
│   ├── dashboard/           # Dashboard adaptativo por rol
│   ├── apply/               # Solicitud de creator
│   ├── watch/               # Catálogo y reproductor de videos
│   ├── projects/            # Proyectos de crowdfunding
│   ├── community/           # Foros y discusiones
│   └── admin/               # Panel administrativo
│       └── requests/        # Aprobar solicitudes de creators
├── components/
│   └── ui/                  # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── textarea.tsx
├── lib/
│   ├── supabase/            # Clientes de Supabase
│   │   ├── client.ts        # Cliente browser
│   │   ├── server.ts        # Cliente server
│   │   └── middleware.ts    # Middleware de sesión
│   └── utils/               # Utilidades y helpers
│       ├── cn.ts            # Tailwind class merger
│       └── role-check.ts    # Helpers de roles
├── supabase/                # Migraciones SQL
│   ├── vlockster_00_schema.sql
│   ├── vlockster_01_auth_profiles.sql
│   ├── vlockster_02_creator_requests.sql
│   ├── vlockster_03_videos.sql
│   ├── vlockster_04_projects.sql
│   ├── vlockster_05_communities.sql
│   ├── vlockster_06_moderation.sql
│   ├── vlockster_07_rls_policies.sql
│   └── vlockster_08_triggers.sql
├── types/                   # TypeScript types
│   └── database.types.ts    # Tipos generados de Supabase
├── middleware.ts            # Next.js middleware
└── public/                  # Assets estáticos
```

## 🎯 Quick Start

Después de completar el setup, la aplicación estará disponible en `http://localhost:3000` con las siguientes rutas:

### Rutas Públicas
- `/` - Landing page
- `/login` - Inicio de sesión
- `/signup` - Registro de cuenta
- `/watch` - Catálogo público de videos
- `/projects` - Proyectos de crowdfunding
- `/community` - Foros de discusión

### Rutas Protegidas (requieren autenticación)
- `/dashboard` - Dashboard adaptativo según rol del usuario
- `/apply` - Solicitar acceso como creator (solo viewers)
- `/watch/[id]` - Reproductor de video individual

### Rutas de Creator (requieren rol creator o admin)
- `/upload` - Subir videos (pendiente implementar)
- `/projects/create` - Crear proyecto de crowdfunding (pendiente implementar)
- `/my-projects` - Gestionar proyectos propios (pendiente implementar)

### Rutas de Admin (requieren rol admin)
- `/admin/requests` - Aprobar/rechazar solicitudes de creators
- `/admin/users` - Gestión de usuarios (pendiente implementar)
- `/admin/reports` - Moderar reportes (pendiente implementar)

## 🔑 Variables de Entorno

Ver `.env.example` para la lista completa. Las principales son:

- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública de Supabase
- `CLOUDFLARE_ACCOUNT_ID`: ID de cuenta de Cloudflare
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: Client ID de PayPal
- `PAYPAL_MODE`: `sandbox` o `live`

## 🗄️ Base de Datos

### Tablas Principales
- `profiles`: Perfiles de usuario con roles
- `videos`: Videos alojados en Cloudflare Stream
- `projects`: Proyectos de crowdfunding
- `rewards`: Recompensas de proyectos
- `backings`: Respaldos de usuarios
- `communities`: Comunidades / foros
- `posts`: Publicaciones
- `comments`: Comentarios
- `video_metrics`: Analytics de video
- `reports`: Sistema de moderación
- `waitlist`: Lista de espera

### Roles y Permisos (RLS)
Todas las tablas tienen Row Level Security habilitado con políticas específicas por rol.

## 🚦 Scripts Disponibles

```bash
pnpm dev              # Servidor de desarrollo
pnpm build            # Build de producción
pnpm start            # Servidor de producción
pnpm lint             # Linter ESLint
pnpm typecheck        # Verificación de tipos
pnpm format           # Formatear código con Prettier
pnpm supabase:types   # Generar tipos de Supabase
```

## 🎨 Diseño y UI

El proyecto usa **shadcn/ui** para componentes de interfaz, construidos sobre:
- Radix UI (accesibilidad)
- Tailwind CSS (estilos)
- Lucide Icons (iconos)

### Tema
Soporta modo claro y oscuro out-of-the-box. Las variables CSS están en `app/globals.css`.

## 📚 Documentación Adicional

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Cloudflare Stream Docs](https://developers.cloudflare.com/stream/)
- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [shadcn/ui Docs](https://ui.shadcn.com)

## 🤝 Contribuir

Este es un proyecto privado. Para contribuir, contacta al propietario del repositorio.

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Alan Nadal**
- Web: [alannadal.com](https://alannadal.com)
- Twitter: [@alannadal](https://twitter.com/alannadal)

---

**VLOCKSTER** - *Democratizando el cine independiente, una película a la vez* 🎬✨
