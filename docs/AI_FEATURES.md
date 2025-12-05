# 🤖 Funcionalidades de IA Implementadas

Este documento describe todas las funcionalidades de IA y mejoras de producción implementadas en VLOCKSTER.

## ✅ Funcionalidades Implementadas

### 1. ✨ Generador de Descripciones con IA
**Archivos:**
- `lib/ai/description-generator.ts`
- `app/api/projects/generate-description/route.ts`
- `app/projects/create/page.tsx` (botón agregado)

**Qué hace:**
- Genera descripciones convincentes para proyectos de crowdfunding
- Optimiza para conversión (motivar backings)
- Usa contexto: título, meta, deadline, recompensas
- El usuario puede editar después

**Cómo usar:**
1. Ir a `/projects/create`
2. Completar título, meta y deadline
3. Clic en "✨ Generar con IA"
4. Esperar 3-5 segundos
5. La descripción se llena automáticamente

**Costo:** ~$0.00007 por descripción

---

### 2. 🛡️ Moderación Automática de Comentarios
**Archivos:**
- `lib/ai/comment-moderator.ts`
- `app/api/comments/create/route.ts` (integrado)

**Qué hace:**
- Analiza cada comentario antes de publicarlo
- Detecta: spam, toxicidad, hate speech, contenido inapropiado
- Clasifica: safe → aprueba, moderate → revisión, severe → elimina
- Considera historial del autor (reincidentes se banean)

**Cómo funciona:**
1. Usuario escribe comentario
2. Se analiza con DeepSeek antes de guardar
3. Si es "safe" → se publica inmediatamente
4. Si es "moderate" → se marca para revisión humana
5. Si es "severe" → se rechaza y se notifica al usuario

**Costo:** ~$0.00004 por comentario

---

### 3. 🎯 Sistema de Recomendaciones Inteligentes
**Archivos:**
- `lib/ai/recommendations.ts`
- `app/api/recommendations/route.ts`

**Qué hace:**
- Analiza historial de visualización del usuario
- Genera 10 recomendaciones personalizadas
- Considera: género, creator, popularidad, novedad
- Explica por qué cada recomendación

**Cómo usar:**
```typescript
// Desde frontend
const response = await fetch('/api/recommendations')
const { recommendations, insights } = await response.json()
```

**Costo:** ~$0.0002 por usuario

---

### 4. 💰 Webhook de PayPal
**Archivos:**
- `app/api/paypal/webhook/route.ts`

**Qué hace:**
- Valida firma del webhook de PayPal
- Procesa pagos completados/cancelados automáticamente
- Actualiza estado de backings en Supabase
- Detecta cuando proyecto alcanza su meta
- Marca proyecto como "funded" automáticamente

**Configuración:**
1. Ir a https://developer.paypal.com/dashboard
2. Crear app y obtener Webhook ID
3. Configurar URL: `https://tu-dominio.com/api/paypal/webhook`
4. Seleccionar eventos: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.CANCELLED`
5. Agregar a `.env.local`:
   ```bash
   PAYPAL_WEBHOOK_SECRET=tu-webhook-secret
   PAYPAL_WEBHOOK_ID=tu-webhook-id
   ```

---

### 5. 🔔 Sistema de Notificaciones Inteligentes
**Archivos:**
- `lib/notifications/notifier.ts`

**Qué hace:**
- Envía notificaciones por múltiples canales (email, push, in-app)
- Gestiona templates personalizados
- Agrupa notificaciones para evitar spam
- Tipos: project_funded, new_backing, deadline_reminder, etc.

**Cómo usar:**
```typescript
import { sendNotification } from '@/lib/notifications/notifier'

await sendNotification(
  userId,
  'new_backing',
  ['email', 'push', 'in_app'],
  {
    project_title: 'Mi Película',
    amount: 50
  }
)
```

---

### 6. 📊 Analytics para Creators
**Archivos:**
- `app/api/analytics/creator/route.ts`

**Qué hace:**
- Agrega métricas de videos, proyectos y backings
- Calcula: views, engagement, revenue, conversión
- Proporciona datos para dashboards

**Cómo usar:**
```typescript
// GET /api/analytics/creator?creator_id=123&days=30
const response = await fetch('/api/analytics/creator?days=30')
const analytics = await response.json()
```

**Retorna:**
- Métricas de videos (views, likes, promedio)
- Métricas de proyectos (activos, fundados, revenue)
- Métricas de backings (total, promedio)
- Engagement (likes, comentarios)

---

### 7. 🔍 Autocompletado de Búsqueda
**Archivos:**
- `app/api/search/suggestions/route.ts`

**Qué hace:**
- Genera sugerencias mientras el usuario escribe
- Busca en títulos de videos y proyectos
- Mejora UX de búsqueda

**Cómo usar:**
```typescript
// GET /api/search/suggestions?q=drama
const response = await fetch('/api/search/suggestions?q=drama')
const { suggestions } = await response.json()
```

---

## 📋 Tablas de Supabase Necesarias

Para que todas las funcionalidades funcionen completamente, necesitas estas tablas:

```sql
-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT NOT NULL,
  title TEXT,
  body TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de cola de moderación
CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  severity TEXT NOT NULL,
  reasons TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de logs de moderación
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  severity TEXT NOT NULL,
  reasons TEXT[],
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar columna de estado de moderación a comments (si no existe)
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending_review';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_created ON moderation_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_user ON moderation_logs(user_id, created_at DESC);
```

---

## 🔑 Variables de Entorno

Agrega a tu `.env.local`:

```bash
# DeepSeek API (ya configurada)
DEEPSEEK_API_KEY=sk-d7872d14750148c0808e28fbd12d7014

# PayPal Webhook (configurar en PayPal Dashboard)
PAYPAL_WEBHOOK_SECRET=tu-webhook-secret
PAYPAL_WEBHOOK_ID=tu-webhook-id
```

---

## 💰 Costos Estimados

| Funcionalidad | Costo por uso | Uso típico mensual | Costo mensual |
|--------------|---------------|-------------------|---------------|
| Generador de descripciones | $0.00007 | 100 proyectos | $0.007 |
| Moderación de comentarios | $0.00004 | 1,000 comentarios | $0.04 |
| Recomendaciones | $0.0002 | 500 usuarios | $0.10 |
| **TOTAL** | - | - | **~$0.15/mes** |

Muy económico para el valor que proporciona.

---

## 🚀 Próximos Pasos

1. ✅ Ejecutar migraciones SQL para crear tablas
2. ✅ Configurar PayPal Webhook en dashboard
3. ✅ Probar cada funcionalidad individualmente
4. ✅ Integrar recomendaciones en frontend
5. ✅ Agregar dashboard de analytics para creators
6. ✅ Configurar notificaciones push (OneSignal/Firebase)

---

## 📚 Documentación Adicional

- [DeepSeek API Docs](https://api.deepseek.com)
- [PayPal Webhooks](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**Última actualización:** Diciembre 2024

