# 🚀 Scripts de Deployment

Scripts automatizados para deploy a producción de VLOCKSTER.

## 📋 Scripts Disponibles

### 1. `deploy-production.ts` (Recomendado)

Script TypeScript completo que automatiza TODO el proceso:

- ✅ Verifica/instala Vercel CLI
- ✅ Verifica autenticación en Vercel
- ✅ Agrega dominio en Vercel
- ✅ **Configura DNS en Cloudflare automáticamente** (vía API)
- ✅ **Configura SSL/TLS en Cloudflare automáticamente**
- ✅ Configura variables de entorno en Vercel
- ✅ Hace deploy a producción

**Uso:**
```bash
pnpm deploy:prod
# o
tsx scripts/deploy-production.ts
```

**Requisitos:**
- Node.js 20+
- Vercel CLI (se instala automáticamente si no está)
- Cloudflare API Token (opcional, para configuración automática de DNS)

### 2. `deploy-production.sh` (Alternativa)

Script Bash más simple que usa solo Vercel CLI:

- ✅ Verifica/instala Vercel CLI
- ✅ Agrega dominio en Vercel
- ✅ Configura variables de entorno
- ✅ Hace deploy
- ⚠️ **NO configura Cloudflare automáticamente** (requiere configuración manual)

**Uso:**
```bash
pnpm deploy:prod:bash
# o
bash scripts/deploy-production.sh
```

---

## 🔧 Configuración Previa

### 1. Vercel CLI

El script verifica e instala automáticamente, pero puedes hacerlo manualmente:

```bash
npm install -g vercel
vercel login
```

### 2. Cloudflare API Token (Opcional, para script TypeScript)

Para configuración automática de DNS:

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Usa el template "Edit zone DNS"
4. Selecciona tu dominio
5. Copia el token generado

**Permisos necesarios:**
- Zone: DNS:Edit
- Zone: Zone Settings:Edit

---

## 📝 Variables de Entorno Requeridas

El script te pedirá estas variables durante la ejecución:

**Supabase (REQUERIDO):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_PROJECT_ID`

**Cloudflare Stream (REQUERIDO si usas videos):**
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID`

**PayPal (OPCIONAL):**
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_MODE` (sandbox/live)

**App:**
- `NEXT_PUBLIC_APP_URL` (se configura automáticamente con tu dominio)

---

## 🚀 Proceso Completo

### Opción A: Automático (TypeScript)

```bash
# 1. Ejecutar script
pnpm deploy:prod

# 2. Seguir las instrucciones interactivas:
#    - Ingresar dominio
#    - Proporcionar Cloudflare API Token (opcional)
#    - Configurar variables de entorno
#    - Confirmar deploy

# 3. El script hace TODO automáticamente:
#    ✅ Agrega dominio en Vercel
#    ✅ Configura DNS en Cloudflare
#    ✅ Configura SSL/TLS
#    ✅ Configura variables de entorno
#    ✅ Hace deploy
```

### Opción B: Semi-automático (Bash)

```bash
# 1. Ejecutar script
pnpm deploy:prod:bash

# 2. Seguir las instrucciones interactivas

# 3. Configurar Cloudflare manualmente:
#    - Ve a Cloudflare Dashboard
#    - DNS → Records
#    - Agregar CNAME @ → cname.vercel-dns.com (Proxied)
#    - Agregar CNAME www → cname.vercel-dns.com (Proxied)
#    - SSL/TLS → Full (strict)
#    - Always Use HTTPS → ON
```

---

## ✅ Verificación Post-Deploy

Después del deploy, verifica:

1. **DNS Propagation:**
   ```bash
   # Espera 5-10 minutos, luego:
   nslookup tu-dominio.com
   dig tu-dominio.com
   ```

2. **SSL/HTTPS:**
   - Abre https://tu-dominio.com
   - Verifica que el candado esté verde
   - Verifica certificado válido

3. **Funcionalidad:**
   - Landing page carga
   - Login/Signup funcionan
   - Dashboard se muestra
   - APIs responden correctamente

---

## 🐛 Troubleshooting

### Error: Vercel CLI no encontrado

```bash
npm install -g vercel
```

### Error: No autenticado en Vercel

```bash
vercel login
```

### Error: Cloudflare API Token inválido

- Verifica que el token tenga permisos correctos
- Verifica que el dominio esté en Cloudflare
- Usa el script bash si prefieres configuración manual

### Error: Dominio ya existe en Vercel

- Esto es normal si ya configuraste el dominio antes
- El script continúa normalmente

### DNS no propaga

- Espera hasta 24 horas (normalmente 5-10 minutos)
- Verifica en https://dnschecker.org/
- Verifica que los registros en Cloudflare estén correctos

---

## 📚 Referencias

- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Cloudflare API Docs](https://developers.cloudflare.com/api/)
- [Vercel + Cloudflare Setup Guide](../CLOUDFLARE_SETUP.md)
- [Production Deployment Guide](../PRODUCTION.md)

---

**VLOCKSTER** - *Deploy automatizado a producción* 🎬✨

