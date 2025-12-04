#!/bin/bash
# 🚀 VLOCKSTER Production Deployment Script (Bash version)
# 
# Automatiza el deploy a producción usando Vercel CLI
# Para configuración completa con Cloudflare, usa deploy-production.ts

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${BOLD}🚀 VLOCKSTER Production Deployment${NC}"
echo -e "${BOLD}===================================${NC}\n"

# Check Vercel CLI
echo -e "${CYAN}📋 Paso 1: Verificando Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI no encontrado${NC}"
    read -p "¿Instalar Vercel CLI? (y/n): " install
    if [[ $install == [Yy]* ]]; then
        echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI instalado${NC}"
    else
        echo -e "${RED}❌ Se requiere Vercel CLI para continuar${NC}"
        exit 1
    fi
else
    VERSION=$(vercel --version)
    echo -e "${GREEN}✅ Vercel CLI encontrado: $VERSION${NC}"
fi

# Check Vercel Auth
echo -e "\n${CYAN}📋 Paso 2: Verificando autenticación...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ No estás autenticado en Vercel${NC}"
    vercel login
else
    USER=$(vercel whoami)
    echo -e "${GREEN}✅ Autenticado como: $USER${NC}"
fi

# Get domain
echo -e "\n${CYAN}📋 Paso 3: Configuración del deploy...${NC}"
read -p "🌐 Dominio (ej: vlockster.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Dominio requerido${NC}"
    exit 1
fi

# Add domain to Vercel
echo -e "\n${CYAN}📋 Paso 4: Agregando dominio en Vercel...${NC}"
vercel domains add "$DOMAIN" 2>/dev/null || echo -e "${YELLOW}⚠️  Dominio ya configurado o error (continúa manualmente si es necesario)${NC}"

# Get DNS instructions
echo -e "\n${CYAN}📋 Obteniendo instrucciones DNS de Vercel...${NC}"
vercel domains inspect "$DOMAIN" || echo -e "${YELLOW}⚠️  No se pudieron obtener instrucciones automáticamente${NC}"

# Environment variables
echo -e "\n${CYAN}📋 Paso 5: Variables de entorno...${NC}"
read -p "🔐 ¿Configurar variables de entorno ahora? (y/n): " setup_env

if [[ $setup_env == [Yy]* ]]; then
    echo -e "\n${CYAN}📝 Variables de entorno (presiona Enter para omitir):${NC}\n"
    
    read -p "NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
    [ -n "$SUPABASE_URL" ] && echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
    
    read -p "NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
    [ -n "$SUPABASE_ANON_KEY" ] && echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
    
    read -p "SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_KEY
    [ -n "$SUPABASE_SERVICE_KEY" ] && echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
    
    read -p "NEXT_PUBLIC_SUPABASE_PROJECT_ID: " SUPABASE_PROJECT_ID
    [ -n "$SUPABASE_PROJECT_ID" ] && echo "$SUPABASE_PROJECT_ID" | vercel env add NEXT_PUBLIC_SUPABASE_PROJECT_ID production
    
    read -p "CLOUDFLARE_ACCOUNT_ID: " CF_ACCOUNT_ID
    if [ -n "$CF_ACCOUNT_ID" ]; then
        echo "$CF_ACCOUNT_ID" | vercel env add CLOUDFLARE_ACCOUNT_ID production
        echo "$CF_ACCOUNT_ID" | vercel env add NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID production
    fi
    
    read -p "CLOUDFLARE_API_TOKEN: " CF_API_TOKEN
    [ -n "$CF_API_TOKEN" ] && echo "$CF_API_TOKEN" | vercel env add CLOUDFLARE_API_TOKEN production
    
    read -p "NEXT_PUBLIC_PAYPAL_CLIENT_ID (opcional): " PAYPAL_CLIENT_ID
    [ -n "$PAYPAL_CLIENT_ID" ] && echo "$PAYPAL_CLIENT_ID" | vercel env add NEXT_PUBLIC_PAYPAL_CLIENT_ID production
    
    read -p "PAYPAL_CLIENT_SECRET (opcional): " PAYPAL_SECRET
    [ -n "$PAYPAL_SECRET" ] && echo "$PAYPAL_SECRET" | vercel env add PAYPAL_CLIENT_SECRET production
    
    read -p "PAYPAL_MODE (sandbox/live, default: sandbox): " PAYPAL_MODE
    PAYPAL_MODE=${PAYPAL_MODE:-sandbox}
    echo "$PAYPAL_MODE" | vercel env add PAYPAL_MODE production
    
    # App URL
    echo "https://$DOMAIN" | vercel env add NEXT_PUBLIC_APP_URL production
    
    echo -e "\n${GREEN}✅ Variables de entorno configuradas${NC}"
else
    echo -e "${YELLOW}⚠️  Omitiendo configuración de variables${NC}"
    echo -e "${BLUE}💡 Configúralas manualmente en Vercel Dashboard${NC}"
fi

# Deploy
echo -e "\n${CYAN}📋 Paso 6: Deploy a producción...${NC}"
read -p "🚀 ¿Hacer deploy ahora? (y/n): " deploy

if [[ $deploy == [Yy]* ]]; then
    echo -e "${YELLOW}🚀 Desplegando a producción...${NC}"
    vercel --prod --yes
    echo -e "${GREEN}✅ Deploy completado${NC}"
else
    echo -e "${YELLOW}⚠️  Deploy omitido${NC}"
    echo -e "${BLUE}💡 Ejecuta: vercel --prod --yes${NC}"
fi

# Summary
echo -e "\n${GREEN}🎉 ¡Configuración completada!${NC}"
echo -e "${BOLD}===================================${NC}\n"
echo -e "${CYAN}📋 Resumen:${NC}"
echo -e "${BLUE}   - Dominio: https://$DOMAIN${NC}"
echo -e "${BLUE}   - Vercel Dashboard: https://vercel.com/dashboard${NC}"
echo -e "\n${CYAN}✅ Próximos pasos:${NC}"
echo -e "${YELLOW}   1. Configura DNS en Cloudflare (CNAME @ → cname.vercel-dns.com, Proxied)${NC}"
echo -e "${YELLOW}   2. Configura SSL/TLS en Cloudflare (Full strict)${NC}"
echo -e "${YELLOW}   3. Espera 5-10 minutos para propagación DNS${NC}"
echo -e "${YELLOW}   4. Verifica que el sitio carga correctamente${NC}"
echo -e "\n${GREEN}🌐 Tu app estará disponible en:${NC}"
echo -e "${BOLD}   https://$DOMAIN${NC}\n"

