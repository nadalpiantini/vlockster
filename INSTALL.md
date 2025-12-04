# 🚀 Guía de Instalación VLOCKSTER

Guía paso a paso para poner en marcha VLOCKSTER en tu ambiente local.

## 📋 Prerrequisitos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** v20.0.0 o superior
- **pnpm** v9.0.0 o superior
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Cloudflare](https://cloudflare.com) (para video streaming)
- Cuenta en [PayPal Developer](https://developer.paypal.com) (para pagos)

## 🔧 Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/nadalpiantini/vlockster.git
cd vlockster
```

## 📦 Paso 2: Instalar Dependencias

```bash
pnpm install
```

## 🗄️ Paso 3: Configurar Supabase

### 3.1 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Crea un nuevo proyecto
3. Guarda la URL y las API keys que aparecen

### 3.2 Ejecutar Migraciones SQL

En el dashboard de Supabase, ve a SQL Editor y ejecuta los archivos en este orden:

```bash
1. supabase/vlockster_00_schema.sql
2. supabase/vlockster_01_auth_profiles.sql
3. supabase/vlockster_02_creator_requests.sql
4. supabase/vlockster_03_videos.sql
5. supabase/vlockster_04_projects.sql
6. supabase/vlockster_05_communities.sql
7. supabase/vlockster_06_moderation.sql
8. supabase/vlockster_07_rls_policies.sql
9. supabase/vlockster_08_triggers.sql
```

**Nota**: Copia y pega el contenido de cada archivo en el SQL Editor y ejecuta.

### 3.3 Verificar Tablas

Deberías ver estas tablas en tu proyecto:
- profiles
- creator_requests
- videos
- video_metrics
- projects
- rewards
- backings
- communities
- posts
- comments
- notifications
- reports
- waitlist

## ☁️ Paso 4: Configurar Cloudflare Stream

### 4.1 Crear Cuenta y Obtener Credenciales

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Crea una cuenta o inicia sesión
3. Ve a **Stream** en el menú lateral
4. Anota tu **Account ID**
5. Ve a **My Profile** → **API Tokens**
6. Crea un token con permisos de Stream
7. Guarda el **API Token**

## 💳 Paso 5: Configurar PayPal

### 5.1 Crear App en PayPal Developer

1. Ve a [developer.paypal.com](https://developer.paypal.com)
2. Inicia sesión con tu cuenta PayPal
3. Ve a **My Apps & Credentials**
4. Crea una nueva app en modo **Sandbox** (para testing)
5. Anota el **Client ID** y **Secret**

### 5.2 Modo Producción (Opcional)

Cuando estés listo para producción:
1. Crea una app en modo **Live**
2. Actualiza las credenciales en `.env.local`
3. Cambia `PAYPAL_MODE=live`

## 🔐 Paso 6: Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
NEXT_PUBLIC_SUPABASE_PROJECT_ID=tu-project-id

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=tu-account-id-aqui
CLOUDFLARE_API_TOKEN=tu-api-token-aqui

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu-client-id-aqui
PAYPAL_CLIENT_SECRET=tu-secret-aqui
PAYPAL_MODE=sandbox

# App
NEXT_PUBLIC_APP_URL=http://localhost:3007
```

### Dónde Encontrar Cada Variable:

**Supabase**:
- URL y Keys: Settings → API
- Project ID: URL del dashboard (parte después de `supabase.co/project/`)

**Cloudflare**:
- Account ID: Dashboard principal, en la barra lateral
- API Token: My Profile → API Tokens

**PayPal**:
- Client ID y Secret: Dashboard → My Apps & Credentials

## 🚀 Paso 7: Ejecutar en Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en: **http://localhost:3007**

## ✅ Paso 8: Verificar Instalación

### 8.1 Crear Cuenta

1. Ve a http://localhost:3007/signup
2. Registra una nueva cuenta
3. Verifica que se creó el perfil en Supabase (tabla `profiles`)

### 8.2 Solicitar Rol de Creator

1. Inicia sesión
2. Ve a http://localhost:3007/apply
3. Completa el formulario de solicitud
4. Verifica que aparece en la tabla `creator_requests`

### 8.3 Aprobar como Admin (Manual)

Para testing, actualiza tu rol manualmente en Supabase:

1. SQL Editor en Supabase:
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'tu@email.com';
```

2. Refresca la página y ve a http://localhost:3007/admin/requests
3. Aprueba solicitudes de creators

### 8.4 Probar Funcionalidades

- **Upload Video**: http://localhost:3007/upload (requiere rol creator)
- **Crear Proyecto**: http://localhost:3007/projects/create (requiere rol creator)
- **Ver Analytics**: http://localhost:3007/my-analytics (requiere rol creator)
- **Comunidad**: http://localhost:3007/community

## 🔨 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Servidor en puerto 3007

# Producción
pnpm build            # Build de producción
pnpm start            # Servidor de producción en puerto 3007

# Calidad
pnpm lint             # Linter ESLint
pnpm typecheck        # Verificar tipos TypeScript
pnpm format           # Formatear código

# Base de Datos
pnpm supabase:types   # Generar tipos desde Supabase
```

## 📊 Generar Tipos de TypeScript

Después de ejecutar las migraciones:

```bash
pnpm supabase:types
```

Esto generará `types/database.types.ts` con los tipos de tu base de datos.

## 🐛 Solución de Problemas

### Error: "Supabase URL not found"
- Verifica que `.env.local` existe
- Verifica que las variables empiezan con `NEXT_PUBLIC_` para las del cliente
- Reinicia el servidor de desarrollo

### Error: "Cloudflare upload failed"
- Verifica tu Account ID y API Token
- Asegúrate de que el token tiene permisos de Stream
- Verifica que Stream está habilitado en tu cuenta Cloudflare

### Error: "PayPal authentication failed"
- Verifica Client ID y Secret
- Asegúrate de estar en modo correcto (sandbox/live)
- Verifica que la app de PayPal está activa

### Permisos RLS en Supabase
Si ves errores de "permission denied":
- Verifica que ejecutaste `vlockster_07_rls_policies.sql`
- Verifica que las políticas se crearon correctamente en Supabase

## 📚 Siguientes Pasos

1. **Personalizar**: Edita colores y branding en `tailwind.config.ts`
2. **Contenido**: Crea comunidades y sube contenido de prueba
3. **Testing**: Prueba el flujo completo de usuario
4. **Deploy**: Cuando estés listo, despliega en Vercel

## 🆘 Soporte

Si encuentras problemas:
- Revisa los logs del servidor (`pnpm dev`)
- Verifica la consola del navegador (F12)
- Revisa los logs de Supabase (Dashboard → Logs)

## 🎉 ¡Listo!

Tu instalación de VLOCKSTER está completa. Ahora puedes:
- Crear contenido como creator
- Lanzar proyectos de crowdfunding
- Gestionar comunidades
- Ver analytics de tu contenido

---

**VLOCKSTER** - *Democratizando el cine independiente* 🎬✨
