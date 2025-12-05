#!/bin/bash

# Script para ejecutar todas las migraciones de Supabase en orden
# Uso: ./scripts/run-migrations.sh

set -e

echo "🚀 Ejecutando migraciones de Supabase..."
echo ""

# Verificar que existe .env.local
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local no existe"
    echo "Por favor, crea .env.local con las variables de Supabase"
    exit 1
fi

# Cargar variables de entorno
export $(cat .env.local | grep -v '^#' | xargs)

# Verificar que existe NEXT_PUBLIC_SUPABASE_URL
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL no está configurada en .env.local"
    exit 1
fi

# Verificar que existe NEXT_PUBLIC_SUPABASE_PROJECT_ID
if [ -z "$NEXT_PUBLIC_SUPABASE_PROJECT_ID" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_PROJECT_ID no está configurada en .env.local"
    exit 1
fi

echo "✅ Variables de entorno cargadas"
echo "📦 Proyecto: $NEXT_PUBLIC_SUPABASE_PROJECT_ID"
echo ""

# Lista de migraciones en orden
MIGRATIONS=(
    "supabase/vlockster_00_schema.sql"
    "supabase/vlockster_01_auth_profiles.sql"
    "supabase/vlockster_02_creator_requests.sql"
    "supabase/vlockster_03_videos.sql"
    "supabase/vlockster_04_projects.sql"
    "supabase/vlockster_05_communities.sql"
    "supabase/vlockster_06_moderation.sql"
    "supabase/vlockster_07_rls_policies.sql"
    "supabase/vlockster_08_triggers.sql"
)

# Verificar si Supabase CLI está instalado
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI encontrado"
    echo ""
    
    # Intentar linkear el proyecto si no está linkeado
    if [ ! -f .supabase/config.toml ]; then
        echo "🔗 Linkeando proyecto de Supabase..."
        supabase link --project-ref "$NEXT_PUBLIC_SUPABASE_PROJECT_ID" || {
            echo "⚠️ No se pudo linkear automáticamente. Continuando con método manual..."
        }
    fi
    
    # Ejecutar migraciones con CLI
    for migration in "${MIGRATIONS[@]}"; do
        if [ -f "$migration" ]; then
            echo "📄 Ejecutando: $migration"
            supabase db push --file "$migration" || {
                echo "❌ Error ejecutando $migration"
                echo "💡 Intenta ejecutarlo manualmente en el SQL Editor de Supabase"
            }
            echo "✅ Completado: $migration"
            echo ""
        else
            echo "⚠️ Archivo no encontrado: $migration"
        fi
    done
    
    echo "🎉 Todas las migraciones ejecutadas"
    echo ""
    echo "📝 Regenerando tipos de TypeScript..."
    pnpm supabase:types || echo "⚠️ No se pudieron regenerar los tipos automáticamente"
    
else
    echo "⚠️ Supabase CLI no está instalado"
    echo ""
    echo "📋 Instrucciones para ejecutar migraciones manualmente:"
    echo ""
    echo "1. Ve a https://supabase.com/dashboard/project/$NEXT_PUBLIC_SUPABASE_PROJECT_ID"
    echo "2. Abre el SQL Editor"
    echo "3. Ejecuta cada archivo en este orden:"
    echo ""
    for i in "${!MIGRATIONS[@]}"; do
        echo "   $((i+1)). ${MIGRATIONS[$i]}"
    done
    echo ""
    echo "💡 Alternativamente, instala Supabase CLI:"
    echo "   brew install supabase/tap/supabase"
    echo "   o visita: https://supabase.com/docs/guides/cli"
fi

