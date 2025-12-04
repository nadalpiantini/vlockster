# 🌐 Configuración Cloudflare para VLOCKSTER

**Basado en la configuración exitosa de padelgraph.com**

---

## 📋 Configuración DNS en Cloudflare

### Paso 1: Agregar Dominio en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **VLOCKSTER**
3. Ve a **Settings** → **Domains**
4. Click **Add Domain**
5. Ingresa tu dominio (ej: `vlockster.com`)
6. Vercel te mostrará los registros DNS necesarios

**Vercel te dará algo como:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

### Paso 2: Configurar DNS en Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona tu dominio
3. Ve a **DNS** → **Records**

#### Configuración Recomendada (igual que padelgraph):

**1. CNAME para dominio raíz (@):**
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy status: 🟠 Proxied (ON - naranja)
TTL: Auto
```

**2. CNAME para www:**
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: 🟠 Proxied (ON - naranja)
TTL: Auto
```

**⚠️ IMPORTANTE:**
- **Proxy status DEBE estar Proxied** (naranja) para SSL de Cloudflare
- Elimina cualquier registro A existente con `@` o `www`
- El TTL debe estar en **Auto** (Cloudflare lo gestiona)

---

### Paso 3: Configurar SSL/TLS en Cloudflare

1. En Cloudflare, ve a **SSL/TLS** → **Overview**
2. Selecciona **Full (strict)**
   - ⚠️ NO usar "Flexible" (inseguro)
   - ✅ "Full (strict)" verifica certificado de Vercel

3. Habilitar opciones adicionales:
   - ✅ **Always Use HTTPS**: ON
   - ✅ **Automatic HTTPS Rewrites**: ON
   - ✅ **HTTP Strict Transport Security (HSTS)**: ON

---

## 🔧 Configuración Avanzada (Opcional)

### Cloudflare Page Rules

Para mejor performance, crea estas reglas en Cloudflare:

**Regla 1: Cache assets estáticos**
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

**Regla 3: Bypass cache para APIs**
```
URL: tu-dominio.com/api/*
Settings:
- Cache Level: Bypass
```

### Cloudflare Speed Optimizations

En **Speed** → **Optimization**:
- ✅ **Auto Minify**: CSS, JavaScript, HTML
- ✅ **Brotli**: ON
- ✅ **Early Hints**: ON
- ✅ **HTTP/2**: ON
- ✅ **HTTP/3 (with QUIC)**: ON

---

## ✅ Verificación

### 1. Verificar DNS Propagation

URL: https://dnschecker.org/

Verificar que:
- `tu-dominio.com` → CNAME apunta a vercel
- `www.tu-dominio.com` → CNAME apunta a vercel

**Tiempo de propagación:** 5-10 minutos (hasta 48h en casos extremos)

### 2. Verificar SSL en Vercel

**En Vercel Dashboard:**
1. Ve a: **Settings** → **Domains**
2. Cada dominio debe mostrar: ✅ **Valid Configuration**
3. SSL debe estar: ✅ **Enabled**

### 3. Test Endpoints

```bash
# Dominio principal
curl -I https://tu-dominio.com
# Debe retornar: 200 OK

# www redirect
curl -I https://www.tu-dominio.com
# Debe funcionar correctamente
```

---

## 🐛 Troubleshooting

### Problema: DNS no propaga

**Solución:**
1. Verificar CNAME en Cloudflare está correcto
2. Esperar 10-15 minutos
3. Flush DNS local: `sudo dscacheutil -flushcache` (macOS)
4. Verificar en: https://dnschecker.org/

### Problema: SSL Invalid

**Solución:**
1. En Cloudflare: SSL/TLS → Full (strict)
2. En Vercel: Regenerar SSL certificate
3. Esperar 5 minutos para propagación

### Problema: Dominio no se conecta

**Solución:**
1. Verificar que los registros DNS en Cloudflare sean correctos
2. Verificar que el dominio esté asignado en Vercel
3. Esperar hasta 24 horas para propagación completa
4. Revisar logs en Vercel → Deployments → Functions

---

## 📊 Configuración de Referencia (padelgraph)

**Dominios configurados:**
- `padelgraph.com` (principal)
- `padelgraph.app` (secundario)

**DNS Records:**
- CNAME @ → `cname.vercel-dns.com` (Proxied)
- CNAME www → `cname.vercel-dns.com` (Proxied)

**SSL/TLS:**
- Modo: Full (strict)
- Always Use HTTPS: ON
- HSTS: ON

**Resultado:**
- ✅ SSL válido en todos los dominios
- ✅ Performance optimizada
- ✅ Auto-deploy desde GitHub funcionando

---

## 🎯 Checklist Final

- [ ] Dominio agregado en Vercel
- [ ] CNAME configurado en Cloudflare (Proxied)
- [ ] SSL/TLS en modo Full (strict)
- [ ] Always Use HTTPS activado
- [ ] DNS propagado (verificado en dnschecker.org)
- [ ] SSL válido en Vercel
- [ ] Sitio carga correctamente
- [ ] HTTPS funciona sin warnings

---

**VLOCKSTER** - *Listo para producción con Cloudflare* 🎬✨

