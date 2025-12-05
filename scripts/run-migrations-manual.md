# 📋 Ejecutar Migraciones Manualmente en Supabase

Si no puedes usar el CLI o psql, ejecuta las migraciones manualmente en el SQL Editor de Supabase.

## Pasos

1. **Ve al SQL Editor de Supabase:**
   - Abre: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
   - O ve a: Dashboard > SQL Editor

2. **Ejecuta cada archivo en este orden exacto:**

   ```sql
   -- 1. Schema base
   -- Copia y pega el contenido de: supabase/vlockster_00_schema.sql
   
   -- 2. Auth y perfiles
   -- Copia y pega el contenido de: supabase/vlockster_01_auth_profiles.sql
   
   -- 3. Solicitudes de creadores
   -- Copia y pega el contenido de: supabase/vlockster_02_creator_requests.sql
   
   -- 4. Videos
   -- Copia y pega el contenido de: supabase/vlockster_03_videos.sql
   
   -- 5. Proyectos
   -- Copia y pega el contenido de: supabase/vlockster_04_projects.sql
   
   -- 6. Comunidades
   -- Copia y pega el contenido de: supabase/vlockster_05_communities.sql
   
   -- 7. Moderación
   -- Copia y pega el contenido de: supabase/vlockster_06_moderation.sql
   
   -- 8. RLS Policies
   -- Copia y pega el contenido de: supabase/vlockster_07_rls_policies.sql
   
   -- 9. Triggers
   -- Copia y pega el contenido de: supabase/vlockster_08_triggers.sql
   ```

3. **Después de ejecutar todas las migraciones:**
   ```bash
   pnpm supabase:types
   ```

## Verificar que funcionó

Deberías ver estas tablas en Supabase Dashboard > Table Editor:
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

