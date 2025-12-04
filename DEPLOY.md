# 🚀 Guía de Deploy - VLOCKSTER

Guía completa para desplegar VLOCKSTER en producción.

## 📋 Prerrequisitos

- ✅ Proyecto configurado en Vercel
- ✅ Repositorio conectado a GitHub
- ✅ Variables de entorno configuradas

## 🔧 Configuración en Vercel

### 1. Variables de Entorno

Agrega todas las variables de `.env.local` en el dashboard de Vercel:

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_PROJECT_ID`

**Cloudflare (Opcional):**
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID`

**PayPal (Opcional):**
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_MODE` (cambiar a `live` en producción)

**App:**
- `NEXT_PUBLIC_APP_URL` (URL de producción, ej: `https://vlockster.com`)

### 2. Build Settings

Vercel detectará automáticamente:
- **Framework Preset**: Next.js
- **Build Command**: `pnpm build` (automático)
- **Output Directory**: `.next` (automático)
- **Install Command**: `pnpm install` (automático)

### 3. Deploy

1. Push a `main` branch → Deploy automático
2. O manualmente desde Vercel dashboard → Deploy

## ✅ Verificación Post-Deploy

### Checklist

- [ ] Landing page carga correctamente
- [ ] Login/Signup funcionan
- [ ] Dashboard se muestra según rol
- [ ] Upload de videos funciona (si Cloudflare configurado)
- [ ] Creación de proyectos funciona
- [ ] PayPal checkout funciona (si configurado)
- [ ] Comunidades y posts funcionan
- [ ] Admin panel accesible solo para admins

### URLs Importantes

- **Producción**: `https://tu-dominio.vercel.app`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/[project-id]`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

## 🔄 Actualizaciones

Cada push a `main` genera un nuevo deploy automático.

Para rollback:
1. Vercel Dashboard → Deployments
2. Seleccionar deploy anterior
3. "Promote to Production"

## 📊 Monitoreo

- **Vercel Analytics**: Habilitado automáticamente
- **Supabase Logs**: Dashboard → Logs
- **Error Tracking**: Configurar Sentry (opcional)

## 🐛 Troubleshooting

### Build Fails

1. Verificar variables de entorno
2. Revisar logs en Vercel
3. Probar build local: `pnpm build`

### Runtime Errors

1. Revisar Supabase RLS policies
2. Verificar permisos de API keys
3. Revisar logs de Vercel Functions

---

**VLOCKSTER** - *Listo para producción* 🎬✨

