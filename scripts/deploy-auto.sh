#!/bin/bash
# 🚀 VLOCKSTER Auto-Deployment Script
# Ejecuta el script de deployment con respuestas automáticas

set -e

echo "🚀 VLOCKSTER Auto-Deployment"
echo "============================"
echo ""

# Configuración (puedes modificar estos valores)
DOMAIN="${VLOCKSTER_DOMAIN:-vlockster.com}"
USE_CLOUDFLARE="${USE_CLOUDFLARE_AUTO:-n}"
CLOUDFLARE_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
SKIP_ENV="${SKIP_ENV_SETUP:-n}"
SKIP_DEPLOY="${SKIP_DEPLOY:-n}"

echo "📋 Configuración:"
echo "   - Dominio: $DOMAIN"
echo "   - Cloudflare Auto: $USE_CLOUDFLARE"
echo "   - Skip Env Setup: $SKIP_ENV_SETUP"
echo "   - Skip Deploy: $SKIP_DEPLOY"
echo ""

# Crear archivo temporal con respuestas
TMPFILE=$(mktemp)
cat > "$TMPFILE" <<EOF
$DOMAIN
$USE_CLOUDFLARE
$CLOUDFLARE_TOKEN
$SKIP_ENV
$SKIP_DEPLOY
EOF

echo "🚀 Ejecutando script de deployment..."
echo ""

# Ejecutar script con respuestas automáticas
cat "$TMPFILE" | tsx scripts/deploy-production.ts || {
    echo ""
    echo "⚠️  El script requiere input interactivo."
    echo "💡 Ejecuta manualmente: pnpm deploy:prod"
    echo "   O configura las variables de entorno:"
    echo "   - VLOCKSTER_DOMAIN=vlockster.com"
    echo "   - USE_CLOUDFLARE_AUTO=y"
    echo "   - CLOUDFLARE_API_TOKEN=tu-token"
    rm "$TMPFILE"
    exit 1
}

rm "$TMPFILE"

echo ""
echo "✅ Auto-deployment completado!"

