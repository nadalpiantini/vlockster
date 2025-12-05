# Performance Monitoring - VLOCKSTER

**Fecha**: 2025-12-05  
**Estado**: ✅ Implementado

---

## 📊 Métricas de Performance

### Web Vitals (Vercel Analytics)

**Implementado**: ✅  
**Tracking**: Automático via `@vercel/analytics`

**Métricas Monitoreadas**:
- **LCP (Largest Contentful Paint)**: Tiempo de carga del contenido principal
- **FID (First Input Delay)**: Tiempo hasta la primera interacción
- **CLS (Cumulative Layout Shift)**: Estabilidad visual
- **TTFB (Time to First Byte)**: Tiempo de respuesta del servidor

**Dashboard**: Disponible en Vercel Analytics Dashboard

---

## 🔍 Query Optimization

### Paginación Implementada

**Páginas con Paginación**:
- ✅ `/watch` - 16 videos por página
- ✅ `/projects` - 12 proyectos por página
- ✅ `/community` - 12 comunidades por página
- ✅ `/admin/users` - 20 usuarios por página
- ✅ `/admin/reports` - 20 reportes por página
- ✅ `/admin/requests` - 10 solicitudes por página (pendientes y revisadas)

### Optimización de Queries N+1

**Problema Resuelto**: Queries separadas para perfiles de usuarios/creadores

**Solución Implementada**:
1. **Queries con relaciones**: Uso de `select()` con relaciones para evitar queries múltiples
   - `videos` con `profiles!videos_uploader_id_fkey`
   - `projects` con `profiles!projects_creator_id_fkey`
   - `video_metrics` con `videos!inner`
   - `backings` con `projects!inner`

2. **Batch fetching**: Agrupación de IDs únicos antes de fetch de perfiles
   - `/watch` - Batch fetch de uploader profiles
   - `/projects` - Batch fetch de creator profiles

**Resultado**: Reducción de queries de O(n) a O(1) para relaciones

---

## 📦 Bundle Optimization

### Bundle Analyzer

**Configurado**: ✅  
**Comando**: `pnpm analyze-bundle` o `ANALYZE=true pnpm build`

**Configuración**: `next.config.ts`
```typescript
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})
```

**Uso**:
1. Ejecutar `ANALYZE=true pnpm build`
2. Revisar reporte en `.next/analyze/`
3. Identificar dependencias grandes
4. Implementar code splitting donde sea necesario

### Code Splitting

**Implementado**:
- ✅ Dynamic imports para componentes pesados
- ✅ Lazy loading de imágenes (`loading="lazy"`)
- ✅ Server Components por defecto (Next.js 15)

**Recomendaciones**:
- Lazy load PayPal SDK solo cuando sea necesario
- Dynamic import de componentes de admin
- Code splitting por ruta (automático en Next.js)

---

## 🗄️ Database Indexes

### Índices Recomendados (del Audit Report)

**Índices a Agregar**:
```sql
-- Videos
CREATE INDEX IF NOT EXISTS idx_videos_uploader ON videos(uploader_id);
CREATE INDEX IF NOT EXISTS idx_videos_visibility_created ON videos(visibility, created_at DESC);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status_created ON projects(status, created_at DESC);

-- Backings
CREATE INDEX IF NOT EXISTS idx_backings_project ON backings(project_id);
CREATE INDEX IF NOT EXISTS idx_backings_user ON backings(user_id);

-- Posts
CREATE INDEX IF NOT EXISTS idx_posts_community_created ON posts(community_id, created_at DESC);

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);

-- Video Metrics
CREATE INDEX IF NOT EXISTS idx_video_metrics_viewer ON video_metrics(viewer_id);
CREATE INDEX IF NOT EXISTS idx_video_metrics_video ON video_metrics(video_id);
```

**Estado**: ⏳ Pendiente de aplicar en migración

---

## 📈 Performance Baselines

### Targets (WCAG Performance)

- **LCP**: < 2.5s (Good)
- **FID**: < 100ms (Good)
- **CLS**: < 0.1 (Good)
- **TTFB**: < 600ms (Good)

### Current State

**Medición**: Requiere ejecutar en producción con Vercel Analytics

**Próximos Pasos**:
1. Deploy a staging/production
2. Recopilar métricas durante 1 semana
3. Establecer baseline
4. Configurar alertas para regresiones

---

## 🚨 Performance Alerts

### Configuración Recomendada

**Vercel Analytics**:
- Alertas automáticas para regresiones de Web Vitals
- Dashboard en Vercel Dashboard

**Custom Alerts** (Futuro):
- Alertas para queries lentas (> 1s)
- Alertas para bundle size (> 500KB)
- Alertas para tiempo de build (> 5min)

---

## 📝 Performance Budget

### Bundle Size Budget

**Targets**:
- **Initial JS**: < 200KB (gzipped)
- **Total JS**: < 500KB (gzipped)
- **CSS**: < 50KB (gzipped)
- **Images**: Optimizadas con Next.js Image

**Verificación**:
```bash
ANALYZE=true pnpm build
# Revisar .next/analyze/ para ver bundle sizes
```

---

## 🔧 Optimizaciones Aplicadas

1. ✅ **Paginación**: Todas las listas tienen paginación
2. ✅ **Query Optimization**: Relaciones optimizadas para evitar N+1
3. ✅ **Image Optimization**: Next.js Image con lazy loading
4. ✅ **Code Splitting**: Server Components por defecto
5. ✅ **Bundle Analyzer**: Configurado y listo para usar
6. ✅ **Web Vitals**: Tracking automático con Vercel Analytics

---

## 📚 Referencias

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Supabase Query Optimization](https://supabase.com/docs/guides/database/query-optimization)

