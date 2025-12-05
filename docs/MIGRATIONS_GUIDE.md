# 🗄️ Guía de Ejecución de Migraciones

## Método Recomendado: SQL Editor de Supabase

### Paso 1: Abre el SQL Editor
1. Ve a: https://supabase.com/dashboard/project/nqzhxukuvmdlpewqytpv/sql
2. O navega: Dashboard > SQL Editor

### Paso 2: Ejecuta las Migraciones

**Opción A: Archivo Combinado (Más Rápido)**
1. Abre el archivo: `scripts/run-all-migrations.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor
4. Haz clic en "Run" o presiona `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

**Opción B: Archivos Individuales (Más Control)**
Ejecuta cada archivo en este orden exacto:

1. `supabase/vlockster_00_schema.sql` - Schema base
2. `supabase/vlockster_01_auth_profiles.sql` - Perfiles de usuario
3. `supabase/vlockster_02_creator_requests.sql` - Solicitudes de creadores
4. `supabase/vlockster_03_videos.sql` - Tablas de videos
5. `supabase/vlockster_04_projects.sql` - Proyectos de crowdfunding
6. `supabase/vlockster_05_communities.sql` - Comunidades
7. `supabase/vlockster_06_moderation.sql` - Sistema de moderación
8. `supabase/vlockster_07_rls_policies.sql` - Políticas de seguridad (RLS)
9. `supabase/vlockster_08_triggers.sql` - Triggers de base de datos

### Paso 3: Verificar

Después de ejecutar, verifica que estas tablas existen:
- `profiles`
- `creator_requests`
- `videos`
- `video_metrics`
- `projects`
- `rewards`
- `backings`
- `communities`
- `posts`
- `comments`
- `notifications`
- `reports`
- `waitlist`

Ve a: Dashboard > Table Editor

### Paso 4: Regenerar Tipos TypeScript

```bash
pnpm supabase:types
```

Esto actualizará `types/database.types.ts` con los tipos de tu base de datos.

---

## Método Alternativo: psql (Línea de Comandos)

Si tienes `psql` instalado y la contraseña de la base de datos:

```bash
# Obtén la connection string de Supabase Dashboard > Settings > Database
# Formato: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

export PGPASSWORD="tu_contraseña"
psql -h nqzhxukuvmdlpewqytpv.supabase.co -p 5432 -U postgres -d postgres -f supabase/vlockster_00_schema.sql
# Repite para cada archivo...
```

---

## Solución de Problemas

### Error: "relation already exists"
- Algunas tablas ya existen. Esto es normal si ejecutaste migraciones parcialmente.
- Puedes ignorar estos errores o eliminar las tablas existentes primero.

### Error: "permission denied"
- Asegúrate de usar el SQL Editor (no la API REST)
- O usa la contraseña del usuario `postgres` (no la anon key)

### Error: "extension already exists"
- Las extensiones ya están instaladas. Esto es normal.

---

## Estado Actual

- ✅ Proyecto linkeado: `nqzhxukuvmdlpewqytpv`
- ⚠️ Migraciones pendientes: 9 archivos
- 📝 Archivo combinado: `scripts/run-all-migrations.sql`

