# 🚀 Guía de Producción: Vercel + Cloudflare

Guía completa para conectar Vercel con Cloudflare y salir a producción.

## 📋 Prerrequisitos

- ✅ Proyecto desplegado en Vercel
- ✅ Cuenta de Cloudflare con dominio configurado
- ✅ Variables de entorno configuradas en Vercel
- ✅ Build exitoso en Vercel

---

## 🔧 PASO 1: Configurar Dominio en Vercel

### 1.1 Agregar Dominio en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **VLOCKSTER**
3. Ve a **Settings** → **Domains**
4. Haz clic en **Add Domain**
5. Ingresa tu dominio (ej: `vlockster.com` o `www.vlockster.com`)
6. Vercel te mostrará los registros DNS necesarios

### 1.2 Anotar Registros DNS de Vercel

Vercel te dará algo como:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**⚠️ IMPORTANTE:** Anota estos valores, los necesitarás en Cloudflare.

---

## 🌐 PASO 2: Configurar DNS en Cloudflare

### 2.1 Conectar Dominio a Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Selecciona tu dominio
3. Ve a **DNS** → **Records**

### 2.2 Configurar Registros DNS

**Opción A: Solo dominio raíz (vlockster.com)**

Agrega estos registros:

```
Type: A
Name: @
Content: 76.76.21.21 (IP de Vercel - verificar en Vercel)
Proxy: 🟠 Proxied (ON - naranja)
TTL: Auto
```

**Opción B: Dominio raíz + www**

1. **Dominio raíz:**
```
Type: A
Name: @
Content: 76.76.21.21
Proxy: 🟠 Proxied
TTL: Auto
```

2. **Subdominio www:**
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: 🟠 Proxied
TTL: Auto
```

### 2.3 Verificar Configuración

1. Espera 1-5 minutos para propagación DNS
2. Verifica en Cloudflare que los registros estén activos (icono naranja = proxied)
3. Vercel debería detectar automáticamente el dominio

---

## ⚙️ PASO 3: Configurar SSL/TLS en Cloudflare

### 3.1 Modo SSL/TLS

1. En Cloudflare, ve a **SSL/TLS** → **Overview**
2. Selecciona **Full (strict)** para máxima seguridad
   - Esto permite que Cloudflare y Vercel usen certificados SSL válidos

### 3.2 Configuración Recomendada

- **SSL/TLS encryption mode**: Full (strict)
- **Always Use HTTPS**: ON
- **Automatic HTTPS Rewrites**: ON
- **Minimum TLS Version**: 1.2

---

## 🔐 PASO 4: Variables de Entorno en Vercel

### 4.1 Agregar Variables en Vercel

1. Ve a **Settings** → **Environment Variables**
2. Agrega TODAS estas variables para **Production**:

**Supabase (REQUERIDO):**
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=tu-project-id
```

**Cloudflare Stream (REQUERIDO si usas videos):**
```
CLOUDFLARE_ACCOUNT_ID=tu-account-id
CLOUDFLARE_API_TOKEN=tu-api-token
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=tu-account-id
```

**PayPal (OPCIONAL - cambiar a live en producción):**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu-client-id-live
PAYPAL_CLIENT_SECRET=tu-secret-live
PAYPAL_MODE=live
```

**App (REQUERIDO):**
```
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### 4.2 Verificar Variables

- ✅ Todas marcadas para **Production**
- ✅ `NEXT_PUBLIC_APP_URL` apunta a tu dominio real
- ✅ `PAYPAL_MODE=live` si estás en producción

---

## 🚀 PASO 5: Deploy a Producción

### 5.1 Verificar Build

1. Ve a **Deployments** en Vercel
2. Verifica que el último deploy esté **Ready** (verde)
3. Si hay errores, revísalos y corrige

### 5.2 Asignar Dominio a Deploy

1. En el deploy más reciente, haz clic en **...** (tres puntos)
2. Selecciona **Assign Domain**
3. Elige tu dominio configurado
4. Espera 1-2 minutos para que se active

---

## ✅ PASO 6: Verificación Post-Deploy

### 6.1 Checklist de Funcionalidad

Abre tu dominio en el navegador y verifica:

