#!/bin/bash

# Script para ejecutar migraciones usando psql directamente
# Uso: ./scripts/run-migrations-psql.sh

set -e

echo "🚀 Ejecutando migraciones de Supabase con psql..."
echo ""

# Verificar que existe .env.local
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local no existe"
    exit 1
fi

# Cargar variables de entorno
export $(cat .env.local | grep -v '^#' | xargs)

# Verificar variables necesarias
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL no está configurada"
    exit 1
fi

if [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo "⚠️  SUPABASE_DB_PASSWORD no está configurada"
    echo "💡 Necesitas la contraseña de la base de datos de Supabase"
    echo "   Puedes obtenerla en: Supabase Dashboard > Settings > Database > Connection string"
    echo ""
    read -sp "Ingresa la contraseña de la base de datos: " DB_PASSWORD
    echo ""
    export SUPABASE_DB_PASSWORD="$DB_PASSWORD"
fi

# Extraer información de la URL
# NEXT_PUBLIC_SUPABASE_URL es algo como: https://xxxxx.supabase.co
# Necesitamos construir la connection string para psql
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')
DB_HOST="${PROJECT_REF}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

echo "📦 Conectando a: $DB_HOST"
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

# Verificar si psql está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ psql no está instalado"
    echo ""
    echo "💡 Instala PostgreSQL:"
    echo "   brew install postgresql"
    echo ""
    echo "📋 Alternativa: Ejecuta las migraciones manualmente en el SQL Editor de Supabase:"
    echo "   https://supabase.com/dashboard/project/$NEXT_PUBLIC_SUPABASE_PROJECT_ID/sql"
    echo ""
    for i in "${!MIGRATIONS[@]}"; do
        echo "   $((i+1)). ${MIGRATIONS[$i]}"
    done
    exit 1
fi

# Ejecutar migraciones
for migration in "${MIGRATIONS[@]}"; do
    if [ -f "$migration" ]; then
        echo "📄 Ejecutando: $migration"
        PGPASSWORD="$SUPABASE_DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration" || {
            echo "❌ Error ejecutando $migration"
            echo "💡 Verifica la contraseña y los permisos"
            exit 1
        }
        echo "✅ Completado: $migration"
        echo ""
    else
        echo "⚠️  Archivo no encontrado: $migration"
    fi
done

echo "🎉 Todas las migraciones ejecutadas exitosamente"
echo ""
echo "📝 Regenerando tipos de TypeScript..."
pnpm supabase:types || echo "⚠️  No se pudieron regenerar los tipos automáticamente"

