#!/usr/bin/env tsx
/**
 * 🚀 VLOCKSTER Production Deployment Script
 * 
 * Automatiza todo el proceso de deploy a producción:
 * 1. Verifica/instala Vercel CLI
 * 2. Agrega dominio en Vercel
 * 3. Configura DNS en Cloudflare (vía API)
 * 4. Configura SSL/TLS en Cloudflare
 * 5. Configura variables de entorno en Vercel
 * 6. Hace deploy a producción
 * 
 * Uso:
 *   tsx scripts/deploy-production.ts
 *   o
 *   chmod +x scripts/deploy-production.ts && ./scripts/deploy-production.ts
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import * as readline from 'readline';

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command: string, silent = false): string {
  try {
    return execSync(command, { 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
    }).toString();
  } catch (error: any) {
    if (!silent) {
      log(`Error ejecutando: ${command}`, 'red');
      log(error.message, 'red');
    }
    throw error;
  }
}

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function checkVercelCLI(): Promise<boolean> {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function installVercelCLI(): Promise<void> {
  log('📦 Instalando Vercel CLI...', 'yellow');
  exec('npm install -g vercel');
  log('✅ Vercel CLI instalado', 'green');
}

async function checkVercelAuth(): Promise<boolean> {
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function loginVercel(): Promise<void> {
  log('🔐 Iniciando sesión en Vercel...', 'yellow');
  exec('vercel login');
}

async function getCloudflareZoneId(domain: string, apiToken: string): Promise<string> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones?name=${domain}`,
    {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  if (!data.success || data.result.length === 0) {
    throw new Error(`No se encontró el dominio ${domain} en Cloudflare`);
  }

  return data.result[0].id;
}

async function createDNSRecord(
  zoneId: string,
  apiToken: string,
  type: 'CNAME' | 'A',
  name: string,
  content: string,
  proxied: boolean = true
): Promise<void> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        name,
        content,
        ttl: 1, // Auto
        proxied,
      }),
    }
  );

  const data = await response.json();
  if (!data.success) {
    if (data.errors?.[0]?.code === 81057) {
      // Record already exists
      log(`⚠️  Registro DNS ${name} ya existe, omitiendo...`, 'yellow');
      return;
    }
    throw new Error(`Error creando DNS record: ${JSON.stringify(data.errors)}`);
  }

  log(`✅ DNS record creado: ${name} → ${content}`, 'green');
}

async function updateSSLMode(zoneId: string, apiToken: string, mode: 'full' | 'strict'): Promise<void> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/settings/ssl`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: mode === 'strict' ? 'full' : mode,
      }),
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(`Error actualizando SSL mode: ${JSON.stringify(data.errors)}`);
  }

  log(`✅ SSL/TLS configurado en modo: ${mode === 'strict' ? 'Full (strict)' : mode}`, 'green');
}

async function enableAlwaysHTTPS(zoneId: string, apiToken: string): Promise<void> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/settings/always_use_https`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: 'on',
      }),
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(`Error habilitando Always HTTPS: ${JSON.stringify(data.errors)}`);
  }

  log('✅ Always Use HTTPS habilitado', 'green');
}

async function addVercelEnvVar(name: string, value: string, environment: 'production' | 'preview' | 'development' = 'production'): Promise<void> {
  try {
    // Remove existing
    execSync(`vercel env rm ${name} ${environment} --yes`, { stdio: 'pipe' });
  } catch {
    // Ignore if doesn't exist
  }

  // Add new
  execSync(`echo "${value}" | vercel env add ${name} ${environment}`, { stdio: 'inherit' });
  log(`✅ Variable ${name} configurada para ${environment}`, 'green');
}

async function main() {
  log('\n🚀 VLOCKSTER Production Deployment', 'bold');
  log('===================================\n', 'bold');

  // Step 1: Check Vercel CLI
  log('📋 Paso 1: Verificando Vercel CLI...', 'cyan');
  if (!(await checkVercelCLI())) {
    log('❌ Vercel CLI no encontrado', 'red');
    const install = await question('¿Instalar Vercel CLI? (y/n): ');
    if (install.toLowerCase() === 'y') {
      await installVercelCLI();
    } else {
      log('❌ Se requiere Vercel CLI para continuar', 'red');
      process.exit(1);
    }
  } else {
    const version = execSync('vercel --version', { encoding: 'utf-8' }).trim();
    log(`✅ Vercel CLI encontrado: ${version}`, 'green');
  }

  // Step 2: Check Vercel Auth
  log('\n📋 Paso 2: Verificando autenticación en Vercel...', 'cyan');
  if (!(await checkVercelAuth())) {
    log('❌ No estás autenticado en Vercel', 'red');
    await loginVercel();
  } else {
    const user = execSync('vercel whoami', { encoding: 'utf-8' }).trim();
    log(`✅ Autenticado como: ${user}`, 'green');
  }

  // Step 3: Get configuration
  log('\n📋 Paso 3: Configuración del deploy...', 'cyan');
  
  const domain = await question('🌐 Dominio (ej: vlockster.com): ');
  if (!domain) {
    log('❌ Dominio requerido', 'red');
    process.exit(1);
  }

  const useCloudflare = await question('☁️  ¿Usar Cloudflare API para configurar DNS automáticamente? (y/n): ');
  let cloudflareApiToken: string | null = null;
  let cloudflareZoneId: string | null = null;

  if (useCloudflare.toLowerCase() === 'y') {
    cloudflareApiToken = await question('🔑 Cloudflare API Token: ');
    if (!cloudflareApiToken) {
      log('❌ Cloudflare API Token requerido', 'red');
      process.exit(1);
    }

    try {
      cloudflareZoneId = await getCloudflareZoneId(domain, cloudflareApiToken);
      log(`✅ Dominio encontrado en Cloudflare (Zone ID: ${cloudflareZoneId})`, 'green');
    } catch (error: any) {
      log(`❌ Error: ${error.message}`, 'red');
      log('⚠️  Continuando sin configuración automática de Cloudflare...', 'yellow');
      cloudflareApiToken = null;
    }
  }

  // Step 4: Add domain to Vercel
  log('\n📋 Paso 4: Agregando dominio en Vercel...', 'cyan');
  try {
    exec(`vercel domains add ${domain}`, true);
    log(`✅ Dominio ${domain} agregado en Vercel`, 'green');
  } catch (error: any) {
    if (error.message.includes('already exists') || error.message.includes('already configured')) {
      log(`⚠️  Dominio ${domain} ya está configurado en Vercel`, 'yellow');
    } else {
      log(`⚠️  Error agregando dominio: ${error.message}`, 'yellow');
      log('💡 Continúa manualmente en Vercel Dashboard si es necesario', 'blue');
    }
  }

  // Get DNS instructions from Vercel
  log('\n📋 Obteniendo instrucciones DNS de Vercel...', 'cyan');
  try {
    exec(`vercel domains inspect ${domain}`);
  } catch {
    log('⚠️  No se pudieron obtener instrucciones DNS automáticamente', 'yellow');
  }

  // Step 5: Configure Cloudflare DNS
  if (cloudflareApiToken && cloudflareZoneId) {
    log('\n📋 Paso 5: Configurando DNS en Cloudflare...', 'cyan');
    
    try {
      // Create CNAME for root domain
      await createDNSRecord(
        cloudflareZoneId,
        cloudflareApiToken,
        'CNAME',
        '@',
        'cname.vercel-dns.com',
        true // Proxied
      );

      // Create CNAME for www
      await createDNSRecord(
        cloudflareZoneId,
        cloudflareApiToken,
        'CNAME',
        'www',
        'cname.vercel-dns.com',
        true // Proxied
      );

      log('✅ DNS configurado en Cloudflare', 'green');
    } catch (error: any) {
      log(`❌ Error configurando DNS: ${error.message}`, 'red');
    }

    // Step 6: Configure SSL/TLS
    log('\n📋 Paso 6: Configurando SSL/TLS en Cloudflare...', 'cyan');
    try {
      await updateSSLMode(cloudflareZoneId, cloudflareApiToken, 'strict');
      await enableAlwaysHTTPS(cloudflareZoneId, cloudflareApiToken);
      log('✅ SSL/TLS configurado', 'green');
    } catch (error: any) {
      log(`⚠️  Error configurando SSL: ${error.message}`, 'yellow');
      log('💡 Configura manualmente en Cloudflare Dashboard: SSL/TLS → Full (strict)', 'blue');
    }
  } else {
    log('\n📋 Paso 5: Configuración manual de DNS requerida', 'yellow');
    log('💡 Ve a Cloudflare Dashboard y configura:', 'blue');
    log('   - CNAME @ → cname.vercel-dns.com (Proxied)', 'blue');
    log('   - CNAME www → cname.vercel-dns.com (Proxied)', 'blue');
    log('   - SSL/TLS → Full (strict)', 'blue');
    log('   - Always Use HTTPS → ON', 'blue');
  }

  // Step 7: Environment Variables
  log('\n📋 Paso 7: Configurando variables de entorno...', 'cyan');
  const setupEnv = await question('🔐 ¿Configurar variables de entorno ahora? (y/n): ');
  
  if (setupEnv.toLowerCase() === 'y') {
    log('\n📝 Variables de entorno requeridas:', 'cyan');
    log('   (Presiona Enter para omitir una variable)\n', 'yellow');

    // Supabase
    const supabaseUrl = await question('NEXT_PUBLIC_SUPABASE_URL: ');
    if (supabaseUrl) await addVercelEnvVar('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl);

    const supabaseAnonKey = await question('NEXT_PUBLIC_SUPABASE_ANON_KEY: ');
    if (supabaseAnonKey) await addVercelEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey);

    const supabaseServiceKey = await question('SUPABASE_SERVICE_ROLE_KEY: ');
    if (supabaseServiceKey) await addVercelEnvVar('SUPABASE_SERVICE_ROLE_KEY', supabaseServiceKey);

    const supabaseProjectId = await question('NEXT_PUBLIC_SUPABASE_PROJECT_ID: ');
    if (supabaseProjectId) await addVercelEnvVar('NEXT_PUBLIC_SUPABASE_PROJECT_ID', supabaseProjectId);

    // Cloudflare Stream
    const cfAccountId = await question('CLOUDFLARE_ACCOUNT_ID: ');
    if (cfAccountId) {
      await addVercelEnvVar('CLOUDFLARE_ACCOUNT_ID', cfAccountId);
      await addVercelEnvVar('NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID', cfAccountId);
    }

    const cfApiToken = await question('CLOUDFLARE_API_TOKEN: ');
    if (cfApiToken) await addVercelEnvVar('CLOUDFLARE_API_TOKEN', cfApiToken);

    // PayPal (optional)
    const paypalClientId = await question('NEXT_PUBLIC_PAYPAL_CLIENT_ID (opcional): ');
    if (paypalClientId) await addVercelEnvVar('NEXT_PUBLIC_PAYPAL_CLIENT_ID', paypalClientId);

    const paypalSecret = await question('PAYPAL_CLIENT_SECRET (opcional): ');
    if (paypalSecret) await addVercelEnvVar('PAYPAL_CLIENT_SECRET', paypalSecret);

    const paypalMode = await question('PAYPAL_MODE (sandbox/live, default: sandbox): ');
    if (paypalMode) {
      await addVercelEnvVar('PAYPAL_MODE', paypalMode);
    } else {
      await addVercelEnvVar('PAYPAL_MODE', 'sandbox');
    }

    // App URL
    await addVercelEnvVar('NEXT_PUBLIC_APP_URL', `https://${domain}`);

    log('\n✅ Variables de entorno configuradas', 'green');
  } else {
    log('⚠️  Omitiendo configuración de variables de entorno', 'yellow');
    log('💡 Configúralas manualmente en Vercel Dashboard', 'blue');
  }

  // Step 8: Deploy
  log('\n📋 Paso 8: Deploy a producción...', 'cyan');
  const deploy = await question('🚀 ¿Hacer deploy ahora? (y/n): ');
  
  if (deploy.toLowerCase() === 'y') {
    log('🚀 Desplegando a producción...', 'yellow');
    exec('vercel --prod --yes');
    log('✅ Deploy completado', 'green');
  } else {
    log('⚠️  Deploy omitido', 'yellow');
    log('💡 Ejecuta: vercel --prod --yes', 'blue');
  }

  // Summary
  log('\n🎉 ¡Configuración completada!', 'green');
  log('===================================\n', 'bold');
  log('📋 Resumen:', 'cyan');
  log(`   - Dominio: https://${domain}`, 'blue');
  log(`   - Vercel Dashboard: https://vercel.com/dashboard`, 'blue');
  log(`   - Cloudflare Dashboard: https://dash.cloudflare.com`, 'blue');
  log('\n✅ Próximos pasos:', 'cyan');
  log('   1. Espera 5-10 minutos para propagación DNS', 'yellow');
  log('   2. Verifica que el sitio carga correctamente', 'yellow');
  log('   3. Verifica SSL/HTTPS está activo', 'yellow');
  log('   4. Revisa logs en Vercel si hay problemas', 'yellow');
  log('\n🌐 Tu app estará disponible en:', 'green');
  log(`   https://${domain}\n`, 'bold');
}

// Run
main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});

