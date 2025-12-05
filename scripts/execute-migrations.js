#!/usr/bin/env node

/**
 * Script para ejecutar migraciones de Supabase usando la API REST
 * Uso: node scripts/execute-migrations.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Cargar variables de entorno desde .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local no existe');
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

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_ID = envVars.NEXT_PUBLIC_SUPABASE_PROJECT_ID || SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Variables de Supabase no configuradas en .env.local');
  console.error('   Necesitas: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🚀 Ejecutando migraciones de Supabase...');
console.log(`📦 Proyecto: ${PROJECT_ID || 'N/A'}`);
console.log('');

// Lista de migraciones en orden
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
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
    
    const data = JSON.stringify({ query: sql });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
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
      
      // La API REST de Supabase no tiene un endpoint directo para ejecutar SQL arbitrario
      // Necesitamos usar psql o el SQL Editor
      console.log(`   ⚠️  No se puede ejecutar directamente con la API REST`);
      console.log(`   💡 Ejecuta este archivo manualmente en el SQL Editor de Supabase:`);
      console.log(`      https://supabase.com/dashboard/project/${PROJECT_ID}/sql`);
      console.log(`      Archivo: ${filePath}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error leyendo ${migration}:`, error.message);
      process.exit(1);
    }
  }

  console.log('📋 Instrucciones:');
  console.log('');
  console.log('1. Ve al SQL Editor de Supabase:');
  console.log(`   https://supabase.com/dashboard/project/${PROJECT_ID}/sql`);
  console.log('');
  console.log('2. Ejecuta cada archivo en este orden:');
  migrations.forEach((m, i) => {
    console.log(`   ${i + 1}. ${m}`);
  });
  console.log('');
  console.log('3. Después de ejecutar todas, regenera los tipos:');
  console.log('   pnpm supabase:types');
}

runMigrations().catch(console.error);

