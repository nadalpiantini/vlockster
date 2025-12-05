#!/usr/bin/env node

/**
 * Ejecuta migraciones usando la Management API de Supabase
 * Requiere: SUPABASE_ACCESS_TOKEN (obtener de Supabase Dashboard > Account Settings > Access Tokens)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Cargar .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local no existe');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match && !match[1].startsWith('#')) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const PROJECT_REF = 'nqzhxukuvmdlpewqytpv';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || envVars.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ SUPABASE_ACCESS_TOKEN no está configurado');
  console.error('');
  console.error('💡 Para obtener el token:');
  console.error('   1. Ve a: https://supabase.com/dashboard/account/tokens');
  console.error('   2. Crea un nuevo access token');
  console.error('   3. Agrégalo a .env.local como: SUPABASE_ACCESS_TOKEN=tu_token');
  console.error('   4. O exporta: export SUPABASE_ACCESS_TOKEN=tu_token');
  console.error('');
  console.error('📋 Alternativa: Ejecuta manualmente en SQL Editor:');
  console.error(`   https://supabase.com/dashboard/project/${PROJECT_REF}/sql`);
  process.exit(1);
}

console.log('🚀 Ejecutando migraciones usando Management API...');
console.log(`📦 Proyecto: ${PROJECT_REF}`);
console.log('');

// Lista de migraciones
const migrations = [
  'supabase/vlockster_00_schema.sql',
  'supabase/vlockster_01_auth_profiles.sql',
  'supabase/vlockster_02_creator_requests.sql',
  'supabase/vlockster_03_videos.sql',
  'supabase/vlockster_04_projects.sql',
  'supabase/vlockster_05_communities.sql',
  'supabase/vlockster_06_moderation.sql',
  'supabase/vlockster_07_rls_policies.sql',
  'supabase/vlockster_08_triggers.sql',
];

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    // Management API endpoint para ejecutar SQL
    const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;
    
    const data = JSON.stringify({ query: sql });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          try {
            const error = JSON.parse(body);
            reject(new Error(`HTTP ${res.statusCode}: ${error.message || body}`));
          } catch {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runMigrations() {
  for (const migration of migrations) {
    const filePath = path.join(__dirname, '..', migration);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${migration}`);
      continue;
    }

    console.log(`📄 Ejecutando: ${migration}`);
    
    try {
      const sql = fs.readFileSync(filePath, 'utf8');
      await executeSQL(sql);
      console.log(`✅ Completado: ${migration}\n`);
    } catch (error) {
      console.error(`❌ Error ejecutando ${migration}:`, error.message);
      
      // Si es un error de autenticación, dar instrucciones
      if (error.message.includes('401') || error.message.includes('403')) {
        console.error('');
        console.error('💡 El token de acceso no es válido o no tiene permisos');
        console.error('   Verifica que el token tenga permisos de "Database Admin"');
      }
      
      // Continuar con el siguiente archivo
      console.log('');
    }
  }

  console.log('🎉 Proceso completado');
  console.log('');
  console.log('📝 Regenerando tipos de TypeScript...');
  const { execSync } = require('child_process');
  try {
    execSync('pnpm supabase:types', { stdio: 'inherit' });
  } catch {
    console.log('⚠️  No se pudieron regenerar los tipos automáticamente');
    console.log('💡 Ejecuta manualmente: pnpm supabase:types');
  }
}

runMigrations().catch(console.error);