- [ ] **Landing page** carga correctamente
- [ ] **HTTPS** está activo (candado verde)
- [ ] **Login/Signup** funcionan
- [ ] **Dashboard** se muestra según rol
- [ ] **Upload de videos** funciona (si Cloudflare configurado)
- [ ] **Creación de proyectos** funciona
- [ ] **PayPal checkout** funciona (si configurado)
- [ ] **Comunidades y posts** funcionan
- [ ] **Admin panel** accesible solo para admins

### 6.2 Verificar Performance

1. **PageSpeed Insights**: https://pagespeed.web.dev
2. **Cloudflare Analytics**: Dashboard → Analytics
3. **Vercel Analytics**: Dashboard → Analytics

### 6.3 Verificar SSL

1. Abre tu sitio en el navegador
2. Verifica que el candado esté verde
3. Haz clic en el candado → **Certificate**
4. Debe mostrar certificado válido de Cloudflare/Vercel

---

## 🔄 PASO 7: Configuración Avanzada (Opcional)

### 7.1 Cloudflare Page Rules

Para optimización, crea estas reglas en Cloudflare:

**Regla 1: Cache estático**
```
URL: tu-dominio.com/_next/static/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
```

**Regla 2: Cache imágenes**
```
URL: tu-dominio.com/**/*.{jpg,jpeg,png,gif,webp,svg}
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
```

### 7.2 Cloudflare Speed Optimizations

En **Speed** → **Optimization**:
- ✅ Auto Minify: CSS, JavaScript, HTML
- ✅ Brotli: ON
- ✅ Early Hints: ON
- ✅ HTTP/2: ON
- ✅ HTTP/3 (with QUIC): ON

### 7.3 Vercel Analytics

1. En Vercel, ve a **Analytics**
2. Habilita **Web Analytics** (gratis)
3. Agrega el script en `app/layout.tsx` si no está

---

## 🐛 Troubleshooting

### Problema: Dominio no se conecta

**Solución:**
1. Verifica que los registros DNS en Cloudflare sean correctos
2. Espera hasta 24 horas para propagación completa
3. Verifica que el dominio esté asignado en Vercel
4. Revisa logs en Vercel → Deployments → Functions

### Problema: SSL no funciona

**Solución:**
1. En Cloudflare, verifica que SSL/TLS esté en **Full (strict)**
2. Espera 5-10 minutos para que se genere el certificado
3. Verifica que el dominio esté activo en Vercel

### Problema: Build falla en Vercel

**Solución:**
1. Revisa logs en Vercel → Deployments
2. Verifica que todas las variables de entorno estén configuradas
3. Prueba build local: `pnpm build`
4. Verifica que `package.json` tenga `engines.node: "20.x"`

### Problema: Variables de entorno no funcionan

**Solución:**
1. Verifica que estén marcadas para **Production**
2. Haz un nuevo deploy después de agregar variables
3. Verifica que no tengan espacios extra
4. Usa valores exactos (sin comillas en Vercel)

---

## 📊 Monitoreo Post-Producción

### Herramientas Recomendadas

1. **Vercel Analytics**: Métricas de tráfico y performance
2. **Cloudflare Analytics**: Análisis de tráfico y seguridad
3. **Supabase Dashboard**: Monitoreo de base de datos
4. **Sentry** (opcional): Error tracking

### Alertas Configuradas

- ✅ Vercel: Notificaciones de deploy fallidos
- ✅ Cloudflare: Alertas de seguridad
- ✅ Supabase: Alertas de uso de recursos

---

## 🎯 URLs Importantes

- **Producción**: `https://tu-dominio.com`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Cloudflare Dashboard**: `https://dash.cloudflare.com`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/[id]`

---

## ✅ Checklist Final

Antes de considerar producción "lista":

- [ ] Dominio configurado y funcionando
- [ ] HTTPS activo y funcionando
- [ ] Todas las variables de entorno configuradas
- [ ] Build exitoso en Vercel
- [ ] Login/Signup funcionan
- [ ] Dashboard funciona según roles
- [ ] Upload de videos funciona (si aplica)
- [ ] PayPal en modo `live` (si aplica)
- [ ] Analytics configurados
- [ ] Monitoreo activo

---

**🎉 ¡FELICIDADES! Tu app está en producción.**

---

**VLOCKSTER** - *Netflix + Kickstarter + Skool para cine independiente* 🎬✨

